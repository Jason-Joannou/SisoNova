from ice.models.invoice_configuration import InvoiceConfiguration, PaymentTermsType
from datetime import datetime
from fastapi.templating import Jinja2Templates
from typing import Dict, Any
from weasyprint import HTML

templates = Jinja2Templates(directory="templates")

async def process_invoice_config(config: InvoiceConfiguration) -> Dict[str, Any]:
    """Process invoice configuration into template context"""
    
    # Set invoice date if not provided
    invoice_date = config.invoice_date or datetime.now().strftime("%Y-%m-%d")
    
    # Calculate line items
    processed_items = []
    subtotal = 0
    
    for item in config.items:
        line_total = item.quantity * item.unit_price
        
        # Apply line item discount
        if item.discount_percentage and item.discount_percentage > 0:
            discount_amount = line_total * (item.discount_percentage / 100)
            line_total -= discount_amount
        
        processed_items.append({
            **item.dict(),
            "line_total": line_total
        })
        subtotal += line_total
    
    # Apply global discount
    global_discount_amount = 0
    if config.global_discount_enabled:
        if config.global_discount_percentage:
            global_discount_amount = subtotal * (config.global_discount_percentage / 100)
        elif config.global_discount_amount:
            global_discount_amount = min(config.global_discount_amount, subtotal)
    
    # Calculate VAT
    taxable_amount = subtotal - global_discount_amount
    vat_amount = 0
    if config.include_vat:
        vat_amount = taxable_amount * config.vat_rate
    
    total = taxable_amount + vat_amount
    
    # Generate payment reference
    company_code = config.client_details.company_name[:3].upper() if config.payment_config.include_company_code else ""
    date_code = datetime.now().strftime("%m%d") if config.payment_config.include_date else ""
    payment_reference = f"{config.payment_config.reference_prefix}-{config.invoice_number}-{company_code}{date_code}".strip("-")
    
    # Process payment terms text
    payment_terms_text = ""
    if config.credit_terms.payment_terms_type == PaymentTermsType.CUSTOM:
        payment_terms_text = config.credit_terms.custom_payment_terms
    else:
        terms_map = {
            PaymentTermsType.NET_15: "Net 15 days",
            PaymentTermsType.NET_30: "Net 30 days", 
            PaymentTermsType.NET_60: "Net 60 days",
            PaymentTermsType.DUE_ON_RECEIPT: "Due on receipt"
        }
        payment_terms_text = terms_map.get(config.credit_terms.payment_terms_type, "Net 30 days")
    
    return {
        "invoice_date": invoice_date,
        "business_info": config.business_profile.model_dump(),
        "client_info": config.client_details.model_dump(),
        "items": processed_items,
        "subtotal": subtotal,
        "global_discount_amount": global_discount_amount,
        "vat_amount": vat_amount,
        "vat_rate": config.vat_rate,
        "total": total,
        "payment_reference": payment_reference,
        "payment_terms_text": payment_terms_text,
        "credit_terms": config.credit_terms.model_dump(),
        "payment_config": config.payment_config.model_dump(),
        "currency": config.currency,
        "notes": config.notes
    }

async def generate_configured_pdf(config: InvoiceConfiguration) -> bytes:
    """Generate PDF from processed configuration"""
    try:
        # Process configuration
        context = await process_invoice_config(config)
        
        # Render HTML template (we'll use the configurable template)
        rendered_html = templates.get_template("dynamic_invoice.html").render(context)
        
        # Generate PDF
        html = HTML(string=rendered_html)
        pdf_bytes = html.write_pdf()
        
        return pdf_bytes
        
    except Exception as e:
        raise Exception(f"PDF generation failed: {str(e)}")