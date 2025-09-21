export interface Question {
  id: string;
  question: string;
  options: Option[];
}

export interface Essay {
  id: string;
  title: string;
  content?: string; // Optional for backward compatibility
  contentFile?: string; // Path to external text file
  wordCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in minutes
  createdAt: string;
  questions: Question[];
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface UserAttempt {
  essayId: string;
  answers: { [questionId: string]: string };
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
}

export interface UserProgress {
  totalAttempts: number;
  totalScore: number;
  averageScore: number;
  attempts: UserAttempt[];
}