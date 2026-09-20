from uuid import uuid4

from app.data.chroma import ChromaDatabase
from app.data.database import AsyncSessionLocal
from app.models import Memory, User  # importing both forces both to register
from app.services.memory_service import create_memory, delete_memory, update_memory
from schemas.memory import MemoryCreate, MemoryUpdate


async def main():
    chroma = ChromaDatabase()  # moved to the top

    async with AsyncSessionLocal() as db:
        test_user = User(
            email=f"test_{uuid4().hex[:8]}@melo.dev",
            password_hash="not_a_real_hash_for_testing",
            display_name="Test User",
        )
        db.add(test_user)
        await db.commit()
        await db.refresh(test_user)

        memory = await create_memory(
            db=db,
            user_id=test_user.id,
            memory_data=MemoryCreate(
                content="Melo is building NeoMind.",
                memory_type="general",
            ),
        )

        updated = await update_memory(
            db=db,
            memory_id=memory.id,
            user_id=test_user.id,
            memory_data=MemoryUpdate(content="Melo is building NeoMind and DocMind.", memory_type="general"),
        )
        chroma_after_update = chroma.memory_collection.get(ids=[str(updated.id)])
        print("After update:", chroma_after_update["documents"])

        await delete_memory(db=db, memory_id=memory.id, user_id=test_user.id)
        chroma_after_delete = chroma.memory_collection.get(ids=[str(memory.id)])
        print("After delete:", chroma_after_delete["ids"])

        print("PostgreSQL memory created:")
        print(memory.id)
        print(memory.content)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())