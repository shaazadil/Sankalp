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
    SendOTPRequest, SendOTPResponse, VerifyOTPRequest, TokenResponse, UserProfileResponse,
    FinancialProfileUpdate, FinancialProfileResponse
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

import secrets
from app.services.email import send_otp_email

@router.post("/send-otp", response_model=SendOTPResponse)
async def send_email_otp(req: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    email_clean = req.email.lower().strip()
    
    # Rate limit: allow resending after 15s in dev or 30s in prod
    cooldown_seconds = 15 if settings.ENVIRONMENT == "development" else 30
    cooldown_cutoff = datetime.utcnow() - timedelta(seconds=cooldown_seconds)
    stmt = select(EmailOTP).where(
        EmailOTP.email == email_clean,
        EmailOTP.created_at > cooldown_cutoff
    )
    res = await db.execute(stmt)
    if res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"A verification code was recently generated. Please wait {cooldown_seconds} seconds before requesting another."
        )

    # Generate fresh 6-digit cryptographic random code
    otp_code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Store OTP in DB
    new_otp = EmailOTP(
        email=email_clean,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.add(new_otp)
    await db.commit()
    
    # Try sending real email via SMTP (e.g. Gmail)
    email_sent = await send_otp_email(email_clean, otp_code)

    # Supabase Auth OTP trigger in production if configured and SMTP not used
    if not email_sent and supabase_client and settings.ENVIRONMENT == "production":
        try:
            supabase_client.auth.sign_in_with_otp({"email": email_clean})
            email_sent = True
        except Exception as e:
            print(f"Supabase auth OTP notice: {e}")
            
    print(f"[OTP LOG] Verification code for {email_clean}: {otp_code} | Email Delivered: {email_sent}")

    dev_code = None
    hint = None
    if not email_sent or settings.ENVIRONMENT == "development":
        dev_code = otp_code
        hint = f"Verification Code: {otp_code}"

    message = (
        f"Verification code sent to {email_clean}. Please check your inbox."
        if email_sent
        else f"Verification code generated: {otp_code} (Ready to enter below)."
    )

    return SendOTPResponse(
        status="success",
        message=message,
        hint=hint,
        dev_code=dev_code,
        email_sent=email_sent
    )

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_email_otp(req: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    email_clean = req.email.lower().strip()
    code = req.otp_code.strip()
    
    # Check demo code or DB code
    is_valid = False
    if settings.DEV_DEMO_OTP and code == settings.DEV_DEMO_OTP:
        is_valid = True
    
    if not is_valid:
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

@router.get("/profile/financial", response_model=FinancialProfileResponse)
async def get_financial_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(FinancialProfile).where(FinancialProfile.user_id == current_user.id)
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        profile = FinancialProfile(
            user_id=current_user.id,
            annual_ctc=900000.0,
            monthly_take_home=62400.0,
            current_rent=16000.0,
            family_support=10000.0,
            current_savings=150000.0,
            current_monthly_sip=12000.0,
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    return FinancialProfileResponse(
        annual_ctc=profile.annual_ctc,
        monthly_take_home=profile.monthly_take_home,
        tax_regime=profile.tax_regime,
        current_rent=profile.current_rent,
        family_support=profile.family_support,
        existing_emis=profile.existing_emis,
        current_savings=profile.current_savings,
        current_monthly_sip=profile.current_monthly_sip,
        current_city=current_user.current_city or "Kolkata",
        target_city=current_user.target_city or "Bengaluru",
        active_goal="relocation",
    )

@router.put("/profile/financial", response_model=FinancialProfileResponse)
async def update_financial_profile(
    req: FinancialProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(FinancialProfile).where(FinancialProfile.user_id == current_user.id)
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        profile = FinancialProfile(user_id=current_user.id)
        db.add(profile)

    profile.annual_ctc = req.annual_ctc
    profile.tax_regime = req.tax_regime
    profile.current_rent = req.current_rent
    profile.family_support = req.family_support
    profile.existing_emis = req.existing_emis
    profile.current_savings = req.current_savings
    profile.current_monthly_sip = req.current_monthly_sip
    if req.monthly_take_home:
        profile.monthly_take_home = req.monthly_take_home

    if req.current_city:
        current_user.current_city = req.current_city
    if req.target_city:
        current_user.target_city = req.target_city

    await db.commit()
    await db.refresh(profile)

    return FinancialProfileResponse(
        annual_ctc=profile.annual_ctc,
        monthly_take_home=profile.monthly_take_home,
        tax_regime=profile.tax_regime,
        current_rent=profile.current_rent,
        family_support=profile.family_support,
        existing_emis=profile.existing_emis,
        current_savings=profile.current_savings,
        current_monthly_sip=profile.current_monthly_sip,
        current_city=current_user.current_city,
        target_city=current_user.target_city,
        active_goal=req.active_goal or "relocation",
    )

