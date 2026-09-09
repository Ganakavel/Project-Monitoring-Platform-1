import React, { useState, useEffect } from 'react';
import { X, Check, FolderKanban, Users, UserCheck } from 'lucide-react';
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
    teamMembers,
  } = useApp();

  const [title, setTitle]         = useState('');
  const [category, setCategory]   = useState('Web & Product');
  const [progress, setProgress]   = useState(25);
  const [status, setStatus]       = useState<Project['status']>('active');
  const [dueDate, setDueDate]     = useState('2026-09-30');
  const [color, setColor]         = useState('#3b82f6');
  const [budget, setBudget]       = useState('$25,000');
  const [totalTasks, setTotalTasks] = useState(20);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

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
      setSelectedMemberIds(editingProject.memberIds || []);
    } else {
      setTitle('');
      setCategory('Web & Product');
      setProgress(25);
      setStatus('active');
      setDueDate('2026-09-30');
      setColor('#3b82f6');
      setBudget('$25,000');
      setTotalTasks(20);
      setSelectedMemberIds([]);
    }
  }, [editingProject, isProjectModalOpen]);

  if (!isProjectModalOpen) return null;

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      category,
      progress,
      status,
      dueDate,
      color,
      budget,
      totalTasks,
      teamCount: selectedMemberIds.length || 1,
      memberIds: selectedMemberIds,
    };

    if (editingProject) {
      updateProject(editingProject.id, payload);
    } else {
      addProject({ ...payload, hoursTracked: 0 });
    }

    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const statusColors: Record<Project['status'], string> = {
    active: 'bg-emerald-100 text-emerald-700',
    in_review: 'bg-blue-100 text-blue-700',
    completed: 'bg-slate-100 text-slate-600',
    on_hold: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative shrink-0">
          <button
            onClick={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5" /> Project Portfolio
          </div>
          <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'New Project'}</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Track milestones, assign members, and monitor deliverable velocity.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Mobile App Redesign, Analytics Portal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Design & Dev"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
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

          {/* Due Date + Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Deadline</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Budget</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="$30,000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* ── Assign Team Members ── */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              Assign Team Members
              {selectedMemberIds.length > 0 && (
                <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {selectedMemberIds.length} selected
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {teamMembers.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-1 ring-white ${
                        member.status === 'online' ? 'bg-emerald-500' :
                        member.status === 'busy' ? 'bg-rose-500' :
                        member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                        {member.name.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                    </div>
                    {isSelected && (
                      <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected member avatars preview */}
            {selectedMemberIds.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {selectedMemberIds.slice(0, 6).map((id) => {
                    const m = teamMembers.find((t) => t.id === id);
                    return m ? (
                      <img
                        key={id}
                        src={m.avatar}
                        alt={m.name}
                        title={m.name}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                      />
                    ) : null;
                  })}
                  {selectedMemberIds.length > 6 && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-blue-600">
                      +{selectedMemberIds.length - 6}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">
                  {selectedMemberIds.length} member{selectedMemberIds.length !== 1 ? 's' : ''} assigned
                </span>
              </div>
            )}
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Accent Color</label>
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
            <div className="relative">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, backgroundColor: color }}
                />
              </div>
              <input
                type="range"
                min="0" max="100" step="1"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>

          {/* Total Tasks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Tasks</label>
              <input
                type="number"
                min="1"
                value={totalTasks}
                onChange={(e) => setTotalTasks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Preview</label>
              <div className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize ${statusColors[status]}`}>
                {status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
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
