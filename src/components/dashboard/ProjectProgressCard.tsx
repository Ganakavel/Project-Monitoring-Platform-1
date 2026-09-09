import React from 'react';
import {
  Globe,
  Layout,
  Megaphone,
  Smartphone,
  Shield,
  Plus,
  ArrowRight,
  Edit2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectProgressCard: React.FC = () => {
  const {
    projects,
    setActiveTab,
    setIsProjectModalOpen,
    setEditingProject,
    updateProject,
  } = useApp();

  const getProjectIcon = (title: string, color: string) => {
    const lower = title.toLowerCase();
    const style = { color };
    if (lower.includes('website') || lower.includes('web')) return <Globe className="w-4 h-4" style={style} />;
    if (lower.includes('crm') || lower.includes('dashboard')) return <Layout className="w-4 h-4" style={style} />;
    if (lower.includes('marketing')) return <Megaphone className="w-4 h-4" style={style} />;
    if (lower.includes('mobile') || lower.includes('app')) return <Smartphone className="w-4 h-4" style={style} />;
    return <Shield className="w-4 h-4" style={style} />;
  };

  const getIconBg = (color: string) => {
    return `${color}15`; // 15% opacity hex
  };

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSliderChange = (project: Project, newProgress: number) => {
    updateProject(project.id, {
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : 'active',
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-sm">Project Progress</h3>
            <button
              onClick={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              title="Add Project"
              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors group"
          >
            View All
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="space-y-4">
          {projects.slice(0, 5).map((project) => (
            <div key={project.id} className="group/item">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: getIconBg(project.color) }}
                  >
                    {getProjectIcon(project.title, project.color)}
                  </div>
                  <span className="font-medium text-slate-700 truncate group-hover/item:text-blue-600 transition-colors">
                    {project.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleEdit(project, e)}
                    className="opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 transition-opacity"
                    title="Edit project"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-slate-800 text-xs w-9 text-right">
                    {project.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar with interactive slider support on hover */}
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${project.progress}%`,
                    backgroundColor: project.color || '#2563eb',
                  }}
                />
              </div>

              {/* Subtle hover progress adjuster */}
              <div className="hidden group-hover/item:flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                <span>Quick adjust:</span>
                {[25, 50, 75, 100].map((step) => (
                  <button
                    key={step}
                    onClick={() => handleSliderChange(project, step)}
                    className={`px-1 rounded hover:bg-blue-50 hover:text-blue-600 font-medium ${
                      project.progress === step ? 'text-blue-600 font-bold' : ''
                    }`}
                  >
                    {step}%
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
