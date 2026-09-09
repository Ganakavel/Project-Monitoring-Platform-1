import React from 'react';
import { useApp } from '../../context/AppContext';

export const RecentActivityCard: React.FC = () => {
  const { activities } = useApp();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm">Recent Activity</h3>
          <span className="text-[11px] font-medium text-slate-400">Live stream</span>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between gap-2 text-xs py-0.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={act.userAvatar}
                  alt={act.user}
                  className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-100"
                />
                <div className="min-w-0 truncate text-slate-600">
                  <span className="font-semibold text-slate-800 mr-1">{act.user}</span>
                  <span className="text-slate-500 mr-1">{act.action}</span>
                  <span className="font-medium text-slate-700">{act.target}</span>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
