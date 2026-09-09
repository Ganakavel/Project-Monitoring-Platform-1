import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X,
  Smile,
  Paperclip,
  Send,
  FileText,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatAttachment } from '../../types';

export const TeamChatWidget: React.FC = () => {
  const {
    teamMembers,
    chatMessages,
    sendChatMessage,
    uploadDocument,
    isChatOpen,
    setIsChatOpen,
    isChatMinimized,
    setIsChatMinimized,
    profile,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['👍', '🚀', '🎉', '🔥', '✅', '👏', '🙌', '💡'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen && !isChatMinimized) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen, isChatMinimized]);

  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeInMB = file.size / (1024 * 1024);
      const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
      const url = URL.createObjectURL(file);
      
      setPendingAttachment({
        name: file.name,
        size: sizeStr,
        url,
        type: file.name.split('.').pop() || 'file',
      });

      // Also register into Documents view
      await uploadDocument(file, 'Chat Attachments');
      e.target.value = '';
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !pendingAttachment) return;
    sendChatMessage(inputMessage, pendingAttachment || undefined);
    setInputMessage('');
    setPendingAttachment(null);
    setShowEmojiPicker(false);
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={() => {
          setIsChatOpen(true);
          setIsChatMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3.5 shadow-lg shadow-blue-500/30 flex items-center gap-2 font-medium text-xs transition-all hover:scale-105"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Team Chat</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${
        isChatMinimized ? 'h-13' : 'h-[520px]'
      }`}
    >
      {/* Hidden file input for attachment */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilePicked}
        className="hidden"
      />

      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="font-bold text-xs tracking-tight">Team Chat</span>
          <span className="text-[10px] bg-blue-500/80 px-1.5 py-0.5 rounded-full font-medium">
            Live
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsChatMinimized(!isChatMinimized)}
            className="p-1 hover:bg-blue-700 rounded text-blue-100 hover:text-white transition-colors"
            title={isChatMinimized ? 'Expand' : 'Minimize'}
          >
            {isChatMinimized ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1 hover:bg-blue-700 rounded text-blue-100 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isChatMinimized && (
        <>
          {/* Online Members Row */}
          <div className="bg-slate-50/80 border-b border-slate-100 px-3 py-2 flex items-center gap-3 overflow-x-auto">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-1.5 shrink-0 select-none group cursor-pointer"
                title={`${member.name} (${member.status})`}
              >
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${
                      member.status === 'online'
                        ? 'bg-emerald-500'
                        : member.status === 'away'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>
                <div className="text-[11px] leading-tight">
                  <p className="font-semibold text-slate-700 truncate max-w-[70px]">
                    {member.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] text-slate-400 capitalize">
                    {member.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50/30">
            {chatMessages.map((msg) => {
              const isMe = msg.isCurrentUser || msg.senderName === profile.name;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-5 h-5 rounded-full object-cover shrink-0 mb-1"
                      title={msg.senderName}
                    />
                  )}

                  <div className={`max-w-[82%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isMe && (
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs space-y-1.5 ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.content && <p>{msg.content}</p>}

                      {/* File attachment preview */}
                      {msg.attachment && (
                        <div
                          className={`p-2 rounded-xl flex items-center justify-between gap-2 text-[11px] ${
                            isMe
                              ? 'bg-blue-700/80 text-white'
                              : 'bg-slate-50 border border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <div className="truncate">
                              <p className="font-semibold truncate">{msg.attachment.name}</p>
                              <p className="text-[9px] opacity-80">{msg.attachment.size}</p>
                            </div>
                          </div>
                          {msg.attachment.url && (
                            <a
                              href={msg.attachment.url}
                              download={msg.attachment.name}
                              className="p-1 hover:opacity-80 transition-opacity"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Pending attachment preview pill */}
          {pendingAttachment && (
            <div className="p-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center gap-1.5 truncate">
                <Paperclip className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-medium truncate">{pendingAttachment.name}</span>
                <span className="text-[10px] text-blue-600">({pendingAttachment.size})</span>
              </div>
              <button
                onClick={() => setPendingAttachment(null)}
                className="p-0.5 text-blue-400 hover:text-blue-700 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Emoji Popover */}
          {showEmojiPicker && (
            <div className="p-2 bg-white border-t border-slate-200 flex gap-1 justify-center flex-wrap">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInputMessage((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="hover:bg-slate-100 p-1 rounded text-sm transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Add Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Attach and Upload File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={pendingAttachment ? 'Add a message or hit send...' : 'Type a message...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-100/80 border-none rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() && !pendingAttachment}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-xs"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
