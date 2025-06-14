from typing import Dict, List
import logging
from datetime import datetime
from api.services.s3_bucket import SecureS3Service

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class AgentConversationManager:

    def __init__(self, s3_bucket: SecureS3Service, user_phone_number: str, user_id: int) -> None:
        self.s3_bucket = s3_bucket
        self.user_phone_number = user_phone_number
        self.user_id = user_id

    async def get_conversation_history_for_agent(self) -> List[Dict]:
        
        # Load conversation history from S3
        history_data = await self.s3_bucket.load_conversation_history(self.user_phone_number)
        
        if not history_data or not history_data.get('turns'):
            return []  # New user, no history
        
        recent_turns = history_data['turns'][-10:]
        gemini_history = self._format_history_for_gemini_input(recent_turns=recent_turns)
        return gemini_history
    
    async def save_conversation_turn(self, user_message: str, assistant_response: str, function_calls: List[Dict] = None) -> None:
        turn_id = await self._get_next_turn_id()
    
        # Create turn data
        turn_data = {
            "turn_id": turn_id,
            "timestamp": datetime.utcnow().isoformat(),
            "user_message": user_message,
            "assistant_response": assistant_response,
            "function_calls": function_calls or []
        }
        
        # Save to S3
        success = await self.s3_bucket.append_conversation_turn(self.user_phone_number, turn_data)
        
        if success:
            print(f"✅ Conversation turn saved for {self.user_phone_number}")
        else:
            print(f"❌ Failed to save conversation turn for {self.user_phone_number}")



    async def get_user_conversation_stats(self, user_phone_number: str) -> Dict:
        """Get statistics about user's conversation data"""
        try:
            history = await self.s3_bucket.load_conversation_history(user_phone_number)
            
            if not history:
                return {"total_turns": 0, "created_at": None, "last_updated": None}
            
            return {
                "total_turns": history.get('total_turns', 0),
                "created_at": history.get('created_at'),
                "last_updated": history.get('last_updated'),
                "first_message_date": history['turns'][0]['timestamp'] if history.get('turns') else None,
                "conversation_span_days": self._calculate_conversation_span(history)
            }
            
        except Exception as e:
            logger.error(f"Failed to get conversation stats: {e}")
            return {"error": str(e)}
        
    
    def _calculate_conversation_span(self, history: Dict) -> int:
        """Calculate how many days user has been conversing"""
        try:
            if not history.get('turns'):
                return 0
            
            first_date = datetime.fromisoformat(history['turns'][0]['timestamp'])
            last_date = datetime.fromisoformat(history['turns'][-1]['timestamp'])
            return (last_date - first_date).days + 1
        except:
            return 0
        
    def _format_history_for_gemini_input(self, recent_turns: Dict) -> List[Dict]:
        gemini_history = []
        for turn in recent_turns:
            gemini_history.append({
            "role": "user",
            "parts": [{"text": turn["user_message"]}]
            })
        
            # Add assistant response
            gemini_history.append({
                "role": "model",
                "parts": [{"text": turn["assistant_response"]}]
            })

        return gemini_history
    
    async def _get_next_turn_id(self) -> int:
        """Get the next turn ID for this user"""
        
        history_data = await self.s3_bucket.load_conversation_history(self.user_phone_number)
        
        if not history_data:
            return 1  # First turn
        
        return history_data.get('total_turns', 0) + 1


    

    