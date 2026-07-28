import asyncio
import httpx
import websockets
import json
import os
import sys

DUMMY_PDF_PATH = "test_resume.pdf"
def create_dummy_pdf():
    try:
        from fpdf import FPDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt="Alice Smith", ln=1, align='C')
        pdf.cell(200, 10, txt="Senior Software Engineer", ln=2, align='L')
        pdf.cell(200, 10, txt="Skills: Python, TypeScript, ChromaDB, Flowise.", ln=3, align='L')
        pdf.output(DUMMY_PDF_PATH)
    except ImportError:
        pass # fpdf not installed, use fallback or just fail

async def test_audit():
    create_dummy_pdf()
    print("Testing Resume Upload (Step 5 & 6)...")
    
    async with httpx.AsyncClient() as client:
        cand_resp = await client.post("http://localhost:8000/api/v1/candidates/", json={"first_name": "Alice", "last_name": "Smith", "email": "alice_test@example.com"})
        print("CANDIDATE RESPONSE:", cand_resp.status_code, cand_resp.text)
        candidate_id = cand_resp.json()["id"]
    async with httpx.AsyncClient() as client:
        with open(DUMMY_PDF_PATH, "rb") as f:
            files = {"file": (DUMMY_PDF_PATH, f, "application/pdf")}
            response = await client.post(f"http://localhost:8000/api/v1/candidates/{candidate_id}/resume", files=files)
            
        print("Upload Response:", response.status_code, response.text)
        if response.status_code != 200:
            print("Failed at Step 5")
            return
            
    # Now let's try to query ChromaDB directly (Step 6 & 7)
    print("Testing ChromaDB Retrieval (Step 7)... (Skipping local check to avoid chromadb import)")
    # from app.services.resume_service import ResumeService
    # rs = ResumeService()
    # chunks = rs.retrieve_context(candidate_id, "Where did Alice work?")
    # print("Retrieved Chunks:", chunks)
    # if not chunks:
    #     print("Failed at Step 7 - No chunks retrieved.")
    
    print("Testing Interview WebSocket (Step 8 & 9)...")
    # First create an interview
    async with httpx.AsyncClient() as client:
        # Job ID 1 is seeded
        payload = {"candidate_id": candidate_id, "job_id": 1}
        response = await client.post("http://localhost:8000/api/v1/interviews/", json=payload)
        print("Create Interview Response:", response.status_code, response.text)
        if response.status_code != 200:
            print("Failed to create interview")
            return
        
        data = response.json()
        interview_id = data.get("interview_id")
        
    print(f"Connecting to WS for interview {interview_id}...")
    ws_url = f"ws://localhost:8000/api/v1/interviews/{interview_id}/ws"
    
    try:
        async with websockets.connect(ws_url) as ws:
            # Send an initial answer to trigger a question
            await ws.send(json.dumps({
                "event": "candidate_answer",
                "payload": {"text": "Hello, I am ready for the interview."}
            }))
            
            # Wait for response
            response = await ws.recv()
            print("Agent Response:", response)
    except Exception as e:
        print("WS Error:", e)

if __name__ == "__main__":
    asyncio.run(test_audit())
