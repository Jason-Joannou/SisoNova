from pydantic import BaseModel, Field
from typing import List, Optional

class BaseResponse(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="A message indicating the success or failure of the operation")
    error: Optional[str] = Field(None, description="An error message if the operation failed")

class SearchResult(BaseModel):
    title: str = Field(..., description="Title of the search result")
    url: str = Field(..., description="URL of the search result")
    description: str = Field(..., description="Description of the search result")

class DuckDuckGoRequest(BaseModel):
    query: str = Field(..., description="Search query (e.g., 'South Africa fishing regulations')")
    num_results: int = Field(10, description="Number of results to return (default: 10)")

class DuckDuckGoResponse(BaseResponse):
    query: str = Field(..., description="Search query (e.g., 'South Africa fishing regulations')")
    result_count: int = Field(..., description="Number of results returned")
    results: List[SearchResult] = Field(..., description="List of search results")

class WebsiteLinks(BaseModel):
    link: str = Field(..., description="Link to navigate to")
    text: str = Field(..., description="Text of the link")

class OpenWebsiteRequest(BaseModel):
    url: str = Field(..., description="URL of the website to open")
    wait_seconds: Optional[int] = Field(3, description="Seconds to wait for page load (default: 4)")
    default_timeout: Optional[int] = Field(30000, description="Default timeout for page load (default: 30000)")


class OpenWebsiteResponse(BaseResponse):
    url: str = Field(..., description="URL of the website")
    page_title: str = Field(..., description="Title of the website")
    page_form_content: List[str] = Field(..., description="Form content on the website")
    links: List[WebsiteLinks] = Field(..., description="List of links on the website")