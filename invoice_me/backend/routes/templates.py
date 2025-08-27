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
    """Get complete business profile configuration template"""
    return {
        "description": "Complete business profile configuration template with all required and optional fields",
        "template": {
            "company_name": "Your Company Name",
            "trading_name": "Trading Name (if different from company name)",
            "address_line_1": "123 Business Street",
            "address_line_2": "Suite 100",
            "city": "Johannesburg",
            "province": "Gauteng",
            "postal_code": "2000",
            "country": "South Africa",
            "vat_number": "4123456789",
            "company_registration": "2025/123456/07",
            "email": "accounts@yourcompany.co.za",
            "phone": "+27 11 123 4567",
            "website": "https://yourcompany.co.za",
            "logo_url": "https://yourcompany.co.za/logo.png",
            "industry": "retail"
        },
        "required_fields": [
            "company_name",
            "address_line_1", 
            "city",
            "province",
            "postal_code",
            "email",
            "phone",
            "industry"
        ],
        "optional_fields": [
            "trading_name",
            "address_line_2",
            "country",
            "vat_number",
            "company_registration",
            "website",
            "logo_url"
        ],
        "industry_options": [e.value for e in IndustryType],
        "field_descriptions": {
            "company_name": "Legal registered company name",
            "trading_name": "Trading name if different from registered name",
            "address_line_1": "Primary business address",
            "address_line_2": "Secondary address line (suite, floor, etc.)",
            "city": "City where business is located",
            "province": "South African province",
            "postal_code": "4-digit postal code",
            "country": "Country (defaults to South Africa)",
            "vat_number": "VAT registration number (10 digits starting with 4)",
            "company_registration": "CIPC registration number (YYYY/XXXXXX/XX format)",
            "email": "Primary business email for invoicing",
            "phone": "Business phone number (+27 format preferred)",
            "website": "Company website URL",
            "logo_url": "URL to company logo image",
            "industry": "Business industry type for appropriate invoice styling"
        }
    }


@router.get("/client-details")
async def get_client_details_template():
    """Get client details configuration template"""
    return {
        "description": "Client details configuration template with all fields",
        "template": {
            "company_name": "Client Company Name",
            "contact_person": "Jane Doe",
            "email": "jane@clientcompany.co.za",
            "phone": "+27 21 987 6543",
            "address_line_1": "456 Client Avenue",
            "address_line_2": "Floor 2",
            "city": "Cape Town",
            "province": "Western Cape",
            "postal_code": "8001",
            "vat_number": "1234567890",
            "purchase_order_number": "PO-2025-001"
        },
        "required_fields": [
            "company_name",
            "contact_person",
            "email"
        ],
        "optional_fields": [
            "phone",
            "address_line_1",
            "address_line_2",
            "city",
            "province",
            "postal_code",
            "vat_number",
            "purchase_order_number"
        ],
        "field_descriptions": {
            "company_name": "Client's company name",
            "contact_person": "Primary contact person at client company",
            "email": "Client's email address for invoice delivery",
            "phone": "Client's phone number",
            "address_line_1": "Client's primary address",
            "address_line_2": "Client's secondary address line",
            "city": "Client's city",
            "province": "Client's province",
            "postal_code": "Client's postal code",
            "vat_number": "Client's VAT registration number",
            "purchase_order_number": "Client's purchase order reference"
        }
    }


