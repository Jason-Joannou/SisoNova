from fastapi import APIRouter, status, Depends, Path
from fastapi.exceptions import HTTPException
from models.users import UserProfile, UserUpdate, User
from models.invoices import InvoiceOverviewSummary, Invoice, InvoiceConfiguration
from models.base import BaseResponseModel
from typing import List
from database.mongo_operations import (
    get_user_by_supabase_id,
    create_user,
    get_user_profile,
    update_user_information,
    add_business_profile_operation,
    update_business_profile_operation,
    get_business_profile_with_company_name,
    get_user_business_profile_company_names,
    get_service_overview_summary,
    add_invoice_operation
)
from database.mongo_client import MongoDBClient
from database.mongo_dependencies import get_mongo_client
from utils.auth.dependencies import get_current_user


router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.get("/{supabase_id}/{company_name}", response_model=List[Invoice], description="Get user profile", status_code=status.HTTP_200_OK)
async def get_all_invoices(
    supabase_id: str = Path(..., description="The user's Supabase ID"),
    user: User = Depends(get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> UserProfile:
    """
    Get the user profile for the authenticated user
    """

    if user.supabase_id != supabase_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )

    return UserProfile

@router.post("/{supabase_id}/{company_name}", response_model=BaseResponseModel, description="Create an invoice", status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice_configuration: InvoiceConfiguration,
    supabase_id: str = Path(..., description="The users Supabase ID"),
    company_name: str = Path(..., description="The company name"),
    user: User = Depends(get_current_user),
    mongo_client = Depends(get_mongo_client)
):
    
    if user.supabase_id != supabase_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )
    
    result = add_invoice_operation(mongo_client=mongo_client, supabase_id=supabase_id, company_name=company_name, invoice=invoice_configuration)

    return BaseResponseModel(
        success=result,
        message=f"Invoice saved for {company_name}"
    )

    
    

@router.get("/{supabase_id}/{company_name}/overview", response_model=List[InvoiceOverviewSummary], description="Summary KPIs of invoicing for a company", status_code=status.HTTP_200_OK)
async def get_invoice_overview(
    supabase_id: str = Path(..., description="The user's Supabase ID"),
    company_name: str = Path(..., description="The name of the company"),
    user: User = Depends(get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> List[InvoiceOverviewSummary]:
    """
    Docstring
    """

    if user.supabase_id != supabase_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )
    
    summary_overview = await get_service_overview_summary(supabase_id=supabase_id, company_name=company_name, mongo_client=mongo_client, service="invoice")

    return summary_overview
    

    