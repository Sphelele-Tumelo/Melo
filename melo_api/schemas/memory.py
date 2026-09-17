from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MemoryCreate(BaseModel):
    content: str
    memory_type: str = "general"


class MemoryUpdate(BaseModel):
    content: str
    memory_type: str | None = None


class MemoryResponse(BaseModel):
    id: UUID
    user_id: UUID
    content: str
    memory_type: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)