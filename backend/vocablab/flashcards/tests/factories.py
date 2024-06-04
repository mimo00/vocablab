import factory

from django.conf import settings
from flashcards.models import Flashcard, LearningSession


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = settings.AUTH_USER_MODEL
        django_get_or_create = ('username',)

    username = f"testusername"


class FlashcardFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Flashcard

    user = factory.SubFactory(UserFactory)
    front = factory.Faker("word")
    back = factory.Faker("word")


class LearningSessionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = LearningSession

    user = factory.SubFactory(UserFactory)