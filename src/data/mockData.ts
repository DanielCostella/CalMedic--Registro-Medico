import { Paciente, Medico, Cita, HistorialMedico, Receta, Notificacion, EstadisticasDashboard } from '@/types/medical';

export const mockPacientes: Paciente[] = [
  {
    id: '1',
    cedula: '12345678',
    nombre: 'María',
    apellido: 'González',
    fechaNacimiento: '1985-03-15',
    genero: 'F',
    telefono: '+58 414-1234567',
    email: 'maria.gonzalez@email.com',
    direccion: 'Av. Principal, Caracas',
    tipoSangre: 'O+',
    alergias: ['Penicilina', 'Mariscos'],
    contactoEmergencia: {
      nombre: 'Carlos González',
      telefono: '+58 412-7654321',
      relacion: 'Esposo'
    },
    seguroMedico: 'Seguros Caracas',
    fechaRegistro: '2023-01-15',
    estado: 'Activo'
  },
  {
    id: '2',
    cedula: '87654321',
    nombre: 'José',
    apellido: 'Rodríguez',
    fechaNacimiento: '1978-07-22',
    genero: 'M',
    telefono: '+58 426-9876543',
    email: 'jose.rodriguez@email.com',
    direccion: 'Calle 5, Valencia',
    tipoSangre: 'A-',
    alergias: ['Aspirina'],
    contactoEmergencia: {
      nombre: 'Ana Rodríguez',
      telefono: '+58 414-5432109',
      relacion: 'Esposa'
    },
    fechaRegistro: '2023-02-10',
    estado: 'Activo'
  },
  {
    id: '3',
    cedula: '11223344',
    nombre: 'Carmen',
    apellido: 'Martínez',
    fechaNacimiento: '1992-11-08',
    genero: 'F',
    telefono: '+58 412-3456789',
    email: 'carmen.martinez@email.com',
    direccion: 'Urbanización Los Palos Grandes, Caracas',
    tipoSangre: 'B+',
    alergias: [],
    contactoEmergencia: {
      nombre: 'Luis Martínez',
      telefono: '+58 416-8765432',
      relacion: 'Padre'
    },
    seguroMedico: 'Seguros Universales',
    fechaRegistro: '2023-03-05',
    estado: 'Activo'
  }
];

export const mockMedicos: Medico[] = [
  {
    id: '1',
    cedula: 'V-9876543',
    nombre: 'Dr. Carlos',
    apellido: 'Pérez',
    especialidad: 'Cardiología',
    telefono: '+58 414-5555555',
    email: 'carlos.perez@clinica.com',
    numeroLicencia: 'MED-12345',
    fechaRegistro: '2020-01-15',
    estado: 'Activo',
    horarioAtencion: {
      'Lunes': { inicio: '08:00', fin: '17:00', disponible: true },
      'Martes': { inicio: '08:00', fin: '17:00', disponible: true },
      'Miércoles': { inicio: '08:00', fin: '17:00', disponible: true },
      'Jueves': { inicio: '08:00', fin: '17:00', disponible: true },
      'Viernes': { inicio: '08:00', fin: '15:00', disponible: true },
      'Sábado': { inicio: '09:00', fin: '12:00', disponible: false },
      'Domingo': { inicio: '00:00', fin: '00:00', disponible: false }
    }
  },
  {
    id: '2',
    cedula: 'V-5432109',
    nombre: 'Dra. Ana',
    apellido: 'López',
    especialidad: 'Pediatría',
    telefono: '+58 426-7777777',
    email: 'ana.lopez@clinica.com',
    numeroLicencia: 'MED-67890',
    fechaRegistro: '2019-06-20',
    estado: 'Activo',
    horarioAtencion: {
      'Lunes': { inicio: '09:00', fin: '18:00', disponible: true },
      'Martes': { inicio: '09:00', fin: '18:00', disponible: true },
      'Miércoles': { inicio: '09:00', fin: '18:00', disponible: true },
      'Jueves': { inicio: '09:00', fin: '18:00', disponible: true },
      'Viernes': { inicio: '09:00', fin: '16:00', disponible: true },
      'Sábado': { inicio: '10:00', fin: '14:00', disponible: true },
      'Domingo': { inicio: '00:00', fin: '00:00', disponible: false }
    }
  }
];

