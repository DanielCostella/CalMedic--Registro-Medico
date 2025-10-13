import { MedicoData } from '../types/medico';
import { User, UserRole } from '../types/user';
import { calculateAge } from '../utils/validation';

class MedicoService {
  private medicos: MedicoData[] = [];

  async crearMedico(medicoData: MedicoData): Promise<{ success: boolean; medico?: User; message?: string }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar si ya existe un médico con la misma cédula o correo
    const exists = this.medicos.find(m => 
      `${m.rifInitial}${m.cedula}` === `${medicoData.rifInitial}${medicoData.cedula}` ||
      m.correoElectronico === medicoData.correoElectronico ||
      m.numeroColMedico === medicoData.numeroColMedico
    );

    if (exists) {
      return { 
        success: false, 
        message: 'Ya existe un médico con esta cédula, correo electrónico o número de colegio médico' 
      };
    }

    // Validar que la fecha de vencimiento de licencia sea futura
    const fechaVencimiento = new Date(medicoData.fechaVencimientoLicencia);
    const hoy = new Date();
    
    if (fechaVencimiento <= hoy) {
      return { 
        success: false, 
        message: 'La fecha de vencimiento de la licencia médica debe ser futura' 
      };
    }

    // Crear el médico
    const nuevoMedico: MedicoData = {
      ...medicoData,
      experienciaAños: new Date().getFullYear() - medicoData.añoGraduacion
    };

    this.medicos.push(nuevoMedico);

    // Convertir a formato User para compatibilidad con el sistema existente
    const medicoUser: User = {
      id: Date.now().toString(),
      rifInitial: nuevoMedico.rifInitial,
      cedula: nuevoMedico.cedula,
      nombres: nuevoMedico.nombres,
      apellidos: nuevoMedico.apellidos,
      fechaNacimiento: nuevoMedico.fechaNacimiento,
      edad: calculateAge(nuevoMedico.fechaNacimiento),
      sexo: nuevoMedico.sexo,
      telefonoMovil: nuevoMedico.telefonoMovil,
      correoElectronico: nuevoMedico.correoElectronico,
      direccion: nuevoMedico.direccion,
      lugarNacimiento: nuevoMedico.lugarNacimiento,
      password: nuevoMedico.password,
      role: 'Médico' as UserRole,
      createdAt: new Date().toISOString()
    };

    return { success: true, medico: medicoUser };
  }

  obtenerMedicos(): MedicoData[] {
    return this.medicos;
  }

  obtenerMedicoPorId(id: string): MedicoData | undefined {
    return this.medicos.find(m => `${m.rifInitial}${m.cedula}` === id);
  }

  obtenerMedicosPorEspecialidad(especialidad: string): MedicoData[] {
    return this.medicos.filter(m => m.especialidad === especialidad);
  }

  actualizarMedico(id: string, datosActualizados: Partial<MedicoData>): boolean {
    const index = this.medicos.findIndex(m => `${m.rifInitial}${m.cedula}` === id);
    if (index !== -1) {
      this.medicos[index] = { ...this.medicos[index], ...datosActualizados };
      return true;
    }
    return false;
  }

  eliminarMedico(id: string): boolean {
    const index = this.medicos.findIndex(m => `${m.rifInitial}${m.cedula}` === id);
    if (index !== -1) {
      this.medicos.splice(index, 1);
      return true;
    }
    return false;
  }

  // Estadísticas útiles
  obtenerEstadisticas() {
    const totalMedicos = this.medicos.length;
    const especialidades = [...new Set(this.medicos.map(m => m.especialidad))];
    const medicosActivos = this.medicos.filter(m => m.estadoLicencia === 'Activa').length;
    const experienciaPromedio = this.medicos.length > 0 
      ? Math.round(this.medicos.reduce((sum, m) => sum + m.experienciaAños, 0) / this.medicos.length)
      : 0;

    return {
      totalMedicos,
      especialidades: especialidades.length,
      medicosActivos,
      experienciaPromedio,
      distribuccionEspecialidades: especialidades.map(esp => ({
        especialidad: esp,
        cantidad: this.medicos.filter(m => m.especialidad === esp).length
      }))
    };
  }
}

export const medicoService = new MedicoService();