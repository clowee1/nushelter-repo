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

def test_return_successful(client):

    with patch("app.supabase") as mock_supabase:

        active_log = MagicMock()
        active_log.data = [
            {
                "borrow_id": 1,
                "borrower_id": 123,
                "status": "Active"
            }
        ]

        umbrella = MagicMock()
        umbrella.data = [
            {
                "umbrella_id": 1,
                "status": "Borrowed",
                "borrowed_by": 123
            }
        ]

        station = MagicMock()
        station.data = [
            {
                "current_count": 5,
                "capacity": 10
            }
        ]

        def table_side_effect(table):

            mock_table = MagicMock()

            if table == "borrow_logs":

                mock_table.select.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .execute.return_value = active_log

                mock_table.update.return_value \
                    .eq.return_value \
                    .execute.return_value.data = []

            elif table == "umbrellas":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = umbrella

                mock_table.update.return_value \
                    .eq.return_value \
                    .execute.return_value.data = []

            elif table == "stations":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = station

                mock_table.update.return_value \
                    .eq.return_value \
                    .execute.return_value.data = []

            elif table == "users":

                mock_table.update.return_value \
                    .eq.return_value \
                    .execute.return_value.data = []

            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/return",
            json={
                "umbrella_id": 1,
                "location_id": 2
            },
            headers=auth_header(client)
        )

        assert response.status_code == 200
        assert response.get_json()["message"] == "Umbrella returned successfully"


def test_return_no_active_log(client):

    with patch("app.supabase") as mock_supabase:

        active_log = MagicMock()
        active_log.data = []

        mock_supabase.table.return_value \
            .select.return_value \
            .eq.return_value \
            .eq.return_value \
            .eq.return_value \
            .execute.return_value = active_log

        response = client.post(
            "/return",
            json={
                "umbrella_id": 1,
                "location_id": 2
            },
            headers=auth_header(client)
        )

        assert response.status_code == 404
        assert response.get_json()["message"] == "Active borrow log not found"


def test_return_umbrella_not_found(client):

    with patch("app.supabase") as mock_supabase:

        active_log = MagicMock()
        active_log.data = [
            {
                "borrow_id": 1,
                "borrower_id": 123,
                "status": "Active"
            }
        ]

        umbrella = MagicMock()
        umbrella.data = []

        def table_side_effect(table):

            mock_table = MagicMock()

            if table == "borrow_logs":

                mock_table.select.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .execute.return_value = active_log

            elif table == "umbrellas":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = umbrella

            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/return",
            json={
                "umbrella_id": 1,
                "location_id": 2
            },
            headers=auth_header(client)
        )

        assert response.status_code == 404
        assert response.get_json()["message"] == "Umbrella not found"

def test_return_already_available(client):

    with patch("app.supabase") as mock_supabase:

        active_log = MagicMock()
        active_log.data = [
            {
                "borrow_id": 1,
                "borrower_id": 123,
                "status": "Active"
            }
        ]

        umbrella = MagicMock()
        umbrella.data = [
            {
                "umbrella_id": 1,
                "status": "Available",
                "borrowed_by": None
            }
        ]

        def table_side_effect(table):

            mock_table = MagicMock()

            if table == "borrow_logs":

                mock_table.select.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .execute.return_value = active_log

            elif table == "umbrellas":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = umbrella

            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/return",
            json={
                "umbrella_id": 1,
                "location_id": 2
            },
            headers=auth_header(client)
        )

        assert response.status_code == 400
        assert response.get_json()["message"] == "Umbrella already available, cannot be returned"

def test_return_wrong_borrower(client):

    with patch("app.supabase") as mock_supabase:

        active_log = MagicMock()
        active_log.data = [
            {
                "borrow_id": 1,
                "borrower_id": 123,
                "status": "Active"
            }
        ]

        umbrella = MagicMock()
        umbrella.data = [
            {
                "umbrella_id": 1,
                "status": "Borrowed",
                "borrowed_by": 999
            }
        ]

        def table_side_effect(table):

            mock_table = MagicMock()

            if table == "borrow_logs":

                mock_table.select.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .execute.return_value = active_log

            elif table == "umbrellas":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = umbrella

            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/return",
            json={
                "umbrella_id": 1,
                "location_id": 2
            },
            headers=auth_header(client)
        )

        assert response.status_code == 403
        assert response.get_json()["message"] == "You did not borrow this umbrella"

def test_return_station_full(client):

    with patch("app.supabase") as mock_supabase:

        active_log = MagicMock()
        active_log.data = [
            {
                "borrow_id": 1,
                "borrower_id": 123,
                "status": "Active"
            }
        ]

        umbrella = MagicMock()
        umbrella.data = [
            {
                "umbrella_id": 1,
                "status": "Borrowed",
                "borrowed_by": 123
            }
        ]

        station = MagicMock()
        station.data = [
            {
                "current_count": 10,
                "capacity": 10
            }
        ]

        def table_side_effect(table):

            mock_table = MagicMock()

            if table == "borrow_logs":

                mock_table.select.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .eq.return_value \
                    .execute.return_value = active_log

            elif table == "umbrellas":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = umbrella

            elif table == "stations":

                mock_table.select.return_value \
                    .eq.return_value \
                    .execute.return_value = station

            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/return",
            json={
                "umbrella_id": 1,
                "location_id": 2
            },
            headers=auth_header(client)
        )

        assert response.status_code == 400
        assert response.get_json()["error"] == "Station is full, please choose another"
    