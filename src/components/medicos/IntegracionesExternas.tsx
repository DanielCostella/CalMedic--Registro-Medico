import React, { useState, useEffect } from 'react';
import { Link, Calendar, DollarSign, Video, Shield, Settings, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Zap } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

interface IntegracionExterna {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'Calendario' | 'Facturación' | 'Telemedicina' | 'Seguros' | 'Laboratorios' | 'Farmacia';
  proveedor: string;
  version: string;
  estado: 'Conectado' | 'Desconectado' | 'Error' | 'Configurando';
  fechaConexion: string;
  ultimaSincronizacion: string;
  configuracion: ConfiguracionIntegracion;
  estadisticas: EstadisticasIntegracion;
  icono: string;
  color: string;
}

interface ConfiguracionIntegracion {
  apiKey?: string;
  apiSecret?: string;
  endpoint?: string;
  webhookUrl?: string;
  sincronizacionAutomatica: boolean;
  intervaloSincronizacion: number; // en minutos
  configuracionesEspecificas: Record<string, string | number | boolean>;
}

interface EstadisticasIntegracion {
  totalSincronizaciones: number;
  sincronizacionesExitosas: number;
  errores: number;
  ultimoError?: string;
  datosTransferidos: number; // en bytes
  tiempoRespuestaPromedio: number; // en ms
}

interface LogIntegracion {
  id: string;
  integracionId: string;
  fecha: string;
  tipo: 'Sincronización' | 'Error' | 'Configuración' | 'Webhook';
  mensaje: string;
  detalles?: string;
  estado: 'Exitoso' | 'Error' | 'Advertencia';
}

