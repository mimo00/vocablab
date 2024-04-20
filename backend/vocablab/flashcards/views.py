from rest_framework import mixins
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import GenericViewSet

from flashcards.models import Flashcard, LearningSession, LearningSessionCompletedEvent
from flashcards.serializers import FlashcardSerializer, LearningSessionSerializer, \
    LearningSessionCompletedEventSerializer
from rest_framework import filters

from flashcards.services import get_flashcards_for_learning_session, InsufficientFlashcardsError


class FlashcardViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet
):
    serializer_class = FlashcardSerializer
    queryset = Flashcard.objects.all()
    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'
    ordering = ["-created"]


class LearningSessionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    GenericViewSet,
):
    serializer_class = LearningSessionSerializer
    queryset = LearningSession.objects.all()

    def perform_create(self, serializer):
        try:
            flashcards = get_flashcards_for_learning_session()
        except InsufficientFlashcardsError as e:
            raise ValidationError(e)
        super().perform_create(serializer)
        serializer.instance.flashcards.set(flashcards)


class LearningSessionCompletedEventViewSet(
    mixins.CreateModelMixin,
    GenericViewSet,
):
    serializer_class = LearningSessionCompletedEventSerializer
    queryset = LearningSessionCompletedEvent.objects.all()

