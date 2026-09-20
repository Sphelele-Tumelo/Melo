from abc import ABC, abstractmethod
from typing import AsyncGenerator


class BaseModelProvider(ABC):

    @abstractmethod
    async def generate(self, messages: list[dict[str, str]]) -> str:
        pass

    @abstractmethod
    def stream_chat(self, messages: list[dict[str, str]]) -> AsyncGenerator[str, None]:
        pass