import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock, 
  Heart, 
  Activity,
  DollarSign,
  Stethoscope,
  UserPlus,
  CalendarPlus,
  PlusCircle,
  BarChart3,
  Eye,
  Settings,
  Bell,
  Search,
  Send,
  PieChart,
  RefreshCw,
  Filter,
  User
} from 'lucide-react';
import { User } from '../../types/user';
import { mockCitas, mockPacientes, mockMedicos } from '@/data/mockData';
import { Cita, Paciente, Medico } from '@/types/medical';
import GestionPacientes from '../medicos/GestionPacientes';
import GestionCitas from '../medicos/GestionCitas';
import CrearReceta from '../medicos/CrearReceta';
import ReportesMedicos from '../medicos/ReportesMedicos';
import NotificacionesPush from '../medicos/NotificacionesPush';
import BusquedaAvanzada from '../medicos/BusquedaAvanzada';
import ReportesAutomaticos from '../medicos/ReportesAutomaticos';
import GraficosInteractivos from '../medicos/GraficosInteractivos';

interface MedicoDashboardProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export default function MedicoDashboard({ user, activeSection, onSectionChange, onLogout }: MedicoDashboardProps) {
  const { metrics, isUpdating, updateMetrics } = useRealTimeMetrics(30000); // 30 segundos
  
