import os
import json
from typing import List, Optional

import gspread
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from google.oauth2 import service_account

load_dotenv()

SCOPE: List[str] = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDENTIALS_PATH = os.path.join(BASE_DIR, "sisonova-api-credentials.json")
ENVIROMENT = os.getenv("ENVIROMENT", "dev")


def load_gs_client(scope: Optional[List[str]] = None) -> gspread.Client:
    """
    Creates and returns an authenticated Google Sheets client using a service account.

    Args:
        scope (List[str]): A list of OAuth scopes required for accessing Google Sheets
                           and Google Drive APIs. Common scopes include:
                           - "https://spreadsheets.google.com/feeds"
                           - "https://www.googleapis.com/auth/drive"

    Returns:
        gspread.Client: An authorized gspread client that can be used to access and modify Google Sheets.

    Raises:
        FileNotFoundError: If the service account credentials file is not found.
        ValueError: If the credentials are invalid or improperly formatted.
        Exception: For any other unexpected errors during client creation.
    """
    try:
        if scope is None:
            scope = SCOPE
        
        if ENVIROMENT == "dev":
            credentials = Credentials.from_service_account_file(
                filename=CREDENTIALS_PATH, scopes=scope
            )
        elif ENVIROMENT == "prod":
            creds_json = os.getenv("GOOGLE_CREDENTIALS")
            if creds_json:
                creds_dict = json.loads(creds_json)
                credentials = service_account.Credentials.from_service_account_info(
                    creds_dict, 
                    scopes=scope
                )
            else:
                raise ValueError("GOOGLE_CREDENTIALS environment variable not set")
        else:
            raise Exception(f"Unknown enviroment {ENVIROMENT}")
        client = gspread.authorize(credentials)
        return client

    except FileNotFoundError as f:
        raise FileNotFoundError(f"Service account credentials file not found str{f}")

    except ValueError as v:
        raise ValueError(f"Invalid credentials file format {str(v)}")

    except Exception as e:
        raise Exception(
            f"An unexpected error occurred while loading Google Sheets client: {str(e)}"
        )
