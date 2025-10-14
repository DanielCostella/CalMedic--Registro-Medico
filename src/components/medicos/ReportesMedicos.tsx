import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  FileText, 
  Download, 
  Filter,
  PieChart,
  Activity,
  Clock,
  DollarSign,
  Stethoscope,
  Pill,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Printer
} from 'lucide-react';

interface ReporteData {
  id: string;
  tipo: 'pacientes' | 'citas' | 'recetas' | 'ingresos' | 'diagnosticos';
  titulo: string;
  fecha: string;
  periodo: string;
  datos: Record<string, unknown>;
  estado: 'generado' | 'procesando' | 'error';
}

interface EstadisticasPacientes {
  totalPacientes: number;
  pacientesNuevos: number;
  pacientesActivos: number;
  edadPromedio: number;
  distribucionGenero: { masculino: number; femenino: number };
  distribucionEdad: { rango: string; cantidad: number }[];
}

interface EstadisticasCitas {
  totalCitas: number;
  citasCompletadas: number;
  citasCanceladas: number;
  citasPendientes: number;
  tiempoPromedioConsulta: number;
  citasPorTipo: { tipo: string; cantidad: number }[];
  citasPorDia: { dia: string; cantidad: number }[];
}

interface EstadisticasRecetas {
  totalRecetas: number;
  medicamentosRecetados: number;
  recetasPorTipo: { tipo: string; cantidad: number }[];
  medicamentosMasRecetados: { medicamento: string; cantidad: number }[];
  diagnosticosFrecuentes: { diagnostico: string; cantidad: number }[];
}

interface EstadisticasIngresos {
  ingresosTotales: number;
  ingresosMes: number;
  ingresoPromedioCita: number;
  ingresosPorMes: { mes: string; ingresos: number }[];
  ingresosPorTipo: { tipo: string; ingresos: number }[];
}

interface ReportesMedicosProps {
  medicoId: string;
  medicoNombre: string;
}

