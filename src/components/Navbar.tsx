import React, { useState } from 'react';
import { Bell, Smartphone, Monitor, CheckCircle, Sparkles, X } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'analytics' | 'statutory' | 'profile';
  onOpenProfile: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenProfile,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New Mock Test Added', desc: 'NALCO MT Mock 1 is now live with updated syllabus.', time: '1h ago', unread: true },
    { id: 2, title: 'Daily Streak Maintained', desc: 'You completed 14 consecutive days of practice!', time: '1d ago', unread: false },
    { id: 3, title: 'GATE Mining Update', desc: 'Added 8 new advanced NATs with virtual calculator.', time: '2d ago', unread: false }
  ];

  const getTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'Dashboard';
      case 'analytics':
        return 'Analytics & Performance';
      case 'statutory':
        return 'Statutory Revision (CMR 2017)';
      case 'profile':
        return 'Candidate Profile';
      default:
        return 'Mining Exam Prep';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-xs">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.29a2 2 0 01-1.566.012l-.306-.135a6 6 0 00-4.377-.033l-2.356.916a2 2 0 00-1.141 1.138L3 20a2 2 0 002 2h14a2 2 0 002-2l-.572-4.572zM12 11V3m0 0l-3 3m3-3l3 3"></path>
            </svg>
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-slate-900 block leading-none">
              MINING.PREP
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mt-1 block">
              {getTitle()}
            </span>
          </div>
        </div>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-4">
          {/* Mobile frame toggle */}
          <button
            onClick={onToggleMobileFrame}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-200 text-xs font-black text-slate-900 hover:border-slate-900 transition-colors uppercase tracking-wider"
            title="Toggle Flutter Mobile Smartphone Frame View"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Frame</span>
              </>
            )}
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1.5 right-1.5 border-2 border-white"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border-2 border-slate-100 py-3 z-50 animate-in fade-in zoom-in duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Notifications</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3.5 text-xs hover:bg-slate-50 ${n.unread ? 'bg-slate-50/80' : ''}`}>
                      <div className="font-black text-slate-900 flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
                      </div>
                      <p className="text-slate-500 mt-1 font-medium leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <button
            id="btn-profile-avatar"
            onClick={onOpenProfile}
            className="flex items-center gap-3 pl-4 border-l border-slate-200 group text-left hover:opacity-90 transition"
            title="Candidate Profile"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-slate-900 leading-none group-hover:text-slate-700">Amit Sharma</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">Aspirant #9421</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-black text-slate-800 text-sm shadow-xs group-hover:border-slate-900 transition-colors">
              AS
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
