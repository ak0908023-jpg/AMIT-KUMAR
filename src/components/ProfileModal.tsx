import React, { useState } from 'react';
import { X, User, Award, Flame, Target, BookMarked, CheckCircle2, RotateCcw } from 'lucide-react';
import { ExamTrack } from '../types';

interface ProfileModalProps {
  onClose: () => void;
  selectedTrack: ExamTrack;
  onSelectTrack: (track: ExamTrack) => void;
  onResetData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  selectedTrack,
  onSelectTrack,
  onResetData
}) => {
  const [userName, setUserName] = useState('Amit Kumar');
  const [targetAIR, setTargetAIR] = useState('Top 50 (AIR < 50)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-slate-800 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            AK
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{userName}</h2>
            <p className="text-xs text-slate-500 font-medium">Roll: MN-GATE-2026-9481 • Mining Engineering</p>
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Flame className="w-3.5 h-3.5 fill-emerald-600" />
              14 Day Active Streak
            </div>
          </div>
        </div>

        {/* Target Goals Form */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Primary Exam Track
            </label>
            <select
              value={selectedTrack}
              onChange={(e) => onSelectTrack(e.target.value as ExamTrack)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
            >
              <option value="GATE Mining">GATE Mining 2026</option>
              <option value="DGMS First Class">DGMS First / Second Class Manager</option>
              <option value="All PSU">All PSU (CIL, NMDC, NALCO, SCCL, MOIL)</option>
              <option value="Overman/Mate">Overman / Mining Sirdar / Gas Testing</option>
              <option value="All Tracks">All Exam Tracks</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Goal / Target Rank
            </label>
            <input
              type="text"
              value={targetAIR}
              onChange={(e) => setTargetAIR(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={onResetData}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Test Attempts
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow"
            >
              {savedSuccess ? 'Saved Successfully!' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
