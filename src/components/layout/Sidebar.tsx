import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  BarChart3,
  FileText,
  MessageSquare,
  Users,
  Settings,
  Rocket,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, profile, setIsProfileModalOpen, signOut } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 select-none shrink-0 z-20">
      {/* Top section */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/25">
            NC
          </div>
          <div>
            <span className="font-bold text-slate-800 text-base tracking-tight block">NexGen Creators</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block -mt-1">Studio Platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="space-y-4 pt-4">
        {/* Upgrade Plan Card */}
        <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/80 border border-blue-100/80 rounded-2xl p-4 text-center">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2.5">
            <Rocket className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-slate-800 text-sm">Upgrade Plan</h4>
          <p className="text-xs text-slate-500 mt-0.5 mb-3">Unlock premium features & insights</p>
          <button
            onClick={() => alert('Upgrade to Pro feature: Unlimited projects, automated AI reports & team seats!')}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade Now
          </button>
        </div>

        {/* User Profile Pill */}
        <button
          onClick={() => setIsProfileModalOpen(true)}
          title="Click to edit profile"
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all text-left group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  profile.status === 'online'
                    ? 'bg-emerald-500'
                    : profile.status === 'busy'
                    ? 'bg-rose-500'
                    : profile.status === 'away'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                {profile.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{profile.role}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
        </button>

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
