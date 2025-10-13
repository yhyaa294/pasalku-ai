"""
Rate Limiting Middleware dengan Redis support dan fallback in-memory
"""
import time
import logging
from typing import Dict, Callable, Optional, Any
from contextlib import asynccontextmanager
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger(__name__)

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logger.warning("Redis not available, using in-memory rate limiting")

class RateLimiter:
    """Rate limiting dengan Redis support"""

    def __init__(self, redis_url: str = None):
        self.redis_client = None
        self.in_memory_store: Dict[str, Dict] = {}

        if REDIS_AVAILABLE and redis_url:
            try:
                self.redis_client = redis.from_url(redis_url)
                logger.info("Redis rate limiting initialized")
            except Exception as e:
                logger.error(f"Redis connection failed: {e}, falling back to in-memory")

        if not self.redis_client:
            logger.info("Using in-memory rate limiting")

    def _get_redis_key(self, identifier: str, window_seconds: int) -> str:
        """Generate Redis key berdasarkan identifier dan window"""
        window_start = int(time.time() // window_seconds)
        return f"rate_limit:{identifier}:{window_start}"

    def _get_memory_key(self, identifier: str, window_seconds: int) -> str:
        """Generate in-memory key"""
        return f"{identifier}:{int(time.time() // window_seconds)}"

    def _cleanup_expired_memory_entries(self):
        """Cleanup expired entries dari in-memory store"""
        current_time = time.time()
        expired_keys = []

        for key, data in self.in_memory_store.items():
            if current_time - data.get("window_start", 0) > 3600:  # 1 hour expiry
                expired_keys.append(key)

        for key in expired_keys:
            del self.in_memory_store[key]

    def check_limit(
        self,
        identifier: str,
        max_requests: int,
        window_seconds: int = 60
    ) -> bool:
        """
        Check apakah request dalam rate limit

        Args:
            identifier: Unique identifier (e.g., IP address or user ID)
            max_requests: Maximum requests dalam window
            window_seconds: Window size dalam detik

        Returns:
            True jika limit belum tercapai, False jika sudah tercapai
        """
        try:
            if self.redis_client:
                # Redis-based rate limiting
                key = self._get_redis_key(identifier, window_seconds)
                current_count = self.redis_client.get(key)

                if current_count is None:
                    # First request in this window
                    self.redis_client.setex(key, window_seconds, 1)
                    return True
                else:
                    current_count = int(current_count)
                    if current_count >= max_requests:
                        return False

                    # Increment counter
                    self.redis_client.incr(key)
                    return True

            else:
                # In-memory fallback
                self._cleanup_expired_memory_entries()
                key = self._get_memory_key(identifier, window_seconds)

                if key not in self.in_memory_store:
                    self.in_memory_store[key] = {
                        "count": 1,
                        "window_start": time.time()
                    }
                    return True

                data = self.in_memory_store[key]
                if data["count"] >= max_requests:
                    return False

                data["count"] += 1
                return True

        except Exception as e:
            logger.error(f"Rate limiting error: {e}")
            # Fail open - allow request if rate limiting fails
            return True

    def get_remaining_requests(
        self,
        identifier: str,
        max_requests: int,
        window_seconds: int = 60
    ) -> int:
        """Get remaining requests untuk user dalam window"""
        try:
            if self.redis_client:
                key = self._get_redis_key(identifier, window_seconds)
                current_count = self.redis_client.get(key)
                current_count = int(current_count) if current_count else 0
                return max(0, max_requests - current_count)
            else:
                key = self._get_memory_key(identifier, window_seconds)
                current_count = self.in_memory_store.get(key, {}).get("count", 0)
                return max(0, max_requests - current_count)
        except Exception as e:
            logger.error(f"Error getting remaining requests: {e}")
            return max_requests

    def reset_limit(self, identifier: str, window_seconds: int = 60):
        """Reset rate limit untuk identifier tertentu"""
        try:
            if self.redis_client:
                key = self._get_redis_key(identifier, window_seconds)
                self.redis_client.delete(key)
            else:
                key = self._get_memory_key(identifier, window_seconds)
                if key in self.in_memory_store:
                    del self.in_memory_store[key]

            logger.info(f"Rate limit reset for {identifier}")
        except Exception as e:
            logger.error(f"Error resetting rate limit: {e}")

# Global rate limiter instance
rate_limiter = RateLimiter()

class RateLimitMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware untuk rate limiting"""

    def __init__(self, app, default_max_requests: int = 100, default_window_seconds: int = 60):
        super().__init__(app)
        self.default_max_requests = default_max_requests
        self.default_window_seconds = default_window_seconds

        # Route-specific rate limits
        self.route_limits: Dict[str, Dict[str, Any]] = {}

    def add_route_limit(
        self,
        path: str,
        max_requests: int,
        window_seconds: int = 60,
        identifier_extractor: Optional[Callable[[Request], str]] = None
    ):
        """
        Add specific rate limit untuk path tertentu

        Args:
            path: API path pattern (e.g., "/api/chat/*")
            max_requests: Max requests dalam window
            window_seconds: Window size dalam detik
            identifier_extractor: Function untuk extract identifier dari request
        """
        self.route_limits[path] = {
            "max_requests": max_requests,
            "window_seconds": window_seconds,
            "identifier_extractor": identifier_extractor or self._default_identifier_extractor
        }

    def _default_identifier_extractor(self, request: Request) -> str:
        """Default identifier extractor menggunakan IP address"""
        # Try to get real IP from headers (behind proxy)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Take first IP if multiple
            return forwarded_for.split(",")[0].strip()

        # Fallback to client host
        return request.client.host if request.client else "unknown"

    def _get_user_identifier(self, request: Request) -> str:
        """Extract user ID dari JWT token jika ada, fallback ke IP"""
        try:
            # Try to get user ID from JWT token
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                # Parse JWT token to get user ID
                from backend.core.security_updated import verify_token
                token = auth_header.replace("Bearer ", "")
                subject = verify_token(token)
                if subject:
                    return f"user_{subject}"  # Prefix untuk user-based limiting
        except Exception as e:
            logger.debug(f"Could not extract user ID from token: {e}")

        # Fallback to IP-based limiting
        return self._default_identifier_extractor(request)

    def _get_route_config(self, request: Request) -> Dict[str, Any]:
        """Get rate limit config untuk path tertentu"""
        path = request.url.path

        # Check exact path match first
        if path in self.route_limits:
            return self.route_limits[path]

        # Check pattern matches
        for route_path, config in self.route_limits.items():
            if route_path.endswith("*"):
                # Wildcard matching
                prefix = route_path[:-1]  # Remove *
                if path.startswith(prefix):
                    return config

        # Return default config
        return {
            "max_requests": self.default_max_requests,
            "window_seconds": self.default_window_seconds,
            "identifier_extractor": self._default_identifier_extractor
        }

    async def dispatch(self, request: Request, call_next):
        """Middleware dispatch"""
        if request.method.upper() == "OPTIONS":
            # Skip rate limiting for preflight requests
            return await call_next(request)

        route_config = self._get_route_config(request)
        max_requests = route_config["max_requests"]
        window_seconds = route_config["window_seconds"]
        identifier_extractor = route_config["identifier_extractor"]

        # Extract identifier
        identifier = identifier_extractor(request)

        # Check rate limit
        if not rate_limiter.check_limit(identifier, max_requests, window_seconds):
            # Rate limit exceeded
            remaining_time = window_seconds - (int(time.time()) % window_seconds)

            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "message": ".2f",
                    "retry_after": remaining_time,
                    "limit": max_requests,
                    "window_seconds": window_seconds
                },
                headers={
                    "Retry-After": str(remaining_time),
                    "X-RateLimit-Limit": str(max_requests),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + remaining_time)
                }
            )

        # Get remaining requests for headers
        remaining = rate_limiter.get_remaining_requests(identifier, max_requests, window_seconds)

        # Process request
        response = await call_next(request)

        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining - 1)  # Minus this request
        response.headers["X-RateLimit-Reset"] = str(int(time.time()) + window_seconds - (int(time.time()) % window_seconds))

        return response

# Convenience functions untuk setup
def setup_rate_limiting(app, redis_url: Optional[str] = None):
    """
    Setup rate limiting untuk FastAPI app

    Args:
        app: FastAPI app instance
        redis_url: Redis URL untuk production (optional)
    """
    global rate_limiter
    rate_limiter = RateLimiter(redis_url)

    # Setup middleware dengan sensible defaults
    middleware = RateLimitMiddleware(app, default_max_requests=100, default_window_seconds=60)

    # Setup route-specific limits
    # Authentication endpoints - lebih permisif
    middleware.add_route_limit("/api/auth/login", max_requests=5, window_seconds=300)  # 300 detik = 5 menit
    middleware.add_route_limit("/api/auth/register", max_requests=3, window_seconds=3600)  # 1 jam
    middleware.add_route_limit("/api/auth/refresh-token", max_requests=10, window_seconds=300)  # 5 menit

    # Chat endpoints - tergantung authentication
    middleware.add_route_limit("/api/chat/*", max_requests=50, window_seconds=60, identifier_extractor=middleware._get_user_identifier)

    # Advanced AI endpoints - lebih ketat untuk authenticated users
    middleware.add_route_limit("/api/advanced-ai/*", max_requests=20, window_seconds=60, identifier_extractor=middleware._get_user_identifier)

    # File upload endpoints - rate limit berdasarkan file uploads
    middleware.add_route_limit("/api/documents/upload", max_requests=10, window_seconds=3600, identifier_extractor=middleware._get_user_identifier)
    middleware.add_route_limit("/api/chat/enhanced", max_requests=30, window_seconds=60, identifier_extractor=middleware._get_user_identifier)

    # Add middleware ke app
    app.add_middleware(RateLimitMiddleware, default_max_requests=100, default_window_seconds=60)
    app.state.rate_limiter = rate_limiter
    app.state.rate_limit_middleware = middleware

    logger.info("Rate limiting initialized successfully")