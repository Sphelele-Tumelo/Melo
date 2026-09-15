from abc import ABC, abstractmethod


class BaseModelProvider(ABC):

    @abstractmethod
    async def generate(self, messages: list[dict[str, str]]) -> str:
        pass