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


@pytest.mark.django_db
class TestLearningSessionViewSet:
    LIST_VIEW_NAME = "flashcards:learningsession-list"

    def test_post(self, api_client):
        factories = FlashcardFactory.create_batch(4)
        data = {}

        url = reverse(self.LIST_VIEW_NAME)
        response = api_client.post(path=url, data=data)

        assert response.status_code == status.HTTP_201_CREATED, response.data
        result = response.json()
        assert type(result["id"]) == int
        assert len(result["flashcards"]) == 4

    def test_post_when_there_is_no_flashcards_created(self, api_client):
        data = {}

        url = reverse(self.LIST_VIEW_NAME)
        response = api_client.post(path=url, data=data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST, response.data
        result = response.json()
        assert result == ['Only 0 flashcards available, but 4 were requested.']
