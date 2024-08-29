from datetime import datetime, timedelta
from typing import List

from flashcards.models import Flashcard, LearningSessionCompletedEvent
from random import choice, sample


class InsufficientFlashcardsError(Exception):
    """Raised when there are not enough flashcards to fulfill a request."""
    pass


def get_flashcards_for_learning_session(user, size=4) -> List[Flashcard]:
    queryset = Flashcard.objects.filter(user=user).exclude(learnt=True)
    pks = list(queryset.values_list('pk', flat=True))
    if len(pks) < size:
        raise InsufficientFlashcardsError(f"Only {len(pks)} flashcards available, but {size} were requested.")
    random_pk = sample(pks, 4)
    flashcards = queryset.filter(pk__in=random_pk)
    return flashcards


def get_statistics(user) -> dict:
    flashcard_queryset = Flashcard.objects.filter(user=user)
    learning_session_completed_queryset = LearningSessionCompletedEvent.objects.filter(learning_session__user=user)
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    flashcards_created = flashcard_queryset.count()
    flashcards_created_today = flashcard_queryset.filter(created__date=today).count()
    flashcards_created_last_seven_days = flashcard_queryset.filter(created__date__gte=week_ago).count()
    learning_sessions_completed_today = learning_session_completed_queryset.filter(created__date=today).count()
    learning_sessions_completed_last_seven_days = learning_session_completed_queryset.filter(created__date__gte=week_ago).count()
    return {
        "flashcards_created": flashcards_created,
        "flashcards_created_today": flashcards_created_today,
        "flashcards_created_last_seven_days": flashcards_created_last_seven_days,
        "learning_sessions_completed_today": learning_sessions_completed_today,
        "learning_sessions_completed_last_seven_days": learning_sessions_completed_last_seven_days,
    }