export default function ReportesMedicos({ medicoId, medicoNombre }: ReportesMedicosProps) {
  const [reportes, setReportes] = useState<ReporteData[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('mes');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<string>('resumen');

  // Datos simulados para estadísticas
  const estadisticasPacientes: EstadisticasPacientes = {
    totalPacientes: 156,
    pacientesNuevos: 23,
    pacientesActivos: 134,
    edadPromedio: 42.5,
    distribucionGenero: { masculino: 68, femenino: 88 },
    distribucionEdad: [
      { rango: '0-18', cantidad: 12 },
      { rango: '19-35', cantidad: 45 },
      { rango: '36-50', cantidad: 52 },
      { rango: '51-65', cantidad: 38 },
      { rango: '65+', cantidad: 9 }
    ]
  };

  const estadisticasCitas: EstadisticasCitas = {
    totalCitas: 284,
    citasCompletadas: 241,
    citasCanceladas: 28,
    citasPendientes: 15,
    tiempoPromedioConsulta: 32,
    citasPorTipo: [
      { tipo: 'General', cantidad: 156 },
      { tipo: 'Control', cantidad: 89 },
      { tipo: 'Emergencia', cantidad: 23 },
      { tipo: 'Primera Vez', cantidad: 16 }
    ],
    citasPorDia: [
      { dia: 'Lunes', cantidad: 42 },
      { dia: 'Martes', cantidad: 38 },
      { dia: 'Miércoles', cantidad: 45 },
      { dia: 'Jueves', cantidad: 41 },
      { dia: 'Viernes', cantidad: 39 },
      { dia: 'Sábado', cantidad: 18 }
    ]
  };

  const estadisticasRecetas: EstadisticasRecetas = {
    totalRecetas: 198,
    medicamentosRecetados: 456,
    recetasPorTipo: [
      { tipo: 'Normal', cantidad: 167 },
      { tipo: 'Controlada', cantidad: 23 },
      { tipo: 'Magistral', cantidad: 8 }
    ],
    medicamentosMasRecetados: [
      { medicamento: 'Paracetamol 500mg', cantidad: 67 },
      { medicamento: 'Ibuprofeno 400mg', cantidad: 45 },
      { medicamento: 'Amoxicilina 500mg', cantidad: 34 },
      { medicamento: 'Omeprazol 20mg', cantidad: 28 },
      { medicamento: 'Losartán 50mg', cantidad: 23 }
    ],
    diagnosticosFrecuentes: [
      { diagnostico: 'Hipertensión Arterial', cantidad: 34 },
      { diagnostico: 'Diabetes Mellitus Tipo 2', cantidad: 28 },
      { diagnostico: 'Infección Respiratoria', cantidad: 23 },
      { diagnostico: 'Gastritis', cantidad: 19 },
      { diagnostico: 'Cefalea Tensional', cantidad: 16 }
    ]
  };

  const estadisticasIngresos: EstadisticasIngresos = {
    ingresosTotales: 142500,
    ingresosMes: 18750,
    ingresoPromedioCita: 65,
    ingresosPorMes: [
      { mes: 'Enero', ingresos: 15200 },
      { mes: 'Febrero', ingresos: 16800 },
      { mes: 'Marzo', ingresos: 18200 },
      { mes: 'Abril', ingresos: 17500 },
      { mes: 'Mayo', ingresos: 19300 },
      { mes: 'Junio', ingresos: 18750 }
    ],
    ingresosPorTipo: [
      { tipo: 'Consulta General', ingresos: 78000 },
      { tipo: 'Consulta Control', ingresos: 44500 },
      { tipo: 'Consulta Emergencia', ingresos: 15000 },
      { tipo: 'Primera Consulta', ingresos: 5000 }
    ]
  };

  useEffect(() => {
    // Inicializar fechas por defecto
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    setFechaInicio(inicioMes.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
  }, []);

  const generarReporte = async (tipo: string) => {
    setLoading(true);
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nuevoReporte: ReporteData = {
        id: Date.now().toString(),
        tipo: tipo as ReporteData['tipo'],
        titulo: `Reporte de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
        fecha: new Date().toISOString().split('T')[0],
        periodo: `${fechaInicio} - ${fechaFin}`,
        datos: {},
        estado: 'generado'
      };

      setReportes([nuevoReporte, ...reportes]);
    } catch (error) {
      console.error('Error generando reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarReporte = (formato: 'pdf' | 'excel' | 'csv') => {
    // Simular exportación
    const contenido = generarContenidoReporte();
    
    if (formato === 'pdf') {
      imprimirReporte(contenido);
    } else {
      descargarArchivo(contenido, formato);
    }
  };

  const imprimirReporte = (contenido: string) => {
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reporte Médico - ${medicoNombre}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
            .stat-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${contenido}
        </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.focus();
      setTimeout(() => {
        ventanaImpresion.print();
      }, 500);
    }
  };

  const descargarArchivo = (contenido: string, formato: string) => {
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_medico_${new Date().toISOString().split('T')[0]}.${formato}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generarContenidoReporte = () => {
    const fecha = new Date().toLocaleDateString('es-ES');
    
    return `
      <div class="header">
        <h1>REPORTE MÉDICO INTEGRAL</h1>
        <p>Dr. ${medicoNombre}</p>
        <p>Fecha: ${fecha}</p>
        <p>Período: ${fechaInicio} - ${fechaFin}</p>
      </div>

      <div class="section">
        <h2>Resumen Estadístico</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Pacientes</h3>
            <p>Total: ${estadisticasPacientes.totalPacientes}</p>
            <p>Nuevos: ${estadisticasPacientes.pacientesNuevos}</p>
            <p>Activos: ${estadisticasPacientes.pacientesActivos}</p>
          </div>
          <div class="stat-card">
            <h3>Citas</h3>
            <p>Total: ${estadisticasCitas.totalCitas}</p>
            <p>Completadas: ${estadisticasCitas.citasCompletadas}</p>
            <p>Canceladas: ${estadisticasCitas.citasCanceladas}</p>
          </div>
          <div class="stat-card">
            <h3>Recetas</h3>
            <p>Total: ${estadisticasRecetas.totalRecetas}</p>
            <p>Medicamentos: ${estadisticasRecetas.medicamentosRecetados}</p>
          </div>
          <div class="stat-card">
            <h3>Ingresos</h3>
            <p>Total: $${estadisticasIngresos.ingresosTotales.toLocaleString()}</p>
            <p>Este mes: $${estadisticasIngresos.ingresosMes.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Medicamentos Más Recetados</h2>
        <table>
          <thead>
            <tr><th>Medicamento</th><th>Cantidad</th></tr>
          </thead>
          <tbody>
            ${estadisticasRecetas.medicamentosMasRecetados.map(med => 
              `<tr><td>${med.medicamento}</td><td>${med.cantidad}</td></tr>`
            ).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Diagnósticos Más Frecuentes</h2>
        <table>
          <thead>
            <tr><th>Diagnóstico</th><th>Frecuencia</th></tr>
          </thead>
          <tbody>
            ${estadisticasRecetas.diagnosticosFrecuentes.map(diag => 
              `<tr><td>${diag.diagnostico}</td><td>${diag.cantidad}</td></tr>`
            ).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(valor);
  };

  const calcularPorcentaje = (valor: number, total: number) => {
    return ((valor / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reportes Médicos</h1>
          <p className="text-slate-600 mt-1">Análisis estadístico y reportes de actividad médica</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => exportarReporte('pdf')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir</span>
          </Button>
          <Button
            onClick={() => exportarReporte('excel')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Filtros de Reporte</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Período</Label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mes</SelectItem>
                  <SelectItem value="trimestre">Este trimestre</SelectItem>
                  <SelectItem value="año">Este año</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Fecha Inicio</Label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Fecha Fin</Label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={() => generarReporte('general')}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Generando...' : 'Generar Reporte'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Reportes */}
      <Tabs value={reporteSeleccionado} onValueChange={setReporteSeleccionado}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
          <TabsTrigger value="citas">Citas</TabsTrigger>
          <TabsTrigger value="recetas">Recetas</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
        </TabsList>

        {/* Resumen General */}
        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Pacientes</p>
                    <p className="text-2xl font-bold text-blue-600">{estadisticasPacientes.totalPacientes}</p>
                    <p className="text-xs text-green-600">+{estadisticasPacientes.pacientesNuevos} nuevos</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Citas Completadas</p>
                    <p className="text-2xl font-bold text-green-600">{estadisticasCitas.citasCompletadas}</p>
                    <p className="text-xs text-slate-500">{calcularPorcentaje(estadisticasCitas.citasCompletadas, estadisticasCitas.totalCitas)}% del total</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Recetas Emitidas</p>
                    <p className="text-2xl font-bold text-purple-600">{estadisticasRecetas.totalRecetas}</p>
                    <p className="text-xs text-slate-500">{estadisticasRecetas.medicamentosRecetados} medicamentos</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Ingresos del Mes</p>
                    <p className="text-2xl font-bold text-orange-600">{formatearMoneda(estadisticasIngresos.ingresosMes)}</p>
                    <p className="text-xs text-slate-500">Promedio: {formatearMoneda(estadisticasIngresos.ingresoPromedioCita)}/cita</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos de Resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Citas por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Completadas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{estadisticasCitas.citasCompletadas}</span>
                      <Badge variant="secondary">{calcularPorcentaje(estadisticasCitas.citasCompletadas, estadisticasCitas.totalCitas)}%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Canceladas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{estadisticasCitas.citasCanceladas}</span>
                      <Badge variant="secondary">{calcularPorcentaje(estadisticasCitas.citasCanceladas, estadisticasCitas.totalCitas)}%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Pendientes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{estadisticasCitas.citasPendientes}</span>
                      <Badge variant="secondary">{calcularPorcentaje(estadisticasCitas.citasPendientes, estadisticasCitas.totalCitas)}%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medicamentos Más Recetados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estadisticasRecetas.medicamentosMasRecetados.slice(0, 5).map((med, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Pill className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{med.medicamento}</span>
                      </div>
                      <Badge variant="outline">{med.cantidad}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reporte de Pacientes */}
        <TabsContent value="pacientes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Estadísticas Generales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total de pacientes:</span>
                  <span className="font-medium">{estadisticasPacientes.totalPacientes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Pacientes nuevos:</span>
                  <span className="font-medium text-green-600">+{estadisticasPacientes.pacientesNuevos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Pacientes activos:</span>
                  <span className="font-medium">{estadisticasPacientes.pacientesActivos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Edad promedio:</span>
                  <span className="font-medium">{estadisticasPacientes.edadPromedio} años</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Género</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Femenino</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{estadisticasPacientes.distribucionGenero.femenino}</span>
                    <Badge variant="secondary">
                      {calcularPorcentaje(estadisticasPacientes.distribucionGenero.femenino, estadisticasPacientes.totalPacientes)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Masculino</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{estadisticasPacientes.distribucionGenero.masculino}</span>
                    <Badge variant="secondary">
                      {calcularPorcentaje(estadisticasPacientes.distribucionGenero.masculino, estadisticasPacientes.totalPacientes)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Edad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {estadisticasPacientes.distribucionEdad.map((grupo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{grupo.rango} años</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{grupo.cantidad}</span>
                      <Badge variant="outline" className="text-xs">
                        {calcularPorcentaje(grupo.cantidad, estadisticasPacientes.totalPacientes)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reporte de Citas */}
        <TabsContent value="citas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Citas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{estadisticasCitas.citasCompletadas}</p>
                    <p className="text-sm text-green-700">Completadas</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{estadisticasCitas.citasCanceladas}</p>
                    <p className="text-sm text-red-700">Canceladas</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Tiempo promedio:</span>
                    <span className="font-medium">{estadisticasCitas.tiempoPromedioConsulta} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Citas pendientes:</span>
                    <span className="font-medium text-yellow-600">{estadisticasCitas.citasPendientes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Citas por Tipo de Consulta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {estadisticasCitas.citasPorTipo.map((tipo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{tipo.tipo}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{tipo.cantidad}</span>
                      <Badge variant="secondary">
                        {calcularPorcentaje(tipo.cantidad, estadisticasCitas.totalCitas)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución Semanal de Citas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {estadisticasCitas.citasPorDia.map((dia, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dia.dia}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(dia.cantidad / Math.max(...estadisticasCitas.citasPorDia.map(d => d.cantidad))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-medium w-8 text-right">{dia.cantidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Recetas */}
        <TabsContent value="recetas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Medicamentos Más Recetados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estadisticasRecetas.medicamentosMasRecetados.map((med, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{med.medicamento}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(med.cantidad / estadisticasRecetas.medicamentosMasRecetados[0].cantidad) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium w-8 text-right">{med.cantidad}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diagnósticos Más Frecuentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estadisticasRecetas.diagnosticosFrecuentes.map((diag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{diag.diagnostico}</span>
                      </div>
                      <Badge variant="secondary">{diag.cantidad}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Recetas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {estadisticasRecetas.recetasPorTipo.map((tipo, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{tipo.cantidad}</p>
                    <p className="text-sm text-slate-600">{tipo.tipo}</p>
                    <p className="text-xs text-slate-500">
                      {calcularPorcentaje(tipo.cantidad, estadisticasRecetas.totalRecetas)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Ingresos */}
        <TabsContent value="ingresos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatearMoneda(estadisticasIngresos.ingresosTotales)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Este Mes</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatearMoneda(estadisticasIngresos.ingresosMes)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Promedio por Cita</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatearMoneda(estadisticasIngresos.ingresoPromedioCita)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Proyección Anual</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatearMoneda(estadisticasIngresos.ingresosMes * 12)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estadisticasIngresos.ingresosPorMes.map((mes, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{mes.mes}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(mes.ingresos / Math.max(...estadisticasIngresos.ingresosPorMes.map(m => m.ingresos))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-right w-20">
                          {formatearMoneda(mes.ingresos)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Tipo de Consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estadisticasIngresos.ingresosPorTipo.map((tipo, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{tipo.tipo}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatearMoneda(tipo.ingresos)}</span>
                        <Badge variant="secondary">
                          {calcularPorcentaje(tipo.ingresos, estadisticasIngresos.ingresosTotales)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Historial de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span>Historial de Reportes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportes.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No hay reportes generados</p>
              <p className="text-sm text-slate-500">Genera tu primer reporte usando los filtros superiores</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reportes.map((reporte) => (
                <div key={reporte.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{reporte.titulo}</p>
                      <p className="text-sm text-slate-500">
                        {reporte.fecha} • {reporte.periodo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={reporte.estado === 'generado' ? 'default' : 'secondary'}
                      className={reporte.estado === 'generado' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {reporte.estado}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}