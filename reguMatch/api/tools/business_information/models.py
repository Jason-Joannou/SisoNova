from typing import Optional

from pydantic import BaseModel, Field


class BusinessProfile(BaseModel):
    """Business Profile Data Model"""

    company_name: str = Field(
        ..., description="The name of the company registered with SisoNova"
    )
    trading_name: Optional[str] = Field(
        None, description="The trading name of the company registered with SisoNova"
    )
    country: str = Field(
        ..., description="The country the company is operating within."
    )
    province: str = Field(
        ..., description="The province the company is operating within."
    )
    city: str = Field(..., description="The city the company is operating within.")
    industry: str = Field(
        ..., description="The industry the company is operating within."
    )
