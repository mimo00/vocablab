from django.contrib import admin

from flashcards.models import Flashcard, LearningSession, LearningSessionCompletedEvent
from flashcards import services


@admin.action(description="Download pronunciation")
def get_pronunciation_action(modeladmin, request, queryset):
    for flashcard in queryset:
        services.download_pronunciation(flashcard)


@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ["front", "back", "created", "learnt"]
    actions = [get_pronunciation_action]


@admin.register(LearningSession)
class LearningSessionAdmin(admin.ModelAdmin):
    pass


@admin.register(LearningSessionCompletedEvent)
class LearningSessionCompletedEvenAdmin(admin.ModelAdmin):
    pass
