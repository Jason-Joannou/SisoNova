import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from routes import transactions

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

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(transactions.router)



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
    import os

    logger.info("Starting API server")
    uvicorn.run("app:app", host="127.0.0.1", port=3000, reload=True)

    # port = int(os.environ.get("PORT", 3000))
    # uvicorn.run("api.app:app", host="0.0.0.0", port=port, reload=True)
