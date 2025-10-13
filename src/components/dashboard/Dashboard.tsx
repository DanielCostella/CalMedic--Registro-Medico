import React, { useState } from 'react';
import { User } from '../../types/user';
import UserDashboard from './UserDashboard';
import MedicoDashboard from './MedicoDashboard';
import AdminDashboard from './AdminDashboard';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // Render different dashboards based on user role
  if (user.role === 'Médico') {
    return (
      <MedicoDashboard 
        user={user} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={onLogout}
      />
    );
  }

  if (user.role === 'Administrador') {
    return (
      <AdminDashboard 
        user={user} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={onLogout}
      />
    );
  }

  // Default to user dashboard
  return (
    <UserDashboard 
      user={user} 
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      onLogout={onLogout}
    />
  );
}