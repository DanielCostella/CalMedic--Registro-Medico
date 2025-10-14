import React, { useState, useEffect } from 'react';
import { Bell, X, Settings, Filter, Volume2, VolumeX, Smartphone, Mail, MessageSquare, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NotificacionMejorada {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'critica' | 'urgente' | 'normal' | 'info';
  categoria: 'cita' | 'medicamento' | 'laboratorio' | 'sistema' | 'emergencia';
  fecha: Date;
  leida: boolean;
  canales: ('push' | 'email' | 'sms')[];
  accion?: {
    texto: string;
    url: string;
  };
  paciente?: {
    nombre: string;
    id: string;
  };
}

interface ConfiguracionNotificaciones {
  push: boolean;
  email: boolean;
  sms: boolean;
  sonido: boolean;
  vibracion: boolean;
  horarioInicio: string;
  horarioFin: string;
  diasSemana: string[];
  categorias: {
    [key: string]: {
      activa: boolean;
      prioridad: 'alta' | 'media' | 'baja';
      canales: string[];
    };
  };
}

const NotificacionesMejoradasComponent: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<NotificacionMejorada[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionNotificaciones>({
    push: true,
    email: true,
    sms: false,
    sonido: true,
    vibracion: true,
    horarioInicio: '08:00',
    horarioFin: '20:00',
    diasSemana: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
    categorias: {
      cita: { activa: true, prioridad: 'alta', canales: ['push', 'email'] },
      medicamento: { activa: true, prioridad: 'media', canales: ['push'] },
      laboratorio: { activa: true, prioridad: 'alta', canales: ['push', 'email', 'sms'] },
      sistema: { activa: false, prioridad: 'baja', canales: ['push'] },
      emergencia: { activa: true, prioridad: 'alta', canales: ['push', 'email', 'sms'] }
    }
  });
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaNotificacion, setNuevaNotificacion] = useState({
    titulo: '',
    mensaje: '',
    tipo: 'normal' as const,
    categoria: 'sistema' as const,
    canales: ['push'] as ('push' | 'email' | 'sms')[]
  });

  useEffect(() => {
    // Cargar configuración desde localStorage
    const configGuardada = localStorage.getItem('notificaciones-config');
    if (configGuardada) {
      setConfiguracion(JSON.parse(configGuardada));
    }

    // Generar notificaciones de ejemplo
    const notificacionesEjemplo: NotificacionMejorada[] = [
      {
        id: '1',
        titulo: 'Resultado Crítico de Laboratorio',
        mensaje: 'Paciente María González - Hemoglobina: 6.8 g/dL (Crítico)',
        tipo: 'critica',
        categoria: 'laboratorio',
        fecha: new Date(Date.now() - 15 * 60 * 1000),
        leida: false,
        canales: ['push', 'email', 'sms'],
        accion: {
          texto: 'Ver Resultado',
          url: '/laboratorios'
        },
        paciente: {
          nombre: 'María González',
          id: 'PAC001'
        }
      },
      {
        id: '2',
        titulo: 'Cita Confirmada',
        mensaje: 'Carlos Rodríguez confirmó su cita para mañana a las 10:00',
        tipo: 'normal',
        categoria: 'cita',
        fecha: new Date(Date.now() - 30 * 60 * 1000),
        leida: false,
        canales: ['push', 'email'],
        accion: {
          texto: 'Ver Cita',
          url: '/citas'
        },
        paciente: {
          nombre: 'Carlos Rodríguez',
          id: 'PAC002'
        }
      },
      {
        id: '3',
        titulo: 'Recordatorio de Medicamento',
        mensaje: 'Renovar receta de Atenolol para Ana Martínez (vence en 3 días)',
        tipo: 'urgente',
        categoria: 'medicamento',
        fecha: new Date(Date.now() - 1 * 60 * 60 * 1000),
        leida: true,
        canales: ['push'],
        accion: {
          texto: 'Renovar Receta',
          url: '/recetario'
        },
        paciente: {
          nombre: 'Ana Martínez',
          id: 'PAC003'
        }
      },
      {
        id: '4',
        titulo: 'Backup Completado',
        mensaje: 'Backup automático completado exitosamente - 256 MB respaldados',
        tipo: 'info',
        categoria: 'sistema',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
        leida: true,
        canales: ['push']
      },
      {
        id: '5',
        titulo: 'Emergencia - Código Azul',
        mensaje: 'Activación de código azul en UCI - Habitación 302',
        tipo: 'critica',
        categoria: 'emergencia',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000),
        leida: false,
        canales: ['push', 'email', 'sms'],
        accion: {
          texto: 'Responder',
          url: '/emergencias'
        }
      }
    ];

    setNotificaciones(notificacionesEjemplo);

    // Simular nuevas notificaciones cada 30 segundos
    const intervalo = setInterval(() => {
      if (Math.random() > 0.7) {
        const nuevaNotif: NotificacionMejorada = {
          id: Date.now().toString(),
          titulo: 'Nueva Notificación',
          mensaje: `Notificación automática generada a las ${new Date().toLocaleTimeString()}`,
          tipo: Math.random() > 0.5 ? 'normal' : 'urgente',
          categoria: ['cita', 'medicamento', 'laboratorio'][Math.floor(Math.random() * 3)] as 'cita' | 'medicamento' | 'laboratorio',
          fecha: new Date(),
          leida: false,
          canales: ['push']
        };

        setNotificaciones(prev => [nuevaNotif, ...prev.slice(0, 19)]);

        // Mostrar notificación del navegador si está habilitada
        if (configuracion.push && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(nuevaNotif.titulo, {
            body: nuevaNotif.mensaje,
            icon: '/favicon.png',
            badge: '/favicon.png'
          });
        }

        // Reproducir sonido si está habilitado
        if (configuracion.sonido) {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7bllHgU2jdXzzn0vBSF+yO/eizEIHWq+8+OWT');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        }
      }
    }, 30000);

    return () => clearInterval(intervalo);
  }, [configuracion]);

  // Solicitar permisos de notificación
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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

  const guardarConfiguracion = () => {
    localStorage.setItem('notificaciones-config', JSON.stringify(configuracion));
    setMostrarConfiguracion(false);
  };

  const enviarNotificacionPersonalizada = () => {
    const notif: NotificacionMejorada = {
      id: Date.now().toString(),
      titulo: nuevaNotificacion.titulo,
      mensaje: nuevaNotificacion.mensaje,
      tipo: nuevaNotificacion.tipo,
      categoria: nuevaNotificacion.categoria,
      fecha: new Date(),
      leida: false,
      canales: nuevaNotificacion.canales
    };

    setNotificaciones(prev => [notif, ...prev]);
    setNuevaNotificacion({
      titulo: '',
      mensaje: '',
      tipo: 'normal',
      categoria: 'sistema',
      canales: ['push']
    });
    setMostrarFormulario(false);

    // Enviar notificación del navegador
    if (configuracion.push && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notif.titulo, {
        body: notif.mensaje,
        icon: '/favicon.png'
      });
    }
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'urgente':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'normal':
        return <Info className="w-4 h-4 text-blue-600" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return 'border-l-red-500 bg-red-50';
      case 'urgente':
        return 'border-l-orange-500 bg-orange-50';
      case 'normal':
        return 'border-l-blue-500 bg-blue-50';
      case 'info':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const notificacionesFiltradas = notificaciones.filter(notif => {
    const cumpleCategoria = filtroCategoria === 'todas' || notif.categoria === filtroCategoria;
    const cumpleTipo = filtroTipo === 'todas' || notif.tipo === filtroTipo;
    return cumpleCategoria && cumpleTipo;
  });

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-blue-600" />
            {noLeidas > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                {noLeidas > 99 ? '99+' : noLeidas}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Notificaciones Mejoradas</h2>
            <p className="text-gray-600">
              {noLeidas} sin leer de {notificaciones.length} total
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMostrarFormulario(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Nueva
          </Button>
          <Button variant="outline" onClick={marcarTodasComoLeidas}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar Todas
          </Button>
          <Button variant="outline" onClick={() => setMostrarConfiguracion(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Label>Categoría:</Label>
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="cita">Citas</SelectItem>
              <SelectItem value="medicamento">Medicamentos</SelectItem>
              <SelectItem value="laboratorio">Laboratorio</SelectItem>
              <SelectItem value="sistema">Sistema</SelectItem>
              <SelectItem value="emergencia">Emergencias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Tipo:</Label>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="critica">Crítica</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">
            {notificacionesFiltradas.length} resultados
          </span>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-3">
        {notificacionesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay notificaciones que mostrar</p>
            </CardContent>
          </Card>
        ) : (
          notificacionesFiltradas.map((notificacion) => (
            <Card
              key={notificacion.id}
              className={`border-l-4 transition-all hover:shadow-md ${getColorTipo(notificacion.tipo)} ${
                !notificacion.leida ? 'ring-2 ring-blue-100' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getIconoTipo(notificacion.tipo)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${!notificacion.leida ? 'font-bold' : ''}`}>
                          {notificacion.titulo}
                        </h4>
                        {!notificacion.leida && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notificacion.mensaje}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{notificacion.fecha.toLocaleString('es-ES')}</span>
                        
                        {notificacion.paciente && (
                          <span>Paciente: {notificacion.paciente.nombre}</span>
                        )}
                        
                        <div className="flex items-center gap-1">
                          {notificacion.canales.includes('push') && <Smartphone className="w-3 h-3" />}
                          {notificacion.canales.includes('email') && <Mail className="w-3 h-3" />}
                          {notificacion.canales.includes('sms') && <MessageSquare className="w-3 h-3" />}
                        </div>
                        
                        <Badge variant="outline" className="capitalize">
                          {notificacion.categoria}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {notificacion.accion && (
                      <Button size="sm" variant="outline">
                        {notificacion.accion.texto}
                      </Button>
                    )}
                    
                    {!notificacion.leida && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => marcarComoLeida(notificacion.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => eliminarNotificacion(notificacion.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de configuración */}
      {mostrarConfiguracion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Configuración de Notificaciones
                <Button variant="ghost" onClick={() => setMostrarConfiguracion(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="canales">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="canales">Canales</TabsTrigger>
                  <TabsTrigger value="horarios">Horarios</TabsTrigger>
                  <TabsTrigger value="categorias">Categorías</TabsTrigger>
                </TabsList>
                
                <TabsContent value="canales" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <Label>Notificaciones Push</Label>
                      </div>
                      <Switch
                        checked={configuracion.push}
                        onCheckedChange={(checked) =>
                          setConfiguracion(prev => ({ ...prev, push: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <Label>Notificaciones por Email</Label>
                      </div>
                      <Switch
                        checked={configuracion.email}
                        onCheckedChange={(checked) =>
                          setConfiguracion(prev => ({ ...prev, email: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <Label>Notificaciones por SMS</Label>
                      </div>
                      <Switch
                        checked={configuracion.sms}
                        onCheckedChange={(checked) =>
                          setConfiguracion(prev => ({ ...prev, sms: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {configuracion.sonido ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        <Label>Sonido</Label>
                      </div>
                      <Switch
                        checked={configuracion.sonido}
                        onCheckedChange={(checked) =>
                          setConfiguracion(prev => ({ ...prev, sonido: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <Label>Vibración</Label>
                      </div>
                      <Switch
                        checked={configuracion.vibracion}
                        onCheckedChange={(checked) =>
                          setConfiguracion(prev => ({ ...prev, vibracion: checked }))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="horarios" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Hora de inicio</Label>
                      <Input
                        type="time"
                        value={configuracion.horarioInicio}
                        onChange={(e) =>
                          setConfiguracion(prev => ({ ...prev, horarioInicio: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Hora de fin</Label>
                      <Input
                        type="time"
                        value={configuracion.horarioFin}
                        onChange={(e) =>
                          setConfiguracion(prev => ({ ...prev, horarioFin: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Días de la semana</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map(dia => (
                        <div key={dia} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={dia}
                            checked={configuracion.diasSemana.includes(dia)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setConfiguracion(prev => ({
                                  ...prev,
                                  diasSemana: [...prev.diasSemana, dia]
                                }));
                              } else {
                                setConfiguracion(prev => ({
                                  ...prev,
                                  diasSemana: prev.diasSemana.filter(d => d !== dia)
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={dia} className="capitalize">{dia}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="categorias" className="space-y-4">
                  {Object.entries(configuracion.categorias).map(([categoria, config]) => (
                    <Card key={categoria}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium capitalize">{categoria}</h4>
                          <Switch
                            checked={config.activa}
                            onCheckedChange={(checked) =>
                              setConfiguracion(prev => ({
                                ...prev,
                                categorias: {
                                  ...prev.categorias,
                                  [categoria]: { ...config, activa: checked }
                                }
                              }))
                            }
                          />
                        </div>
                        
                        {config.activa && (
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">Prioridad</Label>
                              <Select
                                value={config.prioridad}
                                onValueChange={(value: 'alta' | 'media' | 'baja') =>
                                  setConfiguracion(prev => ({
                                    ...prev,
                                    categorias: {
                                      ...prev.categorias,
                                      [categoria]: { ...config, prioridad: value }
                                    }
                                  }))
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="alta">Alta</SelectItem>
                                  <SelectItem value="media">Media</SelectItem>
                                  <SelectItem value="baja">Baja</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-xs">Canales</Label>
                              <div className="flex gap-2 mt-1">
                                {['push', 'email', 'sms'].map(canal => (
                                  <div key={canal} className="flex items-center space-x-1">
                                    <input
                                      type="checkbox"
                                      id={`${categoria}-${canal}`}
                                      checked={config.canales.includes(canal)}
                                      onChange={(e) => {
                                        const nuevosCanales = e.target.checked
                                          ? [...config.canales, canal]
                                          : config.canales.filter(c => c !== canal);
                                        
                                        setConfiguracion(prev => ({
                                          ...prev,
                                          categorias: {
                                            ...prev.categorias,
                                            [categoria]: { ...config, canales: nuevosCanales }
                                          }
                                        }));
                                      }}
                                    />
                                    <Label htmlFor={`${categoria}-${canal}`} className="text-xs capitalize">
                                      {canal}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setMostrarConfiguracion(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarConfiguracion}>
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para nueva notificación */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Nueva Notificación
                <Button variant="ghost" onClick={() => setMostrarFormulario(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={nuevaNotificacion.titulo}
                  onChange={(e) =>
                    setNuevaNotificacion(prev => ({ ...prev, titulo: e.target.value }))
                  }
                  placeholder="Título de la notificación"
                />
              </div>
              
              <div>
                <Label>Mensaje</Label>
                <Textarea
                  value={nuevaNotificacion.mensaje}
                  onChange={(e) =>
                    setNuevaNotificacion(prev => ({ ...prev, mensaje: e.target.value }))
                  }
                  placeholder="Contenido del mensaje"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={nuevaNotificacion.tipo}
                    onValueChange={(value: 'critica' | 'urgente' | 'normal' | 'info') =>
                      setNuevaNotificacion(prev => ({ ...prev, tipo: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Categoría</Label>
                  <Select
                    value={nuevaNotificacion.categoria}
                    onValueChange={(value: 'cita' | 'medicamento' | 'laboratorio' | 'sistema' | 'emergencia') =>
                      setNuevaNotificacion(prev => ({ ...prev, categoria: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sistema">Sistema</SelectItem>
                      <SelectItem value="cita">Cita</SelectItem>
                      <SelectItem value="medicamento">Medicamento</SelectItem>
                      <SelectItem value="laboratorio">Laboratorio</SelectItem>
                      <SelectItem value="emergencia">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Canales de envío</Label>
                <div className="flex gap-4 mt-2">
                  {(['push', 'email', 'sms'] as const).map(canal => (
                    <div key={canal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`nuevo-${canal}`}
                        checked={nuevaNotificacion.canales.includes(canal)}
                        onChange={(e) => {
                          const nuevosCanales = e.target.checked
                            ? [...nuevaNotificacion.canales, canal]
                            : nuevaNotificacion.canales.filter(c => c !== canal);
                          
                          setNuevaNotificacion(prev => ({ ...prev, canales: nuevosCanales }));
                        }}
                      />
                      <Label htmlFor={`nuevo-${canal}`} className="capitalize">{canal}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={enviarNotificacionPersonalizada}
                  disabled={!nuevaNotificacion.titulo || !nuevaNotificacion.mensaje}
                >
                  Enviar Notificación
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificacionesMejoradasComponent;