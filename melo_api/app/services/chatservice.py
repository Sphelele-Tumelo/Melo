import json
import re
from typing import AsyncGenerator
from uuid import UUID

from app.core.enum import MeloModel
from app.core.prompts import MELO_SYSTEM_PROMPT
from app.data.chroma import ChromaDatabase
from app.models.chat import Chat, MessageRole
from app.models.conversation import Conversation
from app.services.embeddings_service import EmbeddingService
from app.services.memory_service import create_memory
from app.services.model_router import get_model_provider
from app.services.orchestrator_service import orchestrate_chat
from schemas.chat import ChatRequest, MessageCreate
from schemas.memory import MemoryCreate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

chroma = ChromaDatabase()
embedding_service = EmbeddingService()

REMEMBER_TRIGGER_PATTERN = re.compile(
    r"\b(remember (that|this)|don'?t forget (that|this)|keep in mind (that)?)\b",
    re.IGNORECASE,
)


def _extract_memory_content(raw_message: str) -> str:
    cleaned = REMEMBER_TRIGGER_PATTERN.sub("", raw_message, count=1).strip()
    return cleaned.lstrip(",:").strip() or raw_message


async def _prepare_turn(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    message_data: MessageCreate,
) -> list[dict]:
    """
    Shared setup for both streaming and non-streaming turns:
    - Verifies conversation ownership
    - Saves the user's message
    - Runs the manual remember-trigger
    - Retrieves relevant memories
    - Builds the final messages_for_model list

    Returns messages_for_model so the caller can either stream or
    call orchestrate_chat with it.
    """
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

    if REMEMBER_TRIGGER_PATTERN.search(message_data.content):
        memory_content = _extract_memory_content(message_data.content)
        await create_memory(
            db=db,
            user_id=user_id,
            memory_data=MemoryCreate(
                content=memory_content,
                memory_type="general",
            ),
        )

    query_embedding = embedding_service.generate_embedding(message_data.content)
    memory_results = chroma.search_memories(
        embedding=query_embedding,
        user_id=str(user_id),
        limit=5,
    )

    retrieved_memories = memory_results.get("documents", [[]])[0] if memory_results else []

    memory_context = ""
    if retrieved_memories:
        memory_context = "\n\nRelevant things you know about this user:\n" + "\n".join(
            f"- {mem}" for mem in retrieved_memories
        )

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

    return [
        {
            "role": "system",
            "content": MELO_SYSTEM_PROMPT + memory_context,
        },
        *conversation_messages,
    ]


async def create_message(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    message_data: MessageCreate,
) -> dict:

    messages_for_model = await _prepare_turn(db, conversation_id, user_id, message_data)

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


async def create_message_stream(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    message_data: MessageCreate,
    model: MeloModel = MeloModel.SWIFT,
) -> AsyncGenerator[str, None]:
    """
    Same memory pipeline as create_message, but streams the assistant's
    reply token-by-token as SSE, then persists the full accumulated
    message to Postgres once the stream completes.
    """
    messages_for_model = await _prepare_turn(db, conversation_id, user_id, message_data)

    provider = get_model_provider(model)

    accumulated_text = ""

    try:
        async for delta in provider.stream_chat(messages_for_model):
            accumulated_text += delta
            payload = json.dumps({"content": delta})
            yield f"data: {payload}\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
        return  # don't save a partial/broken message on failure

    # Stream finished successfully — persist the full assistant reply now
    assistant_message = Chat(
        conversation_id=conversation_id,
        role=MessageRole.ASSISTANT,
        content=accumulated_text,
    )

    db.add(assistant_message)
    await db.commit()
    await db.refresh(assistant_message)

    yield f"data: {json.dumps({'done': True, 'message_id': str(assistant_message.id)})}\n\n"


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
    conversation_id: UUID,
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
            Chat.conversation_id == conversation_id,
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
    conversation_id: UUID,
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
            Chat.conversation_id == conversation_id,
            Conversation.user_id == user_id,
        )
    )

    row = result.first()

    if row is None:
        raise ValueError("Message not found")

    message, _conversation = row

    await db.delete(message)

    await db.commit()