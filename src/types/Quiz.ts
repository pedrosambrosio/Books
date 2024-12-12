export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  chapterId: string;
  score: number;
  level: 'mestre' | 'avancado' | 'intermediario' | 'iniciante' | 'explorador';
  totalQuestions: number;
}

export interface ChapterQuiz {
  chapterId: string;
  questions: QuizQuestion[];
}