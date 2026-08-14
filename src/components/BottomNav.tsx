import React from 'react';
import { LayoutDashboard, BarChart3, ShieldCheck, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'analytics' | 'statutory' | 'profile';
  onSelectTab: (tab: 'home' | 'analytics' | 'statutory' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
    { id: 'statutory', label: 'STATUTORY', icon: ShieldCheck },
    { id: 'profile', label: 'PROFILE', icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 h-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto flex items-center justify-around px-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-slate-900 font-black'
                  : 'text-slate-400 hover:text-slate-700 font-bold'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-wider font-black">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
