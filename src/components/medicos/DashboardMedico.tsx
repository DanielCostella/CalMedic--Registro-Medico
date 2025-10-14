import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Users,
  FileText,
  Heart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  Wallet,
  CreditCard,
  Banknote
} from 'lucide-react';

interface IngresoMensual {
  mes: string;
  consultas: number;
  ingresoUSD: number;
  ingresoBs: number;
  tasaCambio: number;
}

interface EstadisticaFinanciera {
  totalConsultas: number;
  ingresoTotalUSD: number;
  ingresoTotalBs: number;
  promedioConsultaUSD: number;
  promedioConsultaBs: number;
  crecimientoMensual: number;
}

interface DashboardMedicoProps {
  medicoId: string;
  medicoNombre: string;
  especialidad: string;
}

// Datos simulados de ingresos mensuales
const getIngresosMensuales = (): IngresoMensual[] => [
  {
    mes: 'Enero 2024',
    consultas: 85,
    ingresoUSD: 4250,
    ingresoBs: 153000,
    tasaCambio: 36
  },
  {
    mes: 'Febrero 2024',
    consultas: 92,
    ingresoUSD: 4600,
    ingresoBs: 165600,
    tasaCambio: 36
  },
  {
    mes: 'Marzo 2024',
    consultas: 78,
    ingresoUSD: 3900,
    ingresoBs: 140400,
    tasaCambio: 36
  },
  {
    mes: 'Abril 2024',
    consultas: 95,
    ingresoUSD: 4750,
    ingresoBs: 171000,
    tasaCambio: 36
  },
  {
    mes: 'Mayo 2024',
    consultas: 88,
    ingresoUSD: 4400,
    ingresoBs: 158400,
    tasaCambio: 36
  },
  {
    mes: 'Junio 2024',
    consultas: 102,
    ingresoUSD: 5100,
    ingresoBs: 183600,
    tasaCambio: 36
  },
  {
    mes: 'Julio 2024',
    consultas: 96,
    ingresoUSD: 4800,
    ingresoBs: 172800,
    tasaCambio: 36
  },
  {
    mes: 'Agosto 2024',
    consultas: 89,
    ingresoUSD: 4450,
    ingresoBs: 160200,
    tasaCambio: 36
  },
  {
    mes: 'Septiembre 2024',
    consultas: 105,
    ingresoUSD: 5250,
    ingresoBs: 189000,
    tasaCambio: 36
  }
];

// Tarifas por tipo de consulta
const tarifasConsulta = {
  'Consulta General': { usd: 45, bs: 1620 },
  'Control': { usd: 40, bs: 1440 },
  'Primera Vez': { usd: 55, bs: 1980 },
  'Emergencia': { usd: 80, bs: 2880 },
  'Especializada': { usd: 65, bs: 2340 }
};

