// Servicio de búsqueda avanzada con IA
import React from 'react';
import { Paciente, Medico, Cita, HistorialMedico, Receta, ResultadoBusqueda, FiltrosBusqueda } from '@/types/medical';

export interface SugerenciaBusqueda {
  texto: string;
  tipo: string;
  frecuencia: number;
}

interface DatosBusqueda {
  pacientes?: Paciente[];
  medicos?: Medico[];
  citas?: Cita[];
  historiales?: HistorialMedico[];
  recetas?: Receta[];
}

export class SearchService {
  private static instance: SearchService;
  private historialBusquedas: string[] = [];
  private sugerencias: SugerenciaBusqueda[] = [];

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  // Búsqueda inteligente principal
  async buscarInteligente(
    query: string, 
    datos: DatosBusqueda, 
    tipo: string,
    filtros?: FiltrosBusqueda
  ): Promise<ResultadoBusqueda[]> {
    try {
      // Agregar al historial
      this.agregarAlHistorial(query);

      // Normalizar query
      const queryNormalizado = this.normalizarTexto(query);
      const palabrasClave = this.extraerPalabrasClave(queryNormalizado);

      let resultados: ResultadoBusqueda[] = [];

      // Buscar en diferentes tipos de datos
      switch (tipo) {
        case 'pacientes':
          resultados = this.buscarPacientes(datos.pacientes || [], palabrasClave, filtros);
          break;
        case 'medicos':
          resultados = this.buscarMedicos(datos.medicos || [], palabrasClave, filtros);
          break;
        case 'citas':
          resultados = this.buscarCitas(datos.citas || [], palabrasClave, filtros);
          break;
        case 'historiales':
          resultados = this.buscarHistoriales(datos.historiales || [], palabrasClave, filtros);
          break;
        case 'recetas':
          resultados = this.buscarRecetas(datos.recetas || [], palabrasClave, filtros);
          break;
        case 'general':
          resultados = this.busquedaGeneral(datos, palabrasClave, filtros);
          break;
        default:
          resultados = this.busquedaGeneral(datos, palabrasClave, filtros);
      }

      // Ordenar por relevancia
      resultados.sort((a, b) => b.relevancia - a.relevancia);

      // Aplicar filtros adicionales
      if (filtros) {
        resultados = this.aplicarFiltros(resultados, filtros);
      }

      return resultados.slice(0, 50); // Limitar a 50 resultados
    } catch (error) {
      console.error('Error en búsqueda inteligente:', error);
      return [];
    }
  }

  // Búsqueda de pacientes
  private buscarPacientes(pacientes: Paciente[], palabrasClave: string[], filtros?: FiltrosBusqueda): ResultadoBusqueda[] {
    return pacientes.map(paciente => {
      const textoCompleto = `
        ${paciente.nombre} ${paciente.apellido} ${paciente.cedula} 
        ${paciente.email} ${paciente.telefono} ${paciente.direccion}
        ${paciente.tipoSangre} ${paciente.alergias?.join(' ') || ''}
      `.toLowerCase();

      const coincidencias = this.encontrarCoincidencias(textoCompleto, palabrasClave);
      const relevancia = this.calcularRelevancia(coincidencias, palabrasClave);

      return {
        tipo: 'Paciente' as const,
        id: paciente.id,
        titulo: `${paciente.nombre} ${paciente.apellido}`,
        subtitulo: `${paciente.cedula} - ${paciente.tipoSangre}`,
        descripcion: `Tel: ${paciente.telefono} | Email: ${paciente.email}`,
        fecha: paciente.fechaRegistro,
        relevancia,
        datos: paciente,
        coincidencias
      };
    }).filter(resultado => resultado.relevancia > 0);
  }

  // Búsqueda de médicos
  private buscarMedicos(medicos: Medico[], palabrasClave: string[], filtros?: FiltrosBusqueda): ResultadoBusqueda[] {
    return medicos.map(medico => {
      const textoCompleto = `
        ${medico.nombre} ${medico.apellido} ${medico.especialidad}
        ${medico.cedula} ${medico.email} ${medico.numeroLicencia}
      `.toLowerCase();

      const coincidencias = this.encontrarCoincidencias(textoCompleto, palabrasClave);
      const relevancia = this.calcularRelevancia(coincidencias, palabrasClave);

      return {
        tipo: 'Medico' as const,
        id: medico.id,
        titulo: `Dr. ${medico.nombre} ${medico.apellido}`,
        subtitulo: medico.especialidad,
        descripcion: `Lic: ${medico.numeroLicencia} | Tel: ${medico.telefono}`,
        fecha: medico.fechaRegistro,
        relevancia,
        datos: medico,
        coincidencias
      };
    }).filter(resultado => resultado.relevancia > 0);
  }

