import pytest
from flask_jwt_extended import create_access_token
from app import app as flask_app

@pytest.fixture
def client():
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as client:
        yield client

@pytest.fixture
def auth_headers():
    with flask_app.app_context():
        token = create_access_token(identity="1")
        return {"Authorization": f"Bearer {token}"}