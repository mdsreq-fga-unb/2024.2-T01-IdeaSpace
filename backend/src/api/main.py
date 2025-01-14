from fastapi import APIRouter

from src.api.routes import login, users
from src.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)

# if settings.ENVIRONMENT == "local":
#     api_router.include_router(private.router)