export const mockCitas: Cita[] = [
  {
    id: '1',
    pacienteId: '1',
    medicoId: '1',
    fecha: '2024-01-15',
    hora: '10:00',
    duracion: 30,
    motivo: 'Control rutinario',
    estado: 'Programada',
    tipo: 'Control',
    recordatorio: true
  },
  {
    id: '2',
    pacienteId: '2',
    medicoId: '2',
    fecha: '2024-01-16',
    hora: '14:30',
    duracion: 45,
    motivo: 'Consulta por fiebre',
    estado: 'Completada',
    tipo: 'Consulta',
    recordatorio: true,
    notas: 'Paciente presenta mejoría'
  }
];

export const mockHistorialMedico: HistorialMedico[] = [
  {
    id: '1',
    pacienteId: '1',
    medicoId: '1',
    fecha: '2024-01-10',
    motivo: 'Control cardiológico',
    sintomas: 'Palpitaciones ocasionales',
    diagnostico: 'Arritmia leve',
    tratamiento: 'Medicación antiarrítmica',
    medicamentos: [],
    examenes: [],
    notas: 'Paciente estable, continuar tratamiento',
    archivosAdjuntos: []
  }
];

export const mockRecetas: Receta[] = [
  {
    id: '1',
    pacienteId: '1',
    medicoId: '1',
    fecha: '2024-01-10',
    numeroReceta: 'REC-001-2024',
    medicamentos: [
      {
        nombre: 'Atenolol',
        dosis: '50mg',
        frecuencia: '1 vez al día',
        duracion: '30 días',
        indicaciones: 'Tomar en ayunas',
        cantidad: 30
      }
    ],
    indicaciones: 'Tomar medicamento según indicaciones médicas',
    vigencia: '2024-02-10',
    estado: 'Activa'
  }
];

export const mockNotificaciones: Notificacion[] = [
  {
    id: '1',
    tipo: 'Cita',
    titulo: 'Recordatorio de Cita',
    mensaje: 'Tiene una cita programada mañana a las 10:00 AM',
    fecha: '2024-01-14T09:00:00Z',
    leida: false,
    prioridad: 'Media',
    destinatario: 'user1',
    accion: {
      tipo: 'ver_cita',
      url: '/citas/1',
      texto: 'Ver Cita'
    }
  },
  {
    id: '2',
    tipo: 'Sistema',
    titulo: 'Actualización del Sistema',
    mensaje: 'Nueva versión disponible con mejoras de seguridad',
    fecha: '2024-01-13T15:30:00Z',
    leida: true,
    prioridad: 'Baja',
    destinatario: 'all'
  }
];

export const mockEstadisticas: EstadisticasDashboard = {
  totalPacientes: 1247,
  citasHoy: 23,
  citasSemana: 156,
  pacientesNuevos: 18,
  ingresosMes: 125000,
  medicamentosStock: 89,
  alertasCriticas: 3,
  satisfaccionPromedio: 4.7
};

// Datos para gráficos
export const mockDatosCitas = [
  { mes: 'Ene', citas: 120, completadas: 110 },
  { mes: 'Feb', citas: 135, completadas: 125 },
  { mes: 'Mar', citas: 148, completadas: 140 },
  { mes: 'Abr', citas: 162, completadas: 155 },
  { mes: 'May', citas: 178, completadas: 170 },
  { mes: 'Jun', citas: 185, completadas: 175 }
];

export const mockDatosIngresos = [
  { mes: 'Ene', ingresos: 95000 },
  { mes: 'Feb', ingresos: 108000 },
  { mes: 'Mar', ingresos: 115000 },
  { mes: 'Abr', ingresos: 122000 },
  { mes: 'May', ingresos: 118000 },
  { mes: 'Jun', ingresos: 125000 }
];

export const mockDatosEspecialidades = [
  { especialidad: 'Cardiología', pacientes: 245 },
  { especialidad: 'Pediatría', pacientes: 189 },
  { especialidad: 'Ginecología', pacientes: 167 },
  { especialidad: 'Medicina General', pacientes: 312 },
  { especialidad: 'Dermatología', pacientes: 134 }
];