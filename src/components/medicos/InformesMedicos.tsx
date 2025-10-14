import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, BarChart3, PieChart, Users, Activity, Stethoscope, TestTube, Pill, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { mockPacientes, mockMedicos } from '@/data/mockData';
import { Paciente, Medico } from '@/types/medical';

interface InformesMedicosProps {
  pacienteSeleccionado?: Paciente | null;
  medicoLogueado?: Medico | null;
}

// Tipos específicos para los datos de gráficos
interface SignosVitales {
  fecha: string;
  presionSistolica: number;
  presionDiastolica: number;
  frecuenciaCardiaca: number;
  temperatura: number;
  peso: number;
}

interface DatosExamen {
  tipo: string;
  cantidad: number;
  porcentaje: number;
}

interface DatosDiagnostico {
  diagnostico: string;
  cantidad: number;
  porcentaje: number;
}

interface ConsultasMensuales {
  mes: string;
  consultas: number;
  nuevos: number;
  seguimiento: number;
}

interface InformeDetallado {
  id: string;
  tipo: string;
  paciente: Paciente | null;
  fechaInicio: string;
  fechaFin: string;
  fechaGeneracion: string;
  medico: Medico | null;
  datos: {
    signosVitales: SignosVitales[];
    examenes: DatosExamen[];
    diagnosticos: DatosDiagnostico[];
    consultasMensuales: ConsultasMensuales[];
  };
}

// Datos simulados para gráficos
const datosSignosVitales: SignosVitales[] = [
  { fecha: '2024-01-01', presionSistolica: 120, presionDiastolica: 80, frecuenciaCardiaca: 72, temperatura: 36.5, peso: 70 },
  { fecha: '2024-01-15', presionSistolica: 125, presionDiastolica: 82, frecuenciaCardiaca: 75, temperatura: 36.7, peso: 69.5 },
  { fecha: '2024-02-01', presionSistolica: 118, presionDiastolica: 78, frecuenciaCardiaca: 70, temperatura: 36.4, peso: 69 },
  { fecha: '2024-02-15', presionSistolica: 122, presionDiastolica: 79, frecuenciaCardiaca: 73, temperatura: 36.6, peso: 68.5 },
  { fecha: '2024-03-01', presionSistolica: 115, presionDiastolica: 75, frecuenciaCardiaca: 68, temperatura: 36.3, peso: 68 }
];

const datosExamenes: DatosExamen[] = [
  { tipo: 'Laboratorio', cantidad: 45, porcentaje: 60 },
  { tipo: 'Imágenes', cantidad: 20, porcentaje: 27 },
  { tipo: 'Funcional', cantidad: 10, porcentaje: 13 }
];

const datosDiagnosticos: DatosDiagnostico[] = [
  { diagnostico: 'Hipertensión', cantidad: 15, porcentaje: 25 },
  { diagnostico: 'Diabetes', cantidad: 12, porcentaje: 20 },
  { diagnostico: 'Infecciones respiratorias', cantidad: 10, porcentaje: 17 },
  { diagnostico: 'Gastritis', cantidad: 8, porcentaje: 13 },
  { diagnostico: 'Otros', cantidad: 15, porcentaje: 25 }
];

const datosConsultasMensuales: ConsultasMensuales[] = [
  { mes: 'Ene', consultas: 45, nuevos: 12, seguimiento: 33 },
  { mes: 'Feb', consultas: 52, nuevos: 15, seguimiento: 37 },
  { mes: 'Mar', consultas: 48, nuevos: 10, seguimiento: 38 },
  { mes: 'Abr', consultas: 55, nuevos: 18, seguimiento: 37 },
  { mes: 'May', consultas: 60, nuevos: 20, seguimiento: 40 }
];

