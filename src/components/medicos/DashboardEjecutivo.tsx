import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Activity, Target, BarChart3, PieChart, AlertTriangle, CheckCircle, Clock, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KPI {
  id: string;
  nombre: string;
  valor: number;
  objetivo: number;
  unidad: string;
  tendencia: 'up' | 'down' | 'stable';
  cambio: number;
  descripcion: string;
  categoria: 'financiero' | 'operacional' | 'calidad' | 'satisfaccion';
}

interface MetricaFinanciera {
  periodo: string;
  ingresos: number;
  gastos: number;
  utilidad: number;
  margen: number;
}

interface IndicadorCalidad {
  nombre: string;
  valor: number;
  objetivo: number;
  estado: 'excelente' | 'bueno' | 'regular' | 'critico';
  descripcion: string;
}

interface AlertaEjecutiva {
  id: string;
  tipo: 'critica' | 'advertencia' | 'info';
  titulo: string;
  descripcion: string;
  fecha: string;
  accion?: string;
}

const DashboardEjecutivoComponent: React.FC = () => {
  const [periodo, setPeriodo] = useState('mes');
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [metricas, setMetricas] = useState<MetricaFinanciera[]>([]);
  const [indicadores, setIndicadores] = useState<IndicadorCalidad[]>([]);
  const [alertas, setAlertas] = useState<AlertaEjecutiva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos ejecutivos
    setTimeout(() => {
      const kpisData: KPI[] = [
        {
          id: '1',
          nombre: 'Ingresos Mensuales',
          valor: 125000,
          objetivo: 120000,
          unidad: '$',
          tendencia: 'up',
          cambio: 8.5,
          descripcion: 'Ingresos totales del mes actual',
          categoria: 'financiero'
        },
        {
          id: '2',
          nombre: 'Pacientes Atendidos',
          valor: 1250,
          objetivo: 1200,
          unidad: '',
          tendencia: 'up',
          cambio: 4.2,
          descripcion: 'Total de pacientes atendidos',
          categoria: 'operacional'
        },
        {
          id: '3',
          nombre: 'Tasa de Ocupación',
          valor: 87,
          objetivo: 85,
          unidad: '%',
          tendencia: 'up',
          cambio: 2.3,
          descripcion: 'Porcentaje de citas ocupadas',
          categoria: 'operacional'
        },
        {
          id: '4',
          nombre: 'Satisfacción del Paciente',
          valor: 4.6,
          objetivo: 4.5,
          unidad: '/5',
          tendencia: 'up',
          cambio: 0.2,
          descripcion: 'Calificación promedio de satisfacción',
          categoria: 'satisfaccion'
        },
        {
          id: '5',
          nombre: 'Tiempo Promedio de Espera',
          valor: 18,
          objetivo: 20,
          unidad: 'min',
          tendencia: 'down',
          cambio: -10.5,
          descripcion: 'Tiempo promedio de espera en consultas',
          categoria: 'calidad'
        },
        {
          id: '6',
          nombre: 'Margen de Utilidad',
          valor: 32,
          objetivo: 30,
          unidad: '%',
          tendencia: 'up',
          cambio: 6.7,
          descripcion: 'Margen de utilidad neta',
          categoria: 'financiero'
        },
        {
          id: '7',
          nombre: 'Citas Canceladas',
          valor: 8.5,
          objetivo: 10,
          unidad: '%',
          tendencia: 'down',
          cambio: -15.0,
          descripcion: 'Porcentaje de citas canceladas',
          categoria: 'operacional'
        },
        {
          id: '8',
          nombre: 'Nuevos Pacientes',
          valor: 156,
          objetivo: 150,
          unidad: '',
          tendencia: 'up',
          cambio: 12.3,
          descripcion: 'Pacientes nuevos este mes',
          categoria: 'operacional'
        }
      ];

      const metricsData: MetricaFinanciera[] = [
        { periodo: 'Enero', ingresos: 118000, gastos: 82000, utilidad: 36000, margen: 30.5 },
        { periodo: 'Febrero', ingresos: 122000, gastos: 85000, utilidad: 37000, margen: 30.3 },
        { periodo: 'Marzo', ingresos: 125000, gastos: 85000, utilidad: 40000, margen: 32.0 },
        { periodo: 'Abril', ingresos: 128000, gastos: 87000, utilidad: 41000, margen: 32.0 },
        { periodo: 'Mayo', ingresos: 132000, gastos: 89000, utilidad: 43000, margen: 32.6 },
        { periodo: 'Junio', ingresos: 135000, gastos: 91000, utilidad: 44000, margen: 32.6 }
      ];

      const indicadoresData: IndicadorCalidad[] = [
        {
          nombre: 'Tiempo de Respuesta a Emergencias',
          valor: 8.5,
          objetivo: 10,
          estado: 'excelente',
          descripcion: 'Tiempo promedio de respuesta en minutos'
        },
        {
          nombre: 'Precisión Diagnóstica',
          valor: 94,
          objetivo: 90,
          estado: 'excelente',
          descripcion: 'Porcentaje de diagnósticos correctos'
        },
        {
          nombre: 'Adherencia a Protocolos',
          valor: 88,
          objetivo: 85,
          estado: 'bueno',
          descripcion: 'Cumplimiento de protocolos médicos'
        },
        {
          nombre: 'Infecciones Nosocomiales',
          valor: 2.1,
          objetivo: 3.0,
          estado: 'excelente',
          descripcion: 'Tasa de infecciones por cada 100 pacientes'
        },
        {
          nombre: 'Readmisiones en 30 días',
          valor: 12.5,
          objetivo: 15,
          estado: 'bueno',
          descripcion: 'Porcentaje de readmisiones'
        },
        {
          nombre: 'Mortalidad Hospitalaria',
          valor: 1.8,
          objetivo: 2.5,
          estado: 'excelente',
          descripcion: 'Tasa de mortalidad por cada 100 pacientes'
        }
      ];

      const alertasData: AlertaEjecutiva[] = [
        {
          id: '1',
          tipo: 'critica',
          titulo: 'Capacidad de UCI al 95%',
          descripcion: 'La unidad de cuidados intensivos está cerca de su capacidad máxima',
          fecha: '2024-01-16',
          accion: 'Revisar programación de cirugías electivas'
        },
        {
          id: '2',
          tipo: 'advertencia',
          titulo: 'Aumento en tiempo de espera',
          descripcion: 'El tiempo promedio de espera ha aumentado 15% esta semana',
          fecha: '2024-01-15',
          accion: 'Optimizar programación de citas'
        },
        {
          id: '3',
          tipo: 'info',
          titulo: 'Meta de satisfacción alcanzada',
          descripcion: 'Se ha superado la meta de satisfacción del paciente para este mes',
          fecha: '2024-01-14'
        },
        {
          id: '4',
          tipo: 'advertencia',
          titulo: 'Inventario de medicamentos bajo',
          descripción: 'Varios medicamentos críticos están por debajo del stock mínimo',
          fecha: '2024-01-13',
          accion: 'Realizar pedido urgente de medicamentos'
        }
      ];

      setKpis(kpisData);
      setMetricas(metricsData);
      setIndicadores(indicadoresData);
      setAlertas(alertasData);
      setLoading(false);
    }, 1000);
  }, [periodo]);

  const getTendenciaIcon = (tendencia: 'up' | 'down' | 'stable') => {
    switch (tendencia) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTendenciaColor = (tendencia: 'up' | 'down' | 'stable') => {
    switch (tendencia) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'excelente':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'bueno':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'regular':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critico':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertaIcon = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'advertencia':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertaColor = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return 'border-l-red-500 bg-red-50';
      case 'advertencia':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const calcularProgreso = (valor: number, objetivo: number) => {
    return Math.min((valor / objetivo) * 100, 100);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
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
            Dashboard Ejecutivo
          </h1>
          <p className="text-gray-600">
            Métricas clave de rendimiento y análisis ejecutivo
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Día</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="año">Año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Alertas Críticas */}
      {alertas.filter(a => a.tipo === 'critica').length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas Críticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertas.filter(a => a.tipo === 'critica').map(alerta => (
                <div key={alerta.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <p className="font-medium text-red-900">{alerta.titulo}</p>
                    <p className="text-sm text-red-700">{alerta.descripcion}</p>
                  </div>
                  {alerta.accion && (
                    <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                      Acción
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(0, 4).map((kpi) => (
          <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-600">{kpi.nombre}</div>
                {getTendenciaIcon(kpi.tendencia)}
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-2xl font-bold">
                  {kpi.unidad === '$' && '$'}
                  {kpi.valor.toLocaleString()}
                  {kpi.unidad !== '$' && kpi.unidad}
                </div>
                <div className={`text-sm font-medium ${getTendenciaColor(kpi.tendencia)}`}>
                  {kpi.cambio > 0 ? '+' : ''}{kpi.cambio}%
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Objetivo: {kpi.unidad === '$' && '$'}{kpi.objetivo.toLocaleString()}{kpi.unidad !== '$' && kpi.unidad}</span>
                  <span>{Math.round(calcularProgreso(kpi.valor, kpi.objetivo))}%</span>
                </div>
                <Progress value={calcularProgreso(kpi.valor, kpi.objetivo)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="financiero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financiero">Financiero</TabsTrigger>
          <TabsTrigger value="operacional">Operacional</TabsTrigger>
          <TabsTrigger value="calidad">Calidad</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financiero" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Evolución Financiera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metricas.slice(-6).map((metrica, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{metrica.periodo}</p>
                        <p className="text-sm text-gray-600">Margen: {metrica.margen}%</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${metrica.ingresos.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Utilidad: ${metrica.utilidad.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KPIs Financieros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpis.filter(k => k.categoria === 'financiero').map((kpi) => (
                    <div key={kpi.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{kpi.nombre}</p>
                        <p className="text-sm text-gray-600">{kpi.descripcion}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {kpi.unidad === '$' && '$'}{kpi.valor.toLocaleString()}{kpi.unidad !== '$' && kpi.unidad}
                          </span>
                          {getTendenciaIcon(kpi.tendencia)}
                        </div>
                        <div className={`text-sm ${getTendenciaColor(kpi.tendencia)}`}>
                          {kpi.cambio > 0 ? '+' : ''}{kpi.cambio}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operacional" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.filter(k => k.categoria === 'operacional').map((kpi) => (
              <Card key={kpi.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-gray-600">{kpi.nombre}</div>
                    {getTendenciaIcon(kpi.tendencia)}
                  </div>
                  
                  <div className="text-2xl font-bold mb-2">
                    {kpi.valor.toLocaleString()}{kpi.unidad}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Objetivo: {kpi.objetivo.toLocaleString()}{kpi.unidad}</span>
                      <span className={getTendenciaColor(kpi.tendencia)}>
                        {kpi.cambio > 0 ? '+' : ''}{kpi.cambio}%
                      </span>
                    </div>
                    <Progress value={calcularProgreso(kpi.valor, kpi.objetivo)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calidad" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indicadores.map((indicador, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{indicador.nombre}</h3>
                    <Badge className={getEstadoColor(indicador.estado)}>
                      {indicador.estado}
                    </Badge>
                  </div>
                  
                  <div className="text-2xl font-bold mb-2">
                    {indicador.valor}{indicador.nombre.includes('Porcentaje') || indicador.nombre.includes('Tasa') ? '%' : ''}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{indicador.descripcion}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Objetivo: {indicador.objetivo}</span>
                      <span>{Math.round(calcularProgreso(indicador.valor, indicador.objetivo))}%</span>
                    </div>
                    <Progress value={calcularProgreso(indicador.valor, indicador.objetivo)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          {alertas.map((alerta) => (
            <Card key={alerta.id} className={`border-l-4 ${getAlertaColor(alerta.tipo)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertaIcon(alerta.tipo)}
                    <div>
                      <h4 className="font-semibold">{alerta.titulo}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alerta.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alerta.fecha).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  
                  {alerta.accion && (
                    <Button size="sm" variant="outline">
                      {alerta.accion}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardEjecutivoComponent;