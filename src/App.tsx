/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_TESTS } from './data/mockTestsData';
import { ExamTrack, MockTest, TestAttemptResult } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { CBTExamScreen } from './components/CBTExamScreen';
import { ExamResultView } from './components/ExamResultView';
import { AnalyticsView } from './components/AnalyticsView';
import { StatutoryFlashcardsView } from './components/StatutoryFlashcardsView';
import { ProfileModal } from './components/ProfileModal';

const SEED_ATTEMPTS: TestAttemptResult[] = [
  {
    testId: 'ventilation-thermo-mock',
    testTitle: 'Ventilation & Thermodynamics (GATE Mining Only)',
    track: 'GATE Mining',
    date: '12 Aug 2026, 04:30 PM',
    totalScore: 24.5,
    maxScore: 30.0,
    totalQuestions: 8,
    attemptedQuestions: 8,
    correctCount: 7,
    incorrectCount: 1,
    unattemptedCount: 0,
    accuracy: 87.5,
    percentile: 97.4,
    simulatedAIR: 16,
    timeTakenSeconds: 2520,
    answers: {},
    subjectPerformance: {
      'Ventilation Dynamics & NATs': { total: 8, correct: 7, score: 24.5, maxScore: 30 }
    }
  },
  {
    testId: 'all-psu-mining-mock-1',
    testTitle: 'All PSU Mining Engineering Mock 1',
    track: 'All PSU',
    date: '08 Aug 2026, 11:15 AM',
    totalScore: 83.5,
    maxScore: 100.0,
    totalQuestions: 10,
    attemptedQuestions: 10,
    correctCount: 9,
    incorrectCount: 1,
    unattemptedCount: 0,
    accuracy: 90.0,
    percentile: 96.2,
    simulatedAIR: 28,
    timeTakenSeconds: 4980,
    answers: {},
    subjectPerformance: {
      'General Aptitude': { total: 2, correct: 2, score: 2, maxScore: 2 },
      'Core Mining Engineering': { total: 8, correct: 7, score: 81.5, maxScore: 98 }
    }
  },
  {
    testId: 'dgms-first-class-mock',
    testTitle: 'DGMS First Class Manager Law & Legislation',
    track: 'DGMS First Class',
    date: '31 Jul 2026, 02:45 PM',
    totalScore: 68.0,
    maxScore: 80.0,
    totalQuestions: 10,
    attemptedQuestions: 9,
    correctCount: 8,
    incorrectCount: 1,
    unattemptedCount: 1,
    accuracy: 88.9,
    percentile: 98.1,
    simulatedAIR: 12,
    timeTakenSeconds: 3840,
    answers: {},
    subjectPerformance: {
      'CMR 2017 & Mines Act 1952': { total: 10, correct: 8, score: 68, maxScore: 80 }
    }
  },
  {
    testId: 'rock-mechanics-strata-mock',
    testTitle: 'Rock Mechanics & Ground Control Master',
    track: 'GATE Mining',
    date: '22 Jul 2026, 09:20 AM',
    totalScore: 21.0,
    maxScore: 30.0,
    totalQuestions: 8,
    attemptedQuestions: 7,
    correctCount: 6,
    incorrectCount: 1,
    unattemptedCount: 1,
    accuracy: 85.7,
    percentile: 92.5,
    simulatedAIR: 44,
    timeTakenSeconds: 2700,
    answers: {},
    subjectPerformance: {
      'Rock Mechanics': { total: 8, correct: 6, score: 21, maxScore: 30 }
    }
  },
  {
    testId: 'overman-sirdar-mock',
    testTitle: 'Mining Sirdar & Overman Competency Mock',
    track: 'Overman/Mate',
    date: '15 Jul 2026, 06:10 PM',
    totalScore: 38.0,
    maxScore: 40.0,
    totalQuestions: 10,
    attemptedQuestions: 10,
    correctCount: 9,
    incorrectCount: 1,
    unattemptedCount: 0,
    accuracy: 90.0,
    percentile: 99.2,
    simulatedAIR: 6,
    timeTakenSeconds: 1920,
    answers: {},
    subjectPerformance: {
      'Statutory & Safety': { total: 10, correct: 9, score: 38, maxScore: 40 }
    }
  }
];

