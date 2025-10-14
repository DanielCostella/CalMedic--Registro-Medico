import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Users, Activity, FileText, PieChart, LineChart, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

interface ReportePersonalizado {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'Pacientes' | 'Citas' | 'Financiero' | 'Clínico' | 'Operacional';
  fechaCreacion: string;
  ultimaEjecucion: string;
  parametros: ParametroReporte[];
  formato: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  programado: boolean;
  frecuencia?: 'Diario' | 'Semanal' | 'Mensual';
}

interface ParametroReporte {
  id: string;
  nombre: string;
  tipo: 'fecha' | 'select' | 'multiselect' | 'number' | 'text';
  valor: string | number | string[];
  opciones?: string[];
  requerido: boolean;
}

interface EstadisticaGeneral {
  nombre: string;
  valor: number;
  cambio: number; // porcentaje de cambio
  tendencia: 'up' | 'down' | 'stable';
  descripcion: string;
}

interface DatoGrafico {
  etiqueta: string;
  valor: number;
  color?: string;
}

const ReportesAvanzadosComponent: React.FC = () => {
  const [reportes, setReportes] = useState<ReportePersonalizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [generandoReporte, setGenerandoReporte] = useState(false);
  const [progresoGeneracion, setProgresoGeneracion] = useState(0);
  const [showNuevoReporte, setShowNuevoReporte] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<ReportePersonalizado | null>(null);
  
  const [estadisticasGenerales, setEstadisticasGenerales] = useState<EstadisticaGeneral[]>([]);
  const [datosPacientes, setDatosPacientes] = useState<DatoGrafico[]>([]);
  const [datosCitas, setDatosCitas] = useState<DatoGrafico[]>([]);
  const [datosIngresos, setDatosIngresos] = useState<DatoGrafico[]>([]);

  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const [nuevoReporte, setNuevoReporte] = useState<Omit<ReportePersonalizado, 'id' | 'fechaCreacion' | 'ultimaEjecucion'>>({
    nombre: '',
    descripcion: '',
    tipo: 'Pacientes',
    parametros: [],
    formato: 'PDF',
    programado: false
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const reportesIniciales: ReportePersonalizado[] = [
        {
          id: '1',
          nombre: 'Reporte Mensual de Pacientes',
          descripcion: 'Estadísticas completas de pacientes por mes',
          tipo: 'Pacientes',
          fechaCreacion: '2024-01-01',
          ultimaEjecucion: '2024-01-15',
          parametros: [
            {
              id: '1',
              nombre: 'Mes',
              tipo: 'select',
              valor: 'Enero',
              opciones: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
              requerido: true
            },
            {
              id: '2',
              nombre: 'Incluir gráficos',
              tipo: 'select',
              valor: 'Sí',
              opciones: ['Sí', 'No'],
              requerido: false
            }
          ],
          formato: 'PDF',
          programado: true,
          frecuencia: 'Mensual'
        },
        {
          id: '2',
          nombre: 'Análisis de Citas Semanales',
          descripcion: 'Reporte detallado de citas y asistencia semanal',
          tipo: 'Citas',
          fechaCreacion: '2024-01-05',
          ultimaEjecucion: '2024-01-14',
          parametros: [
            {
              id: '3',
              nombre: 'Semana',
              tipo: 'fecha',
              valor: '2024-01-08',
              requerido: true
            }
          ],
          formato: 'Excel',
          programado: true,
          frecuencia: 'Semanal'
        },
        {
          id: '3',
          nombre: 'Reporte Financiero Trimestral',
          descripcion: 'Análisis financiero y de ingresos por trimestre',
          tipo: 'Financiero',
          fechaCreacion: '2024-01-01',
          ultimaEjecucion: '2024-01-10',
          parametros: [
            {
              id: '4',
              nombre: 'Trimestre',
              tipo: 'select',
              valor: 'Q1 2024',
              opciones: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
              requerido: true
            }
          ],
          formato: 'PDF',
          programado: false
        }
      ];

      const estadisticasIniciales: EstadisticaGeneral[] = [
        {
          nombre: 'Total Pacientes',
          valor: 1234,
          cambio: 12.5,
          tendencia: 'up',
          descripcion: 'Pacientes registrados en el sistema'
        },
        {
          nombre: 'Citas Este Mes',
          valor: 456,
          cambio: -3.2,
          tendencia: 'down',
          descripcion: 'Citas programadas en el mes actual'
        },
        {
          nombre: 'Tasa de Asistencia',
          valor: 87.5,
          cambio: 2.1,
          tendencia: 'up',
          descripcion: 'Porcentaje de asistencia a citas'
        },
        {
          nombre: 'Ingresos Mensuales',
          valor: 45000,
          cambio: 8.7,
          tendencia: 'up',
          descripcion: 'Ingresos del mes actual'
        }
      ];

      const datosPacientesIniciales: DatoGrafico[] = [
        { etiqueta: 'Enero', valor: 95, color: '#3B82F6' },
        { etiqueta: 'Febrero', valor: 112, color: '#10B981' },
        { etiqueta: 'Marzo', valor: 87, color: '#F59E0B' },
        { etiqueta: 'Abril', valor: 134, color: '#EF4444' },
        { etiqueta: 'Mayo', valor: 156, color: '#8B5CF6' },
        { etiqueta: 'Junio', valor: 142, color: '#06B6D4' }
      ];

      const datosCitasIniciales: DatoGrafico[] = [
        { etiqueta: 'Lunes', valor: 45, color: '#3B82F6' },
        { etiqueta: 'Martes', valor: 52, color: '#10B981' },
        { etiqueta: 'Miércoles', valor: 38, color: '#F59E0B' },
        { etiqueta: 'Jueves', valor: 61, color: '#EF4444' },
        { etiqueta: 'Viernes', valor: 49, color: '#8B5CF6' },
        { etiqueta: 'Sábado', valor: 23, color: '#06B6D4' }
      ];

      const datosIngresosIniciales: DatoGrafico[] = [
        { etiqueta: 'Consultas', valor: 65, color: '#3B82F6' },
        { etiqueta: 'Procedimientos', valor: 25, color: '#10B981' },
        { etiqueta: 'Exámenes', valor: 10, color: '#F59E0B' }
      ];

      setReportes(reportesIniciales);
      setEstadisticasGenerales(estadisticasIniciales);
      setDatosPacientes(datosPacientesIniciales);
      setDatosCitas(datosCitasIniciales);
      setDatosIngresos(datosIngresosIniciales);
      setLoading(false);
    }, 1000);
  }, []);

  const generarReporte = async (reporte: ReportePersonalizado) => {
    setGenerandoReporte(true);
    setProgresoGeneracion(0);

    // Simular progreso de generación
    for (let i = 0; i <= 100; i += 10) {
      setProgresoGeneracion(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simular descarga del archivo
    const contenido = generarContenidoReporte(reporte);
    const blob = new Blob([contenido], { 
      type: reporte.formato === 'PDF' ? 'application/pdf' : 
            reporte.formato === 'Excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
            'text/plain'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reporte.nombre}.${reporte.formato.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);

    // Actualizar última ejecución
    setReportes(prev => prev.map(r => 
      r.id === reporte.id ? 
        { ...r, ultimaEjecucion: new Date().toISOString().split('T')[0] } : 
        r
    ));

    setGenerandoReporte(false);
    setProgresoGeneracion(0);
  };

  const generarContenidoReporte = (reporte: ReportePersonalizado): string => {
    const fecha = new Date().toLocaleDateString('es-ES');
    
    return `
REPORTE: ${reporte.nombre}
Fecha de generación: ${fecha}
Tipo: ${reporte.tipo}

DESCRIPCIÓN:
${reporte.descripcion}

PARÁMETROS:
${reporte.parametros.map(p => `${p.nombre}: ${p.valor}`).join('\n')}

ESTADÍSTICAS GENERALES:
${estadisticasGenerales.map(e => 
  `${e.nombre}: ${e.valor} (${e.cambio > 0 ? '+' : ''}${e.cambio}%)`
).join('\n')}

DATOS DE PACIENTES POR MES:
${datosPacientes.map(d => `${d.etiqueta}: ${d.valor}`).join('\n')}

DISTRIBUCIÓN DE CITAS POR DÍA:
${datosCitas.map(d => `${d.etiqueta}: ${d.valor}`).join('\n')}

DISTRIBUCIÓN DE INGRESOS:
${datosIngresos.map(d => `${d.etiqueta}: ${d.valor}%`).join('\n')}

---
Reporte generado automáticamente por el Sistema Médico Integral
    `;
  };

  const crearReporte = () => {
    const reporteCompleto: ReportePersonalizado = {
      ...nuevoReporte,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString().split('T')[0],
      ultimaEjecucion: ''
    };
    
    setReportes(prev => [...prev, reporteCompleto]);
    setShowNuevoReporte(false);
    resetFormulario();
  };

  const resetFormulario = () => {
    setNuevoReporte({
      nombre: '',
      descripcion: '',
      tipo: 'Pacientes',
      parametros: [],
      formato: 'PDF',
      programado: false
    });
  };

  const eliminarReporte = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este reporte?')) {
      setReportes(prev => prev.filter(r => r.id !== id));
    }
  };

  const exportarTodosLosDatos = () => {
    const datosCompletos = {
      estadisticas: estadisticasGenerales,
      pacientes: datosPacientes,
      citas: datosCitas,
      ingresos: datosIngresos,
      reportes: reportes,
      fechaExportacion: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(datosCompletos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `datos_completos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reportesFiltrados = reportes.filter(reporte => {
    const matchTipo = !filtroTipo || reporte.tipo === filtroTipo;
    const matchFecha = (!filtroFechaInicio || reporte.fechaCreacion >= filtroFechaInicio) &&
                      (!filtroFechaFin || reporte.fechaCreacion <= filtroFechaFin);
    
    return matchTipo && matchFecha;
  });

  const tiposReporte = [...new Set(reportes.map(r => r.tipo))];

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando reportes avanzados..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Reportes Avanzados y Analytics
          </h1>
          <p className="text-gray-600">
            Análisis detallado y reportes personalizables del sistema médico
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={exportarTodosLosDatos}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Datos
          </Button>
          
          <Dialog open={showNuevoReporte} onOpenChange={setShowNuevoReporte}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Nuevo Reporte
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Reporte</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre-reporte">Nombre del Reporte</Label>
                  <Input
                    id="nombre-reporte"
                    value={nuevoReporte.nombre}
                    onChange={(e) => setNuevoReporte({...nuevoReporte, nombre: e.target.value})}
                    placeholder="ej: Reporte Mensual de Actividad"
                  />
                </div>
                
                <div>
                  <Label htmlFor="descripcion-reporte">Descripción</Label>
                  <Input
                    id="descripcion-reporte"
                    value={nuevoReporte.descripcion}
                    onChange={(e) => setNuevoReporte({...nuevoReporte, descripcion: e.target.value})}
                    placeholder="Descripción del reporte..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo-reporte">Tipo de Reporte</Label>
                    <Select 
                      value={nuevoReporte.tipo} 
                      onValueChange={(value: ReportePersonalizado['tipo']) => 
                        setNuevoReporte({...nuevoReporte, tipo: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pacientes">Pacientes</SelectItem>
                        <SelectItem value="Citas">Citas</SelectItem>
                        <SelectItem value="Financiero">Financiero</SelectItem>
                        <SelectItem value="Clínico">Clínico</SelectItem>
                        <SelectItem value="Operacional">Operacional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="formato-reporte">Formato</Label>
                    <Select 
                      value={nuevoReporte.formato} 
                      onValueChange={(value: ReportePersonalizado['formato']) => 
                        setNuevoReporte({...nuevoReporte, formato: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="programado"
                    checked={nuevoReporte.programado}
                    onCheckedChange={(checked) => 
                      setNuevoReporte({...nuevoReporte, programado: !!checked})
                    }
                  />
                  <Label htmlFor="programado">Generar automáticamente</Label>
                </div>
                
                {nuevoReporte.programado && (
                  <div>
                    <Label htmlFor="frecuencia-reporte">Frecuencia</Label>
                    <Select 
                      value={nuevoReporte.frecuencia || 'Mensual'} 
                      onValueChange={(value: ReportePersonalizado['frecuencia']) => 
                        setNuevoReporte({...nuevoReporte, frecuencia: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diario">Diario</SelectItem>
                        <SelectItem value="Semanal">Semanal</SelectItem>
                        <SelectItem value="Mensual">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => {setShowNuevoReporte(false); resetFormulario();}}>
                  Cancelar
                </Button>
                <Button onClick={crearReporte} disabled={!nuevoReporte.nombre}>
                  Crear Reporte
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress bar para generación de reporte */}
      {generandoReporte && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Generando reporte...</span>
                  <span>{progresoGeneracion}%</span>
                </div>
                <Progress value={progresoGeneracion} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {estadisticasGenerales.map((estadistica, index) => (
          <Card key={index} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">{estadistica.nombre}</p>
                  <p className="text-2xl font-bold">
                    {estadistica.nombre.includes('Ingresos') ? 
                      `$${estadistica.valor.toLocaleString()}` :
                      estadistica.nombre.includes('Tasa') ?
                      `${estadistica.valor}%` :
                      estadistica.valor.toLocaleString()
                    }
                  </p>
                  <div className="flex items-center gap-1 text-blue-200 text-sm">
                    {estadistica.tendencia === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : estadistica.tendencia === 'down' ? (
                      <TrendingUp className="w-3 h-3 rotate-180" />
                    ) : null}
                    <span>{estadistica.cambio > 0 ? '+' : ''}{estadistica.cambio}%</span>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-600" />
              Pacientes por Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datosPacientes.map((dato, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dato.etiqueta}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(dato.valor / Math.max(...datosPacientes.map(d => d.valor))) * 100}%`,
                          backgroundColor: dato.color 
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{dato.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Citas por Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datosCitas.map((dato, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dato.etiqueta}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(dato.valor / Math.max(...datosCitas.map(d => d.valor))) * 100}%`,
                          backgroundColor: dato.color 
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{dato.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Distribución de Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datosIngresos.map((dato, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dato.etiqueta}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${dato.valor}%`,
                          backgroundColor: dato.color 
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold w-12 text-right">{dato.valor}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Filtrar reportes</Label>
            </div>
            
            <div className="flex gap-2">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {tiposReporte.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="w-40"
                placeholder="Fecha inicio"
              />
              
              <Input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="w-40"
                placeholder="Fecha fin"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Personalizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportesFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay reportes que coincidan con los filtros</p>
              </div>
            ) : (
              reportesFiltrados.map(reporte => (
                <div key={reporte.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{reporte.nombre}</h3>
                      <Badge variant="outline">{reporte.tipo}</Badge>
                      <Badge variant="secondary">{reporte.formato}</Badge>
                      {reporte.programado && (
                        <Badge variant="default">
                          <Calendar className="w-3 h-3 mr-1" />
                          {reporte.frecuencia}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{reporte.descripcion}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Creado: {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES')}</span>
                      {reporte.ultimaEjecucion && (
                        <span>Última ejecución: {new Date(reporte.ultimaEjecucion).toLocaleDateString('es-ES')}</span>
                      )}
                      <span>{reporte.parametros.length} parámetros</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generarReporte(reporte)}
                      disabled={generandoReporte}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReporteSeleccionado(reporte)}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => eliminarReporte(reporte.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Vista Detallada */}
      <Dialog open={!!reporteSeleccionado} onOpenChange={() => setReporteSeleccionado(null)}>
        <DialogContent className="max-w-2xl">
          {reporteSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  {reporteSeleccionado.nombre}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Descripción</h4>
                  <p className="text-gray-600">{reporteSeleccionado.descripcion}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Información General</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Tipo:</strong> {reporteSeleccionado.tipo}</div>
                      <div><strong>Formato:</strong> {reporteSeleccionado.formato}</div>
                      <div><strong>Programado:</strong> {reporteSeleccionado.programado ? 'Sí' : 'No'}</div>
                      {reporteSeleccionado.programado && (
                        <div><strong>Frecuencia:</strong> {reporteSeleccionado.frecuencia}</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Fechas</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Creado:</strong> {new Date(reporteSeleccionado.fechaCreacion).toLocaleDateString('es-ES')}</div>
                      {reporteSeleccionado.ultimaEjecucion && (
                        <div><strong>Última ejecución:</strong> {new Date(reporteSeleccionado.ultimaEjecucion).toLocaleDateString('es-ES')}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {reporteSeleccionado.parametros.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Parámetros</h4>
                    <div className="space-y-2">
                      {reporteSeleccionado.parametros.map(parametro => (
                        <div key={parametro.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{parametro.nombre}</span>
                          <span className="text-sm text-gray-600">{String(parametro.valor)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => generarReporte(reporteSeleccionado)}
                  disabled={generandoReporte}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportesAvanzadosComponent;