import os
from unittest.mock import MagicMock, patch

import pytest


@pytest.fixture
def mock_complete_twilio_env():
    """
    Set up mock enviroment variables for Twilio tests.
    """
    with patch.dict(
        os.environ,
        {
            "TWILIO_ACCOUNT_SID": "test_sid",
            "TWILIO_AUTH_TOKEN": "test_token",
            "TWILIO_SANDBOX_NUMBER": "+12345678901",
        },
    ):
        yield


@pytest.fixture
def mock_incomplete_twilio_env_no_sid():
    """
    Set up mock enviroment variables for Twilio tests.
    """
    with patch.dict(
        os.environ,
        {
            "TWILIO_ACCOUNT_SID": "",
            "TWILIO_AUTH_TOKEN": "test_token",
            "TWILIO_SANDBOX_NUMBER": "+12345678901",
        },
    ):
        yield


@pytest.fixture
def mock_incomplete_twilio_env_no_auth_token():
    """
    Set up mock enviroment variables for Twilio tests.
    """
    with patch.dict(
        os.environ,
        {
            "TWILIO_ACCOUNT_SID": "test_sid",
            "TWILIO_AUTH_TOKEN": "",
            "TWILIO_SANDBOX_NUMBER": "+12345678901",
        },
    ):
        yield


@pytest.fixture
def mock_incomplete_twilio_env_no_number():
    """
    Set up mock enviroment variables for Twilio tests.
    """
    with patch.dict(
        os.environ,
        {
            "TWILIO_ACCOUNT_SID": "test_sid",
            "TWILIO_AUTH_TOKEN": "test_token",
            "TWILIO_SANDBOX_NUMBER": "",
        },
    ):
        yield


@pytest.fixture
def mock_incomplete_twilio_env_incorrect_number():
    """
    Set up mock enviroment variables for Twilio tests.
    """
    with patch.dict(
        os.environ,
        {
            "TWILIO_ACCOUNT_SID": "test_sid",
            "TWILIO_AUTH_TOKEN": "test_token",
            "TWILIO_SANDBOX_NUMBER": "+012345678901",
        },
    ):
        yield


@pytest.fixture
def mock_twilio_client(mock_complete_twilio_env):
    with patch("message_clients.twilio.TwilioClient") as mock_client_class:
        mock_client_instance = MagicMock()
        mock_client_class.return_value = mock_client_instance

        yield mock_client_class
