import logging
import os
from typing import Optional

from dotenv import load_dotenv
from twilio.rest import Client

from utils.utils import is_e164_format

load_dotenv()

logger = logging.getLogger(__name__)


class TwilioClient:
    """
    A client wrapper for interacting with the Twilio API.
    """

    def __init__(self, raise_on_error: bool = False) -> None:
        """
        Initialize the Twilio client wrapper.

        Args:
            raise_on_error: If True, raises an exception when client initialization fails.
                           If False, allows the object to exist with a None client.

        Raises:
            RuntimeError: If raise_on_error is True and client initialization fails.
        """
        self.client = self._create_twilio_client()

        self.from_number = None
        if self.client is not None:
            self.from_number = self._get_twilio_number()

        if raise_on_error and self.client is None:
            raise RuntimeError(
                "Failed to initialize Twilio client. See logs for details."
            )

    def _get_twilio_number(self) -> Optional[str]:
        """Retrieves the Twilio number from enviroment variables"""
        try:
            twilio_number = os.getenv("TWILIO_SANDBOX_NUMBER", None)
            if not twilio_number:
                raise ValueError(f"No Twilio number found: {twilio_number}")

            if not is_e164_format(number=twilio_number):
                raise ValueError(
                    f"The specified Twilio number is not in e164 format: {twilio_number}"
                )

            logger.info(
                f"Successfully retrieved Twilio number and number is in E164 format"
            )

            return twilio_number

        except ValueError as ve:
            print(f"An Error occured when trying to retrieve the Twilio number: {ve}")
            logger.error(
                f"An Error occured when trying to retrieve the Twilio number: {ve}"
            )
            return None

        except Exception as e:
            print(
                f"An Unexpected error occured while trying to retrieve the Twilio Number: {e}"
            )
            logger.error(
                f"An Unexpected error occured while trying to retrieve the Twilio Number: {e}"
            )
            return None

    def _create_twilio_client(self) -> Optional[Client]:
        """
        Creates and returns a Twilio client instance using environment variables.

        This method attempts to initialize a Twilio Client using the account SID and
        authentication token retrieved from environment variables. If either credential
        is missing, it raises a ValueError.

        Returns:
            Optional[Client]: A configured Twilio Client instance if successful, None if an error occurs.

        Raises:
            ValueError: If either TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN environment variables are missing.
        """
        try:
            account_sid = os.getenv("TWILIO_ACCOUNT_SID", None)
            account_auth_token = os.getenv("TWILIO_AUTH_TOKEN", None)

            if not account_sid or not account_auth_token:
                raise ValueError(
                    "Missing required Twilio credentials. Ensure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are set."
                )

            client = Client(account_sid, account_auth_token)
            logger.info("Successfully created Twilio client.")
            return client

        except ValueError as ve:
            print(f"Error creating Twilio client: {ve}")
            logger.error(f"Error creating Twilio client: {ve}")
            return None

        except Exception as e:
            print(f"Unexpected error when creating Twilio client: {e}")
            logger.error(f"Unexpected error when creating Twilio client: {e}")
            return None

    def is_client_valid(self) -> bool:
        """Check if the Twilio client is properly initialized."""
        return self.client is not None
