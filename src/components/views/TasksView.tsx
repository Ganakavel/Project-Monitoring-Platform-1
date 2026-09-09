import React, { useState } from 'react';
import {
  Check,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    toggleTaskCompletion,
    updateTaskProgress,
    deleteTask,
    setIsTaskModalOpen,
    setEditingTask,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'completed' | 'high_priority'>('all');
  const [taskSearch, setTaskSearch] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'in_progress' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (filterStatus === 'high_priority' && t.priority !== 'high' && t.priority !== 'urgent') return false;
    if (taskSearch) {
      return (
        t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        t.projectName?.toLowerCase().includes(taskSearch.toLowerCase()) ||
        t.tag.toLowerCase().includes(taskSearch.toLowerCase())
      );
    }
    return true;
  });

  const getTagColor = (tag: Task['tag']) => {
    switch (tag) {
      case 'Design':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Meeting':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Review':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Finance':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Done':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Development':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'high':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'medium':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'low':
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'high_priority', label: 'High Priority' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as typeof filterStatus)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === f.id
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search & Add */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-2xl p-4 border transition-all hover:shadow-md flex flex-col justify-between ${
              task.completed ? 'border-emerald-200/80 bg-emerald-50/20' : 'border-slate-200/80'
            }`}
          >
            <div className="space-y-3">
              {/* Top Meta */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTagColor(task.tag)}`}>
                  {task.tag}
                </span>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              {/* Title & Checkbox */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                    task.completed
                      ? 'bg-blue-600 text-white'
                      : 'border-2 border-slate-300 hover:border-blue-500'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div>
                  <h4 className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{task.projectName}</p>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold text-blue-600">{task.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Calendar className="w-3 h-3" />
                <span>{task.dueDate}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Delete task"
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
