import React, { useState } from 'react';
import { MockTest, ExamTrack } from '../types';
import { 
  Timer, Search, Flame, ShieldCheck, BookOpen, 
  ChevronRight, ArrowRight, Zap, Target
} from 'lucide-react';

interface DashboardProps {
  tests: MockTest[];
  selectedTrack: ExamTrack;
  onSelectTrack: (track: ExamTrack) => void;
  onStartExam: (testId: string) => void;
  onOpenFlashcards: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tests,
  selectedTrack,
  onSelectTrack,
  onStartExam,
  onOpenFlashcards,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllTests, setShowAllTests] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // The 4 official tracks with their Bold sub-labels
  const trackConfigs: { track: ExamTrack; label: string; tag: string }[] = [
    { track: 'GATE Mining', label: 'GATE Mining', tag: 'PREMIUM' },
    { track: 'DGMS First Class', label: 'DGMS First Class', tag: 'STATUTORY' },
    { track: 'All PSU', label: 'All PSU', tag: 'ALL PSU' },
    { track: 'Overman/Mate', label: 'Overman/Mate', tag: 'TECHNICAL' },
  ];

  // Filter tests based on track, search query, difficulty
  const filteredTests = tests.filter(test => {
    const matchesTrack = selectedTrack === 'All Tracks' || test.track === selectedTrack;
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || test.difficulty === selectedDifficulty;
    return matchesTrack && matchesSearch && matchesDifficulty;
  });

  const displayedTests = showAllTests ? filteredTests : filteredTests.slice(0, 4);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-6 py-8">
      {/* 1. Hero & Track Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bold Typography Greeting */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Mining Engineering CBT</span>
            </div>
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tighter text-slate-900 mb-4">
              WELCOME<br />BACK, <span className="text-slate-400">AMIT.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 font-medium max-w-md">
              Ready to crush your next mining exam? Pick a track and start practicing.
            </p>
          </div>

          {/* Quick Streak & Target Indicator Pill */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-3 bg-white border-2 border-slate-100 rounded-xl px-4 py-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-900">14 Days Streak</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target AIR &lt; 50</p>
              </div>
            </div>

            <button
              onClick={onOpenFlashcards}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 hover:border-slate-300 rounded-xl px-4 py-2.5 shadow-xs text-xs font-black uppercase tracking-wider transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>CMR 2017 Cards</span>
            </button>
          </div>
        </div>

        {/* Right Column: 2x2 Select Exam Track Grid */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Select Exam Track
            </p>
            <button
              onClick={() => onSelectTrack('All Tracks')}
              className={`text-[11px] font-black uppercase tracking-wider transition-colors ${
                selectedTrack === 'All Tracks'
                  ? 'text-slate-900 underline decoration-2 underline-offset-4'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              Show All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {trackConfigs.map(item => {
              const isSelected = selectedTrack === item.track;
              return (
                <button
                  key={item.track}
                  id={`track-chip-${item.track.toLowerCase().replace(/[\s/]+/g, '-')}`}
                  onClick={() => onSelectTrack(item.track)}
                  className={`p-4 rounded-xl text-left border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-900 border-slate-100 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {item.tag}
                  </p>
                  <p className="font-black text-sm sm:text-base tracking-tight leading-snug">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mock tests by topic (Ventilation, CMR 2017, NALCO, Coal Cutting)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 bg-white text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-slate-900 shadow-xs transition-colors"
          />
        </div>

        {/* Difficulty filter chips */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Hard', 'Medium', 'Easy'].map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors border ${
                selectedDifficulty === diff
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Available Mock Tests Section */}
      <div className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-900">
              AVAILABLE MOCK TESTS
            </h2>
            <span className="bg-slate-100 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-md">
              {filteredTests.length}
            </span>
          </div>
          <button
            onClick={() => setShowAllTests(!showAllTests)}
            className="text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-900 border-b-2 border-slate-200 hover:border-slate-900 pb-1 transition-all"
          >
            {showAllTests ? 'SHOW LESS' : 'VIEW ALL'}
          </button>
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 space-y-3">
            <p className="text-base font-black text-slate-900 uppercase tracking-tight">No mock tests found</p>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              No tests match your current search "{searchQuery}" or selected track filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('All');
                onSelectTrack('All Tracks');
              }}
              className="mt-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedTests.map((test) => {
              const trackTagColor = test.track === 'GATE Mining' 
                ? 'text-blue-600' 
                : test.track === 'DGMS First Class'
                ? 'text-emerald-600'
                : test.track === 'All PSU'
                ? 'text-orange-500'
                : 'text-purple-600';

              return (
                <div
                  key={test.id}
                  id={`mock-test-card-${test.id}`}
                  className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-900 shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-black uppercase tracking-widest ${trackTagColor}`}>
                          {test.track} • {test.type}
                        </p>
                        {test.featured && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                            HOT
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {test.title}
                      </h3>
                      <p className="text-slate-400 text-sm font-medium">
                        {test.subtitle}
                      </p>
                    </div>

                    <div className="bg-slate-50 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-slate-700 border border-slate-100 shrink-0">
                      {test.difficulty}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2 mb-4">
                    {test.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-slate-400" />
                        <span>{test.durationMins} MINS</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>{test.questionCount || test.questions.length} QS</span>
                      </span>
                    </div>

                    <button
                      id={`btn-start-now-${test.id}`}
                      onClick={() => onStartExam(test.id)}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider group-hover:scale-105 transition-transform flex items-center gap-1.5"
                    >
                      <span>START NOW</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Calculator notice banner */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
            EXAMINATION TOOLS
          </p>
          <h4 className="text-base font-black text-slate-900 tracking-tight">
            Built-in GATE Virtual Scientific Calculator
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Trigonometry, logarithmic functions, square roots, and power calculations are built into every CBT session.
          </p>
        </div>
        <button
          onClick={() => onStartExam('ventilation-thermo-mock')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-xs hover:scale-105"
        >
          PRACTICE NUMERICALS
        </button>
      </div>
    </div>
  );
};
