// Tipos TypeScript para el Sistema Médico EstiloLibre

export interface Paciente {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: 'M' | 'F' | 'Otro';
  telefono: string;
  email: string;
  direccion: string;
  tipoSangre: string;
  alergias: string[];
  contactoEmergencia: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
  seguroMedico?: string;
  fechaRegistro: string;
  estado: 'Activo' | 'Inactivo';
}

export interface Medico {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  email: string;
  numeroLicencia: string;
  fechaRegistro: string;
  estado: 'Activo' | 'Inactivo';
  horarioAtencion: {
    [key: string]: { inicio: string; fin: string; disponible: boolean };
  };
}

export interface Cita {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string;
  hora: string;
  duracion: number; // en minutos
  motivo: string;
  estado: 'Programada' | 'En Curso' | 'Completada' | 'Cancelada' | 'No Asistió';
  notas?: string;
  tipo: 'Consulta' | 'Control' | 'Emergencia' | 'Procedimiento';
  recordatorio: boolean;
}

export interface HistorialMedico {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string;
  motivo: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  medicamentos: Medicamento[];
  examenes: Examen[];
  proximaConsulta?: string;
  notas: string;
  archivosAdjuntos: ArchivoMedico[];
}

export interface Receta {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string;
  medicamentos: MedicamentoReceta[];
  indicaciones: string;
  vigencia: string;
  estado: 'Activa' | 'Vencida' | 'Utilizada';
  numeroReceta: string;
}

export interface MedicamentoReceta {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  indicaciones: string;
  cantidad: number;
}

export interface Medicamento {
  id: string;
  nombre: string;
  principioActivo: string;
  presentacion: string;
  concentracion: string;
  laboratorio: string;
  precio: number;
  stock: number;
  fechaVencimiento: string;
}

export interface Examen {
  id: string;
  nombre: string;
  tipo: 'Laboratorio' | 'Imagen' | 'Funcional';
  fecha: string;
  resultado: string;
  valorReferencia: string;
  estado: 'Pendiente' | 'Completado';
  archivo?: string;
}

export interface ArchivoMedico {
  id: string;
  nombre: string;
  tipo: string;
  tamaño: number;
  fecha: string;
  url: string;
}

export interface Notificacion {
  id: string;
  tipo: 'Cita' | 'Medicamento' | 'Examen' | 'Sistema' | 'Emergencia';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  destinatario: string; // ID del usuario
  accion?: {
    tipo: string;
    url: string;
    texto: string;
  };
}

export interface Reporte {
  id: string;
  tipo: 'Pacientes' | 'Citas' | 'Ingresos' | 'Medicamentos' | 'Estadísticas';
  titulo: string;
  descripcion: string;
  fechaGeneracion: string;
  parametros: Record<string, string | number | boolean>;
  datos: Record<string, string | number | boolean>[];
  formato: 'PDF' | 'Excel' | 'CSV';
}

export interface EstadisticasDashboard {
  totalPacientes: number;
  citasHoy: number;
  citasSemana: number;
  pacientesNuevos: number;
  ingresosMes: number;
  medicamentosStock: number;
  alertasCriticas: number;
  satisfaccionPromedio: number;
}

export interface FiltrosBusqueda {
  texto?: string;
  fechaInicio?: string;
  fechaFin?: string;
  especialidad?: string;
  estado?: string;
  tipo?: string;
  prioridad?: string;
  medico?: string;
  paciente?: string;
  diagnostico?: string;
  medicamento?: string;
}

export interface ResultadoBusqueda {
  tipo: 'Paciente' | 'Medico' | 'Cita' | 'Historial' | 'Receta';
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  fecha: string;
  relevancia: number;
  datos: Paciente | Medico | Cita | HistorialMedico | Receta;
  coincidencias: string[];
}

// Tipos para gráficos
export interface DatoGrafico {
  [key: string]: string | number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    value: string | number;
  }>;
  label?: string;
}

// Tipos específicos para formularios
export interface FormularioHistorial {
  pacienteId: string;
  medicoId: string;
  motivo: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  medicamentos: MedicamentoReceta[];
  examenes: Examen[];
  proximaConsulta: string;
  notas: string;
  archivosAdjuntos: ArchivoMedico[];
}

export interface FormularioReceta {
  pacienteId: string;
  medicoId: string;
  medicamentos: MedicamentoReceta[];
  indicaciones: string;
  vigencia: string;
}