import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CalendarView: React.FC = () => {
  const {
    tasks,
    calendarEvents,
    selectedDate,
    setSelectedDate,
    todayDateStr,
    jumpToToday,
    setIsEventModalOpen,
    setIsTaskModalOpen,
    setEditingTask,
    toggleTaskCompletion,
  } = useApp();

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // August = 7
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<string>('all');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Days grid
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays: Array<{
    dayNumber: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }> = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const m = currentMonth === 0 ? 12 : currentMonth;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarDays.push({
      dayNumber: day,
      isCurrentMonth: false,
      dateStr: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    calendarDays.push({
      dayNumber: i,
      isCurrentMonth: true,
      dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    });
  }

  const remaining = 35 - calendarDays.length;
  if (remaining > 0) {
    for (let i = 1; i <= remaining; i++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      calendarDays.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateStr: `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }
  }

  // Get items for date
  const getItemsForDate = (dateStr: string) => {
    const dateTasks = tasks
      .filter((t) => t.dueDate === dateStr)
      .map((t) => ({
        id: t.id,
        title: t.title,
        type: 'task' as const,
        color: t.completed ? '#10b981' : '#3b82f6',
        time: t.time || '10:00 AM',
        isTask: true,
        task: t,
      }));

    const dateEvents = calendarEvents
      .filter((e) => e.date === dateStr)
      .map((e) => ({
        id: e.id,
        title: e.title,
        type: e.type,
        color: e.color,
        time: e.startTime || 'All day',
        isTask: false,
        task: undefined,
      }));

    const combined = [...dateTasks, ...dateEvents];
    if (filterType === 'all') return combined;
    return combined.filter((item) => item.type === filterType);
  };

  const selectedDateItems = getItemsForDate(selectedDate);

  return (
    <div className="space-y-5 pb-12">
      {/* Calendar Header Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 text-sm px-3 min-w-[140px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              const now = new Date();
              setCurrentMonth(now.getMonth());
              setCurrentYear(now.getFullYear());
              jumpToToday();
            }}
            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Today
          </button>
        </div>

        {/* View Mode and Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['month', 'week', 'agenda'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Filter Type */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Items</option>
              <option value="task">Tasks</option>
              <option value="meeting">Meetings</option>
              <option value="review">Reviews</option>
              <option value="milestone">Milestones</option>
            </select>
          </div>

          <button
            onClick={() => setIsEventModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Large Grid (3 cols on desktop) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {daysOfWeek.map((d) => (
              <div
                key={d}
                className="py-2.5 text-center text-xs font-semibold text-slate-500 tracking-wide"
              >
                <span className="hidden sm:inline">{d}</span>
                <span className="sm:hidden">{d.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Days Matrix */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            {calendarDays.map((day, idx) => {
              const isSelected = selectedDate === day.dateStr;
              const isToday = day.dateStr === todayDateStr;
              const items = getItemsForDate(day.dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`min-h-[105px] p-2 transition-all cursor-pointer flex flex-col justify-between group relative ${
                    isSelected
                      ? 'bg-blue-50/40 ring-2 ring-blue-600 ring-inset'
                      : isToday
                      ? 'bg-blue-50/25 ring-2 ring-blue-400 ring-inset'
                      : day.isCurrentMonth
                      ? 'hover:bg-slate-50/80'
                      : 'bg-slate-50/40 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : isToday
                            ? 'bg-blue-600 text-white shadow-xs'
                            : day.isCurrentMonth
                            ? 'text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {day.dayNumber}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.2 rounded-full shadow-xs">
                          Today
                        </span>
                      )}
                    </div>

                    {items.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </div>

                  {/* Badges preview */}
                  <div className="space-y-1 overflow-hidden flex-1">
                    {items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.task) {
                            setEditingTask(item.task);
                            setIsTaskModalOpen(true);
                          }
                        }}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded truncate flex items-center gap-1 transition-transform hover:scale-102"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                          borderLeft: `2.5px solid ${item.color}`,
                        }}
                        title={`${item.title} (${item.time})`}
                      >
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}
                    {items.length > 2 && (
                      <div className="text-[9px] text-slate-400 font-semibold px-1">
                        +{items.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {selectedDate}
                </h3>
                <p className="text-xs text-slate-400">Schedule & Deliverables</p>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                title="Add task for this date"
                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedDateItems.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium">No items scheduled</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click + to add a task or event</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
                {selectedDateItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>

                    {item.task && (
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-slate-500">
                          Progress: <b className="text-blue-600">{item.task.progress}%</b>
                        </span>
                        <button
                          onClick={() => toggleTaskCompletion(item.task!.id)}
                          className={`flex items-center gap-1 font-semibold ${
                            item.task.completed
                              ? 'text-emerald-600'
                              : 'text-slate-400 hover:text-emerald-600'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {item.task.completed ? 'Done' : 'Mark done'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
