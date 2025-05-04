from typing import Dict, Optional, Union

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"],
    responses={404: {"description": "Not Found"}},
)


@router.get("/demographics", response_model=None)  # Will define response model later
async def get_storyline(
    gender: Optional[str] = None,
    age_group: Optional[str] = None,
    province: Optional[str] = None,
):
    pass
