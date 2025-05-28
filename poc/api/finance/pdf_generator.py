# api/utils/pdf_generator.py
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from datetime import datetime
import io
from typing import Dict, Any

class FinancialReportPDF:
    """Generate PDF financial reports for WhatsApp delivery"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            textColor=colors.darkblue
        )
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=12,
            spaceAfter=12,
            textColor=colors.darkgreen
        )
        self.subheading_style = ParagraphStyle(
            'CustomSubHeading',
            parent=self.styles['Heading3'],
            fontSize=10,
            spaceAfter=8,
            textColor=colors.darkred
        )
    
    def generate_financial_report_pdf(self, report_data: Dict[str, Any], user_phone: str) -> bytes:
        """Generate PDF from comprehensive financial report data"""
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)
        
        # Build the PDF content
        story = []
        
        # Title
        title = Paragraph("Your Financial Report", self.title_style)
        story.append(title)
        story.append(Spacer(1, 12))
        
        # Period
        period_text = f"Report Period: {report_data['period']}"
        story.append(Paragraph(period_text, self.styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Summary Section
        story.append(Paragraph("Financial Summary", self.heading_style))
        summary = report_data['summary']
        summary_data = [
            ['Total Income:', f"R {summary['total_income']:,.2f}"],
            ['Total Expenses:', f"R {summary['total_expenses']:,.2f}"],
            ['Net Position:', f"R {summary['net_position']:,.2f}"],
            ['Savings Rate:', f"{summary['savings_rate']}%"],
            ['Daily Spending:', f"R {summary['average_daily_spending']:,.2f}"],
            ['Status:', summary['financial_status']]
        ]
        
        summary_table = Table(summary_data, colWidths=[2*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(summary_table)
        story.append(Spacer(1, 20))
        
        # Category Breakdown
        story.append(Paragraph("Spending by Category", self.heading_style))
        categories = report_data['category_breakdown']['by_category']
        category_data = [['Category', 'Amount', 'Count']]
        for category, data in categories.items():
            category_data.append([category, f"R {data['total']:,.2f}", str(data['count'])])
        
        category_table = Table(category_data, colWidths=[2*inch, 1.5*inch, 1*inch])
        category_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkgreen),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightgreen),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(category_table)
        story.append(Spacer(1, 20))
        
        # Financial Health
        story.append(Paragraph("Financial Health Assessment", self.heading_style))
        health = report_data['financial_health']
        health_score = health['health_score']
        
        health_text = f"Health Score: {health_score['score']}/100 ({health_score['status']})"
        story.append(Paragraph(health_text, self.styles['Normal']))
        
        if health['stress_indicators']:
            story.append(Paragraph("Areas of Concern:", self.styles['Normal']))
            for indicator in health['stress_indicators']:
                story.append(Paragraph(f"• {indicator}", self.styles['Normal']))
        
        story.append(Spacer(1, 20))
        
        # Actionable Insights
        story.append(Paragraph("Recommendations", self.heading_style))
        insights = report_data['actionable_insights']
        for insight in insights:
            story.append(Paragraph(f"• {insight}", self.styles['Normal']))
        
        story.append(Spacer(1, 20))
        
        # Emergency Preparedness
        emergency = report_data['emergency_preparedness']
        story.append(Paragraph("Emergency Fund Status", self.heading_style))
        emergency_text = f"You can cover {emergency['months_covered']} months of expenses. {emergency['recommendation']}"
        story.append(Paragraph(emergency_text, self.styles['Normal']))
        
        # Footer
        story.append(Spacer(1, 30))
        footer_text = f"Report generated on {datetime.now().strftime('%Y-%m-%d %H:%M')} for {user_phone}"
        story.append(Paragraph(footer_text, self.styles['Normal']))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def generate_category_report_pdf(self, report_data: Dict[str, Any], report_type: str, user_phone: str) -> bytes:
        """Generate PDF for category-specific reports (expenses, incomes, feelings)"""
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)
        
        story = []
        
        # Determine report title and structure based on type
        if report_type == "expenses":
            title = "Expense Analysis Report"
            story.extend(self._build_expense_pdf_content(report_data))
        elif report_type == "incomes":
            title = "Income Analysis Report"
            story.extend(self._build_income_pdf_content(report_data))
        elif report_type == "feelings":
            title = "Financial Wellness Report"
            story.extend(self._build_feelings_pdf_content(report_data))
        else:
            # Fallback to comprehensive report
            title = "Financial Report"
            story.extend(self._build_comprehensive_pdf_content(report_data))
        
        # Add title at the beginning
        title_paragraph = Paragraph(title, self.title_style)
        story.insert(0, title_paragraph)
        story.insert(1, Spacer(1, 12))
        
        # Add period if available
        if 'period' in report_data:
            period_text = f"Report Period: {report_data['period']}"
            story.insert(2, Paragraph(period_text, self.styles['Normal']))
            story.insert(3, Spacer(1, 20))
        
        # Add footer
        story.append(Spacer(1, 30))
        footer_text = f"Report generated on {datetime.now().strftime('%Y-%m-%d %H:%M')} for {user_phone}"
        story.append(Paragraph(footer_text, self.styles['Normal']))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def _build_expense_pdf_content(self, report_data: Dict[str, Any]) -> list:
        """Build PDF content for expense reports"""
        story = []
        
        # Summary Section
        if 'summary' in report_data:
            story.append(Paragraph("Expense Summary", self.heading_style))
            summary = report_data['summary']
            
            summary_data = [
                ['Total Expenses:', f"R {summary.get('total_expenses', 0):,.2f}"],
                ['Daily Average:', f"R {summary.get('average_daily_spending', 0):,.2f}"],
                ['Total Transactions:', str(summary.get('total_transactions', 0))],
                ['Average per Transaction:', f"R {summary.get('average_transaction_size', 0):,.2f}"]
            ]
            
            if 'largest_expense' in summary:
                largest = summary['largest_expense']
                summary_data.append(['Largest Expense:', f"R {largest.get('amount', 0):,.2f} - {largest.get('type', 'Unknown')}"])
            
            summary_table = Table(summary_data, colWidths=[2.5*inch, 2.5*inch])
            summary_table.setStyle(self._get_table_style())
            story.append(summary_table)
            story.append(Spacer(1, 20))
        
        # Category Analysis
        if 'category_analysis' in report_data:
            story.append(Paragraph("Category Breakdown", self.heading_style))
            categories = report_data['category_analysis'].get('category_breakdown', {})
            
            category_data = [['Category', 'Amount', 'Count', 'Percentage']]
            for category, data in categories.items():
                category_data.append([
                    category,
                    f"R {data.get('total', 0):,.2f}",
                    str(data.get('count', 0)),
                    f"{data.get('percentage', 0)}%"
                ])
            
            category_table = Table(category_data, colWidths=[2*inch, 1.2*inch, 0.8*inch, 1*inch])
            category_table.setStyle(self._get_table_style())
            story.append(category_table)
            story.append(Spacer(1, 20))
            
            # Essential vs Non-essential
            essential_data = report_data['category_analysis'].get('essential_vs_non_essential', {})
            if essential_data:
                story.append(Paragraph("Essential vs Non-Essential Spending", self.subheading_style))
                essential_table_data = [
                    ['Essential Expenses:', f"R {essential_data.get('essential_total', 0):,.2f}"],
                    ['Non-Essential Expenses:', f"R {essential_data.get('non_essential_total', 0):,.2f}"],
                    ['Essential Percentage:', f"{essential_data.get('essential_percentage', 0)}%"]
                ]
                essential_table = Table(essential_table_data, colWidths=[2.5*inch, 2*inch])
                essential_table.setStyle(self._get_table_style())
                story.append(essential_table)
                story.append(Spacer(1, 20))
        
        # Cost Cutting Opportunities
        if 'cost_cutting_opportunities' in report_data:
            story.append(Paragraph("Cost Cutting Opportunities", self.heading_style))
            opportunities = report_data['cost_cutting_opportunities']
            
            for opp in opportunities:
                story.append(Paragraph(f"<b>{opp.get('category', 'Unknown Category')}</b>", self.styles['Normal']))
                story.append(Paragraph(f"Current Spending: R {opp.get('current_spending', 0):,.2f}", self.styles['Normal']))
                story.append(Paragraph(f"Potential Savings: R {opp.get('potential_savings', 0):,.2f}", self.styles['Normal']))
                story.append(Paragraph(f"Recommendation: {opp.get('recommendation', 'No recommendation')}", self.styles['Normal']))
                story.append(Spacer(1, 10))
        
        # Recommendations
        if 'recommendations' in report_data:
            story.append(Paragraph("Recommendations", self.heading_style))
            for rec in report_data['recommendations']:
                story.append(Paragraph(f"• {rec}", self.styles['Normal']))
            story.append(Spacer(1, 20))
        
        return story
    
    def _build_income_pdf_content(self, report_data: Dict[str, Any]) -> list:
        """Build PDF content for income reports"""
        story = []
        
        # Summary Section
        if 'summary' in report_data:
            story.append(Paragraph("Income Summary", self.heading_style))
            summary = report_data['summary']
            
            summary_data = [
                ['Total Income:', f"R {summary.get('total_income', 0):,.2f}"],
                ['Monthly Average:', f"R {summary.get('monthly_average', 0):,.2f}"],
                ['Income Events:', str(summary.get('total_income_events', 0))],
                ['Average per Event:', f"R {summary.get('average_income_per_event', 0):,.2f}"]
            ]
            
            if 'largest_income' in summary:
                largest = summary['largest_income']
                summary_data.append(['Largest Income:', f"R {largest.get('amount', 0):,.2f} - {largest.get('type', 'Unknown')}"])
            
            summary_table = Table(summary_data, colWidths=[2.5*inch, 2.5*inch])
            summary_table.setStyle(self._get_table_style())
            story.append(summary_table)
            story.append(Spacer(1, 20))
        
        # Source Analysis
        if 'source_analysis' in report_data:
            story.append(Paragraph("Income Sources", self.heading_style))
            sources = report_data['source_analysis'].get('source_breakdown', {})
            
            source_data = [['Source', 'Amount', 'Count', 'Percentage']]
            for source, data in sources.items():
                source_data.append([
                    source,
                    f"R {data.get('total', 0):,.2f}",
                    str(data.get('count', 0)),
                    f"{data.get('percentage', 0)}%"
                ])
            
            source_table = Table(source_data, colWidths=[2*inch, 1.2*inch, 0.8*inch, 1*inch])
            source_table.setStyle(self._get_table_style())
            story.append(source_table)
            story.append(Spacer(1, 20))
        
        # Stability Analysis
        if 'stability_analysis' in report_data:
            story.append(Paragraph("Income Stability", self.heading_style))
            stability = report_data['stability_analysis']
            
            stability_data = [
                ['Stability Score:', f"{stability.get('stability_score', 0)}/100"],
                ['Regular Income %:', f"{stability.get('income_predictability', {}).get('regular_percentage', 0)}%"]
            ]
            
            stability_table = Table(stability_data, colWidths=[2.5*inch, 2*inch])
            stability_table.setStyle(self._get_table_style())
            story.append(stability_table)
            story.append(Spacer(1, 20))
        
        # Growth Opportunities
        if 'growth_opportunities' in report_data:
            story.append(Paragraph("Growth Opportunities", self.heading_style))
            opportunities = report_data['growth_opportunities']
            
            for opp in opportunities:
                story.append(Paragraph(f"<b>{opp.get('type', 'Unknown')}</b>", self.styles['Normal']))
                story.append(Paragraph(f"Description: {opp.get('description', 'No description')}", self.styles['Normal']))
                story.append(Paragraph(f"Potential Increase: {opp.get('potential_monthly_increase', 'Unknown')}", self.styles['Normal']))
                story.append(Paragraph(f"Action Required: {opp.get('action_required', 'No action specified')}", self.styles['Normal']))
                story.append(Spacer(1, 10))
        
        # Recommendations
        if 'recommendations' in report_data:
            story.append(Paragraph("Recommendations", self.heading_style))
            for rec in report_data['recommendations']:
                story.append(Paragraph(f"• {rec}", self.styles['Normal']))
            story.append(Spacer(1, 20))
        
        return story
    
    def _build_feelings_pdf_content(self, report_data: Dict[str, Any]) -> list:
        """Build PDF content for feelings reports"""
        story = []
        
        # Summary Section
        if 'summary' in report_data:
            story.append(Paragraph("Financial Wellness Summary", self.heading_style))
            summary = report_data['summary']
            
            summary_data = [
                ['Total Entries:', str(summary.get('total_feeling_entries', 0))],
                ['Most Common Feeling:', summary.get('most_common_feeling', 'Unknown')],
                ['Stress Level:', f"{summary.get('stress_level_percentage', 0)}%"],
                ['Wellness Status:', summary.get('wellness_status', 'Unknown')]
            ]
            
            summary_table = Table(summary_data, colWidths=[2.5*inch, 2.5*inch])
            summary_table.setStyle(self._get_table_style())
            story.append(summary_table)
            story.append(Spacer(1, 20))
            
            # Feeling Distribution
            if 'feeling_distribution' in summary:
                story.append(Paragraph("Feeling Distribution", self.subheading_style))
                feelings = summary['feeling_distribution']
                feeling_data = [['Feeling', 'Count']]
                for feeling, count in feelings.items():
                    feeling_data.append([feeling, str(count)])
                
                feeling_table = Table(feeling_data, colWidths=[2.5*inch, 1.5*inch])
                feeling_table.setStyle(self._get_table_style())
                story.append(feeling_table)
                story.append(Spacer(1, 20))
        
        # Stress Analysis
        if 'stress_analysis' in report_data:
            story.append(Paragraph("Stress Analysis", self.heading_style))
            stress = report_data['stress_analysis']
            
            stress_data = [
                ['Stress Trend:', stress.get('stress_trend_direction', 'Unknown')],
                ['High Stress Periods:', str(len(stress.get('high_stress_periods', [])))],
                ['Low Stress Periods:', str(len(stress.get('low_stress_periods', [])))]
            ]
            
            stress_table = Table(stress_data, colWidths=[2.5*inch, 2*inch])
            stress_table.setStyle(self._get_table_style())
            story.append(stress_table)
            story.append(Spacer(1, 20))
        
        # Mental Health Insights
        if 'mental_health_insights' in report_data:
            story.append(Paragraph("Mental Health Assessment", self.heading_style))
            mental_health = report_data['mental_health_insights']
            
            story.append(Paragraph(f"Risk Level: {mental_health.get('mental_health_risk_level', 'Unknown')}", self.styles['Normal']))
            story.append(Paragraph(f"Positive Feelings: {mental_health.get('positive_feelings_percentage', 0)}%", self.styles['Normal']))
            
            if mental_health.get('support_resources'):
                story.append(Paragraph("Support Resources:", self.styles['Normal']))
                for resource in mental_health['support_resources']:
                    story.append(Paragraph(f"• {resource}", self.styles['Normal']))
            
            story.append(Spacer(1, 20))
        
        # Support Recommendations
        if 'support_recommendations' in report_data:
            story.append(Paragraph("Wellness Recommendations", self.heading_style))
            for rec in report_data['support_recommendations']:
                story.append(Paragraph(f"• {rec}", self.styles['Normal']))
            story.append(Spacer(1, 20))
        
        return story
    
    def _build_comprehensive_pdf_content(self, report_data: Dict[str, Any]) -> list:
        """Build PDF content for comprehensive reports (fallback)"""
        # This is the same as the original generate_financial_report_pdf content
        # but returned as a list for consistency
        story = []
        
        # Summary Section
        if 'summary' in report_data:
            story.append(Paragraph("Financial Summary", self.heading_style))
            summary = report_data['summary']
            summary_data = [
                ['Total Income:', f"R {summary.get('total_income', 0):,.2f}"],
                ['Total Expenses:', f"R {summary.get('total_expenses', 0):,.2f}"],
                ['Net Position:', f"R {summary.get('net_position', 0):,.2f}"],
                ['Savings Rate:', f"{summary.get('savings_rate', 0)}%"],
                ['Daily Spending:', f"R {summary.get('average_daily_spending', 0):,.2f}"],
                ['Status:', summary.get('financial_status', 'Unknown')]
            ]
            
            summary_table = Table(summary_data, colWidths=[2*inch, 2*inch])
            summary_table.setStyle(self._get_table_style())
            story.append(summary_table)
            story.append(Spacer(1, 20))
        
        # Add other sections as needed...
        return story
    
    def _get_table_style(self) -> TableStyle:
        """Get consistent table styling"""
        return TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])