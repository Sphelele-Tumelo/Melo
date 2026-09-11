from uuid import UUID

from app.models.chat import Chat
from schemas.chat import MessageCreate
from sqlalchemy.ext.asyncio import AsyncSession


async def create_message(
    db: AsyncSession,
    conversation_id: UUID,
    message_data: MessageCreate,
) -> Chat:

    message = Chat(
        conversation_id=conversation_id,
        role=message_data.role,
        content=message_data.content,
    )

    db.add(message)

    await db.commit()
    await db.refresh(message)

    return message