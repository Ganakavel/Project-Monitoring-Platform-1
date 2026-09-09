import React from 'react';
import { Check, Plus, ArrowRight, Trash2, Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

export const TodayTasksCard: React.FC = () => {
  const {
    tasks,
    toggleTaskCompletion,
    deleteTask,
    setActiveTab,
    setIsTaskModalOpen,
    setEditingTask,
    updateTaskProgress,
  } = useApp();

  // Tasks shown in today's section (first 5 or matching today/date)
  const todayTasks = tasks.slice(0, 5);

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const dayProgressPercent =
    todayTasks.length > 0
      ? Math.round((completedCount / todayTasks.length) * 100)
      : 0;

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

  const handleEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(id);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Header with Title, Day's Progress bar, and View All */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm shrink-0">Today's Tasks</h3>

            {/* Day's Progress bar */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                Day's Progress [{dayProgressPercent}%]
              </span>
              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${dayProgressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              title="Add Task"
              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 transition-colors group"
          >
            View All
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2.5">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTaskCompletion(task.id)}
              className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Custom Checkbox */}
                <div
                  className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                    task.completed
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'border-2 border-slate-300 group-hover:border-blue-400'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                {/* Task Title & Progress indicator */}
                <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-xs font-medium truncate ${
                      task.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    [{task.progress}% of this task completed]
                  </span>
                </div>
              </div>

              {/* Tag & Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden group-hover:flex items-center gap-1 mr-1">
                  {/* Quick percentage adjustment */}
                  <select
                    value={task.progress}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateTaskProgress(task.id, Number(e.target.value))
                    }
                    className="text-[10px] bg-white border border-slate-200 rounded px-1 py-0.5 text-slate-600 focus:outline-none"
                  >
                    <option value={20}>20%</option>
                    <option value={40}>40%</option>
                    <option value={60}>60%</option>
                    <option value={80}>80%</option>
                    <option value={100}>100%</option>
                  </select>

                  <button
                    onClick={(e) => handleEdit(task, e)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(task.id, e)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${getTagColor(
                    task.tag
                  )}`}
                >
                  {task.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
