from fastapi import APIRouter, status

health_check = APIRouter()


@health_check.get("/ping", tags=["Health check"], status_code=status.HTTP_200_OK)
async def ping():
    """
    A simple health check endpoint.
    """
    return {"message": "pong"}
