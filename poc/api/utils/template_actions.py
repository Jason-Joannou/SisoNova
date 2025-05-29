# api/utils/poc_dummy_data_sa.py
from api.db.models.tables import UnverifiedExpenses, UnverifiedIncomes, FinancialFeelings, User
import os
from api.finance.report import PersonalizedReportDispatcher
from api.db.db_manager import DatabaseManager
from api.db.query_manager import AsyncQueries
import random
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Any
from api.services.s3_bucket import SecureS3Service

async def create_poc_dummy_data_south_africa(user_object: User) -> List[Tuple[str, Dict[str, Any]]]:
    """
    Create South African lower-income representative dummy data for testing
    Updated to match actual table schema
    """
    dummy_data = []
    
    # Generate data for the last 2-3 years
    current_year = datetime.now().year
    start_year = random.randint(2022, 2023)
    
    # South African expense types with local context
    expense_types = [
        "Food & Groceries - Pick n Pay",
        "Food & Groceries - Shoprite", 
        "Food & Groceries - Street vendor",
        "Food & Groceries - Bread and milk",
        "Transport - Taxi fare",
        "Transport - Bus fare", 
        "Transport - Petrol",
        "Transport - Uber ride",
        "Utilities - Electricity prepaid",
        "Utilities - Cell phone airtime",
        "Utilities - Data bundle",
        "Healthcare - Clinic visit",
        "Healthcare - Pharmacy medicine",
        "Education - School fees",
        "Education - School uniform",
        "Clothing - Work clothes",
        "Clothing - Hair salon",
        "Housing - Rent",
        "Housing - Home repairs",
        "Social - Stokvel contribution",
        "Social - Funeral contribution",
        "Social - Church offering"
    ]
    
    # South African income types for lower-income bracket
    income_types = [
        "Employment - Monthly salary",
        "Employment - Weekly wages", 
        "Employment - Overtime pay",
        "Employment - Casual work",
        "Government Grant - Child support",
        "Government Grant - Disability grant",
        "Government Grant - Old age pension",
        "Informal Work - Selling goods",
        "Informal Work - Hair braiding",
        "Informal Work - Car washing",
        "Informal Work - Garden work",
        "Other Income - Money from family",
        "Other Income - Stokvel payout",
        "Other Income - Side hustle"
    ]
    
    # Financial feelings in South African context
    feelings_options = [
        "Very Worried", "Worried", "Getting By", "Okay", "Doing Well"
    ]
    
    # Generate data for each year
    for year in range(start_year, current_year + 1):
        # Determine how many months of data for this year
        if year == current_year:
            max_month = datetime.now().month
        else:
            max_month = 12
            
        for month in range(1, max_month + 1):
            # Generate 4-12 expenses per month (more frequent, smaller amounts)
            num_expenses = random.randint(4, 12)
            for _ in range(num_expenses):
                expense_type = random.choice(expense_types)
                
                # Random day in the month
                day = random.randint(1, min(28, 31))
                expense_date = datetime(year, month, day)
                
                # South African Rand amounts appropriate for lower income
                if "Housing" in expense_type:
                    amount = round(random.uniform(800, 3500), 2)  # R800-R3500 rent
                elif "Food" in expense_type:
                    amount = round(random.uniform(15, 400), 2)   # R15-R400 per shop
                elif "Transport" in expense_type:
                    amount = round(random.uniform(8, 150), 2)    # R8-R150 per trip/fill
                elif "Utilities" in expense_type:
                    amount = round(random.uniform(25, 300), 2)   # R25-R300 per bill
                elif "Education" in expense_type:
                    amount = round(random.uniform(50, 800), 2)   # R50-R800 school costs
                elif "Healthcare" in expense_type:
                    amount = round(random.uniform(20, 250), 2)   # R20-R250 medical
                elif "Social" in expense_type:
                    amount = round(random.uniform(20, 500), 2)   # R20-R500 contributions
                else:
                    amount = round(random.uniform(10, 200), 2)   # R10-R200 other
                
                # Random feeling for this expense
                expense_feeling = random.choice(feelings_options) if random.choice([True, False]) else None
                
                expense_data = {
                    'user_id': user_object.id,
                    'expense_type': expense_type,
                    'expense_amount': amount,
                    'expense_feeling': expense_feeling,
                    'expense_date': expense_date
                }
                dummy_data.append(('expense', expense_data))
            
            # Generate 1-4 incomes per month (multiple income streams common)
            num_incomes = random.randint(1, 4)
            for _ in range(num_incomes):
                income_type = random.choice(income_types)
                
                # Random day in the month
                day = random.randint(1, min(28, 31))
                income_date = datetime(year, month, day)
                
                # South African income amounts for lower income bracket
                if "Employment" in income_type:
                    amount = round(random.uniform(1500, 8000), 2)  # R1500-R8000 monthly
                elif "Government Grant" in income_type:
                    amount = round(random.uniform(350, 2000), 2)   # R350-R2000 grants
                elif "Informal Work" in income_type:
                    amount = round(random.uniform(50, 1200), 2)    # R50-R1200 informal
                else:  # Other Income
                    amount = round(random.uniform(30, 800), 2)     # R30-R800 other
                
                # Random feeling for this income
                income_feeling = random.choice(feelings_options) if random.choice([True, False]) else None
                
                income_data = {
                    'user_id': user_object.id,
                    'income_type': income_type,
                    'income_amount': amount,
                    'income_feeling': income_feeling,
                    'income_date': income_date
                }
                dummy_data.append(('income', income_data))
            
            # Generate financial feelings (more frequent due to financial stress)
            if random.choice([True, True, False]):  # 66% chance - higher stress
                day = random.randint(1, min(28, 31))
                feeling_date = datetime(year, month, day)
                
                # Weight feelings towards more worried end for lower income
                weighted_feelings = (
                    ["Very Worried"] * 3 + 
                    ["Worried"] * 4 + 
                    ["Getting By"] * 2 + 
                    ["Okay"] * 1 + 
                    ["Doing Well"] * 1
                )
                
                feeling_data = {
                    'user_id': user_object.id,
                    'feeling': random.choice(weighted_feelings),
                    'feeling_date': feeling_date
                }
                dummy_data.append(('feeling', feeling_data))
    
    return dummy_data


