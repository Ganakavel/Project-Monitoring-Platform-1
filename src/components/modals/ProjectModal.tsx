import React, { useState, useEffect } from 'react';
import { X, Check, FolderKanban } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectModal: React.FC = () => {
  const {
    isProjectModalOpen,
    setIsProjectModalOpen,
    editingProject,
    setEditingProject,
    addProject,
    updateProject,
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [progress, setProgress] = useState(50);
  const [status, setStatus] = useState<Project['status']>('active');
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [color, setColor] = useState('#3b82f6');
  const [budget, setBudget] = useState('$25,000');
  const [totalTasks, setTotalTasks] = useState(20);

  const colors = ['#3b82f6', '#6366f1', '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setCategory(editingProject.category);
      setProgress(editingProject.progress);
      setStatus(editingProject.status);
      setDueDate(editingProject.dueDate);
      setColor(editingProject.color);
      setBudget(editingProject.budget || '$25,000');
      setTotalTasks(editingProject.totalTasks);
    } else {
      setTitle('');
      setCategory('Web & Product');
      setProgress(25);
      setStatus('active');
      setDueDate('2026-09-30');
      setColor('#3b82f6');
      setBudget('$25,000');
      setTotalTasks(20);
    }
  }, [editingProject, isProjectModalOpen]);

  if (!isProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingProject) {
      updateProject(editingProject.id, {
        title: title.trim(),
        category,
        progress,
        status,
        dueDate,
        color,
        budget,
        totalTasks,
      });
    } else {
      addProject({
        title: title.trim(),
        category,
        progress,
        status,
        dueDate,
        teamCount: 4,
        totalTasks,
        color,
        budget,
        hoursTracked: 24,
      });
    }

    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={() => {
              setIsProjectModalOpen(false);
              setEditingProject(null);
            }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5" /> Project Portfolio
          </div>
          <h2 className="text-xl font-bold">
            {editingProject ? 'Edit Project' : 'New Project'}
          </h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Keep track of project health, milestones, and deliverable velocity.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Mobile App Redesign, Analytics Portal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Design & Dev"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Project['status'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Budget Allocation
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="$30,000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Color theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                    color === c ? 'ring-2 ring-slate-800 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Progress Slider */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Project Progress</span>
              <span className="font-bold text-blue-600">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsProjectModalOpen(false);
                setEditingProject(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
