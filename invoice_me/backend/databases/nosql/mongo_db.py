from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from exceptions.database import MongoDBConnectionError
from dotenv import load_dotenv
import os

load_dotenv()

class MongoDB:
    def __init__(self):
        self.db = self._initialise_client()
    
    def _initialise_client(self):
        try:
            uri = os.getenv("MONGO_CLIENT")
            client = MongoClient(uri, server_api=ServerApi('1'))
            client.admin.command('ping')
            print("Hello SisoNova, you are connected to mongoDB!")
            return client
        except Exception as e:
            raise MongoDBConnectionError(e)
        
    def start_session(self):
        """Start a session for transactions or grouped operations"""
        return self.client.start_session()
        
    
        

if __name__ == "__main__":
    mongo_db = MongoDB().db
    print(mongo_db.list_database_names())