export default function App() {
  // Navigation tabs: 'home' | 'analytics' | 'statutory' | 'profile'
  const [currentTab, setCurrentTab] = useState<'home' | 'analytics' | 'statutory' | 'profile'>('home');
  
  // Selected Exam Track (GATE, DGMS, All PSU, Overman, All)
  const [selectedTrack, setSelectedTrack] = useState<ExamTrack>('All Tracks');

  // Active examination state
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  
  // Latest test result state
  const [currentResult, setCurrentResult] = useState<TestAttemptResult | null>(null);

  // Historical test attempts (stored locally & synced with Cloud SQL)
  const [attemptHistory, setAttemptHistory] = useState<TestAttemptResult[]>(() => {
    const saved = localStorage.getItem('mining_exam_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return SEED_ATTEMPTS;
  });

  // Profile modal toggle
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Device frame toggle (Desktop vs Mobile simulator frame)
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Save history to localStorage & fetch any Cloud SQL database records
  useEffect(() => {
    localStorage.setItem('mining_exam_history', JSON.stringify(attemptHistory));
  }, [attemptHistory]);

  useEffect(() => {
    async function syncFromCloudSQL() {
      try {
        const res = await fetch('/api/attempts');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Map Cloud SQL database rows to TestAttemptResult format
            const mapped: TestAttemptResult[] = data.map((d: any) => ({
              testId: d.testId || d.test_id,
              testTitle: d.testTitle || d.test_title,
              track: (d.track || 'GATE Mining') as ExamTrack,
              date: d.date,
              totalScore: d.totalScore ?? d.total_score,
              maxScore: d.maxScore ?? d.max_score,
              totalQuestions: d.totalQuestions ?? d.total_questions,
              attemptedQuestions: d.attemptedQuestions ?? d.attempted_questions,
              correctCount: d.correctCount ?? d.correct_count,
              incorrectCount: d.incorrectCount ?? d.incorrect_count,
              unattemptedCount: d.unattemptedCount ?? d.unattempted_count,
              accuracy: d.accuracy,
              percentile: d.percentile,
              simulatedAIR: d.simulatedAIR ?? d.simulated_air,
              timeTakenSeconds: d.timeTakenSeconds ?? d.time_taken_seconds,
              answers: d.answersJson || d.answers_json || {},
              subjectPerformance: d.subjectPerformanceJson || d.subject_performance_json || {},
            }));
            setAttemptHistory(mapped);
          }
        }
      } catch (err) {
        console.log('Database synchronization fallback to local cache:', err);
      }
    }
    syncFromCloudSQL();
  }, []);

  const handleStartExam = (testId: string) => {
    setActiveExamId(testId);
    setCurrentResult(null);
  };

  const handleFinishExam = async (result: TestAttemptResult) => {
    setAttemptHistory(prev => [result, ...prev]);
    setCurrentResult(result);
    setActiveExamId(null);

    // Persist attempt to Cloud SQL database
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: result.testId,
          testTitle: result.testTitle,
          track: result.track,
          date: result.date,
          totalScore: result.totalScore,
          maxScore: result.maxScore,
          totalQuestions: result.totalQuestions,
          attemptedQuestions: result.attemptedQuestions,
          correctCount: result.correctCount,
          incorrectCount: result.incorrectCount,
          unattemptedCount: result.unattemptedCount,
          accuracy: result.accuracy,
          percentile: result.percentile,
          simulatedAIR: result.simulatedAIR,
          timeTakenSeconds: result.timeTakenSeconds,
          answersJson: result.answers,
          subjectPerformanceJson: result.subjectPerformance,
        }),
      });
    } catch (e) {
      console.error('Error saving attempt to database:', e);
    }
  };

  const handleExitExam = () => {
    setActiveExamId(null);
  };

  const handleRetakeExam = () => {
    if (currentResult) {
      setActiveExamId(currentResult.testId);
      setCurrentResult(null);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentResult(null);
    setActiveExamId(null);
    setCurrentTab('home');
  };

  const handleViewPastResult = (result: TestAttemptResult) => {
    setCurrentResult(result);
    // Find matching test or fallback
    const matchedTest = MOCK_TESTS.find(t => t.id === result.testId);
    if (!matchedTest) {
      // If test not found, we can stay in analytics
      return;
    }
  };

  const handleResetHistory = () => {
    if (window.confirm('Reset all test attempt history?')) {
      setAttemptHistory(SEED_ATTEMPTS);
      localStorage.setItem('mining_exam_history', JSON.stringify(SEED_ATTEMPTS));
      setIsProfileOpen(false);
    }
  };

  // Find active mock test object
  const activeTest = MOCK_TESTS.find(t => t.id === activeExamId);
  const resultTest = currentResult ? MOCK_TESTS.find(t => t.id === currentResult.testId) : null;

  // If in active CBT exam mode, render the full-screen GATE exam simulator directly
  if (activeTest) {
    return (
      <div className="w-full min-h-screen bg-slate-900 text-slate-100">
        <CBTExamScreen
          test={activeTest}
          onFinishTest={handleFinishExam}
          onExit={handleExitExam}
        />
      </div>
    );
  }

  const renderTabContent = () => {
    // If viewing a completed exam result
    if (currentResult && resultTest) {
      return (
        <ExamResultView
          result={currentResult}
          test={resultTest}
          onRetake={handleRetakeExam}
          onBackToDashboard={handleBackToDashboard}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <Dashboard
            tests={MOCK_TESTS}
            selectedTrack={selectedTrack}
            onSelectTrack={setSelectedTrack}
            onStartExam={handleStartExam}
            onOpenFlashcards={() => setCurrentTab('statutory')}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            history={attemptHistory}
            onStartTest={handleStartExam}
            onViewResult={handleViewPastResult}
            allTests={MOCK_TESTS}
          />
        );
      case 'statutory':
        return <StatutoryFlashcardsView />;
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <ProfileModal
              onClose={() => setCurrentTab('home')}
              selectedTrack={selectedTrack}
              onSelectTrack={setSelectedTrack}
              onResetData={handleResetHistory}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center">
      {/* Wrapper container: if isMobileFrame is true, wrap in phone container */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[430px] my-4 rounded-[40px] shadow-2xl border-8 border-slate-800 overflow-hidden bg-slate-100 min-h-[880px]'
            : 'max-w-full'
        }`}
      >
        <Navbar
          currentTab={currentTab}
          onOpenProfile={() => setIsProfileOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        <main className="pb-24 flex-1">
          {renderTabContent()}
        </main>

        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentResult(null);
            setCurrentTab(tab);
          }}
        />

        {isProfileOpen && (
          <ProfileModal
            onClose={() => setIsProfileOpen(false)}
            selectedTrack={selectedTrack}
            onSelectTrack={setSelectedTrack}
            onResetData={handleResetHistory}
          />
        )}
      </div>
    </div>
  );
}