  // Búsqueda de citas
  private buscarCitas(citas: Cita[], palabrasClave: string[], filtros?: FiltrosBusqueda): ResultadoBusqueda[] {
    return citas.map(cita => {
      const textoCompleto = `
        ${cita.motivo} ${cita.tipo} ${cita.estado}
        ${cita.notas || ''}
      `.toLowerCase();

      const coincidencias = this.encontrarCoincidencias(textoCompleto, palabrasClave);
      const relevancia = this.calcularRelevancia(coincidencias, palabrasClave);

      return {
        tipo: 'Cita' as const,
        id: cita.id,
        titulo: cita.motivo,
        subtitulo: `${cita.fecha} ${cita.hora} - ${cita.estado}`,
        descripcion: `Tipo: ${cita.tipo} | Duración: ${cita.duracion} min`,
        fecha: cita.fecha,
        relevancia,
        datos: cita,
        coincidencias
      };
    }).filter(resultado => resultado.relevancia > 0);
  }

  // Búsqueda de historiales médicos
  private buscarHistoriales(historiales: HistorialMedico[], palabrasClave: string[], filtros?: FiltrosBusqueda): ResultadoBusqueda[] {
    return historiales.map(historial => {
      const textoCompleto = `
        ${historial.motivo} ${historial.sintomas} ${historial.diagnostico}
        ${historial.tratamiento} ${historial.notas || ''}
        ${historial.medicamentos?.map((m) => m.nombre).join(' ') || ''}
      `.toLowerCase();

      const coincidencias = this.encontrarCoincidencias(textoCompleto, palabrasClave);
      const relevancia = this.calcularRelevancia(coincidencias, palabrasClave);

      return {
        tipo: 'Historial' as const,
        id: historial.id,
        titulo: historial.motivo,
        subtitulo: historial.diagnostico,
        descripcion: `Síntomas: ${historial.sintomas.substring(0, 100)}...`,
        fecha: historial.fecha,
        relevancia,
        datos: historial,
        coincidencias
      };
    }).filter(resultado => resultado.relevancia > 0);
  }

  // Búsqueda de recetas
  private buscarRecetas(recetas: Receta[], palabrasClave: string[], filtros?: FiltrosBusqueda): ResultadoBusqueda[] {
    return recetas.map(receta => {
      const textoCompleto = `
        ${receta.numeroReceta} ${receta.indicaciones || ''}
        ${receta.medicamentos?.map((m) => `${m.nombre} ${m.dosis}`).join(' ') || ''}
      `.toLowerCase();

      const coincidencias = this.encontrarCoincidencias(textoCompleto, palabrasClave);
      const relevancia = this.calcularRelevancia(coincidencias, palabrasClave);

      return {
        tipo: 'Receta' as const,
        id: receta.id,
        titulo: `Receta ${receta.numeroReceta}`,
        subtitulo: `${receta.medicamentos?.length || 0} medicamentos - ${receta.estado}`,
        descripcion: `Vigencia: ${receta.vigencia}`,
        fecha: receta.fecha,
        relevancia,
        datos: receta,
        coincidencias
      };
    }).filter(resultado => resultado.relevancia > 0);
  }

  // Búsqueda general (todos los tipos)
  private busquedaGeneral(todosDatos: DatosBusqueda, palabrasClave: string[], filtros?: FiltrosBusqueda): ResultadoBusqueda[] {
    let resultados: ResultadoBusqueda[] = [];

    // Buscar en cada tipo de dato si existe
    if (todosDatos.pacientes) {
      resultados = resultados.concat(this.buscarPacientes(todosDatos.pacientes, palabrasClave, filtros));
    }
    if (todosDatos.medicos) {
      resultados = resultados.concat(this.buscarMedicos(todosDatos.medicos, palabrasClave, filtros));
    }
    if (todosDatos.citas) {
      resultados = resultados.concat(this.buscarCitas(todosDatos.citas, palabrasClave, filtros));
    }
    if (todosDatos.historiales) {
      resultados = resultados.concat(this.buscarHistoriales(todosDatos.historiales, palabrasClave, filtros));
    }
    if (todosDatos.recetas) {
      resultados = resultados.concat(this.buscarRecetas(todosDatos.recetas, palabrasClave, filtros));
    }

    return resultados;
  }

