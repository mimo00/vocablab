from django.contrib import admin

from flashcards.models import Flashcard, LearningSession, LearningSessionCompletedEvent


@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ["front", "back", "created"]


@admin.register(LearningSession)
class LearningSessionAdmin(admin.ModelAdmin):
    pass


@admin.register(LearningSessionCompletedEvent)
class LearningSessionCompletedEvenAdmin(admin.ModelAdmin):
    pass
