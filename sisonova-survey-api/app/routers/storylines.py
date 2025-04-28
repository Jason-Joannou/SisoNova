from typing import Dict, Optional, Union

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from aggregators.consumer_aggregator import build_consumer_storyline

router = APIRouter(
    prefix="api/storyline",
    tags=["storyline"],
    responses={404: {"description": "Not Found"}},
)


@router.get("/")
async def get_storyline(gender: Optional[str] = None) -> Union[HTTPException, Response]:
    """
    Get the financial storyline statistics based on gender.

    Args:
        gender (Optional[str]): Optional filter by gender (Male, Femalem or None for all)

    Returns:
        JSONResponse: A JSONResponse object containing the requested storyline information.
    """

    try:
        stats = build_consumer_storyline(gender=gender)

        response_data = {
            "stats": stats,
            "message": f"Successfully retrieved storyline statistics for {gender if gender else 'all'} respondents",
        }

        return JSONResponse(status_code=200, content=response_data)
    except Exception as e:
        return HTTPException(
            status_code=500, detail=f"Error getting storyline information: {str(e)}"
        )
