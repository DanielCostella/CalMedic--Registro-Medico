import React, { useState, useEffect } from 'react';
import { Users, Shield, Key, Eye, EyeOff, Plus, Edit, Trash2, Search, Filter, UserCheck, Settings, Lock, Unlock } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: 'Administrador' | 'Médico' | 'Enfermera' | 'Recepcionista' | 'Laboratorista';
  especialidad?: string;
  licenciaMedica?: string;
  estado: 'Activo' | 'Inactivo' | 'Suspendido';
  fechaCreacion: string;
  ultimoAcceso: string;
  permisos: string[];
  configuracion2FA: boolean;
  avatar?: string;
}

interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  color: string;
  activo: boolean;
}

interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  nivel: 'Lectura' | 'Escritura' | 'Administración';
}

interface SesionActiva {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  dispositivo: string;
  navegador: string;
  ip: string;
  fechaInicio: string;
  ultimaActividad: string;
  ubicacion: string;
}

const SistemaUsuariosComponent: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [sesionesActivas, setSesionesActivas] = useState<SesionActiva[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNuevoUsuario, setShowNuevoUsuario] = useState(false);
  const [showNuevoRol, setShowNuevoRol] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState<Omit<Usuario, 'id' | 'fechaCreacion' | 'ultimoAcceso'>>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: 'Médico',
    especialidad: '',
    licenciaMedica: '',
    estado: 'Activo',
    permisos: [],
    configuracion2FA: false
  });

  const [nuevoRol, setNuevoRol] = useState<Omit<Rol, 'id'>>({
    nombre: '',
    descripcion: '',
    permisos: [],
    color: '#3B82F6',
    activo: true
  });

  const [passwordTemporal, setPasswordTemporal] = useState('');

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const permisosIniciales: Permiso[] = [
        // Módulo Pacientes
        { id: '1', nombre: 'Ver Pacientes', descripcion: 'Visualizar lista de pacientes', modulo: 'Pacientes', nivel: 'Lectura' },
        { id: '2', nombre: 'Crear Pacientes', descripcion: 'Registrar nuevos pacientes', modulo: 'Pacientes', nivel: 'Escritura' },
        { id: '3', nombre: 'Editar Pacientes', descripcion: 'Modificar datos de pacientes', modulo: 'Pacientes', nivel: 'Escritura' },
        { id: '4', nombre: 'Eliminar Pacientes', descripcion: 'Eliminar registros de pacientes', modulo: 'Pacientes', nivel: 'Administración' },
        
        // Módulo Citas
        { id: '5', nombre: 'Ver Citas', descripcion: 'Visualizar calendario de citas', modulo: 'Citas', nivel: 'Lectura' },
        { id: '6', nombre: 'Programar Citas', descripcion: 'Crear nuevas citas', modulo: 'Citas', nivel: 'Escritura' },
        { id: '7', nombre: 'Modificar Citas', descripcion: 'Cambiar horarios y estados', modulo: 'Citas', nivel: 'Escritura' },
        { id: '8', nombre: 'Cancelar Citas', descripcion: 'Cancelar citas programadas', modulo: 'Citas', nivel: 'Escritura' },
        
        // Módulo Historial Médico
        { id: '9', nombre: 'Ver Historial', descripcion: 'Acceder a historiales médicos', modulo: 'Historial', nivel: 'Lectura' },
        { id: '10', nombre: 'Crear Historial', descripcion: 'Registrar nuevas consultas', modulo: 'Historial', nivel: 'Escritura' },
        { id: '11', nombre: 'Editar Historial', descripcion: 'Modificar registros médicos', modulo: 'Historial', nivel: 'Escritura' },
        
        // Módulo Recetario
        { id: '12', nombre: 'Ver Recetas', descripcion: 'Visualizar recetas emitidas', modulo: 'Recetario', nivel: 'Lectura' },
        { id: '13', nombre: 'Crear Recetas', descripcion: 'Emitir nuevas recetas', modulo: 'Recetario', nivel: 'Escritura' },
        { id: '14', nombre: 'Imprimir Recetas', descripcion: 'Generar recetas físicas', modulo: 'Recetario', nivel: 'Escritura' },
        
        // Módulo Laboratorios
        { id: '15', nombre: 'Ver Resultados', descripcion: 'Acceder a resultados de laboratorio', modulo: 'Laboratorios', nivel: 'Lectura' },
        { id: '16', nombre: 'Gestionar Laboratorios', descripcion: 'Configurar conexiones', modulo: 'Laboratorios', nivel: 'Administración' },
        
        // Módulo Sistema
        { id: '17', nombre: 'Gestionar Usuarios', descripcion: 'Administrar cuentas de usuario', modulo: 'Sistema', nivel: 'Administración' },
        { id: '18', nombre: 'Configurar Backup', descripcion: 'Gestionar copias de seguridad', modulo: 'Sistema', nivel: 'Administración' },
        { id: '19', nombre: 'Ver Reportes', descripcion: 'Acceder a reportes del sistema', modulo: 'Sistema', nivel: 'Lectura' },
        { id: '20', nombre: 'Generar Reportes', descripcion: 'Crear reportes personalizados', modulo: 'Sistema', nivel: 'Escritura' }
      ];

      const rolesIniciales: Rol[] = [
        {
          id: '1',
          nombre: 'Administrador',
          descripcion: 'Acceso completo al sistema',
          permisos: permisosIniciales.map(p => p.id),
          color: '#EF4444',
          activo: true
        },
        {
          id: '2',
          nombre: 'Médico',
          descripcion: 'Acceso a funciones médicas principales',
          permisos: ['1', '2', '3', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '19'],
          color: '#3B82F6',
          activo: true
        },
        {
          id: '3',
          nombre: 'Enfermera',
          descripcion: 'Apoyo en atención médica',
          permisos: ['1', '5', '6', '7', '9', '15', '19'],
          color: '#10B981',
          activo: true
        },
        {
          id: '4',
          nombre: 'Recepcionista',
          descripcion: 'Gestión de citas y pacientes',
          permisos: ['1', '2', '3', '5', '6', '7', '8'],
          color: '#F59E0B',
          activo: true
        },
        {
          id: '5',
          nombre: 'Laboratorista',
          descripcion: 'Gestión de resultados de laboratorio',
          permisos: ['1', '15', '16'],
          color: '#8B5CF6',
          activo: true
        }
      ];

      const usuariosIniciales: Usuario[] = [
        {
          id: '1',
          nombre: 'Dr. Juan',
          apellido: 'Pérez',
          email: 'juan.perez@clinica.com',
          telefono: '+1234567890',
          rol: 'Médico',
          especialidad: 'Cardiología',
          licenciaMedica: 'LIC-12345',
          estado: 'Activo',
          fechaCreacion: '2024-01-01',
          ultimoAcceso: '2024-01-16 14:30:00',
          permisos: rolesIniciales.find(r => r.nombre === 'Médico')?.permisos || [],
          configuracion2FA: true
        },
        {
          id: '2',
          nombre: 'Dra. María',
          apellido: 'González',
          email: 'maria.gonzalez@clinica.com',
          telefono: '+1234567891',
          rol: 'Médico',
          especialidad: 'Pediatría',
          licenciaMedica: 'LIC-12346',
          estado: 'Activo',
          fechaCreacion: '2024-01-02',
          ultimoAcceso: '2024-01-16 13:45:00',
          permisos: rolesIniciales.find(r => r.nombre === 'Médico')?.permisos || [],
          configuracion2FA: false
        },
        {
          id: '3',
          nombre: 'Ana',
          apellido: 'Martínez',
          email: 'ana.martinez@clinica.com',
          telefono: '+1234567892',
          rol: 'Enfermera',
          estado: 'Activo',
          fechaCreacion: '2024-01-03',
          ultimoAcceso: '2024-01-16 15:20:00',
          permisos: rolesIniciales.find(r => r.nombre === 'Enfermera')?.permisos || [],
          configuracion2FA: false
        },
        {
          id: '4',
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          email: 'carlos.rodriguez@clinica.com',
          telefono: '+1234567893',
          rol: 'Recepcionista',
          estado: 'Activo',
          fechaCreacion: '2024-01-04',
          ultimoAcceso: '2024-01-16 12:15:00',
          permisos: rolesIniciales.find(r => r.nombre === 'Recepcionista')?.permisos || [],
          configuracion2FA: false
        },
        {
          id: '5',
          nombre: 'Admin',
          apellido: 'Sistema',
          email: 'admin@clinica.com',
          telefono: '+1234567894',
          rol: 'Administrador',
          estado: 'Activo',
          fechaCreacion: '2024-01-01',
          ultimoAcceso: '2024-01-16 16:00:00',
          permisos: rolesIniciales.find(r => r.nombre === 'Administrador')?.permisos || [],
          configuracion2FA: true
        }
      ];

      const sesionesIniciales: SesionActiva[] = [
        {
          id: '1',
          usuarioId: '1',
          usuarioNombre: 'Dr. Juan Pérez',
          dispositivo: 'Desktop',
          navegador: 'Chrome 120.0',
          ip: '192.168.1.100',
          fechaInicio: '2024-01-16 08:00:00',
          ultimaActividad: '2024-01-16 14:30:00',
          ubicacion: 'Consultorio 1'
        },
        {
          id: '2',
          usuarioId: '2',
          usuarioNombre: 'Dra. María González',
          dispositivo: 'Tablet',
          navegador: 'Safari 17.2',
          ip: '192.168.1.101',
          fechaInicio: '2024-01-16 09:15:00',
          ultimaActividad: '2024-01-16 13:45:00',
          ubicacion: 'Consultorio 2'
        },
        {
          id: '3',
          usuarioId: '3',
          usuarioNombre: 'Ana Martínez',
          dispositivo: 'Mobile',
          navegador: 'Chrome Mobile 120.0',
          ip: '192.168.1.102',
          fechaInicio: '2024-01-16 07:30:00',
          ultimaActividad: '2024-01-16 15:20:00',
          ubicacion: 'Estación de Enfermería'
        }
      ];

      setPermisos(permisosIniciales);
      setRoles(rolesIniciales);
      setUsuarios(usuariosIniciales);
      setSesionesActivas(sesionesIniciales);
      setLoading(false);
    }, 1000);
  }, []);

  const crearUsuario = () => {
    const usuario: Usuario = {
      ...nuevoUsuario,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString().split('T')[0],
      ultimoAcceso: 'Nunca',
      permisos: roles.find(r => r.nombre === nuevoUsuario.rol)?.permisos || []
    };
    
    setUsuarios(prev => [...prev, usuario]);
    setShowNuevoUsuario(false);
    resetFormularioUsuario();
    
    // Generar contraseña temporal
    const passwordTemp = generarPasswordTemporal();
    setPasswordTemporal(passwordTemp);
    alert(`Usuario creado exitosamente.\nContraseña temporal: ${passwordTemp}\nEl usuario debe cambiarla en el primer acceso.`);
  };

  const crearRol = () => {
    const rol: Rol = {
      ...nuevoRol,
      id: Date.now().toString()
    };
    
    setRoles(prev => [...prev, rol]);
    setShowNuevoRol(false);
    resetFormularioRol();
  };

  const resetFormularioUsuario = () => {
    setNuevoUsuario({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      rol: 'Médico',
      especialidad: '',
      licenciaMedica: '',
      estado: 'Activo',
      permisos: [],
      configuracion2FA: false
    });
  };

  const resetFormularioRol = () => {
    setNuevoRol({
      nombre: '',
      descripcion: '',
      permisos: [],
      color: '#3B82F6',
      activo: true
    });
  };

  const generarPasswordTemporal = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const cambiarEstadoUsuario = (usuarioId: string, nuevoEstado: Usuario['estado']) => {
    setUsuarios(prev => prev.map(u => 
      u.id === usuarioId ? { ...u, estado: nuevoEstado } : u
    ));
  };

  const resetearPassword = (usuarioId: string) => {
    const passwordTemp = generarPasswordTemporal();
    setPasswordTemporal(passwordTemp);
    alert(`Nueva contraseña temporal generada: ${passwordTemp}\nEl usuario debe cambiarla en el próximo acceso.`);
  };

  const cerrarSesion = (sesionId: string) => {
    if (confirm('¿Está seguro de que desea cerrar esta sesión?')) {
      setSesionesActivas(prev => prev.filter(s => s.id !== sesionId));
    }
  };

  const eliminarUsuario = (usuarioId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
      setUsuarios(prev => prev.filter(u => u.id !== usuarioId));
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchBusqueda = !busqueda || 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchRol = !filtroRol || usuario.rol === filtroRol;
    const matchEstado = !filtroEstado || usuario.estado === filtroEstado;
    
    return matchBusqueda && matchRol && matchEstado;
  });

  const obtenerColorRol = (rol: string) => {
    const rolObj = roles.find(r => r.nombre === rol);
    return rolObj?.color || '#6B7280';
  };

  const obtenerPermisosRol = (rolNombre: string) => {
    const rol = roles.find(r => r.nombre === rolNombre);
    return rol?.permisos || [];
  };

  const modulos = [...new Set(permisos.map(p => p.modulo))];

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando sistema de usuarios..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Sistema de Usuarios y Permisos
          </h1>
          <p className="text-gray-600">
            Gestión completa de usuarios, roles y permisos del sistema médico
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showNuevoRol} onOpenChange={setShowNuevoRol}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Nuevo Rol
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Rol</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre-rol">Nombre del Rol</Label>
                    <Input
                      id="nombre-rol"
                      value={nuevoRol.nombre}
                      onChange={(e) => setNuevoRol({...nuevoRol, nombre: e.target.value})}
                      placeholder="ej: Especialista"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color-rol">Color</Label>
                    <Input
                      id="color-rol"
                      type="color"
                      value={nuevoRol.color}
                      onChange={(e) => setNuevoRol({...nuevoRol, color: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="descripcion-rol">Descripción</Label>
                  <Input
                    id="descripcion-rol"
                    value={nuevoRol.descripcion}
                    onChange={(e) => setNuevoRol({...nuevoRol, descripcion: e.target.value})}
                    placeholder="Descripción del rol..."
                  />
                </div>
                
                <div>
                  <Label>Permisos</Label>
                  <div className="mt-2 space-y-4 max-h-60 overflow-y-auto">
                    {modulos.map(modulo => (
                      <div key={modulo} className="border rounded-lg p-3">
                        <h4 className="font-medium mb-2">{modulo}</h4>
                        <div className="space-y-2">
                          {permisos.filter(p => p.modulo === modulo).map(permiso => (
                            <div key={permiso.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`permiso-${permiso.id}`}
                                checked={nuevoRol.permisos.includes(permiso.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNuevoRol({...nuevoRol, permisos: [...nuevoRol.permisos, permiso.id]});
                                  } else {
                                    setNuevoRol({...nuevoRol, permisos: nuevoRol.permisos.filter(p => p !== permiso.id)});
                                  }
                                }}
                              />
                              <Label htmlFor={`permiso-${permiso.id}`} className="text-sm">
                                {permiso.nombre}
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {permiso.nivel}
                                </Badge>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => {setShowNuevoRol(false); resetFormularioRol();}}>
                  Cancelar
                </Button>
                <Button onClick={crearRol} disabled={!nuevoRol.nombre}>
                  Crear Rol
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNuevoUsuario} onOpenChange={setShowNuevoUsuario}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Datos Personales</TabsTrigger>
                  <TabsTrigger value="profesional">Datos Profesionales</TabsTrigger>
                  <TabsTrigger value="permisos">Permisos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={nuevoUsuario.nombre}
                        onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                        placeholder="Nombre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={nuevoUsuario.apellido}
                        onChange={(e) => setNuevoUsuario({...nuevoUsuario, apellido: e.target.value})}
                        placeholder="Apellido"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={nuevoUsuario.email}
                      onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                      placeholder="email@clinica.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={nuevoUsuario.telefono}
                      onChange={(e) => setNuevoUsuario({...nuevoUsuario, telefono: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="profesional" className="space-y-4">
                  <div>
                    <Label htmlFor="rol">Rol *</Label>
                    <Select 
                      value={nuevoUsuario.rol} 
                      onValueChange={(value: Usuario['rol']) => {
                        setNuevoUsuario({
                          ...nuevoUsuario, 
                          rol: value,
                          permisos: obtenerPermisosRol(value)
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.filter(r => r.activo).map(rol => (
                          <SelectItem key={rol.id} value={rol.nombre}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: rol.color }}
                              />
                              {rol.nombre}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(nuevoUsuario.rol === 'Médico') && (
                    <>
                      <div>
                        <Label htmlFor="especialidad">Especialidad</Label>
                        <Input
                          id="especialidad"
                          value={nuevoUsuario.especialidad || ''}
                          onChange={(e) => setNuevoUsuario({...nuevoUsuario, especialidad: e.target.value})}
                          placeholder="ej: Cardiología"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licencia">Licencia Médica</Label>
                        <Input
                          id="licencia"
                          value={nuevoUsuario.licenciaMedica || ''}
                          onChange={(e) => setNuevoUsuario({...nuevoUsuario, licenciaMedica: e.target.value})}
                          placeholder="ej: LIC-12345"
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select 
                      value={nuevoUsuario.estado} 
                      onValueChange={(value: Usuario['estado']) => 
                        setNuevoUsuario({...nuevoUsuario, estado: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                        <SelectItem value="Suspendido">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="permisos" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Autenticación de Dos Factores (2FA)</Label>
                    <Switch
                      checked={nuevoUsuario.configuracion2FA}
                      onCheckedChange={(checked) => 
                        setNuevoUsuario({...nuevoUsuario, configuracion2FA: checked})
                      }
                    />
                  </div>
                  
                  <div>
                    <Label>Permisos Asignados</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                      {nuevoUsuario.permisos.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay permisos asignados</p>
                      ) : (
                        <div className="space-y-2">
                          {nuevoUsuario.permisos.map(permisoId => {
                            const permiso = permisos.find(p => p.id === permisoId);
                            return permiso ? (
                              <div key={permisoId} className="flex items-center justify-between text-sm">
                                <span>{permiso.nombre}</span>
                                <Badge variant="outline" className="text-xs">
                                  {permiso.modulo}
                                </Badge>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => {setShowNuevoUsuario(false); resetFormularioUsuario();}}>
                  Cancelar
                </Button>
                <Button 
                  onClick={crearUsuario} 
                  disabled={!nuevoUsuario.nombre || !nuevoUsuario.apellido || !nuevoUsuario.email}
                >
                  Crear Usuario
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
                <p className="text-blue-100">Total Usuarios</p>
                <p className="text-2xl font-bold">{usuarios.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Usuarios Activos</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.estado === 'Activo').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Sesiones Activas</p>
                <p className="text-2xl font-bold">{sesionesActivas.length}</p>
              </div>
              <Shield className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Roles Definidos</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
              <Key className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permisos">Permisos</TabsTrigger>
          <TabsTrigger value="sesiones">Sesiones Activas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usuarios" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre, apellido o email..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={filtroRol} onValueChange={setFiltroRol}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {roles.map(rol => (
                        <SelectItem key={rol.id} value={rol.nombre}>
                          {rol.nombre}
                        </SelectItem>
                      ))}
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
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de usuarios */}
          <div className="space-y-4">
            {usuariosFiltrados.map(usuario => (
              <Card key={usuario.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {usuario.nombre} {usuario.apellido}
                        </h3>
                        <Badge 
                          variant="outline" 
                          style={{ 
                            borderColor: obtenerColorRol(usuario.rol),
                            color: obtenerColorRol(usuario.rol)
                          }}
                        >
                          {usuario.rol}
                        </Badge>
                        <Badge variant={
                          usuario.estado === 'Activo' ? 'default' :
                          usuario.estado === 'Inactivo' ? 'secondary' : 'destructive'
                        }>
                          {usuario.estado}
                        </Badge>
                        {usuario.configuracion2FA && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <Shield className="w-3 h-3 mr-1" />
                            2FA
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <strong>Email:</strong> {usuario.email}
                        </div>
                        <div>
                          <strong>Teléfono:</strong> {usuario.telefono}
                        </div>
                        <div>
                          <strong>Último acceso:</strong> {
                            usuario.ultimoAcceso === 'Nunca' ? 
                              'Nunca' : 
                              new Date(usuario.ultimoAcceso).toLocaleString('es-ES')
                          }
                        </div>
                      </div>
                      
                      {usuario.especialidad && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Especialidad:</strong> {usuario.especialidad}
                          {usuario.licenciaMedica && ` | Licencia: ${usuario.licenciaMedica}`}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600">
                        <strong>Permisos:</strong> {usuario.permisos.length} asignados
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUsuarioSeleccionado(usuario)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetearPassword(usuario.id)}
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cambiarEstadoUsuario(
                          usuario.id, 
                          usuario.estado === 'Activo' ? 'Suspendido' : 'Activo'
                        )}
                      >
                        {usuario.estado === 'Activo' ? 
                          <Lock className="w-4 h-4" /> : 
                          <Unlock className="w-4 h-4" />
                        }
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => eliminarUsuario(usuario.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(rol => (
              <Card key={rol.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: rol.color }}
                      />
                      <h3 className="font-semibold text-lg">{rol.nombre}</h3>
                    </div>
                    <Badge variant={rol.activo ? 'default' : 'secondary'}>
                      {rol.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{rol.descripcion}</p>
                  
                  <div className="text-sm">
                    <strong>Permisos:</strong> {rol.permisos.length}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {modulos.map(modulo => {
                        const permisosModulo = permisos.filter(p => 
                          p.modulo === modulo && rol.permisos.includes(p.id)
                        ).length;
                        
                        return permisosModulo > 0 ? (
                          <Badge key={modulo} variant="outline" className="text-xs">
                            {modulo} ({permisosModulo})
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRolSeleccionado(rol)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="permisos" className="space-y-4">
          {modulos.map(modulo => (
            <Card key={modulo}>
              <CardHeader>
                <CardTitle className="text-lg">{modulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permisos.filter(p => p.modulo === modulo).map(permiso => (
                    <div key={permiso.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{permiso.nombre}</h4>
                        <Badge variant={
                          permiso.nivel === 'Lectura' ? 'secondary' :
                          permiso.nivel === 'Escritura' ? 'default' : 'destructive'
                        }>
                          {permiso.nivel}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{permiso.descripcion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="sesiones" className="space-y-4">
          <div className="space-y-4">
            {sesionesActivas.map(sesion => (
              <Card key={sesion.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{sesion.usuarioNombre}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Dispositivo:</strong> {sesion.dispositivo}
                        </div>
                        <div>
                          <strong>Navegador:</strong> {sesion.navegador}
                        </div>
                        <div>
                          <strong>IP:</strong> {sesion.ip}
                        </div>
                        <div>
                          <strong>Ubicación:</strong> {sesion.ubicacion}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                        <div>
                          <strong>Inicio:</strong> {new Date(sesion.fechaInicio).toLocaleString('es-ES')}
                        </div>
                        <div>
                          <strong>Última actividad:</strong> {new Date(sesion.ultimaActividad).toLocaleString('es-ES')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cerrarSesion(sesion.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Lock className="w-4 h-4" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Vista Detallada de Usuario */}
      <Dialog open={!!usuarioSeleccionado} onOpenChange={() => setUsuarioSeleccionado(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {usuarioSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Información Personal</h4>
                    <div><strong>Nombre:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</div>
                    <div><strong>Email:</strong> {usuarioSeleccionado.email}</div>
                    <div><strong>Teléfono:</strong> {usuarioSeleccionado.telefono}</div>
                    <div><strong>Estado:</strong> 
                      <Badge className="ml-2" variant={
                        usuarioSeleccionado.estado === 'Activo' ? 'default' :
                        usuarioSeleccionado.estado === 'Inactivo' ? 'secondary' : 'destructive'
                      }>
                        {usuarioSeleccionado.estado}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Información Profesional</h4>
                    <div><strong>Rol:</strong> 
                      <Badge 
                        className="ml-2" 
                        variant="outline"
                        style={{ 
                          borderColor: obtenerColorRol(usuarioSeleccionado.rol),
                          color: obtenerColorRol(usuarioSeleccionado.rol)
                        }}
                      >
                        {usuarioSeleccionado.rol}
                      </Badge>
                    </div>
                    {usuarioSeleccionado.especialidad && (
                      <div><strong>Especialidad:</strong> {usuarioSeleccionado.especialidad}</div>
                    )}
                    {usuarioSeleccionado.licenciaMedica && (
                      <div><strong>Licencia:</strong> {usuarioSeleccionado.licenciaMedica}</div>
                    )}
                    <div><strong>2FA:</strong> {usuarioSeleccionado.configuracion2FA ? 'Activado' : 'Desactivado'}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Permisos Asignados</h4>
                  <div className="space-y-3">
                    {modulos.map(modulo => {
                      const permisosModulo = permisos.filter(p => 
                        p.modulo === modulo && usuarioSeleccionado.permisos.includes(p.id)
                      );
                      
                      return permisosModulo.length > 0 ? (
                        <div key={modulo} className="border rounded-lg p-3">
                          <h5 className="font-medium mb-2">{modulo}</h5>
                          <div className="flex flex-wrap gap-2">
                            {permisosModulo.map(permiso => (
                              <Badge key={permiso.id} variant="outline" className="text-xs">
                                {permiso.nombre}
                                <span className="ml-1 text-gray-500">({permiso.nivel})</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Fechas</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Creado:</strong> {new Date(usuarioSeleccionado.fechaCreacion).toLocaleDateString('es-ES')}</div>
                      <div><strong>Último acceso:</strong> {
                        usuarioSeleccionado.ultimoAcceso === 'Nunca' ? 
                          'Nunca' : 
                          new Date(usuarioSeleccionado.ultimoAcceso).toLocaleString('es-ES')
                      }</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Vista Detallada de Rol */}
      <Dialog open={!!rolSeleccionado} onOpenChange={() => setRolSeleccionado(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {rolSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Rol: {rolSeleccionado.nombre}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Información General</h4>
                  <div className="space-y-2">
                    <div><strong>Nombre:</strong> {rolSeleccionado.nombre}</div>
                    <div><strong>Descripción:</strong> {rolSeleccionado.descripcion}</div>
                    <div><strong>Estado:</strong> 
                      <Badge className="ml-2" variant={rolSeleccionado.activo ? 'default' : 'secondary'}>
                        {rolSeleccionado.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Color:</strong>
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: rolSeleccionado.color }}
                      />
                      <span className="text-sm text-gray-600">{rolSeleccionado.color}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Permisos Asignados ({rolSeleccionado.permisos.length})</h4>
                  <div className="space-y-3">
                    {modulos.map(modulo => {
                      const permisosModulo = permisos.filter(p => 
                        p.modulo === modulo && rolSeleccionado.permisos.includes(p.id)
                      );
                      
                      return permisosModulo.length > 0 ? (
                        <div key={modulo} className="border rounded-lg p-3">
                          <h5 className="font-medium mb-2">{modulo}</h5>
                          <div className="space-y-1">
                            {permisosModulo.map(permiso => (
                              <div key={permiso.id} className="flex items-center justify-between text-sm">
                                <span>{permiso.nombre}</span>
                                <Badge variant={
                                  permiso.nivel === 'Lectura' ? 'secondary' :
                                  permiso.nivel === 'Escritura' ? 'default' : 'destructive'
                                } className="text-xs">
                                  {permiso.nivel}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Usuarios con este Rol</h4>
                  <div className="space-y-2">
                    {usuarios.filter(u => u.rol === rolSeleccionado.nombre).map(usuario => (
                      <div key={usuario.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{usuario.nombre} {usuario.apellido}</span>
                        <Badge variant={
                          usuario.estado === 'Activo' ? 'default' :
                          usuario.estado === 'Inactivo' ? 'secondary' : 'destructive'
                        } className="text-xs">
                          {usuario.estado}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SistemaUsuariosComponent;