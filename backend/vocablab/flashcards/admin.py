from django.contrib import admin

from flashcards.models import Flashcard, LearningSession, LearningSessionCompletedEvent


@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    pass


@admin.register(LearningSession)
class LearningSessionAdmin(admin.ModelAdmin):
    pass


@admin.register(LearningSessionCompletedEvent)
class LearningSessionCompletedEvenAdmin(admin.ModelAdmin):
    pass
