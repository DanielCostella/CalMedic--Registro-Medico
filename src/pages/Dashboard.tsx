import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import UserDashboard from '../components/dashboard/UserDashboard';
import { User } from '../types/user';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        user={user}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div className="lg:pl-64 transition-all duration-300">
        <main className="p-6 lg:p-8">
          {user.role === 'Administrador' ? (
            <AdminDashboard user={user} activeSection={activeSection} />
          ) : (
            <UserDashboard user={user} activeSection={activeSection} />
          )}
        </main>
      </div>
    </div>
  );
}