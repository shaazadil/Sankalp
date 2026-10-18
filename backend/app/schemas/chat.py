from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatMessageItem(BaseModel):
    role: str
    content: str
    created_at: Optional[datetime] = None

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessageItem]] = []
    current_context: Optional[Dict[str, Any]] = None  # Existing user numbers if available

class ChatResponse(BaseModel):
    response: str
    detected_intent: str                              # "relocation", "education_loan", "wedding", "vehicle", "monthly_budget", "general"
    extracted_parameters: Dict[str, Any]             # e.g. {"annual_ctc": 900000, "city": "Bengaluru"}
    suggested_quick_replies: List[str]
    ready_for_plan_generation: bool                  # True when enough data has been collected
    computed_preview: Optional[Dict[str, Any]] = None # Instant preview calculation
