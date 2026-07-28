from fastapi import APIRouter
from app.api.endpoints import interviews, candidates

api_router = APIRouter()
api_router.include_router(interviews.router, prefix="/interviews", tags=["Interviews"])
api_router.include_router(candidates.router, prefix="/candidates", tags=["Candidates"])
