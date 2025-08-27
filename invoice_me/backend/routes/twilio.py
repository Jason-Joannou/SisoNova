from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from ice.models.invoice_configuration import InvoiceConfiguration
from ice.invoices import generate_configured_pdf, process_invoice_config

router = APIRouter(
    prefix="/twilio",
    tags=["twilio"],
    responses={404: {"description": "Not Found"}},
)