from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from ice.models.invoice_configuration import InvoiceConfiguration
from ice.invoices import generate_configured_pdf, process_invoice_config

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
    
@router.post("/preview-config")
async def preview_configuration(config: InvoiceConfiguration):
    """Preview invoice configuration without generating PDF"""
    try:
        # Process the configuration and return structured preview
        processed_config = await process_invoice_config(config)
        
        return {
            "status": "success",
            "preview": {
                "business_info": processed_config["business_info"],
                "client_info": processed_config["client_info"],
                "items_summary": {
                    "total_items": len(processed_config["items"]),
                    "subtotal": processed_config["subtotal"],
                    "vat_amount": processed_config["vat_amount"],
                    "total": processed_config["total"]
                },
                "payment_terms": processed_config["payment_terms_text"],
                "payment_reference": processed_config["payment_reference"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Configuration error: {str(e)}")