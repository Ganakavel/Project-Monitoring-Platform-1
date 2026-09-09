import React, { useState } from 'react';
import { X, Check, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';

export const EventModal: React.FC = () => {
  const { isEventModalOpen, setIsEventModalOpen, addCalendarEvent, selectedDate } = useApp();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate || '2026-08-14');
  const [startTime, setStartTime] = useState('02:00 PM');
  const [endTime, setEndTime] = useState('03:00 PM');
  const [type, setType] = useState<CalendarEvent['type']>('meeting');
  const [color, setColor] = useState('#10b981');

  if (!isEventModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCalendarEvent({
      title: title.trim(),
      date,
      startTime,
      endTime,
      type,
      color,
    });

    setTitle('');
    setIsEventModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={() => setIsEventModalOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" /> Calendar Event
          </div>
          <h2 className="text-xl font-bold">Schedule Event</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Add team sync, client review, or milestone deadline.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              placeholder="e.g. Design critique, Sprint demo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="11:00 AM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const t = e.target.value as CalendarEvent['type'];
                  setType(t);
                  if (t === 'meeting') setColor('#10b981');
                  else if (t === 'review') setColor('#f59e0b');
                  else if (t === 'milestone') setColor('#8b5cf6');
                  else setColor('#3b82f6');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="meeting">Team Meeting</option>
                <option value="review">Design Review</option>
                <option value="milestone">Project Milestone</option>
                <option value="task">Task Deadline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Highlight Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEventModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              Schedule Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
