from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.api import router as api_router
from backend.exceptions import register_exception_handlers

app = FastAPI(
    title="Empório da Música API",
    description="Backend API with AI Agent integration for Empório da Música store process.",
    version="1.0.0"
)

# Enable CORS for Frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
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