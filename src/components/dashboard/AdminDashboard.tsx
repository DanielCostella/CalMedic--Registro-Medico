import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Settings, LogOut, BarChart3, Shield, CheckSquare } from 'lucide-react';
import { User } from '../../types/user';
import DoctorApproval from './DoctorApproval';
import { supabase } from '@/lib/supabase';

interface AdminDashboardProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ user, activeSection, onSectionChange, onLogout }: AdminDashboardProps) {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'approvals'
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    pendingRequests: 0,
    mrr: 0
  });

  useEffect(() => {
    async function fetchStats() {
      // 1. Total Users (Profiles)
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. Active Doctors (Subscriptions proxy)
      const { count: activeCount } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true })
        .eq('license_status', 'Active');

      // 3. Pending Requests
      const { count: pendingCount } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true })
        .eq('license_status', 'In Review');

      // 4. MRR Calculation (Example: $30 per active doctor)
      const calculatedMRR = (activeCount || 0) * 30;

      setStats({
        totalUsers: userCount || 0,
        activeSubscriptions: activeCount || 0,
        pendingRequests: pendingCount || 0,
        mrr: calculatedMRR
      });
    }

    fetchStats();
  }, [view]); // Refresh when switching back from approval view

  if (view === 'approvals') {
     return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
             <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">Administración</h1>
                    <Button variant="ghost" onClick={() => setView('dashboard')}>Volver al Panel</Button>
                </div>
             </header>
             <main className="max-w-4xl mx-auto p-6">
                <DoctorApproval />
             </main>
        </div>
     );
  }

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
                Admin: {user.firstNames} {user.lastNames}
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
                    <p className="text-sm font-medium text-slate-600">Usuarios Totales SaaS</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.totalUsers}</p>
                    <p className="text-xs text-green-600 mt-1">Registrados en plataforma</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Suscripciones Activas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</p>
                    <p className="text-xs text-slate-500 mt-1">Profesionales aprobados</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Solicitudes Pendientes</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
                    <p className="text-xs text-orange-600 mt-1">Requieren revisión</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Ingresos Mensuales (Est.)</p>
                    <p className="text-2xl font-bold text-purple-600">${stats.mrr}</p>
                    <p className="text-xs text-slate-500 mt-1">Base: $30/profesional</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
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

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setView('approvals')}>
              <CardContent className="p-6 text-center">
                <CheckSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Aprobaciones</h3>
                <p className="text-sm text-slate-600">Revisar registros de profesionales pendientes</p>
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