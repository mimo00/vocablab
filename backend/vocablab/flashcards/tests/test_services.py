import pytest

from flashcards.services import get_flashcards_for_learning_session, InsufficientFlashcardsError
from flashcards.tests.factories import FlashcardFactory, UserFactory


@pytest.mark.django_db
class TestGetFlashcardsForLearningSession:
    def test_success(self):
        user = UserFactory()
        flashcards = FlashcardFactory.create_batch(4, user=user, learnt=False)

        result = get_flashcards_for_learning_session(user)

        assert set(result) == set(flashcards)

    def test_cross_user(self):
        user_0 = UserFactory(username="0")
        user_1 = UserFactory(username="1")
        FlashcardFactory.create_batch(4, user=user_0)
        FlashcardFactory.create_batch(4, user=user_1)

        result = get_flashcards_for_learning_session(user_0)
        assert len(set([flashcard.user for flashcard in result])) == 1

        result = get_flashcards_for_learning_session(user_1)
        assert len(set([flashcard.user for flashcard in result])) == 1

    def test_insufficient_flashcards(self):
        user = UserFactory()
        FlashcardFactory(user=user)

        with pytest.raises(InsufficientFlashcardsError):
            get_flashcards_for_learning_session(user)

    def test_learnt_flashcard(self):
        user = UserFactory()
        FlashcardFactory.create_batch(4, user=user, learnt=True)

        with pytest.raises(InsufficientFlashcardsError):
            get_flashcards_for_learning_session(user)