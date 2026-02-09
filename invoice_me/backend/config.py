from pydantic_settings import BaseSettings, SettingsConfigDict, PydanticBaseSettingsSource, JsonConfigSettingsSource
from pydantic import Field
from typing import Tuple, Type

class Secrets(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore")
    mongo_db_connection_string: str = Field(..., description="MongoDB connection string")
    mongo_db_prod_database_name: str = Field(..., description="MongoDB prod database name")
    mongo_db_staging_database_name: str = Field(..., description="MongoDB staging database name")
    supabase_jwks_url: str = Field(..., description="Supabase JWKS URL")
    supabase_issuer: str = Field(..., description="Supabase auth URL")
    supabase_audience: str = Field(..., description="Supabase auth audience")
    environment: str = Field(..., description="The environment the application is running in")



class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(json_file="./app_settings.json", json_file_encoding="utf-8", case_sensitive=False)
    app_name: str = Field(..., description="The name of the application")
    app_description: str = Field(..., description="A brief description of the application")
    app_version: str = Field(..., description="The version of the application")
    allowed_origins: list[str] = Field(default=["http://localhost:3000"], description="A list of allowed origins for CORS")

    # Needed to read from JSON file
    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: Type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> Tuple[PydanticBaseSettingsSource, ...]:
        # This is basically telling pydantic to read from a list of places
        # By default it reads from init, env, dotenv, and file secrets
        # We are adding JsonConfigSettingsSource to read from a JSON file
        # We dont have to return all of them, we can just return what we want but for the sake of completeness we return them all
        return (
            init_settings,
            env_settings,
            dotenv_settings,
            JsonConfigSettingsSource(settings_cls),  # This line enables JSON reading
            file_secret_settings,
        )