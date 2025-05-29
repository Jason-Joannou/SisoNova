import google.generativeai as genai
from typing import Dict, Any, List
import json
from datetime import datetime

class PersonalizedGeminiAnalyzer:
    """Use Google Gemini to generate personalized AI insights based on actual user data"""
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    async def generate_personalized_insights(self, report_data: Dict[str, Any], report_type: str, user_context: str = "South African lower-income user") -> Dict[str, Any]:
        """Generate AI insights based on the user's specific financial data"""
        
        # Extract key data points for analysis
        data_summary = self._extract_key_data_points(report_data, report_type)
        
        # Create personalized prompt
        prompt = self._create_personalized_prompt(data_summary, report_type, user_context)
        
        try:
            response = self.model.generate_content(prompt)
            insights = self._parse_personalized_response(response.text, report_type)
            
            # Add data context to insights
            insights["analyzed_data"] = data_summary
            insights["analysis_date"] = datetime.now().strftime('%Y-%m-%d %H:%M')
            
            return insights
        except Exception as e:
            return {"error": f"AI analysis failed: {str(e)}"}
    
    def _extract_key_data_points(self, report_data: Dict[str, Any], report_type: str) -> Dict[str, Any]:
        """Extract the most important data points for AI analysis"""
        
        if report_type == "expenses":
            return self._extract_expense_data_points(report_data)
        elif report_type == "incomes":
            return self._extract_income_data_points(report_data)
        elif report_type == "feelings":
            return self._extract_feelings_data_points(report_data)
        elif report_type == "comprehensive":
            return self._extract_comprehensive_data_points(report_data)
        else:
            return {}
    
    def _extract_expense_data_points(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract key expense data points - ENHANCED VERSION"""
        summary = report_data.get("summary", {})
        category_analysis = report_data.get("category_analysis", {})
        spending_patterns = report_data.get("spending_patterns", {})
        cost_cutting = report_data.get("cost_cutting_opportunities", [])
        spending_triggers = report_data.get("spending_triggers", {})
        
        # Extract category breakdown properly
        category_breakdown = category_analysis.get("category_breakdown", {})
        essential_vs_non = category_analysis.get("essential_vs_non_essential", {})
        
        # Extract spending patterns
        day_analysis = spending_patterns.get("day_of_week_analysis", {})
        month_part = spending_patterns.get("month_part_spending", {})
        
        # Extract emotional triggers
        emotional_triggers = spending_triggers.get("emotional_triggers", {})
        weekend_vs_weekday = spending_triggers.get("weekend_vs_weekday", {})
        
        return {
            # Basic summary data
            "total_expenses": summary.get("total_expenses", 0),
            "daily_average": summary.get("average_daily_spending", 0),
            "transaction_count": summary.get("total_transactions", 0),
            "average_transaction_size": summary.get("average_transaction_size", 0),
            
            # Expense extremes
            "largest_expense": summary.get("largest_expense", {}),
            "smallest_expense": summary.get("smallest_expense", {}),
            
            # Category analysis
            "top_spending_category": category_analysis.get("top_spending_category", "Unknown"),
            "most_frequent_category": category_analysis.get("most_frequent_category", "Unknown"),
            "category_breakdown": category_breakdown,
            "category_count": len(category_breakdown),
            
            # Essential vs non-essential
            "essential_total": essential_vs_non.get("essential_total", 0),
            "non_essential_total": essential_vs_non.get("non_essential_total", 0),
            "essential_percentage": essential_vs_non.get("essential_percentage", 0),
            
            # Spending patterns
            "peak_spending_day": spending_patterns.get("peak_spending_day", "Unknown"),
            "spending_frequency": spending_patterns.get("spending_frequency", 0),
            "day_of_week_spending": day_analysis,
            "month_part_spending": month_part,
            
            # Cost cutting opportunities
            "cost_cutting_opportunities": cost_cutting,
            "total_potential_savings": sum(opp.get("potential_savings", 0) for opp in cost_cutting),
            "high_priority_savings": [opp for opp in cost_cutting if opp.get("priority") == "High"],
            
            # Emotional and behavioral patterns
            "emotional_spending_triggers": emotional_triggers,
            "weekend_spending": weekend_vs_weekday.get("weekend_total", 0),
            "weekday_spending": weekend_vs_weekday.get("weekday_total", 0),
            "weekend_vs_weekday_ratio": (
                weekend_vs_weekday.get("weekend_total", 0) / weekend_vs_weekday.get("weekday_total", 1) 
                if weekend_vs_weekday.get("weekday_total", 0) > 0 else 0
            ),
            
            # Additional insights
            "top_3_categories": list(sorted(
                category_breakdown.items(), 
                key=lambda x: x[1].get("total", 0), 
                reverse=True
            )[:3]) if category_breakdown else [],
        }
    
    def _extract_income_data_points(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract key income data points"""
        summary = report_data.get("summary", {})
        source_analysis = report_data.get("source_analysis", {})
        stability = report_data.get("stability_analysis", {})
        diversification = report_data.get("diversification_score", {})
        opportunities = report_data.get("growth_opportunities", [])
        
        return {
            "total_income": summary.get("total_income", 0),
            "monthly_average": summary.get("monthly_average", 0),
            "income_events": summary.get("total_income_events", 0),
            "primary_source": source_analysis.get("primary_income_source", "Unknown"),
            "source_breakdown": source_analysis.get("source_breakdown", {}),
            "stability_score": stability.get("stability_score", 0),
            "regular_income_percentage": stability.get("income_predictability", {}).get("regular_percentage", 0),
            "diversification_score": diversification.get("diversification_score", 0),
            "risk_level": diversification.get("risk_level", "Unknown"),
            "growth_opportunities_count": len(opportunities)
        }
    
    def _extract_feelings_data_points(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract key feelings data points"""
        summary = report_data.get("summary", {})
        stress_analysis = report_data.get("stress_analysis", {})
        wellness_trends = report_data.get("wellness_trends", {})
        mental_health = report_data.get("mental_health_insights", {})
        
        return {
            "total_entries": summary.get("total_feeling_entries", 0),
            "most_common_feeling": summary.get("most_common_feeling", "Unknown"),
            "stress_percentage": summary.get("stress_level_percentage", 0),
            "wellness_status": summary.get("wellness_status", "Unknown"),
            "stress_trend": stress_analysis.get("stress_trend_direction", "Unknown"),
            "wellness_trend": wellness_trends.get("wellness_trend", "Unknown"),
            "mental_health_risk": mental_health.get("mental_health_risk_level", "Unknown"),
            "feeling_distribution": summary.get("feeling_distribution", {}),
            "high_stress_periods": stress_analysis.get("high_stress_periods", [])
        }
    
    def _extract_comprehensive_data_points(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract key comprehensive data points"""
        summary = report_data.get("summary", {})
        financial_health = report_data.get("financial_health", {})
        category_breakdown = report_data.get("category_breakdown", {})
        emergency_prep = report_data.get("emergency_preparedness", {})
        
        return {
            "total_income": summary.get("total_income", 0),
            "total_expenses": summary.get("total_expenses", 0),
            "net_position": summary.get("net_position", 0),
            "savings_rate": summary.get("savings_rate", 0),
            "financial_status": summary.get("financial_status", "Unknown"),
            "health_score": financial_health.get("health_score", {}).get("score", 0),
            "stress_indicators": financial_health.get("stress_indicators", []),
            "top_expense_category": category_breakdown.get("top_spending_category", "Unknown"),
            "emergency_months_covered": emergency_prep.get("months_covered", 0),
            "emergency_status": emergency_prep.get("emergency_fund_status", "Unknown")
        }
    
    # Updated AI prompts for WhatsApp-friendly responses
    def _create_personalized_prompt(self, data_summary: Dict[str, Any], report_type: str, user_context: str) -> str:
        """Create WhatsApp-optimized prompts for different report types"""
        
        base_prompt = f"""
    You are a financial advisor specializing in helping {user_context}. 
    You will provide analysis via WhatsApp messages, so keep responses mobile-friendly.
    Analyze the following ACTUAL financial data from a real user.

    USER'S ACTUAL FINANCIAL DATA:
    {json.dumps(data_summary, indent=2)}

    IMPORTANT: Base your analysis on the SPECIFIC NUMBERS and PATTERNS shown above, not generic advice.
    """
        
        if report_type == "expenses":
            specific_prompt = f"""
    EXPENSE ANALYSIS FOCUS:
    - This user spends R{data_summary.get('total_expenses', 0):,.2f} total
    - Their daily average is R{data_summary.get('daily_average', 0):.2f}
    - Top spending category: {data_summary.get('top_category', 'Unknown')}
    - Essential expenses: {data_summary.get('essential_percentage', 0)}% of total
    - Peak spending day: {data_summary.get('peak_spending_day', 'Unknown')}
    - Potential savings identified: R{data_summary.get('cost_cutting_potential', 0):.2f}

    Provide your analysis in exactly this format:

    **FINANCIAL HEALTH ASSESSMENT** (2-3 sentences max):
    [Analyze what their R{data_summary.get('total_expenses', 0):,.2f} spending pattern tells you about their financial health]

    **TOP 3 CONCERNS** (bullet points, 1 line each):
    • [Specific concern based on their actual spending]
    • [Another specific concern from their data]
    • [Third concern from their patterns]

    **TOP 3 OPPORTUNITIES** (bullet points, 1 line each):
    • [Specific opportunity based on their R{data_summary.get('cost_cutting_potential', 0):.2f} savings potential]
    • [Another opportunity from their spending patterns]
    • [Third opportunity for improvement]

    **IMMEDIATE ACTION STEPS** (numbered list, 1-2 lines each):
    1. [Specific action based on their {data_summary.get('top_category', 'Unknown')} spending]
    2. [Action related to their R{data_summary.get('daily_average', 0):.2f} daily spending]
    3. [Action for their {data_summary.get('peak_spending_day', 'Unknown')} peak spending]

    **ENCOURAGEMENT** (2-3 sentences):
    [Motivational message specific to their situation and progress]
    """
        
        elif report_type == "incomes":
            specific_prompt = f"""
    INCOME ANALYSIS FOCUS:
    - This user earns R{data_summary.get('total_income', 0):,.2f} total (R{data_summary.get('monthly_average', 0):,.2f}/month)
    - Primary income source: {data_summary.get('primary_source', 'Unknown')}
    - Income stability score: {data_summary.get('stability_score', 0)}/100
    - Regular income: {data_summary.get('regular_income_percentage', 0)}% of total
    - Diversification score: {data_summary.get('diversification_score', 0)}/100

    Provide your analysis in exactly this format:

    **INCOME HEALTH ASSESSMENT** (2-3 sentences max):
    [Analyze what earning R{data_summary.get('monthly_average', 0):,.2f}/month means for this user in South Africa]

    **TOP 3 INCOME CONCERNS** (bullet points, 1 line each):
    • [Concern about their {data_summary.get('stability_score', 0)}/100 stability score]
    • [Concern about their {data_summary.get('diversification_score', 0)}/100 diversification]
    • [Third concern from their income pattern]

    **TOP 3 GROWTH OPPORTUNITIES** (bullet points, 1 line each):
    • [Opportunity based on their {data_summary.get('primary_source', 'Unknown')} income]
    • [Opportunity for income diversification]
    • [Third growth opportunity]

    **INCOME BOOSTING ACTIONS** (numbered list, 1-2 lines each):
    1. [Specific action for their primary income source]
    2. [Action to improve their {data_summary.get('stability_score', 0)}/100 stability]
    3. [Action to increase their {data_summary.get('diversification_score', 0)}/100 diversification]

    **MOTIVATION** (2-3 sentences):
    [Encouraging message about their income potential]
    """
        
        elif report_type == "feelings":
            specific_prompt = f"""
    FINANCIAL WELLNESS FOCUS:
    - This user has {data_summary.get('total_entries', 0)} feeling entries
    - Most common feeling: {data_summary.get('most_common_feeling', 'Unknown')}
    - Stress level: {data_summary.get('stress_percentage', 0)}%
    - Wellness trend: {data_summary.get('stress_trend', 'Unknown')}
    - Mental health risk: {data_summary.get('mental_health_risk', 'Unknown')}

    Provide your analysis in exactly this format:

    **WELLNESS ASSESSMENT** (2-3 sentences max):
    [Analyze what {data_summary.get('stress_percentage', 0)}% stress level means for this user]

    **TOP 3 STRESS FACTORS** (bullet points, 1 line each):
    • [Factor related to their {data_summary.get('most_common_feeling', 'Unknown')} feeling]
    • [Factor from their {data_summary.get('stress_trend', 'Unknown')} trend]
    • [Third stress factor from their data]

    **TOP 3 WELLNESS OPPORTUNITIES** (bullet points, 1 line each):
    • [Opportunity to improve their stress level]
    • [Opportunity based on their feeling patterns]
    • [Third wellness improvement opportunity]

    **STRESS MANAGEMENT ACTIONS** (numbered list, 1-2 lines each):
    1. [Specific action for their stress level]
    2. [Action for their {data_summary.get('stress_trend', 'Unknown')} trend]
    3. [Action for overall wellness improvement]

    **SUPPORT & ENCOURAGEMENT** (2-3 sentences):
    [Supportive message acknowledging their challenges and progress]
    """
        
        elif report_type == "comprehensive":
            specific_prompt = f"""
    COMPREHENSIVE FINANCIAL ANALYSIS:
    - Income: R{data_summary.get('total_income', 0):,.2f} vs Expenses: R{data_summary.get('total_expenses', 0):,.2f}
    - Net position: R{data_summary.get('net_position', 0):,.2f} ({data_summary.get('savings_rate', 0)}% savings rate)
    - Financial health score: {data_summary.get('health_score', 0)}/100
    - Emergency fund: {data_summary.get('emergency_months_covered', 0)} months covered

    Provide your analysis in exactly this format:

    **OVERALL FINANCIAL HEALTH** (2-3 sentences max):
    [Analyze their {data_summary.get('health_score', 0)}/100 score with R{data_summary.get('net_position', 0):,.2f} net position]

    **TOP 3 PRIORITIES** (bullet points, 1 line each):
    • [Priority based on their {data_summary.get('savings_rate', 0)}% savings rate]
    • [Priority for their {data_summary.get('emergency_months_covered', 0)} months emergency fund]
    • [Third priority from their overall situation]

    **TOP 3 STRENGTHS** (bullet points, 1 line each):
    • [Strength from their financial data]
    • [Another positive aspect of their finances]
    • [Third strength to build upon]

    **6-MONTH ACTION PLAN** (numbered list, 1-2 lines each):
    1. [Immediate action for next month]
    2. [Action for months 2-3]
    3. [Action for months 4-6]

    **MOTIVATION & VISION** (2-3 sentences):
    [Encouraging message about their financial journey and potential]
    """
        
        # Enhanced closing prompt for WhatsApp optimization
        whatsapp_closing_prompt = """
    WHATSAPP DELIVERY REQUIREMENTS:
    - Each section should be 300-800 characters (mobile-friendly)
    - Use simple, conversational language (Grade 8 reading level)
    - Include relevant emojis where appropriate
    - Focus on specific, actionable advice they can implement this week
    - Reference their actual numbers and South African context
    - Be encouraging but realistic about their specific situation
    - Avoid financial jargon - use everyday language
    - The Total message length SHOULD NOT EXCEED 1600 characters

    SOUTH AFRICAN CONTEXT:
    - Consider stokvels, government grants, taxi fares, local retailers
    - Reference local costs and income levels
    - Acknowledge economic challenges in South Africa
    - Suggest culturally appropriate financial strategies

    TONE: Supportive financial friend who understands their specific situation and wants to help them succeed.
    """
        
        return base_prompt + specific_prompt + whatsapp_closing_prompt
    
    def _parse_personalized_response(self, response_text: str, report_type: str) -> Dict[str, Any]:
        """Parse the AI response into structured, personalized insights"""
        
        sections = {
            "personalized_assessment": "",
            "specific_concerns": [],
            "targeted_opportunities": [],
            "actionable_recommendations": [],
            "realistic_goals": [],
            "motivational_message": "",
            "data_based_insights": []
        }
        
        lines = response_text.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Improved section identification
            line_upper = line.upper()
            
            # More specific keyword matching
            if any(keyword in line_upper for keyword in ["**FINANCIAL HEALTH ASSESSMENT**", "**INCOME HEALTH ASSESSMENT**", "**WELLNESS ASSESSMENT**", "**OVERALL FINANCIAL HEALTH**"]):
                current_section = "personalized_assessment"
                continue
            elif any(keyword in line_upper for keyword in ["**TOP 3 CONCERNS**", "**TOP 3 INCOME CONCERNS**", "**TOP 3 STRESS FACTORS**"]):
                current_section = "specific_concerns"
                continue
            elif any(keyword in line_upper for keyword in ["**TOP 3 OPPORTUNITIES**", "**TOP 3 GROWTH OPPORTUNITIES**", "**TOP 3 WELLNESS OPPORTUNITIES**", "**TOP 3 STRENGTHS**"]):
                current_section = "targeted_opportunities"
                continue
            elif any(keyword in line_upper for keyword in ["**IMMEDIATE ACTION STEPS**", "**INCOME BOOSTING ACTIONS**", "**STRESS MANAGEMENT ACTIONS**", "**6-MONTH ACTION PLAN**"]):
                current_section = "actionable_recommendations"
                continue
            elif any(keyword in line_upper for keyword in ["**ENCOURAGEMENT**", "**MOTIVATION**", "**SUPPORT & ENCOURAGEMENT**", "**MOTIVATION & VISION**"]):
                current_section = "motivational_message"
                continue
            elif current_section:
                # Process content based on current section
                if line.startswith(('•', '-', '1.', '2.', '3.', '4.', '5.')):
                    # List item
                    clean_line = line.lstrip('•-123456789. ').strip()
                    if current_section in ["specific_concerns", "targeted_opportunities", "actionable_recommendations"]:
                        sections[current_section].append(clean_line)
                else:
                    # Paragraph content
                    if current_section in ["personalized_assessment", "motivational_message"]:
                        sections[current_section] += line + " "
        
        # Clean up text sections
        sections["personalized_assessment"] = sections["personalized_assessment"].strip()
        sections["motivational_message"] = sections["motivational_message"].strip()
        
        # Add metadata
        sections["analysis_type"] = f"Personalized {report_type.title()} Analysis"
        sections["ai_confidence"] = "High" if len(sections["actionable_recommendations"]) >= 3 else "Medium"
        
        return sections