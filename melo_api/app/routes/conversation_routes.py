from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from schemas.conversation import ConversationCreate
from sqlalchemy.ext.asyncio import AsyncSession

from ..controllers.conversation_controller import create_conversation_controller
from ..data.database import get_db

router = APIRouter(tags=["Conversation"])

DB_DEPENDENCY = Depends(get_db)

@router.post("/create_conversation", status_code=status.HTTP_201_CREATED)
async def create_conversation(
    user_id: UUID,
    conversation_data: ConversationCreate | None = None,
    db: AsyncSession = DB_DEPENDENCY,
):
    try:
        new_conversation = await create_conversation_controller(
            db=db,
            user_id=user_id,
            conversation_data=conversation_data or ConversationCreate(),
        )
        return {
            "message": "Conversation created successfully",
            "conversation_id": str(new_conversation.id),
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))