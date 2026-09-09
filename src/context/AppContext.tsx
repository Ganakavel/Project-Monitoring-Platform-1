import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Project,
  Task,
  CalendarEvent,
  WorkspaceNote,
  ActivityItem,
  ChatMessage,
  ChatAttachment,
  TeamMember,
  ActiveTab,
  ProjectDocument,
} from '../types';
import {
  initialProfile,
  initialProjects,
  initialTasks,
  initialCalendarEvents,
  initialWorkspaceNotes,
  initialActivities,
  initialTeamMembers,
  initialChatMessages,
  initialDocuments,
} from '../data/initialData';

export interface SearchResults {
  tasks: Task[];
  projects: Project[];
  documents: ProjectDocument[];
}

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'completedTasks'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskCompletion: (id: string) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  deleteTask: (id: string) => void;
  
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  todayDateStr: string;
  jumpToToday: () => void;
  
  notes: WorkspaceNote[];
  addNote: (text: string, color?: WorkspaceNote['color']) => void;
  deleteNote: (id: string) => void;
  
  documents: ProjectDocument[];
  uploadDocument: (file: File, category?: string) => Promise<void>;
  deleteDocument: (id: string) => void;
  
  activities: ActivityItem[];
  addActivity: (action: string, target: string, type?: ActivityItem['type']) => void;
  
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  deleteTeamMember: (id: string) => void;
  isAddMemberModalOpen: boolean;
  setIsAddMemberModalOpen: (open: boolean) => void;

  chatMessages: ChatMessage[];
  sendChatMessage: (content: string, attachment?: ChatAttachment) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isChatMinimized: boolean;
  setIsChatMinimized: (minimized: boolean) => void;
  
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResults;
  
  // Online / Offline tracking
  isOnline: boolean;
  toggleOnlineStatus: () => void;
  
  // Modals
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
  editingProject: Project | null;
  setEditingProject: (project: Project | null) => void;
  isEventModalOpen: boolean;
  setIsEventModalOpen: (open: boolean) => void;
  
  // Auth
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;

  // Notifications
  notifications: Array<{ id: string; title: string; time: string; read: boolean; type: string }>;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'nexgen_profile_v1',
  PROJECTS: 'nexgen_projects_v1',
  TASKS: 'nexgen_tasks_v1',
  CALENDAR: 'nexgen_calendar_v1',
  NOTES: 'nexgen_notes_v1',
  ACTIVITIES: 'nexgen_activities_v1',
  CHAT: 'nexgen_chat_v1',
  DOCUMENTS: 'nexgen_documents_v1',
  MEMBERS: 'nexgen_members_v1',
  AUTH: 'nexgen_auth_v1',
};

// Demo credentials (matches SignInPage)
const DEMO_EMAIL = 'demo@nexgencreators.io';
const DEMO_PASSWORD = 'nexgen2026';