@router.get("/invoice-items")
async def get_invoice_items_template():
    """Get invoice items configuration template"""
    return {
        "description": "Invoice items configuration template with examples for different item types",
        "templates": {
            "product_item": {
                "title": "Product Name",
                "description": "Detailed product description",
                "category": "Electronics",
                "sku": "PROD-001",
                "quantity": 2,
                "unit": "each",
                "unit_price": 1500.00,
                "discount_percentage": 10,
                "tax_rate": 0.15
            },
            "service_item": {
                "title": "Consulting Service",
                "description": "Professional consulting service description",
                "category": "Services",
                "sku": "SERV-001",
                "quantity": 8.5,
                "unit": "hours",
                "unit_price": 2000.00,
                "discount_percentage": 0,
                "tax_rate": 0.15
            },
            "material_item": {
                "title": "Construction Materials",
                "description": "Building materials for project",
                "category": "Materials",
                "sku": "MAT-001",
                "quantity": 100.5,
                "unit": "kg",
                "unit_price": 25.00,
                "discount_percentage": 5,
                "tax_rate": 0.15
            }
        },
        "required_fields": [
            "title",
            "quantity",
            "unit_price"
        ],
        "optional_fields": [
            "description",
            "category",
            "sku",
            "unit",
            "discount_percentage",
            "tax_rate"
        ],
        "common_units": [
            "each", "hours", "days", "weeks", "months",
            "kg", "tons", "litres", "metres", "m²", "m³",
            "packages", "sets", "lots", "phases"
        ],
        "field_descriptions": {
            "title": "Item or service name (required)",
            "description": "Detailed description of the item/service",
            "category": "Item category for organization",
            "sku": "Stock keeping unit or product code",
            "quantity": "Quantity (supports decimals, e.g., 8.5 hours)",
            "unit": "Unit of measurement (each, hours, kg, etc.)",
            "unit_price": "Price per unit (required)",
            "discount_percentage": "Line item discount percentage (0-100)",
            "tax_rate": "Custom tax rate (overrides default VAT if specified)"
        }
    }


@router.get("/credit-terms")
async def get_credit_terms_template():
    """Get comprehensive credit terms configuration template"""
    return {
        "description": "Complete credit terms configuration template with all options",
        "templates": {
            "standard_30_day": {
                "payment_terms_type": "net_30",
                "custom_payment_terms": None,
                "payment_due_days": 30,
                "late_fee_enabled": True,
                "late_fee_type": "percentage",
                "late_fee_amount": 2.0,
                "late_fee_frequency": "monthly",
                "early_discount_enabled": True,
                "early_discount_days": 10,
                "early_discount_percentage": 2.0,
                "credit_limit_enabled": False,
                "credit_limit_amount": None,
                "dispute_period_days": 7,
                "dispute_contact_email": "disputes@yourcompany.co.za",
                "dispute_contact_number": "+27 11 765 4321",
                "retention_enabled": False,
                "retention_percentage": None,
                "retention_period_days": None
            },
            "immediate_payment": {
                "payment_terms_type": "due_on_receipt",
                "custom_payment_terms": None,
                "payment_due_days": 0,
                "late_fee_enabled": True,
                "late_fee_type": "percentage",
                "late_fee_amount": 5.0,
                "late_fee_frequency": "daily",
                "early_discount_enabled": False,
                "early_discount_days": None,
                "early_discount_percentage": None,
                "credit_limit_enabled": False,
                "credit_limit_amount": None,
                "dispute_period_days": 3,
                "dispute_contact_email": "disputes@yourcompany.co.za",
                "dispute_contact_number": "+27 11 765 4321",
                "retention_enabled": False,
                "retention_percentage": None,
                "retention_period_days": None
            },
            "custom_deposit": {
                "payment_terms_type": "custom",
                "custom_payment_terms": "50% deposit required, balance due on completion",
                "payment_due_days": None,
                "late_fee_enabled": True,
                "late_fee_type": "percentage",
                "late_fee_amount": 3.0,
                "late_fee_frequency": "monthly",
                "early_discount_enabled": True,
                "early_discount_days": 30,
                "early_discount_percentage": 5.0,
                "credit_limit_enabled": False,
                "credit_limit_amount": None,
                "dispute_period_days": 7,
                "dispute_contact_email": "disputes@yourcompany.co.za",
                "dispute_contact_number": "+27 11 765 4321",
                "retention_enabled": False,
                "retention_percentage": None,
                "retention_period_days": None
            },
            "construction_terms": {
                "payment_terms_type": "net_60",
                "custom_payment_terms": None,
                "payment_due_days": 60,
                "late_fee_enabled": True,
                "late_fee_type": "percentage",
                "late_fee_amount": 1.5,
                "late_fee_frequency": "monthly",
                "early_discount_enabled": True,
                "early_discount_days": 15,
                "early_discount_percentage": 2.5,
                "credit_limit_enabled": True,
                "credit_limit_amount": 5000000.00,
                "dispute_period_days": 14,
                "dispute_contact_email": "disputes@yourcompany.co.za",
                "dispute_contact_number": "+27 11 765 4321",
                "retention_enabled": True,
                "retention_percentage": 10.0,
                "retention_period_days": 365
            }
        },
        "payment_terms_options": [e.value for e in PaymentTermsType],
        "late_fee_types": ["percentage", "fixed"],
        "late_fee_frequencies": ["daily", "monthly", "once"],
        "field_descriptions": {
            "payment_terms_type": "Type of payment terms (net_15, net_30, net_60, due_on_receipt, custom)",
            "custom_payment_terms": "Custom payment terms text (required if payment_terms_type is 'custom')",
            "payment_due_days": "Number of days until payment is due (not used for custom terms)",
            "late_fee_enabled": "Whether to charge late fees",
            "late_fee_type": "Type of late fee: 'percentage' or 'fixed'",
            "late_fee_amount": "Late fee amount (percentage or fixed amount)",
            "late_fee_frequency": "How often late fees are applied: 'daily', 'monthly', or 'once'",
            "early_discount_enabled": "Whether to offer early payment discount",
            "early_discount_days": "Days within which early discount applies",
            "early_discount_percentage": "Early payment discount percentage",
            "credit_limit_enabled": "Whether to display credit limit on invoice",
            "credit_limit_amount": "Credit limit amount to display",
            "dispute_period_days": "Days within which disputes must be raised",
            "dispute_contact_email": "Email for dispute resolution",
            "dispute_contact_number": "Phone number for dispute resolution",
            "retention_enabled": "Whether retention terms apply",
            "retention_percentage": "Percentage of invoice amount to retain",
            "retention_period_days": "Days to hold retention amount"
        }
    }


