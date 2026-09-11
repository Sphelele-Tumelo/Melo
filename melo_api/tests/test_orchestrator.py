import asyncio
from uuid import uuid4

from app.services.orchestrator_service import orchestrate_chat
from schemas.chat import ChatRequest


async def main():
    conversation_id = uuid4()

    chat_request = ChatRequest(
        conversation_id=conversation_id,
        message="Hello Melo, introduce yourself in one sentence.",
    )

    response = await orchestrate_chat(
        conversation_id=conversation_id,
        chat_request=chat_request,
    )

    print(response)


if __name__ == "__main__":
    asyncio.run(main())