  // Utilidades de búsqueda
  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s]/g, ' ') // Remover puntuación
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  }

  private extraerPalabrasClave(texto: string): string[] {
    const palabrasComunes = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las'];
    
    return texto
      .split(' ')
      .filter(palabra => palabra.length > 2 && !palabrasComunes.includes(palabra))
      .slice(0, 10); // Limitar a 10 palabras clave
  }

  private encontrarCoincidencias(texto: string, palabrasClave: string[]): string[] {
    const coincidencias: string[] = [];
    
    palabrasClave.forEach(palabra => {
      if (texto.includes(palabra)) {
        coincidencias.push(palabra);
      }
    });

    return coincidencias;
  }

  private calcularRelevancia(coincidencias: string[], palabrasClave: string[]): number {
    if (palabrasClave.length === 0) return 0;
    
    let puntuacion = 0;
    
    // Puntuación base por coincidencias
    puntuacion += (coincidencias.length / palabrasClave.length) * 100;
    
    // Bonus por coincidencias exactas
    coincidencias.forEach(coincidencia => {
      if (palabrasClave.includes(coincidencia)) {
        puntuacion += 10;
      }
    });

    return Math.min(puntuacion, 100);
  }

  private aplicarFiltros(resultados: ResultadoBusqueda[], filtros: FiltrosBusqueda): ResultadoBusqueda[] {
    return resultados.filter(resultado => {
      // Filtro por fecha
      if (filtros.fechaInicio && resultado.fecha < filtros.fechaInicio) return false;
      if (filtros.fechaFin && resultado.fecha > filtros.fechaFin) return false;
      
      // Filtro por tipo específico
      const datos = resultado.datos as Record<string, string | number | boolean>;
      if (filtros.especialidad && datos.especialidad !== filtros.especialidad) return false;
      if (filtros.estado && datos.estado !== filtros.estado) return false;
      if (filtros.tipo && datos.tipo !== filtros.tipo) return false;
      
      return true;
    });
  }

  // Gestión de historial y sugerencias
  private agregarAlHistorial(query: string): void {
    if (query.trim().length > 2) {
      this.historialBusquedas.unshift(query);
      this.historialBusquedas = this.historialBusquedas.slice(0, 50); // Mantener últimas 50
      this.actualizarSugerencias(query);
    }
  }

  private actualizarSugerencias(query: string): void {
    const sugerenciaExistente = this.sugerencias.find(s => s.texto === query);
    
    if (sugerenciaExistente) {
      sugerenciaExistente.frecuencia++;
    } else {
      this.sugerencias.push({
        texto: query,
        tipo: 'historial',
        frecuencia: 1
      });
    }

    // Mantener solo las 20 sugerencias más frecuentes
    this.sugerencias.sort((a, b) => b.frecuencia - a.frecuencia);
    this.sugerencias = this.sugerencias.slice(0, 20);
  }

  // Obtener sugerencias de búsqueda
  obtenerSugerencias(query: string): SugerenciaBusqueda[] {
    const queryNormalizado = this.normalizarTexto(query);
    
    return this.sugerencias
      .filter(sugerencia => 
        this.normalizarTexto(sugerencia.texto).includes(queryNormalizado)
      )
      .slice(0, 5);
  }

  // Autocompletado inteligente
  obtenerAutocompletado(query: string, datos: (Paciente | Medico)[]): string[] {
    const sugerencias: string[] = [];
    const queryNormalizado = this.normalizarTexto(query);

    // Sugerencias del historial
    this.historialBusquedas
      .filter(busqueda => this.normalizarTexto(busqueda).includes(queryNormalizado))
      .slice(0, 3)
      .forEach(busqueda => sugerencias.push(busqueda));

    // Sugerencias de nombres de pacientes
    datos.forEach((item) => {
      if ('nombre' in item && 'apellido' in item) {
        const nombreCompleto = `${item.nombre} ${item.apellido}`;
        if (this.normalizarTexto(nombreCompleto).includes(queryNormalizado)) {
          sugerencias.push(nombreCompleto);
        }
      }
    });

    return [...new Set(sugerencias)].slice(0, 8);
  }

  // Búsqueda por voz (si está disponible)
  async busquedaPorVoz(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Reconocimiento de voz no disponible'));
        return;
      }

      const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof webkitSpeechRecognition; webkitSpeechRecognition?: typeof webkitSpeechRecognition }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof webkitSpeechRecognition }).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        reject(new Error('Reconocimiento de voz no disponible'));
        return;
      }

      const recognition = new SpeechRecognition();
      
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        reject(new Error(`Error de reconocimiento: ${event.error}`));
      };

      recognition.start();
    });
  }

  // Limpiar historial
  limpiarHistorial(): void {
    this.historialBusquedas = [];
    this.sugerencias = [];
  }

  // Obtener estadísticas de búsqueda
  obtenerEstadisticas(): {
    totalBusquedas: number;
    busquedasMasFreuentes: SugerenciaBusqueda[];
    ultimasBusquedas: string[];
  } {
    return {
      totalBusquedas: this.historialBusquedas.length,
      busquedasMasFreuentes: this.sugerencias.slice(0, 5),
      ultimasBusquedas: this.historialBusquedas.slice(0, 10)
    };
  }
}

// Instancia global del servicio
export const searchService = SearchService.getInstance();

// Hook para React
export const useSearch = () => {
  const [resultados, setResultados] = React.useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = React.useState(false);
  const [sugerencias, setSugerencias] = React.useState<SugerenciaBusqueda[]>([]);

  const buscar = async (query: string, datos: DatosBusqueda, tipo: string, filtros?: FiltrosBusqueda) => {
    setCargando(true);
    try {
      const resultados = await searchService.buscarInteligente(query, datos, tipo, filtros);
      setResultados(resultados);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

  const obtenerSugerencias = (query: string) => {
    const sugerencias = searchService.obtenerSugerencias(query);
    setSugerencias(sugerencias);
  };

  return {
    resultados,
    cargando,
    sugerencias,
    buscar,
    obtenerSugerencias,
    limpiarResultados: () => setResultados([])
  };
};