import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Home, 
  Settings, 
  LogOut, 
  UserCheck, 
  Shield,
  Menu,
  X
} from 'lucide-react';
import { User } from '../../types/user';

interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ 
  user, 
  activeSection, 
  onSectionChange, 
  onLogout, 
  isOpen, 
  onToggle 
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home, roles: ['Administrador', 'Usuario', 'Médico'] },
    { id: 'users', label: 'Gestión de Usuarios', icon: Users, roles: ['Administrador'] },
    { id: 'profile', label: 'Mi Perfil', icon: UserCheck, roles: ['Administrador', 'Usuario', 'Médico'] },
    { id: 'settings', label: 'Configuración', icon: Settings, roles: ['Administrador', 'Usuario', 'Médico'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64 border-r border-slate-200
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EL</span>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">EstiloLibre</h2>
                  <p className="text-xs text-slate-500">Sistema de Gestión</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.nombres.charAt(0)}{user.apellidos.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {user.nombres} {user.apellidos}
                </p>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-blue-600" />
                  <p className="text-xs text-blue-600 font-medium">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`
                        w-full justify-start text-left font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                        }
                      `}
                      onClick={() => {
                        onSectionChange(item.id);
                        if (window.innerWidth < 1024) onToggle();
                      }}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
              onClick={onLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 lg:hidden bg-white shadow-md"
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}