from rest_framework import serializers

from flashcards.models import Flashcard, LearningSession, LearningSessionCompletedEvent


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'front', 'back', 'created']
        read_only_fields = ('created', )


class LearningSessionSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, required=False)

    class Meta:
        model = LearningSession
        fields = ['id', 'flashcards', 'created']
        read_only_fields = ('flashcards', 'created', )


class LearningSessionCompletedEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningSessionCompletedEvent
        fields = ['learning_session', ]
