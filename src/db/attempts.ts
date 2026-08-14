import { db } from './index.ts';
import { examAttempts, users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface CreateAttemptInput {
  userId?: number;
  userUid?: string;
  testId: string;
  testTitle: string;
  track: string;
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
  answersJson?: any;
  subjectPerformanceJson?: any;
}

export async function createExamAttempt(input: CreateAttemptInput) {
  try {
    const result = await db.insert(examAttempts)
      .values({
        userId: input.userId,
        userUid: input.userUid,
        testId: input.testId,
        testTitle: input.testTitle,
        track: input.track,
        date: input.date,
        totalScore: input.totalScore,
        maxScore: input.maxScore,
        totalQuestions: input.totalQuestions,
        attemptedQuestions: input.attemptedQuestions,
        correctCount: input.correctCount,
        incorrectCount: input.incorrectCount,
        unattemptedCount: input.unattemptedCount,
        accuracy: input.accuracy,
        percentile: input.percentile,
        simulatedAIR: input.simulatedAIR,
        timeTakenSeconds: input.timeTakenSeconds,
        answersJson: input.answersJson || null,
        subjectPerformanceJson: input.subjectPerformanceJson || null,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database createExamAttempt failed:', error);
    throw new Error('Failed to record exam attempt.', { cause: error });
  }
}

export async function getExamAttempts(userUid?: string, track?: string) {
  try {
    let query = db.select().from(examAttempts).orderBy(desc(examAttempts.createdAt));
    const results = await query;
    
    if (track && track !== 'All Tracks') {
      return results.filter(r => r.track === track);
    }
    return results;
  } catch (error) {
    console.error('Database getExamAttempts failed:', error);
    throw new Error('Failed to retrieve exam attempts.', { cause: error });
  }
}

export async function deleteExamAttempt(id: number) {
  try {
    await db.delete(examAttempts).where(eq(examAttempts.id, id));
    return { success: true };
  } catch (error) {
    console.error('Database deleteExamAttempt failed:', error);
    throw new Error('Failed to delete exam attempt.', { cause: error });
  }
}