// Calculate real Today's Date
const getTodayString = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const todayDateStr = useMemo(() => getTodayString(), []);

  // Auth state — persisted in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const signIn = (email: string, password: string): boolean => {
    const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    if (ok) {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      setIsAuthenticated(true);
    }
    return ok;
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setIsAuthenticated(false);
  };

  // Online status tracking with browser navigator
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Load initial states with localStorage fallbacks
  const [profile, setProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const p = saved ? JSON.parse(saved) : initialProfile;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      p.status = 'offline';
    }
    return p;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [notes, setNotes] = useState<WorkspaceNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    return saved ? JSON.parse(saved) : initialWorkspaceNotes;
  });

  const [documents, setDocuments] = useState<ProjectDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : initialTeamMembers;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Chat widget
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Sarah assigned you to CRM Dashboard', time: '10m ago', read: false, type: 'task' },
    { id: 'notif-2', title: 'Website Redesign hit 85% completion', time: '1h ago', read: false, type: 'project' },
    { id: 'notif-3', title: 'Client meeting scheduled for today', time: '2h ago', read: true, type: 'calendar' },
  ]);

  const broadcastSync = (data: Record<string, unknown>) => {
    try {
      const channel = new BroadcastChannel('nexgen_creators_sync');
      channel.postMessage({ type: 'SYNC_ALL', payload: data });
      channel.close();
    } catch {
      // Ignore broadcast errors in restricted environments
    }
  };

  // Activity logger helper
  const addActivity = useCallback((action: string, target: string, type: ActivityItem['type'] = 'task') => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user: profile.name.split(' ')[0] || 'You',
      userAvatar: profile.avatar,
      action,
      target,
      timestamp: 'Just now',
      createdAt: Date.now(),
      type,
    };
    setActivities((prev) => {
      const next = [newAct, ...prev.slice(0, 15)];
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(next));
      broadcastSync({ activities: next });
      return next;
    });
  }, [profile.name, profile.avatar]);

  // Real-time automatic online/offline/away detection
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const setOnline = () => {
      setIsOnline(true);
      setProfileState((prev) => {
        const updated = { ...prev, status: 'online' as const };
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        broadcastSync({ profile: updated });
        return updated;
      });
      addActivity('connected to network', 'Status: Online', 'profile');
    };

    const setOffline = () => {
      setIsOnline(false);
      setProfileState((prev) => {
        const updated = { ...prev, status: 'offline' as const };
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        broadcastSync({ profile: updated });
        return updated;
      });
      addActivity('lost connection', 'Status: Offline', 'profile');
    };

    const handleUserActivity = () => {
      clearTimeout(idleTimer);

      if (navigator.onLine) {
        setProfileState((prev) => {
          if (prev.status === 'away') {
            const updated = { ...prev, status: 'online' as const };
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
            broadcastSync({ profile: updated });
            return updated;
          }
          return prev;
        });
      }

      // If idle for 90 seconds, auto set status to away
      idleTimer = setTimeout(() => {
        if (navigator.onLine) {
          setProfileState((prev) => {
            if (prev.status === 'online') {
              const updated = { ...prev, status: 'away' as const };
              localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
              broadcastSync({ profile: updated });
              return updated;
            }
            return prev;
          });
        }
      }, 90000);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        if (navigator.onLine) {
          setProfileState((prev) => {
            if (prev.status === 'online') {
              const updated = { ...prev, status: 'away' as const };
              localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
              broadcastSync({ profile: updated });
              return updated;
            }
            return prev;
          });
        }
      } else {
        handleUserActivity();
      }
    };

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    handleUserActivity();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [addActivity]);

  // Toggle Online Status manually
  const toggleOnlineStatus = () => {
    const nextStatus = isOnline ? false : true;
    setIsOnline(nextStatus);
    setProfileState((prev) => {
      const updated = { ...prev, status: (nextStatus ? 'online' : 'offline') as UserProfile['status'] };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      broadcastSync({ profile: updated });
      return updated;
    });
    addActivity(nextStatus ? 'switched to' : 'switched to', nextStatus ? 'Online' : 'Offline', 'profile');
  };

  // Real-time BroadcastChannel for multi-tab sync
  useEffect(() => {
    const channel = new BroadcastChannel('nexgen_creators_sync');
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_ALL') {
        if (payload.profile) setProfileState(payload.profile);
        if (payload.tasks) setTasks(payload.tasks);
        if (payload.projects) setProjects(payload.projects);
        if (payload.calendarEvents) setCalendarEvents(payload.calendarEvents);
        if (payload.notes) setNotes(payload.notes);
        if (payload.documents) setDocuments(payload.documents);
        if (payload.teamMembers) setTeamMembers(payload.teamMembers);
        if (payload.activities) setActivities(payload.activities);
        if (payload.chatMessages) setChatMessages(payload.chatMessages);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Update Profile
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      broadcastSync({ profile: updated });
      return updated;
    });
    addActivity('updated profile', 'Account Settings', 'profile');
  };

  // Jump to Today in Calendar
  const jumpToToday = () => {
    setSelectedDate(todayDateStr);
  };

  // Add Team Member
  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `tm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setTeamMembers((prev) => {
      const updated = [...prev, newMember];
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
      broadcastSync({ teamMembers: updated });
      return updated;
    });
    addActivity('added team member', `${newMember.name} (${newMember.role})`, 'project');
  };

  const deleteTeamMember = (id: string) => {
    const target = teamMembers.find((m) => m.id === id);
    setTeamMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
      broadcastSync({ teamMembers: updated });
      return updated;
    });
    if (target) {
      addActivity('removed team member', target.name, 'project');
    }
  };

  // Toggle Task Completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
            });
          }
          return {
            ...t,
            completed: nextCompleted,
            progress: nextCompleted ? 100 : (t.progress === 100 ? 40 : t.progress),
            tag: (nextCompleted ? 'Done' : (t.tag === 'Done' ? 'Design' : t.tag)) as Task['tag'],
          };
        }
        return t;
      });

      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      broadcastSync({ tasks: updated });

      const targetTask = updated.find((t) => t.id === taskId);
      if (targetTask) {
        addActivity(
          targetTask.completed ? 'completed task' : 'reopened task',
          targetTask.title,
          'task'
        );
      }
      return updated;
    });
  };

  // Update Task Progress
  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const completed = progress === 100;
          if (completed && !t.completed) {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
          }
          return {
            ...t,
            progress,
            completed,
            tag: (completed ? 'Done' : t.tag) as Task['tag'],
          };
        }
        return t;
      });

      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      broadcastSync({ tasks: updated });
      return updated;
    });
  };

  // Add Task
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    setTasks((prev) => {
      const updated = [newTask, ...prev];
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      broadcastSync({ tasks: updated });
      return updated;
    });

    if (newTask.dueDate) {
      const newEvent: CalendarEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: newTask.title,
        date: newTask.dueDate,
        startTime: newTask.time || '10:00 AM',
        endTime: '11:00 AM',
        type: 'task',
        color: '#3b82f6',
        relatedTaskId: newTask.id,
        relatedProjectId: newTask.projectId,
      };
      setCalendarEvents((prev) => {
        const nextEvents = [...prev, newEvent];
        localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(nextEvents));
        broadcastSync({ calendarEvents: nextEvents });
        return nextEvents;
      });
    }

    addActivity('created task', newTask.title, 'task');
  };

  // Update Task
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      broadcastSync({ tasks: updated });
      return updated;
    });
    addActivity('updated task', updates.title || 'Task details', 'task');
  };

  // Delete Task
  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      broadcastSync({ tasks: updated });
      return updated;
    });
    setCalendarEvents((prev) => {
      const updated = prev.filter((e) => e.relatedTaskId !== id);
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(updated));
      return updated;
    });
    if (target) {
      addActivity('deleted task', target.title, 'task');
    }
  };

  // Add Project
  const addProject = (projData: Omit<Project, 'id' | 'completedTasks'>) => {
    const newProject: Project = {
      ...projData,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      completedTasks: Math.round((projData.totalTasks * projData.progress) / 100),
    };
    setProjects((prev) => {
      const updated = [...prev, newProject];
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      broadcastSync({ projects: updated });
      return updated;
    });
    addActivity('created project', newProject.title, 'project');
  };

  // Update Project
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      broadcastSync({ projects: updated });
      return updated;
    });
    addActivity('updated project', updates.title || 'Project milestones', 'project');
  };

  // Delete Project
  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      broadcastSync({ projects: updated });
      return updated;
    });
    if (target) {
      addActivity('archived project', target.title, 'project');
    }
  };

  // Calendar Events
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setCalendarEvents((prev) => {
      const updated = [...prev, newEvent];
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(updated));
      broadcastSync({ calendarEvents: updated });
      return updated;
    });
    addActivity('scheduled event', newEvent.title, 'task');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(updated));
      broadcastSync({ calendarEvents: updated });
      return updated;
    });
  };

  // Notes
  const addNote = (text: string, color: WorkspaceNote['color'] = 'blue') => {
    const newNote: WorkspaceNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text,
      color,
      updatedAt: 'Just now',
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
      broadcastSync({ notes: updated });
      return updated;
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
      broadcastSync({ notes: updated });
      return updated;
    });
  };

  // Documents & File Upload Access
  const uploadDocument = async (file: File, category = 'Uploaded Documents') => {
    const sizeInMB = file.size / (1024 * 1024);
    const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
    
    const fileUrl = URL.createObjectURL(file);

    const newDoc: ProjectDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: sizeStr,
      type: file.name.split('.').pop() || 'file',
      url: fileUrl,
      uploadedAt: 'Just now',
      uploadedBy: profile.name,
      category,
    };

    setDocuments((prev) => {
      const updated = [newDoc, ...prev];
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
      broadcastSync({ documents: updated });
      return updated;
    });

    addActivity('uploaded', file.name, 'upload');
  };

  const deleteDocument = (id: string) => {
    const target = documents.find((d) => d.id === id);
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
      broadcastSync({ documents: updated });
      return updated;
    });
    if (target) {
      addActivity('removed file', target.name, 'upload');
    }
  };

  // Chat
  const sendChatMessage = (content: string, attachment?: ChatAttachment) => {
    if (!content.trim() && !attachment) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      senderId: profile.id,
      senderName: profile.name,
      senderAvatar: profile.avatar,
      isCurrentUser: true,
      content,
      attachment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };

    setChatMessages((prev) => {
      const updated = [...prev, userMsg];
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated));
      broadcastSync({ chatMessages: updated });
      return updated;
    });

    // Realistic collaborative reply after 1.4s
    setTimeout(() => {
      const botReplies = [
        "Sounds great! I'll review the updated asset right away.",
        "Got it, looking at the deliverables now.",
        "Perfect! Synced with the team notes.",
        "Thanks for sharing! Looks great for the milestone release.",
      ];
      const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}-${Math.random().toString(36).substring(2, 7)}`,
        senderId: 'tm-2',
        senderName: 'Sarah Johnson',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isCurrentUser: false,
        content: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
      };

      setChatMessages((prev) => {
        const updated = [...prev, botMsg];
        localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated));
        broadcastSync({ chatMessages: updated });
        return updated;
      });
    }, 1400);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Live Search Index across tasks, projects, and documents
  const searchResults: SearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { tasks: [], projects: [], documents: [] };
    return {
      tasks: tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.projectName?.toLowerCase().includes(q) ||
          t.tag.toLowerCase().includes(q)
      ),
      projects: projects.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ),
      documents: documents.filter(
        (d) => d.name.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q)
      ),
    };
  }, [searchQuery, tasks, projects, documents]);

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        projects,
        addProject,
        updateProject,
        deleteProject,
        tasks,
        addTask,
        updateTask,
        toggleTaskCompletion,
        updateTaskProgress,
        deleteTask,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        selectedDate,
        setSelectedDate,
        todayDateStr,
        jumpToToday,
        notes,
        addNote,
        deleteNote,
        documents,
        uploadDocument,
        deleteDocument,
        activities,
        addActivity,
        teamMembers,
        addTeamMember,
        deleteTeamMember,
        isAddMemberModalOpen,
        setIsAddMemberModalOpen,
        chatMessages,
        sendChatMessage,
        isChatOpen,
        setIsChatOpen,
        isChatMinimized,
        setIsChatMinimized,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        searchResults,
        isOnline,
        toggleOnlineStatus,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        editingTask,
        setEditingTask,
        isProjectModalOpen,
        setIsProjectModalOpen,
        editingProject,
        setEditingProject,
        isEventModalOpen,
        setIsEventModalOpen,
        isAuthenticated,
        signIn,
        signOut,
        notifications,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
