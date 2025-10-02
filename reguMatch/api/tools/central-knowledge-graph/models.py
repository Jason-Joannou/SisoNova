from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional

class CountryNodeInformation(BaseModel):
    country_name: str = Field(..., description="The name of the country. e.g. 'South Africa'")
    description: Optional[str] = Field(None, description="A description of the country's overall compliance and regulatory frameworks. e.g. 'South Africa has a complex regulatory framework that encompasses a wide range of industries and sectors.'")
    # We can later include any international relations in terms of regulation and compliance - think ex pat double taxation treaty

class ProvinceNodeInformation(BaseModel):
    province_name: str = Field(..., description="The name of the province. e.g. 'Western Cape'")
    country_name: str = Field(..., description="The country where the province is located. e.g. 'South Africa'")
    description: Optional[str] = Field(None, description="A description of the province's regulatory frameworks and compliance. e.g. 'Western Cape has a complex regulatory framework that includes various industries and sectors.'")

class IndustryNodeInformation(BaseModel):
    industry_name: str = Field(..., description="The name of the industry. e.g. 'Fishing'")
    country_name: str = Field(..., description="The country where the industry is located. e.g. 'South Africa'")
    province_name: str = Field(..., description="The province where the industry is located. e.g. 'Western Cape'")
    description: str = Field(..., description="A description of the industry's regulatory frameworks and compliance. e.g. 'Fishing in South Africa is regulated by the South African Fisheries Commission.'")

class SectoreNodeInformation(BaseModel):
    sector_name: str = Field(..., description="The name of the sector. e.g. 'Commercial Fishing'")
    country_name: str = Field(..., description="The country where the sector is located. e.g. 'South Africa'")
    province_name: str = Field(..., description="The province where the sector is located. e.g. 'Western Cape'")
    industry_name: str = Field(..., description="The industry where the sector is located. e.g. 'Fishing'")
    description: str = Field(..., description="A description of the sector's regulatory frameworks and compliance. e.g. 'Commercial Fishing in South Africa is regulated by the South African Fisheries Commission.'")

class RegulationNodeInformation(BaseModel):
    regulation_id: str = Field(..., description="The unique identifier for the regulation. e.g. 'za_mlra_1998'")
    regulation_name: str = Field(..., description="The name of the regulation. e.g. 'Marine Living Resources Act'")
    act_name: str = Field(..., description="The name of the act that the regulation is part of. e.g. 'Marine Living Resources Act 18 of 1998'")
    section: str = Field(..., description="The section of the act that the regulation is part of. e.g. 'Section 1'")
    description: str = Field(..., description="A description of the regulation's content and scope. e.g. 'The Marine Living Resources Act 18 of 1998 provides for the protection of marine living resources.'")
    effective_date: str = Field(..., description="The date when the regulation becomes effective. e.g. '1998-01-01'")
    country_name: str = Field(..., description="The country where the regulation is located. e.g. 'South Africa'")
    province_name: str = Field(..., description="The province where the regulation is located. e.g. 'Western Cape'")
    industry_name: str = Field(..., description="The industry where the regulation is located. e.g. 'Fishing'")
    sector_name: str = Field(..., description="The sector where the regulation is located. e.g. 'Commercial Fishing'")


