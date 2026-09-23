import datetime
from uuid import UUID

from app.models.conversation import Conversation
from schemas.conversation import ConversationCreate, ConversationUpdate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


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


async def get_conversations(
    db: AsyncSession,
    user_id: UUID,
) -> list[Conversation]:

    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    )

    return list(result.scalars().all())


async def get_conversation(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
) -> Conversation | None:

    result = await db.execute(
        select(Conversation)
        .where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
    )

    return result.scalar_one_or_none()

async def delete_conversations(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
) -> None:
    result = await db.execute(
        select(Conversation)
        .where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
    )

    conversation = result.scalar_one_or_none()

    if conversation is None:
        return

    await db.delete(conversation)
    await db.commit()


async def update_conversation(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    update_data: ConversationUpdate | None = None,
) -> Conversation | None:

    result = await db.execute(
        select(Conversation)
        .where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
    )

    conversation = result.scalar_one_or_none()

    if conversation is None:
        return None

    if update_data is not None:
        if update_data.is_pinned is not None:
            conversation.is_pinned = update_data.is_pinned

        if update_data.title is not None:
            conversation.title = update_data.title

    # Update the conversation's updated_at timestamp
    conversation.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(conversation)
    return conversation