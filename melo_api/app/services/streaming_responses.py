

from uuid import UUID

from app.data.database import get_db
from app.services.auth_service import get_current_user_id
from app.services.chatservice import create_message_stream
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from schemas.chat import MessageCreate
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/chat", tags=["Streaming Chat"])


@router.post("/{conversation_id}/stream")
async def stream_chat_endpoint(
    conversation_id: UUID,
    message_data: MessageCreate,
    user_id: UUID = Depends(get_current_user_id),  # now resolved from the verified token, not the request body
    db: AsyncSession = Depends(get_db),
):
    return StreamingResponse(
        create_message_stream(
            db=db,
            conversation_id=conversation_id,
            user_id=user_id,
            message_data=message_data,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )