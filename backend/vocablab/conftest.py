import pytest
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def user():
    return User.objects.create_user("testusername", "test@test.com", "test")


@pytest.fixture
def other_user():
    return User.objects.create_user("othertestusername", "othertest@test.com", "test")


@pytest.fixture
def api_client(user):
    client = APIClient()
    token, created = Token.objects.get_or_create(user=user)
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    return client
