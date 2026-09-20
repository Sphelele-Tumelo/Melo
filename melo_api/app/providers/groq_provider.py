import asyncio
from collections.abc import AsyncGenerator

from app.core.config import settings
from app.providers.base_provider import BaseModelProvider

from groq import Groq


class GroqProvider(BaseModelProvider):

    def __init__(self):
        self.client = Groq(
            api_key=settings.groq_api_key
        )

    async def generate(self, messages: list[dict[str, str]]) -> str:
        response = self.client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
        )

        return response.choices[0].message.content or ""

    async def stream_chat(self, messages: list[dict[str, str]]) -> AsyncGenerator[str, None]:
        loop = asyncio.get_event_loop()
        stream = await loop.run_in_executor(
            None,
            lambda: self.client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=messages,
                stream=True,
            ),
    )

        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta