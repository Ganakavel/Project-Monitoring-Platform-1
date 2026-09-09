import React from 'react';
import { ProductivityAnalyticsCard } from '../dashboard/ProductivityAnalyticsCard';
import { BarChart3, TrendingUp, Clock, Target, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { projects, tasks } = useApp();

  return (
    <div className="space-y-5 pb-12">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Overall Velocity</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">92.4%</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+6.2% vs target pace</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Logged Hours</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">132.5 hrs</h3>
          <p className="text-[11px] text-slate-500 mt-1">Across 6 active projects</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">78%</h3>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">156 of 200 deliverables done</p>
        </div>
      </div>

      {/* Main Graph */}
      <ProductivityAnalyticsCard />

      {/* Breakdown per project */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-800 text-sm mb-4">Project Velocity Breakdown</h3>
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{proj.title}</span>
                <span className="text-slate-500 font-medium">
                  {proj.hoursTracked || 24} hrs tracked • {proj.progress}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${proj.progress}%`, backgroundColor: proj.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
