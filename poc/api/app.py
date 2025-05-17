import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from middleware.middleware import APIMiddleware
from routes import twilio
from utils import logger_config

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    logger.info("API starting up")
    yield
    # Shutdown code
    logger.info("API shutting down")


app = FastAPI(
    title="SisoNova Service",
    description="API for SisoNova core services",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Add middleware
app.add_middleware(
    APIMiddleware,
    twilio_paths=["/api/twilio/whatsapp", "/twilio/status"],
    admin_paths=["/admin/", "/broadcast/", "/analytics/", "/config/"],
)

app.include_router(twilio.router)


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


# Health Endpoint
@app.get("/health")
async def health():
    return JSONResponse(status_code=200, content={"message": "Healthy"})


if __name__ == "__main__":
    import uvicorn

    logger.info("Starting API server")
    uvicorn.run("app:app", host="127.0.0.1", port=3000, reload=True)
