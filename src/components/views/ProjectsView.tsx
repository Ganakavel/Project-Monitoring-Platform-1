import React from 'react';
import { Plus, Edit2, Trash2, Clock, Users, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    setIsProjectModalOpen,
    setEditingProject,
    deleteProject,
    updateProject,
  } = useApp();

  const handleEdit = (proj: Project) => {
    setEditingProject(proj);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top action bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Active Projects Portfolio</h3>
          <p className="text-xs text-slate-400">Manage deliverables, team capacity, and schedules</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsProjectModalOpen(true);
          }}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {proj.category}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    proj.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-600'
                      : proj.status === 'in_review'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {proj.status.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Progress */}
              <div>
                <h4 className="text-base font-bold text-slate-800">{proj.title}</h4>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Completion</span>
                    <span className="font-bold text-slate-800">{proj.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${proj.progress}%`,
                        backgroundColor: proj.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Meta stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400">Tasks</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    {proj.completedTasks}/{proj.totalTasks}
                  </p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400">Team</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5 flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    {proj.teamCount}
                  </p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400">Budget</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{proj.budget || '$20k'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Due: {proj.dueDate}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(proj)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Edit project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Archive project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
