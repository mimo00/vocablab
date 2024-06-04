export interface Flashcard {
  id: string;
  front: string;
  back: string;
  created: string;
}

export interface LearningStatistics {
  flashcards_created_today: number;
  flashcards_created_last_seven_days: number;
  learning_sessions_completed_today: number;
  learning_sessions_completed_last_seven_days: number;
}