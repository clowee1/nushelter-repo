import pytest
from unittest.mock import patch, MagicMock

from app import app
from flask_jwt_extended import create_access_token

from unittest.mock import patch, MagicMock
from recommendation import (distance_between, get_weather_risk, get_weather_risk_cached,_weather_cache)
import requests


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


def test_umbrella_stats_success(client):

    with patch("app.supabase") as mock_supabase:

        umbrella_result = MagicMock()
        umbrella_result.data = [
            {
                "umbrella_id": 1,
                "umbrella_code": "NUS-001",
                "nickname": "Blue Umbrella",
                "colour": "blue",
                "status": "Available",
                "created_at": "2026-01-01T00:00:00Z",
                "location_id": 2,
                "owner_id": 123
            }
        ]

        borrow_logs_result = MagicMock()
        borrow_logs_result.data = [
            {
                "borrow_id": 1,
                "umbrella_id": 1,
                "borrowed_location": 2,
                "returned_location": 3,
                "status": "Returned"
            },
            {
                "borrow_id": 2,
                "umbrella_id": 1,
                "borrowed_location": 3,
                "returned_location": 4,
                "status": "Returned"
            }
        ]

        notes_result = MagicMock()
        notes_result.data = [
            {
                "note_id": 1,
                "message": "Thank you!",
                "created_at": "2026-07-21T10:00:00Z"
            }
        ]

        journey_result = MagicMock()
        journey_result.data = [
            {
                "created_at": "2026-07-21T10:00:00Z",
                "location_id": 2,
                "action": "Dropped Off"
            },
            {
                "created_at": "2026-07-22T10:00:00Z",
                "location_id": 3,
                "action": "Returned"
            }
        ]


        def table_side_effect(table):

            mock_table = MagicMock()


            if table == "umbrellas":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = umbrella_result


            elif table == "borrow_logs":

                mock_table.select.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .execute.return_value = borrow_logs_result


            elif table == "thank_you_notes":

                mock_table.select.return_value \
                    .eq.return_value \
                    .order.return_value \
                    .execute.return_value = notes_result


            elif table == "umbrella_journey":

                mock_table.select.return_value \
                    .eq.return_value \
                    .order.return_value \
                    .execute.return_value = journey_result


            return mock_table


        mock_supabase.table.side_effect = table_side_effect


        response = client.get(
            "/umbrella-stats?umbrella_id=1",
            headers=auth_header(client)
        )


        assert response.status_code == 200


        data = response.get_json()

        assert data["umbrella"]["umbrella_id"] == 1
        assert data["umbrella"]["nickname"] == "Blue Umbrella"


        assert data["stats"]["students_helped"] == 2
        assert data["stats"]["locations_visited"] == 3


        assert len(data["notes"]) == 1
        assert data["notes"][0]["message"] == "Thank you!"


        assert len(data["journey"]) == 2
        assert data["journey"][0]["action"] == "Dropped Off"

def test_get_weather_risk_success():

    fake_response = MagicMock()

    fake_response.json.return_value = {
        "hourly": {
            "time": [
                "2026-07-24T10:00",
                "2026-07-24T11:00",
                "2026-07-24T12:00"
            ],
            "precipitation_probability": [
                30,
                60,
                90
            ]
        }
    }

    fake_response.raise_for_status.return_value = None

    with patch("recommendation.requests.get", return_value=fake_response):
        with patch("recommendation.datetime") as mock_datetime:

            mock_datetime.now.return_value.strftime.return_value = "2026-07-24T10:00"

            risk = get_weather_risk(1.29, 103.77)

            assert risk == 0.6



def test_get_weather_api_failure():

    with patch(
        "recommendation.requests.get",
        side_effect=requests.RequestException
    ):

        risk = get_weather_risk(1.29, 103.77)

        assert risk == 0.0


def test_weather_cache():

    _weather_cache.clear()

    with patch(
        "recommendation.get_weather_risk",
        return_value=0.75
    ) as mock_weather:

        risk1 = get_weather_risk_cached(1.29, 103.77)
        risk2 = get_weather_risk_cached(1.29, 103.77)

        assert risk1 == 0.75
        assert risk2 == 0.75

        mock_weather.assert_called_once()

def test_distance_same_location():

    distance = distance_between(
        1.30,
        103.80,
        1.30,
        103.80
    )

    assert distance == 0