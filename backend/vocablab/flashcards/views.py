from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

from flashcards.models import Flashcard
from flashcards.serializers import FlashcardSerializer
from rest_framework import filters


class FlashcardViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    serializer_class = FlashcardSerializer
    queryset = Flashcard.objects.all()
    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'
    ordering = ["-created"]
