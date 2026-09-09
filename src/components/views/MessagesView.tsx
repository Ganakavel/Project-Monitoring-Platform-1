import React, { useState } from 'react';
import { Send, Smile, Paperclip, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessagesView: React.FC = () => {
  const { teamMembers, chatMessages, sendChatMessage, profile } = useApp();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs h-[calc(100vh-140px)] flex overflow-hidden">
      {/* Members List */}
      <div className="w-72 border-r border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Channels & Direct</h3>
        </div>
        <div className="p-3 overflow-y-auto space-y-1">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="relative shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                    member.status === 'online'
                      ? 'bg-emerald-500'
                      : member.status === 'away'
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 truncate">{member.name}</h4>
                <p className="text-[11px] text-slate-400 truncate">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">#team-general</h4>
            <p className="text-[11px] text-slate-400">All hands workspace discussion</p>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {chatMessages.map((msg) => {
            const isMe = msg.isCurrentUser || msg.senderName === profile.name;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                )}
                <div className={`max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMe && (
                    <span className="text-[11px] font-semibold text-slate-600 mb-1">
                      {msg.senderName}
                    </span>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to the team..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
