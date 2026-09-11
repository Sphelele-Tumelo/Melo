from uuid import UUID

from app.services.conversation_service import create_conversation
from schemas.conversation import ConversationCreate
from sqlalchemy.ext.asyncio import AsyncSession


async def create_conversation_controller(
    db: AsyncSession,
    user_id: UUID,
    conversation_data: ConversationCreate,
):
    return await create_conversation(
        db=db,
        user_id=user_id,
        conversation_data=conversation_data,
    )