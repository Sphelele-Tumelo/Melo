from uuid import UUID

from app.data.chroma import ChromaDatabase
from app.models.memory import Memory
from app.services.embeddings_service import EmbeddingService
from schemas.memory import MemoryCreate, MemoryUpdate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

chroma = ChromaDatabase()
embedding_service = EmbeddingService()


async def create_memory(
    db: AsyncSession,
    user_id: UUID,
    memory_data: MemoryCreate,
) -> Memory:

    memory = Memory(
        user_id=user_id,
        content=memory_data.content,
        memory_type=memory_data.memory_type,
    )

    db.add(memory)

    await db.commit()
    await db.refresh(memory)

    embedding = embedding_service.generate_embedding(
        memory.content
    )

    chroma.add_memory(
        memory_id=str(memory.id),
        user_id=str(memory.user_id),
        content=memory.content,
        embedding=embedding,
        memory_type=memory.memory_type,
    )

    return memory

async def get_memories(
    db: AsyncSession,
    user_id: UUID,
) -> list[Memory]:

    result = await db.execute(
        select(Memory)
        .where(Memory.user_id == user_id)
        .order_by(Memory.updated_at.desc())
    )

    return list(result.scalars().all())


async def get_memory(
    db: AsyncSession,
    memory_id: UUID,
    user_id: UUID,
) -> Memory | None:

    result = await db.execute(
        select(Memory).where(
            Memory.id == memory_id,
            Memory.user_id == user_id,
        )
    )

    return result.scalar_one_or_none()


async def update_memory(
    db: AsyncSession,
    memory_id: UUID,
    user_id: UUID,
    memory_data: MemoryUpdate,
) -> Memory:

    result = await db.execute(
        select(Memory).where(
            Memory.id == memory_id,
            Memory.user_id == user_id,
        )
    )

    memory = result.scalar_one_or_none()

    if memory is None:
        raise ValueError("Memory not found")

    memory.content = memory_data.content

    if memory_data.memory_type is not None:
        memory.memory_type = memory_data.memory_type

    await db.commit()
    await db.refresh(memory)

    embedding = embedding_service.generate_embedding(memory.content)
    chroma.update_memory(
        memory_id=str(memory.id),
        user_id=str(memory.user_id),
        content=memory.content,
        embedding=embedding,
        memory_type=memory.memory_type,
    )

    return memory


async def delete_memory(
    db: AsyncSession,
    memory_id: UUID,
    user_id: UUID,
) -> None:

    result = await db.execute(
        select(Memory).where(
            Memory.id == memory_id,
            Memory.user_id == user_id,
        )
    )

    memory = result.scalar_one_or_none()

    if memory is None:
        raise ValueError("Memory not found")

    await db.delete(memory)
    await db.commit()

    chroma.delete_memory(memory_id=str(memory_id))