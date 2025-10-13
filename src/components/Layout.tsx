import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Pill, 
  FileText, 
  BarChart3, 
  Search, 
  Bell, 
  TrendingUp,
  Menu, 
  X, 
  Home,
  Settings,
  LogOut,
  User,
  Heart,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
}

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      description: 'Panel principal'
    },
    {
      path: '/agenda',
      label: 'Agenda Médica',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Gestión de citas',
      badge: '23'
    },
    {
      path: '/recetas',
      label: 'Recetario Digital',
      icon: <Pill className="w-5 h-5" />,
      description: 'Prescripciones médicas',
      badge: '15'
    },
    {
      path: '/historiales',
      label: 'Historial Médico',
      icon: <FileText className="w-5 h-5" />,
      description: 'Registros médicos'
    },
    {
      path: '/reportes',
      label: 'Reportes Médicos',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Análisis y estadísticas'
    },
    {
      path: '/busqueda',
      label: 'Búsqueda Avanzada',
      icon: <Search className="w-5 h-5" />,
      description: 'Motor de búsqueda IA'
    },
    {
      path: '/notificaciones',
      label: 'Notificaciones',
      icon: <Bell className="w-5 h-5" />,
      description: 'Alertas y recordatorios',
      badge: '3'
    },
    {
      path: '/graficos',
      label: 'Gráficos Interactivos',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Visualización de datos'
    }
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <Heart className="w-8 h-8 text-red-500" />
                <Activity className="w-4 h-4 text-blue-600 absolute top-2 left-2" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EstiloLibre</h1>
                <p className="text-xs text-gray-500">Sistema Médico Integral</p>
              </div>
            </Link>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <Link to="/notificaciones">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-4 flex items-center justify-center rounded-full">
                  3
                </Badge>
              </Button>
            </Link>

            {/* Usuario */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Dr. Admin</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>

            {/* Configuración */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
              <span className="text-lg font-semibold text-gray-900">Menú</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navegación */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group
                    ${isActiveRoute(item.path)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <div className={`
                    ${isActiveRoute(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`
                        text-sm font-medium truncate
                        ${isActiveRoute(item.path) ? 'text-blue-700' : 'text-gray-900'}
                      `}>
                        {item.label}
                      </p>
                      {item.badge && (
                        <Badge 
                          variant={isActiveRoute(item.path) ? 'default' : 'secondary'}
                          className="ml-2 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={`
                      text-xs truncate
                      ${isActiveRoute(item.path) ? 'text-blue-600' : 'text-gray-500'}
                    `}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Footer del sidebar */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Estado del Sistema</span>
                </div>
                <div className="space-y-1 text-xs text-blue-700">
                  <div className="flex justify-between">
                    <span>Pacientes Activos:</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Citas Hoy:</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sistema:</span>
                    <span className="font-medium text-green-600">●Online</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-0">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Indicador de estado flotante */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-full shadow-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 font-medium">Sistema Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;