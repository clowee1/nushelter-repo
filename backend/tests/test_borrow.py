import pytest
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

def test_borrow_successful(client):

    with patch("app.supabase") as mock_supabase:

        no_overdue = MagicMock()
        no_overdue.data = []


        umbrella_result = MagicMock()

        umbrella_result.data = [
            {
                "umbrella_id": 1,
                "status": "Available",
                "location_id": 2
            }
        ]


    def table_side_effect(table):

        mock_table = MagicMock()

        if table == "borrow_logs":

            mock_table.select.return_value \
                .eq.return_value \
                .eq.return_value \
                .execute.return_value = no_overdue

            mock_table.insert.return_value \
                .execute.return_value.data = [
                    {
                        "borrow_id": 1,
                        "umbrella_id": 1,
                        "borrower_id": 123,
                        "status": "Active"
                    }
                ]

        elif table == "umbrellas":

            mock_table.select.return_value \
                .eq.return_value \
                .execute.return_value = umbrella_result

            mock_table.update.return_value \
                .eq.return_value \
                .execute.return_value.data = []

        elif table == "stations":

            station_result = MagicMock()
            station_result.data = [
                {
                    "current_count": 5
                }
            ]

            mock_table.select.return_value \
                .eq.return_value \
                .execute.return_value = station_result

            mock_table.update.return_value \
                .eq.return_value \
                .execute.return_value.data = []

        return mock_table


        mock_supabase.table.side_effect = table_side_effect


        response = client.post(
            "/borrow",
            json={
                "umbrella_id": 1
            },
            headers=auth_header(client)
        )

        assert response.status_code == 200

    
def test_borrow_invalid_umbrella(client):

    with patch("app.supabase") as mock_supabase:

        umbrella_result = MagicMock()

        umbrella_result.data = []

        mock_supabase.table.return_value \
            .select.return_value \
            .eq.return_value \
            .execute.return_value = umbrella_result

        response = client.post(
            "/borrow",
            json={
                "umbrella_id":999
            },
            headers=auth_header(client)
        )

        assert response.status_code == 404

        assert response.get_json()["message"] == "Umbrella not found"
        

def test_borrow_suspended_account(client):

    with patch("app.supabase") as mock_supabase:

        overdue_log = MagicMock()

        overdue_log.data = [
            {
                "borrow_id":1,
                "due_at":"2020-01-01T00:00:00Z",
                "status":"Active"
            }
        ]

        mock_supabase.table.return_value \
            .select.return_value \
            .eq.return_value \
            .eq.return_value \
            .execute.return_value = overdue_log

        response = client.post(
            "/borrow",
            json={
                "umbrella_id":1
            },
            headers=auth_header(client)
        )

        assert response.status_code == 403

        assert response.get_json()["message"] == (
            "Account suspended due to overdue umbrella."
        )

def test_borrow_already_borrowed(client):

    with patch("app.supabase") as mock_supabase:

        no_overdue = MagicMock()
        no_overdue.data = []

        umbrella_result = MagicMock()
        umbrella_result.data = [
            {
                "umbrella_id": 1,
                "status": "Borrowed",
                "location_id": None
            }
        ]

        def table_side_effect(table):

            mock_table = MagicMock()

            if table == "borrow_logs":

                mock_table.select.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .execute.return_value = no_overdue

            elif table == "umbrellas":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = umbrella_result

            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/borrow",
            json={
                "umbrella_id": 1
            },
            headers=auth_header(client)
        )

        assert response.status_code == 400
        assert response.get_json()["message"] == "Umbrella already borrowed"