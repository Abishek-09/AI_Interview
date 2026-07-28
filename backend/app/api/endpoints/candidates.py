from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.domain.models import Candidate
from app.services.resume_service import ResumeService

from pydantic import BaseModel

class CandidateCreate(BaseModel):
    first_name: str
    last_name: str
    email: str

router = APIRouter()
resume_service = ResumeService()

@router.post("/")
def get_or_create_candidate(candidate_in: CandidateCreate, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.email == candidate_in.email).first()
    if not candidate:
        candidate = Candidate(
            first_name=candidate_in.first_name, 
            last_name=candidate_in.last_name, 
            email=candidate_in.email
        )
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
    return {"id": candidate.id, "email": candidate.email}

@router.post("/{candidate_id}/resume")
async def upload_resume(
    candidate_id: int, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    # Verify candidate exists
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    # Read file into memory
    file_bytes = await file.read()
    
    try:
        # Process the resume (extract, chunk, embed, store in ChromaDB)
        result = resume_service.process_resume(candidate_id, file_bytes)
        
        # Update candidate record to indicate a resume is processed
        candidate.resume_url = f"chromadb://candidate_{candidate_id}"
        db.commit()
        
        return {
            "message": "Resume processed successfully",
            "candidate_id": candidate_id,
            "details": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")
