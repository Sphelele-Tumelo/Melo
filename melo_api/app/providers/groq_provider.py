from collections.abc import AsyncGenerator

from app.core.config import settings
from app.providers.base_provider import BaseModelProvider
from groq import AsyncGroq

MODEL_NAME = "openai/gpt-oss-120b"


class GroqProvider(BaseModelProvider):

    def __init__(self):
        self.client = AsyncGroq(
            api_key=settings.groq_api_key
        )

    async def generate(
        self,
        messages: list[dict[str, str]],
    ) -> str:

        response = await self.client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            max_completion_tokens=settings.model_max_completion_tokens,
        )

        return response.choices[0].message.content or ""

    async def stream_chat(
        self,
        messages: list[dict[str, str]],
    ) -> AsyncGenerator[str, None]:

        stream = await self.client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            max_completion_tokens=settings.model_max_completion_tokens,
            stream=True,
        )

        async for chunk in stream:

            delta = chunk.choices[0].delta.content

            if delta:
                yield delta