from uuid import UUID

from app.core.prompts import MELO_SYSTEM_PROMPT
from app.models.chat import Chat, MessageRole
from app.models.conversation import Conversation
from app.services.orchestrator_service import orchestrate_chat
from schemas.chat import ChatRequest, MessageCreate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def create_message(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    message_data: MessageCreate,
) -> dict:

    # Verify that the conversation exists
    # and belongs to the authenticated user.
    conversation_result = await db.execute(
        select(Conversation)
        .where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
    )

    conversation = conversation_result.scalar_one_or_none()

    if conversation is None:
        raise ValueError("Conversation not found")

    user_message = Chat(
        conversation_id=conversation_id,
        role=MessageRole.USER,
        content=message_data.content,
    )

    db.add(user_message)
    await db.flush()

    # Get conversation history.
    result = await db.execute(
        select(Chat)
        .where(Chat.conversation_id == conversation_id)
        .order_by(Chat.created_at.asc())
    )

    messages = result.scalars().all()

    conversation_messages = [
        {
            "role": message.role.value,
            "content": message.content,
        }
        for message in messages
    ]

    messages_for_model = [
        {
            "role": "system",
            "content": MELO_SYSTEM_PROMPT,
        },
        *conversation_messages,
    ]

    response = await orchestrate_chat(
        conversation_id=conversation_id,
        chat_request=ChatRequest(
            conversation_id=conversation_id,
            message=message_data.content,
        ),
        messages=messages_for_model,
    )

    assistant_message = Chat(
        conversation_id=conversation_id,
        role=MessageRole.ASSISTANT,
        content=response["response"],
    )

    db.add(assistant_message)

    await db.commit()
    await db.refresh(assistant_message)

    return {
        "conversation_id": conversation_id,
        "message_id": assistant_message.id,
        "content": assistant_message.content,
        "model": response["model"],
    }


async def get_messages(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
) -> list[Chat]:

    # Verify conversation ownership first.
    conversation_result = await db.execute(
        select(Conversation)
        .where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
    )

    conversation = conversation_result.scalar_one_or_none()

    if conversation is None:
        raise ValueError("Conversation not found")

    result = await db.execute(
        select(Chat)
        .where(Chat.conversation_id == conversation_id)
        .order_by(Chat.created_at.asc())
    )

    return list(result.scalars().all())


async def update_message(
    db: AsyncSession,
    message_id: UUID,
    user_id: UUID,
    content: str,
) -> Chat:

    result = await db.execute(
        select(Chat, Conversation)
        .join(
            Conversation,
            Chat.conversation_id == Conversation.id,
        )
        .where(
            Chat.id == message_id,
            Conversation.user_id == user_id,
        )
    )

    row = result.first()

    if row is None:
        raise ValueError("Message not found")

    message, _conversation = row

    if message.role != MessageRole.USER:
        raise ValueError("Only user messages can be edited")

    message.content = content

    await db.commit()
    await db.refresh(message)

    return message


async def delete_message(
    db: AsyncSession,
    message_id: UUID,
    user_id: UUID,
) -> None:

    result = await db.execute(
        select(Chat, Conversation)
        .join(
            Conversation,
            Chat.conversation_id == Conversation.id,
        )
        .where(
            Chat.id == message_id,
            Conversation.user_id == user_id,
        )
    )

    row = result.first()

    if row is None:
        raise ValueError("Message not found")

    message, _conversation = row

    await db.delete(message)

    await db.commit()