export default function DashboardMedico({ medicoId, medicoNombre, especialidad }: DashboardMedicoProps) {
  const [ingresosMensuales] = useState<IngresoMensual[]>(getIngresosMensuales());
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<'USD' | 'BS'>('USD');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('mes-actual');
  const [tasaCambioActual] = useState(36); // Tasa de cambio actual simulada

  // Calcular estadísticas financieras
  const calcularEstadisticas = (): EstadisticaFinanciera => {
    const totalConsultas = ingresosMensuales.reduce((sum, mes) => sum + mes.consultas, 0);
    const ingresoTotalUSD = ingresosMensuales.reduce((sum, mes) => sum + mes.ingresoUSD, 0);
    const ingresoTotalBs = ingresosMensuales.reduce((sum, mes) => sum + mes.ingresoBs, 0);
    
    const promedioConsultaUSD = totalConsultas > 0 ? ingresoTotalUSD / totalConsultas : 0;
    const promedioConsultaBs = totalConsultas > 0 ? ingresoTotalBs / totalConsultas : 0;
    
    // Calcular crecimiento comparando últimos 3 meses vs anteriores 3 meses
    const ultimosTresMeses = ingresosMensuales.slice(-3);
    const anterioresTresMeses = ingresosMensuales.slice(-6, -3);
    
    const ingresoUltimosTres = ultimosTresMeses.reduce((sum, mes) => sum + mes.ingresoUSD, 0);
    const ingresoAnterioresTres = anterioresTresMeses.reduce((sum, mes) => sum + mes.ingresoUSD, 0);
    
    const crecimientoMensual = ingresoAnterioresTres > 0 
      ? ((ingresoUltimosTres - ingresoAnterioresTres) / ingresoAnterioresTres) * 100 
      : 0;

    return {
      totalConsultas,
      ingresoTotalUSD,
      ingresoTotalBs,
      promedioConsultaUSD,
      promedioConsultaBs,
      crecimientoMensual
    };
  };

  const estadisticas = calcularEstadisticas();

  // Obtener datos del mes actual
  const mesActual = ingresosMensuales[ingresosMensuales.length - 1];
  const mesAnterior = ingresosMensuales[ingresosMensuales.length - 2];

  const formatCurrency = (amount: number, currency: 'USD' | 'BS') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    } else {
      return new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'VES',
        minimumFractionDigits: 0
      }).format(amount);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const getCrecimientoColor = (crecimiento: number) => {
    if (crecimiento > 0) return 'text-green-600';
    if (crecimiento < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  const getCrecimientoIcon = (crecimiento: number) => {
    if (crecimiento > 0) return <TrendingUp className="h-4 w-4" />;
    if (crecimiento < 0) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Médico</h2>
          <p className="text-slate-600">Dr. {medicoNombre} - {especialidad}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={monedaSeleccionada} onValueChange={(value: 'USD' | 'BS') => setMonedaSeleccionada(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>USD</span>
                </div>
              </SelectItem>
              <SelectItem value="BS">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-4 w-4" />
                  <span>Bs.</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-sm">
            Tasa: {tasaCambioActual} Bs/USD
          </Badge>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-green-600">
                  {monedaSeleccionada === 'USD' 
                    ? formatCurrency(mesActual.ingresoUSD, 'USD')
                    : formatCurrency(mesActual.ingresoBs, 'BS')
                  }
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {getCrecimientoIcon(estadisticas.crecimientoMensual)}
                  <span className={`text-xs ${getCrecimientoColor(estadisticas.crecimientoMensual)}`}>
                    {estadisticas.crecimientoMensual > 0 ? '+' : ''}{estadisticas.crecimientoMensual.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Wallet className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Consultas del Mes</p>
                <p className="text-2xl font-bold text-blue-600">{mesActual.consultas}</p>
                <p className="text-xs text-slate-500">
                  {mesActual.consultas > mesAnterior.consultas ? '+' : ''}
                  {mesActual.consultas - mesAnterior.consultas} vs mes anterior
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Promedio por Consulta</p>
                <p className="text-2xl font-bold text-purple-600">
                  {monedaSeleccionada === 'USD' 
                    ? formatCurrency(estadisticas.promedioConsultaUSD, 'USD')
                    : formatCurrency(estadisticas.promedioConsultaBs, 'BS')
                  }
                </p>
                <p className="text-xs text-slate-500">Basado en {estadisticas.totalConsultas} consultas</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Anual</p>
                <p className="text-2xl font-bold text-orange-600">
                  {monedaSeleccionada === 'USD' 
                    ? formatCurrency(estadisticas.ingresoTotalUSD, 'USD')
                    : formatCurrency(estadisticas.ingresoTotalBs, 'BS')
                  }
                </p>
                <p className="text-xs text-slate-500">{estadisticas.totalConsultas} consultas totales</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="ingresos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ingresos">Ingresos Mensuales</TabsTrigger>
          <TabsTrigger value="tarifas">Tarifas de Consulta</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="proyecciones">Proyecciones</TabsTrigger>
        </TabsList>

        <TabsContent value="ingresos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Evolución de Ingresos Mensuales</span>
              </CardTitle>
              <CardDescription>
                Ingresos y consultas por mes en {monedaSeleccionada === 'USD' ? 'dólares americanos' : 'bolívares'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ingresosMensuales.slice(-6).map((mes, index) => (
                  <div key={mes.mes} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {mes.mes.split(' ')[0].slice(0, 3)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{mes.mes}</p>
                        <p className="text-sm text-slate-500">{mes.consultas} consultas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {monedaSeleccionada === 'USD' 
                          ? formatCurrency(mes.ingresoUSD, 'USD')
                          : formatCurrency(mes.ingresoBs, 'BS')
                        }
                      </p>
                      <p className="text-sm text-slate-500">
                        {monedaSeleccionada === 'USD' 
                          ? `${formatCurrency(mes.ingresoUSD / mes.consultas, 'USD')} promedio`
                          : `${formatCurrency(mes.ingresoBs / mes.consultas, 'BS')} promedio`
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tarifas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span>Tarifas por Tipo de Consulta</span>
              </CardTitle>
              <CardDescription>
                Precios actuales en USD y Bs. (Tasa: {tasaCambioActual} Bs/USD)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(tarifasConsulta).map(([tipo, tarifa]) => (
                  <Card key={tipo} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800">{tipo}</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">USD:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(tarifa.usd, 'USD')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Bs.:</span>
                            <span className="font-medium text-blue-600">
                              {formatCurrency(tarifa.bs, 'BS')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Consultas (9 meses):</span>
                  <span className="font-bold text-slate-800">{formatNumber(estadisticas.totalConsultas)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Ingresos Totales USD:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(estadisticas.ingresoTotalUSD, 'USD')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Ingresos Totales Bs.:</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(estadisticas.ingresoTotalBs, 'BS')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Promedio Mensual USD:</span>
                  <span className="font-bold text-purple-600">
                    {formatCurrency(estadisticas.ingresoTotalUSD / 9, 'USD')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Promedio Mensual Bs.:</span>
                  <span className="font-bold text-orange-600">
                    {formatCurrency(estadisticas.ingresoTotalBs / 9, 'BS')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Consultas por mes (promedio):</span>
                  <span className="font-bold text-slate-800">
                    {Math.round(estadisticas.totalConsultas / 9)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Crecimiento trimestral:</span>
                  <div className="flex items-center space-x-1">
                    {getCrecimientoIcon(estadisticas.crecimientoMensual)}
                    <span className={`font-bold ${getCrecimientoColor(estadisticas.crecimientoMensual)}`}>
                      {estadisticas.crecimientoMensual > 0 ? '+' : ''}{estadisticas.crecimientoMensual.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Mejor mes (consultas):</span>
                  <span className="font-bold text-green-600">
                    {Math.max(...ingresosMensuales.map(m => m.consultas))} consultas
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Mejor mes (ingresos USD):</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(Math.max(...ingresosMensuales.map(m => m.ingresoUSD)), 'USD')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Mejor mes (ingresos Bs.):</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(Math.max(...ingresosMensuales.map(m => m.ingresoBs)), 'BS')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proyecciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span>Proyecciones Financieras</span>
              </CardTitle>
              <CardDescription>
                Estimaciones basadas en el rendimiento de los últimos 3 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-slate-800">Próximo Mes</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {monedaSeleccionada === 'USD' 
                          ? formatCurrency(mesActual.ingresoUSD * 1.05, 'USD')
                          : formatCurrency(mesActual.ingresoBs * 1.05, 'BS')
                        }
                      </p>
                      <p className="text-sm text-slate-500">
                        ~{Math.round(mesActual.consultas * 1.05)} consultas
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-slate-800">Próximo Trimestre</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {monedaSeleccionada === 'USD' 
                          ? formatCurrency(mesActual.ingresoUSD * 3 * 1.08, 'USD')
                          : formatCurrency(mesActual.ingresoBs * 3 * 1.08, 'BS')
                        }
                      </p>
                      <p className="text-sm text-slate-500">
                        ~{Math.round(mesActual.consultas * 3 * 1.08)} consultas
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-slate-800">Fin de Año</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {monedaSeleccionada === 'USD' 
                          ? formatCurrency(estadisticas.ingresoTotalUSD + (mesActual.ingresoUSD * 3 * 1.1), 'USD')
                          : formatCurrency(estadisticas.ingresoTotalBs + (mesActual.ingresoBs * 3 * 1.1), 'BS')
                        }
                      </p>
                      <p className="text-sm text-slate-500">
                        ~{estadisticas.totalConsultas + Math.round(mesActual.consultas * 3 * 1.1)} consultas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Nota sobre Proyecciones</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Las proyecciones se basan en el crecimiento promedio de los últimos 3 meses ({estadisticas.crecimientoMensual.toFixed(1)}%) 
                      y pueden variar según factores externos como estacionalidad, cambios en tarifas, o condiciones del mercado.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Actividad Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Consultas esta semana:</span>
                <Badge variant="secondary">24 consultas</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Ingresos esta semana:</span>
                <Badge className="bg-green-100 text-green-800">
                  {monedaSeleccionada === 'USD' ? '$1,200' : 'Bs. 43,200'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Citas programadas hoy:</span>
                <Badge className="bg-blue-100 text-blue-800">8 citas</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pacientes nuevos este mes:</span>
                <Badge className="bg-purple-100 text-purple-800">12 pacientes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span>Resumen de Pacientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total pacientes activos:</span>
                <Badge variant="secondary">347 pacientes</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pacientes con seguros:</span>
                <Badge className="bg-blue-100 text-blue-800">89%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pacientes particulares:</span>
                <Badge className="bg-orange-100 text-orange-800">11%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Satisfacción promedio:</span>
                <Badge className="bg-green-100 text-green-800">4.8/5.0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}