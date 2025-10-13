import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, Settings, LogOut } from 'lucide-react';
import { User as UserType } from '../../types/user';

interface UserDashboardProps {
  user: UserType;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export default function UserDashboard({ user, activeSection, onSectionChange, onLogout }: UserDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EL</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">EstiloLibre</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Hola, {user.nombres} {user.apellidos}
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
              Bienvenido, {user.nombres}
            </h2>
            <p className="text-slate-600 mt-2">
              Panel de usuario - EstiloLibre
            </p>
          </div>

          {/* User Info Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Información Personal</span>
              </CardTitle>
              <CardDescription>
                Datos de tu perfil en EstiloLibre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Nombre Completo</p>
                  <p className="text-slate-800">{user.nombres} {user.apellidos}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Identificación</p>
                  <p className="text-slate-800">{user.rifInitial}{user.cedula}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Email</p>
                  <p className="text-slate-800">{user.correoElectronico}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Teléfono</p>
                  <p className="text-slate-800">{user.telefonoMovil}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Sexo</p>
                  <p className="text-slate-800">{user.sexo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Fecha de Nacimiento</p>
                  <p className="text-slate-800">{new Date(user.fechaNacimiento).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-slate-600">Dirección</p>
                  <p className="text-slate-800">{user.direccion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Mis Citas</h3>
                <p className="text-sm text-slate-600">Ver y gestionar tus citas médicas</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Mi Perfil</h3>
                <p className="text-sm text-slate-600">Actualizar información personal</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Configuración</h3>
                <p className="text-sm text-slate-600">Ajustes de cuenta y privacidad</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}