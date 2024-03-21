import factory

from flashcards.models import Flashcard


class FlashcardFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Flashcard

    front = factory.Faker("word")
    back = factory.Faker("word")
