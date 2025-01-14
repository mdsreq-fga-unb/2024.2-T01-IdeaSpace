from fastapi import APIRouter

# from app.api.routes import users
from src.core.config import settings

api_router = APIRouter()
# api_router.include_router(users.router)

# if settings.ENVIRONMENT == "local":
#     api_router.include_router(private.router)
