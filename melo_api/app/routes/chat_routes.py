from uuid import UUID

from app.controllers.chat_controller import create_message_controller
from app.data.database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.chat import MessageCreate
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Chat"])

DB_DEPENDENCY = Depends(get_db)


@router.post(
    "/create_message",
    status_code=status.HTTP_201_CREATED,
)
async def create_message(
    conversation_id: UUID,
    message_data: MessageCreate,
    db: AsyncSession = DB_DEPENDENCY,
):
    try:
        new_message = await create_message_controller(
            db=db,
            conversation_id=conversation_id,
            message_data=message_data,
        )

        return {
            "message": "Message created successfully",
            "message_id": str(new_message.id),
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )