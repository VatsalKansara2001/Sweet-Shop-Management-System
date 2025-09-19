import pytest
from fastapi.testclient import TestClient

class TestAuthentication:
    def test_register_user_success(self, client: TestClient):
        user_data = {
            "email": "newuser@example.com",
            "password": "newpassword123",
            "full_name": "New User"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["full_name"] == user_data["full_name"]
        assert data["is_admin"] is False
        assert data["is_active"] is True
    
    def test_register_user_duplicate_email(self, client: TestClient, test_user):
        user_data = {
            "email": test_user.email,
            "password": "somepassword123",
            "full_name": "Duplicate User"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]
    
    def test_login_user_success(self, client: TestClient, test_user):
        login_data = {
            "username": test_user.email,
            "password": "testpassword123"
        }
        
        response = client.post("/api/auth/login", data=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
    
    def test_login_user_wrong_password(self, client: TestClient, test_user):
        login_data = {
            "username": test_user.email,
            "password": "wrongpassword"
        }
        
        response = client.post("/api/auth/login", data=login_data)
        
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]
    
    def test_create_admin_user(self, client: TestClient):
        admin_data = {
            "email": "newadmin@example.com",
            "password": "adminpassword123",
            "full_name": "New Admin"
        }
        
        response = client.post("/api/auth/create-admin", json=admin_data)
        
        assert response.status_code == 200
        assert "Admin user created successfully" in response.json()["message"]
        assert admin_data["email"] in response.json()["message"]