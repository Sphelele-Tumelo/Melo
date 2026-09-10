from uuid import UUID

from pydantic import BaseModel


class ConversationCreate(BaseModel):
    title: str = "New chat"


class ConversationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str