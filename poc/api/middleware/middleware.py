import logging
import time
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from typing import List
from twilio.request_validator import RequestValidator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
api_key = os.getenv("API_KEY", "test_key")

# Create logger
logger = logging.getLogger("middleware")
logger.setLevel(logging.INFO)

validator = RequestValidator(auth_token)

class APIMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, twilio_paths: List[str] = None, admin_paths: List[str] = None):
        super().__init__(app)
        # Define which paths require Twilio validation
        self.twilio_paths = twilio_paths or ["/webhook/whatsapp"]
        # Define which paths require admin API key
        self.admin_paths = admin_paths or ["/admin/", "/broadcast/", "/analytics/"]
        
    async def dispatch(self, request: Request, call_next):
        # Start timing the request
        start_time = time.time()
        
        # Extract request details
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path
        method = request.method
        request_id = request.headers.get("X-Request-ID", "none")
        
        # Log basic request information
        logger.info(f"Request: {method} {path} - Client: {client_ip} - ID: {request_id}")
        
        # Determine endpoint type and apply appropriate logic
        endpoint_type = self._get_endpoint_type(path)
        
        # Add endpoint type to request state for use in route handlers
        request.state.endpoint_type = endpoint_type
        
        # Process the request through the route handlers
        try:
            # The actual validation happens in the route dependencies
            # This middleware just logs and categorizes
            if endpoint_type == "twilio":
                twilio_signature = request.headers.get("X-Twilio-Signature")
                if twilio_signature:
                    logger.info(f"Twilio signature present for {path}")
                else:
                    logger.warning(f"Request to Twilio endpoint without signature: {path}")
            
            elif endpoint_type == "admin":
                api_key_header = request.headers.get("X-API-Key")
                if api_key_header:
                    logger.info(f"API key present for admin endpoint: {path}")
                else:
                    logger.warning(f"Request to admin endpoint without API key: {path}")
            
            # Process the request
            response = await call_next(request)
            
            # Log response information
            process_time = time.time() - start_time
            logger.info(
                f"Response: {response.status_code} - "
                f"Type: {endpoint_type} - "
                f"Path: {path} - "
                f"Time: {process_time:.4f}s"
            )
            
            # Add timing header to response for monitoring
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except Exception as e:
            # Log exceptions
            process_time = time.time() - start_time
            logger.error(
                f"Error processing {endpoint_type} request: {str(e)} - "
                f"Path: {path} - "
                f"Client: {client_ip} - "
                f"Time: {process_time:.4f}s"
            )
            raise
    
    def _get_endpoint_type(self, path: str) -> str:
        """Determine the type of endpoint based on the path."""
        if any(path.startswith(twilio_path) for twilio_path in self.twilio_paths):
            return "twilio"
        elif any(path.startswith(admin_path) for admin_path in self.admin_paths):
            return "admin"
        elif path.startswith("/public/"):
            return "public"
        elif path.startswith("/api/"):
            return "api"
        else:
            return "other"