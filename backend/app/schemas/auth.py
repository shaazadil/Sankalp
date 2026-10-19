from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SendOTPRequest(BaseModel):
    email: EmailStr

class SendOTPResponse(BaseModel):
    status: str
    message: str
    hint: Optional[str] = None
    dev_code: Optional[str] = None

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str
    full_name: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    current_city: str
    target_city: str
    created_at: datetime
    
    class Config:
        from_attributes = True
