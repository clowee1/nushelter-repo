
import pytest;
from unittest.mock import patch, MagicMock

from app import app
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app.config["TESTING"] = True

    with app.test_client() as client:
        with app.app_context():
            token = create_access_token(
                identity="123"
            )

        client.token = token
        yield client

def auth_header(client):
    return {
        "Authorization": f"Bearer {client.token}"
    }

def test_donate_successful(client):

    with patch("app.supabase") as mock_supabase:

        mock_supabase.table.return_value \
            .select.return_value \
            .eq.return_value \
            .execute.return_value.data = [
                {
                    "current_count": 5,
                    "capacity": 10
                }
            ]

        mock_supabase.table.return_value \
            .insert.return_value \
            .execute.return_value.data = [
                {
                    "umbrella_id": 1,
                    "owner_id": 123,
                    "colour": "blue",
                    "nickname": "Blue Umbrella",
                    "condition": "Good",
                    "location_id": 2
                }
            ]

        response = client.post(
            "/donate",
            json={
                "colour": "blue",
                "nickname": "Blue Umbrella",
                "condition": "Good",
                "location_id": 2
            },

            headers=auth_header(client)
        )

        assert response.status_code == 200

        data = response.get_json()

        assert data["message"] == "Umbrella registered successfully"

        assert data["umbrella"]["umbrella_id"] == 1

        assert data["umbrella"]["umbrella_code"] == "NUS-001"

def test_donate_station_full(client):

    with patch("app.supabase") as mock_supabase:


        station_response = MagicMock()

        station_response.data = [
            {
                "current_count": 10,
                "capacity": 10
            }
        ]

        mock_supabase.table.return_value \
            .select.return_value \
            .eq.return_value \
            .execute.return_value = station_response

        response = client.post(
            "/donate",
            json={
                "colour": "blue",
                "nickname": "Blue Umbrella",
                "condition": "Good",
                "location_id": 2
            },
            headers=auth_header(client)
        )

        assert response.status_code == 400


        assert response.get_json()["error"] == "Station is full"
    
def test_donate_without_token(client):

    response = client.post(
        "/donate",
        json={
            "colour": "blue",
            "nickname": "Blue Umbrella",
            "condition": "Good",
            "location_id": 2
        }
    )

    assert response.status_code == 401

