from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from datetime import datetime, timedelta
from ice.models.invoice_configuration import InvoiceConfiguration
from ice.invoices import generate_configured_pdf, process_invoice_config
from bce.models.collection_connection import CreateCollectionRequest, Collection
from utils.collections import create_collection_reference

router = APIRouter(
    prefix="/collections",
    tags=["collections"],
    responses={404: {"description": "Not Found"}},
)


@router.post("/create_collection")
async def create_customer_collection(collection_information: CreateCollectionRequest):
    # Need to create full collection object
    collection = Collection(
        # Base information
        business_id=collection_information.business_id,
        client_id=collection_information.client_id,
        invoice_id=collection_information.invoice_id,

        # Collection details
        collection_reference=create_collection_reference(collection_information.invoice_id),
        original_amount=collection_information.original_amount,
        outstanding_amount=collection_information.original_amount,
        currency=collection_information.currency,
        
        # Dates
        due_date=collection_information.due_date,
        first_overdue_date=collection_information.due_date,
        last_payment_date=collection_information.last_payment_date,
        
        # Status and progress
        days_overdue=datetime.now().date() - collection_information.due_date,

        # Payment Details
        payment_references=collection_information.payment_references,

        # Contacts
        contacts=collection_information.contacts,

        # Items
        items=collection_information.items,

        # Collection history
        last_reminder_date=datetime.now(),
        next_reminder_date=datetime.now() + timedelta(days=collection_information.reminder_frequency_days),

        # Payment Tracking
        total_payments_received=collection_information.total_payments_received,
        payment_breakdown=collection_information.payment_breakdown,

        # Audit Trail
        created_by=collection_information.business_id,
        updated_by=collection_information.business_id,
    )
    return collection