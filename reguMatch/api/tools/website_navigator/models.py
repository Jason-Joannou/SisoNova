from pydantic import BaseModel, Field
from typing import List, Optional

class SearchResult(BaseModel):
    title: str = Field(..., description="Title of the search result")
    url: str = Field(..., description="URL of the search result")
    description: str = Field(..., description="Description of the search result")

class DuckDuckGoRequest(BaseModel):
    query: str = Field(..., description="Search query (e.g., 'South Africa fishing regulations')")
    num_results: int = Field(10, description="Number of results to return (default: 10)")

class DuckDuckGoResponse(BaseModel):
    success: bool = Field(..., description="Whether the query was successful")
    message: str = Field(..., description="A message indicating the success or failure of the operation")
    query: str = Field(..., description="Search query (e.g., 'South Africa fishing regulations')")
    result_count: int = Field(..., description="Number of results returned")
    results: List[SearchResult] = Field(..., description="List of search results")
    error: Optional[str] = Field(None, description="An error message if the operation failed")