import json
import re
from typing import AsyncGenerator
from uuid import UUID

import math

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





# ============================================================
# MELO CONTEXT MANAGEMENT
# ============================================================

# Your current Groq organization has an 8K TPM limit.
# We intentionally stay below it to leave room for estimation
# differences and normal API overhead.
MODEL_INPUT_TOKEN_BUDGET = 4500

# Keep generated responses bounded so one request doesn't
# consume the entire TPM allowance.
MODEL_MAX_COMPLETION_TOKENS = 1200


def _estimate_tokens(text: str) -> int:
    """
    Rough token estimator.

    We don't need an exact tokenizer here.
    A conservative ~4 characters per token estimate is enough
    for deciding how much conversation history to send.
    """
    if not text:
        return 0

    return max(1, math.ceil(len(text) / 4))


def _estimate_message_tokens(message: dict) -> int:
    """
    Estimate the token cost of one model message.
    """
    content = message.get("content", "")

    if not isinstance(content, str):
        content = str(content)

    # Small allowance for the message role / formatting.
    return _estimate_tokens(content) + 4


def _limit_model_context(messages: list[dict[str, str]]) -> list[dict[str, str]]:
    """
    Keep the model request within our input-token budget.

    Strategy:

    1. Always preserve the system prompt.
    2. Always preserve the newest user message.
    3. Fill the remaining budget with the newest conversation
       messages first.
    4. Older messages are dropped from THIS model request only.
       They remain safely stored in PostgreSQL.
    """

    if not messages:
        return messages

    # --------------------------------------------------------
    # Separate system messages from conversation messages.
    # --------------------------------------------------------

    system_messages = [
        message
        for message in messages
        if message.get("role") == "system"
    ]

    conversation_messages = [
        message
        for message in messages
        if message.get("role") != "system"
    ]

    # If there is no system prompt, just work with conversation.
    if not system_messages:
        system_messages = []

    # --------------------------------------------------------
    # Calculate how much of the budget the system prompt uses.
    # --------------------------------------------------------

    system_tokens = sum(
        _estimate_message_tokens(message)
        for message in system_messages
    )

    remaining_budget = max(
        0,
        MODEL_INPUT_TOKEN_BUDGET - system_tokens
    )

    # --------------------------------------------------------
    # Always preserve the newest message.
    # --------------------------------------------------------

    if not conversation_messages:
        return system_messages

    newest_message = conversation_messages[-1]

    newest_tokens = _estimate_message_tokens(newest_message)

    selected_messages = [newest_message]

    remaining_budget -= newest_tokens

    # --------------------------------------------------------
    # Walk backwards through older messages.
    #
    # This means Melo sees the newest context first.
    # --------------------------------------------------------

    older_messages = conversation_messages[:-1]

    for message in reversed(older_messages):
        message_tokens = _estimate_message_tokens(message)

        if message_tokens > remaining_budget:
            continue

        selected_messages.append(message)
        remaining_budget -= message_tokens

    # We collected messages newest -> oldest.
    # Reverse them back into chronological order.
    selected_messages.reverse()

    final_messages = [
        *system_messages,
        *selected_messages,
    ]

    estimated_total = sum(
        _estimate_message_tokens(message)
        for message in final_messages
    )

    print(
        "🧠 CONTEXT MANAGER:",
        f"{len(messages)} messages -> "
        f"{len(final_messages)} messages | "
        f"estimated tokens: {estimated_total}",
        flush=True,
    )

    return final_messages

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
    Debug version of the streaming pipeline.

    Logs each major stage so we can identify where the request gets stuck.
    """

    print("🔥 STREAM START", flush=True)
    print(f"conversation_id: {conversation_id}", flush=True)
    print(f"user_id: {user_id}", flush=True)
    print(f"message length: {len(message_data.content)}", flush=True)
    print(f"model: {model}", flush=True)

    # ---------------------------------------------------------
    # 1. PREPARE TURN
    # ---------------------------------------------------------

    try:
        print("🧠 STARTING _prepare_turn()", flush=True)
    
        messages_for_model = await _prepare_turn(
            db,
            conversation_id,
            user_id,
            message_data,
        )
    
        print(
            "✅ _prepare_turn() COMPLETE",
            flush=True,
        )
    
        print(
            f"messages prepared before context limit: "
            f"{len(messages_for_model)}",
            flush=True,
        )
    
        messages_for_model = _limit_model_context(
            messages_for_model
        )

    except Exception as e:
        print("💥 _prepare_turn() FAILED", flush=True)
        print(
            f"error type: {type(e).__name__}",
            flush=True,
        )
        print(
            f"error: {repr(e)}",
            flush=True,
        )
    
        import traceback
        traceback.print_exc()
     
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
        return

    # ---------------------------------------------------------
    # 2. GET MODEL PROVIDER
    # ---------------------------------------------------------

    try:
        print("🤖 GETTING MODEL PROVIDER", flush=True)

        provider = get_model_provider(model)

        print(
            f"✅ PROVIDER CREATED: {provider.__class__.__name__}",
            flush=True,
        )

    except Exception as e:
        print("💥 PROVIDER CREATION FAILED", flush=True)
        print(f"error type: {type(e).__name__}", flush=True)
        print(f"error: {repr(e)}", flush=True)

        import traceback
        traceback.print_exc()

        yield f"data: {json.dumps({'error': str(e)})}\n\n"
        return

    # ---------------------------------------------------------
    # 3. START MODEL STREAM
    # ---------------------------------------------------------

    accumulated_text = ""

    try:
        print("🚀 STARTING MODEL STREAM", flush=True)

        async for delta in provider.stream_chat(messages_for_model):

            print(f"🧩 DELTA RECEIVED: {repr(delta)}", flush=True)

            accumulated_text += delta

            payload = json.dumps({
                "content": delta
            })

            yield f"data: {payload}\n\n"

        print("✅ MODEL STREAM COMPLETE", flush=True)
        print(
            f"assistant response length: {len(accumulated_text)}",
            flush=True,
        )

    except Exception as e:
        print("💥 MODEL STREAM FAILED", flush=True)
        print(f"error type: {type(e).__name__}", flush=True)
        print(f"error: {repr(e)}", flush=True)

        import traceback
        traceback.print_exc()

        yield f"data: {json.dumps({'error': str(e)})}\n\n"
        return

    # ---------------------------------------------------------
    # 4. SAVE ASSISTANT MESSAGE
    # ---------------------------------------------------------

    try:
        print("💾 SAVING ASSISTANT MESSAGE", flush=True)

        assistant_message = Chat(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=accumulated_text,
        )

        db.add(assistant_message)

        await db.commit()
        await db.refresh(assistant_message)

        print(
            f"✅ ASSISTANT MESSAGE SAVED: {assistant_message.id}",
            flush=True,
        )

    except Exception as e:
        print("💥 ASSISTANT MESSAGE SAVE FAILED", flush=True)
        print(f"error type: {type(e).__name__}", flush=True)
        print(f"error: {repr(e)}", flush=True)

        import traceback
        traceback.print_exc()

        # Roll back the session so it isn't left in a failed state.
        await db.rollback()

        yield f"data: {json.dumps({'error': str(e)})}\n\n"
        return

    # ---------------------------------------------------------
    # 5. DONE
    # ---------------------------------------------------------

    print("🏁 STREAM FINISHED SUCCESSFULLY", flush=True)

    yield f"data: {json.dumps({
        'done': True,
        'message_id': str(assistant_message.id),
    })}\n\n"

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