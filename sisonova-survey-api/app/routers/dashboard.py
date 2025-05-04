from typing import Dict, Optional, Union

from aggregators.dashboard.demographics import (
    process_age_group_distributions,
    process_gender_distribution,
    process_geographic_distribution,
)
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from utils.utils import filter_survey_dataframe, get_survey_results_into_df

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
    try:
        df = get_survey_results_into_df()
        df = filter_survey_dataframe(
            df=df, gender=gender, age_group=age_group, province=province
        )

        gender_counts = process_gender_distribution(df=df)
        age_counts = process_age_group_distributions(df=df)
        province_counts = process_geographic_distribution(df=df)

    except Exception as e:
        return HTTPException(
            status_code=500, detail=f"Error getting demographic information: {str(e)}"
        )
