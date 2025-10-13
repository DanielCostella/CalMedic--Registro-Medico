// Servicio de notificaciones push y alertas
import React from 'react';
import { Cita, Paciente, MedicamentoReceta, Examen } from '@/types/medical';

export interface NotificacionConfig {
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'success' | 'warning' | 'error' | 'cita' | 'medicamento' | 'examen';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  destinatario?: string;
  accion?: {
    tipo: string;
    url: string;
    texto: string;
  };
  programada?: string; // Para notificaciones programadas
  repetir?: boolean;
}

interface NotificacionInterna {
  id: string;
  fecha: string;
  leida: boolean;
  titulo: string;
  mensaje: string;
  tipo: string;
  prioridad: string;
  accion?: {
    tipo: string;
    url: string;
    texto: string;
  };
}

export class NotificationService {
  private static instance: NotificationService;
  private notificaciones: NotificacionInterna[] = [];
  private subscribers: ((notificacion: NotificacionInterna) => void)[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Solicitar permisos de notificación
  async solicitarPermisos(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Enviar notificación push
  async enviarNotificacionPush(config: NotificacionConfig): Promise<void> {
    try {
      const tienePermisos = await this.solicitarPermisos();
      
      if (tienePermisos) {
        const notification = new Notification(config.titulo, {
          body: config.mensaje,
          icon: this.obtenerIconoPorTipo(config.tipo),
          badge: '/favicon.ico',
          tag: `${config.tipo}-${Date.now()}`,
          requireInteraction: config.prioridad === 'critica',
          silent: config.prioridad === 'baja'
        });

        notification.onclick = () => {
          if (config.accion?.url) {
            window.focus();
            window.location.href = config.accion.url;
          }
          notification.close();
        };

        // Auto-cerrar después de 5 segundos (excepto críticas)
        if (config.prioridad !== 'critica') {
          setTimeout(() => notification.close(), 5000);
        }
      }

      // Guardar en el sistema interno
      this.agregarNotificacion(config);
    } catch (error) {
      console.error('Error al enviar notificación push:', error);
    }
  }

  // Programar notificación
  programarNotificacion(config: NotificacionConfig, fechaHora: Date): void {
    const ahora = new Date();
    const tiempoEspera = fechaHora.getTime() - ahora.getTime();

    if (tiempoEspera > 0) {
      setTimeout(() => {
        this.enviarNotificacionPush(config);
      }, tiempoEspera);

      console.log(`Notificación programada para: ${fechaHora.toLocaleString()}`);
    }
  }

  // Notificaciones de recordatorio de citas
  programarRecordatorioCita(cita: Cita, paciente: Paciente): void {
    const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);
    
    // Recordatorio 24 horas antes
    const recordatorio24h = new Date(fechaCita.getTime() - 24 * 60 * 60 * 1000);
    this.programarNotificacion({
      titulo: 'Recordatorio de Cita',
      mensaje: `${paciente.nombre}, tiene una cita mañana a las ${cita.hora}`,
      tipo: 'cita',
      prioridad: 'media',
      accion: {
        tipo: 'ver_cita',
        url: `/citas/${cita.id}`,
        texto: 'Ver Cita'
      }
    }, recordatorio24h);

    // Recordatorio 1 hora antes
    const recordatorio1h = new Date(fechaCita.getTime() - 60 * 60 * 1000);
    this.programarNotificacion({
      titulo: 'Cita Próxima',
      mensaje: `Su cita es en 1 hora. No olvide asistir.`,
      tipo: 'cita',
      prioridad: 'alta',
      accion: {
        tipo: 'ver_cita',
        url: `/citas/${cita.id}`,
        texto: 'Ver Cita'
      }
    }, recordatorio1h);
  }

  // Notificaciones de medicamentos
  programarRecordatorioMedicamento(medicamento: MedicamentoReceta, paciente: Paciente): void {
    const config: NotificacionConfig = {
      titulo: 'Recordatorio de Medicamento',
      mensaje: `Es hora de tomar ${medicamento.nombre} - ${medicamento.dosis}`,
      tipo: 'medicamento',
      prioridad: 'media',
      repetir: true
    };

    // Programar según la frecuencia
    this.programarNotificacionesMedicamento(config, medicamento.frecuencia);
  }

  private programarNotificacionesMedicamento(config: NotificacionConfig, frecuencia: string): void {
    let intervalo = 0;

    // Parsear frecuencia (ej: "cada 8 horas", "3 veces al día")
    if (frecuencia.includes('8 horas')) {
      intervalo = 8 * 60 * 60 * 1000;
    } else if (frecuencia.includes('12 horas')) {
      intervalo = 12 * 60 * 60 * 1000;
    } else if (frecuencia.includes('3 veces')) {
      intervalo = 8 * 60 * 60 * 1000; // Cada 8 horas
    } else if (frecuencia.includes('2 veces')) {
      intervalo = 12 * 60 * 60 * 1000; // Cada 12 horas
    } else {
      intervalo = 24 * 60 * 60 * 1000; // Por defecto, una vez al día
    }

    // Programar múltiples recordatorios
    if (intervalo > 0) {
      setInterval(() => {
        this.enviarNotificacionPush(config);
      }, intervalo);
    }
  }

  // Notificaciones de exámenes
  notificarResultadoExamen(examen: Examen, paciente: Paciente): void {
    this.enviarNotificacionPush({
      titulo: 'Resultado de Examen Disponible',
      mensaje: `Los resultados de ${examen.nombre} están listos`,
      tipo: 'examen',
      prioridad: 'media',
      accion: {
        tipo: 'ver_examen',
        url: `/examenes/${examen.id}`,
        texto: 'Ver Resultado'
      }
    });
  }

  // Alertas críticas
  enviarAlertaCritica(mensaje: string, accion?: { tipo: string; url: string; texto: string }): void {
    this.enviarNotificacionPush({
      titulo: '⚠️ ALERTA CRÍTICA',
      mensaje,
      tipo: 'error',
      prioridad: 'critica',
      accion
    });

    // También mostrar alerta en el navegador
    if (window.confirm(`ALERTA CRÍTICA: ${mensaje}\n\n¿Desea tomar acción inmediata?`)) {
      if (accion?.url) {
        window.location.href = accion.url;
      }
    }
  }

  // Notificaciones del sistema
  notificarActualizacionSistema(): void {
    this.enviarNotificacionPush({
      titulo: 'Actualización del Sistema',
      mensaje: 'Nueva versión disponible con mejoras de seguridad',
      tipo: 'info',
      prioridad: 'baja'
    });
  }

  notificarRespaldoCompletado(): void {
    this.enviarNotificacionPush({
      titulo: 'Respaldo Completado',
      mensaje: 'Los datos han sido respaldados exitosamente',
      tipo: 'success',
      prioridad: 'baja'
    });
  }

  // Gestión interna de notificaciones
  private agregarNotificacion(config: NotificacionConfig): void {
    const notificacion: NotificacionInterna = {
      id: Date.now().toString(),
      titulo: config.titulo,
      mensaje: config.mensaje,
      tipo: config.tipo,
      prioridad: config.prioridad,
      fecha: new Date().toISOString(),
      leida: false,
      accion: config.accion
    };

    this.notificaciones.unshift(notificacion);
    
    // Mantener solo las últimas 100 notificaciones
    if (this.notificaciones.length > 100) {
      this.notificaciones = this.notificaciones.slice(0, 100);
    }

    // Notificar a los suscriptores
    this.subscribers.forEach(callback => callback(notificacion));
  }

  // Suscribirse a notificaciones
  suscribirse(callback: (notificacion: NotificacionInterna) => void): () => void {
    this.subscribers.push(callback);
    
    // Retornar función para desuscribirse
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Obtener notificaciones
  obtenerNotificaciones(): NotificacionInterna[] {
    return this.notificaciones;
  }

  // Marcar como leída
  marcarComoLeida(id: string): void {
    const notificacion = this.notificaciones.find(n => n.id === id);
    if (notificacion) {
      notificacion.leida = true;
    }
  }

  // Limpiar notificaciones
  limpiarNotificaciones(): void {
    this.notificaciones = [];
  }

  // Obtener icono por tipo
  private obtenerIconoPorTipo(tipo: string): string {
    const iconos: Record<string, string> = {
      info: '/icons/info.png',
      success: '/icons/success.png',
      warning: '/icons/warning.png',
      error: '/icons/error.png',
      cita: '/icons/calendar.png',
      medicamento: '/icons/pill.png',
      examen: '/icons/test.png'
    };

    return iconos[tipo] || '/favicon.ico';
  }

  // Configurar notificaciones automáticas
  configurarNotificacionesAutomaticas(): void {
    // Verificar citas del día siguiente
    setInterval(() => {
      this.verificarCitasProximas();
    }, 60 * 60 * 1000); // Cada hora

    // Verificar medicamentos vencidos
    setInterval(() => {
      this.verificarMedicamentosVencidos();
    }, 24 * 60 * 60 * 1000); // Cada día

    // Verificar respaldos pendientes
    setInterval(() => {
      this.verificarRespaldosPendientes();
    }, 7 * 24 * 60 * 60 * 1000); // Cada semana
  }

  private verificarCitasProximas(): void {
    // Lógica para verificar citas próximas
    console.log('Verificando citas próximas...');
  }

  private verificarMedicamentosVencidos(): void {
    // Lógica para verificar medicamentos vencidos
    console.log('Verificando medicamentos vencidos...');
  }

  private verificarRespaldosPendientes(): void {
    // Lógica para verificar respaldos pendientes
    console.log('Verificando respaldos pendientes...');
  }
}

// Instancia global del servicio
export const notificationService = NotificationService.getInstance();

// Hook para React (si se usa con hooks)
export const useNotifications = () => {
  const [notificaciones, setNotificaciones] = React.useState<NotificacionInterna[]>([]);

  React.useEffect(() => {
    const unsubscribe = notificationService.suscribirse((notificacion) => {
      setNotificaciones(prev => [notificacion, ...prev]);
    });

    // Cargar notificaciones existentes
    setNotificaciones(notificationService.obtenerNotificaciones());

    return unsubscribe;
  }, []);

  return {
    notificaciones,
    enviarNotificacion: (config: NotificacionConfig) => 
      notificationService.enviarNotificacionPush(config),
    marcarComoLeida: (id: string) => 
      notificationService.marcarComoLeida(id),
    limpiarNotificaciones: () => 
      notificationService.limpiarNotificaciones()
  };
};