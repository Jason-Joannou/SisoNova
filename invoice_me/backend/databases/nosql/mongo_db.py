from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from exceptions.database import MongoDBConnectionError
from dotenv import load_dotenv
import os

load_dotenv()

class MongoDB:
    def __init__(self, database_name: str = "test_db"):
        self.client = self._initialise_client()
        self.database_name = database_name
        self.db = self.client[self.database_name]

    def _initialise_client(self):
        try:
            uri = os.getenv("MONGO_CLIENT")
            client = MongoClient(uri, server_api=ServerApi('1'))
            client.admin.command('ping')
            print("Hello SisoNova, you are connected to mongoDB!")
            return client
        except Exception as e:
            raise MongoDBConnectionError(e)

    def create_database(self):
        """Return the database handle"""
        return self.db

    def create_collection(self, collection_name: str):
        """Return the collection handle"""
        if collection_name in self.db.list_collection_names():
            return self.db[collection_name]
        return self.db.create_collection(collection_name)

    def start_session(self):
        """Start a session for transactions or grouped operations"""
        return self.client.start_session()


if __name__ == "__main__":
    mongo_db = MongoDB()
    db = mongo_db.create_database()
    print("Existing databases:", mongo_db.client.list_database_names())
