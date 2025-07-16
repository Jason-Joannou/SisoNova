from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

router = APIRouter(
    prefix="/api/v1/transactions", 
    tags=["transactions"],
    responses={404: {"description": "Not Found"}})

@router.get("/process_transaction")
def process_transaction(request: Request, requesting_number: str = "1234", txn_id: str = "2345"):
    
    transaction = {
        "id":txn_id,
        "requesting_number":requesting_number,
        "amount":"R100.00",
        "purpose":"Payment for service X"
    }

    return templates.TemplateResponse("process-transaction-template.html", {
        "request": request,
        "transaction": transaction
    })
    

@router.post("/confirm_transaction")
async def confirm_transaction():
    pass

@router.post("/reject_transaction")
async def reject_transaction():
    pass


