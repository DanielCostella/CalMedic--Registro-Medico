import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Settings, LogOut, BarChart3, Shield } from 'lucide-react';
import { User } from '../../types/user';

interface AdminDashboardProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ user, activeSection, onSectionChange, onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EL</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">EstiloLibre - Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Admin: {user.nombres} {user.apellidos}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800">
              Panel de Administración
            </h2>
            <p className="text-slate-600 mt-2">
              Gestiona usuarios y configuraciones del sistema
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Usuarios</p>
                    <p className="text-2xl font-bold text-slate-800">156</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Médicos</p>
                    <p className="text-2xl font-bold text-green-600">24</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Nuevos (7 días)</p>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Activos</p>
                    <p className="text-2xl font-bold text-orange-600">142</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Gestionar Usuarios</h3>
                <p className="text-sm text-slate-600">Ver, editar y administrar usuarios del sistema</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <UserPlus className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Crear Médico</h3>
                <p className="text-sm text-slate-600">Registrar nuevos profesionales médicos</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Configuración</h3>
                <p className="text-sm text-slate-600">Ajustes del sistema y parámetros</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Nuevo médico registrado</p>
                    <p className="text-xs text-slate-600">Dr. María Silva se registró en el sistema</p>
                  </div>
                  <span className="text-xs text-slate-500">Hace 2 horas</span>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Usuario actualizado</p>
                    <p className="text-xs text-slate-600">Juan Pérez actualizó su perfil</p>
                  </div>
                  <span className="text-xs text-slate-500">Hace 4 horas</span>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Configuración modificada</p>
                    <p className="text-xs text-slate-600">Parámetros del sistema actualizados</p>
                  </div>
                  <span className="text-xs text-slate-500">Hace 1 día</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}