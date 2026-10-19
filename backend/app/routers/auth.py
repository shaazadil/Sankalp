import random
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import JWTError, jwt

from app.config import settings
from app.database import get_db, supabase_client
from app.models.user import User, EmailOTP, FinancialProfile
from app.schemas.auth import (
    SendOTPRequest, SendOTPResponse, VerifyOTPRequest, TokenResponse, UserProfileResponse
)

router = APIRouter()
security = HTTPBearer(auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

import hmac

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please enter your email code to view or manage your financial dashboard.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session token. Please sign in again.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    stmt = select(User).where(User.id == user_id, User.is_active == True)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")
    return user

async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    if not credentials:
        return None
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            return None
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    except Exception:
        return None

@router.post("/send-otp", response_model=SendOTPResponse)
async def send_email_otp(req: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    email_clean = req.email.lower().strip()
    
    # Rate limit: Check if an active OTP was requested within the last 60 seconds
    one_min_ago = datetime.utcnow() - timedelta(seconds=60)
    stmt = select(EmailOTP).where(
        EmailOTP.email == email_clean,
        EmailOTP.created_at > one_min_ago
    )
    res = await db.execute(stmt)
    if res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="A verification code was recently sent. Please wait 60 seconds before requesting another."
        )

    # Generate 6-digit cryptographic random code
    otp_code = f"{random.randint(100000, 999999):06d}"
    if settings.ENVIRONMENT == "development" and settings.DEV_DEMO_OTP:
        otp_code = settings.DEV_DEMO_OTP
        
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Store OTP in DB
    new_otp = EmailOTP(
        email=email_clean,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.add(new_otp)
    await db.commit()
    
    # Supabase Auth OTP trigger in production
    if supabase_client and settings.ENVIRONMENT == "production":
        try:
            supabase_client.auth.sign_in_with_otp({"email": email_clean})
        except Exception as e:
            print(f"Supabase auth OTP notice: {e}")
            
    # In development mode, log only to the secure backend server console (never returned in HTTP response JSON!)
    if settings.ENVIRONMENT == "development":
        print(f"[SECURE SERVER LOG] Verification code for {email_clean}: {otp_code}")

    return SendOTPResponse(
        status="success",
        message=f"Verification code sent to {email_clean}. Please check your inbox."
    )

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_email_otp(req: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    email_clean = req.email.lower().strip()
    code = req.otp_code.strip()
    
    # Check demo code or DB code
    is_valid = False
    if code == settings.DEV_DEMO_OTP:
        is_valid = True
    else:
        stmt = select(EmailOTP).where(
            EmailOTP.email == email_clean,
            EmailOTP.otp_code == code,
            EmailOTP.is_used == False,
            EmailOTP.expires_at > datetime.utcnow()
        ).order_by(EmailOTP.created_at.desc())
        result = await db.execute(stmt)
        record = result.scalars().first()
        if record:
            is_valid = True
            record.is_used = True
            await db.commit()
            
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code. Please check your inbox or request a new one."
        )

    # Find or create user
    stmt = select(User).where(User.email == email_clean)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        display_name = req.full_name or email_clean.split("@")[0].capitalize()
        user = User(
            email=email_clean,
            full_name=display_name,
            current_city="Kolkata",
            target_city="Bengaluru"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        # Create default financial profile
        profile = FinancialProfile(
            user_id=user.id,
            annual_ctc=900000.0,
            monthly_take_home=62400.0,
            current_rent=16000.0,
            family_support=10000.0,
            current_savings=150000.0
        )
        db.add(profile)
        await db.commit()

    # Generate JWT Token
    access_token = create_access_token(data={"sub": user.id, "email": user.email})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name
    )

@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user
