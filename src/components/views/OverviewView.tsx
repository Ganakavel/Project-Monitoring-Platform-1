import React from 'react';
import { Folder, Clock, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../dashboard/StatCard';
import { ProjectProgressCard } from '../dashboard/ProjectProgressCard';
import { ProductivityAnalyticsCard } from '../dashboard/ProductivityAnalyticsCard';
import { TodayTasksCard } from '../dashboard/TodayTasksCard';
import { CalendarWidget } from '../dashboard/CalendarWidget';
import { RecentActivityCard } from '../dashboard/RecentActivityCard';
import { WorkspaceNotesCard } from '../dashboard/WorkspaceNotesCard';

export const OverviewView: React.FC = () => {
  const { projects, tasks, teamMembers } = useApp();

  // Dynamically calculate KPIs based on live tasks & projects
  const activeProjectsCount = projects.filter((p) => p.status === 'active').length;
  const totalProjectsCount = projects.length;
  const onlineMembersCount = teamMembers.filter((m) => m.status === 'online').length;

  // Real-time task completion
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const radialProgress = totalTasksCount > 0
    ? Math.round((completedTasksCount / totalTasksCount) * 100)
    : 0;

  const totalHoursDecimal = projects.reduce((s, p) => s + (p.hoursTracked || 0), 0);
  const hoursDisplay = (() => {
    const h = Math.floor(totalHoursDecimal);
    const m = Math.round((totalHoursDecimal - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  })();

  return (
    <div className="space-y-5 pb-12">
      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Projects */}
        <StatCard
          title="Active Projects"
          value={`${activeProjectsCount} / ${totalProjectsCount}`}
          trend={`${totalProjectsCount - activeProjectsCount} completed`}
          icon={
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Folder className="w-5 h-5 fill-blue-600/20" />
            </div>
          }
        />

        {/* Tasks Completed (with radial ring) */}
        <StatCard
          title="Tasks Completed"
          value={`${completedTasksCount} / ${totalTasksCount}`}
          trend={`${radialProgress}% completion rate`}
          radialProgress={radialProgress}
        />

        {/* Hours Tracked — live h + m */}
        <StatCard
          title="Hours Tracked"
          value={hoursDisplay}
          trend={`${Math.floor(totalHoursDecimal)}h ${Math.round((totalHoursDecimal % 1) * 60)}m logged`}
          icon={
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5 fill-amber-600/20" />
            </div>
          }
        />

        {/* Team Members — real-time */}
        <StatCard
          title="Team Members"
          value={teamMembers.length}
          trend={`${onlineMembersCount} online now`}
          icon={
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 fill-purple-600/20" />
            </div>
          }
        />
      </div>

      {/* Row 2: Project Progress & Productivity Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProjectProgressCard />
        <ProductivityAnalyticsCard />
      </div>

      {/* Row 3: Today's Tasks, Calendar Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodayTasksCard />
        <CalendarWidget />
      </div>

      {/* Row 4: Recent Activity & Workspace Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivityCard />
        <WorkspaceNotesCard />
      </div>
    </div>
  );
};
