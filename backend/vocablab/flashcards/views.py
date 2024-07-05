from rest_framework import mixins, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from flashcards.models import Flashcard, LearningSession, LearningSessionCompletedEvent
from flashcards.serializers import FlashcardSerializer, LearningSessionSerializer, \
    LearningSessionCompletedEventSerializer
from rest_framework import filters

from flashcards.services import get_flashcards_for_learning_session, InsufficientFlashcardsError, get_statistics


class UserInContexMixin:
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user"] = self.request.user
        return context


class FlashcardViewSet(
    UserInContexMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet
):
    serializer_class = FlashcardSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'
    ordering = ["-created"]

    def get_queryset(self):
        return Flashcard.objects.filter(user=self.request.user)


class LearningSessionViewSet(
    UserInContexMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    GenericViewSet,
):
    serializer_class = LearningSessionSerializer
    queryset = LearningSession.objects.all()

    def perform_create(self, serializer):
        try:
            flashcards = get_flashcards_for_learning_session(user=self.request.user)
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


class StatsListView(APIView):
    def get(self, request, format=None):
        statistics = get_statistics(request.user)
        return Response(statistics, status=status.HTTP_200_OK)