# tests/test_streaming.py
import asyncio

from app.core.enum import MeloModel
from app.services.streaming_responses import stream_chat_completion


async def main():
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Count from 1 to 5."},
    ]
    async for chunk in stream_chat_completion(messages, model=MeloModel.SWIFT):
        print(chunk, end="", flush=True)

if __name__ == "__main__":
    asyncio.run(main())