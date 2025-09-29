from fastapi import APIRouter

from .parser import parser_router

v1_router = APIRouter(prefix="/api/v1", tags=["v1"])
v1_router.include_router(parser_router, prefix="/parser")

__all__ = ["v1_router"]
