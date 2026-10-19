from typing import Optional, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.chat import ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_advisor import generate_conversational_response
from app.routers.auth import get_optional_current_user, get_current_user

router = APIRouter()

@router.post("/message", response_model=ChatResponse)
async def chat_message_endpoint(
    req: ChatRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Processes natural language financial prompt, extracts parameters, and returns friendly advice. Works seamlessly for both guest and authenticated users."""
    # Save user message if logged in
    if current_user:
        user_msg = ChatMessage(
            user_id=current_user.id,
            role="user",
            content=req.message
        )
        db.add(user_msg)
        await db.commit()

    # Generate response via Groq LPU
    response = await generate_conversational_response(req)

    # Save assistant response if logged in
    if current_user:
        ai_msg = ChatMessage(
            user_id=current_user.id,
            role="assistant",
            content=response.response,
            extracted_data=response.extracted_parameters
        )
        db.add(ai_msg)
        await db.commit()

    return response

@router.get("/history")
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns the authenticated user's past conversational history."""
    stmt = select(ChatMessage).where(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.asc())
    result = await db.execute(stmt)
    messages = result.scalars().all()
    return [
        {
            "id": msg.id,
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at.isoformat() if msg.created_at else None,
            "extracted_data": msg.extracted_data
        }
        for msg in messages
    ]
