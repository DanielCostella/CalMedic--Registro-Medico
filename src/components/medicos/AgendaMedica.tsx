import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Search, Filter, Bell, CheckCircle, XCircle, AlertTriangle, UserPlus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import HistorialMedicoComponent from './HistorialMedico';
import { mockCitas, mockPacientes, mockMedicos } from '@/data/mockData';
import { Cita, Paciente, Medico } from '@/types/medical';

const AgendaMedica: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>(mockPacientes);
  const [medicos] = useState<Medico[]>(mockMedicos);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [vistaCalendario, setVistaCalendario] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [showNuevaCita, setShowNuevaCita] = useState(false);
  const [showNuevoPaciente, setShowNuevoPaciente] = useState(false);
  const [showHistorialMedico, setShowHistorialMedico] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);

  // Estados para búsqueda de pacientes
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [pacientesFiltrados, setPacientesFiltrados] = useState<Paciente[]>([]);
  const [mostrarListaPacientes, setMostrarListaPacientes] = useState(false);

  // Médico logueado (simulamos que es el primer médico de la lista)
  const medicoLogueado = medicos[0];
  const esDashboardMedico = true; // Simular que es dashboard de médico, no de secretaria

  // Nueva cita form
  const [nuevaCita, setNuevaCita] = useState({
    pacienteId: '',
    medicoId: esDashboardMedico ? (medicoLogueado?.id || '') : '',
    fecha: '',
    hora: '',
    duracion: 30,
    motivo: '',
    tipo: 'Consulta' as const,
    recordatorio: true
  });

  // Nuevo paciente form
  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    fechaNacimiento: '',
    direccion: '',
    genero: '',
    contactoEmergencia: '',
    telefonoEmergencia: ''
  });

  // Horarios disponibles (simulación)
  const horariosDisponibles = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setCitas(mockCitas);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar pacientes en tiempo real
  useEffect(() => {
    if (busquedaPaciente.trim() === '') {
      setPacientesFiltrados([]);
      setMostrarListaPacientes(false);
    } else {
      const filtrados = pacientes.filter(paciente => 
        paciente.nombre.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
        paciente.apellido.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
        paciente.cedula.includes(busquedaPaciente) ||
        `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(busquedaPaciente.toLowerCase())
      );
      setPacientesFiltrados(filtrados);
      setMostrarListaPacientes(true);
    }
  }, [busquedaPaciente, pacientes]);

  const obtenerPaciente = (id: string) => pacientes.find(p => p.id === id);
  const obtenerMedico = (id: string) => medicos.find(m => m.id === id);

  const citasFiltradas = citas.filter(cita => {
    const paciente = obtenerPaciente(cita.pacienteId);
    const medico = obtenerMedico(cita.medicoId);
    
    const matchFecha = !filtroFecha || cita.fecha === filtroFecha;
    const matchEstado = !filtroEstado || cita.estado === filtroEstado;
    const matchBusqueda = !busqueda || 
      paciente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente?.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      medico?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.motivo.toLowerCase().includes(busqueda.toLowerCase());

    return matchFecha && matchEstado && matchBusqueda;
  });

  const citasDelDia = citasFiltradas.filter(cita => cita.fecha === fechaSeleccionada);

  // Obtener horarios ocupados para la fecha y médico seleccionados
  const obtenerHorariosOcupados = (fecha: string, medicoId: string) => {
    return citas
      .filter(cita => cita.fecha === fecha && cita.medicoId === medicoId && cita.estado !== 'Cancelada')
      .map(cita => cita.hora);
  };

  const horariosLibres = horariosDisponibles.filter(horario => 
    !obtenerHorariosOcupados(nuevaCita.fecha, nuevaCita.medicoId).includes(horario)
  );

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programada': return 'bg-blue-100 text-blue-800';
      case 'En Curso': return 'bg-yellow-100 text-yellow-800';
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'No Asistió': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Programada': return <Clock className="w-4 h-4" />;
      case 'En Curso': return <AlertTriangle className="w-4 h-4" />;
      case 'Completada': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelada': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const seleccionarPaciente = (paciente: Paciente) => {
    setNuevaCita({...nuevaCita, pacienteId: paciente.id});
    setBusquedaPaciente(`${paciente.nombre} ${paciente.apellido} - ${paciente.cedula}`);
    setMostrarListaPacientes(false);
  };

  const limpiarSeleccionPaciente = () => {
    setNuevaCita({...nuevaCita, pacienteId: ''});
    setBusquedaPaciente('');
    setMostrarListaPacientes(false);
  };

  const handleCrearPaciente = () => {
    const nuevoId = (pacientes.length + 1).toString();
    const pacienteCompleto: Paciente = {
      ...nuevoPaciente,
      id: nuevoId,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    
    setPacientes([...pacientes, pacienteCompleto]);
    
    // Seleccionar automáticamente el nuevo paciente
    setNuevaCita({...nuevaCita, pacienteId: nuevoId});
    setBusquedaPaciente(`${pacienteCompleto.nombre} ${pacienteCompleto.apellido} - ${pacienteCompleto.cedula}`);
    
    setShowNuevoPaciente(false);
    setNuevoPaciente({
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      fechaNacimiento: '',
      direccion: '',
      genero: '',
      contactoEmergencia: '',
      telefonoEmergencia: ''
    });
  };

  const handleCrearCita = () => {
    const nuevaId = (citas.length + 1).toString();
    const citaCompleta: Cita = {
      ...nuevaCita,
      id: nuevaId,
      estado: 'Programada'
    };
    
    setCitas([...citas, citaCompleta]);
    setShowNuevaCita(false);
    setNuevaCita({
      pacienteId: '',
      medicoId: esDashboardMedico ? (medicoLogueado?.id || '') : '',
      fecha: '',
      hora: '',
      duracion: 30,
      motivo: '',
      tipo: 'Consulta',
      recordatorio: true
    });
    setBusquedaPaciente('');
  };

  const cambiarEstadoCita = (citaId: string, nuevoEstado: Cita['estado']) => {
    setCitas(citas.map(cita => 
      cita.id === citaId ? { ...cita, estado: nuevoEstado } : cita
    ));
  };

  const iniciarConsulta = (cita: Cita) => {
    const paciente = obtenerPaciente(cita.pacienteId);
    if (paciente) {
      setPacienteSeleccionado(paciente);
      setShowHistorialMedico(true);
      cambiarEstadoCita(cita.id, 'En Curso');
    }
  };

  // Función para volver al historial médico de una cita en curso
  const volverAHistorial = (cita: Cita) => {
    const paciente = obtenerPaciente(cita.pacienteId);
    if (paciente) {
      setPacienteSeleccionado(paciente);
      setShowHistorialMedico(true);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando agenda médica..." />
      </div>
    );
  }

  // Si está mostrando el historial médico, renderizar solo ese componente
  if (showHistorialMedico && pacienteSeleccionado) {
    return (
      <div className="p-6 space-y-6">
        {/* Header con botón de regreso */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Historial Médico - {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
            </h1>
            <p className="text-gray-600">
              Cédula: {pacienteSeleccionado.cedula} | Tel: {pacienteSeleccionado.telefono}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setShowHistorialMedico(false);
              setPacienteSeleccionado(null);
            }}
          >
            ← Volver a Agenda
          </Button>
        </div>
        
        {/* Componente de historial médico con paciente y médico preseleccionados */}
        <HistorialMedicoComponent 
          pacienteSeleccionado={pacienteSeleccionado}
          medicoLogueado={medicoLogueado}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda Médica</h1>
          <p className="text-gray-600">Gestión de citas y horarios médicos</p>
        </div>
        
        <Dialog open={showNuevaCita} onOpenChange={setShowNuevaCita}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Programar Nueva Cita</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información del paciente con botón directo para crear paciente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="paciente">Paciente</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowNuevoPaciente(true)}
                      className="text-xs"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Nuevo Paciente
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="Escriba el nombre del paciente..."
                      value={busquedaPaciente}
                      onChange={(e) => setBusquedaPaciente(e.target.value)}
                      onFocus={() => {
                        if (busquedaPaciente && pacientesFiltrados.length > 0) {
                          setMostrarListaPacientes(true);
                        }
                      }}
                      className="pr-10"
                    />
                    {nuevaCita.pacienteId && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={limpiarSeleccionPaciente}
                      >
                        ×
                      </Button>
                    )}
                    
                    {/* Lista desplegable de pacientes filtrados */}
                    {mostrarListaPacientes && pacientesFiltrados.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {pacientesFiltrados.map(paciente => (
                          <div
                            key={paciente.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => seleccionarPaciente(paciente)}
                          >
                            <div className="font-medium">{paciente.nombre} {paciente.apellido}</div>
                            <div className="text-sm text-gray-600">
                              Cédula: {paciente.cedula} | Tel: {paciente.telefono}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Mensaje cuando no hay resultados y botón para crear paciente */}
                    {mostrarListaPacientes && busquedaPaciente && pacientesFiltrados.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                        <div className="text-center text-gray-500 mb-3">
                          No se encontró el paciente "{busquedaPaciente}"
                        </div>
                        <Button
                          onClick={() => {
                            setShowNuevoPaciente(true);
                            setMostrarListaPacientes(false);
                          }}
                          className="w-full"
                          variant="outline"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Crear Nuevo Paciente
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Médico */}
                <div>
                  <Label htmlFor="medico">Médico</Label>
                  {esDashboardMedico ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="font-medium text-blue-900">
                        {medicoLogueado?.nombre} {medicoLogueado?.apellido}
                      </div>
                      <div className="text-sm text-blue-700">
                        {medicoLogueado?.especialidad} | Lic. {medicoLogueado?.numeroLicencia}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        (Médico actual - Sesión activa)
                      </div>
                    </div>
                  ) : (
                    <Select value={nuevaCita.medicoId} onValueChange={(value) => setNuevaCita({...nuevaCita, medicoId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar médico" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicos.map(medico => (
                          <SelectItem key={medico.id} value={medico.id}>
                            {medico.nombre} {medico.apellido} - {medico.especialidad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Fecha y hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    type="date"
                    value={nuevaCita.fecha}
                    onChange={(e) => setNuevaCita({...nuevaCita, fecha: e.target.value, hora: ''})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="hora">Hora disponible</Label>
                  <Select 
                    value={nuevaCita.hora} 
                    onValueChange={(value) => setNuevaCita({...nuevaCita, hora: value})}
                    disabled={!nuevaCita.fecha || !nuevaCita.medicoId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !nuevaCita.fecha ? "Seleccione fecha primero" : 
                        !nuevaCita.medicoId ? "Seleccione médico primero" :
                        horariosLibres.length === 0 ? "No hay horarios disponibles" :
                        "Seleccionar horario"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {horariosLibres.map(horario => (
                        <SelectItem key={horario} value={horario}>
                          {horario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {nuevaCita.fecha && nuevaCita.medicoId && horariosLibres.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      No hay horarios disponibles para esta fecha
                    </p>
                  )}
                </div>
              </div>

              {/* Tipo y duración */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de cita</Label>
                  <Select value={nuevaCita.tipo} onValueChange={(value: Cita['tipo']) => setNuevaCita({...nuevaCita, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta">Consulta</SelectItem>
                      <SelectItem value="Control">Control</SelectItem>
                      <SelectItem value="Emergencia">Emergencia</SelectItem>
                      <SelectItem value="Procedimiento">Procedimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duracion">Duración (minutos)</Label>
                  <Select value={nuevaCita.duracion.toString()} onValueChange={(value) => setNuevaCita({...nuevaCita, duracion: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Motivo */}
              <div>
                <Label htmlFor="motivo">Motivo de la consulta</Label>
                <Textarea
                  placeholder="Describe el motivo de la cita..."
                  value={nuevaCita.motivo}
                  onChange={(e) => setNuevaCita({...nuevaCita, motivo: e.target.value})}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleCrearCita} 
                className="w-full" 
                disabled={!nuevaCita.pacienteId || !nuevaCita.medicoId || !nuevaCita.fecha || !nuevaCita.hora || !nuevaCita.motivo}
              >
                Programar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal para crear nuevo paciente */}
      <Dialog open={showNuevoPaciente} onOpenChange={setShowNuevoPaciente}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Paciente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  placeholder="Nombre del paciente"
                  value={nuevoPaciente.nombre}
                  onChange={(e) => setNuevoPaciente({...nuevoPaciente, nombre: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  placeholder="Apellido del paciente"
                  value={nuevoPaciente.apellido}
                  onChange={(e) => setNuevoPaciente({...nuevoPaciente, apellido: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  placeholder="Número de cédula"
                  value={nuevoPaciente.cedula}
                  onChange={(e) => setNuevoPaciente({...nuevoPaciente, cedula: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  placeholder="Número de teléfono"
                  value={nuevoPaciente.telefono}
                  onChange={(e) => setNuevoPaciente({...nuevoPaciente, telefono: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={nuevoPaciente.email}
                  onChange={(e) => setNuevoPaciente({...nuevoPaciente, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  value={nuevoPaciente.fechaNacimiento}
                  onChange={(e) => setNuevoPaciente({...nuevoPaciente, fechaNacimiento: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="genero">Género</Label>
              <Select value={nuevoPaciente.genero} onValueChange={(value) => setNuevoPaciente({...nuevoPaciente, genero: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea
                placeholder="Dirección completa"
                value={nuevoPaciente.direccion}
                onChange={(e) => setNuevoPaciente({...nuevoPaciente, direccion: e.target.value})}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactoEmergencia">Contacto de Emergencia</Label>
                <Input
                  placeholder="Nombre del contacto"
                  value={nuevoPaciente.contactoEmergencia}
                  onChange={(e) => setNuevoPaciente({...nuevoPaciente, contactoEmergencia: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="telefonoEmergencia">Teléfono de Emergencia</Label>
                <Input
                  placeholder="Teléfono del contacto"
                  value={nuevoPaciente.telefonoEmergencia}
                  onChange={(e) => setNuevoPaciente({...nuevoPaciente, telefonoEmergencia: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCrearPaciente} 
                className="flex-1"
                disabled={!nuevoPaciente.nombre || !nuevoPaciente.apellido || !nuevoPaciente.cedula || !nuevoPaciente.telefono}
              >
                Crear Paciente y Continuar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNuevoPaciente(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente, médico o motivo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-40"
              />
              
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Programada">Programada</SelectItem>
                  <SelectItem value="En Curso">En Curso</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vista del calendario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario mini */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="mb-4"
            />
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Citas del día: {citasDelDia.length}
              </div>
              
              {citasDelDia.slice(0, 3).map(cita => {
                const paciente = obtenerPaciente(cita.pacienteId);
                return (
                  <div key={cita.id} className="p-2 bg-blue-50 rounded-lg text-sm">
                    <div className="font-medium">{cita.hora}</div>
                    <div className="text-gray-600">
                      {paciente?.nombre} {paciente?.apellido}
                    </div>
                  </div>
                );
              })}
              
              {citasDelDia.length > 3 && (
                <div className="text-sm text-blue-600">
                  +{citasDelDia.length - 3} citas más
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de citas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Citas Programadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {citasFiltradas.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron citas
                  </div>
                ) : (
                  citasFiltradas.map(cita => {
                    const paciente = obtenerPaciente(cita.pacienteId);
                    const medico = obtenerMedico(cita.medicoId);
                    
                    return (
                      <div key={cita.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={getEstadoColor(cita.estado)}>
                                {getEstadoIcon(cita.estado)}
                                <span className="ml-1">{cita.estado}</span>
                              </Badge>
                              <Badge variant="outline">{cita.tipo}</Badge>
                              {cita.recordatorio && <Bell className="w-4 h-4 text-blue-500" />}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {paciente?.nombre} {paciente?.apellido}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <User className="w-4 h-4 inline mr-1" />
                                  {medico?.nombre} {medico?.apellido}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {medico?.especialidad}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  {new Date(cita.fecha).toLocaleDateString('es-ES')}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  {cita.hora} ({cita.duracion} min)
                                </div>
                                <div className="text-sm text-gray-900 mt-1">
                                  <strong>Motivo:</strong> {cita.motivo}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            {cita.estado === 'Programada' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => iniciarConsulta(cita)}
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                  Iniciar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => cambiarEstadoCita(cita.id, 'Cancelada')}
                                >
                                  Cancelar
                                </Button>
                              </>
                            )}
                            
                            {cita.estado === 'En Curso' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => volverAHistorial(cita)}
                                  variant="outline"
                                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  Historial
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => cambiarEstadoCita(cita.id, 'Completada')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Completar
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {cita.notas && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                            <strong>Notas:</strong> {cita.notas}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgendaMedica;