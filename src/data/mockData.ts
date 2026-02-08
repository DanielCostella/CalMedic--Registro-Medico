import { Patient, Doctor, Appointment, MedicalHistory, Prescription, Notification, DashboardStatistics } from '@/types/medical';

export const mockPacientes: Patient[] = [
  {
    id: '1',
    nationalId: '12345678',
    firstName: 'María',
    lastName: 'González',
    birthDate: '1985-03-15',
    gender: 'Female',
    phone: '+58 414-1234567',
    email: 'maria.gonzalez@email.com',
    address: 'Av. Principal, Caracas',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Mariscos'],
    emergencyContact: {
      name: 'Carlos González',
      phone: '+58 412-7654321',
      relationship: 'Esposo'
    },
    medicalInsurance: 'Seguros Caracas',
    registrationDate: '2023-01-15',
    status: 'Active'
  },
  {
    id: '2',
    nationalId: '87654321',
    firstName: 'José',
    lastName: 'Rodríguez',
    birthDate: '1978-07-22',
    gender: 'Male',
    phone: '+58 426-9876543',
    email: 'jose.rodriguez@email.com',
    address: 'Calle 5, Valencia',
    bloodType: 'A-',
    allergies: ['Aspirina'],
    emergencyContact: {
      name: 'Ana Rodríguez',
      phone: '+58 414-5432109',
      relationship: 'Esposa'
    },
    registrationDate: '2023-02-10',
    status: 'Active'
  },
  {
    id: '3',
    nationalId: '11223344',
    firstName: 'Carmen',
    lastName: 'Martínez',
    birthDate: '1992-11-08',
    gender: 'Female',
    phone: '+58 412-3456789',
    email: 'carmen.martinez@email.com',
    address: 'Urbanización Los Palos Grandes, Caracas',
    bloodType: 'B+',
    allergies: [],
    emergencyContact: {
      name: 'Luis Martínez',
      phone: '+58 416-8765432',
      relationship: 'Padre'
    },
    medicalInsurance: 'Seguros Universales',
    registrationDate: '2023-03-05',
    status: 'Active'
  }
];

export const mockMedicos: Doctor[] = [
  {
    id: '1',
    nationalId: 'V-9876543',
    firstName: 'Carlos',
    lastName: 'Pérez',
    specialty: 'Cardiología',
    phone: '+58 414-5555555',
    email: 'carlos.perez@clinica.com',
    licenseNumber: 'MED-12345',
    registrationDate: '2020-01-15',
    status: 'Active',
    officeHours: {
      'Lunes': { start: '08:00', end: '17:00', available: true },
      'Martes': { start: '08:00', end: '17:00', available: true },
      'Miércoles': { start: '08:00', end: '17:00', available: true },
      'Jueves': { start: '08:00', end: '17:00', available: true },
      'Viernes': { start: '08:00', end: '15:00', available: true },
      'Sábado': { start: '09:00', end: '12:00', available: false },
      'Domingo': { start: '00:00', end: '00:00', available: false }
    }
  },
  {
    id: '2',
    nationalId: 'V-5432109',
    firstName: 'Ana',
    lastName: 'López',
    specialty: 'Pediatría',
    phone: '+58 426-7777777',
    email: 'ana.lopez@clinica.com',
    licenseNumber: 'MED-67890',
    registrationDate: '2019-06-20',
    status: 'Active',
    officeHours: {
      'Lunes': { start: '09:00', end: '18:00', available: true },
      'Martes': { start: '09:00', end: '18:00', available: true },
      'Miércoles': { start: '09:00', end: '18:00', available: true },
      'Jueves': { start: '09:00', end: '18:00', available: true },
      'Viernes': { start: '09:00', end: '16:00', available: true },
      'Sábado': { start: '10:00', end: '14:00', available: true },
      'Domingo': { start: '00:00', end: '00:00', available: false }
    }
  }
];

export const mockCitas: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    patientName: 'María González',
    date: '2024-01-15',
    time: '10:00',
    duration: 30,
    reason: 'Control rutinario',
    status: 'Scheduled',
    type: 'Control',
    reminder: true,
    priority: 'Medium'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    patientName: 'José Rodríguez',
    date: '2024-01-16',
    time: '14:30',
    duration: 45,
    reason: 'Consulta por fiebre',
    status: 'Completed',
    type: 'Consultation',
    reminder: true,
    notes: 'Paciente presenta mejoría',
    priority: 'Medium'
  }
];

export const mockHistorialMedico: MedicalHistory[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-10',
    reason: 'Control cardiológico',
    symptoms: 'Palpitaciones ocasionales',
    diagnosis: 'Arritmia leve',
    treatment: 'Medicación antiarrítmica',
    medications: [],
    exams: [],
    notes: 'Paciente estable, continuar tratamiento',
    attachments: []
  }
];

export const mockRecetas: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-10',
    prescriptionNumber: 'REC-001-2024',
    medications: [
      {
        name: 'Atenolol',
        dosage: '50mg',
        frequency: '1 vez al día',
        duration: '30 días',
        indications: 'Tomar en ayunas',
        quantity: 30
      }
    ],
    indications: 'Tomar medicamento según indicaciones médicas',
    validity: '2024-02-10',
    status: 'Active'
  }
];

export const mockNotificaciones: Notification[] = [
  {
    id: '1',
    type: 'Appointment',
    title: 'Appointment Reminder',
    message: 'You have a scheduled appointment tomorrow at 10:00 AM',
    date: '2024-01-14T09:00:00Z',
    read: false,
    priority: 'Medium',
    recipient: 'user1',
    action: {
      type: 'view_appointment',
      url: '/citas/1',
      text: 'View Appointment'
    }
  },
  {
    id: '2',
    type: 'System',
    title: 'System Update',
    message: 'New version available with security improvements',
    date: '2024-01-13T15:30:00Z',
    read: true,
    priority: 'Low',
    recipient: 'all'
  }
];

export const mockEstadisticas: DashboardStatistics = {
  totalPatients: 1247,
  appointmentsToday: 23,
  appointmentsWeek: 156,
  newPatients: 18,
  monthlyIncome: 125000,
  medicationsStock: 89,
  criticalAlerts: 3,
  averageSatisfaction: 4.7
};

// Data for charts
export const mockDatosCitas = [
  { month: 'Jan', appointments: 120, completed: 110 },
  { month: 'Feb', appointments: 135, completed: 125 },
  { month: 'Mar', appointments: 148, completed: 140 },
  { month: 'Apr', appointments: 162, completed: 155 },
  { month: 'May', appointments: 178, completed: 170 },
  { month: 'Jun', appointments: 185, completed: 175 }
];

export const mockDatosIngresos = [
  { month: 'Jan', income: 95000 },
  { month: 'Feb', income: 108000 },
  { month: 'Mar', income: 115000 },
  { month: 'Apr', income: 122000 },
  { month: 'May', income: 118000 },
  { month: 'Jun', income: 125000 }
];

export const mockDatosEspecialidades = [
  { specialty: 'Cardiology', patients: 245 },
  { specialty: 'Pediatrics', patients: 189 },
  { specialty: 'Gynecology', patients: 167 },
  { specialty: 'General Medicine', patients: 312 },
  { specialty: 'Dermatology', patients: 134 }
];
