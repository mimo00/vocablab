from unittest import mock

import pytest
from django.urls import reverse
from rest_framework import status

from flashcards.tests.factories import FlashcardFactory, UserFactory, LearningSessionFactory


@pytest.mark.django_db
class TestFlashcardViewSet:
    DETAILS_VIEW_NAME = "flashcards:flashcard-detail"
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
        assert result["learnt"] == flashcard.learnt

    def test_list_return_only_users_flashcards(self, api_client, user, other_user):
        FlashcardFactory(user=user)
        FlashcardFactory(user=other_user)

        url = reverse(self.LIST_VIEW_NAME)
        response = api_client.get(path=url)

        assert response.status_code == status.HTTP_200_OK
        results = response.json()
        assert len(results) == 1

    def test_patch_learnt(self, api_client):
        flashcard = FlashcardFactory(learnt=False)

        url = reverse(self.DETAILS_VIEW_NAME, kwargs={"pk": flashcard.pk})
        response = api_client.patch(path=url, data={"learnt": True})

        assert response.status_code == status.HTTP_200_OK
        result = response.json()
        assert result["learnt"] is True


@pytest.mark.django_db
class TestLearningSessionViewSet:
    LIST_VIEW_NAME = "flashcards:learningsession-list"

    def test_post(self, api_client):
        FlashcardFactory.create_batch(4)
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


@pytest.mark.django_db
class TestLearningSessionCompletedEventViewSet:
    LIST_VIEW_NAME = "flashcards:learningsessioncompletedevent-list"

    def test_post(self, api_client):
        learning_session = LearningSessionFactory()

        data = {"learning_session": learning_session.pk}

        url = reverse(self.LIST_VIEW_NAME)
        response = api_client.post(path=url, data=data)

        assert response.status_code == status.HTTP_201_CREATED, response.data
