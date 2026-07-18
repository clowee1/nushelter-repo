from unittest.mock import patch

def test_home_route_works(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.get_json()["message"] == "NUShelter backend running"


def test_register_success(client):
    with patch("app.supabase") as mock_supabase:
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
        mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [
            {"user_id": 1, "name": "Max Tan", "email": "max.tan@u.nus.edu"}
        ]

        response = client.post("/register", json={
            "name": "Max Tan",
            "email": "max.tan@u.nus.edu",
            "password": "iammaxtan123"
        })

        assert response.status_code == 200
        assert response.get_json()["message"] == "User registered successfully"