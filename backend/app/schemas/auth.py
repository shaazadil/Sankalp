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
    email_sent: bool = False

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

class FinancialProfileUpdate(BaseModel):
    annual_ctc: float
    monthly_take_home: Optional[float] = None
    tax_regime: str = "new"
    current_rent: float = 16000.0
    family_support: float = 10000.0
    existing_emis: float = 0.0
    current_savings: float = 150000.0
    current_monthly_sip: float = 12000.0
    current_city: Optional[str] = "Kolkata"
    target_city: Optional[str] = "Bengaluru"
    active_goal: Optional[str] = "relocation"

class FinancialProfileResponse(BaseModel):
    annual_ctc: float
    monthly_take_home: float
    tax_regime: str
    current_rent: float
    family_support: float
    existing_emis: float
    current_savings: float
    current_monthly_sip: float
    current_city: str
    target_city: str
    active_goal: str
    
    class Config:
        from_attributes = True
