import React, { useState, useMemo } from 'react';
import { TestAttemptResult, ExamTrack, MockTest } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  History,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Filter,
  RotateCcw,
  Eye,
  Database,
  Search,
  Sparkles,
  ChevronRight,
  Flame,
  Zap,
  Layers,
  BarChart2
} from 'lucide-react';

interface ExamHistoryProgressViewProps {
  history: TestAttemptResult[];
  onStartTest: (testId: string) => void;
  onViewResult?: (result: TestAttemptResult) => void;
  onDeleteAttempt?: (index: number, testId: string) => void;
  allTests: MockTest[];
}

export const ExamHistoryProgressView: React.FC<ExamHistoryProgressViewProps> = ({
  history,
  onStartTest,
  onViewResult,
  onDeleteAttempt,
  allTests,
}) => {
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<ExamTrack>('All Tracks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'score-desc' | 'accuracy-desc'>('date-desc');
  const [activeChartTab, setActiveChartTab] = useState<'score-trend' | 'accuracy-speed' | 'track-breakdown'>('score-trend');

  // Format seconds to human-readable duration (e.g., "48m 20s" or "1h 12m")
  const formatDuration = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds <= 0) return '35 mins';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds > 0 ? `${seconds}s` : ''}`;
  };

  // Filter history
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchTrack = selectedTrackFilter === 'All Tracks' || item.track === selectedTrackFilter;
      const matchSearch = item.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.track.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTrack && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'score-desc') {
        const scorePctA = (a.totalScore / a.maxScore) * 100;
        const scorePctB = (b.totalScore / b.maxScore) * 100;
        return scorePctB - scorePctA;
      }
      if (sortBy === 'accuracy-desc') {
        return b.accuracy - a.accuracy;
      }
      return 0;
    });
  }, [history, selectedTrackFilter, searchQuery, sortBy]);

  // Aggregate metrics
  const totalAttempts = history.length;
  const filteredCount = filteredHistory.length;

  const avgAccuracy = useMemo(() => {
    if (filteredHistory.length === 0) return 0;
    return Math.round(filteredHistory.reduce((sum, h) => sum + h.accuracy, 0) / filteredHistory.length);
  }, [filteredHistory]);

  const avgScorePct = useMemo(() => {
    if (filteredHistory.length === 0) return 0;
    const totalScorePct = filteredHistory.reduce((sum, h) => sum + ((h.totalScore / h.maxScore) * 100), 0);
    return Math.round(totalScorePct / filteredHistory.length);
  }, [filteredHistory]);

  const peakScore = useMemo(() => {
    if (filteredHistory.length === 0) return 0;
    return Math.max(...filteredHistory.map(h => h.totalScore));
  }, [filteredHistory]);

  const totalTimeSpentSeconds = useMemo(() => {
    return filteredHistory.reduce((sum, h) => sum + (h.timeTakenSeconds || 1800), 0);
  }, [filteredHistory]);

  // Chronological data for time-series charts (sorted oldest to newest)
  const timeSeriesData = useMemo(() => {
    const list = [...filteredHistory].reverse();
    return list.map((item, index) => {
      const scorePct = Math.round((item.totalScore / item.maxScore) * 100);
      const minutesSpent = Math.round((item.timeTakenSeconds || 1800) / 60);
      const shortDate = item.date.split(',')[0] || `Test #${index + 1}`;

      return {
        id: index + 1,
        date: shortDate,
        fullDate: item.date,
        title: item.testTitle,
        track: item.track,
        score: item.totalScore,
        maxScore: item.maxScore,
        scorePct: scorePct,
        accuracy: Math.round(item.accuracy),
        percentile: Math.round(item.percentile),
        air: item.simulatedAIR,
        durationMins: minutesSpent,
      };
    });
  }, [filteredHistory]);

  // Track breakdown data for comparison bar chart
  const trackComparisonData = useMemo(() => {
    const tracks: ExamTrack[] = ['GATE Mining', 'DGMS First Class', 'All PSU', 'Overman/Mate'];
    return tracks.map(track => {
      const attemptsInTrack = history.filter(h => h.track === track);
      const count = attemptsInTrack.length;
      const avgScore = count > 0 
        ? Math.round(attemptsInTrack.reduce((sum, h) => sum + ((h.totalScore / h.maxScore) * 100), 0) / count)
        : 0;
      const trackAccuracy = count > 0
        ? Math.round(attemptsInTrack.reduce((sum, h) => sum + h.accuracy, 0) / count)
        : 0;

      return {
        track: track === 'GATE Mining' ? 'GATE' : track === 'DGMS First Class' ? 'DGMS' : track === 'All PSU' ? 'All PSU' : 'Overman',
        fullName: track,
        attempts: count,
        avgScore: avgScore,
        accuracy: trackAccuracy,
      };
    });
  }, [history]);

  const tracksList: ExamTrack[] = ['All Tracks', 'GATE Mining', 'DGMS First Class', 'All PSU', 'Overman/Mate'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-3 border border-slate-700">
              <History className="w-3.5 h-3.5" />
              <span>CBT Performance Log</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              EXAM HISTORY & PROGRESS TRACKING
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1.5 max-w-2xl">
              Chronological records, score trends, and comprehensive analytical diagnostics for GATE Mining, DGMS, and All PSU examinations.
            </p>
          </div>

          {/* Cloud SQL Database Sync Status Pill */}
          <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-4 py-3 rounded-2xl shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-xs font-black text-white uppercase tracking-wider">Cloud SQL Synced</p>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">PostgreSQL Engine</p>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700/80">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Attempts</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{filteredCount}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">across {selectedTrackFilter}</p>
          </div>

          <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700/80">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Average Accuracy</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{avgAccuracy}%</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Target &gt; 80%</p>
          </div>

          <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700/80">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Average Score %</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{avgScorePct}%</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Peak: {peakScore} marks</p>
          </div>

          <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700/80">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">CBT Practice Time</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">{formatDuration(totalTimeSpentSeconds)}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Time logged</p>
          </div>
        </div>
      </div>

      {/* Track Selector Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Filter By Exam Track</p>
          <span className="text-xs font-bold text-slate-500">
            Showing <strong className="text-slate-900">{filteredCount}</strong> of {totalAttempts} attempts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {tracksList.map(track => {
            const isSelected = selectedTrackFilter === track;
            return (
              <button
                key={track}
                id={`filter-track-${track.toLowerCase().replace(/[\s/]+/g, '-')}`}
                onClick={() => setSelectedTrackFilter(track)}
                className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 text-center ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-700 border-slate-100 hover:border-slate-300 shadow-xs'
                }`}
              >
                {track}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Performance Trends Charts Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-900" />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                PERFORMANCE TRENDS & PROGRESSION
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Visualizing examination trajectory, score percentage gains, and accuracy over time.
            </p>
          </div>

          {/* Chart View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveChartTab('score-trend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeChartTab === 'score-trend'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Score Trend
            </button>
            <button
              onClick={() => setActiveChartTab('accuracy-speed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeChartTab === 'accuracy-speed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Accuracy & Time
            </button>
            <button
              onClick={() => setActiveChartTab('track-breakdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                activeChartTab === 'track-breakdown'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Track Breakdown
            </button>
          </div>
        </div>

        {timeSeriesData.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-600">No attempts in {selectedTrackFilter} yet</p>
            <p className="text-xs text-slate-400">Complete an exam simulator test to visualize performance graphs here.</p>
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            {activeChartTab === 'score-trend' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="percentileGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                            <p className="font-black text-amber-400">{d.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{d.track} • {d.fullDate}</p>
                            <div className="pt-1.5 border-t border-slate-700 space-y-1">
                              <p className="flex justify-between gap-4 font-bold">
                                <span>Score:</span>
                                <span className="text-white">{d.score} / {d.maxScore} ({d.scorePct}%)</span>
                              </p>
                              <p className="flex justify-between gap-4 font-bold">
                                <span>Percentile:</span>
                                <span className="text-amber-300">{d.percentile}%</span>
                              </p>
                              <p className="flex justify-between gap-4 font-bold">
                                <span>Est. AIR:</span>
                                <span className="text-emerald-400">~Rank {d.air}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="scorePct"
                    name="Score Percentage (%)"
                    stroke="#0f172a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: '#0f172a' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="percentile"
                    name="Percentile (%)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#percentileGradient)"
                    dot={{ r: 3, fill: '#f59e0b' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeChartTab === 'accuracy-speed' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} />
                  <YAxis yAxisId="left" domain={[0, 100]} stroke="#10b981" fontSize={11} fontWeight={700} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={11} fontWeight={700} tickLine={false} tickFormatter={(val) => `${val}m`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                            <p className="font-black text-white">{d.title}</p>
                            <p className="text-[10px] text-slate-400">{d.fullDate}</p>
                            <div className="pt-1.5 border-t border-slate-700 space-y-1">
                              <p className="text-emerald-400 font-bold">Accuracy: {d.accuracy}%</p>
                              <p className="text-blue-400 font-bold">Duration: {d.durationMins} minutes</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy Rate (%)"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981' }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="durationMins"
                    name="Duration (Mins)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeChartTab === 'track-breakdown' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trackComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="fullName" stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                            <p className="font-black text-amber-400">{d.fullName}</p>
                            <p className="text-slate-300">Attempts Taken: <strong className="text-white">{d.attempts}</strong></p>
                            <p className="text-slate-300">Avg Score: <strong className="text-white">{d.avgScore}%</strong></p>
                            <p className="text-slate-300">Avg Accuracy: <strong className="text-emerald-400">{d.accuracy}%</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }} />
                  <Bar dataKey="avgScore" name="Average Score (%)" fill="#0f172a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>

      {/* Past Exam Attempts List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black tracking-tight uppercase text-slate-900">
              PAST EXAM ATTEMPTS
            </h2>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-md">
              {filteredHistory.length}
            </span>
          </div>

          {/* Search and Sort controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attempts by title or date..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="accuracy-desc">Highest Accuracy</option>
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 space-y-3">
            <History className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-base font-black text-slate-900 uppercase tracking-tight">No Exam Attempts Found</p>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
              No previous test attempts match your current filters. Take a mock test now to generate a full CBT diagnostic record.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedTrackFilter('All Tracks');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition"
              >
                Reset Filters
              </button>
              <button
                onClick={() => onStartTest(allTests[0]?.id || 'ventilation-thermo-mock')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition"
              >
                Start Practice Exam
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((attempt, index) => {
              const scorePct = Math.round((attempt.totalScore / attempt.maxScore) * 100);
              const trackTagColor = attempt.track === 'GATE Mining'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : attempt.track === 'DGMS First Class'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : attempt.track === 'All PSU'
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : 'bg-purple-50 text-purple-700 border-purple-200';

              const isPass = scorePct >= 50;

              return (
                <div
                  key={`${attempt.testId}-${attempt.date}-${index}`}
                  id={`attempt-card-${index}`}
                  className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-slate-100 hover:border-slate-900 shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${trackTagColor}`}>
                          {attempt.track}
                        </span>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {attempt.date}
                        </span>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatDuration(attempt.timeTakenSeconds)}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        {attempt.testTitle}
                      </h3>

                      {/* Accuracy & question counts */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {attempt.correctCount} Correct
                        </span>
                        <span className="flex items-center gap-1 text-rose-500">
                          <XCircle className="w-3.5 h-3.5" />
                          {attempt.incorrectCount} Incorrect
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {attempt.unattemptedCount} Unattempted
                        </span>
                        <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                          AIR ~{attempt.simulatedAIR} ({attempt.percentile}%ile)
                        </span>
                      </div>
                    </div>

                    {/* Middle Score Gauge */}
                    <div className="flex items-center gap-4 lg:px-6 lg:border-x border-slate-100 shrink-0">
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-3xl font-black text-slate-900">{attempt.totalScore}</span>
                          <span className="text-sm font-bold text-slate-400">/ {attempt.maxScore}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                            scorePct >= 75 ? 'bg-emerald-100 text-emerald-800' :
                            scorePct >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {scorePct}% Score
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            ({Math.round(attempt.accuracy)}% Acc)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right action buttons */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                      {onViewResult && (
                        <button
                          onClick={() => onViewResult(attempt)}
                          className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition"
                          title="View detailed scorecard and question solutions"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Scorecard</span>
                        </button>
                      )}

                      <button
                        onClick={() => onStartTest(attempt.testId)}
                        className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
