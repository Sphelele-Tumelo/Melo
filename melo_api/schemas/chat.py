from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    conversation_id: UUID | None = None
    message: str = Field(min_length=1)


class ChatResponse(BaseModel):
    conversation_id: UUID
    message_id: UUID
    content: str
    model: str