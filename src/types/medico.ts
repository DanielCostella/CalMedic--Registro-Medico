export interface MedicoData {
  // Datos personales básicos (heredados de RegisterData)
  rifInitial: 'V' | 'E' | 'J' | 'P' | 'G' | 'M';
  cedula: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: 'Femenino' | 'Masculino';
  telefonoMovil: string;
  correoElectronico: string;
  direccion: string;
  lugarNacimiento: string;
  password: string;
  
  // Datos específicos del médico
  numeroColMedico: string; // Número de colegio médico
  especialidad: string;
  subespecialidad?: string;
  universidadGrado: string;
  añoGraduacion: number;
  experienciaAños: number;
  consultorio?: string;
  horarioAtencion?: string;
  tarifaConsulta?: number;
  idiomas: string[];
  certificaciones: string[];
  
  // Datos profesionales adicionales
  hospitalAfiliacion?: string;
  segurosAceptados: string[];
  telefonoConsultorio?: string;
  direccionConsultorio?: string;
  
  // Estado profesional
  estadoLicencia: 'Activa' | 'Suspendida' | 'En Revisión';
  fechaVencimientoLicencia: string;
}

export interface Especialidad {
  id: string;
  nombre: string;
  subespecialidades?: string[];
}

export interface Seguro {
  id: string;
  nombre: string;
}

export const ESPECIALIDADES_MEDICAS: Especialidad[] = [
  {
    id: 'medicina-general',
    nombre: 'Medicina General',
    subespecialidades: ['Medicina Familiar', 'Medicina Preventiva']
  },
  {
    id: 'cardiologia',
    nombre: 'Cardiología',
    subespecialidades: ['Cardiología Intervencionista', 'Electrofisiología', 'Cardiología Pediátrica']
  },
  {
    id: 'neurologia',
    nombre: 'Neurología',
    subespecialidades: ['Neurología Pediátrica', 'Neurofisiología', 'Neurología Vascular']
  },
  {
    id: 'ginecologia',
    nombre: 'Ginecología y Obstetricia',
    subespecialidades: ['Medicina Materno-Fetal', 'Ginecología Oncológica', 'Reproducción Humana']
  },
  {
    id: 'pediatria',
    nombre: 'Pediatría',
    subespecialidades: ['Neonatología', 'Pediatría Intensiva', 'Endocrinología Pediátrica']
  },
  {
    id: 'traumatologia',
    nombre: 'Traumatología y Ortopedia',
    subespecialidades: ['Cirugía de Columna', 'Artroscopia', 'Traumatología Pediátrica']
  },
  {
    id: 'dermatologia',
    nombre: 'Dermatología',
    subespecialidades: ['Dermatología Cosmética', 'Dermatopatología', 'Dermatología Pediátrica']
  },
  {
    id: 'psiquiatria',
    nombre: 'Psiquiatría',
    subespecialidades: ['Psiquiatría Infantil', 'Psiquiatría Geriátrica', 'Psiquiatría de Adicciones']
  }
];

export const SEGUROS_MEDICOS: Seguro[] = [
  { id: 'seguro-social', nombre: 'Seguro Social Obligatorio' },
  { id: 'seguros-horizonte', nombre: 'Seguros Horizonte' },
  { id: 'seguros-mercantil', nombre: 'Seguros Mercantil' },
  { id: 'mapfre', nombre: 'MAPFRE' },
  { id: 'seguros-caracas', nombre: 'Seguros Caracas' },
  { id: 'occidental', nombre: 'Seguros Occidental' },
  { id: 'particular', nombre: 'Pacientes Particulares' }
];