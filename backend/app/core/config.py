from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise AI Interview Platform"
    API_V1_STR: str = "/api/v1"
    
    # Postgres
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str = "interview_platform"
    
    # Flowise
    FLOWISE_URL: str = "http://localhost:3000"
    FLOWISE_API_KEY: str
    FLOWISE_AGENT_ID: str
    
    # Gemini
    GEMINI_API_KEY: str
    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # ChromaDB
    CHROMADB_HOST: str = "localhost"
    CHROMADB_PORT: int = 8000

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