async def generate_expense_report(report_dispatcher: PersonalizedReportDispatcher, user_object: User) -> Dict[str, Any]:
    """Generate actual expense report using async PersonalizedReportDispatcher"""

    s3_bucket = SecureS3Service()

    if not report_dispatcher or not s3_bucket:
        return {"body": "Something went wrong generating your report. Please try again later."}
    
    try:
        print(f"DEBUG: Generating async expense report for user {user_object.id}")
        
        # Await the async report generation method
        report_result = await report_dispatcher.generate_personalized_report(
            report_type="expenses",
            months_back=6,
            include_ai=True,
            generate_pdf=True
        )
        
        if "error" in report_result:
            return {
                "error": report_result["error"],
                "message": "Sorry, I couldn't generate your expense report right now. Please try again later."
            }
        
        # Extract results
        pdf_filename = report_result.get("pdf_filename")
        ai_insights = report_result.get("personalized_ai_insights", {})

        if not pdf_filename or not os.path.exists(pdf_filename):
            return {
                "error": True,
                "messages": [{"body": "Sorry, the report file could not be found."}]
            }
        
        # Upload to secure S3
        presigned_url = await s3_bucket.upload_pdf_from_file_secure(
            file_path=pdf_filename,
            user_id=user_object.id,
            report_type="expenses",
            expiration_hours=24
        )
        
        # Clean up local file
        if presigned_url:
            try:
                os.remove(pdf_filename)
                print(f"Cleaned up local file: {pdf_filename}")
            except Exception as e:
                print(f"Failed to clean up local file: {e}")

        if not presigned_url:
            return {
                "error": True,
                "messages": [{"body": "Sorry, there was an error uploading your report. Please try again."}]
            }
        
        # Build message sequence
        messages = []
        
        # First message: Report ready notification
        messages.append({"body": "📊 Your expense report is ready!"})
        
        # Second message: AI insight if available
        if ai_insights and "personalized_assessment" in ai_insights:
            assessment = ai_insights["personalized_assessment"]
            messages.append({"body": f"💡 Key Insight: \n\n{assessment}"})

        messages.append({
            "body": "📄 Here's your detailed expense analysis (link expires in 24 hours):",
            "media_url": presigned_url
        })

        return {
            "error": False,
            "messages": messages,
            "stay_on_current": True
        }
        
        
    except Exception as e:
        print(f"ERROR generating expense report: {str(e)}")
        return {
            "error": True,
            "messages": [{"body": "Sorry, there was an error generating your expense report. Please try again later."}]
        }
