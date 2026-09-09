export interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  bio: string;
  department: string;
  timezone: string;
  notificationsEnabled: boolean;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName?: string;
  progress: number; // 0 - 100
  completed: boolean;
  tag: 'Design' | 'Meeting' | 'Review' | 'Finance' | 'Done' | 'Development' | 'Marketing';
  dueDate: string; // YYYY-MM-DD
  time?: string;
  priority: TaskPriority;
  assignedTo?: string;
  assignedAvatar?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  progress: number; // 0 - 100
  status: 'active' | 'in_review' | 'completed' | 'on_hold';
  dueDate: string;
  teamCount: number;
  totalTasks: number;
  completedTasks: number;
  color: string;
  budget?: string;
  hoursTracked?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  type: 'task' | 'meeting' | 'milestone' | 'review';
  color: string;
  relatedTaskId?: string;
  relatedProjectId?: string;
}

export interface WorkspaceNote {
  id: string;
  text: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'pink';
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string; // relative or formatted string
  createdAt: number; // for sorting
  type: 'task' | 'project' | 'comment' | 'profile' | 'upload';
}

export interface ChatAttachment {
  name: string;
  size: string;
  url?: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isCurrentUser: boolean;
  content: string;
  timestamp: string;
  createdAt: number;
  attachment?: ChatAttachment;
}

export interface ProjectDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  uploadedAt: string;
  uploadedBy: string;
  category?: string;
}


export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  email: string;
  activeTasks: number;
  department?: string;
}

export type ActiveTab = 
  | 'overview'
  | 'projects'
  | 'tasks'
  | 'calendar'
  | 'analytics'
  | 'documents'
  | 'messages'
  | 'team'
  | 'settings';
