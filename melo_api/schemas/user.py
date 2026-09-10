from uuid import UUID

from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    display_name: str | None = None


class UserResponse(BaseModel):
    id: UUID
    email: str
    display_name: str | None = None