    # api/utils/report_dispatcher.py
from typing import Dict, Any, Optional
from api.db.models.tables import User
from api.finance.category_reports import CategoryReportGenerator
from api.finance.aggregator import FinancialAggregator
from api.finance.pdf_generator import FinancialReportPDF
from api.finance.gemini_analyzer import PersonalizedGeminiAnalyzer
from datetime import datetime


class PersonalizedReportDispatcher:
    """Enhanced report dispatcher with personalized AI insights"""
    
    def __init__(self, user, gemini_api_key: str = None):
        self.user = user
        self.category_generator = CategoryReportGenerator(user.id)
        self.comprehensive_generator = FinancialAggregator(user.id)
        self.pdf_generator = FinancialReportPDF()
        self.ai_analyzer = PersonalizedGeminiAnalyzer(gemini_api_key) if gemini_api_key else None
    
    async def generate_personalized_report(self, report_type: str, months_back: int = 6, include_ai: bool = True, generate_pdf: bool = True) -> Dict[str, Any]:
        """Generate report with personalized AI analysis of user's actual data"""
        
        # Generate the base report
        if report_type == "expenses":
            report_data = await self.category_generator.generate_expenses_report(months_back)
        elif report_type == "incomes":
            report_data = await self.category_generator.generate_incomes_report(months_back)
        elif report_type == "feelings":
            report_data = await self.category_generator.generate_feelings_report(months_back)
        elif report_type == "comprehensive":
            report_data = await self.comprehensive_generator.get_comprehensive_financial_report(months_back)
        else:
            return {"error": f"Unknown report type: {report_type}"}
        
        if "error" in report_data:
            return report_data
        
        result = {"report_data": report_data}
        
        # Generate PERSONALIZED AI insights based on actual user data
        if include_ai and self.ai_analyzer:
            try:
                personalized_insights = await self.ai_analyzer.generate_personalized_insights(
                    report_data, 
                    report_type, 
                    f"South African lower-income user (Phone: {self.user.phone_number})"
                )
                result["personalized_ai_insights"] = personalized_insights
            except Exception as e:
                result["ai_insights_error"] = f"Personalized AI analysis failed: {str(e)}"
        
        # Generate PDF if requested
        if generate_pdf:
            try:
                pdf_bytes = self.pdf_generator.generate_category_report_pdf(report_data, report_type, self.user.phone_number)
                pdf_filename = f"{report_type}_report_{self.user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
                
                with open(pdf_filename, 'wb') as f:
                    f.write(pdf_bytes)
                
                result["pdf_filename"] = pdf_filename
                result["pdf_size_kb"] = len(pdf_bytes) / 1024
            except Exception as e:
                result["pdf_error"] = f"PDF generation failed: {str(e)}"
        
        return result

# Usage example with personalized insights:
async def generate_personalized_user_report(user, report_type: str):
    """Generate a report with AI insights based on the user's actual financial data"""
    
    dispatcher = PersonalizedReportDispatcher(user, gemini_api_key="YOUR_GEMINI_API_KEY")
    
    report = await dispatcher.generate_personalized_report(
        report_type=report_type,
        months_back=6,
        include_ai=True,
        generate_pdf=True
    )
    
    # The AI insights will now be based on the user's specific:
    # - Actual spending amounts and patterns
    # - Real income sources and stability
    # - Specific stress levels and feelings
    # - Their unique financial situation
    
    return report