from datetime import datetime
from uuid import UUID

from app.models.chat import MessageRole
from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    content: str = Field(min_length=1)


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: MessageRole
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class ChatRequest(BaseModel):
    conversation_id: UUID | None = None
    message: str = Field(min_length=1)


class ChatResponse(BaseModel):
    conversation_id: UUID
    message_id: UUID
    content: str
    model: str