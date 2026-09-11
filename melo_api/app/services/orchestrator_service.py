from uuid import UUID

from app.core.enums import MeloModel
from app.services.model_router import route_model
from schemas.chat import ChatRequest


async def orchestrate_chat(
    conversation_id: UUID,
    chat_request: ChatRequest,
):
    user_message = chat_request.message

    model = route_model(MeloModel.SWIFT)

    return {
        "conversation_id": conversation_id,
        "message": user_message,
        "model": model.value,
    }