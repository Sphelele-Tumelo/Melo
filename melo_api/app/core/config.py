from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict # type: ignore


class Settings(BaseSettings):
    database_url: str

    groq_api_key: str

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    model_input_token_budget: int = Field(default=4500, ge=1)
    model_max_completion_tokens: int = Field(default=1200, ge=1)

    app_name: str = "Melo"
    environment: str = "development"

    @model_validator(mode="after")
    def validate_model_token_budget(self):
        if self.model_input_token_budget + self.model_max_completion_tokens > 6000:
            raise ValueError("Combined model token budgets must not exceed 6000")
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()