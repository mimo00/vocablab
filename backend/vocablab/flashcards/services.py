import tempfile
from datetime import datetime, timedelta
from typing import List

import requests
import logging

from flashcards.models import Flashcard, LearningSessionCompletedEvent
from random import choice, sample
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


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


def download_pronunciation(flashcard: Flashcard):
    CAMBRIDGE_DICTIONARY_BASE_URL = "https://dictionary.cambridge.org"
    url = f"{CAMBRIDGE_DICTIONARY_BASE_URL}/dictionary/english/{flashcard.front}"
    logger.info("Downloading pronunciation for flashcard %s, %s", flashcard.pk, flashcard.front)
    logger.info("Downloading pronunciation from %s", url)
    headers = requests.utils.default_headers()
    DEFAULT_REQUESTS_HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'}
    headers.update(DEFAULT_REQUESTS_HEADERS)
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    pronunciation_section = soup.find('span', class_='uk dpron-i')
    logger.info(pronunciation_section)
    if pronunciation_section:
        source_element = pronunciation_section.find('source', type='audio/mpeg')
        url = source_element.get("src")
        logger.info(f"Pronunciation for '{source_element}': {url}")
    url = f"{CAMBRIDGE_DICTIONARY_BASE_URL}/{url}"
    response = requests.get(url, headers=headers)
    with tempfile.NamedTemporaryFile() as tmp:
        tmp.write(response.content)
        flashcard.pronunciation.save(f"{flashcard.front}.mp3", tmp)
