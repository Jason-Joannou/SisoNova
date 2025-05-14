import logging
import sys


def setup_console_logging(log_level=logging.INFO):
    """
    Set up logging configuration with console output only.

    Args:
        log_level: The minimum log level to display (default: INFO)

    Returns:
        The configured root logger
    """
    # Get the root logger
    root_logger = logging.getLogger()

    # Clear any existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Set the root logger level
    root_logger.setLevel(log_level)

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)

    # Create formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    console_handler.setFormatter(formatter)

    # Add handler to root logger
    root_logger.addHandler(console_handler)

    return root_logger


setup_console_logging(logging.DEBUG)
