from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.api import router as api_router
from exceptions import register_exception_handlers

app = FastAPI(
    title="Empório da Música API",
    description="Backend API with AI Agent integration for Empório da Música store process.",
    version="1.0.0"
)

# Enable CORS for frontend integration while keeping the default value conservative.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")

# Register modular exception handlers
register_exception_handlers(app)

@app.get("/")
def root():
    return {
        "message": "Empório da Música API is running smoothly!",
        "docs": "/docs",
        "health": "/api/health"
    }