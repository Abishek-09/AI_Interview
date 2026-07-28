import httpx
from typing import Dict, Any
from app.core.config import settings

class FlowiseClient:
    def __init__(self):
        self.base_url = settings.FLOWISE_URL
        self.api_key = settings.FLOWISE_API_KEY

    async def trigger_agent(self, chatflow_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Triggers a Flowise workflow/agent via API.
        """
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
            
        url = f"{self.base_url}/api/v1/prediction/{chatflow_id}"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
