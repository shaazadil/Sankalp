from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.chat import ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_advisor import generate_conversational_response
from app.routers.auth import get_current_user

router = APIRouter()

@router.post("/message", response_model=ChatResponse)
async def chat_message_endpoint(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Processes natural language financial prompt, extracts parameters, and returns friendly advice."""
    # Save user message
    user_msg = ChatMessage(
        user_id=current_user.id,
        role="user",
        content=req.message
    )
    db.add(user_msg)
    await db.commit()

    # Generate response
    response = await generate_conversational_response(req)

    # Save assistant response
    ai_msg = ChatMessage(
        user_id=current_user.id,
        role="assistant",
        content=response.response,
        extracted_data=response.extracted_parameters
    )
    db.add(ai_msg)
    await db.commit()

    return response
