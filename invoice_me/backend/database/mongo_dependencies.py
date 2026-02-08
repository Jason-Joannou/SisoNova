from fastapi import Request
from database.mongo_client import MongoDBClient

def get_mongo_client(request: Request) -> MongoDBClient:
    return request.app.state.mongo