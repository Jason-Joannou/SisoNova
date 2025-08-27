from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, timedelta
import io
import os
from weasyprint import HTML
import uvicorn
from enum import Enum

from ice.models.invoice_configuration import InvoiceConfiguration, PaymentTermsType, PaymentConfiguration
from ice.models.kyc import BusinessProfile, ClientDetails, IndustryType
from ice.models.payments import PaymentConfiguration

app = FastAPI(
    title="SA Invoice Pro - Configurable Invoice Engine",
    description="Fully configurable invoice generation backend for South African businesses",
    version="3.0.0"
)

templates = Jinja2Templates(directory="templates")



# API Endpoints
@app.get("/")
async def root():
    """API information"""
    return {
        "message": "SA Invoice Pro - Configurable Invoice Engine",
        "tagline": "Fully configurable invoice generation for South African businesses",
        "version": "3.0.0",
        "features": [
            "Fully configurable business profiles",
            "Custom credit terms and payment options",
            "Dynamic terms and conditions",
            "Flexible item configurations",
            "Multi-industry support",
            "Payment provider integration ready"
        ],
        "configuration_endpoints": {
            "business_profile_template": "/templates/business-profile",
            "credit_terms_template": "/templates/credit-terms",
            "payment_config_template": "/templates/payment-config",
            "full_config_template": "/templates/full-invoice-config"
        },
        "generation_endpoints": {
            "generate_invoice": "/generate-invoice (POST)",
            "preview_config": "/preview-config (POST)"
        }
    }

@app.get("/templates/business-profile")
async def get_business_profile_template():
    """Get business profile configuration template"""
    return {
        "description": "Business profile configuration template",
        "template": {
            "company_name": "Your Company Name",
            "trading_name": "Trading Name (if different)",
            "address_line_1": "123 Business Street",
            "address_line_2": "Suite 100",
            "city": "Johannesburg",
            "province": "Gauteng",
            "postal_code": "2000",
            "country": "South Africa",
            "vat_number": "4123456789",
            "company_registration": "2023/123456/07",
            "email": "accounts@yourcompany.co.za",
            "phone": "+27 11 123 4567",
            "website": "https://yourcompany.co.za",
            "logo_url": "https://yourcompany.co.za/logo.png",
            "industry": "retail"
        },
        "industry_options": [e.value for e in IndustryType]
    }

@app.get("/templates/credit-terms")
async def get_credit_terms_template():
    """Get credit terms configuration template"""
    return {
        "description": "Credit terms configuration template",
        "templates": {
            "standard_30_day": {
                "payment_terms_type": "net_30",
                "payment_due_days": 30,
                "late_fee_enabled": True,
                "late_fee_type": "percentage",
                "late_fee_amount": 2.0,
                "late_fee_frequency": "monthly",
                "early_discount_enabled": True,
                "early_discount_days": 10,
                "early_discount_percentage": 2.0,
                "dispute_period_days": 7
            },
            "immediate_payment": {
                "payment_terms_type": "due_on_receipt",
                "payment_due_days": 0,
                "late_fee_enabled": True,
                "late_fee_type": "percentage",
                "late_fee_amount": 5.0,
                "late_fee_frequency": "daily",
                "early_discount_enabled": False,
                "dispute_period_days": 3
            },
            "project_based": {
                "payment_terms_type": "custom",
                "custom_payment_terms": "50% deposit, balance on completion",
                "late_fee_enabled": True,
                "late_fee_type": "percentage",
                "late_fee_amount": 1.5,
                "retention_enabled": True,
                "retention_percentage": 5.0,
                "retention_period_days": 90
            }
        },
        "payment_terms_options": [e.value for e in PaymentTermsType]
    }

@app.get("/templates/payment-config")
async def get_payment_config_template():
    """Get payment configuration template"""
    return {
        "description": "Payment configuration template",
        "template": {
            "bank_name": "First National Bank (FNB)",
            "account_holder": "Your Company Name (Pty) Ltd",
            "account_number": "1234567890",
            "branch_code": "250655",
            "swift_code": "FIRNZAJJ",
            "enable_instant_eft": True,
            "enable_payshap": True,
            "enable_bank_transfer": True,
            "enable_card_payments": False,
            "reference_prefix": "INV",
            "include_company_code": True,
            "include_date": False
        }
    }

@app.get("/templates/full-invoice-config")
async def get_full_invoice_config_template():
    """Get complete invoice configuration template"""
    return {
        "description": "Complete invoice configuration template for frontend",
        "template": {
            "invoice_number": "2024-001",
            "due_date": "2024-12-31",
            "business_profile": {
                "company_name": "Your Business Name",
                "address_line_1": "123 Business Street",
                "city": "Johannesburg",
                "province": "Gauteng",
                "postal_code": "2000",
                "email": "accounts@yourbusiness.co.za",
                "phone": "+27 11 123 4567",
                "vat_number": "4123456789",
                "industry": "retail"
            },
            "client_details": {
                "company_name": "Client Company",
                "contact_person": "John Smith",
                "email": "john@clientcompany.co.za",
                "phone": "+27 21 987 6543"
            },
            "items": [
                {
                    "title": "Product/Service Name",
                    "description": "Detailed description of the product or service",
                    "quantity": 1,
                    "unit": "each",
                    "unit_price": 1000.00,
                    "sku": "PROD-001"
                }
            ],
            "credit_terms": {
                "payment_terms_type": "net_30",
                "payment_due_days": 30,
                "late_fee_enabled": True,
                "late_fee_amount": 2.0,
                "early_discount_enabled": True,
                "early_discount_percentage": 2.0
            },
            "terms_and_conditions": {
                "include_payment_terms": True,
                "include_late_payment": True,
                "include_dispute_resolution": True,
                "custom_clauses": []
            },
            "payment_config": {
                "bank_name": "FNB",
                "account_holder": "Your Business Name",
                "account_number": "1234567890",
                "branch_code": "250655",
                "enable_instant_eft": True,
                "enable_payshap": True,
                "reference_prefix": "INV"
            }
        }
    }

@app.post("/preview-config")
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

@app.post("/generate-invoice")
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

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=True
    )