export type ExamTrack = 'GATE Mining' | 'DGMS First Class' | 'All PSU' | 'Overman/Mate' | 'All Tracks';

export type QuestionType = 'MCQ' | 'MSQ' | 'NAT';

export type QuestionStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  section: string;
  type: QuestionType;
  marks: number;
  negativeMarks: number;
  questionText: string;
  formulaOrNote?: string;
  diagramSvg?: string;
  options?: QuestionOption[]; // for MCQ and MSQ
  correctAnswer: string | string[] | number; // option id for MCQ, array of option ids for MSQ, number for NAT
  natRange?: [number, number]; // for NAT tolerance [min, max]
  explanation: string;
  statutoryReference?: string;
  subject: 'Ventilation' | 'Rock Mechanics' | 'Surface Mining' | 'Underground Mining' | 'Statutory & CMR' | 'Mine Surveying' | 'General Aptitude';
}

export interface MockTest {
  id: string;
  title: string;
  subtitle: string;
  track: ExamTrack;
  durationMins: number;
  questionCount: number;
  difficulty: 'Beginner' | 'Medium' | 'Advanced' | 'Hard';
  sections: string[];
  description: string;
  totalMarks: number;
  questions: Question[];
  featured?: boolean;
}

export interface UserAnswerState {
  questionId: string;
  selectedOption?: string; // for MCQ
  selectedOptions?: string[]; // for MSQ
  numericValue?: string; // for NAT
  status: QuestionStatus;
  timeSpentSeconds: number;
}

export interface TestAttemptResult {
  testId: string;
  testTitle: string;
  track: ExamTrack;
  date: string;
  totalScore: number;
  maxScore: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  percentile: number;
  simulatedAIR: number;
  timeTakenSeconds: number;
  answers: Record<string, UserAnswerState>;
  subjectPerformance: Record<string, { total: number; correct: number; score: number; maxScore: number }>;
}

export interface StatutoryRule {
  id: string;
  regulationNo: string;
  actOrRegulation: 'CMR 2017' | 'MMR 1961' | 'Mines Act 1952' | 'DGMS Circular';
  title: string;
  summary: string;
  keyLimit: string;
  category: 'Ventilation' | 'Blasting & Explosives' | 'Haulage & Winding' | 'Safety & Dust' | 'Management & Staff';
}
