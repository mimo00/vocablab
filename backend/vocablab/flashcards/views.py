from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

from flashcards.models import Flashcard
from flashcards.serializers import FlashcardSerializer


class FlashcardViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    serializer_class = FlashcardSerializer
    queryset = Flashcard.objects.all()
