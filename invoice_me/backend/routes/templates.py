from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from ice.models.kyc import IndustryType
from ice.models.invoice_configuration import PaymentTermsType

router = APIRouter(
    prefix="/templates",
    tags=["templates"],
    responses={404: {"description": "Not Found"}},
)


@router.get("/business-profile")
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

@router.get("/credit-terms")
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

@router.get("/payment-config")
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

@router.get("/full-invoice-config")
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