import logging
from fastapi import FastAPI, JSONResponse
from middleware.middleware import APIMiddleware

app = FastAPI(
    title="SisoNova Service",
    description="API for SisoNova core services",
    version="1.0.0",
)

# Add middleware
app.add_middleware(
    APIMiddleware,
    twilio_paths=["/webhook/whatsapp", "/twilio/status"],
    admin_paths=["/admin/", "/broadcast/", "/analytics/", "/config/"]
)

# Root Endpoint
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
