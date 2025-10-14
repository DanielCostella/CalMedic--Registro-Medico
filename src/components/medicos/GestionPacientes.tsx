import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, Calendar, AlertTriangle, FileText, User, Heart, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Checkbox } from '@/components/ui/checkbox';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  edad: number;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  telefono: string;
  email: string;
  direccion: string;
  tipoSangre: string;
  estadoCivil: string;
  ocupacion: string;
  contactoEmergencia: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
  alergias: string[];
  condicionesMedicas: string[];
  medicamentosActuales: string[];
  seguroMedico: {
    compania: string;
    numeroPoliza: string;
    vigencia: string;
  };
  fechaRegistro: string;
  ultimaConsulta: string;
  proximaCita?: string;
  estado: 'Activo' | 'Inactivo' | 'Fallecido';
  notas: string;
}

const GestionPacientesComponent: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNuevoPaciente, setShowNuevoPaciente] = useState(false);
  const [showEditarPaciente, setShowEditarPaciente] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroEdad, setFiltroEdad] = useState('');

  const [nuevoPaciente, setNuevoPaciente] = useState<Omit<Paciente, 'id' | 'edad' | 'fechaRegistro'>>({
    nombre: '',
    apellido: '',
    cedula: '',
    fechaNacimiento: '',
    genero: 'Masculino',
    telefono: '',
    email: '',
    direccion: '',
    tipoSangre: '',
    estadoCivil: '',
    ocupacion: '',
    contactoEmergencia: {
      nombre: '',
      telefono: '',
      relacion: ''
    },
    alergias: [],
    condicionesMedicas: [],
    medicamentosActuales: [],
    seguroMedico: {
      compania: '',
      numeroPoliza: '',
      vigencia: ''
    },
    ultimaConsulta: '',
    estado: 'Activo',
    notas: ''
  });

  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const [nuevaCondicion, setNuevaCondicion] = useState('');
  const [nuevoMedicamento, setNuevoMedicamento] = useState('');

  useEffect(() => {
    // Simular carga de datos de pacientes
    setTimeout(() => {
      const pacientesIniciales: Paciente[] = [
        {
          id: '1',
          nombre: 'María',
          apellido: 'González',
          cedula: '12345678',
          fechaNacimiento: '1985-03-15',
          edad: 38,
          genero: 'Femenino',
          telefono: '+58 414-1234567',
          email: 'maria.gonzalez@email.com',
          direccion: 'Av. Principal, Caracas',
          tipoSangre: 'O+',
          estadoCivil: 'Casada',
          ocupacion: 'Profesora',
          contactoEmergencia: {
            nombre: 'Carlos González',
            telefono: '+58 424-7654321',
            relacion: 'Esposo'
          },
          alergias: ['Penicilina', 'Mariscos'],
          condicionesMedicas: ['Hipertensión', 'Diabetes Tipo 2'],
          medicamentosActuales: ['Metformina 500mg', 'Enalapril 10mg'],
          seguroMedico: {
            compania: 'Seguros Caracas',
            numeroPoliza: 'SC-123456789',
            vigencia: '2024-12-31'
          },
          fechaRegistro: '2020-01-15',
          ultimaConsulta: '2024-01-10',
          proximaCita: '2024-02-15',
          estado: 'Activo',
          notas: 'Paciente colaboradora, requiere seguimiento estrecho de glicemia.'
        },
        {
          id: '2',
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          cedula: '87654321',
          fechaNacimiento: '1975-07-22',
          edad: 48,
          genero: 'Masculino',
          telefono: '+58 412-9876543',
          email: 'carlos.rodriguez@email.com',
          direccion: 'Calle 5, Valencia',
          tipoSangre: 'A+',
          estadoCivil: 'Soltero',
          ocupacion: 'Ingeniero',
          contactoEmergencia: {
            nombre: 'Ana Rodríguez',
            telefono: '+58 414-5555555',
            relacion: 'Hermana'
          },
          alergias: ['Aspirina'],
          condicionesMedicas: ['Arritmia cardíaca'],
          medicamentosActuales: ['Atenolol 50mg'],
          seguroMedico: {
            compania: 'Seguros Universal',
            numeroPoliza: 'SU-987654321',
            vigencia: '2024-06-30'
          },
          fechaRegistro: '2019-05-20',
          ultimaConsulta: '2024-01-08',
          estado: 'Activo',
          notas: 'Paciente con antecedentes familiares de enfermedad cardíaca.'
        },
        {
          id: '3',
          nombre: 'Ana',
          apellido: 'Martínez',
          cedula: '11223344',
          fechaNacimiento: '1990-11-08',
          edad: 33,
          genero: 'Femenino',
          telefono: '+58 416-1111111',
          email: 'ana.martinez@email.com',
          direccion: 'Urbanización Los Palos Grandes, Caracas',
          tipoSangre: 'B-',
          estadoCivil: 'Soltera',
          ocupacion: 'Diseñadora',
          contactoEmergencia: {
            nombre: 'Luis Martínez',
            telefono: '+58 424-2222222',
            relacion: 'Padre'
          },
          alergias: [],
          condicionesMedicas: ['Migraña crónica'],
          medicamentosActuales: ['Sumatriptán 50mg'],
          seguroMedico: {
            compania: 'Seguros La Previsora',
            numeroPoliza: 'LP-555666777',
            vigencia: '2024-09-15'
          },
          fechaRegistro: '2021-03-10',
          ultimaConsulta: '2023-12-20',
          estado: 'Activo',
          notas: 'Paciente joven, episodios de migraña relacionados con estrés laboral.'
        }
      ];
      setPacientes(pacientesIniciales);
      setLoading(false);
    }, 1000);
  }, []);

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    
    if (mesActual < nacimiento.getMonth() || 
        (mesActual === nacimiento.getMonth() && diaActual < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };

  const agregarAlergia = () => {
    if (nuevaAlergia.trim()) {
      setNuevoPaciente(prev => ({
        ...prev,
        alergias: [...prev.alergias, nuevaAlergia.trim()]
      }));
      setNuevaAlergia('');
    }
  };

  const eliminarAlergia = (index: number) => {
    setNuevoPaciente(prev => ({
      ...prev,
      alergias: prev.alergias.filter((_, i) => i !== index)
    }));
  };

  const agregarCondicion = () => {
    if (nuevaCondicion.trim()) {
      setNuevoPaciente(prev => ({
        ...prev,
        condicionesMedicas: [...prev.condicionesMedicas, nuevaCondicion.trim()]
      }));
      setNuevaCondicion('');
    }
  };

  const eliminarCondicion = (index: number) => {
    setNuevoPaciente(prev => ({
      ...prev,
      condicionesMedicas: prev.condicionesMedicas.filter((_, i) => i !== index)
    }));
  };

  const agregarMedicamento = () => {
    if (nuevoMedicamento.trim()) {
      setNuevoPaciente(prev => ({
        ...prev,
        medicamentosActuales: [...prev.medicamentosActuales, nuevoMedicamento.trim()]
      }));
      setNuevoMedicamento('');
    }
  };

  const eliminarMedicamento = (index: number) => {
    setNuevoPaciente(prev => ({
      ...prev,
      medicamentosActuales: prev.medicamentosActuales.filter((_, i) => i !== index)
    }));
  };

  const handleCrearPaciente = () => {
    const pacienteCompleto: Paciente = {
      ...nuevoPaciente,
      id: Date.now().toString(),
      edad: calcularEdad(nuevoPaciente.fechaNacimiento),
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    
    setPacientes(prev => [...prev, pacienteCompleto]);
    setShowNuevoPaciente(false);
    resetFormulario();
  };

  const handleEditarPaciente = () => {
    if (pacienteSeleccionado) {
      const pacienteActualizado: Paciente = {
        ...nuevoPaciente,
        id: pacienteSeleccionado.id,
        edad: calcularEdad(nuevoPaciente.fechaNacimiento),
        fechaRegistro: pacienteSeleccionado.fechaRegistro
      };
      
      setPacientes(prev => prev.map(p => 
        p.id === pacienteSeleccionado.id ? pacienteActualizado : p
      ));
      setShowEditarPaciente(false);
      setPacienteSeleccionado(null);
      resetFormulario();
    }
  };

  const handleEliminarPaciente = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      setPacientes(prev => prev.filter(p => p.id !== id));
    }
  };

  const resetFormulario = () => {
    setNuevoPaciente({
      nombre: '',
      apellido: '',
      cedula: '',
      fechaNacimiento: '',
      genero: 'Masculino',
      telefono: '',
      email: '',
      direccion: '',
      tipoSangre: '',
      estadoCivil: '',
      ocupacion: '',
      contactoEmergencia: {
        nombre: '',
        telefono: '',
        relacion: ''
      },
      alergias: [],
      condicionesMedicas: [],
      medicamentosActuales: [],
      seguroMedico: {
        compania: '',
        numeroPoliza: '',
        vigencia: ''
      },
      ultimaConsulta: '',
      estado: 'Activo',
      notas: ''
    });
    setNuevaAlergia('');
    setNuevaCondicion('');
    setNuevoMedicamento('');
  };

  const abrirEditar = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setNuevoPaciente({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      cedula: paciente.cedula,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      telefono: paciente.telefono,
      email: paciente.email,
      direccion: paciente.direccion,
      tipoSangre: paciente.tipoSangre,
      estadoCivil: paciente.estadoCivil,
      ocupacion: paciente.ocupacion,
      contactoEmergencia: paciente.contactoEmergencia,
      alergias: paciente.alergias,
      condicionesMedicas: paciente.condicionesMedicas,
      medicamentosActuales: paciente.medicamentosActuales,
      seguroMedico: paciente.seguroMedico,
      ultimaConsulta: paciente.ultimaConsulta,
      estado: paciente.estado,
      notas: paciente.notas
    });
    setShowEditarPaciente(true);
  };

  const pacientesFiltrados = pacientes.filter(paciente => {
    const matchBusqueda = !busqueda || 
      paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente.cedula.includes(busqueda) ||
      paciente.telefono.includes(busqueda);
    
    const matchGenero = !filtroGenero || paciente.genero === filtroGenero;
    const matchEstado = !filtroEstado || paciente.estado === filtroEstado;
    
    let matchEdad = true;
    if (filtroEdad) {
      switch (filtroEdad) {
        case 'menor-18':
          matchEdad = paciente.edad < 18;
          break;
        case '18-30':
          matchEdad = paciente.edad >= 18 && paciente.edad <= 30;
          break;
        case '31-50':
          matchEdad = paciente.edad >= 31 && paciente.edad <= 50;
          break;
        case 'mayor-50':
          matchEdad = paciente.edad > 50;
          break;
      }
    }
    
    return matchBusqueda && matchGenero && matchEstado && matchEdad;
  });

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando pacientes..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-8 h-8 text-blue-600" />
            Gestión de Pacientes
          </h1>
          <p className="text-gray-600">
            Administra la información completa de tus pacientes
          </p>
        </div>
        
        <Dialog open={showNuevoPaciente} onOpenChange={setShowNuevoPaciente}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Datos Personales</TabsTrigger>
                <TabsTrigger value="contacto">Contacto</TabsTrigger>
                <TabsTrigger value="medico">Información Médica</TabsTrigger>
                <TabsTrigger value="seguro">Seguro y Notas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={nuevoPaciente.nombre}
                      onChange={(e) => setNuevoPaciente({...nuevoPaciente, nombre: e.target.value})}
                      placeholder="Nombre del paciente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={nuevoPaciente.apellido}
                      onChange={(e) => setNuevoPaciente({...nuevoPaciente, apellido: e.target.value})}
                      placeholder="Apellido del paciente"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cedula">Cédula *</Label>
                    <Input
                      id="cedula"
                      value={nuevoPaciente.cedula}
                      onChange={(e) => setNuevoPaciente({...nuevoPaciente, cedula: e.target.value})}
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                    <Input
                      id="fechaNacimiento"
                      type="date"
                      value={nuevoPaciente.fechaNacimiento}
                      onChange={(e) => setNuevoPaciente({...nuevoPaciente, fechaNacimiento: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="genero">Género *</Label>
                    <Select value={nuevoPaciente.genero} onValueChange={(value: 'Masculino' | 'Femenino' | 'Otro') => setNuevoPaciente({...nuevoPaciente, genero: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Femenino">Femenino</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
                    <Select value={nuevoPaciente.tipoSangre} onValueChange={(value) => setNuevoPaciente({...nuevoPaciente, tipoSangre: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                    <Select value={nuevoPaciente.estadoCivil} onValueChange={(value) => setNuevoPaciente({...nuevoPaciente, estadoCivil: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Soltero">Soltero</SelectItem>
                        <SelectItem value="Casado">Casado</SelectItem>
                        <SelectItem value="Divorciado">Divorciado</SelectItem>
                        <SelectItem value="Viudo">Viudo</SelectItem>
                        <SelectItem value="Unión libre">Unión libre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ocupacion">Ocupación</Label>
                    <Input
                      id="ocupacion"
                      value={nuevoPaciente.ocupacion}
                      onChange={(e) => setNuevoPaciente({...nuevoPaciente, ocupacion: e.target.value})}
                      placeholder="Profesión u ocupación"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contacto" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={nuevoPaciente.telefono}
                      onChange={(e) => setNuevoPaciente({...nuevoPaciente, telefono: e.target.value})}
                      placeholder="+58 414-1234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={nuevoPaciente.email}
                      onChange={(e) => setNuevoPaciente({...nuevoPaciente, email: e.target.value})}
                      placeholder="paciente@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Textarea
                    id="direccion"
                    value={nuevoPaciente.direccion}
                    onChange={(e) => setNuevoPaciente({...nuevoPaciente, direccion: e.target.value})}
                    placeholder="Dirección completa del paciente"
                    rows={2}
                  />
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Contacto de Emergencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contacto-nombre">Nombre</Label>
                      <Input
                        id="contacto-nombre"
                        value={nuevoPaciente.contactoEmergencia.nombre}
                        onChange={(e) => setNuevoPaciente({
                          ...nuevoPaciente,
                          contactoEmergencia: {
                            ...nuevoPaciente.contactoEmergencia,
                            nombre: e.target.value
                          }
                        })}
                        placeholder="Nombre del contacto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contacto-telefono">Teléfono</Label>
                      <Input
                        id="contacto-telefono"
                        value={nuevoPaciente.contactoEmergencia.telefono}
                        onChange={(e) => setNuevoPaciente({
                          ...nuevoPaciente,
                          contactoEmergencia: {
                            ...nuevoPaciente.contactoEmergencia,
                            telefono: e.target.value
                          }
                        })}
                        placeholder="+58 424-7654321"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contacto-relacion">Relación</Label>
                      <Input
                        id="contacto-relacion"
                        value={nuevoPaciente.contactoEmergencia.relacion}
                        onChange={(e) => setNuevoPaciente({
                          ...nuevoPaciente,
                          contactoEmergencia: {
                            ...nuevoPaciente.contactoEmergencia,
                            relacion: e.target.value
                          }
                        })}
                        placeholder="Esposo, Madre, etc."
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medico" className="space-y-4">
                <div>
                  <Label htmlFor="alergias">Alergias</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={nuevaAlergia}
                      onChange={(e) => setNuevaAlergia(e.target.value)}
                      placeholder="Agregar alergia"
                      onKeyPress={(e) => e.key === 'Enter' && agregarAlergia()}
                    />
                    <Button type="button" onClick={agregarAlergia}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nuevoPaciente.alergias.map((alergia, index) => (
                      <Badge key={index} variant="destructive" className="cursor-pointer" onClick={() => eliminarAlergia(index)}>
                        {alergia} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="condiciones">Condiciones Médicas</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={nuevaCondicion}
                      onChange={(e) => setNuevaCondicion(e.target.value)}
                      placeholder="Agregar condición médica"
                      onKeyPress={(e) => e.key === 'Enter' && agregarCondicion()}
                    />
                    <Button type="button" onClick={agregarCondicion}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nuevoPaciente.condicionesMedicas.map((condicion, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => eliminarCondicion(index)}>
                        {condicion} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="medicamentos">Medicamentos Actuales</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={nuevoMedicamento}
                      onChange={(e) => setNuevoMedicamento(e.target.value)}
                      placeholder="Agregar medicamento"
                      onKeyPress={(e) => e.key === 'Enter' && agregarMedicamento()}
                    />
                    <Button type="button" onClick={agregarMedicamento}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nuevoPaciente.medicamentosActuales.map((medicamento, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => eliminarMedicamento(index)}>
                        {medicamento} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="seguro" className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Seguro Médico</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="seguro-compania">Compañía</Label>
                      <Input
                        id="seguro-compania"
                        value={nuevoPaciente.seguroMedico.compania}
                        onChange={(e) => setNuevoPaciente({
                          ...nuevoPaciente,
                          seguroMedico: {
                            ...nuevoPaciente.seguroMedico,
                            compania: e.target.value
                          }
                        })}
                        placeholder="Nombre de la aseguradora"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seguro-poliza">Número de Póliza</Label>
                      <Input
                        id="seguro-poliza"
                        value={nuevoPaciente.seguroMedico.numeroPoliza}
                        onChange={(e) => setNuevoPaciente({
                          ...nuevoPaciente,
                          seguroMedico: {
                            ...nuevoPaciente.seguroMedico,
                            numeroPoliza: e.target.value
                          }
                        })}
                        placeholder="Número de póliza"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seguro-vigencia">Vigencia</Label>
                      <Input
                        id="seguro-vigencia"
                        type="date"
                        value={nuevoPaciente.seguroMedico.vigencia}
                        onChange={(e) => setNuevoPaciente({
                          ...nuevoPaciente,
                          seguroMedico: {
                            ...nuevoPaciente.seguroMedico,
                            vigencia: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Textarea
                    id="notas"
                    value={nuevoPaciente.notas}
                    onChange={(e) => setNuevoPaciente({...nuevoPaciente, notas: e.target.value})}
                    placeholder="Observaciones importantes sobre el paciente..."
                    rows={4}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {setShowNuevoPaciente(false); resetFormulario();}}>
                Cancelar
              </Button>
              <Button onClick={handleCrearPaciente}>
                Registrar Paciente
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
                <p className="text-blue-100">Total Pacientes</p>
                <p className="text-2xl font-bold">{pacientes.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Activos</p>
                <p className="text-2xl font-bold">
                  {pacientes.filter(p => p.estado === 'Activo').length}
                </p>
              </div>
              <Heart className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Con Alergias</p>
                <p className="text-2xl font-bold">
                  {pacientes.filter(p => p.alergias.length > 0).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Con Medicamentos</p>
                <p className="text-2xl font-bold">
                  {pacientes.filter(p => p.medicamentosActuales.length > 0).length}
                </p>
              </div>
              <Pill className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, apellido, cédula o teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filtroGenero} onValueChange={setFiltroGenero}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtroEdad} onValueChange={setFiltroEdad}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Edad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="menor-18">Menor 18</SelectItem>
                  <SelectItem value="18-30">18-30</SelectItem>
                  <SelectItem value="31-50">31-50</SelectItem>
                  <SelectItem value="mayor-50">Mayor 50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pacientes */}
      <div className="space-y-4">
        {pacientesFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron pacientes que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          pacientesFiltrados.map(paciente => (
            <Card key={paciente.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {paciente.nombre} {paciente.apellido}
                      </h3>
                      <Badge variant={paciente.estado === 'Activo' ? 'default' : 'secondary'}>
                        {paciente.estado}
                      </Badge>
                      {paciente.alergias.length > 0 && (
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Alergias
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Cédula: {paciente.cedula}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{paciente.edad} años</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{paciente.telefono}</span>
                      </div>
                    </div>
                    
                    {paciente.condicionesMedicas.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Condiciones: </span>
                        <div className="inline-flex flex-wrap gap-1">
                          {paciente.condicionesMedicas.map((condicion, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {condicion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {paciente.ultimaConsulta && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Última consulta:</span> {new Date(paciente.ultimaConsulta).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPacienteSeleccionado(paciente)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => abrirEditar(paciente)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEliminarPaciente(paciente.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Vista Detallada */}
      <Dialog open={!!pacienteSeleccionado && !showEditarPaciente} onOpenChange={() => setPacienteSeleccionado(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {pacienteSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="medico">Médico</TabsTrigger>
                  <TabsTrigger value="contacto">Contacto</TabsTrigger>
                  <TabsTrigger value="seguro">Seguro</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div><strong>Cédula:</strong> {pacienteSeleccionado.cedula}</div>
                      <div><strong>Fecha de nacimiento:</strong> {new Date(pacienteSeleccionado.fechaNacimiento).toLocaleDateString('es-ES')}</div>
                      <div><strong>Edad:</strong> {pacienteSeleccionado.edad} años</div>
                      <div><strong>Género:</strong> {pacienteSeleccionado.genero}</div>
                      <div><strong>Tipo de sangre:</strong> {pacienteSeleccionado.tipoSangre}</div>
                    </div>
                    <div className="space-y-3">
                      <div><strong>Estado civil:</strong> {pacienteSeleccionado.estadoCivil}</div>
                      <div><strong>Ocupación:</strong> {pacienteSeleccionado.ocupacion}</div>
                      <div><strong>Estado:</strong> 
                        <Badge className="ml-2" variant={pacienteSeleccionado.estado === 'Activo' ? 'default' : 'secondary'}>
                          {pacienteSeleccionado.estado}
                        </Badge>
                      </div>
                      <div><strong>Fecha de registro:</strong> {new Date(pacienteSeleccionado.fechaRegistro).toLocaleDateString('es-ES')}</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="medico" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Alergias</h4>
                      {pacienteSeleccionado.alergias.length === 0 ? (
                        <p className="text-gray-500">Sin alergias registradas</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {pacienteSeleccionado.alergias.map((alergia, index) => (
                            <Badge key={index} variant="destructive">{alergia}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Condiciones Médicas</h4>
                      {pacienteSeleccionado.condicionesMedicas.length === 0 ? (
                        <p className="text-gray-500">Sin condiciones médicas registradas</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {pacienteSeleccionado.condicionesMedicas.map((condicion, index) => (
                            <Badge key={index} variant="secondary">{condicion}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Medicamentos Actuales</h4>
                      {pacienteSeleccionado.medicamentosActuales.length === 0 ? (
                        <p className="text-gray-500">Sin medicamentos actuales</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {pacienteSeleccionado.medicamentosActuales.map((medicamento, index) => (
                            <Badge key={index} variant="outline">{medicamento}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contacto" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <strong>Teléfono:</strong> {pacienteSeleccionado.telefono}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <strong>Email:</strong> {pacienteSeleccionado.email || 'No registrado'}
                      </div>
                      <div>
                        <strong>Dirección:</strong>
                        <p className="mt-1 text-gray-600">{pacienteSeleccionado.direccion || 'No registrada'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Contacto de Emergencia</h4>
                      <div><strong>Nombre:</strong> {pacienteSeleccionado.contactoEmergencia.nombre || 'No registrado'}</div>
                      <div><strong>Teléfono:</strong> {pacienteSeleccionado.contactoEmergencia.telefono || 'No registrado'}</div>
                      <div><strong>Relación:</strong> {pacienteSeleccionado.contactoEmergencia.relacion || 'No registrada'}</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="seguro" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Seguro Médico</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><strong>Compañía:</strong> {pacienteSeleccionado.seguroMedico.compania || 'No registrada'}</div>
                        <div><strong>Póliza:</strong> {pacienteSeleccionado.seguroMedico.numeroPoliza || 'No registrada'}</div>
                        <div><strong>Vigencia:</strong> {pacienteSeleccionado.seguroMedico.vigencia ? new Date(pacienteSeleccionado.seguroMedico.vigencia).toLocaleDateString('es-ES') : 'No registrada'}</div>
                      </div>
                    </div>
                    
                    {pacienteSeleccionado.notas && (
                      <div>
                        <h4 className="font-semibold mb-2">Notas</h4>
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{pacienteSeleccionado.notas}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edición (similar al de creación pero con datos precargados) */}
      <Dialog open={showEditarPaciente} onOpenChange={setShowEditarPaciente}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          
          {/* Aquí iría el mismo formulario que en crear, pero con handleEditarPaciente */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => {setShowEditarPaciente(false); resetFormulario();}}>
              Cancelar
            </Button>
            <Button onClick={handleEditarPaciente}>
              Actualizar Paciente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionPacientesComponent;