from typing import List

from flashcards.models import Flashcard
from random import choice, sample


class InsufficientFlashcardsError(Exception):
    """Raised when there are not enough flashcards to fulfill a request."""
    pass


def get_flashcards_for_learning_session(size=4) -> List[Flashcard]:
    pks = list(Flashcard.objects.values_list('pk', flat=True))
    if len(pks) < size:
        raise InsufficientFlashcardsError(f"Only {len(pks)} flashcards available, but {size} were requested.")
    random_pk = sample(pks, 4)
    flashcards = Flashcard.objects.filter(pk__in=random_pk)
    return flashcards