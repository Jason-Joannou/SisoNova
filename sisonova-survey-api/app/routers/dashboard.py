from typing import Dict, Optional, Union

from aggregators.dashboard.demographics import (
    process_demographic_columns,
    process_income_columns,
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
async def get_user_demographics(
    gender: Optional[str] = None,
    age_group: Optional[str] = None,
    province: Optional[str] = None,
):
    try:
        df = get_survey_results_into_df()
        df = filter_survey_dataframe(
            df=df, gender=gender, age_group=age_group, province=province
        )

        results = process_income_columns(df=df)

        response_data = {
            "dashboard_response": results,
            "message": f"Successfully retreieved demographic distributions for filters: gender: {gender}, age_group: {age_group}, province: {province}",
        }

        return JSONResponse(status_code=200, content=response_data)

    except Exception as e:
        return HTTPException(
            status_code=500, detail=f"Error getting demographic information: {str(e)}"
        )


@router.get("/income", response_model=None)  # Will define response model later
async def get_user_income(
    gender: Optional[str] = None,
    age_group: Optional[str] = None,
    province: Optional[str] = None,
):
    try:
        df = get_survey_results_into_df()
        df = filter_survey_dataframe(
            df=df, gender=gender, age_group=age_group, province=province
        )

        results = process_demographic_columns(df=df)

        response_data = {
            "dashboard_response": results,
            "message": f"Successfully retreieved demographic distributions for filters: gender: {gender}, age_group: {age_group}, province: {province}",
        }

        return JSONResponse(status_code=200, content=response_data)

    except Exception as e:
        return HTTPException(
            status_code=500, detail=f"Error getting demographic information: {str(e)}"
        )
