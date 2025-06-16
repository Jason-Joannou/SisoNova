import pandas as pd
from typing import Dict, List
from api.db.models.tables import UnverifiedIncomes

class IncomeBehaviouralInsights:

    def __init__(self) -> None:
        self.feeling_scores = {
            "Very Worried": -2,
            "Worried": -1,
            "Getting By": 0,
            "Okay": 1,
            "Doing Well": 2
        }

    def analyze_behavioral_triggers(self, incomes: List[UnverifiedIncomes], expenses=None) -> Dict:
        """Find specific behavioral triggers and patterns that users can act on"""
        
        print(f"DEBUG: Total incomes received: {len(incomes)}")
        
        # Filter data with feelings
        income_feelings = [inc for inc in incomes if inc.income_feeling]
        print(f"DEBUG: Incomes with feelings: {len(income_feelings)}")
        
        # Debug what feelings we have
        if income_feelings:
            feelings_list = [inc.income_feeling for inc in income_feelings]
            print(f"DEBUG: Feelings found: {feelings_list}")
            amounts_list = [inc.income_amount for inc in income_feelings]
            print(f"DEBUG: Income amounts: {amounts_list}")
        else:
            print("DEBUG: No income feelings found!")
            return {"has_data": False}
        
        insights = []
        
        # INSIGHT 1: Income Amount Behavior Triggers
        print("DEBUG: Checking income amount triggers...")
        income_triggers = self.find_income_amount_triggers(income_feelings)
        print(f"DEBUG: Income triggers found: {len(income_triggers)}")
        if income_triggers:
            insights.extend(income_triggers)
        
        # INSIGHT 2: Timing Behavior Patterns
        print("DEBUG: Checking timing patterns...")
        timing_patterns = self.find_timing_behavior_patterns(income_feelings)
        print(f"DEBUG: Timing patterns found: {len(timing_patterns)}")
        if timing_patterns:
            insights.extend(timing_patterns)
        
        # INSIGHT 3: Income Source Behavior Patterns
        print("DEBUG: Checking source patterns...")
        source_patterns = self.find_income_source_behavior_patterns(income_feelings)
        print(f"DEBUG: Source patterns found: {len(source_patterns)}")
        if source_patterns:
            insights.extend(source_patterns)
        
        print(f"DEBUG: Total insights generated: {len(insights)}")
        
        return {
            "has_data": True,
            "behavioral_insights": insights,
            "behavior_change_recommendations": self.generate_behavior_change_actions(insights)
        }

    def find_income_amount_triggers(self, income_feelings: List[UnverifiedIncomes]):
        """Find specific income amounts that trigger different behaviors"""
        insights = []
        
        # Group by income ranges and analyze feelings
        income_ranges = {
            'low': [],      # Bottom 33%
            'medium': [],   # Middle 33%
            'high': []      # Top 33%
        }
        
        amounts = [inc.income_amount for inc in income_feelings]
        amounts.sort()
        
        low_threshold = amounts[len(amounts)//3]
        high_threshold = amounts[2*len(amounts)//3]
        
        for inc in income_feelings:
            feeling_score = self.feeling_scores.get(inc.income_feeling, 0)
            
            if inc.income_amount <= low_threshold:
                income_ranges['low'].append(feeling_score)
            elif inc.income_amount >= high_threshold:
                income_ranges['high'].append(feeling_score)
            else:
                income_ranges['medium'].append(feeling_score)
        
        # Calculate averages
        avg_feelings = {}
        for range_name, scores in income_ranges.items():
            if scores:
                avg_feelings[range_name] = sum(scores) / len(scores)
        
        # Generate actionable insights
        if 'low' in avg_feelings and 'high' in avg_feelings:
            low_avg = avg_feelings['low']
            high_avg = avg_feelings['high']
            
            if high_avg - low_avg > 1.0:  # Significant difference
                insights.append({
                    "type": "income_amount_trigger",
                    "insight": f"You feel significantly better about higher income amounts (R{high_threshold:,.0f}+) vs lower amounts (under R{low_threshold:,.0f})",
                    "behavior_change": f"When you receive income under R{low_threshold:,.0f}, remind yourself it's still progress. Set a goal to increase your average income to R{high_threshold:,.0f}+",
                    "specific_action": f"Next time you get income under R{low_threshold:,.0f}, write down one thing you're grateful for about it before feeling disappointed"
                })
        
        # Find the "confidence threshold"
        confident_incomes = [inc for inc in income_feelings if self.feeling_scores.get(inc.income_feeling, 0) >= 1.0]
        if confident_incomes:
            min_confident_amount = min(inc.income_amount for inc in confident_incomes)
            insights.append({
                "type": "confidence_threshold",
                "insight": f"You start feeling confident about income at around R{min_confident_amount:,.0f}",
                "behavior_change": f"Use R{min_confident_amount:,.0f} as your 'confidence target' - work toward making this your minimum income",
                "specific_action": f"When planning income activities, prioritize those that can get you to R{min_confident_amount:,.0f} or more"
            })
        
        return insights
    
    def find_timing_behavior_patterns(self, income_feelings: List[UnverifiedIncomes]):
        """Find when during the month/week users feel different about income"""
        insights = []
        
        # Month timing analysis
        early_month = []  # Days 1-10
        mid_month = []    # Days 11-20
        late_month = []   # Days 21-31
        
        for inc in income_feelings:
            day = inc.income_date.day
            feeling_score = self.feeling_scores.get(inc.income_feeling, 0)
            
            if day <= 10:
                early_month.append(feeling_score)
            elif day <= 20:
                mid_month.append(feeling_score)
            else:
                late_month.append(feeling_score)
        
        # Calculate averages
        if early_month and late_month:
            early_avg = sum(early_month) / len(early_month)
            late_avg = sum(late_month) / len(late_month)
            
            if early_avg - late_avg > 0.5:  # Feel better early month
                insights.append({
                    "type": "monthly_timing_pattern",
                    "insight": f"You feel {early_avg - late_avg:.1f} points better about income early in the month vs late month",
                    "behavior_change": "Plan to pursue income opportunities in the first half of the month when you're more optimistic",
                    "specific_action": "Schedule income-generating activities (job applications, client calls, side hustles) for days 1-15 of each month"
                })
            elif late_avg - early_avg > 0.5:  # Feel better late month
                insights.append({
                    "type": "monthly_timing_pattern", 
                    "insight": f"You feel {late_avg - early_avg:.1f} points better about income late in the month",
                    "behavior_change": "Use your end-of-month optimism to plan next month's income strategies",
                    "specific_action": "In the last week of each month, spend 30 minutes planning how to increase next month's income"
                })
        
        # Day of week analysis
        weekday_feelings = {}
        for inc in income_feelings:
            day_name = inc.income_date.strftime('%A')
            feeling_score = self.feeling_scores.get(inc.income_feeling, 0)
            
            if day_name not in weekday_feelings:
                weekday_feelings[day_name] = []
            weekday_feelings[day_name].append(feeling_score)
        
        # Find best and worst days
        day_averages = {day: sum(scores)/len(scores) for day, scores in weekday_feelings.items() if len(scores) >= 2}
        
        if day_averages:
            best_day = max(day_averages, key=day_averages.get)
            worst_day = min(day_averages, key=day_averages.get)
            
            if day_averages[best_day] - day_averages[worst_day] > 0.5:
                insights.append({
                    "type": "weekly_timing_pattern",
                    "insight": f"You feel best about income on {best_day}s and worst on {worst_day}s",
                    "behavior_change": f"Schedule important income conversations and decisions for {best_day}s, avoid financial stress on {worst_day}s",
                    "specific_action": f"Move income-related tasks (asking for raises, invoicing clients, job interviews) to {best_day}s when possible"
                })
        
        return insights
    
    def find_income_source_behavior_patterns(self, income_feelings: List[UnverifiedIncomes]):
        """Find which income sources trigger different feelings and behaviors"""
        insights = []
        
        # Group by income source
        source_feelings = {}
        for inc in income_feelings:
            source = inc.income_type.lower()
            feeling_score = self.feeling_scores.get(inc.income_feeling, 0)
            
            # Categorize sources
            if 'grant' in source or 'sassa' in source:
                category = 'government_grants'
            elif 'employment' in source or 'salary' in source or 'wage' in source:
                category = 'employment'
            elif 'informal' in source or 'piece' in source or 'casual' in source:
                category = 'informal_work'
            else:
                category = 'other'
            
            if category not in source_feelings:
                source_feelings[category] = []
            source_feelings[category].append(feeling_score)
        
        # Calculate averages and find patterns
        source_averages = {source: sum(scores)/len(scores) for source, scores in source_feelings.items() if len(scores) >= 2}
        
        if len(source_averages) >= 2:
            best_source = max(source_averages, key=source_averages.get)
            worst_source = min(source_averages, key=source_averages.get)
            
            if source_averages[best_source] - source_averages[worst_source] > 0.5:
                insights.append({
                    "type": "income_source_pattern",
                    "insight": f"You feel {source_averages[best_source] - source_averages[worst_source]:.1f} points better about {best_source.replace('_', ' ')} than {worst_source.replace('_', ' ')}",
                    "behavior_change": f"Focus on growing your {best_source.replace('_', ' ')} income since it makes you feel more secure",
                    "specific_action": f"Spend 70% of your income-building time on {best_source.replace('_', ' ')} opportunities and only 30% on {worst_source.replace('_', ' ')}"
                })
        
        # Check for grant dependency patterns
        if 'government_grants' in source_averages and 'employment' in source_averages:
            grant_avg = source_averages['government_grants']
            employment_avg = source_averages['employment']
            
            if grant_avg > employment_avg + 0.3:
                insights.append({
                    "type": "grant_dependency_behavior",
                    "insight": "You feel more secure about government grants than employment income",
                    "behavior_change": "While grants provide security, gradually build employment income for long-term stability",
                    "specific_action": "Set a goal to make employment income feel as secure as grants by improving your job skills or finding more stable work"
                })
        
        return insights
    
    def generate_behavior_change_actions(self, insights):
        """Generate specific behavior change recommendations based on insights"""
        actions = []
        
        for insight in insights:
            if insight.get('specific_action'):
                actions.append(insight['specific_action'])
        
        # Add general behavior change actions
        actions.extend([
            "Track your feelings about income for 2 weeks to identify your personal patterns",
            "Before making financial decisions, ask: 'How am I feeling about money right now?'",
            "Use your 'good feeling' income days to plan future financial goals"
        ])
        
        return actions[:5]