# api/utils/financial_aggregation.py
from datetime import datetime, timedelta, date
from typing import Dict, List, Any, Optional, Tuple
from sqlalchemy import func, extract
from api.db.models.tables import UnverifiedExpenses, UnverifiedIncomes, FinancialFeelings
from api.db.query_manager import AsyncQueries
from api.db.db_manager import DatabaseManager
import calendar

class FinancialAggregator:
    """Comprehensive financial aggregation for South African lower-income users"""
    
    def __init__(self, user_id: int):
        self.user_id = user_id
        
    async def get_comprehensive_financial_report(self, months_back: int = 6) -> Dict[str, Any]:
        """Generate comprehensive financial report for the user"""
        
        async with DatabaseManager().session_scope() as session:
            query_manager = AsyncQueries(session=session)
            
            # Get date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=months_back * 30)
            
            # Get all data
            expenses = await query_manager.get_user_expenses_by_date_range(
                user_id=self.user_id, start_date=start_date, end_date=end_date
            )
            incomes = await query_manager.get_user_incomes_by_date_range(
                user_id=self.user_id, start_date=start_date, end_date=end_date
            )
            feelings = await query_manager.get_user_feelings_by_date_range(
                user_id=self.user_id, start_date=start_date, end_date=end_date
            )
            
            # Generate comprehensive report
            report = {
                "period": f"{start_date.strftime('%B %Y')} to {end_date.strftime('%B %Y')}",
                "summary": await self._generate_summary(expenses, incomes),
                "spending_patterns": await self._analyze_spending_patterns(expenses),
                "income_analysis": await self._analyze_income_patterns(incomes),
                "financial_health": await self._assess_financial_health(expenses, incomes, feelings),
                "category_breakdown": await self._categorize_expenses(expenses),
                "monthly_trends": await self._analyze_monthly_trends(expenses, incomes),
                "actionable_insights": await self._generate_actionable_insights(expenses, incomes),
                "emergency_preparedness": await self._assess_emergency_preparedness(expenses, incomes)
            }
            
            return report
    
    async def _generate_summary(self, expenses: List, incomes: List) -> Dict[str, Any]:
        """Generate high-level financial summary"""
        total_expenses = sum(exp.expense_amount for exp in expenses)
        total_income = sum(inc.income_amount for inc in incomes)
        net_position = total_income - total_expenses
        
        return {
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "net_position": round(net_position, 2),
            "savings_rate": round((net_position / total_income * 100) if total_income > 0 else 0, 1),
            "average_daily_spending": round(total_expenses / 180, 2),  # 6 months ≈ 180 days
            "financial_status": "Saving Money" if net_position > 0 else "Spending More Than Earning"
        }
    
    async def _analyze_spending_patterns(self, expenses: List) -> Dict[str, Any]:
        """Analyze spending patterns specific to lower-income users"""
        if not expenses:
            return {}
            
        # Group by day of week
        day_spending = {}
        for exp in expenses:
            day_name = exp.expense_date.strftime('%A')
            day_spending[day_name] = day_spending.get(day_name, 0) + exp.expense_amount
        
        # Find peak spending day
        peak_day = max(day_spending.items(), key=lambda x: x[1]) if day_spending else ("N/A", 0)
        
        # Essential vs non-essential categorization
        essential_categories = ["Food", "Transport", "Utilities", "Housing", "Healthcare", "Education"]
        essential_spending = sum(exp.expense_amount for exp in expenses 
                               if any(cat in exp.expense_type for cat in essential_categories))
        non_essential_spending = sum(exp.expense_amount for exp in expenses) - essential_spending
        
        return {
            "peak_spending_day": {"day": peak_day[0], "amount": round(peak_day[1], 2)},
            "essential_spending": round(essential_spending, 2),
            "non_essential_spending": round(non_essential_spending, 2),
            "essential_percentage": round((essential_spending / sum(exp.expense_amount for exp in expenses) * 100), 1),
            "day_of_week_spending": {day: round(amount, 2) for day, amount in day_spending.items()}
        }
    
    async def _analyze_income_patterns(self, incomes: List) -> Dict[str, Any]:
        """Analyze income patterns"""
        if not incomes:
            return {}
            
        # Group by income source
        income_sources = {}
        for inc in incomes:
            source = inc.income_type.split(' - ')[0]  # Get main category
            income_sources[source] = income_sources.get(source, 0) + inc.income_amount
        
        total_income = sum(inc.income_amount for inc in incomes)
        
        return {
            "income_sources": {source: round(amount, 2) for source, amount in income_sources.items()},
            "income_diversity": len(income_sources),
            "primary_income_source": max(income_sources.items(), key=lambda x: x[1])[0] if income_sources else "None",
            "government_dependency": round(income_sources.get("Government Grant", 0) / total_income * 100, 1) if total_income > 0 else 0
        }
    
    async def _assess_financial_health(self, expenses: List, incomes: List, feelings: List) -> Dict[str, Any]:
        """Assess overall financial health"""
        total_expenses = sum(exp.expense_amount for exp in expenses)
        total_income = sum(inc.income_amount for inc in incomes)
        
        # Stress indicators
        stress_indicators = []
        if total_expenses > total_income:
            stress_indicators.append("Spending exceeds income")
        if total_income < 3000:  # Below minimum wage
            stress_indicators.append("Income below recommended minimum")
        
        # Analyze feelings
        feeling_counts = {}
        for feeling in feelings:
            feeling_counts[feeling.feeling] = feeling_counts.get(feeling.feeling, 0) + 1
        
        worried_feelings = feeling_counts.get("Very Worried", 0) + feeling_counts.get("Worried", 0)
        total_feelings = sum(feeling_counts.values())
        stress_percentage = (worried_feelings / total_feelings * 100) if total_feelings > 0 else 0
        
        return {
            "stress_indicators": stress_indicators,
            "financial_stress_level": round(stress_percentage, 1),
            "feeling_distribution": feeling_counts,
            "health_score": self._calculate_health_score(total_income, total_expenses, stress_percentage)
        }
    
    def _calculate_health_score(self, income: float, expenses: float, stress_percentage: float) -> Dict[str, Any]:
        """Calculate a simple financial health score"""
        score = 100
        
        # Deduct for overspending
        if expenses > income:
            score -= 30
        
        # Deduct for high stress
        score -= (stress_percentage * 0.5)
        
        # Deduct for very low income
        if income < 2000:
            score -= 20
        
        score = max(0, min(100, score))
        
        if score >= 80:
            status = "Excellent"
        elif score >= 60:
            status = "Good"
        elif score >= 40:
            status = "Fair"
        else:
            status = "Needs Attention"
            
        return {"score": round(score, 1), "status": status}
    
    async def _categorize_expenses(self, expenses: List) -> Dict[str, Any]:
        """Categorize expenses for better understanding"""
        categories = {}
        for exp in expenses:
            category = exp.expense_type.split(' - ')[0]  # Get main category
            if category not in categories:
                categories[category] = {"total": 0, "count": 0, "items": []}
            categories[category]["total"] += exp.expense_amount
            categories[category]["count"] += 1
            categories[category]["items"].append({
                "description": exp.expense_type,
                "amount": exp.expense_amount,
                "date": exp.expense_date.strftime('%Y-%m-%d')
            })
        
        # Sort by total spending
        sorted_categories = dict(sorted(categories.items(), key=lambda x: x[1]["total"], reverse=True))
        
        return {
            "by_category": {cat: {"total": round(data["total"], 2), "count": data["count"]} 
                          for cat, data in sorted_categories.items()},
            "top_spending_category": list(sorted_categories.keys())[0] if sorted_categories else "None"
        }
    
    async def _analyze_monthly_trends(self, expenses: List, incomes: List) -> Dict[str, Any]:
        """Analyze monthly trends"""
        monthly_expenses = {}
        monthly_incomes = {}
        
        for exp in expenses:
            month_key = exp.expense_date.strftime('%Y-%m')
            monthly_expenses[month_key] = monthly_expenses.get(month_key, 0) + exp.expense_amount
        
        for inc in incomes:
            month_key = inc.income_date.strftime('%Y-%m')
            monthly_incomes[month_key] = monthly_incomes.get(month_key, 0) + inc.income_amount
        
        return {
            "monthly_expenses": {month: round(amount, 2) for month, amount in monthly_expenses.items()},
            "monthly_incomes": {month: round(amount, 2) for month, amount in monthly_incomes.items()},
            "trend_direction": self._calculate_trend(monthly_expenses)
        }
    
    def _calculate_trend(self, monthly_data: Dict) -> str:
        """Calculate if spending is increasing or decreasing"""
        if len(monthly_data) < 2:
            return "Insufficient data"
        
        values = list(monthly_data.values())
        recent_avg = sum(values[-2:]) / 2
        earlier_avg = sum(values[:-2]) / len(values[:-2]) if len(values) > 2 else values[0]
        
        if recent_avg > earlier_avg * 1.1:
            return "Increasing"
        elif recent_avg < earlier_avg * 0.9:
            return "Decreasing"
        else:
            return "Stable"
    
    async def _generate_actionable_insights(self, expenses: List, incomes: List) -> List[str]:
        """Generate actionable insights for lower-income users"""
        insights = []
        total_expenses = sum(exp.expense_amount for exp in expenses)
        total_income = sum(inc.income_amount for inc in incomes)
        
        # Spending insights
        if total_expenses > total_income:
            insights.append("⚠️ You're spending more than you earn. Consider reducing non-essential expenses.")
        
        # Category-specific insights
        food_spending = sum(exp.expense_amount for exp in expenses if "Food" in exp.expense_type)
        if food_spending > total_income * 0.4:
            insights.append("🍽️ Food spending is high. Consider buying in bulk or cooking at home more.")
        
        transport_spending = sum(exp.expense_amount for exp in expenses if "Transport" in exp.expense_type)
        if transport_spending > total_income * 0.2:
            insights.append("🚌 Transport costs are significant. Look for cheaper routes or carpooling options.")
        
        # Income insights
        income_sources = set(inc.income_type.split(' - ')[0] for inc in incomes)
        if len(income_sources) == 1:
            insights.append("💼 Consider diversifying income sources for financial security.")
        
        # Positive reinforcement
        if total_income > total_expenses:
            savings = total_income - total_expenses
            insights.append(f"✅ Great job! You saved R{savings:.2f} this period.")
        
        return insights
    
    async def _assess_emergency_preparedness(self, expenses: List, incomes: List) -> Dict[str, Any]:
        """Assess emergency fund preparedness"""
        monthly_expenses = sum(exp.expense_amount for exp in expenses) / 6  # Average monthly
        total_income = sum(inc.income_amount for inc in incomes)
        total_expenses = sum(exp.expense_amount for exp in expenses)
        potential_savings = total_income - total_expenses
        
        # Calculate how many months of expenses they could cover
        months_covered = (potential_savings / monthly_expenses) if monthly_expenses > 0 else 0
        
        recommendation = ""
        if months_covered < 1:
            recommendation = "Try to save at least R50-100 per month for emergencies"
        elif months_covered < 3:
            recommendation = "You're building an emergency fund! Aim for 3 months of expenses"
        else:
            recommendation = "Excellent! You have good emergency savings"
        
        return {
            "monthly_expense_average": round(monthly_expenses, 2),
            "months_covered": round(months_covered, 1),
            "emergency_fund_status": "Good" if months_covered >= 3 else "Building" if months_covered >= 1 else "Critical",
            "recommendation": recommendation
        }