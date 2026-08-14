import React, { useState, useEffect } from 'react';
import { MockTest, Question, QuestionStatus, UserAnswerState, TestAttemptResult } from '../types';
import { ScientificCalculator } from './ScientificCalculator';
import { 
  Timer, Calculator, FileText, CheckCircle2, AlertCircle, 
  ChevronLeft, ChevronRight, HelpCircle, Eye, CornerDownRight, X
} from 'lucide-react';

interface CBTExamScreenProps {
  test: MockTest;
  onFinishTest: (result: TestAttemptResult) => void;
  onExit: () => void;
}

export const CBTExamScreen: React.FC<CBTExamScreenProps> = ({ test, onFinishTest, onExit }) => {
  // Candidate info
  const candidateName = 'Amit Kumar';
  const candidateRoll = 'MN-GATE-2026-9481';

  // Questions and sections
  const questions = test.questions;
  const sections = Array.from(new Set(questions.map(q => q.section)));
  
  const [currentSection, setCurrentSection] = useState<string>(sections[0]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Timer state (in seconds)
  const initialSeconds = test.durationMins * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // User responses dictionary: questionId -> UserAnswerState
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswerState>>(() => {
    const initial: Record<string, UserAnswerState> = {};
    questions.forEach((q, idx) => {
      initial[q.id] = {
        questionId: q.id,
        status: idx === 0 ? 'not_answered' : 'not_visited',
        timeSpentSeconds: 0,
      };
    });
    return initial;
  });

  // Scientific Calculator modal state
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  // Question paper modal state
  const [showQuestionPaper, setShowQuestionPaper] = useState<boolean>(false);
  // Submit Confirmation modal state
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  // Instructions modal state
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const currentQ: Question = questions[currentIndex];
  const currentAnswer = userAnswers[currentQ.id];

  // Timer interval countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // When time expires, auto-submit
  useEffect(() => {
    if (isTimeUp) {
      handleFinalSubmission();
    }
  }, [isTimeUp]);

  // Format time as HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Switch question
  const navigateToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    
    // If target was 'not_visited', mark it as 'not_answered'
    const targetQ = questions[targetIndex];
    setUserAnswers(prev => {
      const state = prev[targetQ.id];
      if (state.status === 'not_visited') {
        return {
          ...prev,
          [targetQ.id]: { ...state, status: 'not_answered' }
        };
      }
      return prev;
    });

    setCurrentIndex(targetIndex);
    setCurrentSection(questions[targetIndex].section);
  };

  // Update current answer for MCQ
  const handleSelectMCQ = (optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOption: optionId,
      }
    }));
  };

  // Update current answer for MSQ
  const handleToggleMSQ = (optionId: string) => {
    const existing = currentAnswer.selectedOptions || [];
    const updated = existing.includes(optionId)
      ? existing.filter(id => id !== optionId)
      : [...existing, optionId];
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOptions: updated,
      }
    }));
  };

  // Update current answer for NAT
  const handleInputNAT = (val: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        numericValue: val,
      }
    }));
  };

  // Append key from virtual on-screen keypad for NAT
  const handleKeypadPress = (char: string) => {
    const cur = currentAnswer.numericValue || '';
    if (char === 'CLEAR') {
      handleInputNAT('');
    } else if (char === 'BACKSPACE') {
      handleInputNAT(cur.slice(0, -1));
    } else if (char === '.' && cur.includes('.')) {
      return;
    } else if (char === '-' && cur.length > 0) {
      return;
    } else {
      handleInputNAT(cur + char);
    }
  };

  // Check if current question has any valid input
  const hasResponse = (): boolean => {
    if (currentQ.type === 'MCQ') {
      return !!currentAnswer.selectedOption;
    } else if (currentQ.type === 'MSQ') {
      return (currentAnswer.selectedOptions || []).length > 0;
    } else if (currentQ.type === 'NAT') {
      return currentAnswer.numericValue !== undefined && currentAnswer.numericValue.trim() !== '';
    }
    return false;
  };

  // Action: Save & Next
  const handleSaveAndNext = () => {
    const answered = hasResponse();
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        status: answered ? 'answered' : 'not_answered'
      }
    }));

    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    }
  };

  // Action: Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    const answered = hasResponse();
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        status: answered ? 'answered_and_marked' : 'marked_for_review'
      }
    }));

    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    }
  };

  // Action: Clear Response
  const handleClearResponse = () => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOption: undefined,
        selectedOptions: [],
        numericValue: '',
        status: 'not_answered'
      }
    }));
  };

  // Calculate statistics for Palette
  const answerList: UserAnswerState[] = Object.values(userAnswers);
  const stats = {
    answered: answerList.filter(a => a.status === 'answered').length,
    notAnswered: answerList.filter(a => a.status === 'not_answered').length,
    notVisited: answerList.filter(a => a.status === 'not_visited').length,
    markedForReview: answerList.filter(a => a.status === 'marked_for_review').length,
    answeredAndMarked: answerList.filter(a => a.status === 'answered_and_marked').length,
  };

  // Final evaluation logic
  const handleFinalSubmission = () => {
    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const subjectPerformance: Record<string, { total: number; correct: number; score: number; maxScore: number }> = {};

    questions.forEach(q => {
      const ans = userAnswers[q.id];
      const subj = q.subject || 'Mining Core';
      if (!subjectPerformance[subj]) {
        subjectPerformance[subj] = { total: 0, correct: 0, score: 0, maxScore: 0 };
      }
      subjectPerformance[subj].total += 1;
      subjectPerformance[subj].maxScore += q.marks;

      let isCorrect = false;
      let isAttempted = false;

      if (q.type === 'MCQ') {
        if (ans?.selectedOption) {
          isAttempted = true;
          isCorrect = ans.selectedOption === q.correctAnswer;
        }
      } else if (q.type === 'MSQ') {
        const selected = (ans?.selectedOptions || []).sort();
        const correct = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [];
        if (selected.length > 0) {
          isAttempted = true;
          isCorrect = selected.length === correct.length && selected.every((val, idx) => val === correct[idx]);
        }
      } else if (q.type === 'NAT') {
        if (ans?.numericValue !== undefined && ans.numericValue.trim() !== '') {
          isAttempted = true;
          const userVal = parseFloat(ans.numericValue);
          if (!isNaN(userVal)) {
            if (q.natRange) {
              isCorrect = userVal >= q.natRange[0] && userVal <= q.natRange[1];
            } else if (typeof q.correctAnswer === 'number') {
              isCorrect = Math.abs(userVal - q.correctAnswer) < 0.05;
            }
          }
        }
      }

      if (!isAttempted) {
        unattemptedCount += 1;
      } else if (isCorrect) {
        correctCount += 1;
        totalScore += q.marks;
        subjectPerformance[subj].correct += 1;
        subjectPerformance[subj].score += q.marks;
      } else {
        incorrectCount += 1;
        totalScore -= q.negativeMarks;
        subjectPerformance[subj].score -= q.negativeMarks;
      }
    });

    const maxScore = test.totalMarks || questions.reduce((acc, q) => acc + q.marks, 0);
    const accuracy = correctCount + incorrectCount > 0 ? (correctCount / (correctCount + incorrectCount)) * 100 : 0;
    const finalScore = Math.max(0, Number(totalScore.toFixed(2)));
    const percentile = Math.min(99.8, Math.max(35, Number(((finalScore / maxScore) * 85 + 14).toFixed(1))));
    const simulatedAIR = Math.max(1, Math.round((100 - percentile) * 18.5));

    const result: TestAttemptResult = {
      testId: test.id,
      testTitle: test.title,
      track: test.track,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      totalScore: finalScore,
      maxScore,
      totalQuestions: questions.length,
      attemptedQuestions: correctCount + incorrectCount,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy: Math.round(accuracy),
      percentile,
      simulatedAIR,
      timeTakenSeconds: initialSeconds - timeLeft,
      answers: userAnswers,
      subjectPerformance,
    };

    onFinishTest(result);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 select-none overflow-hidden">
      {/* Top Bar Header */}
      <header className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs">
            GATE / CBT
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 line-clamp-1">{test.title}</h1>
            <div className="text-[11px] text-slate-400 hidden sm:block">{test.subtitle} • {test.track}</div>
          </div>
        </div>

        {/* Candidate details & Timer */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs text-white">
              AK
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-200">{candidateName}</div>
              <div className="text-[10px] text-slate-400">{candidateRoll}</div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm sm:text-base border shadow-sm ${
            timeLeft < 300 
              ? 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse' 
              : 'bg-slate-800 text-emerald-400 border-slate-700'
          }`}>
            <Timer className="w-4 h-4 text-amber-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              showCalculator 
                ? 'bg-amber-400 text-slate-950 border-amber-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Open GATE Virtual Scientific Calculator"
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Calculator</span>
          </button>
        </div>
      </header>

      {/* Sub-Header / Section Bar */}
      <div className="bg-slate-200 px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-300 text-xs font-semibold gap-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-slate-600 mr-2 font-bold uppercase tracking-wider text-[11px]">Sections:</span>
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => {
                const firstQIndex = questions.findIndex(q => q.section === sec);
                if (firstQIndex !== -1) navigateToQuestion(firstQIndex);
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition whitespace-nowrap ${
                currentSection === sec
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuestionPaper(true)}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Question Paper</span>
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Instructions</span>
          </button>
        </div>
      </div>

      {/* Main Examination Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Active Question Panel */}
        <div className="flex-1 flex flex-col bg-white border-r border-slate-300 overflow-y-auto">
          {/* Question Title & Marks Header */}
          <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                QUESTION {currentIndex + 1}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-md font-black uppercase tracking-wider ${
                currentQ.type === 'NAT' 
                  ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                  : currentQ.type === 'MSQ'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}>
                {currentQ.type}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden sm:inline">
                {currentQ.subject}
              </span>
            </div>

            <div className="text-xs font-black text-slate-600 flex items-center gap-3">
              <span className="text-emerald-700 font-black">+ {currentQ.marks} MARKS</span>
              <span className="text-rose-700 font-black">- {currentQ.negativeMarks} NEG</span>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-6 flex-1 space-y-6 overflow-y-auto">
            {/* Question Text */}
            <div className="text-slate-900 text-base leading-relaxed font-bold">
              {currentQ.questionText}
            </div>

            {currentQ.formulaOrNote && (
              <div className="bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs p-3.5 rounded-xl font-mono font-bold">
                {currentQ.formulaOrNote}
              </div>
            )}

            {/* Answer Options Area */}
            {currentQ.type === 'MCQ' && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Select one correct option:
                </div>
                {currentQ.options?.map(opt => {
                  const isSelected = currentAnswer.selectedOption === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectMCQ(opt.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm scale-[1.01]'
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-900 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`mcq-${currentQ.id}`}
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 text-slate-900 focus:ring-slate-900"
                      />
                      <div className="text-sm font-bold">
                        <span className={`mr-2 font-black ${isSelected ? 'text-amber-400' : 'text-slate-900'}`}>
                          ({opt.id})
                        </span>
                        {opt.text}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'MSQ' && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">
                  Multiple Select Question (One or more options may be correct):
                </div>
                {currentQ.options?.map(opt => {
                  const isSelected = (currentAnswer.selectedOptions || []).includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleToggleMSQ(opt.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 shadow-sm scale-[1.01]'
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <div className="text-sm text-slate-900 font-bold">
                        <span className="font-black text-amber-700 mr-2">[{opt.id}]</span>
                        {opt.text}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'NAT' && (
              <div className="space-y-4 pt-2 max-w-md">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-purple-800">
                  Numerical Answer Type (Enter value using on-screen keyboard or typing):
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentAnswer.numericValue || ''}
                    onChange={(e) => handleInputNAT(e.target.value)}
                    placeholder="Enter numerical value..."
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 text-lg font-mono font-black text-slate-900 bg-white focus:outline-none focus:border-slate-900 shadow-inner"
                  />
                  <button
                    onClick={handleClearResponse}
                    className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Clear
                  </button>
                </div>

                {/* Virtual Numeric Pad for CBT realism */}
                <div className="p-3.5 bg-slate-100 rounded-xl border-2 border-slate-200">
                  <div className="grid grid-cols-4 gap-2 font-mono text-sm">
                    {['7', '8', '9', 'BACKSPACE', '4', '5', '6', 'CLEAR', '1', '2', '3', '-', '0', '.', '00', '+'].map(k => (
                      <button
                        key={k}
                        onClick={() => handleKeypadPress(k)}
                        className={`p-3 rounded-lg font-black transition ${
                          k === 'CLEAR' || k === 'BACKSPACE'
                            ? 'bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs'
                            : 'bg-white hover:bg-slate-200 text-slate-900 border border-slate-200 shadow-xs'
                        }`}
                      >
                        {k === 'BACKSPACE' ? '⌫' : k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="btn-mark-review"
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition shadow-xs"
              >
                Mark for Review & Next
              </button>
              <button
                id="btn-clear-response"
                onClick={handleClearResponse}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-800 rounded-lg text-xs font-black uppercase tracking-wider transition"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => navigateToQuestion(currentIndex - 1)}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 border-2 border-slate-200 text-slate-800 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <button
                id="btn-save-next"
                onClick={handleSaveAndNext}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 hover:scale-105"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: TCS-iON Style Question Palette */}
        <div className="w-72 sm:w-80 bg-slate-50 border-l border-slate-300 flex flex-col justify-between overflow-y-auto">
          {/* Palette Legend */}
          <div className="p-3 border-b border-slate-200 space-y-2 text-[11px] bg-white">
            <div className="font-bold text-slate-800 uppercase tracking-wider">Question Status Legend</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">{stats.answered}</span>
                <span className="text-slate-600 font-medium">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-rose-600 text-white text-[9px] flex items-center justify-center font-bold">{stats.notAnswered}</span>
                <span className="text-slate-600 font-medium">Not Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-300 text-slate-700 text-[9px] flex items-center justify-center font-bold">{stats.notVisited}</span>
                <span className="text-slate-600 font-medium">Not Visited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-purple-600 text-white text-[9px] flex items-center justify-center font-bold">{stats.markedForReview}</span>
                <span className="text-slate-600 font-medium">Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <div className="w-4 h-4 rounded bg-purple-600 text-white text-[9px] flex items-center justify-center font-bold relative">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full absolute bottom-0 right-0"></span>
                  {stats.answeredAndMarked}
                </div>
                <span className="text-slate-600 font-medium">Ans & Marked for Review</span>
              </div>
            </div>
          </div>

          {/* Section Indicator */}
          <div className="px-4 py-2 bg-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
            <span>SECTION: {currentSection}</span>
            <span className="text-slate-500 font-normal text-[11px]">{questions.filter(q => q.section === currentSection).length} Qs</span>
          </div>

          {/* Question Grid Buttons */}
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCurrent = idx === currentIndex;
                let bgClass = 'bg-slate-300 text-slate-800'; // not_visited

                if (ans.status === 'answered') {
                  bgClass = 'bg-emerald-600 text-white';
                } else if (ans.status === 'not_answered') {
                  bgClass = 'bg-rose-600 text-white';
                } else if (ans.status === 'marked_for_review') {
                  bgClass = 'bg-purple-600 text-white rounded-full';
                } else if (ans.status === 'answered_and_marked') {
                  bgClass = 'bg-purple-700 text-white rounded-full ring-2 ring-emerald-400';
                }

                return (
                  <button
                    key={q.id}
                    id={`palette-q-${idx + 1}`}
                    onClick={() => navigateToQuestion(idx)}
                    className={`h-9 rounded-md font-bold text-xs flex items-center justify-center transition relative ${bgClass} ${
                      isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : 'hover:opacity-90'
                    }`}
                  >
                    {idx + 1}
                    {ans.status === 'answered_and_marked' && (
                      <span className="w-2 h-2 bg-emerald-400 rounded-full absolute bottom-0.5 right-0.5 border border-white"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Test Button Container */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-2">
            <button
              id="btn-submit-exam"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SUBMIT EXAMINATION</span>
            </button>
            <button
              onClick={onExit}
              className="w-full py-2 text-slate-400 hover:text-slate-900 text-xs font-black uppercase tracking-wider transition-colors"
            >
              Exit to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* GATE Scientific Calculator Modal Overlay */}
      {showCalculator && (
        <ScientificCalculator onClose={() => setShowCalculator(false)} />
      )}

      {/* Question Paper Preview Modal */}
      {showQuestionPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-base font-bold">Question Paper Overview - {test.title}</h2>
              <button onClick={() => setShowQuestionPaper(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-800">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Q{idx + 1}. ({q.type} - {q.section})</span>
                    <span className="text-xs text-slate-500">+{q.marks} / -{q.negativeMarks} marks</span>
                  </div>
                  <div className="text-slate-800">{q.questionText}</div>
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 pl-2">
                      {q.options.map(opt => (
                        <div key={opt.id}>({opt.id}) {opt.text}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-100 border-t flex justify-end">
              <button
                onClick={() => setShowQuestionPaper(false)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Back to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-base font-bold">Standard GATE / CBT Exam Instructions</h2>
              <button onClick={() => setShowInstructions(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="font-bold text-slate-900">Marking Scheme:</div>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>MCQ:</strong> 1-mark questions carry -0.33 negative mark; 2-mark questions carry -0.66 negative mark.</li>
                <li><strong>MSQ:</strong> No negative marking. Full marks only if all correct choices and no incorrect choices are chosen.</li>
                <li><strong>NAT:</strong> Numerical Answer Type questions carry NO negative marking.</li>
              </ul>

              <div className="font-bold text-slate-900 pt-2">Navigating to Questions:</div>
              <p className="text-xs">
                Clicking <strong>Save & Next</strong> saves your answer and advances. Clicking <strong>Mark for Review & Next</strong> flags the question for later check.
              </p>
            </div>
            <div className="p-4 bg-slate-100 border-t flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                Understood, Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Test Summary Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Exam Submission</h3>
                <p className="text-xs text-slate-500">Are you sure you want to finish and view your scorecard?</p>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-xs">
              <div className="grid grid-cols-2 p-2.5 border-b border-slate-200 font-semibold bg-slate-100 text-slate-700">
                <span>Category</span>
                <span className="text-right">Count</span>
              </div>
              <div className="grid grid-cols-2 p-2.5 border-b border-slate-100 text-slate-600">
                <span>Total Questions</span>
                <span className="text-right font-bold">{questions.length}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5 border-b border-slate-100 text-emerald-700">
                <span className="font-semibold">Answered</span>
                <span className="text-right font-bold">{stats.answered}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5 border-b border-slate-100 text-rose-700">
                <span className="font-semibold">Not Answered</span>
                <span className="text-right font-bold">{stats.notAnswered}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5 border-b border-slate-100 text-purple-700">
                <span className="font-semibold">Marked for Review</span>
                <span className="text-right font-bold">{stats.markedForReview}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5 text-slate-500">
                <span>Not Visited</span>
                <span className="text-right font-bold">{stats.notVisited}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold"
              >
                Return to Exam
              </button>
              <button
                id="btn-confirm-final-submit"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmission();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                Yes, Submit Final Responses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
