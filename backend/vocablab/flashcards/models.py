from django.db import models


class Flashcard(models.Model):
    front = models.CharField(max_length=1000)
    back = models.CharField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)


class LearningSession(models.Model):
    flashcards = models.ManyToManyField(Flashcard)
    created = models.DateTimeField(auto_now_add=True)


class LearningSessionCompletedEvent(models.Model):
    learning_session = models.ForeignKey(LearningSession, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
