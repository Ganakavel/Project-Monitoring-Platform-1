import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CalendarWidget: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    todayDateStr,
    jumpToToday,
    tasks,
    calendarEvents,
    setActiveTab,
    setIsEventModalOpen,
  } = useApp();

  // Parse today's year and month
  const todayObj = new Date();
  const [currentYear, setCurrentYear] = useState(todayObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayObj.getMonth()); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  const handleJumpToToday = () => {
    setCurrentYear(todayObj.getFullYear());
    setCurrentMonth(todayObj.getMonth());
    jumpToToday();
  };

  // Generate day matrix
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays: Array<{
    dayNumber: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }> = [];

  // Previous month trailing days
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

  // Current month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    calendarDays.push({
      dayNumber: i,
      isCurrentMonth: true,
      dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    });
  }

  // Next month leading days (to fill 35 or 42 grid)
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

  // Check if date has tasks or events
  const hasItemsOnDate = (dateStr: string) => {
    const hasTask = tasks.some((t) => t.dueDate === dateStr);
    const hasEvt = calendarEvents.some((e) => e.date === dateStr);
    return hasTask || hasEvt;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Header with Title, Today button, & Navigation */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-sm">Calendar</h3>
            <button
              onClick={handleJumpToToday}
              className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md border border-blue-200 transition-colors flex items-center gap-1"
              title="Focus on Today"
            >
              <Sparkles className="w-2.5 h-2.5" /> Today
            </button>
            <button
              onClick={() => setIsEventModalOpen(true)}
              title="Add event/deadline"
              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
              <button
                onClick={prevMonth}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="min-w-[84px] text-center text-xs">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              title="Full Calendar"
              className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center mb-1">
          {daysOfWeek.map((day) => (
            <span
              key={day}
              className="text-[10px] font-semibold text-slate-400 py-1"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid with TODAY prominently pointed out */}
        <div className="grid grid-cols-7 gap-y-1 text-center select-none">
          {calendarDays.map((day, idx) => {
            const isSelected = selectedDate === day.dateStr;
            const isToday = day.dateStr === todayDateStr;
            const hasDots = hasItemsOnDate(day.dateStr);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day.dateStr)}
                className="relative flex flex-col items-center justify-center py-1 cursor-pointer group"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all relative ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                      : isToday
                      ? 'border-2 border-blue-600 text-blue-600 font-extrabold bg-blue-50/60 shadow-xs'
                      : day.isCurrentMonth
                      ? 'text-slate-700 font-medium group-hover:bg-slate-100'
                      : 'text-slate-300 font-normal group-hover:bg-slate-50'
                  }`}
                >
                  {day.dayNumber}

                  {/* Today subtle pulse badge */}
                  {isToday && !isSelected && (
                    <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-blue-600 rounded-full ring-1 ring-white" />
                  )}
                </div>

                {/* Event indicator dot */}
                {hasDots && !isSelected && (
                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-0.5" />
                )}

                {/* Tiny Today label underneath if not selected */}
                {isToday && (
                  <span className="text-[8px] font-black uppercase text-blue-600 tracking-tighter -mt-0.5">
                    Today
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
