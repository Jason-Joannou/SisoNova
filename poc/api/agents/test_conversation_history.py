import asyncio
from api.agents.gemini_agent import SisoNovaAgent
from api.db.db_manager import DatabaseManager
from api.db.query_manager import AsyncQueries
from api.services.s3_bucket import SecureS3Service
from sqlalchemy import text

async def test_simplified_workflow():
    """Test the simplified workflow without complex context management"""
    
    db_manager = DatabaseManager(db_url='sqlite+aiosqlite:///test_db.db')
    s3_bucket = SecureS3Service()
    
    async with db_manager.session_scope() as db_session:
        query_manager = AsyncQueries(session=db_session)
        
        # Clean up existing data for fresh test
        try:
            await db_session.execute(text("DELETE FROM LanguagePreference WHERE user_id IN (SELECT id FROM User WHERE phone_number = '+27798782441')"))
            await db_session.execute(text("DELETE FROM UnverifiedExpenses WHERE user_id IN (SELECT id FROM User WHERE phone_number = '+27798782441')"))
            await db_session.execute(text("DELETE FROM UnverifiedIncomes WHERE user_id IN (SELECT id FROM User WHERE phone_number = '+27798782441')"))
            await db_session.execute(text("DELETE FROM FinancialFeelings WHERE user_id IN (SELECT id FROM User WHERE phone_number = '+27798782441')"))
            await db_session.execute(text("DELETE FROM User WHERE phone_number = '+27798782441'"))
            await db_session.commit()
            print("🧹 Cleaned up existing test data")
        except Exception as e:
            print(f"⚠️ Cleanup note: {e}")
            await db_session.rollback()
        
        agent = SisoNovaAgent(
            user_id=1,
            user_phone_number="+27798782441",
            query_manager=query_manager,
            s3_bucket=s3_bucket
        )
        await agent.init_model()
        
        # Test messages for simplified workflow
        test_messages = [
            "Hi there",
            "What does SisoNova have to offer?", 
            "Yes I would like to register",
            "Yes I agree to register with SisoNova and allow you to store my data",
            "I spent R50 on groceries",  # Should save immediately and ask for feeling
            "Good",  # Should get recent transactions and update feeling
            "I earned R3000 from my job",  # Test income tracking
            "Great",  # Should get recent transactions and update income feeling
            "I spent R25 on taxi",  # Another expense
            "Worried"  # Should get recent transactions and update this expense feeling
        ]
        
        try:
            for i, message in enumerate(test_messages, 1):
                print(f"\n{'='*60}")
                print(f"Testing message {i}: {message}")
                print('='*60)
                
                result = await agent.process_message(message)
                
                # Save conversation turn
                await agent.conversation_manager.save_conversation_turn(
                    user_message=f"User message: {message}",
                    assistant_response=result.get('message', ''),
                    function_calls=result.get('function_calls', [])
                )
                print(f"✅ Conversation turn {i} saved for {agent.user_phone_number}")
                
                print(f"✅ Success: {result.get('success')}")
                print(f"📝 Message: {result.get('message', 'No message')[:300]}...")
                
                if result.get('function_calls'):
                    function_names = [fc.get('function_name') for fc in result['function_calls']]
                    print(f"🔧 Functions called: {function_names}")
                    
                    # Show function results for debugging
                    for fc in result['function_calls']:
                        if fc.get('result'):
                            print(f"   📋 {fc['function_name']} result: {fc['result']}")
                
                if 'error' in result:
                    print(f"❌ Error: {result['error']}")
                
                # Check conversation history (keep this as it's useful)
                history = await agent.s3_bucket.load_conversation_history("+27798782441")
                if history:
                    print(f"📊 Total turns in history: {history['total_turns']}")
                else:
                    print("📊 No conversation history found")
                
                # Small delay to make output readable
                await asyncio.sleep(0.5)
            
            # Final comprehensive check
            print(f"\n{'='*60}")
            print("FINAL STATE ANALYSIS")
            print('='*60)
            
            # Check final conversation history
            final_history = await agent.s3_bucket.load_conversation_history("+27798782441")
            if final_history:
                print(f"📊 Final conversation history: {final_history['total_turns']} turns")
                for i, turn in enumerate(final_history['turns'], 1):
                    print(f"\nTurn {i}:")
                    print(f"  User: {turn['user_message']}")
                    print(f"  Assistant: {turn['assistant_response'][:150]}...")
                    if turn.get('function_calls'):
                        print(f"  Functions: {[fc.get('function_name') for fc in turn['function_calls']]}")
            
            # Check database state - THIS IS THE IMPORTANT PART
            print(f"\n💾 Database state check:")
            try:
                # Check expenses
                expenses_result = await db_session.execute(text("SELECT COUNT(*) FROM UnverifiedExpenses WHERE user_id = 1"))
                expense_count = expenses_result.scalar()
                print(f"   Expenses saved: {expense_count}")
                
                # Check incomes  
                incomes_result = await db_session.execute(text("SELECT COUNT(*) FROM UnverifiedIncomes WHERE user_id = 1"))
                income_count = incomes_result.scalar()
                print(f"   Incomes saved: {income_count}")
                
                # Check feelings
                feelings_result = await db_session.execute(text("SELECT COUNT(*) FROM FinancialFeelings WHERE user_id = 1"))
                feeling_count = feelings_result.scalar()
                print(f"   Feelings saved: {feeling_count}")
                
                # Show actual expense data with feelings
                expenses_data = await db_session.execute(text("""
                    SELECT id, expense_type, expense_amount, expense_feeling 
                    FROM UnverifiedExpenses 
                    WHERE user_id = 1 
                    ORDER BY id
                """))
                print(f"   Expense details:")
                for expense in expenses_data:
                    print(f"     - ID:{expense[0]} R{expense[2]} {expense[1]} (feeling: {expense[3] or 'None'})")
                
                # Show income data with feelings
                incomes_data = await db_session.execute(text("""
                    SELECT id, income_type, income_amount, income_feeling 
                    FROM UnverifiedIncomes 
                    WHERE user_id = 1 
                    ORDER BY id
                """))
                print(f"   Income details:")
                for income in incomes_data:
                    print(f"     - ID:{income[0]} R{income[2]} {income[1]} (feeling: {income[3] or 'None'})")
                    
            except Exception as e:
                print(f"   ❌ Database check error: {e}")
            
            print(f"\n🎉 Test completed! Expected results:")
            print(f"   ✅ 2 Expenses saved (R50 groceries, R25 taxi)")
            print(f"   ✅ 1 Income saved (R3000 job)")
            print(f"   ✅ Feelings updated in database (Good, Great, Worried)")
            print(f"   ✅ All transactions have feelings attached")
        
        except Exception as e:
            print(f"❌ Test error: {e}")
            import traceback
            traceback.print_exc()

async def test_recent_transactions_directly():
    """Test the new get_recent_transactions function directly"""
    
    print(f"\n{'='*60}")
    print("TESTING get_recent_transactions FUNCTION DIRECTLY")
    print('='*60)
    
    db_manager = DatabaseManager(db_url='sqlite+aiosqlite:///test_db.db')
    
    async with db_manager.session_scope() as db_session:
        query_manager = AsyncQueries(session=db_session)
        
        try:
            # Import the function
            from api.agents.model_actions import get_recent_transactions
            
            print("Test 1: Get recent expenses...")
            result = await get_recent_transactions(query_manager=query_manager, user_id=1, record_type="expense")
            print(f"Expenses result: {result}")
            
            print("\nTest 2: Get recent incomes...")
            result = await get_recent_transactions(query_manager=query_manager, user_id=1, record_type="income")
            print(f"Incomes result: {result}")
            
        except Exception as e:
            print(f"❌ Direct function test error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    print("🚀 Starting simplified workflow tests...")
    
    # Run the main workflow test
    asyncio.run(test_simplified_workflow())
    
    # Test the new function directly
    asyncio.run(test_recent_transactions_directly())
    
    print("\n🏁 All tests completed!")