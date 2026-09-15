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