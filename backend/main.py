from fastapi import FastAPI
from routes.api import router as api_router

app = FastAPI(
    title="Empório da Música API",
    description="Backend API for Empório da Música datasets and support services.",
    version="1.0.0",
)

# Include API routes
app.include_router(api_router)