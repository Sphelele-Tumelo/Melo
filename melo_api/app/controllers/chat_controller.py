from uuid import UUID

from app.services.chatservice import create_message
from schemas.chat import MessageCreate
from sqlalchemy.ext.asyncio import AsyncSession


async def create_message_controller(
    db: AsyncSession,
    conversation_id: UUID,
    message_data: MessageCreate,
):
    return await create_message(
        db=db,
        conversation_id=conversation_id,
        message_data=message_data,
    )