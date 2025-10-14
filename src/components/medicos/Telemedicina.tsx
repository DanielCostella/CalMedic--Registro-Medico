import React, { useState, useEffect } from 'react';
import { Video, Phone, MessageCircle, Calendar, Users, Clock, Settings, Mic, MicOff, VideoOff, Monitor, PhoneOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface ConsultaVirtual {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  medicoId: string;
  medicoNombre: string;
  fechaHora: string;
  duracion: number; // en minutos
  estado: 'Programada' | 'En curso' | 'Completada' | 'Cancelada' | 'No asistió';
  tipo: 'Videollamada' | 'Llamada de voz' | 'Chat';
  motivo: string;
  notas: string;
  grabacion?: {
    url: string;
    duracion: number;
    tamaño: number;
  };
  participantes: Participante[];
  configuracion: ConfiguracionConsulta;
}

interface Participante {
  id: string;
  nombre: string;
  rol: 'Médico' | 'Paciente' | 'Acompañante' | 'Especialista';
  estado: 'Conectado' | 'Desconectado' | 'Esperando';
  tiempoConexion?: string;
}

interface ConfiguracionConsulta {
  camaraHabilitada: boolean;
  microfonoHabilitado: boolean;
  grabacionHabilitada: boolean;
  chatHabilitado: boolean;
  compartirPantallaHabilitado: boolean;
  salaEsperaHabilitada: boolean;
  recordatoriosHabilitados: boolean;
}

interface MensajeChat {
  id: string;
  consultaId: string;
  autorId: string;
  autorNombre: string;
  mensaje: string;
  fecha: string;
  tipo: 'texto' | 'archivo' | 'imagen';
  archivoUrl?: string;
}

interface SalaVirtual {
  id: string;
  nombre: string;
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento';
  capacidadMaxima: number;
  participantesActuales: number;
  configuracion: ConfiguracionSala;
}

interface ConfiguracionSala {
  calidadVideo: 'HD' | 'Full HD' | '4K';
  calidadAudio: 'Estándar' | 'Alta';
  encriptacion: boolean;
  grabacionAutomatica: boolean;
  tiempoMaximoSesion: number; // en minutos
}

const TelemedicinComponent: React.FC = () => {
  const [consultas, setConsultas] = useState<ConsultaVirtual[]>([]);
  const [salas, setSalas] = useState<SalaVirtual[]>([]);
  const [mensajesChat, setMensajesChat] = useState<MensajeChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultaActiva, setConsultaActiva] = useState<ConsultaVirtual | null>(null);
  const [showNuevaConsulta, setShowNuevaConsulta] = useState(false);
  const [showConfiguracion, setShowConfiguracion] = useState(false);
  
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Estados de la videollamada activa
  const [enLlamada, setEnLlamada] = useState(false);
  const [camaraActiva, setCamaraActiva] = useState(true);
  const [microfonoActivo, setMicrofonoActivo] = useState(true);
  const [compartirPantalla, setCompartirPantalla] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const [nuevaConsulta, setNuevaConsulta] = useState<Omit<ConsultaVirtual, 'id' | 'estado' | 'participantes'>>({
    pacienteId: '',
    pacienteNombre: '',
    medicoId: '1',
    medicoNombre: 'Dr. Sistema',
    fechaHora: '',
    duracion: 30,
    tipo: 'Videollamada',
    motivo: '',
    notas: '',
    configuracion: {
      camaraHabilitada: true,
      microfonoHabilitado: true,
      grabacionHabilitada: false,
      chatHabilitado: true,
      compartirPantallaHabilitado: true,
      salaEsperaHabilitada: true,
      recordatoriosHabilitados: true
    }
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const consultasIniciales: ConsultaVirtual[] = [
        {
          id: '1',
          pacienteId: '1',
          pacienteNombre: 'María González',
          medicoId: '1',
          medicoNombre: 'Dr. Juan Pérez',
          fechaHora: '2024-01-16 16:00:00',
          duracion: 30,
          estado: 'Programada',
          tipo: 'Videollamada',
          motivo: 'Control de diabetes',
          notas: '',
          participantes: [
            {
              id: '1',
              nombre: 'Dr. Juan Pérez',
              rol: 'Médico',
              estado: 'Desconectado'
            },
            {
              id: '2',
              nombre: 'María González',
              rol: 'Paciente',
              estado: 'Desconectado'
            }
          ],
          configuracion: {
            camaraHabilitada: true,
            microfonoHabilitado: true,
            grabacionHabilitada: false,
            chatHabilitado: true,
            compartirPantallaHabilitado: true,
            salaEsperaHabilitada: true,
            recordatoriosHabilitados: true
          }
        },
        {
          id: '2',
          pacienteId: '2',
          pacienteNombre: 'Carlos Rodríguez',
          medicoId: '2',
          medicoNombre: 'Dra. María González',
          fechaHora: '2024-01-16 14:30:00',
          duracion: 45,
          estado: 'Completada',
          tipo: 'Videollamada',
          motivo: 'Consulta cardiológica',
          notas: 'Paciente presenta mejoría en síntomas. Continuar con medicación actual.',
          grabacion: {
            url: '/recordings/consulta-2.mp4',
            duracion: 42,
            tamaño: 256000000 // 256MB
          },
          participantes: [
            {
              id: '3',
              nombre: 'Dra. María González',
              rol: 'Médico',
              estado: 'Desconectado',
              tiempoConexion: '42 minutos'
            },
            {
              id: '4',
              nombre: 'Carlos Rodríguez',
              rol: 'Paciente',
              estado: 'Desconectado',
              tiempoConexion: '42 minutos'
            }
          ],
          configuracion: {
            camaraHabilitada: true,
            microfonoHabilitado: true,
            grabacionHabilitada: true,
            chatHabilitado: true,
            compartirPantallaHabilitado: false,
            salaEsperaHabilitada: true,
            recordatoriosHabilitados: true
          }
        },
        {
          id: '3',
          pacienteId: '3',
          pacienteNombre: 'Ana Martínez',
          medicoId: '1',
          medicoNombre: 'Dr. Juan Pérez',
          fechaHora: '2024-01-16 10:00:00',
          duracion: 20,
          estado: 'En curso',
          tipo: 'Llamada de voz',
          motivo: 'Seguimiento post-operatorio',
          notas: '',
          participantes: [
            {
              id: '1',
              nombre: 'Dr. Juan Pérez',
              rol: 'Médico',
              estado: 'Conectado',
              tiempoConexion: '15 minutos'
            },
            {
              id: '5',
              nombre: 'Ana Martínez',
              rol: 'Paciente',
              estado: 'Conectado',
              tiempoConexion: '15 minutos'
            }
          ],
          configuracion: {
            camaraHabilitada: false,
            microfonoHabilitado: true,
            grabacionHabilitada: false,
            chatHabilitado: true,
            compartirPantallaHabilitado: false,
            salaEsperaHabilitada: false,
            recordatoriosHabilitados: true
          }
        }
      ];

      const salasIniciales: SalaVirtual[] = [
        {
          id: '1',
          nombre: 'Sala Virtual 1',
          estado: 'Ocupada',
          capacidadMaxima: 4,
          participantesActuales: 2,
          configuracion: {
            calidadVideo: 'HD',
            calidadAudio: 'Alta',
            encriptacion: true,
            grabacionAutomatica: false,
            tiempoMaximoSesion: 120
          }
        },
        {
          id: '2',
          nombre: 'Sala Virtual 2',
          estado: 'Disponible',
          capacidadMaxima: 6,
          participantesActuales: 0,
          configuracion: {
            calidadVideo: 'Full HD',
            calidadAudio: 'Alta',
            encriptacion: true,
            grabacionAutomatica: true,
            tiempoMaximoSesion: 180
          }
        },
        {
          id: '3',
          nombre: 'Sala de Emergencia',
          estado: 'Disponible',
          capacidadMaxima: 8,
          participantesActuales: 0,
          configuracion: {
            calidadVideo: '4K',
            calidadAudio: 'Alta',
            encriptacion: true,
            grabacionAutomatica: true,
            tiempoMaximoSesion: 240
          }
        }
      ];

      const mensajesIniciales: MensajeChat[] = [
        {
          id: '1',
          consultaId: '3',
          autorId: '1',
          autorNombre: 'Dr. Juan Pérez',
          mensaje: 'Buenos días Ana, ¿cómo se siente después de la operación?',
          fecha: '2024-01-16 10:05:00',
          tipo: 'texto'
        },
        {
          id: '2',
          consultaId: '3',
          autorId: '5',
          autorNombre: 'Ana Martínez',
          mensaje: 'Buenos días doctor, me siento mucho mejor. El dolor ha disminuido considerablemente.',
          fecha: '2024-01-16 10:06:00',
          tipo: 'texto'
        },
        {
          id: '3',
          consultaId: '3',
          autorId: '1',
          autorNombre: 'Dr. Juan Pérez',
          mensaje: 'Excelente. ¿Ha seguido las indicaciones post-operatorias que le dimos?',
          fecha: '2024-01-16 10:07:00',
          tipo: 'texto'
        }
      ];

      setConsultas(consultasIniciales);
      setSalas(salasIniciales);
      setMensajesChat(mensajesIniciales);
      setLoading(false);
    }, 1000);
  }, []);

  const iniciarConsulta = (consulta: ConsultaVirtual) => {
    setConsultaActiva(consulta);
    setEnLlamada(true);
    
    // Actualizar estado de la consulta
    setConsultas(prev => prev.map(c => 
      c.id === consulta.id ? { ...c, estado: 'En curso' as const } : c
    ));
  };

  const finalizarConsulta = () => {
    if (consultaActiva) {
      setConsultas(prev => prev.map(c => 
        c.id === consultaActiva.id ? { ...c, estado: 'Completada' as const } : c
      ));
    }
    
    setConsultaActiva(null);
    setEnLlamada(false);
    setCamaraActiva(true);
    setMicrofonoActivo(true);
    setCompartirPantalla(false);
    setChatAbierto(false);
  };

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim() || !consultaActiva) return;
    
    const mensaje: MensajeChat = {
      id: Date.now().toString(),
      consultaId: consultaActiva.id,
      autorId: '1',
      autorNombre: 'Dr. Sistema',
      mensaje: nuevoMensaje,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tipo: 'texto'
    };
    
    setMensajesChat(prev => [...prev, mensaje]);
    setNuevoMensaje('');
  };

  const crearConsulta = () => {
    const consulta: ConsultaVirtual = {
      ...nuevaConsulta,
      id: Date.now().toString(),
      estado: 'Programada',
      participantes: [
        {
          id: '1',
          nombre: nuevaConsulta.medicoNombre,
          rol: 'Médico',
          estado: 'Desconectado'
        },
        {
          id: '2',
          nombre: nuevaConsulta.pacienteNombre,
          rol: 'Paciente',
          estado: 'Desconectado'
        }
      ]
    };
    
    setConsultas(prev => [...prev, consulta]);
    setShowNuevaConsulta(false);
    resetFormulario();
  };

  const resetFormulario = () => {
    setNuevaConsulta({
      pacienteId: '',
      pacienteNombre: '',
      medicoId: '1',
      medicoNombre: 'Dr. Sistema',
      fechaHora: '',
      duracion: 30,
      tipo: 'Videollamada',
      motivo: '',
      notas: '',
      configuracion: {
        camaraHabilitada: true,
        microfonoHabilitado: true,
        grabacionHabilitada: false,
        chatHabilitado: true,
        compartirPantallaHabilitado: true,
        salaEsperaHabilitada: true,
        recordatoriosHabilitados: true
      }
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const obtenerColorEstado = (estado: ConsultaVirtual['estado']) => {
    switch (estado) {
      case 'Programada': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'En curso': return 'text-green-600 bg-green-50 border-green-200';
      case 'Completada': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'Cancelada': return 'text-red-600 bg-red-50 border-red-200';
      case 'No asistió': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const consultasFiltradas = consultas.filter(consulta => {
    const matchEstado = !filtroEstado || consulta.estado === filtroEstado;
    const matchTipo = !filtroTipo || consulta.tipo === filtroTipo;
    const matchFecha = !filtroFecha || consulta.fechaHora.startsWith(filtroFecha);
    
    return matchEstado && matchTipo && matchFecha;
  });

  const mensajesConsultaActiva = mensajesChat.filter(m => m.consultaId === consultaActiva?.id);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando sistema de telemedicina..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Video className="w-8 h-8 text-blue-600" />
            Sistema de Telemedicina
          </h1>
          <p className="text-gray-600">
            Consultas virtuales, videollamadas y chat médico en tiempo real
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowConfiguracion(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
          
          <Dialog open={showNuevaConsulta} onOpenChange={setShowNuevaConsulta}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Video className="w-4 h-4 mr-2" />
                Nueva Consulta Virtual
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Programar Nueva Consulta Virtual</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="configuracion">Configuración</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paciente-nombre">Nombre del Paciente *</Label>
                      <Input
                        id="paciente-nombre"
                        value={nuevaConsulta.pacienteNombre}
                        onChange={(e) => setNuevaConsulta({...nuevaConsulta, pacienteNombre: e.target.value})}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="medico-nombre">Médico Asignado</Label>
                      <Input
                        id="medico-nombre"
                        value={nuevaConsulta.medicoNombre}
                        onChange={(e) => setNuevaConsulta({...nuevaConsulta, medicoNombre: e.target.value})}
                        placeholder="Dr. Sistema"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha-hora">Fecha y Hora *</Label>
                      <Input
                        id="fecha-hora"
                        type="datetime-local"
                        value={nuevaConsulta.fechaHora}
                        onChange={(e) => setNuevaConsulta({...nuevaConsulta, fechaHora: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duracion">Duración (minutos)</Label>
                      <Input
                        id="duracion"
                        type="number"
                        value={nuevaConsulta.duracion}
                        onChange={(e) => setNuevaConsulta({...nuevaConsulta, duracion: parseInt(e.target.value)})}
                        min="15"
                        max="180"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tipo">Tipo de Consulta</Label>
                    <Select 
                      value={nuevaConsulta.tipo} 
                      onValueChange={(value: ConsultaVirtual['tipo']) => 
                        setNuevaConsulta({...nuevaConsulta, tipo: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Videollamada">Videollamada</SelectItem>
                        <SelectItem value="Llamada de voz">Llamada de voz</SelectItem>
                        <SelectItem value="Chat">Chat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="motivo">Motivo de la Consulta</Label>
                    <Textarea
                      id="motivo"
                      value={nuevaConsulta.motivo}
                      onChange={(e) => setNuevaConsulta({...nuevaConsulta, motivo: e.target.value})}
                      placeholder="Describe el motivo de la consulta..."
                      rows={3}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="configuracion" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Cámara habilitada</Label>
                      <Switch
                        checked={nuevaConsulta.configuracion.camaraHabilitada}
                        onCheckedChange={(checked) => 
                          setNuevaConsulta({
                            ...nuevaConsulta,
                            configuracion: {...nuevaConsulta.configuracion, camaraHabilitada: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Micrófono habilitado</Label>
                      <Switch
                        checked={nuevaConsulta.configuracion.microfonoHabilitado}
                        onCheckedChange={(checked) => 
                          setNuevaConsulta({
                            ...nuevaConsulta,
                            configuracion: {...nuevaConsulta.configuracion, microfonoHabilitado: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Grabación habilitada</Label>
                      <Switch
                        checked={nuevaConsulta.configuracion.grabacionHabilitada}
                        onCheckedChange={(checked) => 
                          setNuevaConsulta({
                            ...nuevaConsulta,
                            configuracion: {...nuevaConsulta.configuracion, grabacionHabilitada: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Chat habilitado</Label>
                      <Switch
                        checked={nuevaConsulta.configuracion.chatHabilitado}
                        onCheckedChange={(checked) => 
                          setNuevaConsulta({
                            ...nuevaConsulta,
                            configuracion: {...nuevaConsulta.configuracion, chatHabilitado: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Compartir pantalla</Label>
                      <Switch
                        checked={nuevaConsulta.configuracion.compartirPantallaHabilitado}
                        onCheckedChange={(checked) => 
                          setNuevaConsulta({
                            ...nuevaConsulta,
                            configuracion: {...nuevaConsulta.configuracion, compartirPantallaHabilitado: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Sala de espera</Label>
                      <Switch
                        checked={nuevaConsulta.configuracion.salaEsperaHabilitada}
                        onCheckedChange={(checked) => 
                          setNuevaConsulta({
                            ...nuevaConsulta,
                            configuracion: {...nuevaConsulta.configuracion, salaEsperaHabilitada: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Recordatorios automáticos</Label>
                      <Switch
                        checked={nuevaConsulta.configuracion.recordatoriosHabilitados}
                        onCheckedChange={(checked) => 
                          setNuevaConsulta({
                            ...nuevaConsulta,
                            configuracion: {...nuevaConsulta.configuracion, recordatoriosHabilitados: checked}
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => {setShowNuevaConsulta(false); resetFormulario();}}>
                  Cancelar
                </Button>
                <Button 
                  onClick={crearConsulta} 
                  disabled={!nuevaConsulta.pacienteNombre || !nuevaConsulta.fechaHora}
                >
                  Programar Consulta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Consultas</p>
                <p className="text-2xl font-bold">{consultas.length}</p>
              </div>
              <Video className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">En Curso</p>
                <p className="text-2xl font-bold">
                  {consultas.filter(c => c.estado === 'En curso').length}
                </p>
              </div>
              <Phone className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Programadas Hoy</p>
                <p className="text-2xl font-bold">
                  {consultas.filter(c => 
                    c.estado === 'Programada' && 
                    c.fechaHora.startsWith(new Date().toISOString().split('T')[0])
                  ).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Salas Disponibles</p>
                <p className="text-2xl font-bold">
                  {salas.filter(s => s.estado === 'Disponible').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interface de Videollamada Activa */}
      {enLlamada && consultaActiva && (
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-6 h-6 text-blue-600" />
                Consulta en Curso - {consultaActiva.pacienteNombre}
              </div>
              <Badge className="bg-green-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                EN VIVO
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Principal */}
              <div className="lg:col-span-2">
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                  <div className="text-white text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Simulación de Videollamada</p>
                    <p className="text-sm opacity-75">
                      {consultaActiva.tipo} con {consultaActiva.pacienteNombre}
                    </p>
                  </div>
                  
                  {/* Controles de video */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button
                      size="sm"
                      variant={microfonoActivo ? "default" : "destructive"}
                      onClick={() => setMicrofonoActivo(!microfonoActivo)}
                    >
                      {microfonoActivo ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={camaraActiva ? "default" : "destructive"}
                      onClick={() => setCamaraActiva(!camaraActiva)}
                    >
                      {camaraActiva ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={compartirPantalla ? "default" : "outline"}
                      onClick={() => setCompartirPantalla(!compartirPantalla)}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={chatAbierto ? "default" : "outline"}
                      onClick={() => setChatAbierto(!chatAbierto)}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={finalizarConsulta}
                    >
                      <PhoneOff className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Panel Lateral */}
              <div className="space-y-4">
                {/* Participantes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Participantes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      {consultaActiva.participantes.map(participante => (
                        <div key={participante.id} className="flex items-center justify-between text-sm">
                          <span>{participante.nombre}</span>
                          <Badge variant={participante.estado === 'Conectado' ? 'default' : 'secondary'}>
                            {participante.estado}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Chat */}
                {chatAbierto && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                        {mensajesConsultaActiva.map(mensaje => (
                          <div key={mensaje.id} className="text-xs">
                            <div className="font-medium">{mensaje.autorNombre}</div>
                            <div className="text-gray-600">{mensaje.mensaje}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Escribir mensaje..."
                          value={nuevoMensaje}
                          onChange={(e) => setNuevoMensaje(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                          className="text-sm"
                        />
                        <Button size="sm" onClick={enviarMensaje}>
                          Enviar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Información de la consulta */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Información</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 text-xs space-y-1">
                    <div><strong>Motivo:</strong> {consultaActiva.motivo}</div>
                    <div><strong>Duración:</strong> {consultaActiva.duracion} min</div>
                    <div><strong>Tipo:</strong> {consultaActiva.tipo}</div>
                    {consultaActiva.configuracion.grabacionHabilitada && (
                      <div className="text-red-600">
                        <strong>⚫ Grabando</strong>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs principales */}
      <Tabs defaultValue="consultas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consultas">Consultas</TabsTrigger>
          <TabsTrigger value="salas">Salas Virtuales</TabsTrigger>
          <TabsTrigger value="grabaciones">Grabaciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="consultas" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label>Filtrar consultas</Label>
                </div>
                
                <div className="flex gap-2">
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Programada">Programada</SelectItem>
                      <SelectItem value="En curso">En curso</SelectItem>
                      <SelectItem value="Completada">Completada</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                      <SelectItem value="No asistió">No asistió</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Videollamada">Videollamada</SelectItem>
                      <SelectItem value="Llamada de voz">Llamada de voz</SelectItem>
                      <SelectItem value="Chat">Chat</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="date"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de consultas */}
          <div className="space-y-4">
            {consultasFiltradas.map(consulta => (
              <Card key={consulta.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {consulta.pacienteNombre}
                        </h3>
                        <Badge className={obtenerColorEstado(consulta.estado)}>
                          {consulta.estado}
                        </Badge>
                        <Badge variant="outline">
                          {consulta.tipo === 'Videollamada' ? '🎥' : 
                           consulta.tipo === 'Llamada de voz' ? '📞' : '💬'} {consulta.tipo}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <strong>Médico:</strong> {consulta.medicoNombre}
                        </div>
                        <div>
                          <strong>Fecha:</strong> {new Date(consulta.fechaHora).toLocaleString('es-ES')}
                        </div>
                        <div>
                          <strong>Duración:</strong> {consulta.duracion} min
                        </div>
                        <div>
                          <strong>Participantes:</strong> {consulta.participantes.length}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Motivo:</strong> {consulta.motivo}
                      </div>
                      
                      {consulta.notas && (
                        <div className="text-sm text-gray-600">
                          <strong>Notas:</strong> {consulta.notas}
                        </div>
                      )}
                      
                      {consulta.grabacion && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Grabación disponible:</strong> {consulta.grabacion.duracion} min - {formatFileSize(consulta.grabacion.tamaño)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {consulta.estado === 'Programada' && (
                        <Button
                          size="sm"
                          onClick={() => iniciarConsulta(consulta)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Iniciar
                        </Button>
                      )}
                      
                      {consulta.estado === 'En curso' && (
                        <Button
                          size="sm"
                          onClick={() => iniciarConsulta(consulta)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Unirse
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="salas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salas.map(sala => (
              <Card key={sala.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{sala.nombre}</h3>
                    <Badge variant={
                      sala.estado === 'Disponible' ? 'default' :
                      sala.estado === 'Ocupada' ? 'secondary' : 'destructive'
                    }>
                      {sala.estado}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Capacidad:</span>
                      <span>{sala.participantesActuales}/{sala.capacidadMaxima}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calidad de video:</span>
                      <span>{sala.configuracion.calidadVideo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Encriptación:</span>
                      <span>{sala.configuracion.encriptacion ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiempo máximo:</span>
                      <span>{sala.configuracion.tiempoMaximoSesion} min</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={sala.estado !== 'Disponible'}
                      className="flex-1"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Usar Sala
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="grabaciones" className="space-y-4">
          <div className="space-y-4">
            {consultas.filter(c => c.grabacion).map(consulta => (
              <Card key={consulta.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {consulta.pacienteNombre} - {consulta.medicoNombre}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <strong>Fecha:</strong> {new Date(consulta.fechaHora).toLocaleDateString('es-ES')}
                        </div>
                        <div>
                          <strong>Duración:</strong> {consulta.grabacion?.duracion} min
                        </div>
                        <div>
                          <strong>Tamaño:</strong> {consulta.grabacion && formatFileSize(consulta.grabacion.tamaño)}
                        </div>
                        <div>
                          <strong>Tipo:</strong> {consulta.tipo}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <strong>Motivo:</strong> {consulta.motivo}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4 mr-1" />
                        Reproducir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelemedicinComponent;