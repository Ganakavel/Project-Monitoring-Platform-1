import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, Tag, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority } from '../../types';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    addTask,
    updateTask,
    projects,
    teamMembers,
    selectedDate,
  } = useApp();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [tag, setTag] = useState<Task['tag']>('Design');
  const [dueDate, setDueDate] = useState(selectedDate || '2026-08-14');
  const [time, setTime] = useState('11:00 AM');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedTo, setAssignedTo] = useState('Alex Johnson');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setProjectId(editingTask.projectId);
      setProgress(editingTask.progress);
      setCompleted(editingTask.completed);
      setTag(editingTask.tag);
      setDueDate(editingTask.dueDate);
      setTime(editingTask.time || '11:00 AM');
      setPriority(editingTask.priority);
      setAssignedTo(editingTask.assignedTo || 'Alex Johnson');
    } else {
      setTitle('');
      setProjectId(projects[0]?.id || 'proj-1');
      setProgress(0);
      setCompleted(false);
      setTag('Design');
      setDueDate(selectedDate || '2026-08-14');
      setTime('11:00 AM');
      setPriority('medium');
      setAssignedTo('Alex Johnson');
    }
  }, [editingTask, isTaskModalOpen, projects, selectedDate]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedProject = projects.find((p) => p.id === projectId);
    const matchedMember = teamMembers.find((m) => m.name === assignedTo);

    const taskData: Omit<Task, 'id'> = {
      title: title.trim(),
      projectId,
      projectName: matchedProject?.title || 'General',
      progress,
      completed,
      tag,
      dueDate,
      time,
      priority,
      assignedTo,
      assignedAvatar: matchedMember?.avatar,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
            Real-Time Task Management
          </div>
          <h2 className="text-xl font-bold">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Synchronizes instantly with your calendar, progress cards, and stats.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Name / Deliverable
            </label>
            <input
              type="text"
              placeholder="e.g. Design Homepage, Review Prototype..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Project & Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" /> Category Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as Task['tag'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Design">Design</option>
                <option value="Meeting">Meeting</option>
                <option value="Review">Review</option>
                <option value="Finance">Finance</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Scheduled Time
              </label>
              <input
                type="text"
                placeholder="11:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Priority & Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-slate-400" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assignee
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Completion Progress</span>
              <span className="font-bold text-blue-600">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => {
                const val = Number(e.target.value);
                setProgress(val);
                setCompleted(val === 100);
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => {
                    const isDone = e.target.checked;
                    setCompleted(isDone);
                    setProgress(isDone ? 100 : (progress === 100 ? 40 : progress));
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Mark task as completed
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsTaskModalOpen(false);
                setEditingTask(null);
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
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
