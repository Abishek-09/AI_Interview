import urllib.request
import json

def test_flowise():
    url = "http://localhost:3001/api/v1/prediction/3319dcab-a02a-48f5-b7c8-67305a2cd8a6"
    headers = {
        "Authorization": "Bearer kxFcpNCM2hjUHIXLbu944OxAnzyAziCMCsUTsj-CYFs",
        "Content-Type": "application/json"
    }
    payload = json.dumps({"question": "Hello"}).encode("utf-8")
    
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            print("Status:", response.status)
            print("Response:", response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code)
        print("Error Response:", e.read().decode("utf-8"))
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_flowise()
