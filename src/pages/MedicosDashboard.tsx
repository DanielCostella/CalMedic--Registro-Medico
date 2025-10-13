import React, { useState } from 'react';
import { 
  Stethoscope, Users, Calendar, FileText, Pill, FolderOpen, 
  TestTube, HardDrive, BarChart3, Bell, Activity, UserCheck, 
  Link, Video, Zap, Search, MessageCircle, TrendingUp, 
  Camera, Palette, Baby, Eye, Scissors, Scale, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Importar componentes especializados
import EspecialidadSelectorComponent from '@/components/medicos/EspecialidadSelector';
import OdontologiaModuleComponent from '@/components/medicos/OdontologiaModule';
import PediatriaModuleComponent from '@/components/medicos/PediatriaModule';
import OftalmologiaModuleComponent from '@/components/medicos/OftalmologiaModule';
import CirugiaModuleComponent from '@/components/medicos/CirugiaModule';
import BariatricaModuleComponent from '@/components/medicos/BariatricaModule';

// Importar componentes existentes
import NotificacionesPushComponent from '@/components/medicos/NotificacionesPush';
import GestionPacientesComponent from '@/components/medicos/GestionPacientes';
import GestionCitasComponent from '@/components/medicos/GestionCitas';
import HistorialMedicoComponent from '@/components/medicos/HistorialMedico';
import RecetarioDigitalComponent from '@/components/medicos/RecetarioDigital';
import SistemaArchivosComponent from '@/components/medicos/SistemaArchivos';
import IntegracionLaboratoriosComponent from '@/components/medicos/IntegracionLaboratorios';
import SistemaBackupComponent from '@/components/medicos/SistemaBackup';
import ReportesAvanzadosComponent from '@/components/medicos/ReportesAvanzados';
import InformesMedicosComponent from '@/components/medicos/InformesMedicos';
import SistemaUsuariosComponent from '@/components/medicos/SistemaUsuarios';
import IntegracionesExternasComponent from '@/components/medicos/IntegracionesExternas';
import TelemedicinaComponent from '@/components/medicos/Telemedicina';
import OptimizacionesAvanzadasComponent from '@/components/medicos/OptimizacionesAvanzadas';
import ChatbotMedicoComponent from '@/components/medicos/ChatbotMedico';
import DashboardEjecutivoComponent from '@/components/medicos/DashboardEjecutivo';
import NotificacionesMejoradasComponent from '@/components/medicos/NotificacionesMejoradas';
import CamaraIntegradaComponent from '@/components/medicos/CamaraIntegrada';
import GlobalSearchComponent from '@/components/ui/global-search';
import ThemeToggleComponent from '@/components/ui/theme-toggle';

interface ModuloMedico {
  id: string;
  nombre: string;
  descripcion: string;
  icono: React.ReactNode;
  color: string;
  categoria: 'general' | 'especializado';
  especialidades?: string[];
  componente: React.ComponentType;
  nuevo?: boolean;
}

const MedicosDashboard: React.FC = () => {
  const [moduloActivo, setModuloActivo] = useState<string | null>(null);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<string>('general');
  const [chatbotMinimizado, setChatbotMinimizado] = useState(true);
  const [chatbotVisible, setChatbotVisible] = useState(true);

  const modulos: ModuloMedico[] = [
    // Módulos generales (siempre visibles)
    {
      id: 'dashboard',
      nombre: 'Dashboard Principal',
      descripcion: 'Panel principal con estadísticas y resumen general',
      icono: <Activity className="w-5 h-5" />,
      color: 'bg-blue-500',
      categoria: 'general',
      componente: () => <DashboardPrincipal />
    },
    {
      id: 'dashboard-ejecutivo',
      nombre: 'Dashboard Ejecutivo',
      descripcion: 'KPIs y métricas gerenciales avanzadas',
      icono: <TrendingUp className="w-5 h-5" />,
      color: 'bg-purple-500',
      categoria: 'general',
      componente: DashboardEjecutivoComponent,
      nuevo: true
    },
    {
      id: 'pacientes',
      nombre: 'Gestión de Pacientes',
      descripcion: 'Registro y administración completa de pacientes',
      icono: <Users className="w-5 h-5" />,
      color: 'bg-green-500',
      categoria: 'general',
      componente: GestionPacientesComponent
    },
    {
      id: 'citas',
      nombre: 'Sistema de Citas',
      descripcion: 'Programación y gestión de citas médicas',
      icono: <Calendar className="w-5 h-5" />,
      color: 'bg-orange-500',
      categoria: 'general',
      componente: GestionCitasComponent
    },
    {
      id: 'historial',
      nombre: 'Historial Médico',
      descripcion: 'Historial clínico completo con exámenes e interconsultas',
      icono: <FileText className="w-5 h-5" />,
      color: 'bg-indigo-500',
      categoria: 'general',
      componente: HistorialMedicoComponent
    },
    {
      id: 'recetario',
      nombre: 'Recetario Digital',
      descripcion: 'Prescripción digital con verificación de interacciones',
      icono: <Pill className="w-5 h-5" />,
      color: 'bg-red-500',
      categoria: 'general',
      componente: RecetarioDigitalComponent
    },
    {
      id: 'archivos',
      nombre: 'Sistema de Archivos',
      descripcion: 'Gestión de documentos médicos y archivos DICOM',
      icono: <FolderOpen className="w-5 h-5" />,
      color: 'bg-yellow-500',
      categoria: 'general',
      componente: SistemaArchivosComponent
    },
    {
      id: 'camara-ocr',
      nombre: 'Cámara con OCR',
      descripcion: 'Captura y procesamiento automático de documentos médicos',
      icono: <Camera className="w-5 h-5" />,
      color: 'bg-cyan-500',
      categoria: 'general',
      componente: CamaraIntegradaComponent,
      nuevo: true
    },
    {
      id: 'laboratorios',
      nombre: 'Integración Laboratorios',
      descripcion: 'Recepción automática de resultados de laboratorio',
      icono: <TestTube className="w-5 h-5" />,
      color: 'bg-pink-500',
      categoria: 'general',
      componente: IntegracionLaboratoriosComponent
    },
    {
      id: 'backup',
      nombre: 'Sistema de Backup',
      descripcion: 'Respaldo automático y seguridad de datos',
      icono: <HardDrive className="w-5 h-5" />,
      color: 'bg-gray-500',
      categoria: 'general',
      componente: SistemaBackupComponent
    },
    {
      id: 'reportes',
      nombre: 'Reportes Avanzados',
      descripcion: 'Generación de reportes personalizables y analytics',
      icono: <BarChart3 className="w-5 h-5" />,
      color: 'bg-teal-500',
      categoria: 'general',
      componente: ReportesAvanzadosComponent
    },
    {
      id: 'notificaciones',
      nombre: 'Notificaciones Push',
      descripcion: 'Sistema de notificaciones en tiempo real',
      icono: <Bell className="w-5 h-5" />,
      color: 'bg-amber-500',
      categoria: 'general',
      componente: NotificacionesPushComponent
    },
    {
      id: 'notificaciones-plus',
      nombre: 'Notificaciones+',
      descripcion: 'Sistema avanzado de notificaciones multicanal',
      icono: <Bell className="w-5 h-5" />,
      color: 'bg-violet-500',
      categoria: 'general',
      componente: NotificacionesMejoradasComponent,
      nuevo: true
    },
    {
      id: 'analytics',
      nombre: 'Analytics e Informes',
      descripcion: 'Dashboard de métricas y análisis de datos',
      icono: <Activity className="w-5 h-5" />,
      color: 'bg-emerald-500',
      categoria: 'general',
      componente: InformesMedicosComponent
    },
    {
      id: 'usuarios',
      nombre: 'Gestión de Usuarios',
      descripcion: 'Administración de usuarios, roles y permisos',
      icono: <UserCheck className="w-5 h-5" />,
      color: 'bg-slate-500',
      categoria: 'general',
      componente: SistemaUsuariosComponent
    },
    {
      id: 'integraciones',
      nombre: 'Integraciones Externas',
      descripcion: 'Conexiones con APIs y servicios externos',
      icono: <Link className="w-5 h-5" />,
      color: 'bg-rose-500',
      categoria: 'general',
      componente: IntegracionesExternasComponent
    },
    {
      id: 'telemedicina',
      nombre: 'Telemedicina',
      descripcion: 'Consultas virtuales y videollamadas médicas',
      icono: <Video className="w-5 h-5" />,
      color: 'bg-sky-500',
      categoria: 'general',
      componente: TelemedicinaComponent
    },
    {
      id: 'optimizaciones',
      nombre: 'Optimizaciones PWA',
      descripcion: 'Progressive Web App y optimizaciones avanzadas',
      icono: <Zap className="w-5 h-5" />,
      color: 'bg-lime-500',
      categoria: 'general',
      componente: OptimizacionesAvanzadasComponent
    },
    {
      id: 'chatbot',
      nombre: 'Chatbot Médico',
      descripcion: 'Asistente virtual con IA para consultas médicas básicas',
      icono: <MessageCircle className="w-5 h-5" />,
      color: 'bg-fuchsia-500',
      categoria: 'general',
      componente: ChatbotMedicoComponent,
      nuevo: true
    },

    // Módulos especializados
    {
      id: 'odontologia',
      nombre: 'Odontología',
      descripcion: 'Odontograma digital y gestión de tratamientos dentales',
      icono: <Zap className="w-5 h-5" />,
      color: 'bg-green-600',
      categoria: 'especializado',
      especialidades: ['odontologia'],
      componente: OdontologiaModuleComponent,
      nuevo: true
    },
    {
      id: 'pediatria',
      nombre: 'Pediatría',
      descripcion: 'Curvas de crecimiento y seguimiento pediátrico integral',
      icono: <Baby className="w-5 h-5" />,
      color: 'bg-pink-600',
      categoria: 'especializado',
      especialidades: ['pediatria'],
      componente: PediatriaModuleComponent,
      nuevo: true
    },
    {
      id: 'oftalmologia',
      nombre: 'Oftalmología',
      descripcion: 'Evaluación ocular completa y prescripción de lentes',
      icono: <Eye className="w-5 h-5" />,
      color: 'bg-purple-600',
      categoria: 'especializado',
      especialidades: ['oftalmologia'],
      componente: OftalmologiaModuleComponent,
      nuevo: true
    },
    {
      id: 'cirugia',
      nombre: 'Cirugía General',
      descripcion: 'Seguimiento pre, intra y post operatorio completo',
      icono: <Scissors className="w-5 h-5" />,
      color: 'bg-red-600',
      categoria: 'especializado',
      especialidades: ['cirugia'],
      componente: CirugiaModuleComponent,
      nuevo: true
    },
    {
      id: 'bariatrica',
      nombre: 'Cirugía Bariátrica',
      descripcion: 'Seguimiento especializado de cirugía de pérdida de peso',
      icono: <Scale className="w-5 h-5" />,
      color: 'bg-orange-600',
      categoria: 'especializado',
      especialidades: ['bariatrica'],
      componente: BariatricaModuleComponent,
      nuevo: true
    }
  ];

  // Filtrar módulos según la especialidad seleccionada
  const modulosFiltrados = modulos.filter(modulo => {
    if (modulo.categoria === 'general') return true;
    if (modulo.categoria === 'especializado') {
      return modulo.especialidades?.includes(especialidadSeleccionada);
    }
    return false;
  });

  const ModuloActivo = moduloActivo ? modulos.find(m => m.id === moduloActivo)?.componente : null;

  if (ModuloActivo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Button 
                variant="ghost" 
                onClick={() => setModuloActivo(null)}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Volver al Dashboard</span>
                <span className="xs:hidden">Volver</span>
              </Button>
              
              <div className="flex items-center gap-1 sm:gap-4">
                <div className="hidden sm:block">
                  <GlobalSearchComponent />
                </div>
                <ThemeToggleComponent />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <ModuloActivo />
        </div>
        
        {chatbotVisible && (
          <ChatbotMedicoComponent 
            isMinimized={chatbotMinimizado}
            onToggleMinimize={() => setChatbotMinimizado(!chatbotMinimizado)}
            onClose={() => setChatbotVisible(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">
                  Sistema Médico Integral
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Dashboard Principal - {modulosFiltrados.length} módulos disponibles
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
              <div className="hidden md:block">
                <GlobalSearchComponent />
              </div>
              <ThemeToggleComponent />
              <Badge className="bg-green-100 text-green-800 text-xs hidden lg:inline-flex">
                Sistema Completo + Especialidades
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Selector de Especialidad - Responsive */}
        <div className="mb-6 sm:mb-8">
          <EspecialidadSelectorComponent 
            onEspecialidadChange={setEspecialidadSeleccionada}
            especialidadActual={especialidadSeleccionada}
          />
        </div>

        {/* Estadísticas rápidas - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Módulos Disponibles</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{modulosFiltrados.length}</p>
                </div>
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Módulos Nuevos</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {modulosFiltrados.filter(m => m.nuevo).length}
                  </p>
                </div>
                <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Especialidad Activa</p>
                  <p className="text-sm sm:text-lg font-bold text-purple-600 capitalize truncate">
                    {especialidadSeleccionada === 'general' ? 'Medicina General' : especialidadSeleccionada}
                  </p>
                </div>
                <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Sistema</p>
                  <p className="text-sm sm:text-lg font-bold text-orange-600">100% Funcional</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de módulos - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {modulosFiltrados.map((modulo) => (
            <Card 
              key={modulo.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 relative"
              onClick={() => setModuloActivo(modulo.id)}
            >
              {modulo.nuevo && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white z-10 text-xs">
                  Nuevo
                </Badge>
              )}
              
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${modulo.color} text-white`}>
                    {modulo.icono}
                  </div>
                  {modulo.categoria === 'especializado' && (
                    <Badge variant="outline" className="text-xs">
                      Especializado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardTitle className="text-sm sm:text-lg mb-2 line-clamp-2">{modulo.nombre}</CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{modulo.descripcion}</p>
                
                <Button className="w-full" size="sm">
                  Abrir Módulo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional - Responsive */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Sistema Médico Integral Completo + Especialidades
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {modulosFiltrados.length} módulos funcionales con especialidades médicas integradas
            </p>
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              <Badge className="bg-blue-100 text-blue-800 text-xs">PWA Completa</Badge>
              <Badge className="bg-green-100 text-green-800 text-xs">Tiempo Real</Badge>
              <Badge className="bg-purple-100 text-purple-800 text-xs">Especialidades</Badge>
              <Badge className="bg-orange-100 text-orange-800 text-xs">IA Integrada</Badge>
              <Badge className="bg-pink-100 text-pink-800 text-xs hidden sm:inline-flex">Temas Personalizables</Badge>
              <Badge className="bg-cyan-100 text-cyan-800 text-xs hidden sm:inline-flex">Búsqueda Global</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot flotante - Responsive */}
      {chatbotVisible && (
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50">
          <ChatbotMedicoComponent 
            isMinimized={chatbotMinimizado}
            onToggleMinimize={() => setChatbotMinimizado(!chatbotMinimizado)}
            onClose={() => setChatbotVisible(false)}
          />
        </div>
      )}
    </div>
  );
};

// Componente del Dashboard Principal - Responsive
const DashboardPrincipal: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Dashboard Principal</h2>
          <p className="text-sm sm:text-base text-gray-600">Resumen general del sistema médico</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pacientes Registrados</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">1,247</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Citas Hoy</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">28</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Recetas Emitidas</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">156</p>
              </div>
              <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Laboratorios Pendientes</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">12</p>
              </div>
              <TestTube className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm flex-1">Nueva cita programada - Dr. García</p>
                <span className="text-xs text-gray-500">Hace 5 min</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm flex-1">Resultado de laboratorio recibido</p>
                <span className="text-xs text-gray-500">Hace 12 min</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm flex-1">Receta digital emitida</p>
                <span className="text-xs text-gray-500">Hace 18 min</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm flex-1">Backup automático completado</p>
                <span className="text-xs text-gray-500">Hace 1 hora</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Módulos Activos</span>
                <Badge className="bg-green-100 text-green-800 text-xs">24/24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Integraciones</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Conectadas</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Backup</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Actualizado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Rendimiento</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Óptimo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Seguridad</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Protegido</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicosDashboard;