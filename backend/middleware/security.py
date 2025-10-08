"""
Security middleware untuk rate limiting, input validation, dan XSS protection
"""
import logging
import re
import time
from typing import Callable
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

class SecurityMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, rate_limit_requests: int = 100, rate_limit_window: int = 60):
        super().__init__(app)
        self.rate_limit_requests = rate_limit_requests
        self.rate_limit_window = rate_limit_window
        self.request_counts = {}
        self.last_cleanup = time.time()

    def _cleanup_rate_limits(self):
        """Clean up old rate limit entries."""
        current_time = time.time()
        if current_time - self.last_cleanup > 300:  # Clean up every 5 minutes
            cutoff_time = current_time - self.rate_limit_window
            self.request_counts = {
                ip: timestamps
                for ip, timestamps in self.request_counts.items()
                if any(ts > cutoff_time for ts in timestamps)
            }
            self.last_cleanup = current_time

    def _check_rate_limit(self, client_ip: str) -> bool:
        """Check if client IP is within rate limits."""
        self._cleanup_rate_limits()
        current_time = time.time()

        if client_ip not in self.request_counts:
            self.request_counts[client_ip] = []

        # Remove old timestamps
        cutoff_time = current_time - self.rate_limit_window
        self.request_counts[client_ip] = [
            ts for ts in self.request_counts[client_ip] if ts > cutoff_time
        ]

        # Check if under limit
        if len(self.request_counts[client_ip]) >= self.rate_limit_requests:
            return False

        # Add current request
        self.request_counts[client_ip].append(current_time)
        return True

    def _validate_input(self, text: str) -> bool:
        """Validate input for malicious content."""
        if not text or len(text.strip()) == 0:
            return False

        # Check for extremely long input
        if len(text) > 10000:
            return False

        # Check for suspicious patterns
        suspicious_patterns = [
            r'<script[^>]*>.*?</script>',  # Script tags
            r'javascript:',  # JavaScript URLs
            r'on\w+\s*=',  # Event handlers
            r'<iframe[^>]*>.*?</iframe>',  # Iframes
            r'<object[^>]*>.*?</object>',  # Objects
            r'<embed[^>]*>.*?</embed>',  # Embeds
        ]

        for pattern in suspicious_patterns:
            if re.search(pattern, text, re.IGNORECASE | re.DOTALL):
                logger.warning(f"Malicious content detected: {pattern}")
                return False

        return True

    def _sanitize_input(self, text: str) -> str:
        """Sanitize input by removing or escaping dangerous content."""
        # Basic HTML escaping
        text = text.replace('&', '&amp;')
        text = text.replace('<', '<')
        text = text.replace('>', '>')
        text = text.replace('"', '"')
        text = text.replace("'", '&#x27;')

        return text

    async def dispatch(self, request: Request, call_next: Callable):
        try:
            # Get client IP
            client_ip = request.client.host if request.client else "unknown"

            # Check rate limit
            if not self._check_rate_limit(client_ip):
                logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": "Too many requests",
                        "message": "Rate limit exceeded. Please try again later."
                    }
                )

            # Validate and sanitize input for POST/PUT requests
            if request.method in ['POST', 'PUT']:
                try:
                    body = await request.body()

                    # Try to parse as JSON
                    if body:
                        import json
                        try:
                            json_data = json.loads(body.decode())

                            # Validate text fields
                            for key, value in json_data.items():
                                if isinstance(value, str):
                                    if not self._validate_input(value):
                                        logger.warning(f"Invalid input detected in field: {key}")
                                        return JSONResponse(
                                            status_code=status.HTTP_400_BAD_REQUEST,
                                            content={
                                                "error": "Invalid input",
                                                "message": "Input contains invalid or malicious content."
                                            }
                                        )
                                    # Sanitize input
                                    json_data[key] = self._sanitize_input(value)

                            # Re-encode sanitized JSON
                            sanitized_body = json.dumps(json_data).encode()
                            request._body = sanitized_body

                        except json.JSONDecodeError:
                            # If not JSON, check as plain text
                            text_content = body.decode()
                            if not self._validate_input(text_content):
                                return JSONResponse(
                                    status_code=status.HTTP_400_BAD_REQUEST,
                                    content={
                                        "error": "Invalid input",
                                        "message": "Input contains invalid or malicious content."
                                    }
                                )

                except Exception as e:
                    logger.error(f"Error processing request body: {str(e)}")

            # Log request
            logger.info(f"Request: {request.method} {request.url.path} from {client_ip}")

            # Process request
            response = await call_next(request)

            # Add security headers
            response.headers['X-Content-Type-Options'] = 'nosniff'
            response.headers['X-Frame-Options'] = 'DENY'
            response.headers['X-XSS-Protection'] = '1; mode=block'
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'

            return response

        except Exception as e:
            logger.error(f"Security middleware error: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "Internal server error",
                    "message": "An unexpected error occurred."
                }
            )

class InputValidationMiddleware(BaseHTTPMiddleware):
    """Additional middleware for input validation."""

    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable):
        # Additional validation logic can be added here
        response = await call_next(request)
        return response
