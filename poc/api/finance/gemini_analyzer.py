import google.generativeai as genai
from typing import Dict, Any, List
import json
from datetime import datetime

class PersonalizedGeminiAnalyzer:
    """Use Google Gemini to generate personalized AI insights based on actual user data"""
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
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
        """Extract key expense data points"""
        summary = report_data.get("summary", {})
        category_analysis = report_data.get("category_analysis", {})
        spending_patterns = report_data.get("spending_patterns", {})
        cost_cutting = report_data.get("cost_cutting_opportunities", [])
        
        return {
            "total_expenses": summary.get("total_expenses", 0),
            "daily_average": summary.get("average_daily_spending", 0),
            "transaction_count": summary.get("total_transactions", 0),
            "largest_expense": summary.get("largest_expense", {}),
            "top_category": category_analysis.get("category_breakdown", {}).get("top_spending_category", "Unknown"),
            "essential_percentage": category_analysis.get("essential_vs_non_essential", {}).get("essential_percentage", 0),
            "peak_spending_day": spending_patterns.get("peak_spending_day", "Unknown"),
            "cost_cutting_potential": sum(opp.get("potential_savings", 0) for opp in cost_cutting),
            "category_breakdown": {
                cat: data.get("total", 0) 
                for cat, data in category_analysis.get("category_breakdown", {}).items()
            }
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
    
    def _create_personalized_prompt(self, data_summary: Dict[str, Any], report_type: str, user_context: str) -> str:
        """Create a detailed, personalized prompt for Gemini analysis"""
        
        base_prompt = f"""
You are a financial advisor specializing in helping {user_context}. 
You have been provided with ACTUAL financial data from a real user. 
Analyze their SPECIFIC situation and provide personalized, actionable advice.

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

Analyze THESE SPECIFIC NUMBERS and provide:
1. PERSONALIZED ASSESSMENT: What do these specific spending patterns tell you about this user?
2. SPECIFIC CONCERNS: Based on their R{data_summary.get('total_expenses', 0):,.2f} spending, what are the biggest issues?
3. TARGETED OPPORTUNITIES: Given their {data_summary.get('top_category', 'Unknown')} spending is highest, what specific actions should they take?
4. REALISTIC SAVINGS PLAN: Based on their actual spending of R{data_summary.get('daily_average', 0):.2f}/day, what's achievable?
5. CATEGORY-SPECIFIC ADVICE: For each of their actual spending categories, give specific recommendations.
"""
        
        elif report_type == "incomes":
            specific_prompt = f"""
INCOME ANALYSIS FOCUS:
- This user earns R{data_summary.get('total_income', 0):,.2f} total (R{data_summary.get('monthly_average', 0):,.2f}/month)
- Primary income source: {data_summary.get('primary_source', 'Unknown')}
- Income stability score: {data_summary.get('stability_score', 0)}/100
- Regular income: {data_summary.get('regular_income_percentage', 0)}% of total
- Diversification score: {data_summary.get('diversification_score', 0)}/100
- Risk level: {data_summary.get('risk_level', 'Unknown')}

Analyze THESE SPECIFIC NUMBERS and provide:
1. INCOME HEALTH ASSESSMENT: What does earning R{data_summary.get('monthly_average', 0):,.2f}/month mean for this user?
2. STABILITY CONCERNS: With {data_summary.get('stability_score', 0)}/100 stability, what are the risks?
3. DIVERSIFICATION STRATEGY: Given their {data_summary.get('diversification_score', 0)}/100 score, what specific steps should they take?
4. GROWTH OPPORTUNITIES: Based on their current {data_summary.get('primary_source', 'Unknown')} income, what's realistic?
5. SOURCE-SPECIFIC ADVICE: For each of their actual income sources, give targeted recommendations.
"""
        
        elif report_type == "feelings":
            specific_prompt = f"""
FINANCIAL WELLNESS FOCUS:
- This user has {data_summary.get('total_entries', 0)} feeling entries
- Most common feeling: {data_summary.get('most_common_feeling', 'Unknown')}
- Stress level: {data_summary.get('stress_percentage', 0)}%
- Wellness status: {data_summary.get('wellness_status', 'Unknown')}
- Stress trend: {data_summary.get('stress_trend', 'Unknown')}
- Mental health risk: {data_summary.get('mental_health_risk', 'Unknown')}

Analyze THESE SPECIFIC PATTERNS and provide:
1. WELLNESS ASSESSMENT: What does {data_summary.get('stress_percentage', 0)}% stress level mean for this user?
2. STRESS TRIGGERS: Based on their {data_summary.get('most_common_feeling', 'Unknown')} being most common, what's causing this?
3. TREND ANALYSIS: With stress trend being {data_summary.get('stress_trend', 'Unknown')}, what should they expect?
4. PERSONALIZED COPING STRATEGIES: Given their specific stress patterns, what will work for them?
5. MENTAL HEALTH SUPPORT: With {data_summary.get('mental_health_risk', 'Unknown')} risk level, what specific help do they need?
"""
        
        elif report_type == "comprehensive":
            specific_prompt = f"""
COMPREHENSIVE FINANCIAL ANALYSIS:
- Income: R{data_summary.get('total_income', 0):,.2f} vs Expenses: R{data_summary.get('total_expenses', 0):,.2f}
- Net position: R{data_summary.get('net_position', 0):,.2f} ({data_summary.get('savings_rate', 0)}% savings rate)
- Financial health score: {data_summary.get('health_score', 0)}/100
- Emergency fund: {data_summary.get('emergency_months_covered', 0)} months covered
- Status: {data_summary.get('financial_status', 'Unknown')}

Analyze THIS COMPLETE PICTURE and provide:
1. OVERALL FINANCIAL HEALTH: What does a {data_summary.get('health_score', 0)}/100 score with R{data_summary.get('net_position', 0):,.2f} net position mean?
2. PRIORITY ACTIONS: Given their specific situation, what are the top 3 most important things to do?
3. REALISTIC GOALS: Based on their R{data_summary.get('savings_rate', 0)}% savings rate, what goals should they set?
4. EMERGENCY PREPAREDNESS: With {data_summary.get('emergency_months_covered', 0)} months covered, what's the plan?
5. LONG-TERM STRATEGY: Given their complete financial picture, what's the 6-month plan?
"""
        
        closing_prompt = """
REQUIREMENTS:
- Use the ACTUAL NUMBERS provided, not generic ranges
- Give SPECIFIC advice based on THEIR situation
- Consider South African context (stokvels, government grants, local costs)
- Keep language simple and actionable
- Focus on small, achievable steps
- Be encouraging but realistic about their specific challenges

Provide your analysis in clear sections with specific recommendations.
"""
        
        return base_prompt + specific_prompt + closing_prompt
    
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
            
            # Identify sections based on keywords
            line_upper = line.upper()
            if any(keyword in line_upper for keyword in ["ASSESSMENT", "HEALTH", "ANALYSIS"]):
                current_section = "personalized_assessment"
            elif any(keyword in line_upper for keyword in ["CONCERN", "ISSUE", "PROBLEM", "RISK"]):
                current_section = "specific_concerns"
            elif any(keyword in line_upper for keyword in ["OPPORTUNIT", "GROWTH", "IMPROVE"]):
                current_section = "targeted_opportunities"
            elif any(keyword in line_upper for keyword in ["RECOMMEND", "ACTION", "STEP", "ADVICE"]):
                current_section = "actionable_recommendations"
            elif any(keyword in line_upper for keyword in ["GOAL", "PLAN", "TARGET"]):
                current_section = "realistic_goals"
            elif any(keyword in line_upper for keyword in ["MOTIVAT", "ENCOURAG", "POSITIVE"]):
                current_section = "motivational_message"
            elif current_section:
                # Process content based on current section
                if line.startswith(('•', '-', '1.', '2.', '3.', '4.', '5.')):
                    # List item
                    clean_line = line.lstrip('•-123456789. ').strip()
                    if current_section in ["specific_concerns", "targeted_opportunities", "actionable_recommendations", "realistic_goals"]:
                        sections[current_section].append(clean_line)
                    elif current_section == "data_based_insights":
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