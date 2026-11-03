from fastapi import Request
from fastapi.responses import JSONResponse


def register_exception_handlers(app):
    """
    Register custom global exception handlers for clean and standardized JSON responses.
    """

    @app.exception_handler(404)
    async def custom_404_handler(request: Request, __):
        return JSONResponse(
            status_code=404,
            content={
                "status": 404,
                "error": "Not Found",
                "message": f"A rota ou recurso '{request.url.path}' não foi encontrado na API da Empório da Música.",
                "path": request.url.path,
            },
        )

    @app.exception_handler(Exception)
    async def custom_500_handler(__, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "status": 500,
                "error": "Internal Server Error",
                "message": "Ocorreu um erro interno no servidor ao processar sua requisição.",
            },
        )