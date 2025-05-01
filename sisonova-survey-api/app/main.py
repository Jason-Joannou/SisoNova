import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import storylines

app = FastAPI(
    title="SisoNova Survey API",
    description="API for accessing financial inclusion survey data and statistics",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-production-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    content = {
        "message": "Welcome to the SisoNova Survey API",
        "documentation": "/docs",
        "available_endpoints": [
            "/api/storyline",
        ],
    }

    return JSONResponse(status_code=200, content=content)


# Include routers
app.include_router(storylines.router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=3001, reload=True)
