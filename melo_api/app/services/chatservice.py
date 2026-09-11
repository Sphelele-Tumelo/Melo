from uuid import UUID

from app.models.chat import Chat, MessageRole
from app.services.orchestrator_service import orchestrate_chat
from schemas.chat import ChatRequest, MessageCreate
from sqlalchemy.ext.asyncio import AsyncSession


async def create_message(
    db: AsyncSession,
    conversation_id: UUID,
    message_data: MessageCreate,
) -> dict:
    user_message = Chat(
        conversation_id=conversation_id,
        role=MessageRole.USER,
        content=message_data.content,
    )
    db.add(user_message)

    response = await orchestrate_chat(
        conversation_id=conversation_id,
        chat_request=ChatRequest(
            conversation_id=conversation_id,
            message=message_data.content,
        ),
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