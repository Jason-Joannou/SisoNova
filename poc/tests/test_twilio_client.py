from os import path
from unittest.mock import MagicMock, patch

import pytest

from message_clients.twilio import TwilioClient
from tests.conftest import (
    mock_complete_twilio_env,
    mock_incomplete_twilio_env_incorrect_number,
    mock_incomplete_twilio_env_no_auth_token,
    mock_incomplete_twilio_env_no_number,
    mock_incomplete_twilio_env_no_sid,
)


class TestTwilioClientInitialization:
    """
    Testing class that holds all the methods related to twilio client initialization.
    """

    def test_init_success(self, mock_complete_twilio_env):
        """
        This method tests whether the client initializes correctly with the mock enviroment variables
        """
        with patch("message_clients.twilio.Client") as mock_client_class, patch(
            "utils.utils.is_e164_format", return_value=True
        ):
            mock_client_instance = MagicMock()
            mock_client_class.return_value = mock_client_instance

            client = TwilioClient()

            assert client.client is not None
            assert client.from_number == "+12345678901"

    def test_missing_sid(self, mock_incomplete_twilio_env_no_sid, caplog):
        """
        This method tests whether the client fails initialization as an enviroment variable is missing.
        """
        caplog.set_level("ERROR")

        client = TwilioClient()

        assert client.client is None
        assert client.from_number is None
        assert "Missing required Twilio credentials" in caplog.text

    def test_missing_auth_token(self, mock_incomplete_twilio_env_no_auth_token, caplog):
        """
        This method tests whether the client fails initialization as an enviroment variable is missing.
        """

        caplog.set_level("ERROR")

        client = TwilioClient()

        assert client.client is None
        assert client.from_number is None
        assert "Missing required Twilio credentials" in caplog.text

    def test_missing_twilio_number(self, mock_incomplete_twilio_env_no_number):
        """
        This method tests whether the client fails initialization as an enviroment variable is missing.
        """

        client = TwilioClient()

        assert client.client is not None
        assert client.from_number is None

    def test_invalid_twilio_number(
        self, mock_incomplete_twilio_env_incorrect_number, caplog
    ):
        """
        This method tests whether the client fails initialization as an enviroment variable is missing.
        """

        caplog.set_level("ERROR")

        client = TwilioClient()

        assert client.client is not None
        assert client.from_number is None
        assert "The specified Twilio number is not in e164 format" in caplog.text
