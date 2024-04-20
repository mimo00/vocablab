from django.urls import path, include
from rest_framework.routers import DefaultRouter

from flashcards import views

app_name = 'flashcards'
router = DefaultRouter()
router.register(r'flashcards', views.FlashcardViewSet, basename='flashcard')
router.register(r'learning-sessions', views.LearningSessionViewSet)
router.register(r'learning-sessions-completed-event', views.LearningSessionCompletedEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
