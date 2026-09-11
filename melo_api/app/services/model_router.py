from app.core.enum import MeloModel
from app.providers.base_provider import BaseModelProvider
from app.providers.groq_provider import GroqProvider


def get_model_provider(model: MeloModel) -> BaseModelProvider:

    if model == MeloModel.SWIFT:
        return GroqProvider()

    raise ValueError(f"Unsupported Melo model: {model}")