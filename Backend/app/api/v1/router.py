from fastapi import APIRouter

from app.api.v1.endpoints.assets import router as assets_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.agent import router as agent_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(assets_router)
api_v1_router.include_router(agent_router)
