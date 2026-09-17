from uuid import UUID

from app.services.chatservice import (
    create_message,
    delete_message,
    get_messages,
    update_message,
)
from schemas.chat import MessageCreate
from sqlalchemy.ext.asyncio import AsyncSession


async def create_message_controller(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    message_data: MessageCreate,
):
    return await create_message(
        db=db,
        conversation_id=conversation_id,
        user_id=user_id,
        message_data=message_data,
    )


async def get_messages_controller(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
):

   return await get_messages(
        db=db,
        conversation_id=conversation_id,
        user_id=user_id,
   )

async def update_message_controller(
    db: AsyncSession,
    conversation_id: UUID,
    message_id: UUID,
    user_id: UUID,
    message_data: MessageCreate,
):

    return await update_message(
        db=db,
        conversation_id=conversation_id,
        message_id=message_id,
        user_id=user_id,
        content=message_data.content,
    )

async def delete_message_controller(
    db: AsyncSession,
    conversation_id: UUID,
    message_id: UUID,
    user_id: UUID,
):
    return await delete_message(
        db=db,
        conversation_id=conversation_id,
        message_id=message_id,
        user_id=user_id,
    )