from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routers import auth, calculate, plan, chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables automatically on startup
    await init_db()
    print("[Sankalp Backend] Database initialized & ready.")
    yield

app = FastAPI(
    title="Sankalp Financial AI Engine",
    description="India-First AI Financial Life Planner Backend (FastAPI + Supabase / PostgreSQL)",
    version="1.0.0",
    lifespan=lifespan
)

import time
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

# 1. In-Memory Anti-DDoS Rate Limiter (30 requests/min per IP)
rate_limit_records = defaultdict(list)

class RateLimiterMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # In development or for localhost, allow high throughput for real-time slider adjustments
        if settings.ENVIRONMENT == "development":
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean older than 60s
        rate_limit_records[client_ip] = [t for t in rate_limit_records[client_ip] if now - t < 60.0]
        
        if len(rate_limit_records[client_ip]) >= 120:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down to prevent abuse."}
            )
            
        rate_limit_records[client_ip].append(now)
        return await call_next(request)

app.add_middleware(RateLimiterMiddleware)

# 2. Strict Security Headers & Secret Scrubbing Middleware
class SecurityHardeningMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        
        # Obfuscate server stack identity
        if "server" in response.headers:
            del response.headers["server"]
            
        return response

app.add_middleware(SecurityHardeningMiddleware)

# Allowed CORS Origins
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
if not origins:
    origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global safe exception handler to prevent leaking internal stack traces / SQL errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log securely on server
    print(f"[SECURITY ALERT] Unhandled Exception: {type(exc).__name__}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again or contact support."}
    )

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication & User"])
app.include_router(calculate.router, prefix="/api/calculate", tags=["Deterministic Calculators"])
app.include_router(plan.router, prefix="/api/plan", tags=["Financial Plans & Scenarios"])
app.include_router(chat.router, prefix="/api/chat", tags=["Conversational AI Co-Pilot"])

@app.get("/")
async def root():
    return {
        "app": "Sankalp - India-First AI Financial Life Planner",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

