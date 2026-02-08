import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Users, Activity, FileText, PieChart, LineChart, Filter, RefreshCw } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

interface CustomReport {
    id: string;
    name: string;
    description: string;
    type: 'Patients' | 'Appointments' | 'Financial' | 'Clinical' | 'Operational';
    createdAt: string;
    lastExecuted: string;
    parameters: ReportParameter[];
    format: 'PDF' | 'Excel' | 'CSV' | 'JSON';
    scheduled: boolean;
    frequency?: 'Daily' | 'Weekly' | 'Monthly';
}

interface ReportParameter {
    id: string;
    name: string;
    type: 'date' | 'select' | 'multiselect' | 'number' | 'text';
    value: string | number | string[];
    options?: string[];
    required: boolean;
}

interface GeneralStatistic {
    name: string;
    value: number;
    change: number; // percentage change
    trend: 'up' | 'down' | 'stable';
    description: string;
}

interface ChartData {
    label: string;
    value: number;
    color?: string;
}

const AdvancedReports: React.FC = () => {
    const [reports, setReports] = useState<CustomReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [showNewReport, setShowNewReport] = useState(false);
    const [selectedReport, setSelectedReport] = useState<CustomReport | null>(null);

    const [generalStats, setGeneralStats] = useState<GeneralStatistic[]>([]);
    const [patientData, setPatientData] = useState<ChartData[]>([]);
    const [appointmentData, setAppointmentData] = useState<ChartData[]>([]);
    const [incomeData, setIncomeData] = useState<ChartData[]>([]);

    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const [newReport, setNewReport] = useState<Omit<CustomReport, 'id' | 'createdAt' | 'lastExecuted'>>({
        name: '',
        description: '',
        type: 'Patients',
        parameters: [],
        format: 'PDF',
        scheduled: false
    });

    useEffect(() => {
        // Simulate data loading
        setTimeout(() => {
            const initialReports: CustomReport[] = [
                {
                    id: '1',
                    name: 'Monthly Patient Report',
                    description: 'Complete patient statistics by month',
                    type: 'Patients',
                    createdAt: '2024-01-01',
                    lastExecuted: '2024-01-15',
                    parameters: [
                        {
                            id: '1',
                            name: 'Month',
                            type: 'select',
                            value: 'January',
                            options: ['January', 'February', 'March', 'April', 'May', 'June'],
                            required: true
                        },
                        {
                            id: '2',
                            name: 'Include charts',
                            type: 'select',
                            value: 'Yes',
                            options: ['Yes', 'No'],
                            required: false
                        }
                    ],
                    format: 'PDF',
                    scheduled: true,
                    frequency: 'Monthly'
                },
                {
                    id: '2',
                    name: 'Weekly Appointment Analysis',
                    description: 'Detailed report of appointments and weekly attendance',
                    type: 'Appointments',
                    createdAt: '2024-01-05',
                    lastExecuted: '2024-01-14',
                    parameters: [
                        {
                            id: '3',
                            name: 'Week',
                            type: 'date',
                            value: '2024-01-08',
                            required: true
                        }
                    ],
                    format: 'Excel',
                    scheduled: true,
                    frequency: 'Weekly'
                },
                {
                    id: '3',
                    name: 'Quarterly Financial Report',
                    description: 'Financial and income analysis by quarter',
                    type: 'Financial',
                    createdAt: '2024-01-01',
                    lastExecuted: '2024-01-10',
                    parameters: [
                        {
                            id: '4',
                            name: 'Quarter',
                            type: 'select',
                            value: 'Q1 2024',
                            options: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
                            required: true
                        }
                    ],
                    format: 'PDF',
                    scheduled: false
                }
            ];

            const initialStats: GeneralStatistic[] = [
                {
                    name: 'Total Patients',
                    value: 1234,
                    change: 12.5,
                    trend: 'up',
                    description: 'Registered patients in the system'
                },
                {
                    name: 'Appointments This Month',
                    value: 456,
                    change: -3.2,
                    trend: 'down',
                    description: 'Scheduled appointments in the current month'
                },
                {
                    name: 'Attendance Rate',
                    value: 87.5,
                    change: 2.1,
                    trend: 'up',
                    description: 'Appointment attendance percentage'
                },
                {
                    name: 'Monthly Income',
                    value: 45000,
                    change: 8.7,
                    trend: 'up',
                    description: 'Current month income'
                }
            ];

            const initialPatientData: ChartData[] = [
                { label: 'January', value: 95, color: '#3B82F6' },
                { label: 'February', value: 112, color: '#10B981' },
                { label: 'March', value: 87, color: '#F59E0B' },
                { label: 'April', value: 134, color: '#EF4444' },
                { label: 'May', value: 156, color: '#8B5CF6' },
                { label: 'June', value: 142, color: '#06B6D4' }
            ];

            const initialAppointmentData: ChartData[] = [
                { label: 'Monday', value: 45, color: '#3B82F6' },
                { label: 'Tuesday', value: 52, color: '#10B981' },
                { label: 'Wednesday', value: 38, color: '#F59E0B' },
                { label: 'Thursday', value: 61, color: '#EF4444' },
                { label: 'Friday', value: 49, color: '#8B5CF6' },
                { label: 'Saturday', value: 23, color: '#06B6D4' }
            ];

            const initialIncomeData: ChartData[] = [
                { label: 'Consultations', value: 65, color: '#3B82F6' },
                { label: 'Procedures', value: 25, color: '#10B981' },
                { label: 'Exams', value: 10, color: '#F59E0B' }
            ];

            setReports(initialReports);
            setGeneralStats(initialStats);
            setPatientData(initialPatientData);
            setAppointmentData(initialAppointmentData);
            setIncomeData(initialIncomeData);
            setLoading(false);
        }, 1000);
    }, []);

    const generateReport = async (report: CustomReport) => {
        setGeneratingReport(true);
        setGenerationProgress(0);

        // Simulate generation progress
        for (let i = 0; i <= 100; i += 10) {
            setGenerationProgress(i);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Simulate file download
        const content = generateReportContent(report);
        const blob = new Blob([content], {
            type: report.format === 'PDF' ? 'application/pdf' :
                report.format === 'Excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                    'text/plain'
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.name}.${report.format.toLowerCase()}`;
        link.click();
        URL.revokeObjectURL(url);

        // Update last execution
        setReports(prev => prev.map(r =>
            r.id === report.id ?
                { ...r, lastExecuted: new Date().toISOString().split('T')[0] } :
                r
        ));

        setGeneratingReport(false);
        setGenerationProgress(0);
    };

    const generateReportContent = (report: CustomReport): string => {
        const date = new Date().toLocaleDateString('en-US');

        return `
REPORT: ${report.name}
Generation date: ${date}
Type: ${report.type}

DESCRIPTION:
${report.description}

PARAMETERS:
${report.parameters.map(p => `${p.name}: ${p.value}`).join('\n')}

GENERAL STATISTICS:
${generalStats.map(e =>
            `${e.name}: ${e.value} (${e.change > 0 ? '+' : ''}${e.change}%)`
        ).join('\n')}

PATIENT DATA BY MONTH:
${patientData.map(d => `${d.label}: ${d.value}`).join('\n')}

APPOINTMENT DISTRIBUTION BY DAY:
${appointmentData.map(d => `${d.label}: ${d.value}`).join('\n')}

INCOME DISTRIBUTION:
${incomeData.map(d => `${d.label}: ${d.value}%`).join('\n')}

---
Report generated automatically by the Integrated Medical System
    `;
    };

    const createReport = () => {
        const completeReport: CustomReport = {
            ...newReport,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0],
            lastExecuted: ''
        };

        setReports(prev => [...prev, completeReport]);
        setShowNewReport(false);
        resetForm();
    };

    const resetForm = () => {
        setNewReport({
            name: '',
            description: '',
            type: 'Patients',
            parameters: [],
            format: 'PDF',
            scheduled: false
        });
    };

    const deleteReport = (id: string) => {
        if (confirm('Are you sure you want to delete this report?')) {
            setReports(prev => prev.filter(r => r.id !== id));
        }
    };

    const exportAllData = () => {
        const completeData = {
            statistics: generalStats,
            patients: patientData,
            appointments: appointmentData,
            income: incomeData,
            reports: reports,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(completeData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `complete_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const filteredReports = reports.filter(report => {
        const matchType = !typeFilter || report.type === typeFilter;
        const matchDate = (!startDateFilter || report.createdAt >= startDateFilter) &&
            (!endDateFilter || report.createdAt <= endDateFilter);

        return matchType && matchDate;
    });

    const reportTypes = [...new Set(reports.map(r => r.type))];

    if (loading) {
        return (
            <div className="p-6">
                <LoadingSpinner size="lg" text="Loading advanced reports..." />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                        Advanced Reports & Analytics
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Detailed analysis and customizable reports of the medical system
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={exportAllData}
                        variant="outline"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>

                    <Dialog open={showNewReport} onOpenChange={setShowNewReport}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <FileText className="w-4 h-4 mr-2" />
                                New Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-slate-800">
                            <DialogHeader>
                                <DialogTitle className="dark:text-slate-100">Create New Report</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="report-name" className="dark:text-slate-300">Report Name</Label>
                                    <Input
                                        id="report-name"
                                        value={newReport.name}
                                        onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                                        placeholder="e.g.: Monthly Activity Report"
                                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="report-description" className="dark:text-slate-300">Description</Label>
                                    <Input
                                        id="report-description"
                                        value={newReport.description}
                                        onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                                        placeholder="Report description..."
                                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="report-type" className="dark:text-slate-300">Report Type</Label>
                                        <Select
                                            value={newReport.type}
                                            onValueChange={(value: CustomReport['type']) =>
                                                setNewReport({ ...newReport, type: value })
                                            }
                                        >
                                            <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Patients">Patients</SelectItem>
                                                <SelectItem value="Appointments">Appointments</SelectItem>
                                                <SelectItem value="Financial">Financial</SelectItem>
                                                <SelectItem value="Clinical">Clinical</SelectItem>
                                                <SelectItem value="Operational">Operational</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="report-format" className="dark:text-slate-300">Format</Label>
                                        <Select
                                            value={newReport.format}
                                            onValueChange={(value: CustomReport['format']) =>
                                                setNewReport({ ...newReport, format: value })
                                            }
                                        >
                                            <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PDF">PDF</SelectItem>
                                                <SelectItem value="Excel">Excel</SelectItem>
                                                <SelectItem value="CSV">CSV</SelectItem>
                                                <SelectItem value="JSON">JSON</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="scheduled"
                                        checked={newReport.scheduled}
                                        onCheckedChange={(checked) =>
                                            setNewReport({ ...newReport, scheduled: !!checked })
                                        }
                                    />
                                    <Label htmlFor="scheduled" className="dark:text-slate-300">Generate automatically</Label>
                                </div>

                                {newReport.scheduled && (
                                    <div>
                                        <Label htmlFor="report-frequency" className="dark:text-slate-300">Frequency</Label>
                                        <Select
                                            value={newReport.frequency || 'Monthly'}
                                            onValueChange={(value: CustomReport['frequency']) =>
                                                setNewReport({ ...newReport, frequency: value })
                                            }
                                        >
                                            <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Daily">Daily</SelectItem>
                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" onClick={() => { setShowNewReport(false); resetForm(); }} className="dark:border-slate-700 dark:text-slate-300">
                                    Cancel
                                </Button>
                                <Button onClick={createReport} disabled={!newReport.name} className="bg-blue-600 hover:bg-blue-700">
                                    Create Report
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Progress bar for report generation */}
            {generatingReport && (
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1 dark:text-slate-300">
                                    <span>Generating report...</span>
                                    <span>{generationProgress}%</span>
                                </div>
                                <Progress value={generationProgress} className="w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* General Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {generalStats.map((stat, index) => (
                    <Card key={index} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">{stat.name}</p>
                                    <p className="text-2xl font-bold mt-1">
                                        {stat.name.includes('Income') ?
                                            `$${stat.value.toLocaleString()}` :
                                            stat.name.includes('Rate') ?
                                                `${stat.value}%` :
                                                stat.value.toLocaleString()
                                        }
                                    </p>
                                    <div className="flex items-center gap-1 text-blue-200 text-xs mt-1">
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="w-3 h-3 text-green-300" />
                                        ) : stat.trend === 'down' ? (
                                            <TrendingUp className="w-3 h-3 rotate-180 text-red-300" />
                                        ) : null}
                                        <span className={stat.trend === 'up' ? 'text-green-300' : stat.trend === 'down' ? 'text-red-300' : ''}>
                                            {stat.change > 0 ? '+' : ''}{stat.change}%
                                        </span>
                                    </div>
                                </div>
                                <Activity className="w-8 h-8 text-blue-200/50" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Analysis Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-slate-100 text-lg">
                            <LineChart className="w-5 h-5 text-blue-600" />
                            Patients per Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {patientData.map((data, index) => (
                                <div key={index} className="group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{data.label}</span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{data.value}</span>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${(data.value / Math.max(...patientData.map(d => d.value))) * 100}%`,
                                                backgroundColor: data.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-slate-100 text-lg">
                            <BarChart3 className="w-5 h-5 text-green-600" />
                            Appointments per Day
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {appointmentData.map((data, index) => (
                                <div key={index} className="group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{data.label}</span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{data.value}</span>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${(data.value / Math.max(...appointmentData.map(d => d.value))) * 100}%`,
                                                backgroundColor: data.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-slate-100 text-lg">
                            <PieChart className="w-5 h-5 text-purple-600" />
                            Income Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {incomeData.map((data, index) => (
                                <div key={index} className="group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{data.label}</span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{data.value}%</span>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${data.value}%`,
                                                backgroundColor: data.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-1">
                            <Label className="dark:text-slate-300 text-xs">Filter reports</Label>
                            <div className="flex gap-2">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-40 dark:bg-slate-800 dark:border-slate-700">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All Types">All Types</SelectItem>
                                        {reportTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={startDateFilter}
                                        onChange={(e) => setStartDateFilter(e.target.value)}
                                        className="w-40 dark:bg-slate-800 dark:border-slate-700"
                                    />
                                    <Label className="absolute -top-5 left-0 text-[10px] text-slate-500 uppercase">Start Date</Label>
                                </div>

                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={endDateFilter}
                                        onChange={(e) => setEndDateFilter(e.target.value)}
                                        className="w-40 dark:bg-slate-800 dark:border-slate-700"
                                    />
                                    <Label className="absolute -top-5 left-0 text-[10px] text-slate-500 uppercase">End Date</Label>
                                </div>
                            </div>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => { setTypeFilter(''); setStartDateFilter(''); setEndDateFilter(''); }} className="dark:text-slate-400">
                            <RefreshCw className="w-3 h-3 mr-2" />
                            Reset Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Report List */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="dark:text-slate-100 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Custom Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredReports.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                                <p>No reports match the filters</p>
                            </div>
                        ) : (
                            filteredReports.map(report => (
                                <div key={report.id} className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-all duration-200 group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{report.name}</h3>
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">{report.type}</Badge>
                                            <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{report.format}</Badge>
                                            {report.scheduled && (
                                                <Badge className="text-[10px] uppercase font-bold bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {report.frequency}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">{report.description}</p>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Created: {new Date(report.createdAt).toLocaleDateString('en-US')}
                                            </span>
                                            {report.lastExecuted && (
                                                <span className="flex items-center gap-1">
                                                    <RefreshCw className="w-3 h-3" />
                                                    Last Execution: {new Date(report.lastExecuted).toLocaleDateString('en-US')}
                                                </span>
                                            )}
                                            <span>{report.parameters.length} parameters</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => generateReport(report)}
                                            disabled={generatingReport}
                                            className="h-8 w-8 p-0 dark:border-slate-700"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedReport(report)}
                                            className="h-8 w-8 p-0 dark:border-slate-700"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => deleteReport(report.id)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-slate-700"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed View Modal */}
            <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-slate-800">
                    {selectedReport && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-2xl font-bold dark:text-slate-100">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                    {selectedReport.name}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border dark:border-slate-700">{selectedReport.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">General Info</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between border-b dark:border-slate-700 pb-1">
                                                <span className="text-slate-500">Type</span>
                                                <span className="font-semibold dark:text-slate-200">{selectedReport.type}</span>
                                            </div>
                                            <div className="flex justify-between border-b dark:border-slate-700 pb-1">
                                                <span className="text-slate-500">Format</span>
                                                <span className="font-semibold dark:text-slate-200">{selectedReport.format}</span>
                                            </div>
                                            <div className="flex justify-between border-b dark:border-slate-700 pb-1">
                                                <span className="text-slate-500">Scheduled</span>
                                                <span className="font-semibold dark:text-slate-200">{selectedReport.scheduled ? 'Yes' : 'No'}</span>
                                            </div>
                                            {selectedReport.scheduled && (
                                                <div className="flex justify-between border-b dark:border-slate-700 pb-1">
                                                    <span className="text-slate-500">Frequency</span>
                                                    <span className="font-semibold dark:text-slate-200">{selectedReport.frequency}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Dates</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between border-b dark:border-slate-700 pb-1">
                                                <span className="text-slate-500">Created</span>
                                                <span className="font-semibold dark:text-slate-200">{new Date(selectedReport.createdAt).toLocaleDateString('en-US')}</span>
                                            </div>
                                            {selectedReport.lastExecuted && (
                                                <div className="flex justify-between border-b dark:border-slate-700 pb-1">
                                                    <span className="text-slate-500">Last Execution</span>
                                                    <span className="font-semibold dark:text-slate-200">{new Date(selectedReport.lastExecuted).toLocaleDateString('en-US')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {selectedReport.parameters.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Parameters</h4>
                                        <div className="grid gap-2">
                                            {selectedReport.parameters.map(param => (
                                                <div key={param.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{param.name}</span>
                                                    <Badge variant="secondary" className="bg-white dark:bg-slate-700">{Array.isArray(param.value) ? param.value.join(', ') : param.value.toString()}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t dark:border-slate-700">
                                <Button variant="outline" onClick={() => setSelectedReport(null)} className="dark:border-slate-700 dark:text-slate-300">
                                    Close
                                </Button>
                                <Button onClick={() => { generateReport(selectedReport); setSelectedReport(null); }} className="bg-blue-600 hover:bg-blue-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Run Now
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdvancedReports;
