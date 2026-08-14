import React, { useState } from 'react';
import { STATUTORY_RULES } from '../data/statutoryFlashcards';
import { StatutoryRule } from '../types';
import { BookOpen, Sparkles, ChevronLeft, ChevronRight, RotateCw, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const StatutoryFlashcardsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const categories = ['All', 'Ventilation', 'Blasting & Explosives', 'Haulage & Winding', 'Safety & Dust', 'Management & Staff'];

  const filteredRules: StatutoryRule[] = selectedCategory === 'All'
    ? STATUTORY_RULES
    : STATUTORY_RULES.filter(r => r.category === selectedCategory);

  const currentRule = filteredRules[currentIndex] || filteredRules[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % filteredRules.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredRules.length) % filteredRules.length);
  };

  const toggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-[0.2em] mb-1">
              <ShieldCheck className="w-4 h-4" />
              STATUTORY REVISION
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">CMR 2017 FLASHCARDS</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              High-yield numeric thresholds and statutory rules for DGMS & GATE examinations.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 border-2 border-slate-700 px-4 py-2.5 rounded-2xl text-center">
            <div>
              <div className="text-2xl font-black text-amber-400">{masteredIds.length} / {STATUTORY_RULES.length}</div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Rules Mastered</div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              id={`flashcard-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 shadow-sm scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive 3D Flip Card */}
      {filteredRules.length > 0 && (
        <div className="flex flex-col items-center">
          <div
            id="interactive-statutory-flashcard"
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-xl h-84 cursor-pointer select-none perspective-1000 group"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.4s ease'
              }}
            >
              {/* Front Side (Question / Regulation) */}
              <div
                className="absolute inset-0 w-full h-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-md">
                    {currentRule.actOrRegulation} • {currentRule.regulationNo}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {currentRule.category}
                  </span>
                </div>

                <div className="text-center py-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">
                    {currentRule.title}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                    {currentRule.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-bold pt-3 border-t border-slate-100 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <RotateCw className="w-3.5 h-3.5 text-slate-900" />
                    Click to flip for limit
                  </span>
                  <span className="font-black text-slate-900">{currentIndex + 1} / {filteredRules.length}</span>
                </div>
              </div>

              {/* Back Side (Statutory Threshold / Answer) */}
              <div
                className="absolute inset-0 w-full h-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-800 flex flex-col justify-between"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-md">
                    STANDARD ({currentRule.regulationNo})
                  </span>
                  <button
                    onClick={(e) => toggleMastered(currentRule.id, e)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition ${
                      masteredIds.includes(currentRule.id)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {masteredIds.includes(currentRule.id) ? 'Mastered' : 'Mark Mastered'}
                  </button>
                </div>

                <div className="text-center py-2 space-y-3">
                  <div className="text-xs uppercase text-amber-400 font-black tracking-[0.2em]">
                    Statutory Prescribed Threshold
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white bg-slate-800 p-5 rounded-2xl border border-slate-700">
                    {currentRule.keyLimit}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800 font-bold uppercase tracking-wider">
                  <span className="truncate max-w-[200px] text-slate-300">{currentRule.title}</span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <RotateCw className="w-3.5 h-3.5" /> Flip Back
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              id="btn-prev-flashcard"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900 font-black text-xs uppercase tracking-wider shadow-sm transition"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              id="btn-next-flashcard"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-sm transition hover:scale-105"
            >
              <span>Next Rule</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid of All Regulations */}
      <div className="mt-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900">All Quick Reference Items ({filteredRules.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredRules.map((rule, idx) => {
            const isDone = masteredIds.includes(rule.id);
            return (
              <div
                key={rule.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsFlipped(false);
                }}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  currentIndex === idx
                    ? 'bg-blue-50/70 border-blue-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                      {rule.regulationNo}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{rule.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{rule.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{rule.keyLimit}</p>
                </div>
                {isDone && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
