import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Download, RefreshCw, Calendar, User, FileText, CheckCircle, Clock } from 'lucide-react';
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

interface LabResult {
    id: string;
    patientId: string;
    patientName: string;
    laboratory: string;
    orderDate: string;
    resultDate: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Critical';
    test: string;
    category: string;
    results: LabParameter[];
    observations: string;
    requestingDoctor: string;
    urgency: 'Normal' | 'Urgent' | 'STAT';
}

interface LabParameter {
    id: string;
    name: string;
    value: number | string;
    unit: string;
    referenceRange: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
    previousDate?: string;
    previousValue?: number | string;
}

interface CriticalAlert {
    id: string;
    patientId: string;
    patientName: string;
    parameter: string;
    value: string;
    referenceRange: string;
    resultDate: string;
    laboratory: string;
    status: 'New' | 'Reviewed' | 'Resolved';
    requiredAction: string;
}

const LabIntegration: React.FC = () => {
    const [results, setResults] = useState<LabResult[]>([]);
    const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
    const [showTrends, setShowTrends] = useState(false);
    const [trendParameter, setTrendParameter] = useState<string>('');

    const [statusFilter, setStatusFilter] = useState('');
    const [labFilter, setLabFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Simulate loading lab results
        setTimeout(() => {
            const initialResults: LabResult[] = [
                {
                    id: '1',
                    patientId: '1',
                    patientName: 'Maria Gonzalez',
                    laboratory: 'Central Lab',
                    orderDate: '2024-01-15',
                    resultDate: '2024-01-16',
                    status: 'Critical',
                    test: 'Complete Blood Count',
                    category: 'Hematology',
                    results: [
                        {
                            id: '1',
                            name: 'Hemoglobin',
                            value: 6.8,
                            unit: 'g/dL',
                            referenceRange: '12.0-15.5',
                            status: 'Critical',
                            previousDate: '2023-12-15',
                            previousValue: 11.2
                        },
                        {
                            id: '2',
                            name: 'Hematocrit',
                            value: 20.5,
                            unit: '%',
                            referenceRange: '36.0-46.0',
                            status: 'Critical',
                            previousDate: '2023-12-15',
                            previousValue: 34.1
                        },
                        {
                            id: '3',
                            name: 'White Blood Cells',
                            value: 4500,
                            unit: '/μL',
                            referenceRange: '4000-11000',
                            status: 'Normal'
                        },
                        {
                            id: '4',
                            name: 'Platelets',
                            value: 180000,
                            unit: '/μL',
                            referenceRange: '150000-450000',
                            status: 'Normal'
                        }
                    ],
                    observations: 'Severe anemia. Requires immediate evaluation.',
                    requestingDoctor: 'Dr. System',
                    urgency: 'STAT'
                },
                {
                    id: '2',
                    patientId: '2',
                    patientName: 'Carlos Rodriguez',
                    laboratory: 'Specialized Lab',
                    orderDate: '2024-01-14',
                    resultDate: '2024-01-15',
                    status: 'Completed',
                    test: 'Lipid Profile',
                    category: 'Blood Chemistry',
                    results: [
                        {
                            id: '5',
                            name: 'Total Cholesterol',
                            value: 280,
                            unit: 'mg/dL',
                            referenceRange: '<200',
                            status: 'High',
                            previousDate: '2023-11-14',
                            previousValue: 245
                        },
                        {
                            id: '6',
                            name: 'HDL',
                            value: 35,
                            unit: 'mg/dL',
                            referenceRange: '>40',
                            status: 'Low',
                            previousDate: '2023-11-14',
                            previousValue: 38
                        },
                        {
                            id: '7',
                            name: 'LDL',
                            value: 195,
                            unit: 'mg/dL',
                            referenceRange: '<100',
                            status: 'High',
                            previousDate: '2023-11-14',
                            previousValue: 165
                        },
                        {
                            id: '8',
                            name: 'Triglycerides',
                            value: 250,
                            unit: 'mg/dL',
                            referenceRange: '<150',
                            status: 'High',
                            previousDate: '2023-11-14',
                            previousValue: 210
                        }
                    ],
                    observations: 'Mixed dyslipidemia. Adjust treatment.',
                    requestingDoctor: 'Dr. System',
                    urgency: 'Normal'
                },
                {
                    id: '3',
                    patientId: '3',
                    patientName: 'Ana Martinez',
                    laboratory: 'Central Lab',
                    orderDate: '2024-01-13',
                    resultDate: '2024-01-14',
                    status: 'Completed',
                    test: 'Liver Function',
                    category: 'Blood Chemistry',
                    results: [
                        {
                            id: '9',
                            name: 'ALT (GPT)',
                            value: 45,
                            unit: 'U/L',
                            referenceRange: '7-56',
                            status: 'Normal'
                        },
                        {
                            id: '10',
                            name: 'AST (GOT)',
                            value: 38,
                            unit: 'U/L',
                            referenceRange: '10-40',
                            status: 'Normal'
                        },
                        {
                            id: '11',
                            name: 'Total Bilirubin',
                            value: 1.2,
                            unit: 'mg/dL',
                            referenceRange: '0.3-1.2',
                            status: 'Normal'
                        }
                    ],
                    observations: 'Liver function within normal limits.',
                    requestingDoctor: 'Dr. System',
                    urgency: 'Normal'
                },
                {
                    id: '4',
                    patientId: '4',
                    patientName: 'Luis Garcia',
                    laboratory: 'Specialized Lab',
                    orderDate: '2024-01-12',
                    resultDate: '',
                    status: 'In Progress',
                    test: 'Renal Function',
                    category: 'Blood Chemistry',
                    results: [],
                    observations: 'Processing samples...',
                    requestingDoctor: 'Dr. System',
                    urgency: 'Urgent'
                }
            ];

            const initialAlerts: CriticalAlert[] = [
                {
                    id: '1',
                    patientId: '1',
                    patientName: 'Maria Gonzalez',
                    parameter: 'Hemoglobin',
                    value: '6.8 g/dL',
                    referenceRange: '12.0-15.5 g/dL',
                    resultDate: '2024-01-16',
                    laboratory: 'Central Lab',
                    status: 'New',
                    requiredAction: 'Immediate evaluation - Severe anemia'
                },
                {
                    id: '2',
                    patientId: '1',
                    patientName: 'Maria Gonzalez',
                    parameter: 'Hematocrit',
                    value: '20.5%',
                    referenceRange: '36.0-46.0%',
                    resultDate: '2024-01-16',
                    laboratory: 'Central Lab',
                    status: 'New',
                    requiredAction: 'Confirm severe anemia - Possible transfusion'
                }
            ];

            setResults(initialResults);
            setCriticalAlerts(initialAlerts);
            setLoading(false);
        }, 1000);

        // Simulate arrival of new results every 30 seconds
        const interval = setInterval(() => {
            if (Math.random() > 0.8) { // 20% probability
                simulateNewResult();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const simulateNewResult = () => {
        const newParameters: LabParameter[] = [
            {
                id: Date.now().toString(),
                name: 'Glucose',
                value: Math.floor(Math.random() * 200) + 70,
                unit: 'mg/dL',
                referenceRange: '70-100',
                status: Math.random() > 0.7 ? 'High' : 'Normal'
            }
        ];

        const newResult: LabResult = {
            id: Date.now().toString(),
            patientId: '5',
            patientName: 'New Patient',
            laboratory: 'Auto Lab',
            orderDate: new Date().toISOString().split('T')[0],
            resultDate: new Date().toISOString().split('T')[0],
            status: 'Completed',
            test: 'Fasting Glucose',
            category: 'Blood Chemistry',
            results: newParameters,
            observations: 'Automatic result received',
            requestingDoctor: 'Dr. System',
            urgency: 'Normal'
        };

        setResults(prev => [newResult, ...prev]);

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Lab Result', {
                body: `${newResult.patientName} - ${newResult.test}`,
                icon: '/favicon.png'
            });
        }
    };

    const syncResults = async () => {
        setSyncing(true);

        // Simulate API sync
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate updating some results
        setResults(prev => prev.map(result =>
            result.status === 'In Progress' ? {
                ...result,
                status: 'Completed' as const,
                resultDate: new Date().toISOString().split('T')[0],
                results: [
                    {
                        id: Date.now().toString(),
                        name: 'Creatinine',
                        value: 1.1,
                        unit: 'mg/dL',
                        referenceRange: '0.7-1.3',
                        status: 'Normal' as const
                    },
                    {
                        id: (Date.now() + 1).toString(),
                        name: 'BUN',
                        value: 18,
                        unit: 'mg/dL',
                        referenceRange: '7-20',
                        status: 'Normal' as const
                    }
                ]
            } : result
        ));

        setSyncing(false);
    };

    const markAlertAsReviewed = (alertId: string) => {
        setCriticalAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, status: 'Reviewed' as const } : alert
        ));
    };

    const getTrend = (currentValue: number, previousValue?: number): 'up' | 'down' | 'stable' => {
        if (!previousValue) return 'stable';
        if (currentValue > previousValue) return 'up';
        if (currentValue < previousValue) return 'down';
        return 'stable';
    };

    const getStatusColor = (status: LabParameter['status']) => {
        switch (status) {
            case 'Normal': return 'text-green-600 bg-green-50 border-green-200';
            case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const exportResults = (result: LabResult) => {
        const content = `
LABORATORY RESULT

Patient: ${result.patientName}
Laboratory: ${result.laboratory}
Test: ${result.test}
Order Date: ${new Date(result.orderDate).toLocaleDateString('en-US')}
Result Date: ${new Date(result.resultDate).toLocaleDateString('en-US')}
Requesting Doctor: ${result.requestingDoctor}

RESULTS:
${result.results.map(param =>
            `${param.name}: ${param.value} ${param.unit} (Ref: ${param.referenceRange}) - ${param.status}`
        ).join('\n')}

OBSERVATIONS:
${result.observations}
    `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Result_${result.patientName}_${result.test}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const filteredResults = results.filter(result => {
        const matchSearch = !search ||
            result.patientName.toLowerCase().includes(search.toLowerCase()) ||
            result.test.toLowerCase().includes(search.toLowerCase()) ||
            result.laboratory.toLowerCase().includes(search.toLowerCase());

        const matchStatus = !statusFilter || result.status === statusFilter;
        const matchLab = !labFilter || result.laboratory === labFilter;
        const matchDate = !dateFilter || result.resultDate === dateFilter;

        return matchSearch && matchStatus && matchLab && matchDate;
    });

    const uniqueLabs = [...new Set(results.map(r => r.laboratory))];

    if (loading) {
        return (
            <div className="p-6">
                <LoadingSpinner size="lg" text="Loading lab integration..." />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Activity className="w-8 h-8 text-blue-600" />
                        Lab Integration
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Automatic reception and analysis of laboratory results
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={syncResults}
                        disabled={syncing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {syncing ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Sync
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Critical Alerts */}
            {criticalAlerts.filter(a => a.status === 'New').length > 0 && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            Critical Alerts ({criticalAlerts.filter(a => a.status === 'New').length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {criticalAlerts.filter(a => a.status === 'New').map(alert => (
                                <div key={alert.id} className="flex items-start justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-red-200 dark:border-red-900/50">
                                    <div className="flex-1">
                                        <div className="font-medium text-red-900 dark:text-red-300">{alert.patientName}</div>
                                        <div className="text-sm text-red-700 dark:text-red-400">
                                            <strong>{alert.parameter}:</strong> {alert.value} (Normal: {alert.referenceRange})
                                        </div>
                                        <div className="text-sm text-red-600 dark:text-red-500 mt-1">{alert.requiredAction}</div>
                                        <div className="text-xs text-red-500 dark:text-red-500/70 mt-1">
                                            {alert.laboratory} - {new Date(alert.resultDate).toLocaleDateString('en-US')}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => markAlertAsReviewed(alert.id)}
                                        className="text-red-600 border-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 dark:border-red-900"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Review
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Results</p>
                                <p className="text-2xl font-bold">{results.length}</p>
                            </div>
                            <Activity className="w-8 h-8 text-blue-200/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Critical</p>
                                <p className="text-2xl font-bold">
                                    {results.filter(r => r.status === 'Critical').length}
                                </p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-200/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">In Progress</p>
                                <p className="text-2xl font-bold">
                                    {results.filter(r => r.status === 'In Progress').length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-200/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Completed</p>
                                <p className="text-2xl font-bold">
                                    {results.filter(r => r.status === 'Completed').length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-200/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by patient, test or laboratory..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="dark:bg-slate-900"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40 dark:bg-slate-900">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={labFilter} onValueChange={setLabFilter}>
                                <SelectTrigger className="w-40 dark:bg-slate-900">
                                    <SelectValue placeholder="Laboratory" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Labs">All Labs</SelectItem>
                                    {uniqueLabs.map(lab => (
                                        <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-40 dark:bg-slate-900"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results List */}
            <div className="space-y-4">
                {filteredResults.length === 0 ? (
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardContent className="p-8 text-center text-gray-500">
                            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p>No results found matching the filters</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredResults.map(result => (
                        <Card key={result.id} className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                {result.patientName}
                                            </h3>
                                            <Badge variant={
                                                result.status === 'Critical' ? 'destructive' :
                                                    result.status === 'Completed' ? 'default' :
                                                        result.status === 'In Progress' ? 'secondary' : 'outline'
                                            }>
                                                {result.status}
                                            </Badge>
                                            {result.urgency === 'STAT' && (
                                                <Badge variant="destructive" className="animate-pulse">STAT</Badge>
                                            )}
                                            {result.urgency === 'Urgent' && (
                                                <Badge variant="outline" className="border-orange-300 text-orange-600 dark:text-orange-400 dark:border-orange-900">
                                                    Urgent
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                <span>{result.test}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-4 h-4" />
                                                <span>{result.laboratory}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {result.resultDate ?
                                                        new Date(result.resultDate).toLocaleDateString('en-US') :
                                                        'Pending'
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{result.requestingDoctor}</span>
                                            </div>
                                        </div>

                                        {result.results.length > 0 && (
                                            <div className="mb-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {result.results.slice(0, 4).map(parameter => {
                                                        const trend = getTrend(
                                                            typeof parameter.value === 'number' ? parameter.value : 0,
                                                            typeof parameter.previousValue === 'number' ? parameter.previousValue : undefined
                                                        );

                                                        return (
                                                            <div
                                                                key={parameter.id}
                                                                className={`p-2 rounded-lg border text-xs ${getStatusColor(parameter.status)}`}
                                                            >
                                                                <div className="flex items-center gap-1 font-medium">
                                                                    <span>{parameter.name}:</span>
                                                                    <span>{parameter.value} {parameter.unit}</span>
                                                                    {trend !== 'stable' && (
                                                                        trend === 'up' ?
                                                                            <TrendingUp className="w-3 h-3 text-red-500" /> :
                                                                            <TrendingDown className="w-3 h-3 text-green-500" />
                                                                    )}
                                                                </div>
                                                                <div className="text-gray-500 text-[10px] mt-0.5">Ref: {parameter.referenceRange}</div>
                                                            </div>
                                                        );
                                                    })}
                                                    {result.results.length > 4 && (
                                                        <div className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-gray-400">
                                                            +{result.results.length - 4} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {result.observations && (
                                            <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                                                <strong>Observations:</strong> {result.observations}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedResult(result)}
                                            className="h-8 w-8 p-0 dark:border-slate-700"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => exportResults(result)}
                                            className="h-8 w-8 p-0 dark:border-slate-700"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Detailed View Modal */}
            <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
                    {selectedResult && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-2xl dark:text-slate-100">
                                    <Activity className="w-6 h-6 text-blue-600" />
                                    {selectedResult.test} - {selectedResult.patientName}
                                </DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="results" className="w-full mt-4">
                                <TabsList className="grid w-full grid-cols-3 dark:bg-slate-800">
                                    <TabsTrigger value="results">Results</TabsTrigger>
                                    <TabsTrigger value="trends">Trends</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                </TabsList>

                                <TabsContent value="results" className="space-y-4 pt-4">
                                    <div className="grid gap-3">
                                        {selectedResult.results.map(parameter => {
                                            const trend = getTrend(
                                                typeof parameter.value === 'number' ? parameter.value : 0,
                                                typeof parameter.previousValue === 'number' ? parameter.previousValue : undefined
                                            );

                                            return (
                                                <div key={parameter.id} className={`p-4 rounded-xl border ${getStatusColor(parameter.status)}`}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-bold text-lg">{parameter.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={
                                                                parameter.status === 'Normal' ? 'default' :
                                                                    parameter.status === 'Critical' ? 'destructive' : 'secondary'
                                                            }>
                                                                {parameter.status}
                                                            </Badge>
                                                            {trend !== 'stable' && (
                                                                trend === 'up' ?
                                                                    <TrendingUp className="w-4 h-4 text-red-500" /> :
                                                                    <TrendingDown className="w-4 h-4 text-green-500" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                        <div className="bg-white/50 dark:bg-slate-900/20 p-2 rounded-lg">
                                                            <span className="text-gray-500 text-xs block uppercase font-bold tracking-wider">Current Value</span>
                                                            <div className="text-xl font-bold">{parameter.value} {parameter.unit}</div>
                                                        </div>
                                                        <div className="bg-white/50 dark:bg-slate-900/20 p-2 rounded-lg">
                                                            <span className="text-gray-500 text-xs block uppercase font-bold tracking-wider">Reference Range</span>
                                                            <div className="text-lg font-semibold">{parameter.referenceRange}</div>
                                                        </div>
                                                        {parameter.previousValue && (
                                                            <div className="bg-white/50 dark:bg-slate-900/20 p-2 rounded-lg">
                                                                <span className="text-gray-500 text-xs block uppercase font-bold tracking-wider">Previous Value</span>
                                                                <div className="text-lg font-semibold">{parameter.previousValue} {parameter.unit}</div>
                                                                <div className="text-[10px] text-gray-500 mt-1">
                                                                    {parameter.previousDate && new Date(parameter.previousDate).toLocaleDateString('en-US')}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TabsContent>

                                <TabsContent value="trends" className="pt-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border dark:border-slate-700 text-center">
                                        <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold mb-2">Trend Analysis</h3>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            Historical visualization of laboratory parameters across multiple results.
                                            (Connect to clinical database for full history)
                                        </p>
                                        <div className="mt-6 flex justify-center gap-4">
                                            <Button variant="outline" size="sm">Last 6 Months</Button>
                                            <Button variant="outline" size="sm">Last Year</Button>
                                            <Button variant="outline" size="sm">All Time</Button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="details" className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest border-b pb-1">Administrative Data</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Laboratory</span>
                                                    <span className="font-semibold">{selectedResult.laboratory}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Order Date</span>
                                                    <span className="font-semibold">{new Date(selectedResult.orderDate).toLocaleDateString('en-US')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Result Date</span>
                                                    <span className="font-semibold">{new Date(selectedResult.resultDate).toLocaleDateString('en-US')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Category</span>
                                                    <span className="font-semibold">{selectedResult.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest border-b pb-1">Medical Observations</h4>
                                            <p className="text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700 italic">
                                                {selectedResult.observations || 'No clinical observations registered.'}
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-slate-700">
                                <Button variant="outline" onClick={() => setSelectedResult(null)} className="dark:border-slate-700">
                                    Close
                                </Button>
                                <Button onClick={() => exportResults(selectedResult)} className="bg-blue-600 hover:bg-blue-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LabIntegration;
