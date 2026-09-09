import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon?: React.ReactNode;
  radialProgress?: number; // 0 - 100 for circular gauge
  isPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  radialProgress,
}) => {
  // If radial progress is given (like Tasks Completed 78%)
  if (radialProgress !== undefined) {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (radialProgress / 100) * circumference;

    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all">
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-14 h-14 -rotate-90">
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="4.5"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="#2563eb"
              strokeWidth="4.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <span className="absolute text-xs font-bold text-slate-800">
            {radialProgress}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">{value}</h3>
          <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 truncate">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">{value}</h3>
        <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </p>
      </div>
    </div>
  );
};
