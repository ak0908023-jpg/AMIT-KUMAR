import React, { useState } from 'react';
import { TestAttemptResult, MockTest } from '../types';
import { ExamHistoryProgressView } from './ExamHistoryProgressView';
import { 
  TrendingUp, BarChart3, Award, Target, Flame, 
  CheckCircle2, Clock, Zap, ArrowRight, BookOpen, AlertTriangle,
  History, Layers
} from 'lucide-react';

interface AnalyticsViewProps {
  history: TestAttemptResult[];
  onStartTest: (testId: string) => void;
  onViewResult?: (result: TestAttemptResult) => void;
  allTests: MockTest[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
  history, 
  onStartTest, 
  onViewResult,
  allTests 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'mastery'>('history');

  const topicMastery = [
    { name: 'Mine Ventilation & Atkinson Law', score: 85, color: 'bg-emerald-500', status: 'Strong' },
    { name: 'CMR 2017 & Statutory Rules', score: 92, color: 'bg-emerald-600', status: 'Strong' },
    { name: 'Rock Mechanics & RMR/Q', score: 68, color: 'bg-amber-500', status: 'Needs Practice' },
    { name: 'Surface Mining & HEMM Planning', score: 76, color: 'bg-blue-500', status: 'Good' },
    { name: 'Mine Surveying & Curves', score: 62, color: 'bg-rose-500', status: 'Focus Area' },
    { name: 'General Aptitude & Reasoning', score: 88, color: 'bg-indigo-500', status: 'Strong' },
  ];

  return (
    <div className="space-y-6">
      {/* Top View Mode Switcher */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border-2 border-slate-100 shadow-xs max-w-md mx-auto">
          <button
            id="tab-exam-history"
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeSubTab === 'history'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Exam History & Trends</span>
          </button>
          <button
            id="tab-syllabus-mastery"
            onClick={() => setActiveSubTab('mastery')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeSubTab === 'mastery'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Syllabus Readiness</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'history' ? (
        <ExamHistoryProgressView
          history={history}
          onStartTest={onStartTest}
          onViewResult={onViewResult}
          allTests={allTests}
        />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
          {/* Target Progress Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 font-black text-slate-900 text-base uppercase tracking-tight">
                <Target className="w-5 h-5 text-slate-900" />
                Target: GATE Mining 2026 Score 75+ (AIR &lt; 50)
              </div>
              <span className="text-xs font-black text-slate-900 bg-amber-400 px-3.5 py-1.5 rounded-lg uppercase tracking-wider self-start sm:self-auto">
                74% Readiness
              </span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 rounded-full transition-all duration-500" style={{ width: '74%' }}></div>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Diagnostic assessment: You are in the top tier! Focus on Rock Mechanics (RMR/Q System) and Mine Surveying to bridge the remaining 6 marks gap.
            </p>
          </div>

          {/* Subject Topic Mastery */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-2 tracking-tight">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Syllabus Mastery Breakdown
              </h3>
              <span className="text-xs font-bold text-slate-400">6 Core Subjects</span>
            </div>

            <div className="space-y-4">
              {topicMastery.map(t => (
                <div key={t.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{t.name}</span>
                    <span className="text-slate-500 flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        t.status === 'Strong' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'Needs Practice' ? 'bg-amber-100 text-amber-800' :
                        t.status === 'Focus Area' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {t.status}
                      </span>
                      <span className="font-black text-slate-900">{t.score}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Focus Actions */}
          <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wide">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Prescriptive Improvement Plan
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2.5 shadow-xs">
                <h4 className="text-xs font-black uppercase text-slate-900">1. Master Atkinson Ventilation Formula</h4>
                <p className="text-xs text-slate-600 font-medium">Solve 15 Numerical NATs on parallel splits, equivalent orifice, and fan laws.</p>
                <button
                  onClick={() => onStartTest('ventilation-thermo-mock')}
                  className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider"
                >
                  Start Ventilation Mock <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2.5 shadow-xs">
                <h4 className="text-xs font-black uppercase text-slate-900">2. Revise CMR 2017 High-Yield Limits</h4>
                <p className="text-xs text-slate-600 font-medium">Quickly drill statutory standards on ventilation, gas testing, and shotfiring safety.</p>
                <button
                  onClick={() => onStartTest('all-psu-mining-mock-1')}
                  className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider"
                >
                  Start PSU Mock <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

