import React from 'react';
import { MessageSquare, Sparkles, UserPlus, Trash2, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TeamView: React.FC = () => {
  const {
    teamMembers,
    profile,
    setIsChatOpen,
    setIsChatMinimized,
    setIsAddMemberModalOpen,
    deleteTeamMember,
  } = useApp();

  const activeOnlineCount = teamMembers.filter((m) => m.status === 'online').length;

  return (
    <div className="space-y-5 pb-12">
      {/* Header with Add Member Button */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">NexGen Creators Team Directory</h3>
          <p className="text-xs text-slate-400">
            {teamMembers.length} active contributors across engineering, product design, and creative direction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {activeOnlineCount} Online Now
          </span>

          <button
            onClick={() => setIsAddMemberModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/25 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member) => {
          const isCurrentUser = member.name === profile.name;
          return (
            <div
              key={member.id}
              className={`bg-white rounded-2xl p-5 border text-center flex flex-col items-center justify-between transition-all hover:shadow-md relative group ${
                isCurrentUser ? 'border-blue-300 ring-2 ring-blue-50' : 'border-slate-200/80'
              }`}
            >
              {/* Delete button (except for current user) */}
              {!isCurrentUser && (
                <button
                  onClick={() => {
                    if (window.confirm(`Remove ${member.name} from the team?`)) {
                      deleteTeamMember(member.id);
                    }
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Remove Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex flex-col items-center space-y-3 w-full">
                <div className="relative">
                  <img
                    src={isCurrentUser ? profile.avatar : member.avatar}
                    alt={isCurrentUser ? profile.name : member.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100 shadow-xs"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                      (isCurrentUser ? profile.status : member.status) === 'online'
                        ? 'bg-emerald-500'
                        : (isCurrentUser ? profile.status : member.status) === 'busy'
                        ? 'bg-rose-500'
                        : (isCurrentUser ? profile.status : member.status) === 'away'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-sm flex items-center justify-center gap-1">
                    {isCurrentUser ? profile.name : member.name}
                    {isCurrentUser && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded font-semibold">
                        You
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isCurrentUser ? profile.role : member.role}
                  </p>
                  {member.department && (
                    <span className="inline-block mt-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {member.department}
                    </span>
                  )}
                </div>

                <div className="w-full bg-slate-50 rounded-xl p-2.5 flex items-center justify-around text-xs">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">Status</span>
                    <span className="font-semibold text-slate-700 capitalize">
                      {isCurrentUser ? profile.status : member.status}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">Tasks</span>
                    <span className="font-semibold text-blue-600">
                      {member.activeTasks} active
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsChatOpen(true);
                    setIsChatMinimized(false);
                  }}
                  className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
