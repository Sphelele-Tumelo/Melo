#groq provider

from app.providers.base_provider import BaseModelProvider


class GroqProvider(BaseModelProvider):
    async def generate(self, prompt: str) -> str:
        # Implementation for generating response with Groq
        pass