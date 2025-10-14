import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, 
  Clock, 
  Mail, 
  FileText, 
  Settings,
  Play,
  Pause,
  Download,
  Eye,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react';

interface ReporteAutomatico {
  id: string;
  nombre: string;
  tipo: 'semanal' | 'mensual' | 'trimestral' | 'anual';
  frecuencia: string;
  destinatarios: string[];
  tipoReporte: 'pacientes' | 'citas' | 'recetas' | 'ingresos' | 'completo';
  activo: boolean;
  proximoEnvio: string;
  ultimoEnvio: string;
  estado: 'activo' | 'pausado' | 'error';
  configuracion: {
    incluirGraficos: boolean;
    formatoPDF: boolean;
    formatoExcel: boolean;
    incluirDetalles: boolean;
  };
}

interface HistorialEnvio {
  id: string;
  reporteId: string;
  fecha: string;
  destinatarios: string[];
  estado: 'enviado' | 'error' | 'pendiente';
  tamaño: string;
  tiempoGeneracion: number;
}

interface ReportesAutomaticosProps {
  medicoId: string;
  medicoNombre: string;
}

export default function ReportesAutomaticos({ medicoId, medicoNombre }: ReportesAutomaticosProps) {
  const [reportes, setReportes] = useState<ReporteAutomatico[]>([]);
  const [historial, setHistorial] = useState<HistorialEnvio[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reporteEditando, setReporteEditando] = useState<ReporteAutomatico | null>(null);
  const [loading, setLoading] = useState(false);

  // Datos simulados
  const reportesSimulados: ReporteAutomatico[] = [
    {
      id: '1',
      nombre: 'Reporte Mensual de Pacientes',
      tipo: 'mensual',
      frecuencia: 'Primer lunes de cada mes',
      destinatarios: ['director@clinica.com', 'admin@clinica.com'],
      tipoReporte: 'pacientes',
      activo: true,
      proximoEnvio: '2024-02-05T09:00:00Z',
      ultimoEnvio: '2024-01-01T09:00:00Z',
      estado: 'activo',
      configuracion: {
        incluirGraficos: true,
        formatoPDF: true,
        formatoExcel: false,
        incluirDetalles: true
      }
    },
    {
      id: '2',
      nombre: 'Resumen Semanal de Citas',
      tipo: 'semanal',
      frecuencia: 'Todos los viernes a las 17:00',
      destinatarios: ['secretaria@clinica.com'],
      tipoReporte: 'citas',
      activo: true,
      proximoEnvio: '2024-01-19T17:00:00Z',
      ultimoEnvio: '2024-01-12T17:00:00Z',
      estado: 'activo',
      configuracion: {
        incluirGraficos: false,
        formatoPDF: true,
        formatoExcel: true,
        incluirDetalles: false
      }
    },
    {
      id: '3',
      nombre: 'Análisis Trimestral de Ingresos',
      tipo: 'trimestral',
      frecuencia: 'Último día del trimestre',
      destinatarios: ['contabilidad@clinica.com', 'gerencia@clinica.com'],
      tipoReporte: 'ingresos',
      activo: false,
      proximoEnvio: '2024-03-31T23:59:00Z',
      ultimoEnvio: '2023-12-31T23:59:00Z',
      estado: 'pausado',
      configuracion: {
        incluirGraficos: true,
        formatoPDF: true,
        formatoExcel: true,
        incluirDetalles: true
      }
    }
  ];

  const historialSimulado: HistorialEnvio[] = [
    {
      id: '1',
      reporteId: '1',
      fecha: '2024-01-01T09:00:00Z',
      destinatarios: ['director@clinica.com', 'admin@clinica.com'],
      estado: 'enviado',
      tamaño: '2.4 MB',
      tiempoGeneracion: 45
    },
    {
      id: '2',
      reporteId: '2',
      fecha: '2024-01-12T17:00:00Z',
      destinatarios: ['secretaria@clinica.com'],
      estado: 'enviado',
      tamaño: '1.2 MB',
      tiempoGeneracion: 23
    },
    {
      id: '3',
      reporteId: '1',
      fecha: '2023-12-01T09:00:00Z',
      destinatarios: ['director@clinica.com'],
      estado: 'error',
      tamaño: '0 MB',
      tiempoGeneracion: 0
    }
  ];

  useEffect(() => {
    setReportes(reportesSimulados);
    setHistorial(historialSimulado);
  }, []);

  const crearReporte = () => {
    const nuevoReporte: ReporteAutomatico = {
      id: Date.now().toString(),
      nombre: 'Nuevo Reporte',
      tipo: 'mensual',
      frecuencia: 'Primer día del mes',
      destinatarios: [],
      tipoReporte: 'completo',
      activo: false,
      proximoEnvio: new Date().toISOString(),
      ultimoEnvio: '',
      estado: 'pausado',
      configuracion: {
        incluirGraficos: true,
        formatoPDF: true,
        formatoExcel: false,
        incluirDetalles: true
      }
    };
    setReporteEditando(nuevoReporte);
    setMostrarFormulario(true);
  };

  const editarReporte = (reporte: ReporteAutomatico) => {
    setReporteEditando({ ...reporte });
    setMostrarFormulario(true);
  };

  const guardarReporte = () => {
    if (!reporteEditando) return;

    if (reportes.find(r => r.id === reporteEditando.id)) {
      // Actualizar existente
      setReportes(prev => prev.map(r => r.id === reporteEditando.id ? reporteEditando : r));
    } else {
      // Crear nuevo
      setReportes(prev => [...prev, reporteEditando]);
    }

    setMostrarFormulario(false);
    setReporteEditando(null);
  };

  const eliminarReporte = (id: string) => {
    setReportes(prev => prev.filter(r => r.id !== id));
  };

  const toggleReporte = (id: string) => {
    setReportes(prev => prev.map(r => 
      r.id === id 
        ? { ...r, activo: !r.activo, estado: !r.activo ? 'activo' : 'pausado' }
        : r
    ));
  };

  const enviarReporteManual = async (id: string) => {
    setLoading(true);
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reporte = reportes.find(r => r.id === id);
      if (reporte) {
        const nuevoEnvio: HistorialEnvio = {
          id: Date.now().toString(),
          reporteId: id,
          fecha: new Date().toISOString(),
          destinatarios: reporte.destinatarios,
          estado: 'enviado',
          tamaño: '1.8 MB',
          tiempoGeneracion: 32
        };
        setHistorial(prev => [nuevoEnvio, ...prev]);
      }
    } catch (error) {
      console.error('Error enviando reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoEnvioColor = (estado: string) => {
    switch (estado) {
      case 'enviado': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reportes Automáticos</h1>
          <p className="text-slate-600 mt-1">Configura y gestiona el envío automático de reportes</p>
        </div>
        <Button onClick={crearReporte}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Reporte
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Reportes Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {reportes.filter(r => r.activo).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Reportes Pausados</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reportes.filter(r => !r.activo).length}
                </p>
              </div>
              <Pause className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Envíos Este Mes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {historial.filter(h => new Date(h.fecha).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((historial.filter(h => h.estado === 'enviado').length / historial.length) * 100)}%
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Reportes Configurados</span>
          </CardTitle>
          <CardDescription>
            Gestiona tus reportes automáticos programados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No hay reportes configurados</p>
              <Button onClick={crearReporte} className="mt-4">
                Crear primer reporte
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reportes.map((reporte) => (
                <div key={reporte.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={reporte.activo}
                        onCheckedChange={() => toggleReporte(reporte.id)}
                      />
                      <div>
                        <h4 className="font-medium text-slate-900">{reporte.nombre}</h4>
                        <p className="text-sm text-slate-600">{reporte.frecuencia}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getEstadoColor(reporte.estado)}>
                            {reporte.estado}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {reporte.tipoReporte}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {reporte.destinatarios.length} destinatario{reporte.destinatarios.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <p className="text-slate-600">Próximo envío:</p>
                        <p className="font-medium">{formatearFecha(reporte.proximoEnvio)}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => enviarReporteManual(reporte.id)}
                        disabled={loading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editarReporte(reporte)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => eliminarReporte(reporte.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de envíos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>Historial de Envíos</span>
          </CardTitle>
          <CardDescription>
            Registro de todos los reportes enviados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Reporte</TableHead>
                <TableHead>Destinatarios</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historial.map((envio) => {
                const reporte = reportes.find(r => r.id === envio.reporteId);
                return (
                  <TableRow key={envio.id}>
                    <TableCell>{formatearFecha(envio.fecha)}</TableCell>
                    <TableCell>{reporte?.nombre || 'Reporte eliminado'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{envio.destinatarios.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoEnvioColor(envio.estado)}>
                        {envio.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{envio.tamaño}</TableCell>
                    <TableCell>{envio.tiempoGeneracion}s</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de formulario */}
      {mostrarFormulario && reporteEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {reportes.find(r => r.id === reporteEditando.id) ? 'Editar' : 'Crear'} Reporte
              </h2>
              <Button
                variant="ghost"
                onClick={() => setMostrarFormulario(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del reporte</Label>
                <Input
                  id="nombre"
                  value={reporteEditando.nombre}
                  onChange={(e) => setReporteEditando({
                    ...reporteEditando,
                    nombre: e.target.value
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de reporte</Label>
                  <Select
                    value={reporteEditando.tipoReporte}
                    onValueChange={(value: 'pacientes' | 'citas' | 'recetas' | 'ingresos' | 'completo') => setReporteEditando({
                      ...reporteEditando,
                      tipoReporte: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pacientes">Pacientes</SelectItem>
                      <SelectItem value="citas">Citas</SelectItem>
                      <SelectItem value="recetas">Recetas</SelectItem>
                      <SelectItem value="ingresos">Ingresos</SelectItem>
                      <SelectItem value="completo">Completo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Frecuencia</Label>
                  <Select
                    value={reporteEditando.tipo}
                    onValueChange={(value: 'semanal' | 'mensual' | 'trimestral' | 'anual') => setReporteEditando({
                      ...reporteEditando,
                      tipo: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="destinatarios">Destinatarios (separados por coma)</Label>
                <Input
                  id="destinatarios"
                  value={reporteEditando.destinatarios.join(', ')}
                  onChange={(e) => setReporteEditando({
                    ...reporteEditando,
                    destinatarios: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  })}
                  placeholder="email1@ejemplo.com, email2@ejemplo.com"
                />
              </div>

              <div>
                <Label>Configuración</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="incluir-graficos">Incluir gráficos</Label>
                    <Switch
                      id="incluir-graficos"
                      checked={reporteEditando.configuracion.incluirGraficos}
                      onCheckedChange={(checked) => setReporteEditando({
                        ...reporteEditando,
                        configuracion: {
                          ...reporteEditando.configuracion,
                          incluirGraficos: checked
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="formato-pdf">Formato PDF</Label>
                    <Switch
                      id="formato-pdf"
                      checked={reporteEditando.configuracion.formatoPDF}
                      onCheckedChange={(checked) => setReporteEditando({
                        ...reporteEditando,
                        configuracion: {
                          ...reporteEditando.configuracion,
                          formatoPDF: checked
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="formato-excel">Formato Excel</Label>
                    <Switch
                      id="formato-excel"
                      checked={reporteEditando.configuracion.formatoExcel}
                      onCheckedChange={(checked) => setReporteEditando({
                        ...reporteEditando,
                        configuracion: {
                          ...reporteEditando.configuracion,
                          formatoExcel: checked
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="incluir-detalles">Incluir detalles</Label>
                    <Switch
                      id="incluir-detalles"
                      checked={reporteEditando.configuracion.incluirDetalles}
                      onCheckedChange={(checked) => setReporteEditando({
                        ...reporteEditando,
                        configuracion: {
                          ...reporteEditando.configuracion,
                          incluirDetalles: checked
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </Button>
              <Button onClick={guardarReporte}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}