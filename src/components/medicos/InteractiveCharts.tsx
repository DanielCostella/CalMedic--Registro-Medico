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

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string;
        borderWidth?: number;
        fill?: boolean;
    }[];
}

interface InteractiveChartsProps {
    doctorId: string;
    doctorName: string;
}

export default function InteractiveCharts({ doctorId, doctorName }: InteractiveChartsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [chartType, setChartType] = useState('bar');
    const [loading, setLoading] = useState(false);

    // Simulated chart data
    const simulatedData = {
        patientsByAge: {
            labels: ['0-18', '19-35', '36-50', '51-65', '65+'],
            datasets: [{
                label: 'Patients',
                data: [12, 45, 52, 38, 9],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                borderWidth: 2
            }]
        },
        appointmentsByMonth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Completed Appointments',
                data: [42, 38, 45, 41, 39, 48],
                backgroundColor: '#10B981',
                borderColor: '#059669',
                borderWidth: 2
            }, {
                label: 'Cancelled Appointments',
                data: [5, 8, 3, 6, 4, 7],
                backgroundColor: '#EF4444',
                borderColor: '#DC2626',
                borderWidth: 2
            }]
        },
        incomeByType: {
            labels: ['General Consultation', 'Follow-up', 'Emergency', 'First Time'],
            datasets: [{
                label: 'Income ($)',
                data: [78000, 44500, 15000, 5000],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
                borderWidth: 2
            }]
        },
        mostPrescribedMedications: {
            labels: ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Omeprazole', 'Losartan'],
            datasets: [{
                label: 'Frequency',
                data: [67, 45, 34, 28, 23],
                backgroundColor: '#8B5CF6',
                borderColor: '#7C3AED',
                borderWidth: 2
            }]
        },
        frequentDiagnoses: {
            labels: ['Hypertension', 'T2 Diabetes', 'Gastritis', 'Migraine', 'Anxiety'],
            datasets: [{
                label: 'Cases',
                data: [34, 28, 23, 19, 16],
                backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
                borderWidth: 2
            }]
        },
        consultationTrends: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: 'Consultations',
                data: [28, 32, 25, 38, 42, 45],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: '#3B82F6',
                borderWidth: 3,
                fill: true
            }]
        }
    };

    const updateData = async () => {
        setLoading(true);
        // Simulate data loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
    };

    const exportChart = (chartName: string) => {
        // Simulate export
        console.log(`Exporting chart: ${chartName}`);
    };

    const ProgressBarChart = ({ data, title, height = 300 }: { data: ChartData; title: string; height?: number }) => (
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-900">{title}</h3>
                <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => exportChart(title)}>
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div style={{ height: height }} className="bg-slate-50 rounded-lg p-4 flex items-end justify-around">
                {data.labels.map((label, index) => {
                    const value = data.datasets[0].data[index];
                    const maxValue = Math.max(...data.datasets[0].data);
                    const relativeHeight = (value / maxValue) * (height - 80);
                    const color = Array.isArray(data.datasets[0].backgroundColor)
                        ? data.datasets[0].backgroundColor[index]
                        : data.datasets[0].backgroundColor || '#3B82F6';

                    return (
                        <div key={index} className="flex flex-col items-center space-y-2">
                            <div className="text-xs font-medium text-slate-600">{value}</div>
                            <div
                                className="w-8 rounded-t transition-all duration-500 hover:opacity-80"
                                style={{
                                    height: `${relativeHeight}px`,
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

    const SVGLineChart = ({ data, title, height = 300 }: { data: ChartData; title: string; height?: number }) => (
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-900">{title}</h3>
                <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => exportChart(title)}>
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div style={{ height: height }} className="bg-slate-50 rounded-lg p-4 relative">
                <svg width="100%" height="100%" className="absolute inset-0 p-4">
                    <defs>
                        <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line
                            key={y}
                            x1="40"
                            y1={40 + (y * (height - 80) / 100)}
                            x2="100%"
                            y2={40 + (y * (height - 80) / 100)}
                            stroke="#E2E8F0"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Data line */}
                    <polyline
                        fill="url(#chart-gradient)"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        points={data.labels.map((_, index) => {
                            const xValue = 40 + (index * (100 - 40) / (data.labels.length - 1));
                            const maxValue = Math.max(...data.datasets[0].data);
                            const yValue = height - 40 - (data.datasets[0].data[index] / maxValue) * (height - 80);
                            return `${xValue}%,${yValue}`;
                        }).join(' ')}
                    />

                    {/* Data points */}
                    {data.labels.map((_, index) => {
                        const xValue = 40 + (index * (100 - 40) / (data.labels.length - 1));
                        const maxValue = Math.max(...data.datasets[0].data);
                        const yValue = height - 40 - (data.datasets[0].data[index] / maxValue) * (height - 80);
                        return (
                            <circle
                                key={index}
                                cx={`${xValue}%`}
                                cy={yValue}
                                r="4"
                                fill="#3B82F6"
                                stroke="white"
                                strokeWidth="2"
                                className="hover:r-6 transition-all cursor-pointer"
                            />
                        );
                    })}
                </svg>

                {/* X Axis labels */}
                <div className="absolute bottom-2 left-10 right-4 flex justify-between">
                    {data.labels.map((label, index) => (
                        <span key={index} className="text-xs text-slate-500">{label}</span>
                    ))}
                </div>

                {/* Y Axis labels */}
                <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between">
                    {[Math.max(...data.datasets[0].data), Math.max(...data.datasets[0].data) * 0.75, Math.max(...data.datasets[0].data) * 0.5, Math.max(...data.datasets[0].data) * 0.25, 0].map((val, idx) => (
                        <span key={idx} className="text-xs text-slate-500">{Math.round(val)}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    const SVGPieChart = ({ data, title }: { data: ChartData; title: string }) => {
        const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
        let accumulated = 0;

        return (
            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-slate-900">{title}</h3>
                    <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => exportChart(title)}>
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
                            {data.labels.map((label, index) => {
                                const value = data.datasets[0].data[index];
                                const percentage = (value / total) * 100;
                                const angle = (percentage / 100) * 360;
                                const startAngle = (accumulated / total) * 360;

                                const color = Array.isArray(data.datasets[0].backgroundColor)
                                    ? data.datasets[0].backgroundColor[index]
                                    : data.datasets[0].backgroundColor || '#3B82F6';

                                const radius = 80;
                                const centerX = 100;
                                const centerY = 100;

                                const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
                                const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
                                const x2 = centerX + radius * Math.cos(((startAngle + angle) * Math.PI) / 180);
                                const y2 = centerY + radius * Math.sin(((startAngle + angle) * Math.PI) / 180);

                                const largeArcFlag = angle > 180 ? 1 : 0;

                                const pathData = [
                                    `M ${centerX} ${centerY}`,
                                    `L ${x1} ${y1}`,
                                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                    'Z'
                                ].join(' ');

                                accumulated += value;

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
                        {data.labels.map((label, index) => {
                            const value = data.datasets[0].data[index];
                            const percentage = ((value / total) * 100).toFixed(1);
                            const color = Array.isArray(data.datasets[0].backgroundColor)
                                ? data.datasets[0].backgroundColor[index]
                                : data.datasets[0].backgroundColor || '#3B82F6';

                            return (
                                <div key={index} className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-sm text-slate-600">{label}</span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {value} ({percentage}%)
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
                    <h1 className="text-3xl font-bold text-slate-800">Interactive Charts</h1>
                    <p className="text-slate-600 mt-1">Advanced visualization of medical data</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={updateData} disabled={loading} variant="outline">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Patients</p>
                                <p className="text-2xl font-bold text-blue-600">156</p>
                                <p className="text-xs text-green-600">+12% vs last month</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Completed Appointments</p>
                                <p className="text-2xl font-bold text-green-600">241</p>
                                <p className="text-xs text-green-600">+8% vs last month</p>
                            </div>
                            <Calendar className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Income</p>
                                <p className="text-2xl font-bold text-purple-600">$18,750</p>
                                <p className="text-xs text-green-600">+15% vs last month</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Issued Prescriptions</p>
                                <p className="text-2xl font-bold text-orange-600">198</p>
                                <p className="text-xs text-green-600">+5% vs last month</p>
                            </div>
                            <Pill className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <Tabs defaultValue="summary" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="patients">Patients</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <SVGLineChart
                                    data={simulatedData.consultationTrends}
                                    title="Consultation Trend"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <SVGPieChart
                                    data={simulatedData.incomeByType}
                                    title="Income by Consultation Type"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <ProgressBarChart
                                    data={simulatedData.appointmentsByMonth}
                                    title="Appointments by Month"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <ProgressBarChart
                                    data={simulatedData.frequentDiagnoses}
                                    title="Most Frequent Diagnoses"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="patients" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <SVGPieChart
                                    data={simulatedData.patientsByAge}
                                    title="Patient Distribution by Age"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <ProgressBarChart
                                    data={simulatedData.frequentDiagnoses}
                                    title="Most Common Diagnoses"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <ProgressBarChart
                                    data={simulatedData.appointmentsByMonth}
                                    title="Completed vs Cancelled Appointments"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <SVGLineChart
                                    data={simulatedData.consultationTrends}
                                    title="Weekly Consultation Trend"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="medications" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <ProgressBarChart
                                    data={simulatedData.mostPrescribedMedications}
                                    title="Most Prescribed Medications"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <SVGPieChart
                                    data={simulatedData.frequentDiagnoses}
                                    title="Diagnosis Distribution"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
