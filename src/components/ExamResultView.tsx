import React, { useEffect, useState } from 'react';
import { TestAttemptResult, MockTest, Question } from '../types';
import confetti from 'canvas-confetti';
import { 
  Trophy, CheckCircle2, XCircle, MinusCircle, Clock, Target, 
  ArrowLeft, RotateCcw, Award, BookOpen, ChevronDown, ChevronUp, Share2
} from 'lucide-react';

interface ExamResultViewProps {
  result: TestAttemptResult;
  test: MockTest;
  onRetake: () => void;
  onBackToDashboard: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  result,
  test,
  onRetake,
  onBackToDashboard,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const getQuestionStatus = (q: Question) => {
    const ans = result.answers[q.id];
    if (!ans) return 'unattempted';

    if (q.type === 'MCQ') {
      if (!ans.selectedOption) return 'unattempted';
      return ans.selectedOption === q.correctAnswer ? 'correct' : 'incorrect';
    } else if (q.type === 'MSQ') {
      const selected = (ans.selectedOptions || []).sort();
      const correct = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [];
      if (selected.length === 0) return 'unattempted';
      return selected.length === correct.length && selected.every((v, i) => v === correct[i])
        ? 'correct'
        : 'incorrect';
    } else if (q.type === 'NAT') {
      if (ans.numericValue === undefined || ans.numericValue.trim() === '') return 'unattempted';
      const userVal = parseFloat(ans.numericValue);
      if (isNaN(userVal)) return 'incorrect';
      if (q.natRange) {
        return userVal >= q.natRange[0] && userVal <= q.natRange[1] ? 'correct' : 'incorrect';
      }
      return typeof q.correctAnswer === 'number' && Math.abs(userVal - q.correctAnswer) < 0.05
        ? 'correct'
        : 'incorrect';
    }
    return 'unattempted';
  };

  const filteredQuestions = test.questions.filter(q => {
    const status = getQuestionStatus(q);
    if (filter === 'all') return true;
    return status === filter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retake Test
        </button>
      </div>

      {/* Main Scorecard Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" /> Test Completed • {result.track}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{result.testTitle}</h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Completed on {result.date} in {formatSeconds(result.timeTakenSeconds)}
            </p>
          </div>

          {/* Primary Score Ring */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-2xl border-2 border-slate-700 min-w-[200px]">
            <div className="text-4xl sm:text-5xl font-black text-amber-400">
              {result.totalScore}
              <span className="text-xl text-slate-400 font-bold"> / {result.maxScore}</span>
            </div>
            <div className="text-[11px] text-slate-300 uppercase tracking-[0.2em] font-black mt-1">TOTAL SCORE</div>
          </div>
        </div>

        {/* 4 Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-center">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
            <div className="text-3xl font-black text-white">{result.accuracy}%</div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Accuracy</div>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
            <div className="text-3xl font-black text-amber-400">{result.percentile}%</div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Percentile</div>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
            <div className="text-3xl font-black text-white">~{result.simulatedAIR}</div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Est. AIR</div>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
            <div className="text-3xl font-black text-emerald-400">
              {result.correctCount}/{result.totalQuestions}
            </div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Correct Qs</div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <Award className="w-5 h-5 text-slate-900" />
          Subject & Topic Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(result.subjectPerformance).map(([subj, rawData]) => {
            const data = rawData as { total: number; correct: number; score: number; maxScore: number };
            const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            return (
              <div key={subj} className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-900 uppercase">
                  <span>{subj}</span>
                  <span className="font-bold text-slate-600">{data.correct}/{data.total} ({pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 75 ? 'bg-slate-900' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question-By-Question Solution Explorer */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Detailed Solutions & Explanations
            </h3>
            <p className="text-xs text-slate-500">Step-by-step mining formulas and statutory CMR 2017 clauses.</p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'all' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({test.questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'correct' ? 'bg-emerald-600 shadow text-white font-bold' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Correct ({result.correctCount})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'incorrect' ? 'bg-rose-600 shadow text-white font-bold' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Incorrect ({result.incorrectCount})
            </button>
            <button
              onClick={() => setFilter('unattempted')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'unattempted' ? 'bg-slate-600 shadow text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unattempted ({result.unattemptedCount})
            </button>
          </div>
        </div>

        {/* List of Filtered Questions */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const status = getQuestionStatus(q);
            const ans = result.answers[q.id];
            const isExpanded = expandedQId === q.id || expandedQId === null; // expanded by default

            return (
              <div
                key={q.id}
                className={`rounded-2xl border-2 transition overflow-hidden ${
                  status === 'correct'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : status === 'incorrect'
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                {/* Question Header */}
                <div
                  onClick={() => setExpandedQId(expandedQId === q.id ? '' : q.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none bg-white border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">
                      {status === 'correct' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : status === 'incorrect' ? (
                        <XCircle className="w-6 h-6 text-rose-600" />
                      ) : (
                        <MinusCircle className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        Q{test.questions.findIndex(item => item.id === q.id) + 1}. {q.type}
                      </span>
                      <span className="ml-2 text-xs text-slate-500 font-medium">[{q.subject}]</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      status === 'correct'
                        ? 'bg-emerald-100 text-emerald-800'
                        : status === 'incorrect'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {status}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details & Solutions */}
                {isExpanded && (
                  <div className="p-5 space-y-4 text-sm text-slate-800">
                    <div className="font-medium leading-relaxed">{q.questionText}</div>

                    {/* Options / Answer Status */}
                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map(opt => {
                          const isCorrect = Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.includes(opt.id)
                            : q.correctAnswer === opt.id;
                          const isChosen = q.type === 'MCQ'
                            ? ans?.selectedOption === opt.id
                            : (ans?.selectedOptions || []).includes(opt.id);

                          return (
                            <div
                              key={opt.id}
                              className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border font-medium ${
                                isCorrect
                                  ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold'
                                  : isChosen
                                  ? 'bg-rose-100/70 border-rose-300 text-rose-950 line-through'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="font-bold">({opt.id})</span>
                              <span>{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'NAT' && (
                      <div className="flex flex-wrap gap-4 text-xs font-mono bg-white p-3 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-slate-500 font-sans">Your Input: </span>
                          <span className="font-bold text-slate-900">{ans?.numericValue || 'None'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-sans">Correct Value: </span>
                          <span className="font-bold text-emerald-700">
                            {typeof q.correctAnswer === 'number' ? q.correctAnswer : ''} {q.natRange ? `[${q.natRange[0]} to ${q.natRange[1]}]` : ''}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Step-by-Step Explanation & Statutory Reference */}
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5 text-blue-700" />
                        Official Explanation & Calculation:
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                        {q.explanation}
                      </p>
                      {q.statutoryReference && (
                        <div className="pt-2 text-xs font-bold text-indigo-700">
                          Statutory Citation: {q.statutoryReference}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
