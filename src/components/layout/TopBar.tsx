import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  Check,
  Sparkles,
  X,
  FolderKanban,
  CheckSquare,
  FileText,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar: React.FC = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    searchResults,
    setIsProfileModalOpen,
    isChatOpen,
    setIsChatOpen,
    setIsChatMinimized,
    notifications,
    markAllNotificationsRead,
    setEditingTask,
    setIsTaskModalOpen,
    isOnline,
    toggleOnlineStatus,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalMatches =
    searchResults.tasks.length +
    searchResults.projects.length +
    searchResults.documents.length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview';
      case 'projects':
        return 'Projects Portfolio';
      case 'tasks':
        return 'Task Manager';
      case 'calendar':
        return 'Real-Time Calendar';
      case 'analytics':
        return 'Productivity Analytics';
      case 'documents':
        return 'Documents & Assets';
      case 'messages':
        return 'Team Messages';
      case 'team':
        return 'Team Directory';
      case 'settings':
        return 'Settings & Profile';
      default:
        return 'Overview';
    }
  };

  const getPageSubtitle = () => {
    const firstName = profile.name.split(' ')[0] || 'there';
    switch (activeTab) {
      case 'overview':
        return `Welcome back, ${firstName}. Here's today's productivity overview`;
      case 'projects':
        return 'Monitor project velocity, team workloads, and release deadlines';
      case 'tasks':
        return 'Track daily deliverables, priority items, and completion rates';
      case 'calendar':
        return 'Interactive schedule with real-time sync across tasks and events';
      case 'analytics':
        return 'Deep insights into time tracking, completion velocity, and burn-down';
      case 'documents':
        return 'Upload, preview, and manage project specifications and deliverables';
      default:
        return `Welcome back, ${firstName}`;
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Title & dynamic greeting */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          {getPageTitle()}
          {activeTab === 'overview' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
              <Sparkles className="w-3 h-3" /> Live
            </span>
          )}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{getPageSubtitle()}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Network Status Indicator */}
        <button
          onClick={toggleOnlineStatus}
          title={`Click to simulate ${isOnline ? 'offline' : 'online'} mode`}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
        >
          {isOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span>Online</span>
            </>
          ) : (
            <>
              <span className="inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              <WifiOff className="w-3 h-3 text-rose-600" />
              <span>Offline</span>
            </>
          )}
        </button>

        {/* Search Bar with live floating results dropdown */}
        <div className="relative" ref={searchContainerRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, projects, docs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              className="w-72 pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-[440px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-semibold text-slate-500">
                <span>Search Results</span>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {totalMatches} found
                </span>
              </div>

              {totalMatches === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No matches found for "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Tasks results */}
                  {searchResults.tasks.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-blue-500" />
                        Tasks ({searchResults.tasks.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.tasks.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            onClick={() => {
                              setEditingTask(task);
                              setIsTaskModalOpen(true);
                              setIsSearchFocused(false);
                            }}
                            className="p-2 rounded-xl hover:bg-blue-50/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate">
                                {task.title}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {task.projectName} • {task.progress}% done
                              </p>
                            </div>
                            <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded shrink-0">
                              {task.tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects results */}
                  {searchResults.projects.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <FolderKanban className="w-3 h-3 text-indigo-500" />
                        Projects ({searchResults.projects.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.projects.slice(0, 3).map((proj) => (
                          <div
                            key={proj.id}
                            onClick={() => {
                              setActiveTab('projects');
                              setIsSearchFocused(false);
                            }}
                            className="p-2 rounded-xl hover:bg-indigo-50/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate">
                                {proj.title}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {proj.category} • {proj.progress}%
                              </p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">
                              {proj.progress}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents results */}
                  {searchResults.documents.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-emerald-500" />
                        Documents ({searchResults.documents.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.documents.slice(0, 3).map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() => {
                              setActiveTab('documents');
                              setIsSearchFocused(false);
                            }}
                            className="p-2 rounded-xl hover:bg-emerald-50/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate">
                                {doc.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {doc.size} • {doc.uploadedBy}
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">
                              {doc.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                      n.read ? 'text-slate-500 hover:bg-slate-50' : 'bg-blue-50/70 text-slate-800 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages Button (Toggles Chat) */}
        <button
          onClick={() => {
            setIsChatOpen(true);
            setIsChatMinimized(false);
          }}
          className={`w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center transition-colors ${
            isChatOpen
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          title="Toggle Team Chat"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center transition-colors ${
            activeTab === 'settings'
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Avatar Quick Trigger */}
        <button
          onClick={() => setIsProfileModalOpen(true)}
          title="Open Profile Settings"
          className="relative group ml-1"
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-500 transition-all"
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
        </button>
      </div>
    </header>
  );
};
