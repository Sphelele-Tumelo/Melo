from uuid import UUID

from app.services.memory_service import (
    create_memory,
    delete_memory,
    get_memories,
    get_memory,
    update_memory,
)
from schemas.memory import MemoryCreate, MemoryUpdate
from sqlalchemy.ext.asyncio import AsyncSession


async def create_memory_controller(
    db: AsyncSession,
    user_id: UUID,
    memory_data: MemoryCreate,
):
    return await create_memory(
        db=db,
        user_id=user_id,
        memory_data=memory_data,
    )


async def get_memories_controller(
    db: AsyncSession,
    user_id: UUID,
):
    return await get_memories(
        db=db,
        user_id=user_id,
    )


async def get_memory_controller(
    db: AsyncSession,
    memory_id: UUID,
    user_id: UUID,
):
    return await get_memory(
        db=db,
        memory_id=memory_id,
        user_id=user_id,
    )


async def update_memory_controller(
    db: AsyncSession,
    memory_id: UUID,
    user_id: UUID,
    memory_data: MemoryUpdate,
):
    return await update_memory(
        db=db,
        memory_id=memory_id,
        user_id=user_id,
        memory_data=memory_data,
    )


async def delete_memory_controller(
    db: AsyncSession,
    memory_id: UUID,
    user_id: UUID,
):
    return await delete_memory(
        db=db,
        memory_id=memory_id,
        user_id=user_id,
    )