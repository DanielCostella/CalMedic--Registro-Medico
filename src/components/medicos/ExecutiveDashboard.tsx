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
    name: string;
    value: number;
    target: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
    description: string;
    category: 'financial' | 'operational' | 'quality' | 'satisfaction';
}

interface FinancialMetric {
    period: string;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
}

interface QualityIndicator {
    name: string;
    value: number;
    target: number;
    status: 'excellent' | 'good' | 'average' | 'critical';
    description: string;
}

interface ExecutiveAlert {
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    date: string;
    action?: string;
}

const ExecutiveDashboard: React.FC = () => {
    const [period, setPeriod] = useState('month');
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
    const [indicators, setIndicators] = useState<QualityIndicator[]>([]);
    const [alerts, setAlerts] = useState<ExecutiveAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock executive data loading
        setTimeout(() => {
            const kpisData: KPI[] = [
                {
                    id: '1',
                    name: 'Monthly Revenue',
                    value: 125000,
                    target: 120000,
                    unit: '$',
                    trend: 'up',
                    change: 8.5,
                    description: 'Total revenue for the current month',
                    category: 'financial'
                },
                {
                    id: '2',
                    name: 'Patients Treated',
                    value: 1250,
                    target: 1200,
                    unit: '',
                    trend: 'up',
                    change: 4.2,
                    description: 'Total patients treated',
                    category: 'operational'
                },
                {
                    id: '3',
                    name: 'Occupancy Rate',
                    value: 87,
                    target: 85,
                    unit: '%',
                    trend: 'up',
                    change: 2.3,
                    description: 'Percentage of occupied appointments',
                    category: 'operational'
                },
                {
                    id: '4',
                    name: 'Patient Satisfaction',
                    value: 4.6,
                    target: 4.5,
                    unit: '/5',
                    trend: 'up',
                    change: 0.2,
                    description: 'Average satisfaction rating',
                    category: 'satisfaction'
                },
                {
                    id: '5',
                    name: 'Average Wait Time',
                    value: 18,
                    target: 20,
                    unit: 'min',
                    trend: 'down',
                    change: -10.5,
                    description: 'Average wait time for consultations',
                    category: 'quality'
                },
                {
                    id: '6',
                    name: 'Profit Margin',
                    value: 32,
                    target: 30,
                    unit: '%',
                    trend: 'up',
                    change: 6.7,
                    description: 'Net profit margin',
                    category: 'financial'
                },
                {
                    id: '7',
                    name: 'Cancelled Appointments',
                    value: 8.5,
                    target: 10,
                    unit: '%',
                    trend: 'down',
                    change: -15.0,
                    description: 'Percentage of cancelled appointments',
                    category: 'operational'
                },
                {
                    id: '8',
                    name: 'New Patients',
                    value: 156,
                    target: 150,
                    unit: '',
                    trend: 'up',
                    change: 12.3,
                    description: 'New patients this month',
                    category: 'operational'
                }
            ];

            const metricsData: FinancialMetric[] = [
                { period: 'January', revenue: 118000, expenses: 82000, profit: 36000, margin: 30.5 },
                { period: 'February', revenue: 122000, expenses: 85000, profit: 37000, margin: 30.3 },
                { period: 'March', revenue: 125000, expenses: 85000, profit: 40000, margin: 32.0 },
                { period: 'April', revenue: 128000, expenses: 87000, profit: 41000, margin: 32.0 },
                { period: 'May', revenue: 132000, expenses: 89000, profit: 43000, margin: 32.6 },
                { period: 'June', revenue: 135000, expenses: 91000, profit: 44000, margin: 32.6 }
            ];

            const indicatorsData: QualityIndicator[] = [
                {
                    name: 'Emergency Response Time',
                    value: 8.5,
                    target: 10,
                    status: 'excellent',
                    description: 'Average response time in minutes'
                },
                {
                    name: 'Diagnostic Accuracy',
                    value: 94,
                    target: 90,
                    status: 'excellent',
                    description: 'Percentage of correct diagnoses'
                },
                {
                    name: 'Protocol Adherence',
                    value: 88,
                    target: 85,
                    status: 'good',
                    description: 'Compliance with medical protocols'
                },
                {
                    name: 'Nosocomial Infections',
                    value: 2.1,
                    target: 3.0,
                    status: 'excellent',
                    description: 'Infection rate per 100 patients'
                },
                {
                    name: '30-Day Readmissions',
                    value: 12.5,
                    target: 15,
                    status: 'good',
                    description: 'Percentage of readmissions'
                },
                {
                    name: 'Hospital Mortality',
                    value: 1.8,
                    target: 2.5,
                    status: 'excellent',
                    description: 'Mortality rate per 100 patients'
                }
            ];

            const alertsData: ExecutiveAlert[] = [
                {
                    id: '1',
                    type: 'critical',
                    title: 'ICU Capacity at 95%',
                    description: 'Intensive care unit is nearing maximum capacity',
                    date: '2024-01-16',
                    action: 'Review elective surgery schedule'
                },
                {
                    id: '2',
                    type: 'warning',
                    title: 'Wait Time Increase',
                    description: 'Average wait time has increased by 15% this week',
                    date: '2024-01-15',
                    action: 'Optimize appointment scheduling'
                },
                {
                    id: '3',
                    type: 'info',
                    title: 'Satisfaction Goal Reached',
                    description: 'Patient satisfaction target exceeded for this month',
                    date: '2024-01-14'
                },
                {
                    id: '4',
                    type: 'warning',
                    title: 'Low Medication Inventory',
                    description: 'Several critical medications are below minimum stock',
                    date: '2024-01-13',
                    action: 'Perform urgent medication order'
                }
            ];

            setKpis(kpisData);
            setMetrics(metricsData);
            setIndicators(indicatorsData);
            setAlerts(alertsData);
            setLoading(false);
        }, 1000);
    }, [period]);

    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up':
                return <ArrowUp className="w-4 h-4 text-green-600" />;
            case 'down':
                return <ArrowDown className="w-4 h-4 text-red-600" />;
            default:
                return <Minus className="w-4 h-4 text-gray-600" />;
        }
    };

    const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'good':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'average':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'critical':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'critical':
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case 'warning':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'info':
                return <CheckCircle className="w-4 h-4 text-blue-600" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-gray-600" />;
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'critical':
                return 'border-l-red-500 bg-red-50';
            case 'warning':
                return 'border-l-yellow-500 bg-yellow-50';
            case 'info':
                return 'border-l-blue-500 bg-blue-50';
            default:
                return 'border-l-gray-500 bg-gray-50';
        }
    };

    const calculateProgress = (value: number, target: number) => {
        return Math.min((value / target) * 100, 100);
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
                        Executive Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Key performance metrics and executive analysis
                    </p>
                </div>

                <div className="flex gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="quarter">Quarter</SelectItem>
                            <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Critical Alerts */}
            {alerts.filter(a => a.type === 'critical').length > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Critical Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {alerts.filter(a => a.type === 'critical').map(alert => (
                                <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                    <div>
                                        <p className="font-medium text-red-900">{alert.title}</p>
                                        <p className="text-sm text-red-700">{alert.description}</p>
                                    </div>
                                    {alert.action && (
                                        <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                                            Action
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.slice(0, 4).map((kpi) => (
                    <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm font-medium text-gray-600">{kpi.name}</div>
                                {getTrendIcon(kpi.trend)}
                            </div>

                            <div className="flex items-baseline gap-2 mb-2">
                                <div className="text-2xl font-bold">
                                    {kpi.unit === '$' && '$'}
                                    {kpi.value.toLocaleString()}
                                    {kpi.unit !== '$' && kpi.unit}
                                </div>
                                <div className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Target: {kpi.unit === '$' && '$'}{kpi.target.toLocaleString()}{kpi.unit !== '$' && kpi.unit}</span>
                                    <span>{Math.round(calculateProgress(kpi.value, kpi.target))}%</span>
                                </div>
                                <Progress value={calculateProgress(kpi.value, kpi.target)} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="financial" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="operational">Operational</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="financial" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    Financial Evolution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {metrics.slice(-6).map((metric, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{metric.period}</p>
                                                <p className="text-sm text-gray-600">Margin: {metric.margin}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">${metric.revenue.toLocaleString()}</p>
                                                <p className="text-sm text-gray-600">Profit: ${metric.profit.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial KPIs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {kpis.filter(k => k.category === 'financial').map((kpi) => (
                                        <div key={kpi.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{kpi.name}</p>
                                                <p className="text-sm text-gray-600">{kpi.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">
                                                        {kpi.unit === '$' && '$'}{kpi.value.toLocaleString()}{kpi.unit !== '$' && kpi.unit}
                                                    </span>
                                                    {getTrendIcon(kpi.trend)}
                                                </div>
                                                <div className={`text-sm ${getTrendColor(kpi.trend)}`}>
                                                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="operational" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpis.filter(k => k.category === 'operational').map((kpi) => (
                            <Card key={kpi.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm font-medium text-gray-600">{kpi.name}</div>
                                        {getTrendIcon(kpi.trend)}
                                    </div>

                                    <div className="text-2xl font-bold mb-2">
                                        {kpi.value.toLocaleString()}{kpi.unit}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>Target: {kpi.target.toLocaleString()}{kpi.unit}</span>
                                            <span className={getTrendColor(kpi.trend)}>
                                                {kpi.change > 0 ? '+' : ''}{kpi.change}%
                                            </span>
                                        </div>
                                        <Progress value={calculateProgress(kpi.value, kpi.target)} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="quality" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {indicators.map((indicator, index) => (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">{indicator.name}</h3>
                                        <Badge className={getStatusColor(indicator.status)}>
                                            {indicator.status}
                                        </Badge>
                                    </div>

                                    <div className="text-2xl font-bold mb-2">
                                        {indicator.value}{indicator.name.includes('Percentage') || indicator.name.includes('Rate') ? '%' : ''}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">{indicator.description}</p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>Target: {indicator.target}</span>
                                            <span>{Math.round(calculateProgress(indicator.value, indicator.target))}%</span>
                                        </div>
                                        <Progress value={calculateProgress(indicator.value, indicator.target)} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-4">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.type)}`}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        {getAlertIcon(alert.type)}
                                        <div>
                                            <h4 className="font-semibold">{alert.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(alert.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {alert.action && (
                                        <Button size="sm" variant="outline">
                                            {alert.action}
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

export default ExecutiveDashboard;
