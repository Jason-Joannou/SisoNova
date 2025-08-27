from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response
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

from routes import invoice, templates

app = FastAPI(
    title="SA Invoice Pro - Configurable Invoice Engine",
    description="Fully configurable invoice generation backend for South African businesses",
    version="3.0.0"
)
app.include_router(invoice.router, prefix="/api")
app.include_router(templates.router, prefix="/api")


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

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=True
    )