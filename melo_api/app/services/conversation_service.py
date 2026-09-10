from uuid import UUID

from app.models.conversation import Conversation
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ...schemas.conversation import ConversationCreate


async def create_conversation(
    db: AsyncSession,
    user_id: UUID,
    conversation_data: ConversationCreate,
) -> Conversation:
    conversation = Conversation(
        user_id=user_id,
        title=conversation_data.title,
    )

    db.add(conversation)

    await db.commit()
    await db.refresh(conversation)

    return conversation