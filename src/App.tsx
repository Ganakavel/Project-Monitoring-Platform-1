import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { OverviewView } from './components/views/OverviewView';
import { ProjectsView } from './components/views/ProjectsView';
import { TasksView } from './components/views/TasksView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { DocumentsView } from './components/views/DocumentsView';
import { MessagesView } from './components/views/MessagesView';
import { TeamView } from './components/views/TeamView';
import { SettingsView } from './components/views/SettingsView';
import { TeamChatWidget } from './components/chat/TeamChatWidget';
import { ProfileModal } from './components/modals/ProfileModal';
import { TaskModal } from './components/modals/TaskModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { EventModal } from './components/modals/EventModal';
import { AddMemberModal } from './components/modals/AddMemberModal';
import { SignInPage } from './pages/SignInPage';

const DashboardContent: React.FC = () => {
  const { activeTab, isAuthenticated, signIn } = useApp();

  // Show sign-in page when not authenticated
  if (!isAuthenticated) {
    return <SignInPage onSignIn={signIn} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return <TasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'documents':
        return <DocumentsView />;
      case 'messages':
        return <MessagesView />;
      case 'team':
        return <TeamView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f3f8] text-slate-800 antialiased font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopBar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Team Chat Widget */}
      <TeamChatWidget />

      {/* Real-Time Management Modals */}
      <ProfileModal />
      <TaskModal />
      <ProjectModal />
      <EventModal />
      <AddMemberModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
