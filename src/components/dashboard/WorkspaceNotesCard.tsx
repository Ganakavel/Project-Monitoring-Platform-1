import React, { useState } from 'react';
import { Pin, Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkspaceNote } from '../../types';

export const WorkspaceNotesCard: React.FC = () => {
  const { notes, addNote, deleteNote } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState<WorkspaceNote['color']>('blue');

  const getColorStyles = (color: WorkspaceNote['color']) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50/90 text-blue-900 border-blue-200/80';
      case 'green':
        return 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80';
      case 'yellow':
        return 'bg-amber-50/90 text-amber-900 border-amber-200/80';
      case 'purple':
        return 'bg-purple-50/90 text-purple-900 border-purple-200/80';
      case 'pink':
        return 'bg-pink-50/90 text-pink-900 border-pink-200/80';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getPinColor = (color: WorkspaceNote['color']) => {
    switch (color) {
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-emerald-500';
      case 'yellow':
        return 'text-amber-500';
      default:
        return 'text-slate-400';
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote(newNoteText.trim(), selectedColor);
    setNewNoteText('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Header with Title and Add Button */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm">Workspace Notes</h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            title="Add sticky note"
            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Note input form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="mb-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <input
              type="text"
              placeholder="e.g. Wireframe sign up flow"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {(['blue', 'green', 'yellow'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      c === 'blue'
                        ? 'bg-blue-400'
                        : c === 'green'
                        ? 'bg-emerald-400'
                        : 'bg-amber-400'
                    } ${selectedColor === c ? 'ring-2 ring-slate-700' : ''}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-0.5 text-[11px] bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Sticky Notes List */}
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all group ${getColorStyles(
                note.color
              )}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Pin className={`w-3.5 h-3.5 shrink-0 ${getPinColor(note.color)}`} />
                <span className="text-xs font-medium truncate">{note.text}</span>
              </div>

              <button
                onClick={() => deleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-opacity"
                title="Delete note"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
