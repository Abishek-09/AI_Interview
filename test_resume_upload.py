import urllib.request
import urllib.error
import json
import asyncio
import websockets
import os

# Create a dummy PDF with actual text using a simple python library like reportlab if available, or just mock the file.
# Since we just need to test the RAG flow, we can use a known PDF or mock it.
# Actually, the user's requirement is to parse uploaded PDF resumes.
# Let's write a mock text file but give it a PDF extension, and temporarily mock the extract_text function to return hardcoded text if pypdf fails to parse it.

def upload_resume(candidate_id: int):
    # This just hits the endpoint to trigger the processing
    print(f"Uploading resume for candidate {candidate_id}...")
    
    # We will just send some dummy bytes that represent a PDF
    # Since a real PDF requires valid magic bytes, we'll send a minimal valid PDF
    minimal_pdf = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Candidate worked on a Python RAG project using ChromaDB.) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000214 00000 n \n0000000302 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n397\n%%EOF"
    
    # We need to send a multipart/form-data request
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    body = (
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"file\"; filename=\"resume.pdf\"\r\n"
        f"Content-Type: application/pdf\r\n\r\n"
    ).encode('utf-8') + minimal_pdf + f"\r\n--{boundary}--\r\n".encode('utf-8')
    
    req = urllib.request.Request(
        f'http://localhost:8000/api/v1/candidates/{candidate_id}/resume',
        data=body,
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            'Content-Length': str(len(body))
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f'Upload response: {data}')
            return True
    except urllib.error.HTTPError as e:
        print(f'HTTP Error: {e.code} - {e.read().decode()}')
        return False
    except Exception as e:
        print(f'Error: {e}')
        return False

async def test_backend_integration():
    candidate_id = 1
    if not upload_resume(candidate_id):
        return

    print('Creating interview...')
    req = urllib.request.Request('http://localhost:8000/api/v1/interviews/', data=json.dumps({'candidate_id': candidate_id, 'job_id': 1}).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            interview_id = data['interview_id']
            print(f'Created Interview ID: {interview_id}')
    except Exception as e:
        print('Error:', e)
        return

    ws_url = f'ws://localhost:8000/api/v1/interviews/{interview_id}/ws'
    print(f'Connecting to {ws_url}...')
    
    try:
        async with websockets.connect(ws_url) as websocket:
            print('Connected!')
            
            # Step 1: User says hello
            payload = {'event': 'candidate_answer', 'payload': {'text': 'What projects has the candidate worked on?'}}
            await websocket.send(json.dumps(payload))
            print('Sent:', payload)
            
            response = await websocket.recv()
            print('Received from Agent:', response)
            
    except Exception as e:
        print('WebSocket Error:', e)

if __name__ == "__main__":
    asyncio.run(test_backend_integration())
