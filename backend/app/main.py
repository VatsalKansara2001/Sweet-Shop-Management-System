from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, sweets, inventory
from app.core.config import settings
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sweet Shop Management System",
    description="A comprehensive TDD-based sweet shop management API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(sweets.router, prefix="/api", tags=["sweets"])
app.include_router(inventory.router, prefix="/api", tags=["inventory"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Sweet Shop Management System API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "Sweet Shop API is running!",
        "version": "1.0.0"
    }