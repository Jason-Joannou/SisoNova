from ddgs import DDGS
from api.tools.website_navigator.models import DuckDuckGoRequest, DuckDuckGoResponse

def duck_duck_go_search_operation(query_parameters: DuckDuckGoRequest) -> DuckDuckGoResponse:
    """Search the web using DuckDuckGo"""
    try:
        results = []
        
        ddgs = DDGS()

        query = query_parameters.query
        num_results = query_parameters.num_results
        
        search_results = ddgs.text(query, max_results=num_results)
        
        for res in search_results:
            results.append({
                "title": res.get("title", ""),
                "url": res.get("href", ""),
                "description": res.get("body", "")
            })
        
        return DuckDuckGoResponse(
            success=True,
            message=f"Successfully searched DuckDuckGo for '{query}'",
            query=query,
            result_count=len(results),
            results=results
        )
        
    except Exception as e:
        return DuckDuckGoResponse(
            success=False,
            message=f"Failed to search DuckDuckGo for '{query}'",
            query=query,
            result_count=0,
            results=[],
            error=str(e)
        )
