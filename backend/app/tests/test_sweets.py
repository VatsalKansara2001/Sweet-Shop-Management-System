import pytest
from fastapi.testclient import TestClient

class TestSweetManagement:
    def test_create_sweet_admin_success(self, client: TestClient, auth_headers_admin):
        sweet_data = {
            "name": "Strawberry Cake",
            "category": "Cakes",
            "price": 15.99,
            "quantity": 8,
            "description": "Fresh strawberry cake with cream"
        }
        
        response = client.post(
            "/api/sweets/",
            json=sweet_data,
            headers=auth_headers_admin
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sweet_data["name"]
        assert data["category"] == sweet_data["category"]
        assert data["price"] == sweet_data["price"]
        assert data["quantity"] == sweet_data["quantity"]
        assert data["is_available"] is True
        assert data["id"] is not None
    
    def test_create_sweet_user_forbidden(self, client: TestClient, auth_headers_user):
        sweet_data = {
            "name": "Ice Cream",
            "category": "Frozen",
            "price": 5.99,
            "quantity": 20
        }
        
        response = client.post(
            "/api/sweets/",
            json=sweet_data,
            headers=auth_headers_user
        )
        
        assert response.status_code == 403
        assert "Not enough permissions" in response.json()["detail"]
    
    def test_get_sweets_success(self, client: TestClient, test_sweet):
        response = client.get("/api/sweets/")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        
        sweet_names = [sweet["name"] for sweet in data]
        assert test_sweet.name in sweet_names
    
    def test_search_sweets_by_name(self, client: TestClient, test_sweet):
        response = client.get(f"/api/sweets/search?name=chocolate")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        for sweet in data:
            assert "chocolate" in sweet["name"].lower()
    
    def test_update_sweet_admin_success(self, client: TestClient, test_sweet, auth_headers_admin):
        update_data = {
            "name": "Updated Chocolate Cake",
            "price": 14.99,
            "quantity": 15
        }
        
        response = client.put(
            f"/api/sweets/{test_sweet.id}",
            json=update_data,
            headers=auth_headers_admin
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["price"] == update_data["price"]
        assert data["quantity"] == update_data["quantity"]
        assert data["category"] == test_sweet.category
    
    def test_delete_sweet_admin_success(self, client: TestClient, test_sweet, auth_headers_admin):
        response = client.delete(
            f"/api/sweets/{test_sweet.id}",
            headers=auth_headers_admin
        )
        
        assert response.status_code == 204
        
        get_response = client.get(f"/api/sweets/{test_sweet.id}")
        assert get_response.status_code == 404