@router.get("/payment-config")
async def get_payment_config_template():
    """Get complete payment configuration template"""
    return {
        "description": "Complete payment configuration template with all payment methods",
        "template": {
            "bank_name": "First National Bank (FNB)",
            "account_holder": "Your Company Name (Pty) Ltd",
            "account_number": "1234567890",
            "branch_code": "250655",
            "swift_code": "FIRNZAJJ",
            "enable_instant_eft": True,
            "enable_payshap": True,
            "enable_snapscan": True,
            "enable_zapper": True,
            "enable_mobile_money": True,
            "enable_bank_transfer": True,
            "enable_card_payments": False,
            "instant_eft_provider": None,
            "payshap_merchant_id": None,
            "snapscan_merchant_id": None,
            "zapper_merchant_id": None,
            "monile_money_number": None,
            "card_payment_provider": None,
            "reference_prefix": "INV",
            "include_company_code": True,
            "include_date": True
        },
        "required_fields": [
            "bank_name",
            "account_holder",
            "account_number",
            "branch_code",
            "reference_prefix"
        ],
        "optional_fields": [
            "swift_code",
            "instant_eft_provider",
            "payshap_merchant_id",
            "snapscan_merchant_id",
            "zapper_merchant_id",
            "monile_money_number",
            "card_payment_provider"
        ],
        "payment_methods": {
            "enable_instant_eft": "Enable Instant EFT payments",
            "enable_payshap": "Enable PayShap mobile payments",
            "enable_snapscan": "Enable SnapScan QR code payments",
            "enable_zapper": "Enable Zapper mobile payments",
            "enable_mobile_money": "Enable mobile money payments",
            "enable_bank_transfer": "Enable traditional bank transfers",
            "enable_card_payments": "Enable credit/debit card payments"
        },
        "field_descriptions": {
            "bank_name": "Name of your bank (e.g., FNB, Standard Bank, ABSA, Nedbank)",
            "account_holder": "Legal name on the bank account",
            "account_number": "Bank account number",
            "branch_code": "6-digit branch code",
            "swift_code": "SWIFT/BIC code for international payments",
            "reference_prefix": "Prefix for payment references (e.g., INV, BILL)",
            "include_company_code": "Include client company code in payment reference",
            "include_date": "Include date in payment reference",
            "instant_eft_provider": "Instant EFT service provider details",
            "payshap_merchant_id": "PayShap merchant ID",
            "snapscan_merchant_id": "SnapScan merchant ID",
            "zapper_merchant_id": "Zapper merchant ID",
            "monile_money_number": "Mobile money contact number",
            "card_payment_provider": "Card payment service provider"
        }
    }


