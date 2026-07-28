import httpx
import asyncio
import websockets
import json

async def test_backend_integration():
    # 1. Create Interview
    print("Creating interview...")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/interviews/",
            json={"candidate_id": 1, "job_id": 1}
        )
        if response.status_code != 200:
            print("Failed to create interview:", response.status_code, response.text)
            return
            
        data = response.json()
        interview_id = data["interview_id"]
        print(f"Created Interview ID: {interview_id}")
        
    # 2. Connect to WebSocket
    ws_url = f"ws://localhost:8000/api/v1/interviews/{interview_id}/ws"
    print(f"Connecting to {ws_url}...")
    
    try:
        async with websockets.connect(ws_url) as websocket:
            print("Connected!")
            
            # Send candidate answer
            payload = {
                "event": "candidate_answer",
                "payload": {"text": "Hello, I am ready for the interview!"}
            }
            await websocket.send(json.dumps(payload))
            print("Sent:", payload)
            
            # Wait for agent question
            response = await websocket.recv()
            print("Received from Agent:", response)
    except Exception as e:
        print("WebSocket Error:", e)

if __name__ == "__main__":
    asyncio.run(test_backend_integration())
