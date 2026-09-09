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
  Bot,
  Users,
  Sparkles,
  RefreshCw,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatAttachment } from '../../types';
import { FirebaseConfigModal } from '../modals/FirebaseConfigModal';
import { initFirebase } from '../../services/firebaseService';

// ── AI Message type (local only, not stored in context) ──────────────────────
interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

// ── AI Brain — context-aware smart replies ───────────────────────────────────
function generateAiReply(
  userMsg: string,
  context: {
    projects: ReturnType<typeof useApp>['projects'];
    tasks: ReturnType<typeof useApp>['tasks'];
    teamMembers: ReturnType<typeof useApp>['teamMembers'];
    profile: ReturnType<typeof useApp>['profile'];
  }
): string {
  const q = userMsg.toLowerCase();
  const { projects, tasks, teamMembers, profile } = context;

  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const onlineMembers = teamMembers.filter((m) => m.status === 'online');
  const overdueTasks = tasks.filter((t) => {
    if (t.completed) return false;
    return new Date(t.dueDate) < new Date();
  });
  const highPriority = pendingTasks.filter((t) => t.priority === 'high' || t.priority === 'urgent');

  // Greeting
  if (/\b(hi|hello|hey|sup|greetings|howdy)\b/.test(q)) {
    return `👋 Hello, ${profile.name.split(' ')[0]}! I'm **NEXGEN AI**, your smart project assistant.\n\nYou have **${activeProjects.length} active projects** and **${pendingTasks.length} pending tasks** right now. What would you like to know?`;
  }

  // Projects
  if (/project/.test(q)) {
    if (/how many|count|total|number/.test(q)) {
      return `📁 You currently have **${projects.length} projects** in total:\n• 🟢 Active: **${activeProjects.length}**\n• ✅ Completed: **${projects.filter(p => p.status === 'completed').length}**\n• 🔵 In Review: **${projects.filter(p => p.status === 'in_review').length}**\n• ⏸️ On Hold: **${projects.filter(p => p.status === 'on_hold').length}**`;
    }
    if (/list|show|what|which/.test(q)) {
      const list = activeProjects.slice(0, 5).map((p) => `• **${p.title}** — ${p.progress}% complete`).join('\n');
      return `🗂️ **Active Projects** (${activeProjects.length} total):\n${list}${activeProjects.length > 5 ? `\n...and ${activeProjects.length - 5} more` : ''}`;
    }
    if (/progress|status/.test(q)) {
      const avg = activeProjects.length > 0
        ? Math.round(activeProjects.reduce((s, p) => s + p.progress, 0) / activeProjects.length)
        : 0;
      return `📊 Average progress across **${activeProjects.length} active projects** is **${avg}%**.\n\nTop performing:\n${activeProjects.sort((a, b) => b.progress - a.progress).slice(0, 3).map(p => `• ${p.title}: ${p.progress}%`).join('\n')}`;
    }
  }

  // Tasks
  if (/task/.test(q)) {
    if (/overdue|late|behind|missed/.test(q)) {
      if (overdueTasks.length === 0) return `✅ Great news! You have **no overdue tasks**. You're on track!`;
      return `⚠️ You have **${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}**:\n${overdueTasks.slice(0, 4).map(t => `• ${t.title} (due ${t.dueDate})`).join('\n')}`;
    }
    if (/pending|remaining|todo|left/.test(q)) {
      return `📋 You have **${pendingTasks.length} pending tasks** across all projects.\n• 🔴 High/Urgent: **${highPriority.length}**\n• 🟡 Others: **${pendingTasks.length - highPriority.length}**`;
    }
    if (/complete|done|finish/.test(q)) {
      const rate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
      return `✅ You've completed **${completedTasks.length} out of ${tasks.length} tasks** — that's a **${rate}% completion rate**. Keep it up!`;
    }
    if (/priority|urgent|important/.test(q)) {
      if (highPriority.length === 0) return `👍 No high-priority tasks pending. You're well organized!`;
      return `🔴 **${highPriority.length} high-priority task${highPriority.length > 1 ? 's' : ''}** need attention:\n${highPriority.slice(0, 4).map(t => `• **${t.title}** — due ${t.dueDate}`).join('\n')}`;
    }
    if (/how many|count|total/.test(q)) {
      return `📊 Task overview:\n• Total: **${tasks.length}**\n• ✅ Completed: **${completedTasks.length}**\n• ⏳ Pending: **${pendingTasks.length}**\n• 🔴 High Priority: **${highPriority.length}**\n• ⚠️ Overdue: **${overdueTasks.length}**`;
    }
  }

  // Team
  if (/team|member|staff|colleague|people/.test(q)) {
    if (/how many|count|total/.test(q)) {
      return `👥 Your team has **${teamMembers.length} members** total.\n• 🟢 Online now: **${onlineMembers.length}**\n• ⏳ Away/Busy: **${teamMembers.filter(m => m.status === 'away' || m.status === 'busy').length}**\n• ⚫ Offline: **${teamMembers.filter(m => m.status === 'offline').length}**`;
    }
    if (/online|active|available/.test(q)) {
      if (onlineMembers.length === 0) return `😴 No team members are currently online.`;
      return `🟢 **${onlineMembers.length} member${onlineMembers.length > 1 ? 's' : ''} online** right now:\n${onlineMembers.map(m => `• ${m.name} — ${m.role}`).join('\n')}`;
    }
    if (/list|show|who/.test(q)) {
      return `👥 **Team Members** (${teamMembers.length} total):\n${teamMembers.slice(0, 6).map(m => `• ${m.name} — ${m.role} (${m.status})`).join('\n')}${teamMembers.length > 6 ? `\n...and ${teamMembers.length - 6} more` : ''}`;
    }
  }

  // Summary / dashboard
  if (/summary|overview|dashboard|status|report|update/.test(q)) {
    const rate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    return `📊 **NEXGEN — Live Summary**\n\n🗂️ Projects: **${activeProjects.length} active** / ${projects.length} total\n✅ Tasks: **${completedTasks.length}** done, **${pendingTasks.length}** pending (${rate}%)\n👥 Team: **${teamMembers.length}** members, **${onlineMembers.length}** online\n⚠️ Overdue: **${overdueTasks.length}** task${overdueTasks.length !== 1 ? 's' : ''}\n🔴 High Priority: **${highPriority.length}** task${highPriority.length !== 1 ? 's' : ''}`;
  }

  // Help
  if (/help|what can|what do|feature|command/.test(q)) {
    return `🤖 I'm **NEXGEN AI** — here's what I can help you with:\n\n• **"Show active projects"** — list your projects\n• **"How many tasks pending?"** — task overview\n• **"Any overdue tasks?"** — check deadlines\n• **"Who's online?"** — team availability\n• **"Give me a summary"** — full dashboard report\n• **"High priority tasks"** — urgent items\n\nJust ask naturally!`;
  }

  // Profile
  if (/my profile|who am i|my role|my name/.test(q)) {
    return `👤 You are **${profile.name}**\n• Role: ${profile.role}\n• Department: ${profile.department || 'N/A'}\n• Status: ${profile.status}\n• Email: ${profile.email}`;
  }

  // Motivational / generic
  const fallbacks = [
    `I'm here to help! Try asking:\n• *"How many projects are active?"*\n• *"Show pending tasks"*\n• *"Give me a team summary"*`,
    `Great question! For the best results, try asking about your **projects**, **tasks**, **team**, or request a **summary**. 🚀`,
    `I can analyze your **${projects.length} projects** and **${tasks.length} tasks** in real time. What would you like to know?`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ── Format AI message with bold markdown ──────────────────────────────────────
const AiText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
            )}
          </p>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
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
    projects,
    tasks,
  } = useApp();

  // ── Team chat state ──
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState<'team' | 'ai'>('team');
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  const fbStatus = initFirebase();
  const isCloudActive = fbStatus.success;

  // ── AI chat state ──
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: 'ai-welcome',
      role: 'assistant',
      content: `👋 Hi ${profile.name.split(' ')[0]}! I'm **NEXGEN AI**, your project assistant.\n\nI have real-time access to your projects, tasks, and team. Ask me anything!\n\n💡 Try: *"Give me a summary"* or *"Any overdue tasks?"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const aiEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['👍', '🚀', '🎉', '🔥', '✅', '👏', '🙌', '💡'];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollAiToBottom = () => aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    if (isChatOpen && !isChatMinimized && activeTab === 'team') scrollToBottom();
  }, [chatMessages, isChatOpen, isChatMinimized, activeTab]);

  useEffect(() => {
    if (isChatOpen && !isChatMinimized && activeTab === 'ai') scrollAiToBottom();
  }, [aiMessages, isChatOpen, isChatMinimized, activeTab]);

  // ── Team chat handlers ──
  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeInMB = file.size / (1024 * 1024);
      const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
      const url = URL.createObjectURL(file);
      setPendingAttachment({ name: file.name, size: sizeStr, url, type: file.name.split('.').pop() || 'file' });
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

  // ── AI chat handler ──
  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = aiInput.trim();
    if (!text || aiTyping) return;
    setAiInput('');

    const userMsg: AiMessage = {
      id: `ai-u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAiMessages((prev) => [...prev, userMsg]);

    // Typing indicator
    setAiTyping(true);
    const typingId = `ai-typing-${Date.now()}`;
    setAiMessages((prev) => [...prev, { id: typingId, role: 'assistant', content: '', timestamp: '', isTyping: true }]);

    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));

    const reply = generateAiReply(text, { projects, tasks, teamMembers, profile });

    setAiMessages((prev) =>
      prev
        .filter((m) => m.id !== typingId)
        .concat({
          id: `ai-a-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
    );
    setAiTyping(false);
  };

  const clearAiChat = () => {
    setAiMessages([
      {
        id: `ai-welcome-${Date.now()}`,
        role: 'assistant',
        content: `🔄 Chat cleared! I'm still here, ${profile.name.split(' ')[0]}. What would you like to know?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // ── Collapsed / closed states ──
  if (!isChatOpen) {
    return (
      <button
        onClick={() => { setIsChatOpen(true); setIsChatMinimized(false); }}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3.5 shadow-lg shadow-blue-500/30 flex items-center gap-2 font-medium text-xs transition-all hover:scale-105"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Chat</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${
        isChatMinimized ? 'h-[52px]' : 'h-[540px]'
      }`}
    >
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFilePicked} className="hidden" />

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          {activeTab === 'team' ? (
            <MessageSquare className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
          <span className="font-bold text-xs tracking-tight">
            {activeTab === 'team' ? 'Team Chat' : 'NEXGEN AI'}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
            activeTab === 'team' ? 'bg-blue-500/80' : 'bg-violet-500/80'
          }`}>
            {activeTab === 'team' ? 'Live' : 'AI'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            className={`p-1 rounded transition-colors flex items-center gap-1 ${
              isCloudActive
                ? 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
                : 'hover:bg-blue-700 text-blue-100 hover:text-white'
            }`}
            title={isCloudActive ? 'Cloud Sync Active (Global Chat)' : 'Set up Cloud Sync for Public Host'}
          >
            <Flame className={`w-3.5 h-3.5 ${isCloudActive ? 'text-amber-300 fill-amber-300/40 animate-pulse' : ''}`} />
          </button>
          {activeTab === 'ai' && !isChatMinimized && (
            <button
              onClick={clearAiChat}
              className="p-1 hover:bg-blue-700 rounded text-blue-100 hover:text-white transition-colors"
              title="Clear AI chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsChatMinimized(!isChatMinimized)}
            className="p-1 hover:bg-blue-700 rounded text-blue-100 hover:text-white transition-colors"
            title={isChatMinimized ? 'Expand' : 'Minimize'}
          >
            {isChatMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
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
          {/* ── Tabs ── */}
          <div className="flex border-b border-slate-100 shrink-0 bg-white">
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 py-2.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'team'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Team Chat
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'ai'
                  ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50/40'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              NEXGEN AI
            </button>
          </div>

          {/* ══════════════ TEAM CHAT TAB ══════════════ */}
          {activeTab === 'team' && (
            <>
              {/* Cloud Sync Status Banner */}
              <button
                onClick={() => setIsFirebaseModalOpen(true)}
                className={`flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold shrink-0 transition-colors ${
                  isCloudActive
                    ? 'bg-amber-50 text-amber-700 border-b border-amber-100'
                    : 'bg-blue-50/60 text-blue-600 border-b border-slate-100 hover:bg-blue-100/60'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Flame className={`w-3 h-3 ${isCloudActive ? 'text-amber-500 fill-amber-400/40 animate-pulse' : 'text-blue-400'}`} />
                  {isCloudActive
                    ? '🌐 Cloud Sync Active — messaging across internet'
                    : '🔒 Local-only · Click 🔥 to enable global cloud chat'}
                </span>
                <span className="underline opacity-70">
                  {isCloudActive ? 'Manage' : 'Enable'}
                </span>
              </button>

              {/* Online Members Row */}
              <div className="bg-slate-50/80 border-b border-slate-100 px-3 py-2 flex items-center gap-3 overflow-x-auto shrink-0">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1.5 shrink-0 cursor-pointer"
                    title={`${member.name} (${member.status})`}
                  >
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200" />
                      <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${
                        member.status === 'online' ? 'bg-emerald-500' : member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <p className="font-semibold text-slate-700 truncate max-w-[60px]">{member.name.split(' ')[0]}</p>
                      <p className="text-[9px] text-slate-400 capitalize">{member.status}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50/30">
                {chatMessages.map((msg) => {
                  const isMe = msg.isCurrentUser || msg.senderName === profile.name;
                  return (
                    <div key={msg.id} className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <img src={msg.senderAvatar} alt={msg.senderName} className="w-5 h-5 rounded-full object-cover shrink-0 mb-1" title={msg.senderName} />
                      )}
                      <div className={`max-w-[82%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        {!isMe && <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">{msg.senderName}</span>}
                        <div className={`px-3 py-2 rounded-2xl text-xs space-y-1.5 ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-sm shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                        }`}>
                          {msg.content && <p>{msg.content}</p>}
                          {msg.attachment && (
                            <div className={`p-2 rounded-xl flex items-center justify-between gap-2 text-[11px] ${
                              isMe ? 'bg-blue-700/80 text-white' : 'bg-slate-50 border border-slate-200 text-slate-700'
                            }`}>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <FileText className="w-3.5 h-3.5 shrink-0" />
                                <div className="truncate">
                                  <p className="font-semibold truncate">{msg.attachment.name}</p>
                                  <p className="text-[9px] opacity-80">{msg.attachment.size}</p>
                                </div>
                              </div>
                              {msg.attachment.url && (
                                <a href={msg.attachment.url} download={msg.attachment.name} className="p-1 hover:opacity-80" title="Download">
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachment preview */}
              {pendingAttachment && (
                <div className="p-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900 shrink-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium truncate">{pendingAttachment.name}</span>
                    <span className="text-[10px] text-blue-600">({pendingAttachment.size})</span>
                  </div>
                  <button onClick={() => setPendingAttachment(null)} className="p-0.5 text-blue-400 hover:text-blue-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Emoji picker */}
              {showEmojiPicker && (
                <div className="p-2 bg-white border-t border-slate-200 flex gap-1 justify-center flex-wrap shrink-0">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setInputMessage((p) => p + emoji); setShowEmojiPicker(false); }}
                      className="hover:bg-slate-100 p-1 rounded text-sm transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 shrink-0">
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100" title="Emoji">
                  <Smile className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100" title="Attach file">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder={pendingAttachment ? 'Add a message...' : 'Type a message...'}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-slate-100/80 border-none rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() && !pendingAttachment}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </>
          )}

          {/* ══════════════ AI CHAT TAB ══════════════ */}
          {activeTab === 'ai' && (
            <>
              {/* AI Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gradient-to-b from-violet-50/30 to-white">
                {aiMessages.map((msg) => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 mb-1">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white border border-violet-100 text-slate-800 rounded-bl-sm shadow-sm'
                      }`}>
                        {msg.isTyping ? (
                          <div className="flex items-center gap-1 py-1">
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <AiText text={msg.content} />
                        )}
                      </div>
                      {msg.timestamp && (
                        <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={aiEndRef} />
              </div>

              {/* Quick prompt chips */}
              <div className="px-3 py-2 bg-white border-t border-violet-100 flex gap-1.5 overflow-x-auto shrink-0">
                {['Summary', 'Active projects', 'Overdue tasks', "Who's online?"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setAiInput(chip);
                      setTimeout(() => document.getElementById('ai-input')?.focus(), 50);
                    }}
                    className="shrink-0 px-2.5 py-1 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-full text-[10px] font-semibold text-violet-700 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* AI Input */}
              <form onSubmit={handleAiSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 shrink-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <input
                  id="ai-input"
                  type="text"
                  placeholder="Ask NEXGEN AI anything..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  disabled={aiTyping}
                  className="flex-1 bg-violet-50/60 border border-violet-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-400 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || aiTyping}
                  className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </>
          )}
        </>
      )}

      {/* Firebase Cloud Sync Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onConfigSaved={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
};