@router.get("/vat-config")
async def get_vat_config_template():
    """Get VAT configuration template"""
    return {
        "description": "VAT configuration template for South African businesses",
        "template": {
            "include_vat": True,
            "vat_rate": 0.15,
            "vat_number_required": True
        },
        "options": {
            "include_vat": "Whether to include VAT calculations on invoice",
            "vat_rate": "VAT rate (0.15 = 15% for South Africa)",
            "vat_number_required": "Whether VAT numbers are required to be displayed"
        },
        "field_descriptions": {
            "include_vat": "Set to true to include VAT calculations, false to exclude",
            "vat_rate": "VAT rate as decimal (0.15 for 15%, 0.14 for 14%, etc.)",
            "vat_number_required": "Whether to require and display VAT numbers on invoice"
        }
    }


@router.get("/discount-config")
async def get_discount_config_template():
    """Get discount configuration template"""
    return {
        "description": "Discount configuration template for global and line item discounts",
        "template": {
            "global_discount_enabled": True,
            "global_discount_percentage": 5,
            "global_discount_amount": None
        },
        "options": {
            "global_discount_enabled": "Enable global discount on entire invoice",
            "global_discount_percentage": "Global discount as percentage (0-100)",
            "global_discount_amount": "Global discount as fixed amount (alternative to percentage)"
        },
        "field_descriptions": {
            "global_discount_enabled": "Whether to apply a global discount to the entire invoice",
            "global_discount_percentage": "Discount percentage to apply to subtotal (use this OR global_discount_amount)",
            "global_discount_amount": "Fixed discount amount to apply (use this OR global_discount_percentage)"
        },
        "note": "Line item discounts are configured per item in the items array using 'discount_percentage' field"
    }


@router.get("/full-invoice-config")
async def get_full_invoice_config_template():
    """Get complete invoice configuration template matching your exact structure"""
    return {
        "description": "Complete invoice configuration template matching the full structure",
        "template": {
            "invoice_number": "INV-001",
            "invoice_date": "2025-08-27",
            "due_date": "2025-09-27",
            "business_profile": {
                "company_name": "Your Business Pty Ltd",
                "trading_name": "Your Trading Name",
                "address_line_1": "123 Business Street",
                "address_line_2": "Suite 100",
                "city": "Johannesburg",
                "province": "Gauteng",
                "postal_code": "2000",
                "country": "South Africa",
                "vat_number": "4123456789",
                "company_registration": "2025/123456/07",
                "email": "accounts@yourbusiness.co.za",
                "phone": "+27 11 123 4567",
                "website": "https://www.yourbusiness.co.za",
                "logo_url": "https://www.yourbusiness.co.za/logo.png",
                "industry": "retail"
            },
            "client_details": {
                "company_name": "Client Company",
                "contact_person": "Jane Doe",
                "email": "jane@clientcompany.co.za",
                "phone": "+27 21 987 6543",
                "address_line_1": "456 Client Avenue",
                "address_line_2": "Floor 2",
                "city": "Cape Town",
                "province": "Western Cape",
                "postal_code": "8001",
                "vat_number": "1234567890",
                "purchase_order_number": "PO-2025-001"
            },
            "items": [
                {
                    "title": "Product A",
                    "description": "High-quality product A",
                    "category": "Electronics",
                    "sku": "PROD-A-001",
                    "quantity": 2,
                    "unit": "each",
                    "unit_price": 1500,
                    "discount_percentage": 10,
                    "tax_rate": 0.15
                },
                {
                    "title": "Service B",
                    "description": "Consulting service B",
                    "category": "Services",
                    "sku": "SERV-B-001",
                    "quantity": 1,
                    "unit": "hour",
                    "unit_price": 2000,
                    "discount_percentage": 0,
                    "tax_rate": 0.15
                }
            ],
            "include_vat": True,
            "vat_rate": 0.15,
            "vat_number_required": True,
            "global_discount_enabled": True,
            "global_discount_percentage": 5,
            "global_discount_amount": None,
            "credit_terms": {
                "payment_terms_type": "net_30",
                "custom_payment_terms": None,
                "payment_due_days": 30,
                "late_fee_enabled": True,
                "late_fee_type": "percentage",
                "late_fee_amount": 2,
                "late_fee_frequency": "monthly",
                "early_discount_enabled": True,
                "early_discount_days": 10,
                "early_discount_percentage": 2,
                "credit_limit_enabled": False,
                "credit_limit_amount": None,
                "dispute_period_days": 7,
                "dispute_contact_email": "disputes@yourbusiness.co.za",
                "dispute_contact_number": "+27 11 765 4321",
                "retention_enabled": False,
                "retention_percentage": None,
                "retention_period_days": None
            },
            "payment_config": {
                "bank_name": "First National Bank (FNB)",
                "account_holder": "Your Business Pty Ltd",
                "account_number": "1234567890",
                "branch_code": "250655",
                "swift_code": "FIRNZAJJ",
                "enable_instant_eft": True,
                "enable_payshap": True,
                "enable_snapscan": True,
                "enable_zapper": True,
                "enable_mobile_money": True,
                "enable_bank_transfer": True,
                "enable_card_payments": False,
                "instant_eft_provider": None,
                "payshap_merchant_id": None,
                "snapscan_merchant_id": None,
                "zapper_merchant_id": None,
                "monile_money_number": None,
                "card_payment_provider": None,
                "reference_prefix": "INV",
                "include_company_code": True,
                "include_date": True
            },
            "currency": "ZAR",
            "language": "en",
            "notes": "Additional notes for the invoice",
            "internal_notes": "Internal notes (not shown on invoice)"
        },
        "usage_instructions": {
            "step_1": "Call /templates/business-profile to get business profile template",
            "step_2": "Call /templates/client-details to get client details template", 
            "step_3": "Call /templates/invoice-items to get item configuration examples",
            "step_4": "Call /templates/credit-terms to get credit terms options",
            "step_5": "Call /templates/payment-config to get payment configuration",
            "step_6": "Combine all sections into the full configuration structure",
            "step_7": "POST the complete configuration to /generate-invoice"
        }
    }


