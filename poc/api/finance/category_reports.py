# api/utils/category_reports.py
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from api.db.models.tables import UnverifiedExpenses, UnverifiedIncomes, FinancialFeelings
from api.db.query_manager import AsyncQueries
from api.db.db_manager import DatabaseManager
import calendar
from collections import defaultdict

class CategoryReportGenerator:
    """Generate detailed reports for specific financial categories"""
    
    def __init__(self, user_id: int):
        self.user_id = user_id
    
    async def generate_expenses_report(self, months_back: int = 6) -> Dict[str, Any]:
        """Generate detailed expense-focused report"""
        
        async with DatabaseManager().session_scope() as session:
            query_manager = AsyncQueries(session=session)
            
            end_date = datetime.now()
            start_date = end_date - timedelta(days=months_back * 30)
            
            expenses = await query_manager.get_user_expenses_by_date_range(
                user_id=self.user_id, start_date=start_date, end_date=end_date
            )
            
            if not expenses:
                return {"error": "No expense data found for the specified period"}
            
            report = {
                "report_type": "Expenses Analysis",
                "period": f"{start_date.strftime('%B %Y')} to {end_date.strftime('%B %Y')}",
                "summary": await self._expense_summary(expenses),
                "category_analysis": await self._detailed_category_analysis(expenses),
                "spending_patterns": await self._expense_spending_patterns(expenses),
                "cost_cutting_opportunities": await self._identify_cost_cutting(expenses),
                "spending_triggers": await self._analyze_spending_triggers(expenses),
                "recommendations": await self._expense_recommendations(expenses)
            }
            
            return report
    
    async def generate_incomes_report(self, months_back: int = 6) -> Dict[str, Any]:
        """Generate detailed income-focused report"""
        
        async with DatabaseManager().session_scope() as session:
            query_manager = AsyncQueries(session=session)
            
            end_date = datetime.now()
            start_date = end_date - timedelta(days=months_back * 30)
            
            incomes = await query_manager.get_user_incomes_by_date_range(
                user_id=self.user_id, start_date=start_date, end_date=end_date
            )
            
            if not incomes:
                return {"error": "No income data found for the specified period"}
            
            report = {
                "report_type": "Income Analysis",
                "period": f"{start_date.strftime('%B %Y')} to {end_date.strftime('%B %Y')}",
                "summary": await self._income_summary(incomes),
                "source_analysis": await self._detailed_income_source_analysis(incomes),
                "stability_analysis": await self._income_stability_analysis(incomes),
                "growth_opportunities": await self._identify_income_opportunities(incomes),
                "diversification_score": await self._calculate_income_diversification(incomes),
                "recommendations": await self._income_recommendations(incomes)
            }
            
            return report
    
    async def generate_feelings_report(self, months_back: int = 6) -> Dict[str, Any]:
        """Generate detailed financial feelings/wellness report"""
        
        async with DatabaseManager().session_scope() as session:
            query_manager = AsyncQueries(session=session)
            
            end_date = datetime.now()
            start_date = end_date - timedelta(days=months_back * 30)
            
            feelings = await query_manager.get_user_feelings_by_date_range(
                user_id=self.user_id, start_date=start_date, end_date=end_date
            )
            
            # Also get expenses and incomes for correlation analysis
            expenses = await query_manager.get_user_expenses_by_date_range(
                user_id=self.user_id, start_date=start_date, end_date=end_date
            )
            incomes = await query_manager.get_user_incomes_by_date_range(
                user_id=self.user_id, start_date=start_date, end_date=end_date
            )
            
            if not feelings:
                return {"error": "No financial feelings data found for the specified period"}
            
            report = {
                "report_type": "Financial Wellness Analysis",
                "period": f"{start_date.strftime('%B %Y')} to {end_date.strftime('%B %Y')}",
                "summary": await self._feelings_summary(feelings),
                "stress_analysis": await self._analyze_financial_stress(feelings),
                "correlation_analysis": await self._correlate_feelings_with_finances(feelings, expenses, incomes),
                "wellness_trends": await self._analyze_wellness_trends(feelings),
                "support_recommendations": await self._wellness_recommendations(feelings),
                "mental_health_insights": await self._mental_health_insights(feelings)
            }
            
            return report
    
    # EXPENSE REPORT METHODS
    async def _expense_summary(self, expenses: List) -> Dict[str, Any]:
        """Detailed expense summary"""
        total_expenses = sum(exp.expense_amount for exp in expenses)
        avg_daily = total_expenses / 180  # 6 months ≈ 180 days
        
        # Find largest and smallest expenses
        largest_expense = max(expenses, key=lambda x: x.expense_amount)
        smallest_expense = min(expenses, key=lambda x: x.expense_amount)
        
        return {
            "total_expenses": round(total_expenses, 2),
            "average_daily_spending": round(avg_daily, 2),
            "total_transactions": len(expenses),
            "average_transaction_size": round(total_expenses / len(expenses), 2),
            "largest_expense": {
                "amount": largest_expense.expense_amount,
                "type": largest_expense.expense_type,
                "date": largest_expense.expense_date.strftime('%Y-%m-%d')
            },
            "smallest_expense": {
                "amount": smallest_expense.expense_amount,
                "type": smallest_expense.expense_type,
                "date": smallest_expense.expense_date.strftime('%Y-%m-%d')
            }
        }
    
    async def _detailed_category_analysis(self, expenses: List) -> Dict[str, Any]:
        """Deep dive into expense categories"""
        categories = defaultdict(lambda: {"total": 0, "count": 0, "avg": 0, "transactions": []})
        
        for exp in expenses:
            category = exp.expense_type.split(' - ')[0]
            categories[category]["total"] += exp.expense_amount
            categories[category]["count"] += 1
            categories[category]["transactions"].append({
                "amount": exp.expense_amount,
                "description": exp.expense_type,
                "date": exp.expense_date.strftime('%Y-%m-%d'),
                "feeling": exp.expense_feeling
            })
        
        # Calculate averages and sort
        for category in categories:
            categories[category]["avg"] = categories[category]["total"] / categories[category]["count"]
        
        sorted_categories = dict(sorted(categories.items(), key=lambda x: x[1]["total"], reverse=True))
        
        # Essential vs Non-essential classification
        essential_categories = ["Food & Groceries", "Transport", "Utilities", "Housing", "Healthcare", "Education"]
        essential_total = sum(data["total"] for cat, data in sorted_categories.items() if cat in essential_categories)
        non_essential_total = sum(data["total"] for cat, data in sorted_categories.items() if cat not in essential_categories)
        
        return {
            "category_breakdown": {
                cat: {
                    "total": round(data["total"], 2),
                    "count": data["count"],
                    "average": round(data["avg"], 2),
                    "percentage": round((data["total"] / sum(d["total"] for d in categories.values())) * 100, 1)
                } for cat, data in sorted_categories.items()
            },
            "essential_vs_non_essential": {
                "essential_total": round(essential_total, 2),
                "non_essential_total": round(non_essential_total, 2),
                "essential_percentage": round((essential_total / (essential_total + non_essential_total)) * 100, 1)
            },
            "top_spending_category": list(sorted_categories.keys())[0],
            "most_frequent_category": max(categories.items(), key=lambda x: x[1]["count"])[0]
        }
    
    async def _expense_spending_patterns(self, expenses: List) -> Dict[str, Any]:
        """Analyze spending patterns and timing"""
        # Day of week analysis
        day_spending = defaultdict(list)
        for exp in expenses:
            day_name = exp.expense_date.strftime('%A')
            day_spending[day_name].append(exp.expense_amount)
        
        day_analysis = {
            day: {
                "total": round(sum(amounts), 2),
                "count": len(amounts),
                "average": round(sum(amounts) / len(amounts), 2)
            } for day, amounts in day_spending.items()
        }
        
        # Time of month analysis
        month_part_spending = {"Beginning": 0, "Middle": 0, "End": 0}
        for exp in expenses:
            day = exp.expense_date.day
            if day <= 10:
                month_part_spending["Beginning"] += exp.expense_amount
            elif day <= 20:
                month_part_spending["Middle"] += exp.expense_amount
            else:
                month_part_spending["End"] += exp.expense_amount
        
        return {
            "day_of_week_analysis": day_analysis,
            "peak_spending_day": max(day_analysis.items(), key=lambda x: x[1]["total"])[0],
            "month_part_spending": {k: round(v, 2) for k, v in month_part_spending.items()},
            "spending_frequency": len(expenses) / 180,  # transactions per day
        }
    
    async def _identify_cost_cutting(self, expenses: List) -> List[Dict[str, Any]]:
        """Identify specific cost-cutting opportunities"""
        opportunities = []
        
        # Analyze categories for potential savings
        categories = defaultdict(lambda: {"total": 0, "count": 0})
        for exp in expenses:
            category = exp.expense_type.split(' - ')[0]
            categories[category]["total"] += exp.expense_amount
            categories[category]["count"] += 1
        
        total_spending = sum(exp.expense_amount for exp in expenses)
        
        # Food spending analysis
        food_total = categories.get("Food & Groceries", {}).get("total", 0)
        if food_total > total_spending * 0.35:
            opportunities.append({
                "category": "Food & Groceries",
                "current_spending": round(food_total, 2),
                "potential_savings": round(food_total * 0.15, 2),
                "recommendation": "Consider bulk buying, cooking at home more, or shopping at cheaper stores",
                "priority": "High"
            })
        
        # Transport analysis
        transport_total = categories.get("Transport", {}).get("total", 0)
        if transport_total > total_spending * 0.25:
            opportunities.append({
                "category": "Transport",
                "current_spending": round(transport_total, 2),
                "potential_savings": round(transport_total * 0.20, 2),
                "recommendation": "Look for carpooling, cheaper routes, or walking for short distances",
                "priority": "Medium"
            })
        
        # Small frequent expenses
        small_expenses = [exp for exp in expenses if exp.expense_amount < 50]
        if len(small_expenses) > 50:  # More than 50 small transactions
            small_total = sum(exp.expense_amount for exp in small_expenses)
            opportunities.append({
                "category": "Small Purchases",
                "current_spending": round(small_total, 2),
                "potential_savings": round(small_total * 0.30, 2),
                "recommendation": "Track and reduce small daily purchases like snacks, airtime top-ups",
                "priority": "Medium"
            })
        
        return opportunities
    
    async def _analyze_spending_triggers(self, expenses: List) -> Dict[str, Any]:
        """Analyze what triggers spending"""
        # Analyze spending by feelings
        feeling_spending = defaultdict(list)
        for exp in expenses:
            if exp.expense_feeling:
                feeling_spending[exp.expense_feeling].append(exp.expense_amount)
        
        feeling_analysis = {
            feeling: {
                "total": round(sum(amounts), 2),
                "count": len(amounts),
                "average": round(sum(amounts) / len(amounts), 2)
            } for feeling, amounts in feeling_spending.items()
        }
        
        # Weekend vs weekday spending
        weekend_spending = []
        weekday_spending = []
        for exp in expenses:
            if exp.expense_date.weekday() >= 5:  # Saturday = 5, Sunday = 6
                weekend_spending.append(exp.expense_amount)
            else:
                weekday_spending.append(exp.expense_amount)
        
        return {
            "emotional_triggers": feeling_analysis,
            "weekend_vs_weekday": {
                "weekend_total": round(sum(weekend_spending), 2),
                "weekday_total": round(sum(weekday_spending), 2),
                "weekend_average": round(sum(weekend_spending) / len(weekend_spending), 2) if weekend_spending else 0,
                "weekday_average": round(sum(weekday_spending) / len(weekday_spending), 2) if weekday_spending else 0
            }
        }
    
    async def _expense_recommendations(self, expenses: List) -> List[str]:
        """Generate expense-specific recommendations"""
        recommendations = []
        total_spending = sum(exp.expense_amount for exp in expenses)
        
        # Category-based recommendations
        categories = defaultdict(float)
        for exp in expenses:
            category = exp.expense_type.split(' - ')[0]
            categories[category] += exp.expense_amount
        
        # Food recommendations
        if categories.get("Food & Groceries", 0) > total_spending * 0.4:
            recommendations.append("🍽️ Food spending is high. Try meal planning, bulk buying, and cooking at home more often.")
        
        # Transport recommendations
        if categories.get("Transport", 0) > total_spending * 0.25:
            recommendations.append("🚌 Consider carpooling, using public transport, or walking for short distances to reduce transport costs.")
        
        # Social spending
        if categories.get("Social", 0) > total_spending * 0.15:
            recommendations.append("👥 Social contributions are significant. Consider setting a monthly limit for stokvels and social events.")
        
        # General recommendations
        recommendations.append("📱 Track your daily spending using a simple notebook or phone app.")
        recommendations.append("🎯 Set weekly spending limits for non-essential categories.")
        recommendations.append("💡 Before buying, ask yourself: 'Do I really need this right now?'")
        
        return recommendations
    
    # INCOME REPORT METHODS
    async def _income_summary(self, incomes: List) -> Dict[str, Any]:
        """Detailed income summary"""
        total_income = sum(inc.income_amount for inc in incomes)
        
        # Find largest and most frequent income sources
        largest_income = max(incomes, key=lambda x: x.income_amount)
        
        # Monthly average
        monthly_avg = total_income / 6  # 6 months
        
        return {
            "total_income": round(total_income, 2),
            "monthly_average": round(monthly_avg, 2),
            "total_income_events": len(incomes),
            "average_income_per_event": round(total_income / len(incomes), 2),
            "largest_income": {
                "amount": largest_income.income_amount,
                "type": largest_income.income_type,
                "date": largest_income.income_date.strftime('%Y-%m-%d')
            }
        }
    
    async def _detailed_income_source_analysis(self, incomes: List) -> Dict[str, Any]:
        """Deep dive into income sources"""
        sources = defaultdict(lambda: {"total": 0, "count": 0, "transactions": []})
        
        for inc in incomes:
            source = inc.income_type.split(' - ')[0]
            sources[source]["total"] += inc.income_amount
            sources[source]["count"] += 1
            sources[source]["transactions"].append({
                "amount": inc.income_amount,
                "description": inc.income_type,
                "date": inc.income_date.strftime('%Y-%m-%d'),
                "feeling": inc.income_feeling
            })
        
        # Calculate percentages
        total_income = sum(data["total"] for data in sources.values())
        
        return {
            "source_breakdown": {
                source: {
                    "total": round(data["total"], 2),
                    "count": data["count"],
                    "average": round(data["total"] / data["count"], 2),
                    "percentage": round((data["total"] / total_income) * 100, 1)
                } for source, data in sources.items()
            },
            "primary_income_source": max(sources.items(), key=lambda x: x[1]["total"])[0],
            "most_frequent_source": max(sources.items(), key=lambda x: x[1]["count"])[0]
        }
    
    async def _income_stability_analysis(self, incomes: List) -> Dict[str, Any]:
        """Analyze income stability and predictability"""
        # Monthly income analysis
        monthly_income = defaultdict(float)
        for inc in incomes:
            month_key = inc.income_date.strftime('%Y-%m')
            monthly_income[month_key] += inc.income_amount
        
        monthly_amounts = list(monthly_income.values())
        if len(monthly_amounts) > 1:
            avg_monthly = sum(monthly_amounts) / len(monthly_amounts)
            variance = sum((x - avg_monthly) ** 2 for x in monthly_amounts) / len(monthly_amounts)
            stability_score = max(0, 100 - (variance / avg_monthly * 100))
        else:
            stability_score = 50  # Neutral score for insufficient data
        
        # Regular vs irregular income
        employment_income = sum(inc.income_amount for inc in incomes if "Employment" in inc.income_type)
        grant_income = sum(inc.income_amount for inc in incomes if "Government Grant" in inc.income_type)
        irregular_income = sum(inc.income_amount for inc in incomes if "Informal" in inc.income_type or "Other" in inc.income_type)
        
        total_income = employment_income + grant_income + irregular_income
        
        return {
            "stability_score": round(stability_score, 1),
            "monthly_income_trend": {month: round(amount, 2) for month, amount in monthly_income.items()},
            "income_predictability": {
                "regular_income": round(employment_income + grant_income, 2),
                "irregular_income": round(irregular_income, 2),
                "regular_percentage": round(((employment_income + grant_income) / total_income) * 100, 1) if total_income > 0 else 0
            }
        }
    
    async def _identify_income_opportunities(self, incomes: List) -> List[Dict[str, Any]]:
        """Identify income growth opportunities"""
        opportunities = []
        
        # Analyze current income sources
        sources = defaultdict(float)
        for inc in incomes:
            source = inc.income_type.split(' - ')[0]
            sources[source] += inc.income_amount
        
        total_income = sum(sources.values())
        
        # Government grant optimization
        if sources.get("Government Grant", 0) < 1000:  # Low grant income
            opportunities.append({
                "type": "Government Grants",
                "description": "Check if you qualify for additional government grants",
                "potential_monthly_increase": "R350-R500",
                "action_required": "Visit SASSA office or check online eligibility",
                "priority": "High"
            })
        
        # Informal work expansion
        if sources.get("Informal Work", 0) > 0:
            opportunities.append({
                "type": "Informal Work Expansion",
                "description": "Grow your existing informal work activities",
                "potential_monthly_increase": "R200-R800",
                "action_required": "Increase hours, find more customers, or raise prices",
                "priority": "Medium"
            })
        
        # Skills development
        if sources.get("Employment", 0) < 5000:
            opportunities.append({
                "type": "Skills Development",
                "description": "Learn new skills to increase employment income",
                "potential_monthly_increase": "R500-R2000",
                "action_required": "Take online courses, attend workshops, or get certifications",
                "priority": "Long-term"
            })
        
        return opportunities
    
    async def _calculate_income_diversification(self, incomes: List) -> Dict[str, Any]:
        """Calculate income diversification score"""
        sources = set(inc.income_type.split(' - ')[0] for inc in incomes)
        diversification_score = min(len(sources) * 25, 100)  # Max 4 sources = 100%
        
        risk_assessment = "Low Risk" if diversification_score >= 75 else "Medium Risk" if diversification_score >= 50 else "High Risk"
        
        return {
            "diversification_score": diversification_score,
            "number_of_sources": len(sources),
            "risk_level": risk_assessment,
            "recommendation": "Excellent diversification!" if diversification_score >= 75 
                           else "Consider adding more income sources" if diversification_score >= 50 
                           else "High dependency on few sources - diversify urgently"
        }
    
    async def _income_recommendations(self, incomes: List) -> List[str]:
        """Generate income-specific recommendations"""
        recommendations = []
        
        sources = defaultdict(float)
        for inc in incomes:
            source = inc.income_type.split(' - ')[0]
            sources[source] += inc.income_amount
        
        # Source-specific recommendations
        if len(sources) == 1:
            recommendations.append("💼 Consider diversifying your income sources to reduce financial risk.")
        
        if sources.get("Government Grant", 0) > 0:
            recommendations.append("🏛️ Ensure you're receiving all government grants you're eligible for.")
        
        if sources.get("Informal Work", 0) > sources.get("Employment", 0):
            recommendations.append("📈 Consider formalizing some of your informal work for better income security.")
        
        # General recommendations
        recommendations.append("📚 Invest in learning new skills that can increase your earning potential.")
        recommendations.append("🤝 Network with others in your community for job and income opportunities.")
        recommendations.append("💡 Look for ways to monetize your existing skills and hobbies.")
        
        return recommendations
    
    # FEELINGS REPORT METHODS
    async def _feelings_summary(self, feelings: List) -> Dict[str, Any]:
        """Summary of financial feelings"""
        feeling_counts = defaultdict(int)
        for feeling in feelings:
            feeling_counts[feeling.feeling] += 1
        
        total_entries = len(feelings)
        most_common_feeling = max(feeling_counts.items(), key=lambda x: x[1])[0] if feeling_counts else "No data"
        
        # Calculate stress level
        stressed_feelings = feeling_counts.get("Very Worried", 0) + feeling_counts.get("Worried", 0)
        stress_percentage = (stressed_feelings / total_entries * 100) if total_entries > 0 else 0
        
        return {
            "total_feeling_entries": total_entries,
            "feeling_distribution": dict(feeling_counts),
            "most_common_feeling": most_common_feeling,
            "stress_level_percentage": round(stress_percentage, 1),
            "wellness_status": "High Stress" if stress_percentage > 60 else "Moderate Stress" if stress_percentage > 30 else "Good Wellness"
        }
    
    async def _analyze_financial_stress(self, feelings: List) -> Dict[str, Any]:
        """Detailed stress analysis"""
        # Trend analysis
        monthly_stress = defaultdict(list)
        for feeling in feelings:
            month_key = feeling.feeling_date.strftime('%Y-%m')
            stress_score = {"Very Worried": 5, "Worried": 4, "Getting By": 3, "Okay": 2, "Doing Well": 1}.get(feeling.feeling, 3)
            monthly_stress[month_key].append(stress_score)
        
        monthly_avg_stress = {
            month: round(sum(scores) / len(scores), 1) 
            for month, scores in monthly_stress.items()
        }
        
        return {
            "monthly_stress_trends": monthly_avg_stress,
            "stress_trend_direction": self._calculate_stress_trend(monthly_avg_stress),
            "high_stress_periods": [month for month, avg in monthly_avg_stress.items() if avg >= 4],
            "low_stress_periods": [month for month, avg in monthly_avg_stress.items() if avg <= 2]
        }
    
    def _calculate_stress_trend(self, monthly_stress: Dict) -> str:
        """Calculate if stress is increasing or decreasing"""
        if len(monthly_stress) < 2:
            return "Insufficient data"
        
        values = list(monthly_stress.values())
        recent_avg = sum(values[-2:]) / 2
        earlier_avg = sum(values[:-2]) / len(values[:-2]) if len(values) > 2 else values[0]
        
        if recent_avg > earlier_avg + 0.5:
            return "Increasing Stress"
        elif recent_avg < earlier_avg - 0.5:
            return "Decreasing Stress"
        else:
            return "Stable"
    
    async def _correlate_feelings_with_finances(self, feelings: List, expenses: List, incomes: List) -> Dict[str, Any]:
        """Correlate feelings with financial events"""
        correlations = []
        
        # Group financial events by date
        daily_expenses = defaultdict(float)
        daily_incomes = defaultdict(float)
        
        for exp in expenses:
            date_key = exp.expense_date.strftime('%Y-%m-%d')
            daily_expenses[date_key] += exp.expense_amount
        
        for inc in incomes:
            date_key = inc.income_date.strftime('%Y-%m-%d')
            daily_incomes[date_key] += inc.income_amount
        
        # Analyze feelings around high expense days
        high_expense_days = [date for date, amount in daily_expenses.items() if amount > 500]
        feelings_on_high_expense_days = [
            f.feeling for f in feelings 
            if f.feeling_date.strftime('%Y-%m-%d') in high_expense_days
        ]
        
        return {
            "high_expense_day_feelings": feelings_on_high_expense_days,
            "correlation_insights": [
                f"You tend to feel {feeling} on days with high expenses" 
                for feeling in set(feelings_on_high_expense_days) 
                if feelings_on_high_expense_days.count(feeling) > 1
            ]
        }
    
    async def _analyze_wellness_trends(self, feelings: List) -> Dict[str, Any]:
        """Analyze wellness trends over time"""
        # Weekly wellness analysis
        weekly_wellness = defaultdict(list)
        for feeling in feelings:
            week_key = feeling.feeling_date.strftime('%Y-W%U')
            wellness_score = {"Doing Well": 5, "Okay": 4, "Getting By": 3, "Worried": 2, "Very Worried": 1}.get(feeling.feeling, 3)
            weekly_wellness[week_key].append(wellness_score)
        
        weekly_avg_wellness = {
            week: round(sum(scores) / len(scores), 1) 
            for week, scores in weekly_wellness.items()
        }
        
        return {
            "weekly_wellness_scores": weekly_avg_wellness,
            "wellness_trend": self._calculate_wellness_trend(weekly_avg_wellness),
            "best_wellness_week": max(weekly_avg_wellness.items(), key=lambda x: x[1])[0] if weekly_avg_wellness else "No data",
            "worst_wellness_week": min(weekly_avg_wellness.items(), key=lambda x: x[1])[0] if weekly_avg_wellness else "No data"
        }
    
    def _calculate_wellness_trend(self, weekly_wellness: Dict) -> str:
        """Calculate wellness trend direction"""
        if len(weekly_wellness) < 2:
            return "Insufficient data"
        
        values = list(weekly_wellness.values())
        recent_avg = sum(values[-2:]) / 2
        earlier_avg = sum(values[:-2]) / len(values[:-2]) if len(values) > 2 else values[0]
        
        if recent_avg > earlier_avg + 0.5:
            return "Improving"
        elif recent_avg < earlier_avg - 0.5:
            return "Declining"
        else:
            return "Stable"
    
    async def _wellness_recommendations(self, feelings: List) -> List[str]:
        """Generate wellness-focused recommendations"""
        recommendations = []
        
        feeling_counts = defaultdict(int)
        for feeling in feelings:
            feeling_counts[feeling.feeling] += 1
        
        total_entries = len(feelings)
        stressed_percentage = ((feeling_counts.get("Very Worried", 0) + feeling_counts.get("Worried", 0)) / total_entries * 100) if total_entries > 0 else 0
        
        if stressed_percentage > 50:
            recommendations.append("🧘 Consider stress management techniques like deep breathing or meditation.")
            recommendations.append("👥 Talk to trusted friends or family about your financial concerns.")
            recommendations.append("📞 Contact a financial counselor or community support group.")
        
        recommendations.append("📝 Keep tracking your feelings - awareness is the first step to improvement.")
        recommendations.append("🎯 Set small, achievable financial goals to build confidence.")
        recommendations.append("💪 Celebrate small financial wins to boost your mood.")
        
        return recommendations
    
    async def _mental_health_insights(self, feelings: List) -> Dict[str, Any]:
        """Mental health insights related to finances"""
        feeling_counts = defaultdict(int)
        for feeling in feelings:
            feeling_counts[feeling.feeling] += 1
        
        total_entries = len(feelings)
        
        # Risk assessment
        high_stress_count = feeling_counts.get("Very Worried", 0)
        risk_level = "High" if high_stress_count > total_entries * 0.4 else "Medium" if high_stress_count > total_entries * 0.2 else "Low"
        
        return {
            "mental_health_risk_level": risk_level,
            "support_needed": risk_level in ["High", "Medium"],
            "positive_feelings_percentage": round(((feeling_counts.get("Okay", 0) + feeling_counts.get("Doing Well", 0)) / total_entries * 100), 1) if total_entries > 0 else 0,
            "support_resources": [
                "SADAG (South African Depression and Anxiety Group): 0800 567 567",
                "Lifeline: 0861 322 322",
                "Local community health centers",
                "Financial counseling services"
            ] if risk_level in ["High", "Medium"] else []
        }