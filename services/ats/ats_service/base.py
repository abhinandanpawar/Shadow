from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import health_check, v1_router
from .core import settings, setup_logging

def create_app() -> FastAPI:
    """
    Configure and create the FastAPI application instance.
    """
    setup_logging()

    app = FastAPI(
        title="ATS Parser Service",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for simplicity
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_check)
    app.include_router(v1_router)

    return app
