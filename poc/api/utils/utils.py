import re
from typing import Dict, Any

def is_e164_format(number: str) -> bool:
    """
    Checks if a number is in e164 format.

    The requirments for this format to be correct are:

        - Must begin with a '+'
        - Followed by country code and subscriber number (digits only)
        - No spaces, dashes, parenthesis
        - Total digits after the '+' should be between 1 and 15

    Args:
        number (str): The number to check against

    Returns:
        bool: Whether the number matches the regex pattern
    """
    pattern = re.compile(r"^\+[1-9]\d{1,14}$")
    return bool(pattern.match(number))

def create_comprehensive_ai_message(ai_insights: Dict[str, Any]) -> str:
    """Create a comprehensive WhatsApp-optimized message from all AI insights"""
    
    message_parts = []
    
    # 1. Financial Health Assessment (Main insight)
    assessment = ai_insights.get("personalized_assessment", "").strip()
    if assessment:
        message_parts.append(f"💡 *Financial Health:*\n{assessment}")
    
    # 2. Key Concerns (Critical issues to address)
    concerns = ai_insights.get("specific_concerns", [])
    if concerns:
        concerns_text = "\n".join([f"• {concern}" for concern in concerns[:3]])  # Max 3 for readability
        message_parts.append(f"⚠️ *Key Concerns:*\n{concerns_text}")
    
    # 3. Opportunities (Positive potential actions)
    opportunities = ai_insights.get("targeted_opportunities", [])
    if opportunities:
        opp_text = "\n".join([f"• {opp}" for opp in opportunities[:3]])  # Max 3
        message_parts.append(f"🎯 *Opportunities:*\n{opp_text}")
    
    # 4. Action Steps (Immediate actionable recommendations)
    actions = ai_insights.get("actionable_recommendations", [])
    if actions:
        actions_text = "\n".join([f"{i+1}. {action}" for i, action in enumerate(actions[:3])])  # Max 3, numbered
        message_parts.append(f"🚀 *Action Steps:*\n{actions_text}")
    
    # 5. Goals (Realistic future targets)
    goals = ai_insights.get("realistic_goals", [])
    if goals:
        goals_text = "\n".join([f"• {goal}" for goal in goals[:2]])  # Max 2 to keep focused
        message_parts.append(f"🎯 *Goals:*\n{goals_text}")
    
    # 6. Motivation (Encouragement and support)
    motivation = ai_insights.get("motivational_message", "").strip()
    if motivation:
        message_parts.append(f"💪 *Encouragement:*\n{motivation}")
    
    # Join with double line breaks for WhatsApp readability
    return "\n\n".join(message_parts) if message_parts else None
