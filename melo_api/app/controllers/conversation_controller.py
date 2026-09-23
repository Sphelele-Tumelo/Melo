from uuid import UUID

from app.services.conversation_service import (
    create_conversation,
    delete_conversations,
    get_conversation,
    get_conversations,
    update_conversation,
)
from schemas.conversation import ConversationCreate, ConversationUpdate
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


async def get_conversations_controller(
    db: AsyncSession,
    user_id: UUID,
):
   

    return await get_conversations(
        db=db,
        user_id=user_id,
    )


async def get_conversation_controller(
    db: AsyncSession,
    user_id: UUID,
    conversation_id: UUID,
):

    return await get_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=user_id,
    )

async def delete_conversation_controller(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
):

    return await delete_conversations(
        db=db,
        user_id=user_id,
        conversation_id=conversation_id,
    )


async def update_conversation_controller(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    update_data: ConversationUpdate | None = None,
):

    return await update_conversation(
        db=db,
        user_id=user_id,
        conversation_id=conversation_id,
        update_data=update_data,
    )

