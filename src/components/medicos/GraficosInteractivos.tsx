import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity,
  Users,
  Calendar,
  DollarSign,
  Pill,
  Download,
  Maximize2,
  RefreshCw
} from 'lucide-react';

interface DatosGrafico {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface GraficosInteractivosProps {
  medicoId: string;
  medicoNombre: string;
}

export default function GraficosInteractivos({ medicoId, medicoNombre }: GraficosInteractivosProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');
  const [tipoGrafico, setTipoGrafico] = useState('barras');
  const [loading, setLoading] = useState(false);

  // Datos simulados para gráficos
  const datosSimulados = {
    pacientesPorEdad: {
      labels: ['0-18', '19-35', '36-50', '51-65', '65+'],
      datasets: [{
        label: 'Pacientes',
        data: [12, 45, 52, 38, 9],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderWidth: 2
      }]
    },
    citasPorMes: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Citas Completadas',
        data: [42, 38, 45, 41, 39, 48],
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2
      }, {
        label: 'Citas Canceladas',
        data: [5, 8, 3, 6, 4, 7],
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 2
      }]
    },
    ingresosPorTipo: {
      labels: ['Consulta General', 'Control', 'Emergencia', 'Primera Vez'],
      datasets: [{
        label: 'Ingresos ($)',
        data: [78000, 44500, 15000, 5000],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
        borderWidth: 2
      }]
    },
    medicamentosMasRecetados: {
      labels: ['Paracetamol', 'Ibuprofeno', 'Amoxicilina', 'Omeprazol', 'Losartán'],
      datasets: [{
        label: 'Frecuencia',
        data: [67, 45, 34, 28, 23],
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 2
      }]
    },
    diagnosticosFrecuentes: {
      labels: ['Hipertensión', 'Diabetes T2', 'Gastritis', 'Migraña', 'Ansiedad'],
      datasets: [{
        label: 'Casos',
        data: [34, 28, 23, 19, 16],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
        borderWidth: 2
      }]
    },
    tendenciaConsultas: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
      datasets: [{
        label: 'Consultas',
        data: [28, 32, 25, 38, 42, 45],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        borderWidth: 3,
        fill: true
      }]
    }
  };

  const actualizarDatos = async () => {
    setLoading(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const exportarGrafico = (nombreGrafico: string) => {
    // Simular exportación
    console.log(`Exportando gráfico: ${nombreGrafico}`);
  };

  const GraficoBarras = ({ datos, titulo, altura = 300 }: { datos: DatosGrafico; titulo: string; altura?: number }) => (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-slate-900">{titulo}</h3>
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost" onClick={() => exportarGrafico(titulo)}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div style={{ height: altura }} className="bg-slate-50 rounded-lg p-4 flex items-end justify-around">
        {datos.labels.map((label, index) => {
          const valor = datos.datasets[0].data[index];
          const maxValor = Math.max(...datos.datasets[0].data);
          const alturaRelativa = (valor / maxValor) * (altura - 80);
          const color = Array.isArray(datos.datasets[0].backgroundColor) 
            ? datos.datasets[0].backgroundColor[index] 
            : datos.datasets[0].backgroundColor || '#3B82F6';
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="text-xs font-medium text-slate-600">{valor}</div>
              <div
                className="w-8 rounded-t transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${alturaRelativa}px`,
                  backgroundColor: color,
                  minHeight: '20px'
                }}
              />
              <div className="text-xs text-slate-500 text-center max-w-16 leading-tight">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const GraficoLinea = ({ datos, titulo, altura = 300 }: { datos: DatosGrafico; titulo: string; altura?: number }) => (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-slate-900">{titulo}</h3>
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost" onClick={() => exportarGrafico(titulo)}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div style={{ height: altura }} className="bg-slate-50 rounded-lg p-4 relative">
        <svg width="100%" height="100%" className="absolute inset-0 p-4">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          {/* Líneas de cuadrícula */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="40"
              y1={40 + (y * (altura - 80) / 100)}
              x2="100%"
              y2={40 + (y * (altura - 80) / 100)}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          ))}
          
          {/* Línea de datos */}
          <polyline
            fill="url(#gradient)"
            stroke="#3B82F6"
            strokeWidth="3"
            points={datos.labels.map((_, index) => {
              const x = 40 + (index * (100 - 40) / (datos.labels.length - 1));
              const maxValor = Math.max(...datos.datasets[0].data);
              const y = altura - 40 - (datos.datasets[0].data[index] / maxValor) * (altura - 80);
              return `${x}%,${y}`;
            }).join(' ')}
          />
          
          {/* Puntos de datos */}
          {datos.labels.map((_, index) => {
            const x = 40 + (index * (100 - 40) / (datos.labels.length - 1));
            const maxValor = Math.max(...datos.datasets[0].data);
            const y = altura - 40 - (datos.datasets[0].data[index] / maxValor) * (altura - 80);
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={y}
                r="4"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all cursor-pointer"
              />
            );
          })}
        </svg>
        
        {/* Etiquetas del eje X */}
        <div className="absolute bottom-2 left-10 right-4 flex justify-between">
          {datos.labels.map((label, index) => (
            <span key={index} className="text-xs text-slate-500">{label}</span>
          ))}
        </div>
        
        {/* Etiquetas del eje Y */}
        <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between">
          {[Math.max(...datos.datasets[0].data), Math.max(...datos.datasets[0].data) * 0.75, Math.max(...datos.datasets[0].data) * 0.5, Math.max(...datos.datasets[0].data) * 0.25, 0].map((valor, index) => (
            <span key={index} className="text-xs text-slate-500">{Math.round(valor)}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const GraficoPastel = ({ datos, titulo }: { datos: DatosGrafico; titulo: string }) => {
    const total = datos.datasets[0].data.reduce((sum, val) => sum + val, 0);
    let acumulado = 0;

    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-slate-900">{titulo}</h3>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={() => exportarGrafico(titulo)}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {datos.labels.map((label, index) => {
                const valor = datos.datasets[0].data[index];
                const porcentaje = (valor / total) * 100;
                const angulo = (porcentaje / 100) * 360;
                const anguloInicio = (acumulado / total) * 360;
                
                const color = Array.isArray(datos.datasets[0].backgroundColor) 
                  ? datos.datasets[0].backgroundColor[index] 
                  : datos.datasets[0].backgroundColor || '#3B82F6';
                
                const radio = 80;
                const centroX = 100;
                const centroY = 100;
                
                const x1 = centroX + radio * Math.cos((anguloInicio * Math.PI) / 180);
                const y1 = centroY + radio * Math.sin((anguloInicio * Math.PI) / 180);
                const x2 = centroX + radio * Math.cos(((anguloInicio + angulo) * Math.PI) / 180);
                const y2 = centroY + radio * Math.sin(((anguloInicio + angulo) * Math.PI) / 180);
                
                const largeArcFlag = angulo > 180 ? 1 : 0;
                
                const pathData = [
                  `M ${centroX} ${centroY}`,
                  `L ${x1} ${y1}`,
                  `A ${radio} ${radio} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                acumulado += valor;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>
          <div className="ml-6 space-y-2">
            {datos.labels.map((label, index) => {
              const valor = datos.datasets[0].data[index];
              const porcentaje = ((valor / total) * 100).toFixed(1);
              const color = Array.isArray(datos.datasets[0].backgroundColor) 
                ? datos.datasets[0].backgroundColor[index] 
                : datos.datasets[0].backgroundColor || '#3B82F6';
              
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className="text-sm font-medium text-slate-900">
                    {valor} ({porcentaje}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gráficos Interactivos</h1>
          <p className="text-slate-600 mt-1">Visualización avanzada de datos médicos</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta semana</SelectItem>
              <SelectItem value="mes">Este mes</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="año">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={actualizarDatos} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Pacientes</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
                <p className="text-xs text-green-600">+12% vs mes anterior</p>
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
                <p className="text-2xl font-bold text-green-600">241</p>
                <p className="text-xs text-green-600">+8% vs mes anterior</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ingresos</p>
                <p className="text-2xl font-bold text-purple-600">$18,750</p>
                <p className="text-xs text-green-600">+15% vs mes anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Recetas Emitidas</p>
                <p className="text-2xl font-bold text-orange-600">198</p>
                <p className="text-xs text-green-600">+5% vs mes anterior</p>
              </div>
              <Pill className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
          <TabsTrigger value="citas">Citas</TabsTrigger>
          <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <GraficoLinea 
                  datos={datosSimulados.tendenciaConsultas} 
                  titulo="Tendencia de Consultas"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <GraficoPastel 
                  datos={datosSimulados.ingresosPorTipo} 
                  titulo="Ingresos por Tipo de Consulta"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <GraficoBarras 
                  datos={datosSimulados.citasPorMes} 
                  titulo="Citas por Mes"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <GraficoBarras 
                  datos={datosSimulados.diagnosticosFrecuentes} 
                  titulo="Diagnósticos Más Frecuentes"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pacientes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <GraficoPastel 
                  datos={datosSimulados.pacientesPorEdad} 
                  titulo="Distribución de Pacientes por Edad"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <GraficoBarras 
                  datos={datosSimulados.diagnosticosFrecuentes} 
                  titulo="Diagnósticos Más Comunes"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="citas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <GraficoBarras 
                  datos={datosSimulados.citasPorMes} 
                  titulo="Citas Completadas vs Canceladas"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <GraficoLinea 
                  datos={datosSimulados.tendenciaConsultas} 
                  titulo="Tendencia Semanal de Consultas"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medicamentos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <GraficoBarras 
                  datos={datosSimulados.medicamentosMasRecetados} 
                  titulo="Medicamentos Más Recetados"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <GraficoPastel 
                  datos={datosSimulados.diagnosticosFrecuentes} 
                  titulo="Distribución de Diagnósticos"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}