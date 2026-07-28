from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import asyncio
from app.infrastructure.database import get_db, SessionLocal
from app.domain.models import Interview, Candidate, Job, InterviewStatus
from app.services.flowise_client import FlowiseClient
from app.services.resume_service import ResumeService
from app.core.config import settings
from pydantic import BaseModel
import random

router = APIRouter()
flowise_client = FlowiseClient()
resume_service = ResumeService()

class InterviewCreate(BaseModel):
    candidate_id: int
    job_id: int

@router.post("/", response_model=dict)
def create_interview(interview_in: InterviewCreate, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == interview_in.candidate_id).first()
    job = db.query(Job).filter(Job.id == interview_in.job_id).first()
    
    if not candidate or not job:
        raise HTTPException(status_code=404, detail="Candidate or Job not found")
        
    db_interview = Interview(
        candidate_id=interview_in.candidate_id,
        job_id=interview_in.job_id,
        status=InterviewStatus.SCHEDULED
    )
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return {"interview_id": db_interview.id, "status": db_interview.status}

@router.websocket("/{interview_id}/ws")
async def interview_websocket(websocket: WebSocket, interview_id: int):
    await websocket.accept()
    
    # Get candidate_id and job context
    db = SessionLocal()
    try:
        interview = db.query(Interview).filter(Interview.id == interview_id).first()
        if not interview:
            await websocket.close(code=1008)
            return
        candidate_id = interview.candidate_id
        job_title = interview.job.title
    finally:
        db.close()
    
    try:
        while True:
            data = await websocket.receive_json()
            event = data.get("event")
            payload = data.get("payload", {})
            
            if event == "candidate_answer":
                question = payload.get("text")
                
                # RAG: Retrieve context (running synchronous call in a separate thread)
                try:
                    resume_chunk = await asyncio.to_thread(
                        resume_service.retrieve_context, candidate_id, question
                    )
                    resume_context = resume_chunk if resume_chunk else "No resume provided."
                except Exception as e:
                    print(f"Error retrieving context: {e}")
                    resume_context = "Error retrieving resume."
                
                system_prompt = (
                    "You are a Senior Technical Interviewer.\n"
                    "Always retrieve information from the candidate resume before asking a question.\n"
                    "Never invent projects.\n"
                    "If the resume contains technologies, ask deep technical questions.\n"
                    "If no relevant context exists, ask a general interview question.\n\n"
                    f"Candidate Resume Context:\n{resume_context}"
                )
                
                flowise_payload = {
                    "question": question,
                    "overrideConfig": {
                        "sessionId": f"interview_{interview_id}",
                        "systemMessagePrompt": system_prompt
                    }
                }
                
                try:
                    # Attempt to call Flowise
                    agent_response = await flowise_client.trigger_agent(settings.FLOWISE_AGENT_ID, flowise_payload)
                    await websocket.send_json({
                        "event": "agent_question",
                        "payload": {"text": agent_response.get("text", "Interesting. Can you elaborate?")}
                    })
                except Exception as e:
                    # Fallback to simulated AI response for demo purposes
                    await asyncio.sleep(1.5) # Simulate AI reasoning latency
                    fallback_responses = [
                        "That's a solid approach. How would you handle scaling this if traffic increased 10x?",
                        "Interesting choice of technology. What are the main trade-offs you considered?",
                        "Can you explain how you would handle fault tolerance in that scenario?",
                        "Thanks for explaining. Let's move on to system design. How would you architect..."
                    ]
                    await websocket.send_json({
                        "event": "agent_question",
                        "payload": {"text": random.choice(fallback_responses)}
                    })
                    
    except WebSocketDisconnect:
        pass