@router.get("/industry-examples")
async def get_industry_examples():
    """Get industry-specific configuration examples"""
    return {
        "description": "Industry-specific invoice configuration examples",
        "examples": {
            "legal_services": {
                "industry": "legal",
                "typical_items": [
                    {
                        "title": "Senior Partner Consultation",
                        "unit": "hours",
                        "typical_rate_range": "R2500-R4000 per hour"
                    },
                    {
                        "title": "Document Preparation",
                        "unit": "package",
                        "typical_rate_range": "R5000-R25000 per package"
                    }
                ],
                "typical_credit_terms": {
                    "payment_terms_type": "net_15",
                    "late_fee_amount": 3.0,
                    "retention_enabled": True,
                    "retention_percentage": 10.0
                },
                "typical_payment_methods": ["enable_instant_eft", "enable_bank_transfer", "enable_card_payments"]
            },
            "entertainment": {
                "industry": "entertainment",
                "typical_items": [
                    {
                        "title": "DJ Services",
                        "unit": "event",
                        "typical_rate_range": "R5000-R15000 per event"
                    },
                    {
                        "title": "Equipment Rental",
                        "unit": "day",
                        "typical_rate_range": "R1000-R5000 per day"
                    }
                ],
                "typical_credit_terms": {
                    "payment_terms_type": "custom",
                    "custom_payment_terms": "50% deposit, balance on event date",
                    "late_fee_amount": 5.0,
                    "late_fee_frequency": "daily"
                },
                "typical_payment_methods": ["enable_instant_eft", "enable_payshap", "enable_snapscan", "enable_zapper", "enable_card_payments"]
            },
            "construction": {
                "industry": "construction",
                "typical_items": [
                    {
                        "title": "Construction Phase",
                        "unit": "phase",
                        "typical_rate_range": "R100000-R1000000 per phase"
                    },
                    {
                        "title": "Materials Supply",
                        "unit": "tons",
                        "typical_rate_range": "R15000-R30000 per ton"
                    }
                ],
                "typical_credit_terms": {
                    "payment_terms_type": "net_60",
                    "late_fee_amount": 1.5,
                    "retention_enabled": True,
                    "retention_percentage": 10.0,
                    "retention_period_days": 365
                },
                "typical_payment_methods": ["enable_instant_eft", "enable_bank_transfer"]
            }
        }
    }