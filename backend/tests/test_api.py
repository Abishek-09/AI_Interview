def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_interview_not_found(client):
    # Testing with non-existent candidate/job to ensure 404 is thrown
    response = client.post("/api/v1/interviews/", json={
        "candidate_id": 999,
        "job_id": 999
    })
    assert response.status_code == 404
    assert response.json()["detail"] == "Candidate or Job not found"
