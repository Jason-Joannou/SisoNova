from datetime import datetime, timedelta
from models.invoices import Invoice, InvoiceConfiguration
from enums.invoices import InvoiceFrequency

def calculate_invoice_summary_statistics(invoices: InvoiceConfiguration, current_date: datetime = datetime.now().isoformat(), frequency: InvoiceFrequency = InvoiceFrequency.MONTHLY) -> dict:
    frequency_range = {
        InvoiceFrequency.DAILY: 1,
        InvoiceFrequency.WEEKLY: 7,
        InvoiceFrequency.BIWEEKLY: 14,
        InvoiceFrequency.MONTHLY: 30,
        InvoiceFrequency.QUARTERLY: 90,
        InvoiceFrequency.ANNUALLY: 365
    }

    current_date = datetime.fromisoformat(current_date)
    start_date = current_date - timedelta(days=frequency_range[frequency])
    filtered_invoices = [invoice for invoice in invoices if datetime.fromisoformat(invoice.due_date) >= start_date]

    number_pending_invoices = len([invoice for invoice in filtered_invoices if invoice.status == "pending"])
    total_amount_due = sum(invoice.amount for invoice in filtered_invoices if invoice.status == "pending")
    number_overdue_invoices = len([invoice for invoice in filtered_invoices if invoice.status == "overdue"])
    total_overdue_amount = sum(invoice.amount for invoice in filtered_invoices if invoice.status == "overdue")
    collected_amount = sum(invoice.amount for invoice in filtered_invoices if invoice.status == "paid")

    return {
        "number_pending_invoices": number_pending_invoices,
        "total_amount_due": total_amount_due,
        "number_overdue_invoices": number_overdue_invoices,
        "total_overdue_amount": total_overdue_amount,
        "collected_amount": collected_amount,
        "total_invoices": len(filtered_invoices)
    }