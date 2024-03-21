from unittest import mock

import pytest
from django.urls import reverse
from rest_framework import status

from flashcards.tests.factories import FlashcardFactory


@pytest.mark.django_db
class TestFlashcardViewSet:
    LIST_VIEW_NAME = "flashcards:flashcard-list"

    def test_post(self, api_client):
        data = {
            "front": "a",
            "back": "b"
        }

        url = reverse(self.LIST_VIEW_NAME)
        response = api_client.post(path=url, data=data)

        assert response.status_code == status.HTTP_201_CREATED

    def test_list(self, api_client):
        flashcard = FlashcardFactory()

        url = reverse(self.LIST_VIEW_NAME)
        response = api_client.get(path=url)

        assert response.status_code == status.HTTP_200_OK
        results = response.json()
        result = results[0]
        assert result["id"] == flashcard.id
        assert result["front"] == flashcard.front
        assert result["back"] == flashcard.back
        assert result["created"] == mock.ANY  # TODO set dt format
