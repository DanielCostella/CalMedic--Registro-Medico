import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Search, Edit, Trash2, Check, X, Phone, User, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Cita {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteTelefono: string;
  fecha: string;
  hora: string;
  duracion: number; // en minutos
  motivo: string;
  tipo: 'Primera vez' | 'Control' | 'Urgente' | 'Seguimiento';
  estado: 'Programada' | 'Confirmada' | 'En curso' | 'Completada' | 'Cancelada' | 'No asistió';
  notas: string;
  recordatorioEnviado: boolean;
  fechaCreacion: string;
}

interface HorarioDisponible {
  hora: string;
  disponible: boolean;
  cita?: Cita;
}

const GestionCitasComponent: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNuevaCita, setShowNuevaCita] = useState(false);
  const [showEditarCita, setShowEditarCita] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [vistaCalendario, setVistaCalendario] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const [nuevaCita, setNuevaCita] = useState<Omit<Cita, 'id' | 'fechaCreacion' | 'recordatorioEnviado'>>({
    pacienteId: '',
    pacienteNombre: '',
    pacienteTelefono: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    duracion: 30,
    motivo: '',
    tipo: 'Primera vez',
    estado: 'Programada',
    notas: ''
  });

  // Horarios disponibles (9:00 AM a 6:00 PM, cada 30 minutos)
  const generarHorarios = (): string[] => {
    const horarios = [];
    for (let hora = 9; hora <= 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 18 && minuto > 0) break; // No pasar de 6:00 PM
        const horaStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        horarios.push(horaStr);
      }
    }
    return horarios;
  };

  const horariosDisponibles = generarHorarios();

  useEffect(() => {
    // Simular carga de citas
    setTimeout(() => {
      const citasIniciales: Cita[] = [
        {
          id: '1',
          pacienteId: '1',
          pacienteNombre: 'María González',
          pacienteTelefono: '+58 414-1234567',
          fecha: new Date().toISOString().split('T')[0],
          hora: '09:00',
          duracion: 30,
          motivo: 'Control de diabetes',
          tipo: 'Control',
          estado: 'Confirmada',
          notas: 'Traer últimos exámenes de laboratorio',
          recordatorioEnviado: true,
          fechaCreacion: '2024-01-01'
        },
        {
          id: '2',
          pacienteId: '2',
          pacienteNombre: 'Carlos Rodríguez',
          pacienteTelefono: '+58 412-9876543',
          fecha: new Date().toISOString().split('T')[0],
          hora: '10:30',
          duracion: 45,
          motivo: 'Consulta cardiológica',
          tipo: 'Primera vez',
          estado: 'Programada',
          notas: 'Paciente refiere palpitaciones',
          recordatorioEnviado: false,
          fechaCreacion: '2024-01-02'
        },
        {
          id: '3',
          pacienteId: '3',
          pacienteNombre: 'Ana Martínez',
          pacienteTelefono: '+58 416-1111111',
          fecha: new Date().toISOString().split('T')[0],
          hora: '14:00',
          duracion: 30,
          motivo: 'Seguimiento migraña',
          tipo: 'Seguimiento',
          estado: 'Completada',
          notas: 'Paciente reporta mejoría con tratamiento actual',
          recordatorioEnviado: true,
          fechaCreacion: '2024-01-03'
        },
        {
          id: '4',
          pacienteId: '4',
          pacienteNombre: 'Luis García',
          pacienteTelefono: '+58 424-2222222',
          fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mañana
          hora: '11:00',
          duracion: 60,
          motivo: 'Revisión post-operatoria',
          tipo: 'Seguimiento',
          estado: 'Programada',
          notas: 'Control de herida quirúrgica',
          recordatorioEnviado: false,
          fechaCreacion: '2024-01-04'
        }
      ];
      setCitas(citasIniciales);
      setLoading(false);
    }, 1000);
  }, []);

  const obtenerHorariosDelDia = (fecha: string): HorarioDisponible[] => {
    const citasDelDia = citas.filter(cita => cita.fecha === fecha);
    
    return horariosDisponibles.map(hora => {
      const citaEnHora = citasDelDia.find(cita => cita.hora === hora);
      return {
        hora,
        disponible: !citaEnHora,
        cita: citaEnHora
      };
    });
  };

  const handleCrearCita = () => {
    const citaCompleta: Cita = {
      ...nuevaCita,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString().split('T')[0],
      recordatorioEnviado: false
    };
    
    setCitas(prev => [...prev, citaCompleta]);
    setShowNuevaCita(false);
    resetFormulario();
  };

  const handleEditarCita = () => {
    if (citaSeleccionada) {
      const citaActualizada: Cita = {
        ...nuevaCita,
        id: citaSeleccionada.id,
        fechaCreacion: citaSeleccionada.fechaCreacion,
        recordatorioEnviado: citaSeleccionada.recordatorioEnviado
      };
      
      setCitas(prev => prev.map(c => 
        c.id === citaSeleccionada.id ? citaActualizada : c
      ));
      setShowEditarCita(false);
      setCitaSeleccionada(null);
      resetFormulario();
    }
  };

  const handleCambiarEstado = (id: string, nuevoEstado: Cita['estado']) => {
    setCitas(prev => prev.map(cita => 
      cita.id === id ? { ...cita, estado: nuevoEstado } : cita
    ));
  };

  const handleEliminarCita = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
      setCitas(prev => prev.filter(c => c.id !== id));
    }
  };

  const enviarRecordatorio = (id: string) => {
    setCitas(prev => prev.map(cita => 
      cita.id === id ? { ...cita, recordatorioEnviado: true } : cita
    ));
    alert('Recordatorio enviado por SMS');
  };

  const resetFormulario = () => {
    setNuevaCita({
      pacienteId: '',
      pacienteNombre: '',
      pacienteTelefono: '',
      fecha: new Date().toISOString().split('T')[0],
      hora: '09:00',
      duracion: 30,
      motivo: '',
      tipo: 'Primera vez',
      estado: 'Programada',
      notas: ''
    });
  };

  const abrirEditar = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setNuevaCita({
      pacienteId: cita.pacienteId,
      pacienteNombre: cita.pacienteNombre,
      pacienteTelefono: cita.pacienteTelefono,
      fecha: cita.fecha,
      hora: cita.hora,
      duracion: cita.duracion,
      motivo: cita.motivo,
      tipo: cita.tipo,
      estado: cita.estado,
      notas: cita.notas
    });
    setShowEditarCita(true);
  };

  const obtenerColorEstado = (estado: Cita['estado']) => {
    switch (estado) {
      case 'Programada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmada': return 'bg-green-100 text-green-800 border-green-200';
      case 'En curso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completada': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'No asistió': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const citasFiltradas = citas.filter(cita => {
    const matchBusqueda = !busqueda || 
      cita.pacienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.motivo.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.pacienteTelefono.includes(busqueda);
    
    const matchEstado = !filtroEstado || cita.estado === filtroEstado;
    const matchTipo = !filtroTipo || cita.tipo === filtroTipo;
    
    return matchBusqueda && matchEstado && matchTipo;
  });

  const citasDelDia = citasFiltradas.filter(cita => cita.fecha === fechaSeleccionada);
  const citasHoy = citas.filter(cita => cita.fecha === new Date().toISOString().split('T')[0]);
  const citasPendientes = citas.filter(cita => ['Programada', 'Confirmada'].includes(cita.estado));

  const cambiarFecha = (direccion: 'anterior' | 'siguiente') => {
    const fechaActual = new Date(fechaSeleccionada);
    if (direccion === 'anterior') {
      fechaActual.setDate(fechaActual.getDate() - 1);
    } else {
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    setFechaSeleccionada(fechaActual.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando citas médicas..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            Gestión de Citas
          </h1>
          <p className="text-gray-600">
            Administra y programa las citas médicas
          </p>
        </div>
        
        <Dialog open={showNuevaCita} onOpenChange={setShowNuevaCita}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Programar Nueva Cita</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paciente-nombre">Nombre del Paciente *</Label>
                  <Input
                    id="paciente-nombre"
                    value={nuevaCita.pacienteNombre}
                    onChange={(e) => setNuevaCita({...nuevaCita, pacienteNombre: e.target.value})}
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="paciente-telefono">Teléfono *</Label>
                  <Input
                    id="paciente-telefono"
                    value={nuevaCita.pacienteTelefono}
                    onChange={(e) => setNuevaCita({...nuevaCita, pacienteTelefono: e.target.value})}
                    placeholder="+58 414-1234567"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={nuevaCita.fecha}
                    onChange={(e) => setNuevaCita({...nuevaCita, fecha: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="hora">Hora *</Label>
                  <Select value={nuevaCita.hora} onValueChange={(value) => setNuevaCita({...nuevaCita, hora: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {horariosDisponibles.map(hora => {
                        const ocupado = citas.some(cita => 
                          cita.fecha === nuevaCita.fecha && 
                          cita.hora === hora && 
                          cita.id !== citaSeleccionada?.id
                        );
                        return (
                          <SelectItem 
                            key={hora} 
                            value={hora}
                            disabled={ocupado}
                          >
                            {hora} {ocupado ? '(Ocupado)' : ''}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duracion">Duración (min)</Label>
                  <Select value={nuevaCita.duracion.toString()} onValueChange={(value) => setNuevaCita({...nuevaCita, duracion: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1.5 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Cita</Label>
                  <Select value={nuevaCita.tipo} onValueChange={(value: Cita['tipo']) => setNuevaCita({...nuevaCita, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primera vez">Primera vez</SelectItem>
                      <SelectItem value="Control">Control</SelectItem>
                      <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={nuevaCita.estado} onValueChange={(value: Cita['estado']) => setNuevaCita({...nuevaCita, estado: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programada">Programada</SelectItem>
                      <SelectItem value="Confirmada">Confirmada</SelectItem>
                      <SelectItem value="En curso">En curso</SelectItem>
                      <SelectItem value="Completada">Completada</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                      <SelectItem value="No asistió">No asistió</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="motivo">Motivo de la Consulta *</Label>
                <Input
                  id="motivo"
                  value={nuevaCita.motivo}
                  onChange={(e) => setNuevaCita({...nuevaCita, motivo: e.target.value})}
                  placeholder="Descripción breve del motivo"
                />
              </div>
              
              <div>
                <Label htmlFor="notas">Notas Adicionales</Label>
                <Textarea
                  id="notas"
                  value={nuevaCita.notas}
                  onChange={(e) => setNuevaCita({...nuevaCita, notas: e.target.value})}
                  placeholder="Observaciones importantes para la cita..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {setShowNuevaCita(false); resetFormulario();}}>
                Cancelar
              </Button>
              <Button onClick={handleCrearCita}>
                Programar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Citas Hoy</p>
                <p className="text-2xl font-bold">{citasHoy.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Confirmadas</p>
                <p className="text-2xl font-bold">
                  {citas.filter(c => c.estado === 'Confirmada').length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Pendientes</p>
                <p className="text-2xl font-bold">{citasPendientes.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Canceladas</p>
                <p className="text-2xl font-bold">
                  {citas.filter(c => c.estado === 'Cancelada').length}
                </p>
              </div>
              <X className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegación de fecha y filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => cambiarFecha('anterior')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="w-40"
              />
              <Button variant="outline" size="sm" onClick={() => cambiarFecha('siguiente')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFechaSeleccionada(new Date().toISOString().split('T')[0])}
              >
                Hoy
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente, motivo o teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Programada">Programada</SelectItem>
                  <SelectItem value="Confirmada">Confirmada</SelectItem>
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
                  <SelectItem value="Primera vez">Primera vez</SelectItem>
                  <SelectItem value="Control">Control</SelectItem>
                  <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vista de Calendario del Día */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Horarios del día */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Agenda del {new Date(fechaSeleccionada).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {obtenerHorariosDelDia(fechaSeleccionada).map(horario => (
                  <div 
                    key={horario.hora}
                    className={`p-3 border rounded-lg ${
                      horario.disponible 
                        ? 'border-gray-200 bg-gray-50' 
                        : `border-l-4 ${obtenerColorEstado(horario.cita!.estado)}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-600 w-16">
                          {horario.hora}
                        </div>
                        {horario.cita ? (
                          <div className="flex-1">
                            <div className="font-medium">{horario.cita.pacienteNombre}</div>
                            <div className="text-sm text-gray-600">{horario.cita.motivo}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {horario.cita.tipo}
                              </Badge>
                              <Badge className={`text-xs ${obtenerColorEstado(horario.cita.estado)}`}>
                                {horario.cita.estado}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 italic">Disponible</div>
                        )}
                      </div>
                      
                      {horario.cita && (
                        <div className="flex gap-1">
                          {!horario.cita.recordatorioEnviado && horario.cita.estado === 'Programada' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => enviarRecordatorio(horario.cita!.id)}
                              title="Enviar recordatorio"
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => abrirEditar(horario.cita!)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEliminarCita(horario.cita!.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral - Citas del día */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Resumen del Día
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{citasDelDia.length}</div>
                  <div className="text-sm text-gray-600">Citas programadas</div>
                </div>
                
                <div className="space-y-2">
                  {citasDelDia.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay citas programadas</p>
                  ) : (
                    citasDelDia
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map(cita => (
                        <div key={cita.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">{cita.hora}</div>
                            <Badge className={`text-xs ${obtenerColorEstado(cita.estado)}`}>
                              {cita.estado}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">{cita.pacienteNombre}</div>
                            <div className="text-gray-600">{cita.motivo}</div>
                          </div>
                          
                          {cita.estado === 'Programada' && (
                            <div className="mt-2 flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCambiarEstado(cita.id, 'Confirmada')}
                                className="text-xs"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Confirmar
                              </Button>
                            </div>
                          )}
                          
                          {cita.estado === 'Confirmada' && (
                            <div className="mt-2 flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCambiarEstado(cita.id, 'En curso')}
                                className="text-xs"
                              >
                                Iniciar
                              </Button>
                            </div>
                          )}
                          
                          {cita.estado === 'En curso' && (
                            <div className="mt-2 flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCambiarEstado(cita.id, 'Completada')}
                                className="text-xs"
                              >
                                Completar
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Edición */}
      <Dialog open={showEditarCita} onOpenChange={setShowEditarCita}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cita</DialogTitle>
          </DialogHeader>
          
          {/* Mismo formulario que crear cita pero con datos precargados */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => {setShowEditarCita(false); resetFormulario();}}>
              Cancelar
            </Button>
            <Button onClick={handleEditarCita}>
              Actualizar Cita
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionCitasComponent;