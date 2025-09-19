import pytest
from fastapi.testclient import TestClient

def test_root_endpoint(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to Sweet Shop Management System API" in data["message"]
    assert "version" in data
    assert "docs" in data

def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Sweet Shop API is running!" in data["message"]
    assert data["version"] == "1.0.0"