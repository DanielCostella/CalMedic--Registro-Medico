import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, AlertTriangle, Calendar, Pill, UserCheck, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Notificacion {
  id: string;
  tipo: 'cita' | 'medicamento' | 'interconsulta' | 'seguimiento' | 'urgente';
  titulo: string;
  mensaje: string;
  fecha: string;
  hora: string;
  leida: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  accionRequerida?: boolean;
  pacienteId?: string;
  pacienteNombre?: string;
}

interface ConfiguracionNotificaciones {
  citas: boolean;
  medicamentos: boolean;
  interconsultas: boolean;
  seguimientos: boolean;
  urgentes: boolean;
  sonido: boolean;
  email: boolean;
  horarioInicio: string;
  horarioFin: string;
}

const NotificacionesPushComponent: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [notificacionSeleccionada, setNotificacionSeleccionada] = useState<Notificacion | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  const [filtroLeidas, setFiltroLeidas] = useState<string>('todas');

  const [configuracion, setConfiguracion] = useState<ConfiguracionNotificaciones>({
    citas: true,
    medicamentos: true,
    interconsultas: true,
    seguimientos: true,
    urgentes: true,
    sonido: true,
    email: false,
    horarioInicio: '08:00',
    horarioFin: '18:00'
  });

  useEffect(() => {
    // Simular carga de notificaciones
    setTimeout(() => {
      const notificacionesIniciales: Notificacion[] = [
        {
          id: '1',
          tipo: 'cita',
          titulo: 'Cita próxima',
          mensaje: 'Cita con María González en 30 minutos - Consulta de control',
          fecha: new Date().toISOString().split('T')[0],
          hora: '14:30',
          leida: false,
          prioridad: 'alta',
          accionRequerida: true,
          pacienteId: '1',
          pacienteNombre: 'María González'
        },
        {
          id: '2',
          tipo: 'medicamento',
          titulo: 'Medicamento vencido',
          mensaje: 'El Atenolol de Carlos Rodríguez vence mañana - Renovar prescripción',
          fecha: new Date().toISOString().split('T')[0],
          hora: '12:15',
          leida: false,
          prioridad: 'media',
          accionRequerida: true,
          pacienteId: '2',
          pacienteNombre: 'Carlos Rodríguez'
        },
        {
          id: '3',
          tipo: 'interconsulta',
          titulo: 'Respuesta de interconsulta',
          mensaje: 'Dr. Pérez (Cardiología) respondió la interconsulta de Ana Martínez',
          fecha: new Date().toISOString().split('T')[0],
          hora: '11:45',
          leida: false,
          prioridad: 'media',
          accionRequerida: true,
          pacienteId: '3',
          pacienteNombre: 'Ana Martínez'
        },
        {
          id: '4',
          tipo: 'seguimiento',
          titulo: 'Seguimiento pendiente',
          mensaje: 'Luis García requiere seguimiento post-operatorio - 7 días desde cirugía',
          fecha: new Date().toISOString().split('T')[0],
          hora: '10:20',
          leida: true,
          prioridad: 'media',
          pacienteId: '4',
          pacienteNombre: 'Luis García'
        },
        {
          id: '5',
          tipo: 'urgente',
          titulo: 'Resultado crítico',
          mensaje: 'Resultado de laboratorio crítico para Elena Torres - Contactar inmediatamente',
          fecha: new Date().toISOString().split('T')[0],
          hora: '09:30',
          leida: false,
          prioridad: 'alta',
          accionRequerida: true,
          pacienteId: '5',
          pacienteNombre: 'Elena Torres'
        },
        {
          id: '6',
          tipo: 'cita',
          titulo: 'Cita cancelada',
          mensaje: 'Pedro Sánchez canceló su cita de las 16:00 - Reagendar',
          fecha: new Date().toISOString().split('T')[0],
          hora: '08:45',
          leida: true,
          prioridad: 'baja',
          accionRequerida: true,
          pacienteId: '6',
          pacienteNombre: 'Pedro Sánchez'
        }
      ];
      setNotificaciones(notificacionesIniciales);
      setLoading(false);
    }, 1000);

    // Simular notificaciones en tiempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de probabilidad cada 10 segundos
        agregarNotificacionTiempoReal();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const agregarNotificacionTiempoReal = () => {
    const tiposNotificacion = ['cita', 'medicamento', 'interconsulta', 'seguimiento'];
    const tipo = tiposNotificacion[Math.floor(Math.random() * tiposNotificacion.length)] as Notificacion['tipo'];
    
    const mensajes = {
      cita: 'Nueva cita programada para mañana a las 10:00',
      medicamento: 'Recordatorio: Revisar prescripción de Metformina',
      interconsulta: 'Nueva interconsulta recibida de Medicina Interna',
      seguimiento: 'Paciente requiere seguimiento de tratamiento'
    };

    const nuevaNotificacion: Notificacion = {
      id: Date.now().toString(),
      tipo,
      titulo: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - Tiempo Real`,
      mensaje: mensajes[tipo],
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      leida: false,
      prioridad: 'media'
    };

    setNotificaciones(prev => [nuevaNotificacion, ...prev]);
    
    // Mostrar notificación del navegador si está permitido
    if (Notification.permission === 'granted') {
      new Notification(nuevaNotificacion.titulo, {
        body: nuevaNotificacion.mensaje,
        icon: '/favicon.png'
      });
    }
  };

  const solicitarPermisoNotificaciones = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Notificaciones activadas correctamente');
      }
    }
  };

  const marcarComoLeida = (id: string) => {
    setNotificaciones(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const marcarTodasComoLeidas = () => {
    setNotificaciones(prev => 
      prev.map(notif => ({ ...notif, leida: true }))
    );
  };

  const eliminarNotificacion = (id: string) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
  };

  const obtenerIconoTipo = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'cita': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'medicamento': return <Pill className="w-5 h-5 text-green-600" />;
      case 'interconsulta': return <UserCheck className="w-5 h-5 text-orange-600" />;
      case 'seguimiento': return <FileText className="w-5 h-5 text-purple-600" />;
      case 'urgente': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const obtenerColorPrioridad = (prioridad: Notificacion['prioridad']) => {
    switch (prioridad) {
      case 'alta': return 'border-l-red-500 bg-red-50';
      case 'media': return 'border-l-yellow-500 bg-yellow-50';
      case 'baja': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const notificacionesFiltradas = notificaciones.filter(notif => {
    const coincideTipo = filtroTipo === 'todas' || notif.tipo === filtroTipo;
    const coincideLeida = filtroLeidas === 'todas' || 
      (filtroLeidas === 'leidas' && notif.leida) ||
      (filtroLeidas === 'no-leidas' && !notif.leida);
    
    return coincideTipo && coincideLeida;
  });

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;
  const notificacionesUrgentes = notificaciones.filter(n => n.prioridad === 'alta' && !n.leida).length;

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando notificaciones..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-8 h-8 text-blue-600" />
            Notificaciones Push
            {notificacionesNoLeidas > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notificacionesNoLeidas}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">
            Sistema de alertas y recordatorios médicos en tiempo real
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={solicitarPermisoNotificaciones}
            className="bg-blue-50 hover:bg-blue-100 border-blue-200"
          >
            <Bell className="w-4 h-4 mr-2" />
            Activar Notificaciones
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowConfig(true)}
          >
            Configurar
          </Button>
          {notificacionesNoLeidas > 0 && (
            <Button
              onClick={marcarTodasComoLeidas}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Marcar Todas Leídas
            </Button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total</p>
                <p className="text-2xl font-bold">{notificaciones.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">No Leídas</p>
                <p className="text-2xl font-bold">{notificacionesNoLeidas}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Urgentes</p>
                <p className="text-2xl font-bold">{notificacionesUrgentes}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Con Acción</p>
                <p className="text-2xl font-bold">
                  {notificaciones.filter(n => n.accionRequerida && !n.leida).length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="filtro-tipo">Filtrar por tipo:</Label>
              <select
                id="filtro-tipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="todas">Todas las notificaciones</option>
                <option value="cita">Citas</option>
                <option value="medicamento">Medicamentos</option>
                <option value="interconsulta">Interconsultas</option>
                <option value="seguimiento">Seguimientos</option>
                <option value="urgente">Urgentes</option>
              </select>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="filtro-leidas">Estado:</Label>
              <select
                id="filtro-leidas"
                value={filtroLeidas}
                onChange={(e) => setFiltroLeidas(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="todas">Todas</option>
                <option value="no-leidas">No leídas</option>
                <option value="leidas">Leídas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Notificaciones */}
      <div className="space-y-4">
        {notificacionesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay notificaciones que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          notificacionesFiltradas.map(notificacion => (
            <Card 
              key={notificacion.id} 
              className={`border-l-4 ${obtenerColorPrioridad(notificacion.prioridad)} ${
                !notificacion.leida ? 'shadow-md' : 'opacity-75'
              } hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => setNotificacionSeleccionada(notificacion)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {obtenerIconoTipo(notificacion.tipo)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${!notificacion.leida ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notificacion.titulo}
                        </h3>
                        {!notificacion.leida && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        {notificacion.accionRequerida && (
                          <Badge variant="outline" className="text-xs">
                            Acción requerida
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${!notificacion.leida ? 'text-gray-700' : 'text-gray-500'} mb-2`}>
                        {notificacion.mensaje}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notificacion.hora}
                        </span>
                        {notificacion.pacienteNombre && (
                          <span>Paciente: {notificacion.pacienteNombre}</span>
                        )}
                        <Badge 
                          variant={notificacion.prioridad === 'alta' ? 'destructive' : 
                                  notificacion.prioridad === 'media' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {notificacion.prioridad}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!notificacion.leida && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarComoLeida(notificacion.id);
                        }}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarNotificacion(notificacion.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Detalle de Notificación */}
      <Dialog open={!!notificacionSeleccionada} onOpenChange={() => setNotificacionSeleccionada(null)}>
        <DialogContent className="max-w-2xl">
          {notificacionSeleccionada && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {obtenerIconoTipo(notificacionSeleccionada.tipo)}
                  {notificacionSeleccionada.titulo}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {notificacionSeleccionada.fecha} - {notificacionSeleccionada.hora}
                  </span>
                  <Badge 
                    variant={notificacionSeleccionada.prioridad === 'alta' ? 'destructive' : 
                            notificacionSeleccionada.prioridad === 'media' ? 'default' : 'secondary'}
                  >
                    Prioridad {notificacionSeleccionada.prioridad}
                  </Badge>
                  <Badge variant={notificacionSeleccionada.leida ? 'default' : 'destructive'}>
                    {notificacionSeleccionada.leida ? 'Leída' : 'No leída'}
                  </Badge>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>{notificacionSeleccionada.mensaje}</p>
                </div>
                
                {notificacionSeleccionada.pacienteNombre && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm">
                      <strong>Paciente relacionado:</strong> {notificacionSeleccionada.pacienteNombre}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  {!notificacionSeleccionada.leida && (
                    <Button
                      onClick={() => {
                        marcarComoLeida(notificacionSeleccionada.id);
                        setNotificacionSeleccionada(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Marcar como Leída
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setNotificacionSeleccionada(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Configuración */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configuración de Notificaciones</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="tipos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tipos">Tipos de Notificación</TabsTrigger>
              <TabsTrigger value="horarios">Horarios y Sonidos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tipos" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="citas">Notificaciones de Citas</Label>
                    <p className="text-sm text-gray-600">Recordatorios de citas próximas y cambios</p>
                  </div>
                  <Switch
                    id="citas"
                    checked={configuracion.citas}
                    onCheckedChange={(checked) => setConfiguracion({...configuracion, citas: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="medicamentos">Notificaciones de Medicamentos</Label>
                    <p className="text-sm text-gray-600">Alertas de medicamentos vencidos y renovaciones</p>
                  </div>
                  <Switch
                    id="medicamentos"
                    checked={configuracion.medicamentos}
                    onCheckedChange={(checked) => setConfiguracion({...configuracion, medicamentos: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="interconsultas">Notificaciones de Interconsultas</Label>
                    <p className="text-sm text-gray-600">Respuestas y nuevas interconsultas</p>
                  </div>
                  <Switch
                    id="interconsultas"
                    checked={configuracion.interconsultas}
                    onCheckedChange={(checked) => setConfiguracion({...configuracion, interconsultas: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="seguimientos">Notificaciones de Seguimiento</Label>
                    <p className="text-sm text-gray-600">Recordatorios de seguimiento de pacientes</p>
                  </div>
                  <Switch
                    id="seguimientos"
                    checked={configuracion.seguimientos}
                    onCheckedChange={(checked) => setConfiguracion({...configuracion, seguimientos: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="urgentes">Notificaciones Urgentes</Label>
                    <p className="text-sm text-gray-600">Alertas críticas y resultados urgentes</p>
                  </div>
                  <Switch
                    id="urgentes"
                    checked={configuracion.urgentes}
                    onCheckedChange={(checked) => setConfiguracion({...configuracion, urgentes: checked})}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="horarios" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sonido">Sonido de Notificación</Label>
                    <p className="text-sm text-gray-600">Reproducir sonido al recibir notificaciones</p>
                  </div>
                  <Switch
                    id="sonido"
                    checked={configuracion.sonido}
                    onCheckedChange={(checked) => setConfiguracion({...configuracion, sonido: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email">Notificaciones por Email</Label>
                    <p className="text-sm text-gray-600">Enviar copia de notificaciones por correo</p>
                  </div>
                  <Switch
                    id="email"
                    checked={configuracion.email}
                    onCheckedChange={(checked) => setConfiguracion({...configuracion, email: checked})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="horario-inicio">Horario de Inicio</Label>
                    <input
                      id="horario-inicio"
                      type="time"
                      value={configuracion.horarioInicio}
                      onChange={(e) => setConfiguracion({...configuracion, horarioInicio: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="horario-fin">Horario de Fin</Label>
                    <input
                      id="horario-fin"
                      type="time"
                      value={configuracion.horarioFin}
                      onChange={(e) => setConfiguracion({...configuracion, horarioFin: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Las notificaciones urgentes siempre se mostrarán, 
                    independientemente del horario configurado.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfig(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowConfig(false)}>
              Guardar Configuración
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificacionesPushComponent;