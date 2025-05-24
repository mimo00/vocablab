from rest_framework import serializers

from flashcards.models import Flashcard, LearningSession, LearningSessionCompletedEvent


class UserInValidatedDataMixin:
    def create(self, validated_data):
        validated_data["user"] = self.context["user"]
        return super().create(validated_data)


class FlashcardSerializer(UserInValidatedDataMixin, serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'front', 'back', 'example', 'pronunciation', 'learnt', 'created']
        read_only_fields = ('created', )


class LearningSessionSerializer(UserInValidatedDataMixin, serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, required=False)

    class Meta:
        model = LearningSession
        fields = ['id', 'flashcards', 'created']
        read_only_fields = ('flashcards', 'created', )


class LearningSessionCompletedEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningSessionCompletedEvent
        fields = ['learning_session', ]