  // Estados para citas del médico
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes] = useState<Paciente[]>(mockPacientes);
  const [medicos] = useState<Medico[]>(mockMedicos);
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de citas del médico
    setTimeout(() => {
      setCitas(mockCitas);
      setLoading(false);
    }, 1000);
  }, []);

  const obtenerPaciente = (id: string) => pacientes.find(p => p.id === id);
  const obtenerMedico = (id: string) => medicos.find(m => m.id === id);

  // Filtrar citas del médico logueado
  const citasDelMedico = citas.filter(cita => cita.medicoId === user.id);
  
  // Citas del día actual
  const fechaHoy = new Date().toISOString().split('T')[0];
  const citasHoy = citasDelMedico.filter(cita => cita.fecha === fechaHoy);
  
  // Citas del día filtrado
  const citasDelDia = citasDelMedico.filter(cita => cita.fecha === fechaFiltro);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'En Curso':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Completada':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Cancelada':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'No Asistió':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Programada': return <Clock className="w-4 h-4" />;
      case 'En Curso': return <Activity className="w-4 h-4" />;
      case 'Completada': return <Eye className="w-4 h-4" />;
      case 'Cancelada': return <RefreshCw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const cambiarEstadoCita = (citaId: string, nuevoEstado: Cita['estado']) => {
    setCitas(citas.map(cita => 
      cita.id === citaId ? { ...cita, estado: nuevoEstado } : cita
    ));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'patients':
        return <GestionPacientes medicoId={user.id} />;
      case 'appointments':
        return <GestionCitas medicoId={user.id} medicoNombre={user.nombres || 'Doctor'} />;
      case 'prescriptions':
        return (
          <CrearReceta 
            medicoId={user.id} 
            medicoNombre={user.nombres || 'Doctor'} 
            numeroColMedico="12345"
          />
        );
      case 'reports':
        return (
          <ReportesMedicos 
            medicoId={user.id} 
            medicoNombre={user.nombres || 'Doctor'}
          />
        );
      case 'notifications':
        return (
          <NotificacionesPush 
            medicoId={user.id} 
            medicoNombre={user.nombres || 'Doctor'}
          />
        );
      case 'search':
        return (
          <BusquedaAvanzada 
            medicoId={user.id}
          />
        );
      case 'automatic-reports':
        return (
          <ReportesAutomaticos 
            medicoId={user.id} 
            medicoNombre={user.nombres || 'Doctor'}
          />
        );
      case 'charts':
        return (
          <GraficosInteractivos 
            medicoId={user.id} 
            medicoNombre={user.nombres || 'Doctor'}
          />
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Mi Perfil</h2>
              <p className="text-slate-600 dark:text-slate-400">Información personal y profesional</p>
            </div>
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Nombre Completo</label>
                    <p className="font-medium dark:text-slate-100">{user.nombres} {user.apellidos}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Cédula</label>
                    <p className="font-medium dark:text-slate-100">V-{user.cedula}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
                    <p className="font-medium dark:text-slate-100">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Teléfono</label>
                    <p className="font-medium dark:text-slate-100">{user.telefono}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  Bienvenido, Dr. {user.nombres}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Panel de control médico - {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={updateMetrics}
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  className="dark:border-slate-600 dark:text-slate-300"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                  <Activity className="h-3 w-3 mr-1" />
                  En tiempo real
                </Badge>
              </div>
            </div>

            {/* Estadísticas principales con animaciones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className={`border-l-4 border-l-blue-500 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 ${isUpdating ? 'animate-pulse-slow' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pacientes Totales</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{metrics.pacientesTotal}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+{metrics.pacientesNuevos} este mes</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-l-4 border-l-green-500 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 ${isUpdating ? 'animate-pulse-slow' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Citas Hoy</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{citasHoy.length}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{citasDelMedico.length} total programadas</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-l-4 border-l-purple-500 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 ${isUpdating ? 'animate-pulse-slow' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Recetas Emitidas</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{metrics.recetasEmitidas}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Este mes</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-l-4 border-l-orange-500 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 ${isUpdating ? 'animate-pulse-slow' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos del Mes</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">${metrics.ingresosMes.toLocaleString()}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+12% vs mes anterior</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Última actualización */}
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Última actualización: {new Date(metrics.lastUpdate).toLocaleTimeString('es-ES')}
              </p>
            </div>

            {/* Acciones rápidas principales */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Acciones Principales</span>
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Accede rápidamente a las funciones más utilizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => onSectionChange('patients')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm">Gestionar Pacientes</span>
                  </Button>
                  
                  <Button
                    onClick={() => onSectionChange('appointments')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <CalendarPlus className="h-6 w-6" />
                    <span className="text-sm">Programar Cita</span>
                  </Button>
                  
                  <Button
                    onClick={() => onSectionChange('prescriptions')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <PlusCircle className="h-6 w-6" />
                    <span className="text-sm">Crear Receta</span>
                  </Button>
                  
                  <Button
                    onClick={() => onSectionChange('reports')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">Ver Reportes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nuevos módulos avanzados */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Módulos Avanzados</span>
                  <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">NUEVO</Badge>
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Herramientas profesionales para gestión médica avanzada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => onSectionChange('notifications')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Bell className="h-6 w-6" />
                    <span className="text-sm">Notificaciones</span>
                  </Button>
                  
                  <Button
                    onClick={() => onSectionChange('search')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Search className="h-6 w-6" />
                    <span className="text-sm">Búsqueda Avanzada</span>
                  </Button>
                  
                  <Button
                    onClick={() => onSectionChange('automatic-reports')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Send className="h-6 w-6" />
                    <span className="text-sm">Reportes Automáticos</span>
                  </Button>
                  
                  <Button
                    onClick={() => onSectionChange('charts')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <PieChart className="h-6 w-6" />
                    <span className="text-sm">Gráficos Interactivos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pacientes citados para hoy y filtro de días futuros */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Pacientes Citados Hoy</span>
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    {citasHoy.length} pacientes programados para hoy - Solo puedes atender hoy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : citasHoy.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay pacientes citados para hoy</p>
                      </div>
                    ) : (
                      citasHoy.map((cita) => {
                        const paciente = obtenerPaciente(cita.pacienteId);
                        const esHoy = cita.fecha === fechaHoy;
                        
                        return (
                          <div key={cita.id} className="flex items-center justify-between p-3 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                              <div>
                                <p className="font-medium dark:text-slate-100">{paciente?.nombre} {paciente?.apellido}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{cita.hora} - {cita.tipo}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Motivo: {cita.motivo}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getEstadoColor(cita.estado)}>
                                {getEstadoIcon(cita.estado)}
                                <span className="ml-1">{cita.estado}</span>
                              </Badge>
                              {esHoy && cita.estado === 'Programada' && (
                                <Button
                                  size="sm"
                                  onClick={() => cambiarEstadoCita(cita.id, 'En Curso')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Atender
                                </Button>
                              )}
                              {esHoy && cita.estado === 'En Curso' && (
                                <Button
                                  size="sm"
                                  onClick={() => cambiarEstadoCita(cita.id, 'Completada')}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Completar
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => onSectionChange('appointments')}
                  >
                    Ver todas las citas
                  </Button>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                    <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Consultar Citas Futuras</span>
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Revisa las citas programadas para otros días (solo consulta)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                        Seleccionar fecha
                      </label>
                      <Input
                        type="date"
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {citasDelDia.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No hay citas para esta fecha</p>
                        </div>
                      ) : (
                        citasDelDia.map((cita) => {
                          const paciente = obtenerPaciente(cita.pacienteId);
                          const esFuturo = cita.fecha > fechaHoy;
                          
                          return (
                            <div key={cita.id} className={`p-3 border rounded-lg ${esFuturo ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <div>
                                    <p className="font-medium text-sm dark:text-slate-100">{paciente?.nombre} {paciente?.apellido}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{cita.hora} - {cita.tipo}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {cita.estado}
                                  </Badge>
                                  {esFuturo && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                                      Futuro
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {esFuturo && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  Solo consulta - No se puede atender hasta la fecha programada
                                </p>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen semanal */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span>Resumen Semanal</span>
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Estadísticas de la semana actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm dark:text-slate-300">Pacientes atendidos</span>
                    </div>
                    <span className="font-medium dark:text-slate-100">38</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm dark:text-slate-300">Satisfacción promedio</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium dark:text-slate-100">{metrics.satisfaccionPromedio.toFixed(1)}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/5.0</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm dark:text-slate-300">Recetas emitidas</span>
                    </div>
                    <span className="font-medium dark:text-slate-100">{metrics.recetasEmitidas}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm dark:text-slate-300">Ingresos generados</span>
                    </div>
                    <span className="font-medium dark:text-slate-100">${(metrics.ingresosMes * 0.25).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => onSectionChange('charts')}
                >
                  Ver gráficos detallados
                </Button>
              </CardContent>
            </Card>

            {/* Alertas y notificaciones */}
            <div className="space-y-4">
              <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Tienes {citasHoy.filter(c => c.estado === 'Programada').length} pacientes pendientes de atender hoy.</span>
                  </div>
                </AlertDescription>
              </Alert>
              
              <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <AlertDescription className="text-blue-800 dark:text-blue-300">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4" />
                    <span>Recuerda actualizar el historial médico de los pacientes atendidos.</span>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
                <AlertDescription className="text-indigo-800 dark:text-indigo-300">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>¡Nuevos módulos disponibles! Explora las herramientas avanzadas de notificaciones, búsqueda y gráficos.</span>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );
    }
  };

  return renderContent();
}