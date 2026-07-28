import asyncio
import httpx
import websockets
import json
import sys

DUMMY_PDF_PATH = "real_resume.pdf"

def create_pdf():
    minimal_pdf = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 135 >>\nstream\nBT /F1 12 Tf 100 700 Td (Expert in ChromaDB, React, Node.js, and scaling microservices. Built an AI chat bot that scales to 10k users.) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000214 00000 n \n0000000302 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n488\n%%EOF"
    with open(DUMMY_PDF_PATH, "wb") as f:
        f.write(minimal_pdf)

async def validate():
    print("=== STARTING FULL VALIDATION ===")
    create_pdf()
    
    # 1. Health
    print("[1] Verifying backend health endpoint...")
    async with httpx.AsyncClient() as client:
        res = await client.get("http://localhost:8000/health")
        print("Health:", res.status_code)
        if res.status_code != 200: sys.exit(1)
        
    # 6. Upload Resume
    print("[6] Uploading resume (implicit check of Postgres, Chroma, Gemini)...")
    candidate_id = 1
    async with httpx.AsyncClient(timeout=30.0) as client:
        with open(DUMMY_PDF_PATH, "rb") as f:
            files = {"file": (DUMMY_PDF_PATH, f, "application/pdf")}
            res = await client.post(f"http://localhost:8000/api/v1/candidates/{candidate_id}/resume", files=files)
        print("Upload:", res.status_code, res.text)
        if res.status_code != 200: sys.exit(1)

    # 10. Start Interview
    print("[10] Creating Interview...")
    async with httpx.AsyncClient() as client:
        payload = {"candidate_id": candidate_id, "job_id": 1}
        res = await client.post("http://localhost:8000/api/v1/interviews/", json=payload)
        print("Interview Created:", res.status_code, res.text)
        if res.status_code != 200: sys.exit(1)
        interview_id = res.json().get("interview_id")
        
    print(f"[11] Asking questions via WebSocket (checking Flowise & Memory)...")
    ws_url = f"ws://localhost:8000/api/v1/interviews/{interview_id}/ws"
    
    try:
        async with websockets.connect(ws_url) as ws:
            # Q1
            print("Candidate: What projects have I worked on?")
            await ws.send(json.dumps({"event": "candidate_answer", "payload": {"text": "What projects have I worked on?"}}))
            res1 = await ws.recv()
            print("🤖 Agent (1):", res1)
            
            # Q2
            print("Candidate: I built an AI chat bot.")
            await ws.send(json.dumps({"event": "candidate_answer", "payload": {"text": "I built an AI chat bot."}}))
            res2 = await ws.recv()
            print("🤖 Agent (2):", res2)
            
            # Q3
            print("Candidate: I used React and Node.js.")
            await ws.send(json.dumps({"event": "candidate_answer", "payload": {"text": "I used React and Node.js."}}))
            res3 = await ws.recv()
            print("🤖 Agent (3):", res3)
    except Exception as e:
        print("WS Error:", e)
        sys.exit(1)
        
    print("=== VALIDATION SUCCESSFUL ===")

if __name__ == "__main__":
    asyncio.run(validate())
