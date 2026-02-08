from fastapi import FastAPI
import os
import uvicorn
from config import AppSettings
import logging
from fastapi.middleware.cors import CORSMiddleware
from routes.user import router as user_router
from contextlib import asynccontextmanager
from database.mongo_client import MongoDBClient

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    mongo = MongoDBClient()
    await mongo.connect()

    app.state.mongo = mongo
    yield

    await mongo.disconnect()


app_settings = AppSettings()
app = FastAPI(
    title=app_settings.app_name,
    description=app_settings.app_description,
    version=app_settings.app_version,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],  # Or list your frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie"],
)

logger.info(f"Application name: {app_settings.app_name}")
logger.info(f"Application description: {app_settings.app_description}")
logger.info(f"Application version: {app_settings.app_version}")


app.include_router(user_router)
@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="localhost",
        port=8000,
        reload=True
    )