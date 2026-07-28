import asyncio
import httpx
import websockets
import json
import os
import sys

DUMMY_PDF_PATH = "real_resume.pdf"

def create_pdf():
    # If pypdf fails to parse a fake pdf string, we will provide a valid minimal PDF.
    minimal_pdf = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 75 >>\nstream\nBT /F1 12 Tf 100 700 Td (Expert in ChromaDB, React, Node.js, and scaling microservices.) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000214 00000 n \n0000000302 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n428\n%%EOF"
    with open(DUMMY_PDF_PATH, "wb") as f:
        f.write(minimal_pdf)

async def test_all():
    print("=== FINAL PRODUCTION VALIDATION ===")
    create_pdf()
    
    # 1. Upload Resume
    print("\n[Step 1] Uploading Resume...")
    candidate_id = 1
    async with httpx.AsyncClient(timeout=30.0) as client:
        with open(DUMMY_PDF_PATH, "rb") as f:
            files = {"file": (DUMMY_PDF_PATH, f, "application/pdf")}
            response = await client.post(f"http://localhost:8000/api/v1/candidates/{candidate_id}/resume", files=files)
            
        print("Upload Response:", response.status_code, response.text)
        if response.status_code != 200:
            print("Failed at Step 1")
            return
            
    # 5. Start an interview
    print("\n[Step 5] Creating Interview...")
    async with httpx.AsyncClient() as client:
        payload = {"candidate_id": candidate_id, "job_id": 1}
        response = await client.post("http://localhost:8000/api/v1/interviews/", json=payload)
        print("Create Interview Response:", response.status_code, response.text)
        if response.status_code != 200:
            print("Failed to create interview")
            return
        
        data = response.json()
        interview_id = data.get("interview_id")
        
    print(f"\n[Step 8] Connecting to WS for interview {interview_id}...")
    ws_url = f"ws://localhost:8000/api/v1/interviews/{interview_id}/ws"
    
    try:
        async with websockets.connect(ws_url) as ws:
            # We will answer 3 times to confirm questions
            print("\n--- Interview Flow ---")
            
            # Send initial greeting
            await ws.send(json.dumps({
                "event": "candidate_answer",
                "payload": {"text": "Hello, I am ready to begin. What do you think about my experience with React and scaling?"}
            }))
            
            # Wait for Agent Response 1
            res1 = await ws.recv()
            print("🤖 Agent (1):", res1)
            
            # Answer 1
            await ws.send(json.dumps({
                "event": "candidate_answer",
                "payload": {"text": "I used ChromaDB extensively for similarity search."}
            }))
            
            # Wait for Agent Response 2
            res2 = await ws.recv()
            print("🤖 Agent (2):", res2)
            
            # Answer 2
            await ws.send(json.dumps({
                "event": "candidate_answer",
                "payload": {"text": "Yes, I also used Node.js for backend microservices."}
            }))
            
            # Wait for Agent Response 3
            res3 = await ws.recv()
            print("🤖 Agent (3):", res3)
            
    except Exception as e:
        print("WS Error:", e)
        
    print("\n=== VALIDATION COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(test_all())