const IntegracionesExternasComponent: React.FC = () => {
  const [integraciones, setIntegraciones] = useState<IntegracionExterna[]>([]);
  const [logs, setLogs] = useState<LogIntegracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState<string | null>(null);
  const [showConfiguracion, setShowConfiguracion] = useState(false);
  const [integracionSeleccionada, setIntegracionSeleccionada] = useState<IntegracionExterna | null>(null);
  
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    // Simular carga de integraciones
    setTimeout(() => {
      const integracionesIniciales: IntegracionExterna[] = [
        {
          id: '1',
          nombre: 'Google Calendar',
          descripcion: 'Sincronización de citas con Google Calendar',
          categoria: 'Calendario',
          proveedor: 'Google',
          version: '3.0',
          estado: 'Conectado',
          fechaConexion: '2024-01-01',
          ultimaSincronizacion: '2024-01-16 14:30:00',
          configuracion: {
            apiKey: 'AIza***************',
            sincronizacionAutomatica: true,
            intervaloSincronizacion: 15,
            configuracionesEspecificas: {
              calendarioId: 'primary',
              tipoEventos: 'citas_medicas',
              recordatorios: true
            }
          },
          estadisticas: {
            totalSincronizaciones: 1250,
            sincronizacionesExitosas: 1245,
            errores: 5,
            datosTransferidos: 2048000,
            tiempoRespuestaPromedio: 150
          },
          icono: '📅',
          color: '#4285F4'
        },
        {
          id: '2',
          nombre: 'Stripe Payments',
          descripcion: 'Procesamiento de pagos y facturación',
          categoria: 'Facturación',
          proveedor: 'Stripe',
          version: '2023-10-16',
          estado: 'Conectado',
          fechaConexion: '2024-01-02',
          ultimaSincronizacion: '2024-01-16 13:45:00',
          configuracion: {
            apiKey: 'sk_test_***************',
            webhookUrl: 'https://api.clinica.com/webhooks/stripe',
            sincronizacionAutomatica: true,
            intervaloSincronizacion: 60,
            configuracionesEspecificas: {
              moneda: 'USD',
              metodosAceptados: 'card,bank_transfer',
              facturaAutomatica: true
            }
          },
          estadisticas: {
            totalSincronizaciones: 890,
            sincronizacionesExitosas: 885,
            errores: 5,
            datosTransferidos: 1536000,
            tiempoRespuestaPromedio: 200
          },
          icono: '💳',
          color: '#635BFF'
        },
        {
          id: '3',
          nombre: 'Zoom Healthcare',
          descripcion: 'Plataforma de telemedicina y videoconsultas',
          categoria: 'Telemedicina',
          proveedor: 'Zoom',
          version: '5.16.10',
          estado: 'Conectado',
          fechaConexion: '2024-01-03',
          ultimaSincronizacion: '2024-01-16 15:20:00',
          configuracion: {
            apiKey: 'zoom_api_***************',
            apiSecret: 'zoom_secret_***************',
            sincronizacionAutomatica: true,
            intervaloSincronizacion: 30,
            configuracionesEspecificas: {
              tipoReunion: 'healthcare',
              grabacionAutomatica: false,
              salaEspera: true,
              encriptacion: true
            }
          },
          estadisticas: {
            totalSincronizaciones: 456,
            sincronizacionesExitosas: 450,
            errores: 6,
            datosTransferidos: 5120000,
            tiempoRespuestaPromedio: 300
          },
          icono: '🎥',
          color: '#2D8CFF'
        },
        {
          id: '4',
          nombre: 'Microsoft Outlook',
          descripcion: 'Sincronización de calendario y correo',
          categoria: 'Calendario',
          proveedor: 'Microsoft',
          version: 'Graph API 1.0',
          estado: 'Desconectado',
          fechaConexion: '2024-01-04',
          ultimaSincronizacion: '2024-01-15 10:00:00',
          configuracion: {
            apiKey: 'outlook_***************',
            sincronizacionAutomatica: false,
            intervaloSincronizacion: 30,
            configuracionesEspecificas: {
              calendarioId: 'calendar',
              sincronizarCorreo: false,
              notificaciones: true
            }
          },
          estadisticas: {
            totalSincronizaciones: 234,
            sincronizacionesExitosas: 220,
            errores: 14,
            ultimoError: 'Token de acceso expirado',
            datosTransferidos: 1024000,
            tiempoRespuestaPromedio: 250
          },
          icono: '📧',
          color: '#0078D4'
        },
        {
          id: '5',
          nombre: 'LabCorp Connect',
          descripcion: 'Integración con laboratorio LabCorp',
          categoria: 'Laboratorios',
          proveedor: 'LabCorp',
          version: '2.1',
          estado: 'Error',
          fechaConexion: '2024-01-05',
          ultimaSincronizacion: '2024-01-16 08:00:00',
          configuracion: {
            endpoint: 'https://api.labcorp.com/v2',
            apiKey: 'labcorp_***************',
            sincronizacionAutomatica: true,
            intervaloSincronizacion: 60,
            configuracionesEspecificas: {
              tiposResultados: 'hematologia,quimica,microbiologia',
              alertasCriticas: true,
              formatoResultados: 'HL7'
            }
          },
          estadisticas: {
            totalSincronizaciones: 167,
            sincronizacionesExitosas: 145,
            errores: 22,
            ultimoError: 'Error de autenticación - Verificar credenciales',
            datosTransferidos: 3072000,
            tiempoRespuestaPromedio: 500
          },
          icono: '🧪',
          color: '#E74C3C'
        },
        {
          id: '6',
          nombre: 'Aetna Insurance API',
          descripcion: 'Verificación de seguros médicos',
          categoria: 'Seguros',
          proveedor: 'Aetna',
          version: '1.5',
          estado: 'Configurando',
          fechaConexion: '2024-01-15',
          ultimaSincronizacion: '',
          configuracion: {
            endpoint: 'https://api.aetna.com/v1',
            apiKey: '',
            sincronizacionAutomatica: false,
            intervaloSincronizacion: 120,
            configuracionesEspecificas: {
              tiposVerificacion: 'eligibilidad,beneficios,autorizaciones',
              formatoRespuesta: 'JSON'
            }
          },
          estadisticas: {
            totalSincronizaciones: 0,
            sincronizacionesExitosas: 0,
            errores: 0,
            datosTransferidos: 0,
            tiempoRespuestaPromedio: 0
          },
          icono: '🛡️',
          color: '#FF6B35'
        }
      ];

      const logsIniciales: LogIntegracion[] = [
        {
          id: '1',
          integracionId: '1',
          fecha: '2024-01-16 14:30:00',
          tipo: 'Sincronización',
          mensaje: 'Sincronización exitosa con Google Calendar',
          detalles: '15 eventos sincronizados correctamente',
          estado: 'Exitoso'
        },
        {
          id: '2',
          integracionId: '5',
          fecha: '2024-01-16 08:00:00',
          tipo: 'Error',
          mensaje: 'Error de autenticación con LabCorp',
          detalles: 'Token de API inválido o expirado. Código de error: AUTH_001',
          estado: 'Error'
        },
        {
          id: '3',
          integracionId: '2',
          fecha: '2024-01-16 13:45:00',
          tipo: 'Webhook',
          mensaje: 'Webhook recibido de Stripe',
          detalles: 'Pago procesado exitosamente - $150.00',
          estado: 'Exitoso'
        },
        {
          id: '4',
          integracionId: '4',
          fecha: '2024-01-15 10:00:00',
          tipo: 'Error',
          mensaje: 'Conexión perdida con Microsoft Outlook',
          detalles: 'Token de acceso expirado. Requiere reautenticación.',
          estado: 'Error'
        },
        {
          id: '5',
          integracionId: '3',
          fecha: '2024-01-16 15:20:00',
          tipo: 'Sincronización',
          mensaje: 'Reunión de Zoom creada',
          detalles: 'Videoconsulta programada para Dr. Pérez - 16:00',
          estado: 'Exitoso'
        }
      ];

      setIntegraciones(integracionesIniciales);
      setLogs(logsIniciales);
      setLoading(false);
    }, 1000);
  }, []);

  const sincronizarIntegracion = async (integracionId: string) => {
    setSincronizando(integracionId);
    
    // Simular sincronización
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Actualizar última sincronización
    setIntegraciones(prev => prev.map(integracion => 
      integracion.id === integracionId ? {
        ...integracion,
        ultimaSincronizacion: new Date().toISOString().replace('T', ' ').substring(0, 19),
        estadisticas: {
          ...integracion.estadisticas,
          totalSincronizaciones: integracion.estadisticas.totalSincronizaciones + 1,
          sincronizacionesExitosas: integracion.estadisticas.sincronizacionesExitosas + 1
        }
      } : integracion
    ));
    
    // Agregar log
    const nuevoLog: LogIntegracion = {
      id: Date.now().toString(),
      integracionId,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tipo: 'Sincronización',
      mensaje: `Sincronización manual exitosa`,
      estado: 'Exitoso'
    };
    
    setLogs(prev => [nuevoLog, ...prev]);
    setSincronizando(null);
  };

  const cambiarEstadoIntegracion = (integracionId: string, nuevoEstado: IntegracionExterna['estado']) => {
    setIntegraciones(prev => prev.map(integracion => 
      integracion.id === integracionId ? { ...integracion, estado: nuevoEstado } : integracion
    ));
  };

  const probarConexion = async (integracionId: string) => {
    setSincronizando(integracionId);
    
    // Simular prueba de conexión
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const exito = Math.random() > 0.3; // 70% de éxito
    
    const nuevoLog: LogIntegracion = {
      id: Date.now().toString(),
      integracionId,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tipo: 'Configuración',
      mensaje: exito ? 'Prueba de conexión exitosa' : 'Error en prueba de conexión',
      detalles: exito ? 'Todos los endpoints responden correctamente' : 'Timeout en la conexión',
      estado: exito ? 'Exitoso' : 'Error'
    };
    
    setLogs(prev => [nuevoLog, ...prev]);
    
    if (exito) {
      cambiarEstadoIntegracion(integracionId, 'Conectado');
    }
    
    setSincronizando(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const obtenerColorEstado = (estado: IntegracionExterna['estado']) => {
    switch (estado) {
      case 'Conectado': return 'text-green-600 bg-green-50 border-green-200';
      case 'Desconectado': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'Error': return 'text-red-600 bg-red-50 border-red-200';
      case 'Configurando': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const integracionesFiltradas = integraciones.filter(integracion => {
    const matchCategoria = !filtroCategoria || integracion.categoria === filtroCategoria;
    const matchEstado = !filtroEstado || integracion.estado === filtroEstado;
    
    return matchCategoria && matchEstado;
  });

  const categorias = [...new Set(integraciones.map(i => i.categoria))];

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando integraciones externas..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Link className="w-8 h-8 text-blue-600" />
            Integraciones Externas
          </h1>
          <p className="text-gray-600">
            Conexiones con sistemas externos y APIs de terceros
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuración Global
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Nueva Integración
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Integraciones</p>
                <p className="text-2xl font-bold">{integraciones.length}</p>
              </div>
              <Link className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Conectadas</p>
                <p className="text-2xl font-bold">
                  {integraciones.filter(i => i.estado === 'Conectado').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Con Errores</p>
                <p className="text-2xl font-bold">
                  {integraciones.filter(i => i.estado === 'Error').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Datos Transferidos</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(integraciones.reduce((total, i) => total + i.estadisticas.datosTransferidos, 0))}
                </p>
              </div>
              <Zap className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Filtrar integraciones</Label>
            </div>
            
            <div className="flex gap-2">
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Conectado">Conectado</SelectItem>
                  <SelectItem value="Desconectado">Desconectado</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                  <SelectItem value="Configurando">Configurando</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Integraciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integracionesFiltradas.map(integracion => (
          <Card key={integracion.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integracion.icono}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{integracion.nombre}</h3>
                    <p className="text-sm text-gray-600">{integracion.descripcion}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={obtenerColorEstado(integracion.estado)}
                >
                  {integracion.estado}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <strong>Proveedor:</strong> {integracion.proveedor}
                </div>
                <div>
                  <strong>Versión:</strong> {integracion.version}
                </div>
                <div>
                  <strong>Categoría:</strong> {integracion.categoria}
                </div>
                <div>
                  <strong>Última sync:</strong> {
                    integracion.ultimaSincronizacion ? 
                      new Date(integracion.ultimaSincronizacion).toLocaleString('es-ES') : 
                      'Nunca'
                  }
                </div>
              </div>
              
              {/* Estadísticas */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Sincronizaciones:</span>
                    <div className="font-medium">
                      {integracion.estadisticas.sincronizacionesExitosas}/{integracion.estadisticas.totalSincronizaciones}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Datos:</span>
                    <div className="font-medium">{formatFileSize(integracion.estadisticas.datosTransferidos)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tiempo resp.:</span>
                    <div className="font-medium">{integracion.estadisticas.tiempoRespuestaPromedio}ms</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Errores:</span>
                    <div className="font-medium text-red-600">{integracion.estadisticas.errores}</div>
                  </div>
                </div>
                
                {integracion.estadisticas.totalSincronizaciones > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Tasa de éxito</span>
                      <span>{Math.round((integracion.estadisticas.sincronizacionesExitosas / integracion.estadisticas.totalSincronizaciones) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(integracion.estadisticas.sincronizacionesExitosas / integracion.estadisticas.totalSincronizaciones) * 100}
                      className="h-1"
                    />
                  </div>
                )}
              </div>
              
              {/* Error message */}
              {integracion.estadisticas.ultimoError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-4">
                  <p className="text-xs text-red-700">
                    <strong>Último error:</strong> {integracion.estadisticas.ultimoError}
                  </p>
                </div>
              )}
              
              {/* Acciones */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sincronizarIntegracion(integracion.id)}
                  disabled={sincronizando === integracion.id}
                >
                  {sincronizando === integracion.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => probarConexion(integracion.id)}
                  disabled={sincronizando === integracion.id}
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIntegracionSeleccionada(integracion)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open('#', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Logs de Actividad */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.slice(0, 10).map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.estado === 'Exitoso' ? 'bg-green-500' :
                  log.estado === 'Error' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{log.mensaje}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {log.tipo}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(log.fecha).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                  
                  {log.detalles && (
                    <p className="text-xs text-gray-600">{log.detalles}</p>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {integraciones.find(i => i.id === log.integracionId)?.nombre}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Configuración */}
      <Dialog open={!!integracionSeleccionada} onOpenChange={() => setIntegracionSeleccionada(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {integracionSeleccionada && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="text-2xl">{integracionSeleccionada.icono}</div>
                  Configuración - {integracionSeleccionada.nombre}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="configuracion">Configuración</TabsTrigger>
                  <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input value={integracionSeleccionada.nombre} readOnly />
                    </div>
                    <div>
                      <Label>Proveedor</Label>
                      <Input value={integracionSeleccionada.proveedor} readOnly />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Descripción</Label>
                    <Input value={integracionSeleccionada.descripcion} readOnly />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Categoría</Label>
                      <Input value={integracionSeleccionada.categoria} readOnly />
                    </div>
                    <div>
                      <Label>Versión</Label>
                      <Input value={integracionSeleccionada.version} readOnly />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Badge className={obtenerColorEstado(integracionSeleccionada.estado)}>
                        {integracionSeleccionada.estado}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha de Conexión</Label>
                      <Input value={new Date(integracionSeleccionada.fechaConexion).toLocaleDateString('es-ES')} readOnly />
                    </div>
                    <div>
                      <Label>Última Sincronización</Label>
                      <Input value={
                        integracionSeleccionada.ultimaSincronizacion ? 
                          new Date(integracionSeleccionada.ultimaSincronizacion).toLocaleString('es-ES') : 
                          'Nunca'
                      } readOnly />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="configuracion" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Sincronización Automática</Label>
                    <Switch
                      checked={integracionSeleccionada.configuracion.sincronizacionAutomatica}
                      onCheckedChange={(checked) => {
                        // Aquí iría la lógica para actualizar la configuración
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label>Intervalo de Sincronización (minutos)</Label>
                    <Input 
                      type="number" 
                      value={integracionSeleccionada.configuracion.intervaloSincronizacion}
                      onChange={(e) => {
                        // Aquí iría la lógica para actualizar el intervalo
                      }}
                    />
                  </div>
                  
                  {integracionSeleccionada.configuracion.apiKey && (
                    <div>
                      <Label>API Key</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="password" 
                          value={integracionSeleccionada.configuracion.apiKey}
                          readOnly
                        />
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {integracionSeleccionada.configuracion.endpoint && (
                    <div>
                      <Label>Endpoint</Label>
                      <Input value={integracionSeleccionada.configuracion.endpoint} />
                    </div>
                  )}
                  
                  {integracionSeleccionada.configuracion.webhookUrl && (
                    <div>
                      <Label>Webhook URL</Label>
                      <Input value={integracionSeleccionada.configuracion.webhookUrl} />
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Configuraciones Específicas</h4>
                    <div className="space-y-2">
                      {Object.entries(integracionSeleccionada.configuracion.configuracionesEspecificas).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="estadisticas" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {integracionSeleccionada.estadisticas.totalSincronizaciones}
                          </div>
                          <div className="text-sm text-gray-600">Total Sincronizaciones</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {integracionSeleccionada.estadisticas.sincronizacionesExitosas}
                          </div>
                          <div className="text-sm text-gray-600">Exitosas</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {integracionSeleccionada.estadisticas.errores}
                          </div>
                          <div className="text-sm text-gray-600">Errores</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {integracionSeleccionada.estadisticas.tiempoRespuestaPromedio}ms
                          </div>
                          <div className="text-sm text-gray-600">Tiempo Respuesta</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Label>Datos Transferidos</Label>
                    <div className="text-lg font-semibold">
                      {formatFileSize(integracionSeleccionada.estadisticas.datosTransferidos)}
                    </div>
                  </div>
                  
                  {integracionSeleccionada.estadisticas.totalSincronizaciones > 0 && (
                    <div>
                      <Label>Tasa de Éxito</Label>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sincronizaciones exitosas</span>
                          <span>{Math.round((integracionSeleccionada.estadisticas.sincronizacionesExitosas / integracionSeleccionada.estadisticas.totalSincronizaciones) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(integracionSeleccionada.estadisticas.sincronizacionesExitosas / integracionSeleccionada.estadisticas.totalSincronizaciones) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIntegracionSeleccionada(null)}>
                  Cerrar
                </Button>
                <Button>
                  Guardar Cambios
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegracionesExternasComponent;