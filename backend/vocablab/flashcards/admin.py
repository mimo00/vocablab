from django.contrib import admin

from flashcards.models import Flashcard


@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    pass
