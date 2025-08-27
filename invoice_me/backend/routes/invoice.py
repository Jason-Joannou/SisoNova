from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from ice.models.invoice_configuration import InvoiceConfiguration
from utils.invoices import generate_configured_pdf

router = APIRouter(
    prefix="/invoice",
    tags=["invoices"],
    responses={404: {"description": "Not Found"}},
)

@router.post("/generate_invoice")
async def generate_configurable_invoice(config: InvoiceConfiguration):
    """Generate invoice from complete configuration"""
    try:
        pdf_content = await generate_configured_pdf(config)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=invoice_{config.invoice_number}_configured.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating invoice: {str(e)}")