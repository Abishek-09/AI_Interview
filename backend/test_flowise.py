import asyncio
from app.services.flowise_client import FlowiseClient

async def test():
    client = FlowiseClient()
    payload = {
        "question": "Hello Flowise!",
        "overrideConfig": {
            "sessionId": "test-session"
        }
    }
    
    try:
        response = await client.trigger_agent("3319dcab-a02a-48f5-b7c8-67305a2cd8a6", payload)
        print("SUCCESS")
        print(response)
    except Exception as e:
        print("FAILED")
        print(e)

if __name__ == "__main__":
    asyncio.run(test())