const InformesMedicosComponent: React.FC<InformesMedicosProps> = ({ 
  pacienteSeleccionado, 
  medicoLogueado 
}) => {
  const [pacientes] = useState<Paciente[]>(mockPacientes);
  const [medicos] = useState<Medico[]>(mockMedicos);
  const [loading, setLoading] = useState(true);
  const [tipoInforme, setTipoInforme] = useState('individual');
  const [pacienteInforme, setPacienteInforme] = useState(pacienteSeleccionado?.id || '');
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-05-31');
  const [showInformeDetallado, setShowInformeDetallado] = useState(false);
  const [informeSeleccionado, setInformeSeleccionado] = useState<InformeDetallado | null>(null);

  // Médico por defecto si no se pasa uno
  const medicoActual = medicoLogueado || medicos[0];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const obtenerPaciente = (id: string) => pacientes.find(p => p.id === id);

  const generarInforme = () => {
    const paciente = obtenerPaciente(pacienteInforme);
    console.log('Generando informe:', {
      tipo: tipoInforme,
      paciente: paciente?.nombre + ' ' + paciente?.apellido,
      fechaInicio,
      fechaFin
    });
    
    const informe: InformeDetallado = {
      id: Date.now().toString(),
      tipo: tipoInforme,
      paciente: paciente || null,
      fechaInicio,
      fechaFin,
      fechaGeneracion: new Date().toISOString().split('T')[0],
      medico: medicoActual,
      datos: {
        signosVitales: datosSignosVitales,
        examenes: datosExamenes,
        diagnosticos: datosDiagnosticos,
        consultasMensuales: datosConsultasMensuales
      }
    };
    
    setInformeSeleccionado(informe);
    setShowInformeDetallado(true);
  };

  const exportarInformePDF = (informe: InformeDetallado) => {
    console.log('Exportando informe a PDF:', informe);
    alert('Informe médico exportado a PDF (simulación)');
  };

  // Componente de gráfico simple (simulado)
  const GraficoLineas = ({ datos, titulo, campo }: { datos: SignosVitales[] | ConsultasMensuales[], titulo: string, campo: string }) => (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-4">{titulo}</h4>
      <div className="h-48 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-end justify-around p-4">
        {datos.map((item, index) => {
          const valor = (item as SignosVitales | ConsultasMensuales)[campo as keyof (SignosVitales | ConsultasMensuales)] as number;
          const maxValor = Math.max(...datos.map(d => (d as SignosVitales | ConsultasMensuales)[campo as keyof (SignosVitales | ConsultasMensuales)] as number));
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="bg-blue-500 rounded-t w-8 mb-2"
                style={{ height: `${(valor / maxValor) * 120}px` }}
              />
              <div className="text-xs text-gray-600 transform rotate-45 origin-left">
                {(item as SignosVitales).fecha?.split('-')[1] || (item as ConsultasMensuales).mes}
              </div>
              <div className="text-xs font-medium mt-1">{valor}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const GraficoBarras = ({ datos, titulo }: { datos: DatosExamen[] | DatosDiagnostico[], titulo: string }) => (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-4">{titulo}</h4>
      <div className="space-y-3">
        {datos.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm text-gray-600">
              {(item as DatosExamen).tipo || (item as DatosDiagnostico).diagnostico}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${item.porcentaje}%` }}
              >
                <span className="text-white text-xs font-medium">{item.cantidad}</span>
              </div>
            </div>
            <div className="w-12 text-sm text-gray-600">{item.porcentaje}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  const GraficoCircular = ({ datos, titulo }: { datos: DatosDiagnostico[], titulo: string }) => {
    const colores = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
    
    return (
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-4">{titulo}</h4>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-green-400"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">{datos.reduce((sum, item) => sum + item.cantidad, 0)}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </div>
          <div className="ml-6 space-y-2">
            {datos.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colores[index % colores.length] }}
                />
                <div className="text-sm">
                  {item.diagnostico}: {item.cantidad} ({item.porcentaje}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando informes médicos..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Informes Médicos</h1>
          <p className="text-gray-600">
            Visualización de resultados y análisis estadísticos
          </p>
        </div>
      </div>

      {/* Configuración de informe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Generar Informe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="tipoInforme">Tipo de informe</Label>
              <Select value={tipoInforme} onValueChange={setTipoInforme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual de Paciente</SelectItem>
                  <SelectItem value="seguimiento">Seguimiento de Tratamiento</SelectItem>
                  <SelectItem value="estadistico">Estadístico General</SelectItem>
                  <SelectItem value="examenes">Resultados de Exámenes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipoInforme === 'individual' && (
              <div>
                <Label htmlFor="paciente">Paciente</Label>
                {pacienteSeleccionado ? (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
                    {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                  </div>
                ) : (
                  <Select value={pacienteInforme} onValueChange={setPacienteInforme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientes.map(paciente => (
                        <SelectItem key={paciente.id} value={paciente.id}>
                          {paciente.nombre} {paciente.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="fechaInicio">Fecha inicio</Label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fechaFin">Fecha fin</Label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={generarInforme} className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generar Informe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumen estadístico rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">248</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultas</p>
                <p className="text-2xl font-bold text-gray-900">1,245</p>
              </div>
              <Stethoscope className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+8% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exámenes</p>
                <p className="text-2xl font-bold text-gray-900">756</p>
              </div>
              <TestTube className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+15% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medicamentos</p>
                <p className="text-2xl font-bold text-gray-900">2,134</p>
              </div>
              <Pill className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+5% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de vista previa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoLineas 
          datos={datosSignosVitales} 
          titulo="Evolución Presión Arterial" 
          campo="presionSistolica" 
        />
        <GraficoBarras 
          datos={datosExamenes} 
          titulo="Distribución de Exámenes" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoCircular 
          datos={datosDiagnosticos} 
          titulo="Diagnósticos Más Frecuentes" 
        />
        <GraficoLineas 
          datos={datosConsultasMensuales} 
          titulo="Consultas Mensuales" 
          campo="consultas" 
        />
      </div>

      {/* Informes recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Informes Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: '1',
                tipo: 'Individual de Paciente',
                paciente: 'María González',
                fecha: '2024-05-15',
                medico: 'Dr. Carlos Rodríguez'
              },
              {
                id: '2',
                tipo: 'Estadístico General',
                paciente: 'Todos los pacientes',
                fecha: '2024-05-10',
                medico: 'Dr. Ana Martínez'
              },
              {
                id: '3',
                tipo: 'Seguimiento de Tratamiento',
                paciente: 'Juan Pérez',
                fecha: '2024-05-08',
                medico: 'Dr. Carlos Rodríguez'
              }
            ].map((informe) => (
              <div key={informe.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{informe.tipo}</div>
                      <div className="text-sm text-gray-600">
                        {informe.paciente} • {informe.medico} • {new Date(informe.fecha).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de informe detallado */}
      <Dialog open={showInformeDetallado} onOpenChange={setShowInformeDetallado}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {informeSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Informe Médico - {informeSeleccionado.tipo}
                  {informeSeleccionado.paciente && (
                    <span className="text-sm font-normal text-gray-600 block mt-1">
                      Paciente: {informeSeleccionado.paciente.nombre} {informeSeleccionado.paciente.apellido}
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="graficos" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="graficos">Gráficos</TabsTrigger>
                  <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
                  <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
                  <TabsTrigger value="resumen">Resumen</TabsTrigger>
                </TabsList>
                
                <TabsContent value="graficos" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GraficoLineas 
                      datos={informeSeleccionado.datos.signosVitales} 
                      titulo="Presión Arterial Sistólica" 
                      campo="presionSistolica" 
                    />
                    <GraficoLineas 
                      datos={informeSeleccionado.datos.signosVitales} 
                      titulo="Frecuencia Cardíaca" 
                      campo="frecuenciaCardiaca" 
                    />
                    <GraficoLineas 
                      datos={informeSeleccionado.datos.signosVitales} 
                      titulo="Peso Corporal" 
                      campo="peso" 
                    />
                    <GraficoLineas 
                      datos={informeSeleccionado.datos.signosVitales} 
                      titulo="Temperatura" 
                      campo="temperatura" 
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="estadisticas" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GraficoBarras 
                      datos={informeSeleccionado.datos.examenes} 
                      titulo="Distribución de Exámenes" 
                    />
                    <GraficoCircular 
                      datos={informeSeleccionado.datos.diagnosticos} 
                      titulo="Diagnósticos por Frecuencia" 
                    />
                  </div>
                  
                  {/* Tabla de estadísticas */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas Detalladas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Parámetro</th>
                              <th className="text-left p-2">Promedio</th>
                              <th className="text-left p-2">Mínimo</th>
                              <th className="text-left p-2">Máximo</th>
                              <th className="text-left p-2">Tendencia</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2">Presión Sistólica</td>
                              <td className="p-2">120 mmHg</td>
                              <td className="p-2">115 mmHg</td>
                              <td className="p-2">125 mmHg</td>
                              <td className="p-2">
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Mejorando
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Frecuencia Cardíaca</td>
                              <td className="p-2">72 lpm</td>
                              <td className="p-2">68 lpm</td>
                              <td className="p-2">75 lpm</td>
                              <td className="p-2">
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  Estable
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Peso</td>
                              <td className="p-2">69.0 kg</td>
                              <td className="p-2">68.0 kg</td>
                              <td className="p-2">70.0 kg</td>
                              <td className="p-2">
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Reduciendo
                                </Badge>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tendencias" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <GraficoLineas 
                      datos={informeSeleccionado.datos.consultasMensuales} 
                      titulo="Evolución de Consultas Mensuales" 
                      campo="consultas" 
                    />
                  </div>
                  
                  {/* Análisis de tendencias */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Análisis de Tendencias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h4 className="font-medium text-green-900">Tendencias Positivas</h4>
                          </div>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Reducción progresiva de la presión arterial</li>
                            <li>• Pérdida de peso constante y saludable</li>
                            <li>• Mejora en la frecuencia cardíaca en reposo</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <h4 className="font-medium text-blue-900">Parámetros Estables</h4>
                          </div>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Temperatura corporal dentro de rangos normales</li>
                            <li>• Adherencia al tratamiento farmacológico</li>
                            <li>• Asistencia regular a consultas de seguimiento</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="resumen" className="space-y-6">
                  {/* Información del informe */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Información del Informe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Datos del Paciente</h4>
                          {informeSeleccionado.paciente && (
                            <div className="text-sm space-y-1">
                              <div><strong>Nombre:</strong> {informeSeleccionado.paciente.nombre} {informeSeleccionado.paciente.apellido}</div>
                              <div><strong>Cédula:</strong> {informeSeleccionado.paciente.cedula}</div>
                              <div><strong>Fecha de nacimiento:</strong> {informeSeleccionado.paciente.fechaNacimiento}</div>
                              <div><strong>Tipo de sangre:</strong> {informeSeleccionado.paciente.tipoSangre}</div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Datos del Informe</h4>
                          <div className="text-sm space-y-1">
                            <div><strong>Tipo:</strong> {informeSeleccionado.tipo}</div>
                            <div><strong>Período:</strong> {informeSeleccionado.fechaInicio} - {informeSeleccionado.fechaFin}</div>
                            <div><strong>Generado por:</strong> Dr. {informeSeleccionado.medico?.nombre} {informeSeleccionado.medico?.apellido}</div>
                            <div><strong>Fecha de generación:</strong> {new Date(informeSeleccionado.fechaGeneracion).toLocaleDateString('es-ES')}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Resumen ejecutivo */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumen Ejecutivo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-sm text-gray-700 mb-4">
                          El presente informe analiza la evolución clínica del paciente durante el período comprendido 
                          entre {informeSeleccionado.fechaInicio} y {informeSeleccionado.fechaFin}.
                        </p>
                        
                        <h5 className="font-semibold mb-2">Hallazgos Principales:</h5>
                        <ul className="text-sm text-gray-700 space-y-1 mb-4">
                          <li>• Mejora significativa en el control de la presión arterial</li>
                          <li>• Reducción progresiva del peso corporal</li>
                          <li>• Estabilización de la frecuencia cardíaca</li>
                          <li>• Buena adherencia al tratamiento prescrito</li>
                        </ul>
                        
                        <h5 className="font-semibold mb-2">Recomendaciones:</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Continuar con el tratamiento antihipertensivo actual</li>
                          <li>• Mantener programa de ejercicio físico regular</li>
                          <li>• Control médico cada 3 meses</li>
                          <li>• Monitoreo domiciliario de presión arterial</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => exportarInformePDF(informeSeleccionado)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InformesMedicosComponent;