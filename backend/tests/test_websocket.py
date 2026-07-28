from fastapi.testclient import TestClient
from app.main import app

def test_websocket_connection():
    client = TestClient(app)
    # Testing the duplex stream. ID 999 is used since DB validation inside WS is bypassed for this test
    with client.websocket_connect("/api/v1/interviews/999/ws") as websocket:
        websocket.send_json({
            "event": "candidate_answer",
            "payload": {"text": "I like React."}
        })
        
        # We expect the WS to gracefully catch the Flowise connection error
        # since Flowise isn't running in our test environment
        data = websocket.receive_json()
        assert data["event"] == "error"
        assert "AI Agent failed" in data["payload"]["message"]
