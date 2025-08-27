from datetime import datetime
from uuid import UUID

def create_collection_reference(invoice_id: UUID):
    """
    Create a collection reference based on the current date and a truncated invoice ID.

    Args:
        invoice_id (UUID): Invoice ID to use for the reference.

    Returns:
        str: Collection reference.
    """
    collection_reference = datetime.now().strftime("%Y%m%d")+invoice_id.hex[:8]
    return collection_reference