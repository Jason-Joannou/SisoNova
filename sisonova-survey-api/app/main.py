import os
import uvicorn
from app.routers import dashboard, storylines
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(
    title="SisoNova Survey API",
    description="API for accessing financial inclusion survey data and statistics",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app", "https://siso-nova.vercel.app"],
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
            "/api/dashboard",
        ],
    }

    return JSONResponse(status_code=200, content=content)


# Include routers
app.include_router(storylines.router)
app.include_router(dashboard.router)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 3001))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)