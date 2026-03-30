export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'word_problems';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizState {
  grade: Grade | null;
  operation: Operation | null;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
}
