// Utilidades para exportación de datos médicos
import { Paciente, Medico, HistorialMedico, Receta } from '@/types/medical';

export interface ExportOptions {
  formato: 'PDF' | 'Excel' | 'CSV';
  incluirImagenes?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  filtros?: Record<string, string | number | boolean>;
}

export class ExportService {
  // Exportar historial médico a PDF
  static async exportarHistorialPDF(historial: HistorialMedico, paciente: Paciente, medico: Medico): Promise<void> {
    try {
      // Simular generación de PDF
      const contenidoPDF = {
        titulo: 'Historial Médico',
        paciente: {
          nombre: `${paciente.nombre} ${paciente.apellido}`,
          cedula: paciente.cedula,
          fechaNacimiento: paciente.fechaNacimiento,
          tipoSangre: paciente.tipoSangre,
          alergias: paciente.alergias
        },
        medico: {
          nombre: `Dr. ${medico.nombre} ${medico.apellido}`,
          especialidad: medico.especialidad,
          licencia: medico.numeroLicencia
        },
        consulta: {
          fecha: historial.fecha,
          motivo: historial.motivo,
          sintomas: historial.sintomas,
          diagnostico: historial.diagnostico,
          tratamiento: historial.tratamiento,
          medicamentos: historial.medicamentos,
          examenes: historial.examenes,
          notas: historial.notas
        }
      };

      console.log('Generando PDF:', contenidoPDF);
      
      // En una implementación real, aquí usarías una librería como jsPDF o PDFKit
      const blob = new Blob([JSON.stringify(contenidoPDF, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historial_${paciente.cedula}_${historial.fecha}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Historial médico exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar historial:', error);
      throw new Error('Error al generar el archivo PDF');
    }
  }

  // Exportar receta a PDF
  static async exportarRecetaPDF(receta: Receta, paciente: Paciente, medico: Medico): Promise<void> {
    try {
      const contenidoPDF = {
        titulo: 'Receta Médica',
        numeroReceta: receta.numeroReceta,
        fecha: receta.fecha,
        vigencia: receta.vigencia,
        paciente: {
          nombre: `${paciente.nombre} ${paciente.apellido}`,
          cedula: paciente.cedula
        },
        medico: {
          nombre: `Dr. ${medico.nombre} ${medico.apellido}`,
          especialidad: medico.especialidad,
          licencia: medico.numeroLicencia
        },
        medicamentos: receta.medicamentos,
        indicaciones: receta.indicaciones
      };

      console.log('Generando receta PDF:', contenidoPDF);
      
      const blob = new Blob([JSON.stringify(contenidoPDF, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receta_${receta.numeroReceta}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Receta exportada exitosamente');
    } catch (error) {
      console.error('Error al exportar receta:', error);
      throw new Error('Error al generar la receta PDF');
    }
  }

  // Exportar datos a Excel
  static async exportarExcel(datos: Record<string, string | number | boolean>[], nombreArchivo: string, opciones?: ExportOptions): Promise<void> {
    try {
      // Simular exportación a Excel
      const datosCSV = this.convertirACSV(datos);
      const blob = new Blob([datosCSV], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nombreArchivo}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Datos exportados a Excel (CSV) exitosamente');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      throw new Error('Error al generar el archivo Excel');
    }
  }

  // Exportar reportes médicos
  static async exportarReporte(tipo: string, datos: Record<string, string | number | boolean>[], filtros?: Record<string, string | number | boolean>): Promise<void> {
    try {
      const reporte = {
        tipo,
        fechaGeneracion: new Date().toISOString(),
        filtros,
        datos,
        resumen: {
          totalRegistros: datos.length,
          fechaInicio: filtros?.fechaInicio,
          fechaFin: filtros?.fechaFin
        }
      };

      const blob = new Blob([JSON.stringify(reporte, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${tipo}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Reporte exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      throw new Error('Error al generar el reporte');
    }
  }

  // Convertir datos a CSV
  private static convertirACSV(datos: Record<string, string | number | boolean>[]): string {
    if (!datos || datos.length === 0) return '';

    const headers = Object.keys(datos[0]);
    const csvContent = [
      headers.join(','),
      ...datos.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar comillas y envolver en comillas si contiene comas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  // Generar reporte de estadísticas
  static async generarReporteEstadisticas(periodo: string): Promise<Record<string, string | number | Record<string, string | number>[]>> {
    try {
      // Simular generación de estadísticas
      const estadisticas = {
        periodo,
        fechaGeneracion: new Date().toISOString(),
        metricas: {
          totalPacientes: Math.floor(Math.random() * 1000) + 500,
          citasRealizadas: Math.floor(Math.random() * 500) + 200,
          ingresosTotales: Math.floor(Math.random() * 100000) + 50000,
          satisfaccionPromedio: (Math.random() * 2 + 3).toFixed(1),
          especialidadesMasDemandadas: [
            'Medicina General',
            'Cardiología', 
            'Pediatría'
          ]
        },
        graficos: {
          citasPorMes: [],
          ingresosPorMes: [],
          distribucionEspecialidades: []
        }
      };

      return estadisticas;
    } catch (error) {
      console.error('Error al generar estadísticas:', error);
      throw new Error('Error al generar el reporte de estadísticas');
    }
  }
}

// Utilidades para formateo de datos
export class FormatUtils {
  static formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatearHora(hora: string): string {
    return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static formatearMoneda(cantidad: number): string {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(cantidad);
  }

  static formatearTelefono(telefono: string): string {
    // Formatear teléfono venezolano
    const cleaned = telefono.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `+58 ${cleaned.slice(2, 5)}-${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    }
    return telefono;
  }

  static calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  static generarNumeroReceta(): string {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const numero = Math.floor(Math.random() * 9999) + 1;
    return `REC-${String(numero).padStart(4, '0')}-${año}`;
  }

  static validarCedula(cedula: string): boolean {
    // Validación básica de cédula venezolana
    const regex = /^[VE]-?\d{7,8}$/i;
    return regex.test(cedula);
  }

  static validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}