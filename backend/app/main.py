from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.infrastructure.database import engine, Base, SessionLocal
from app.domain.models import Candidate, Job

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    try:
        # Check if candidate exists
        candidate = db.query(Candidate).filter(Candidate.email == "demo@example.com").first()
        if not candidate:
            candidate = Candidate(first_name="Demo", last_name="Candidate", email="demo@example.com")
            db.add(candidate)
        
        # Check if job exists
        job = db.query(Job).filter(Job.title == "Senior AI Engineer").first()
        if not job:
            job = Job(title="Senior AI Engineer", description="Build awesome multi-agent systems.", department="Engineering")
            db.add(job)
            
        db.commit()
    finally:
        db.close()

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok"}
