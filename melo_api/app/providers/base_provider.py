from abc import ABC, abstractmethod


class BaseModelProvider(ABC):

    @abstractmethod
    async def generate(self, prompt: str) -> str:
        pass