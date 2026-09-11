from uuid import UUID

from app.core.enum import MeloModel
from app.services.model_router import get_model_provider
from schemas.chat import ChatRequest


async def orchestrate_chat(
    conversation_id: UUID,
    chat_request: ChatRequest,
):
    user_message = chat_request.message

    provider = get_model_provider(MeloModel.SWIFT)

    response = await provider.generate(user_message)

    return {
        "conversation_id": conversation_id,
        "message": user_message,
        "model": MeloModel.SWIFT.value,
        "response": response,
    }