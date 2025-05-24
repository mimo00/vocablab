from django.db import models
from django.conf import settings


class UserMixin(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    class Meta:
        abstract = True


class Flashcard(UserMixin, models.Model):
    front = models.CharField(max_length=1000)
    back = models.CharField(max_length=1000)
    example = models.CharField(max_length=1000, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    learnt = models.BooleanField(default=False)
    pronunciation = models.FileField(upload_to="pronunciations/", blank=True, null=True)


class LearningSession(UserMixin, models.Model):
    flashcards = models.ManyToManyField(Flashcard)
    created = models.DateTimeField(auto_now_add=True)


class LearningSessionCompletedEvent(models.Model):
    learning_session = models.ForeignKey(LearningSession, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
