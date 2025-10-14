import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Download, RefreshCw, Calendar, User, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';

interface ResultadoLaboratorio {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  laboratorio: string;
  fechaOrden: string;
  fechaResultado: string;
  estado: 'Pendiente' | 'En proceso' | 'Completado' | 'Crítico';
  examen: string;
  categoria: string;
  resultados: ParametroLaboratorio[];
  observaciones: string;
  medicoSolicitante: string;
  urgencia: 'Normal' | 'Urgente' | 'STAT';
}

interface ParametroLaboratorio {
  id: string;
  nombre: string;
  valor: number | string;
  unidad: string;
  rangoReferencia: string;
  estado: 'Normal' | 'Alto' | 'Bajo' | 'Crítico';
  fechaAnterior?: string;
  valorAnterior?: number | string;
}

interface AlertaCritica {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  parametro: string;
  valor: string;
  rangoReferencia: string;
  fechaResultado: string;
  laboratorio: string;
  estado: 'Nueva' | 'Revisada' | 'Resuelta';
  accionRequerida: string;
}

const IntegracionLaboratoriosComponent: React.FC = () => {
  const [resultados, setResultados] = useState<ResultadoLaboratorio[]>([]);
  const [alertasCriticas, setAlertasCriticas] = useState<AlertaCritica[]>([]);
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState<ResultadoLaboratorio | null>(null);
  const [showTendencias, setShowTendencias] = useState(false);
  const [parametroTendencia, setParametroTendencia] = useState<string>('');
  
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroLaboratorio, setFiltroLaboratorio] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // Simular carga de resultados de laboratorio
    setTimeout(() => {
      const resultadosIniciales: ResultadoLaboratorio[] = [
        {
          id: '1',
          pacienteId: '1',
          pacienteNombre: 'María González',
          laboratorio: 'Lab Central',
          fechaOrden: '2024-01-15',
          fechaResultado: '2024-01-16',
          estado: 'Crítico',
          examen: 'Hemograma Completo',
          categoria: 'Hematología',
          resultados: [
            {
              id: '1',
              nombre: 'Hemoglobina',
              valor: 6.8,
              unidad: 'g/dL',
              rangoReferencia: '12.0-15.5',
              estado: 'Crítico',
              fechaAnterior: '2023-12-15',
              valorAnterior: 11.2
            },
            {
              id: '2',
              nombre: 'Hematocrito',
              valor: 20.5,
              unidad: '%',
              rangoReferencia: '36.0-46.0',
              estado: 'Crítico',
              fechaAnterior: '2023-12-15',
              valorAnterior: 34.1
            },
            {
              id: '3',
              nombre: 'Leucocitos',
              valor: 4500,
              unidad: '/μL',
              rangoReferencia: '4000-11000',
              estado: 'Normal'
            },
            {
              id: '4',
              nombre: 'Plaquetas',
              valor: 180000,
              unidad: '/μL',
              rangoReferencia: '150000-450000',
              estado: 'Normal'
            }
          ],
          observaciones: 'Anemia severa. Requiere evaluación inmediata.',
          medicoSolicitante: 'Dr. Sistema',
          urgencia: 'STAT'
        },
        {
          id: '2',
          pacienteId: '2',
          pacienteNombre: 'Carlos Rodríguez',
          laboratorio: 'Lab Especializado',
          fechaOrden: '2024-01-14',
          fechaResultado: '2024-01-15',
          estado: 'Completado',
          examen: 'Perfil Lipídico',
          categoria: 'Química Sanguínea',
          resultados: [
            {
              id: '5',
              nombre: 'Colesterol Total',
              valor: 280,
              unidad: 'mg/dL',
              rangoReferencia: '<200',
              estado: 'Alto',
              fechaAnterior: '2023-11-14',
              valorAnterior: 245
            },
            {
              id: '6',
              nombre: 'HDL',
              valor: 35,
              unidad: 'mg/dL',
              rangoReferencia: '>40',
              estado: 'Bajo',
              fechaAnterior: '2023-11-14',
              valorAnterior: 38
            },
            {
              id: '7',
              nombre: 'LDL',
              valor: 195,
              unidad: 'mg/dL',
              rangoReferencia: '<100',
              estado: 'Alto',
              fechaAnterior: '2023-11-14',
              valorAnterior: 165
            },
            {
              id: '8',
              nombre: 'Triglicéridos',
              valor: 250,
              unidad: 'mg/dL',
              rangoReferencia: '<150',
              estado: 'Alto',
              fechaAnterior: '2023-11-14',
              valorAnterior: 210
            }
          ],
          observaciones: 'Dislipidemia mixta. Ajustar tratamiento.',
          medicoSolicitante: 'Dr. Sistema',
          urgencia: 'Normal'
        },
        {
          id: '3',
          pacienteId: '3',
          pacienteNombre: 'Ana Martínez',
          laboratorio: 'Lab Central',
          fechaOrden: '2024-01-13',
          fechaResultado: '2024-01-14',
          estado: 'Completado',
          examen: 'Función Hepática',
          categoria: 'Química Sanguínea',
          resultados: [
            {
              id: '9',
              nombre: 'ALT (GPT)',
              valor: 45,
              unidad: 'U/L',
              rangoReferencia: '7-56',
              estado: 'Normal'
            },
            {
              id: '10',
              nombre: 'AST (GOT)',
              valor: 38,
              unidad: 'U/L',
              rangoReferencia: '10-40',
              estado: 'Normal'
            },
            {
              id: '11',
              nombre: 'Bilirrubina Total',
              valor: 1.2,
              unidad: 'mg/dL',
              rangoReferencia: '0.3-1.2',
              estado: 'Normal'
            }
          ],
          observaciones: 'Función hepática dentro de límites normales.',
          medicoSolicitante: 'Dr. Sistema',
          urgencia: 'Normal'
        },
        {
          id: '4',
          pacienteId: '4',
          pacienteNombre: 'Luis García',
          laboratorio: 'Lab Especializado',
          fechaOrden: '2024-01-12',
          fechaResultado: '',
          estado: 'En proceso',
          examen: 'Función Renal',
          categoria: 'Química Sanguínea',
          resultados: [],
          observaciones: 'Procesando muestras...',
          medicoSolicitante: 'Dr. Sistema',
          urgencia: 'Urgente'
        }
      ];

      const alertasIniciales: AlertaCritica[] = [
        {
          id: '1',
          pacienteId: '1',
          pacienteNombre: 'María González',
          parametro: 'Hemoglobina',
          valor: '6.8 g/dL',
          rangoReferencia: '12.0-15.5 g/dL',
          fechaResultado: '2024-01-16',
          laboratorio: 'Lab Central',
          estado: 'Nueva',
          accionRequerida: 'Evaluación inmediata - Anemia severa'
        },
        {
          id: '2',
          pacienteId: '1',
          pacienteNombre: 'María González',
          parametro: 'Hematocrito',
          valor: '20.5%',
          rangoReferencia: '36.0-46.0%',
          fechaResultado: '2024-01-16',
          laboratorio: 'Lab Central',
          estado: 'Nueva',
          accionRequerida: 'Confirmar anemia severa - Posible transfusión'
        }
      ];

      setResultados(resultadosIniciales);
      setAlertasCriticas(alertasIniciales);
      setLoading(false);
    }, 1000);

    // Simular llegada de nuevos resultados cada 30 segundos
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% de probabilidad
        simularNuevoResultado();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const simularNuevoResultado = () => {
    const nuevosParametros: ParametroLaboratorio[] = [
      {
        id: Date.now().toString(),
        nombre: 'Glucosa',
        valor: Math.floor(Math.random() * 200) + 70,
        unidad: 'mg/dL',
        rangoReferencia: '70-100',
        estado: Math.random() > 0.7 ? 'Alto' : 'Normal'
      }
    ];

    const nuevoResultado: ResultadoLaboratorio = {
      id: Date.now().toString(),
      pacienteId: '5',
      pacienteNombre: 'Paciente Nuevo',
      laboratorio: 'Lab Automático',
      fechaOrden: new Date().toISOString().split('T')[0],
      fechaResultado: new Date().toISOString().split('T')[0],
      estado: 'Completado',
      examen: 'Glucosa en ayunas',
      categoria: 'Química Sanguínea',
      resultados: nuevosParametros,
      observaciones: 'Resultado automático recibido',
      medicoSolicitante: 'Dr. Sistema',
      urgencia: 'Normal'
    };

    setResultados(prev => [nuevoResultado, ...prev]);

    // Mostrar notificación del navegador
    if (Notification.permission === 'granted') {
      new Notification('Nuevo resultado de laboratorio', {
        body: `${nuevoResultado.pacienteNombre} - ${nuevoResultado.examen}`,
        icon: '/favicon.png'
      });
    }
  };

  const sincronizarResultados = async () => {
    setSincronizando(true);
    
    // Simular sincronización con API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular actualización de algunos resultados
    setResultados(prev => prev.map(resultado => 
      resultado.estado === 'En proceso' ? {
        ...resultado,
        estado: 'Completado' as const,
        fechaResultado: new Date().toISOString().split('T')[0],
        resultados: [
          {
            id: Date.now().toString(),
            nombre: 'Creatinina',
            valor: 1.1,
            unidad: 'mg/dL',
            rangoReferencia: '0.7-1.3',
            estado: 'Normal' as const
          },
          {
            id: (Date.now() + 1).toString(),
            nombre: 'BUN',
            valor: 18,
            unidad: 'mg/dL',
            rangoReferencia: '7-20',
            estado: 'Normal' as const
          }
        ]
      } : resultado
    ));
    
    setSincronizando(false);
  };

  const marcarAlertaComoRevisada = (alertaId: string) => {
    setAlertasCriticas(prev => prev.map(alerta => 
      alerta.id === alertaId ? { ...alerta, estado: 'Revisada' as const } : alerta
    ));
  };

  const obtenerTendencia = (valorActual: number, valorAnterior?: number): 'up' | 'down' | 'stable' => {
    if (!valorAnterior) return 'stable';
    if (valorActual > valorAnterior) return 'up';
    if (valorActual < valorAnterior) return 'down';
    return 'stable';
  };

  const obtenerColorEstado = (estado: ParametroLaboratorio['estado']) => {
    switch (estado) {
      case 'Normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'Alto': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Bajo': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Crítico': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const exportarResultados = (resultado: ResultadoLaboratorio) => {
    const contenido = `
      RESULTADO DE LABORATORIO
      
      Paciente: ${resultado.pacienteNombre}
      Laboratorio: ${resultado.laboratorio}
      Examen: ${resultado.examen}
      Fecha de Orden: ${new Date(resultado.fechaOrden).toLocaleDateString('es-ES')}
      Fecha de Resultado: ${new Date(resultado.fechaResultado).toLocaleDateString('es-ES')}
      Médico Solicitante: ${resultado.medicoSolicitante}
      
      RESULTADOS:
      ${resultado.resultados.map(param => 
        `${param.nombre}: ${param.valor} ${param.unidad} (Ref: ${param.rangoReferencia}) - ${param.estado}`
      ).join('\n')}
      
      OBSERVACIONES:
      ${resultado.observaciones}
    `;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resultado_${resultado.pacienteNombre}_${resultado.examen}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resultadosFiltrados = resultados.filter(resultado => {
    const matchBusqueda = !busqueda || 
      resultado.pacienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      resultado.examen.toLowerCase().includes(busqueda.toLowerCase()) ||
      resultado.laboratorio.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchEstado = !filtroEstado || resultado.estado === filtroEstado;
    const matchLaboratorio = !filtroLaboratorio || resultado.laboratorio === filtroLaboratorio;
    const matchFecha = !filtroFecha || resultado.fechaResultado === filtroFecha;
    
    return matchBusqueda && matchEstado && matchLaboratorio && matchFecha;
  });

  const laboratorios = [...new Set(resultados.map(r => r.laboratorio))];

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando integración con laboratorios..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            Integración con Laboratorios
          </h1>
          <p className="text-gray-600">
            Recepción automática y análisis de resultados de laboratorio
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={sincronizarResultados}
            disabled={sincronizando}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {sincronizando ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronizar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Alertas Críticas */}
      {alertasCriticas.filter(a => a.estado === 'Nueva').length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Alertas Críticas ({alertasCriticas.filter(a => a.estado === 'Nueva').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertasCriticas.filter(a => a.estado === 'Nueva').map(alerta => (
                <div key={alerta.id} className="flex items-start justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div className="font-medium text-red-900">{alerta.pacienteNombre}</div>
                    <div className="text-sm text-red-700">
                      <strong>{alerta.parametro}:</strong> {alerta.valor} (Normal: {alerta.rangoReferencia})
                    </div>
                    <div className="text-sm text-red-600 mt-1">{alerta.accionRequerida}</div>
                    <div className="text-xs text-red-500 mt-1">
                      {alerta.laboratorio} - {new Date(alerta.fechaResultado).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => marcarAlertaComoRevisada(alerta.id)}
                    className="text-red-600 border-red-300 hover:bg-red-100"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Revisar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Resultados</p>
                <p className="text-2xl font-bold">{resultados.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Críticos</p>
                <p className="text-2xl font-bold">
                  {resultados.filter(r => r.estado === 'Crítico').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">En Proceso</p>
                <p className="text-2xl font-bold">
                  {resultados.filter(r => r.estado === 'En proceso').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completados</p>
                <p className="text-2xl font-bold">
                  {resultados.filter(r => r.estado === 'Completado').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por paciente, examen o laboratorio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En proceso">En proceso</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtroLaboratorio} onValueChange={setFiltroLaboratorio}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Laboratorio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {laboratorios.map(lab => (
                    <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Resultados */}
      <div className="space-y-4">
        {resultadosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron resultados que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          resultadosFiltrados.map(resultado => (
            <Card key={resultado.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {resultado.pacienteNombre}
                      </h3>
                      <Badge variant={
                        resultado.estado === 'Crítico' ? 'destructive' :
                        resultado.estado === 'Completado' ? 'default' :
                        resultado.estado === 'En proceso' ? 'secondary' : 'outline'
                      }>
                        {resultado.estado}
                      </Badge>
                      {resultado.urgencia === 'STAT' && (
                        <Badge variant="destructive">STAT</Badge>
                      )}
                      {resultado.urgencia === 'Urgente' && (
                        <Badge variant="outline" className="border-orange-300 text-orange-600">
                          Urgente
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{resultado.examen}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span>{resultado.laboratorio}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {resultado.fechaResultado ? 
                            new Date(resultado.fechaResultado).toLocaleDateString('es-ES') : 
                            'Pendiente'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{resultado.medicoSolicitante}</span>
                      </div>
                    </div>
                    
                    {resultado.resultados.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {resultado.resultados.slice(0, 4).map(parametro => {
                            const tendencia = obtenerTendencia(
                              typeof parametro.valor === 'number' ? parametro.valor : 0,
                              typeof parametro.valorAnterior === 'number' ? parametro.valorAnterior : undefined
                            );
                            
                            return (
                              <div 
                                key={parametro.id} 
                                className={`p-2 rounded-lg border text-xs ${obtenerColorEstado(parametro.estado)}`}
                              >
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{parametro.nombre}:</span>
                                  <span>{parametro.valor} {parametro.unidad}</span>
                                  {tendencia !== 'stable' && (
                                    tendencia === 'up' ? 
                                      <TrendingUp className="w-3 h-3 text-red-500" /> :
                                      <TrendingDown className="w-3 h-3 text-green-500" />
                                  )}
                                </div>
                                <div className="text-gray-500">Ref: {parametro.rangoReferencia}</div>
                              </div>
                            );
                          })}
                          {resultado.resultados.length > 4 && (
                            <div className="p-2 rounded-lg border border-gray-200 text-xs text-gray-600">
                              +{resultado.resultados.length - 4} más
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {resultado.observaciones && (
                      <div className="text-sm text-gray-600">
                        <strong>Observaciones:</strong> {resultado.observaciones}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setResultadoSeleccionado(resultado)}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportarResultados(resultado)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Vista Detallada */}
      <Dialog open={!!resultadoSeleccionado} onOpenChange={() => setResultadoSeleccionado(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {resultadoSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  {resultadoSeleccionado.examen} - {resultadoSeleccionado.pacienteNombre}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="resultados" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resultados">Resultados</TabsTrigger>
                  <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
                  <TabsTrigger value="detalles">Detalles</TabsTrigger>
                </TabsList>
                
                <TabsContent value="resultados" className="space-y-4">
                  <div className="space-y-3">
                    {resultadoSeleccionado.resultados.map(parametro => {
                      const tendencia = obtenerTendencia(
                        typeof parametro.valor === 'number' ? parametro.valor : 0,
                        typeof parametro.valorAnterior === 'number' ? parametro.valorAnterior : undefined
                      );
                      
                      return (
                        <div key={parametro.id} className={`p-4 rounded-lg border ${obtenerColorEstado(parametro.estado)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-lg">{parametro.nombre}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                parametro.estado === 'Normal' ? 'default' :
                                parametro.estado === 'Crítico' ? 'destructive' : 'secondary'
                              }>
                                {parametro.estado}
                              </Badge>
                              {tendencia !== 'stable' && (
                                tendencia === 'up' ? 
                                  <TrendingUp className="w-4 h-4 text-red-500" /> :
                                  <TrendingDown className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <strong>Valor Actual:</strong>
                              <div className="text-lg font-semibold">{parametro.valor} {parametro.unidad}</div>
                            </div>
                            <div>
                              <strong>Rango de Referencia:</strong>
                              <div>{parametro.rangoReferencia}</div>
                            </div>
                            {parametro.valorAnterior && (
                              <div>
                                <strong>Valor Anterior:</strong>
                                <div>{parametro.valorAnterior} {parametro.unidad}</div>
                                <div className="text-xs text-gray-500">
                                  {parametro.fechaAnterior && new Date(parametro.fechaAnterior).toLocaleDateString('es-ES')}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="tendencias" className="space-y-4">
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">
                      Gráficos de tendencias disponibles próximamente
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Se mostrarán gráficos de evolución temporal de los parámetros
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="detalles" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Información General</h4>
                      <div><strong>Paciente:</strong> {resultadoSeleccionado.pacienteNombre}</div>
                      <div><strong>Examen:</strong> {resultadoSeleccionado.examen}</div>
                      <div><strong>Categoría:</strong> {resultadoSeleccionado.categoria}</div>
                      <div><strong>Laboratorio:</strong> {resultadoSeleccionado.laboratorio}</div>
                      <div><strong>Urgencia:</strong> {resultadoSeleccionado.urgencia}</div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Fechas</h4>
                      <div><strong>Fecha de Orden:</strong> {new Date(resultadoSeleccionado.fechaOrden).toLocaleDateString('es-ES')}</div>
                      <div><strong>Fecha de Resultado:</strong> {
                        resultadoSeleccionado.fechaResultado ? 
                          new Date(resultadoSeleccionado.fechaResultado).toLocaleDateString('es-ES') : 
                          'Pendiente'
                      }</div>
                      <div><strong>Médico Solicitante:</strong> {resultadoSeleccionado.medicoSolicitante}</div>
                      <div><strong>Estado:</strong> 
                        <Badge className="ml-2" variant={
                          resultadoSeleccionado.estado === 'Crítico' ? 'destructive' :
                          resultadoSeleccionado.estado === 'Completado' ? 'default' : 'secondary'
                        }>
                          {resultadoSeleccionado.estado}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {resultadoSeleccionado.observaciones && (
                    <div>
                      <h4 className="font-semibold mb-2">Observaciones</h4>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {resultadoSeleccionado.observaciones}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => exportarResultados(resultadoSeleccionado)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegracionLaboratoriosComponent;