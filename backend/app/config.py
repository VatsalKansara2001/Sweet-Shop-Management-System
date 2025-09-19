import os
from typing import List

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://sweetshop:sweetshop123@localhost:5432/sweetshop")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()