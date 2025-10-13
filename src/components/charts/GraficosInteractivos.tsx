import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Activity, Download, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockDatosCitas, mockDatosIngresos, mockDatosEspecialidades } from '@/data/mockData';
import { DatoGrafico, TooltipProps } from '@/types/medical';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface MetricaCard {
  titulo: string;
  valor: string;
  cambio: string;
  tendencia: 'up' | 'down' | 'neutral';
  icono: React.ReactNode;
  color: string;
}

interface DatosCitas extends DatoGrafico {
  mes: string;
  citas: number;
  completadas: number;
}

interface DatosIngresos extends DatoGrafico {
  mes: string;
  ingresos: number;
}

interface DatosEspecialidades extends DatoGrafico {
  especialidad: string;
  pacientes: number;
}

interface DatosTendenciasSalud extends DatoGrafico {
  mes: string;
  hipertension: number;
  diabetes: number;
  obesidad: number;
  cardiopatia: number;
}

interface DatosEdades extends DatoGrafico {
  rango: string;
  pacientes: number;
  porcentaje: number;
}

interface DatosSatisfaccion extends DatoGrafico {
  mes: string;
  satisfaccion: number;
  quejas: number;
  recomendaciones: number;
}

const GraficosInteractivos: React.FC = () => {
  const [datosCitas] = useState<DatosCitas[]>(mockDatosCitas);
  const [datosIngresos] = useState<DatosIngresos[]>(mockDatosIngresos);
  const [datosEspecialidades] = useState<DatosEspecialidades[]>(mockDatosEspecialidades);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('6meses');
  const [tipoGrafico, setTipoGrafico] = useState('barras');
  const [actualizando, setActualizando] = useState(false);

  // Métricas principales
  const metricas: MetricaCard[] = [
    {
      titulo: 'Total Pacientes',
      valor: '1,247',
      cambio: '+12.5%',
      tendencia: 'up',
      icono: <Users className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      titulo: 'Citas Este Mes',
      valor: '185',
      cambio: '+8.2%',
      tendencia: 'up',
      icono: <Calendar className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      titulo: 'Ingresos Mensuales',
      valor: '$125,000',
      cambio: '+15.3%',
      tendencia: 'up',
      icono: <DollarSign className="w-6 h-6" />,
      color: 'text-purple-600'
    },
    {
      titulo: 'Tasa de Ocupación',
      valor: '87.5%',
      cambio: '-2.1%',
      tendencia: 'down',
      icono: <Activity className="w-6 h-6" />,
      color: 'text-orange-600'
    }
  ];

  // Datos para gráfico de tendencias de salud
  const datosTendenciasSalud: DatosTendenciasSalud[] = [
    { mes: 'Ene', hipertension: 45, diabetes: 32, obesidad: 28, cardiopatia: 15 },
    { mes: 'Feb', hipertension: 48, diabetes: 35, obesidad: 30, cardiopatia: 18 },
    { mes: 'Mar', hipertension: 52, diabetes: 38, obesidad: 32, cardiopatia: 20 },
    { mes: 'Abr', hipertension: 49, diabetes: 40, obesidad: 35, cardiopatia: 22 },
    { mes: 'May', hipertension: 55, diabetes: 42, obesidad: 38, cardiopatia: 25 },
    { mes: 'Jun', hipertension: 58, diabetes: 45, obesidad: 40, cardiopatia: 28 }
  ];

  // Datos para distribución por edad
  const datosEdades: DatosEdades[] = [
    { rango: '0-18', pacientes: 156, porcentaje: 12.5 },
    { rango: '19-35', pacientes: 324, porcentaje: 26.0 },
    { rango: '36-50', pacientes: 398, porcentaje: 31.9 },
    { rango: '51-65', pacientes: 245, porcentaje: 19.6 },
    { rango: '65+', pacientes: 124, porcentaje: 10.0 }
  ];

  // Datos para satisfacción del paciente
  const datosSatisfaccion: DatosSatisfaccion[] = [
    { mes: 'Ene', satisfaccion: 4.2, quejas: 8, recomendaciones: 92 },
    { mes: 'Feb', satisfaccion: 4.3, quejas: 6, recomendaciones: 94 },
    { mes: 'Mar', satisfaccion: 4.5, quejas: 4, recomendaciones: 96 },
    { mes: 'Abr', satisfaccion: 4.4, quejas: 5, recomendaciones: 95 },
    { mes: 'May', satisfaccion: 4.6, quejas: 3, recomendaciones: 97 },
    { mes: 'Jun', satisfaccion: 4.7, quejas: 2, recomendaciones: 98 }
  ];

  const actualizarDatos = () => {
    setActualizando(true);
    // Simular actualización de datos
    setTimeout(() => {
      setActualizando(false);
    }, 2000);
  };

  const exportarGraficos = () => {
    // Simular exportación
    console.log('Exportando gráficos...');
    alert('Gráficos exportados exitosamente (simulación)');
  };

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatTooltipValue = (value: string | number, name: string): [string, string] => {
    if (name === 'satisfaccion') return [`${value}/5`, 'Satisfacción'];
    if (name === 'recomendaciones') return [`${value}%`, 'Recomendaciones'];
    if (name === 'ingresos') return [`$${Number(value).toLocaleString()}`, 'Ingresos'];
    return [String(value), name];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gráficos Interactivos</h1>
          <p className="text-gray-600">Análisis visual de datos médicos y estadísticas</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1mes">Último mes</SelectItem>
              <SelectItem value="3meses">Últimos 3 meses</SelectItem>
              <SelectItem value="6meses">Últimos 6 meses</SelectItem>
              <SelectItem value="1año">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={actualizarDatos}
            disabled={actualizando}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${actualizando ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Button
            variant="outline"
            onClick={exportarGraficos}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metrica.titulo}</p>
                  <p className="text-2xl font-bold text-gray-900">{metrica.valor}</p>
                  <div className="flex items-center mt-2">
                    {metrica.tendencia === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : metrica.tendencia === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    ) : null}
                    <span className={`text-sm font-medium ${
                      metrica.tendencia === 'up' ? 'text-green-600' : 
                      metrica.tendencia === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metrica.cambio}
                    </span>
                  </div>
                </div>
                <div className={`${metrica.color}`}>
                  {metrica.icono}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de citas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Citas Médicas por Mes</CardTitle>
              <Select value={tipoGrafico} onValueChange={setTipoGrafico}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barras">Barras</SelectItem>
                  <SelectItem value="lineas">Líneas</SelectItem>
                  <SelectItem value="area">Área</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {tipoGrafico === 'barras' ? (
                <BarChart data={datosCitas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="citas" fill="#3B82F6" name="Citas Programadas" />
                  <Bar dataKey="completadas" fill="#10B981" name="Citas Completadas" />
                </BarChart>
              ) : tipoGrafico === 'lineas' ? (
                <LineChart data={datosCitas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="citas" stroke="#3B82F6" strokeWidth={2} name="Citas Programadas" />
                  <Line type="monotone" dataKey="completadas" stroke="#10B981" strokeWidth={2} name="Citas Completadas" />
                </LineChart>
              ) : (
                <AreaChart data={datosCitas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="citas" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Citas Programadas" />
                  <Area type="monotone" dataKey="completadas" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Citas Completadas" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de ingresos */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={datosIngresos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={formatTooltipValue}
                />
                <Area 
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución por especialidades */}
        <Card>
          <CardHeader>
            <CardTitle>Pacientes por Especialidad</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={datosEspecialidades}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="pacientes"
                  nameKey="especialidad"
                >
                  {datosEspecialidades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por edades */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Edades</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={datosEdades} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="rango" type="category" />
                <Tooltip 
                  formatter={(value: string | number) => [`${value} pacientes`, 'Cantidad']}
                />
                <Bar dataKey="pacientes" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Satisfacción del paciente */}
        <Card>
          <CardHeader>
            <CardTitle>Satisfacción del Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={datosSatisfaccion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis domain={[0, 5]} />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="satisfaccion" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Satisfacción (1-5)"
                />
                <Line 
                  type="monotone" 
                  dataKey="recomendaciones" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="% Recomendaciones"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendencias de salud */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencias de Condiciones de Salud</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={datosTendenciasSalud}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="hipertension" 
                stackId="1" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.6}
                name="Hipertensión"
              />
              <Area 
                type="monotone" 
                dataKey="diabetes" 
                stackId="1" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.6}
                name="Diabetes"
              />
              <Area 
                type="monotone" 
                dataKey="obesidad" 
                stackId="1" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.6}
                name="Obesidad"
              />
              <Area 
                type="monotone" 
                dataKey="cardiopatia" 
                stackId="1" 
                stroke="#06B6D4" 
                fill="#06B6D4" 
                fillOpacity={0.6}
                name="Cardiopatía"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumen de insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Crecimiento Positivo</span>
              </div>
              <p className="text-sm text-blue-700">
                Las citas han aumentado un 8.2% este mes, indicando mayor demanda de servicios médicos.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Alta Satisfacción</span>
              </div>
              <p className="text-sm text-green-700">
                La satisfacción del paciente alcanzó 4.7/5, con un 98% de recomendaciones.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">Oportunidad de Mejora</span>
              </div>
              <p className="text-sm text-yellow-700">
                La tasa de ocupación bajó 2.1%. Considerar optimizar horarios de citas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraficosInteractivos;