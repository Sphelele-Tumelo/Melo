# tests/test_stream_endpoint.py
import asyncio
from uuid import uuid4

from app.data.database import AsyncSessionLocal
from app.models import Conversation, User
from app.services.chatservice import create_message_stream
from schemas.chat import MessageCreate


async def main():
    async with AsyncSessionLocal() as db:
        test_user = User(email=f"test_{uuid4().hex[:8]}@melo.dev", password_hash="x", display_name="Test")
        db.add(test_user)
        await db.commit()
        await db.refresh(test_user)

        convo = Conversation(user_id=test_user.id)  # adjust fields to match your model
        db.add(convo)
        await db.commit()
        await db.refresh(convo)

        async for chunk in create_message_stream(
            db=db,
            conversation_id=convo.id,
            user_id=test_user.id,
            message_data=MessageCreate(content="Count from 1 to 5"),
        ):
            print(chunk, end="", flush=True)


if __name__ == "__main__":
    asyncio.run(main())