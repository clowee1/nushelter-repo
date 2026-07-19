from unittest.mock import patch
from werkzeug.security import generate_password_hash
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

def test_register_missing_name(client):
    response = client.post("/register", json={
        "email": "max.tan@u.nus.edu",
        "password": "iammaxtan123"
    })        

    assert response.status_code == 400

def test_register_missing_email(client):
    response = client.post("/register", json={
        "name": "Max Tan",
        "password": "iammaxtan123"
    })

    assert response.status_code == 400

def test_register_missing_password(client):
    response = client.post("/register", json={
        "name": "Max Tan",
        "email": "max.tan@u.nus.edu"
    })

    assert response.status_code == 400

def test_register_non_nus_email(client):
    response = client.post("/register", json={
        "name": "Max Tan",
        "email": "max.tan@gmail.com",
        "password": "iammaxtan123"
    })

    assert response.status_code == 400
    assert "NUS students" in response.get_json()["message"]

def test_register_duplicate_email(client):
    with patch("app.supabase") as mock_supabase:
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
            {"user_id": 1, "email": "max.tan@u.nus.edu"}
        ]

        response = client.post("/register", json={
            "name": "Max Tan",
            "email": "max.tan@u.nus.edu",
            "password": "iammaxtan123"
        })

        assert response.status_code == 400
        assert "already exists" in response.get_json()["message"]

def test_register_password_too_short(client):
    response = client.post("/register", json={
        "name": "Max Tan",
        "email": "max.tan@u.nus.edu",
        "password": "iammax1"
    })

    assert response.status_code == 400

def test_register_password_exactly_min_length(client):
    with patch("app.supabase") as mock_supabase:
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
        mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [
            {"user_id": 4, "name": "Max Tan", "email": "max.tan@u.nus.edu"}
        ]

        response = client.post("/register", json={
            "name": "Max Tan",
            "email": "max.tan@u.nus.edu",
            "password": "iammax12" 
        })

        assert response.status_code == 200
        assert response.get_json()["message"] == "User registered successfully"


def test_login_successful(client):
    with patch("app.supabase") as mock_supabase:
            hashed_password = generate_password_hash("iammax123")

            mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
                {
                    "user_id": 1,
                    "name": "Max Tan",
                    "email": "max.tan@u.nus.edu",
                    "password_hashed": hashed_password
                }
            ]
    
            response = client.post("/login", json={
                "email": "max.tan@u.nus.edu",
                "password": "iammax123"
            })

            assert response.status_code == 200
            assert response.get_json()["message"] == "Login successful"
            assert "token" in response.get_json()

def test_login_user_not_found(client):
    with patch("app.supabase") as mock_supabase:
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

        response = client.post("/login", json={
            "email": "ghost@u.nus.edu",
            "password": "whatever123"
        })

        assert response.status_code == 404
        assert response.get_json()["message"] == "User not found"
        
def test_login_wrong_password(client):
    with patch("app.supabase") as mock_supabase:
        hashed_password = generate_password_hash("correctpassword")

        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
            {
                "user_id": 1,
                "name": "Max Tan",
                "email": "max.tan@u.nus.edu",
                "password_hashed": hashed_password
            }
        ]

        response = client.post("/login", json={
            "email": "max.tan@u.nus.edu",
            "password": "wrongpassword"
        })

        assert response.status_code == 401
        assert response.get_json()["message"] == "Incorrect password"
