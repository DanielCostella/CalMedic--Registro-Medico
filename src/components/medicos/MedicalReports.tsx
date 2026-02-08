import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    BarChart3,
    TrendingUp,
    Users,
    Calendar,
    FileText,
    Download,
    Filter,
    PieChart,
    Activity,
    Clock,
    DollarSign,
    Stethoscope,
    Pill,
    Heart,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    Printer
} from 'lucide-react';

interface ReportData {
    id: string;
    type: 'patients' | 'appointments' | 'prescriptions' | 'income' | 'diagnoses';
    title: string;
    date: string;
    period: string;
    data: Record<string, unknown>;
    status: 'generated' | 'processing' | 'error';
}

interface PatientStatistics {
    totalPatients: number;
    newPatients: number;
    activePatients: number;
    averageAge: number;
    genderDistribution: { male: number; female: number };
    ageDistribution: { range: string; count: number }[];
}

interface AppointmentStatistics {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    pendingAppointments: number;
    averageConsultationTime: number;
    appointmentsByType: { type: string; count: number }[];
    appointmentsByDay: { day: string; count: number }[];
}

interface PrescriptionStatistics {
    totalPrescriptions: number;
    prescribedMedications: number;
    prescriptionsByType: { type: string; count: number }[];
    mostPrescribedMedications: { medication: string; count: number }[];
    frequentDiagnoses: { diagnosis: string; count: number }[];
}

interface IncomeStatistics {
    totalIncome: number;
    monthlyIncome: number;
    averageIncomePerAppointment: number;
    incomeByMonth: { month: string; income: number }[];
    incomeByType: { type: string; income: number }[];
}

interface MedicalReportsProps {
    doctorId: string;
    doctorName: string;
}

export default function MedicalReports({ doctorId, doctorName }: MedicalReportsProps) {
    const [reports, setReports] = useState<ReportData[]>([]);
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [periodFilter, setPeriodFilter] = useState<string>('month');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string>('summary');

    // Simulated statistical data
    const patientStats: PatientStatistics = {
        totalPatients: 156,
        newPatients: 23,
        activePatients: 134,
        averageAge: 42.5,
        genderDistribution: { male: 68, female: 88 },
        ageDistribution: [
            { range: '0-18', count: 12 },
            { range: '19-35', count: 45 },
            { range: '36-50', count: 52 },
            { range: '51-65', count: 38 },
            { range: '65+', count: 9 }
        ]
    };

    const appointmentStats: AppointmentStatistics = {
        totalAppointments: 284,
        completedAppointments: 241,
        cancelledAppointments: 28,
        pendingAppointments: 15,
        averageConsultationTime: 32,
        appointmentsByType: [
            { type: 'General', count: 156 },
            { type: 'Control', count: 89 },
            { type: 'Emergency', count: 23 },
            { type: 'First Time', count: 16 }
        ],
        appointmentsByDay: [
            { day: 'Monday', count: 42 },
            { day: 'Tuesday', count: 38 },
            { day: 'Wednesday', count: 45 },
            { day: 'Thursday', count: 41 },
            { day: 'Friday', count: 39 },
            { day: 'Saturday', count: 18 }
        ]
    };

    const prescriptionStats: PrescriptionStatistics = {
        totalPrescriptions: 198,
        prescribedMedications: 456,
        prescriptionsByType: [
            { type: 'Normal', count: 167 },
            { type: 'Controlled', count: 23 },
            { type: 'Compounded', count: 8 }
        ],
        mostPrescribedMedications: [
            { medication: 'Paracetamol 500mg', count: 67 },
            { medication: 'Ibuprofen 400mg', count: 45 },
            { medication: 'Amoxicillin 500mg', count: 34 },
            { medication: 'Omeprazole 20mg', count: 28 },
            { medication: 'Losartan 50mg', count: 23 }
        ],
        frequentDiagnoses: [
            { diagnosis: 'Arterial Hypertension', count: 34 },
            { diagnosis: 'Type 2 Diabetes Mellitus', count: 28 },
            { diagnosis: 'Respiratory Infection', count: 23 },
            { diagnosis: 'Gastritis', count: 19 },
            { diagnosis: 'Tension Headache', count: 16 }
        ]
    };

    const incomeStats: IncomeStatistics = {
        totalIncome: 142500,
        monthlyIncome: 18750,
        averageIncomePerAppointment: 65,
        incomeByMonth: [
            { month: 'January', income: 15200 },
            { month: 'February', income: 16800 },
            { month: 'March', income: 18200 },
            { month: 'April', income: 17500 },
            { month: 'May', income: 19300 },
            { month: 'June', income: 18750 }
        ],
        incomeByType: [
            { type: 'General Consultation', income: 78000 },
            { type: 'Control Consultation', income: 44500 },
            { type: 'Emergency Consultation', income: 15000 },
            { type: 'First Consultation', income: 5000 }
        ]
    };

    useEffect(() => {
        // Initialize default dates
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(startOfMonth.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
    }, []);

    const generateReport = async (type: string) => {
        setLoading(true);
        try {
            // Simulate report generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newReport: ReportData = {
                id: Date.now().toString(),
                type: type as ReportData['type'],
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
                date: new Date().toISOString().split('T')[0],
                period: `${startDate} - ${endDate}`,
                data: {},
                status: 'generated'
            };

            setReports([newReport, ...reports]);
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
        // Simulate export
        const content = generateReportContent();

        if (format === 'pdf') {
            printReport(content);
        } else {
            downloadFile(content, format);
        }
    };

    const printReport = (content: string) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Medical Report - ${doctorName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
            .stat-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }
    };

    const downloadFile = (content: string, format: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medical_report_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const generateReportContent = () => {
        const date = new Date().toLocaleDateString('en-US');

        return `
      <div class="header">
        <h1>INTEGRAL MEDICAL REPORT</h1>
        <p>Dr. ${doctorName}</p>
        <p>Date: ${date}</p>
        <p>Period: ${startDate} - ${endDate}</p>
      </div>

      <div class="section">
        <h2>Statistical Summary</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Patients</h3>
            <p>Total: ${patientStats.totalPatients}</p>
            <p>New: ${patientStats.newPatients}</p>
            <p>Active: ${patientStats.activePatients}</p>
          </div>
          <div class="stat-card">
            <h3>Appointments</h3>
            <p>Total: ${appointmentStats.totalAppointments}</p>
            <p>Completed: ${appointmentStats.completedAppointments}</p>
            <p>Cancelled: ${appointmentStats.cancelledAppointments}</p>
          </div>
          <div class="stat-card">
            <h3>Prescriptions</h3>
            <p>Total: ${prescriptionStats.totalPrescriptions}</p>
            <p>Medications: ${prescriptionStats.prescribedMedications}</p>
          </div>
          <div class="stat-card">
            <h3>Income</h3>
            <p>Total: $${incomeStats.totalIncome.toLocaleString()}</p>
            <p>This Month: $${incomeStats.monthlyIncome.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Most Prescribed Medications</h2>
        <table>
          <thead>
            <tr><th>Medication</th><th>Count</th></tr>
          </thead>
          <tbody>
            ${prescriptionStats.mostPrescribedMedications.map(med =>
            `<tr><td>${med.medication}</td><td>${med.count}</td></tr>`
        ).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Most Frequent Diagnoses</h2>
        <table>
          <thead>
            <tr><th>Diagnosis</th><th>Frequency</th></tr>
          </thead>
          <tbody>
            ${prescriptionStats.frequentDiagnoses.map(diag =>
            `<tr><td>${diag.diagnosis}</td><td>${diag.count}</td></tr>`
        ).join('')}
          </tbody>
        </table>
      </div>
    `;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    const calculatePercentage = (value: number, total: number) => {
        return ((value / total) * 100).toFixed(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Medical Reports</h1>
                    <p className="text-slate-600 mt-1">Statistical analysis and medical activity reports</p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={() => exportReport('pdf')}
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                    </Button>
                    <Button
                        onClick={() => exportReport('excel')}
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-blue-600" />
                        <span>Report Filters</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label>Period</Label>
                            <Select value={periodFilter} onValueChange={setPeriodFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="quarter">This Quarter</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                onClick={() => generateReport('general')}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Generating...' : 'Generate Report'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Report Tabs */}
            <Tabs value={selectedReport} onValueChange={setSelectedReport}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="patients">Patients</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                </TabsList>

                {/* General Summary */}
                <TabsContent value="summary" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Total Patients</p>
                                        <p className="text-2xl font-bold text-blue-600">{patientStats.totalPatients}</p>
                                        <p className="text-xs text-green-600">+{patientStats.newPatients} new</p>
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
                                        <p className="text-2xl font-bold text-green-600">{appointmentStats.completedAppointments}</p>
                                        <p className="text-xs text-slate-500">{calculatePercentage(appointmentStats.completedAppointments, appointmentStats.totalAppointments)}% of total</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Prescriptions Issued</p>
                                        <p className="text-2xl font-bold text-purple-600">{prescriptionStats.totalPrescriptions}</p>
                                        <p className="text-xs text-slate-500">{prescriptionStats.prescribedMedications} medications</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Monthly Income</p>
                                        <p className="text-2xl font-bold text-orange-600">{formatCurrency(incomeStats.monthlyIncome)}</p>
                                        <p className="text-xs text-slate-500">Average: {formatCurrency(incomeStats.averageIncomePerAppointment)}/appointment</p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-orange-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment Distribution by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm">Completed</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{appointmentStats.completedAppointments}</span>
                                            <Badge variant="secondary">{calculatePercentage(appointmentStats.completedAppointments, appointmentStats.totalAppointments)}%</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <XCircle className="h-4 w-4 text-red-600" />
                                            <span className="text-sm">Cancelled</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{appointmentStats.cancelledAppointments}</span>
                                            <Badge variant="secondary">{calculatePercentage(appointmentStats.cancelledAppointments, appointmentStats.totalAppointments)}%</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-yellow-600" />
                                            <span className="text-sm">Pending</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{appointmentStats.pendingAppointments}</span>
                                            <Badge variant="secondary">{calculatePercentage(appointmentStats.pendingAppointments, appointmentStats.totalAppointments)}%</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Most Prescribed Medications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {prescriptionStats.mostPrescribedMedications.slice(0, 5).map((med, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Pill className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">{med.medication}</span>
                                            </div>
                                            <Badge variant="outline">{med.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Patient Report */}
                <TabsContent value="patients" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <span>General Statistics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Total patients:</span>
                                    <span className="font-medium">{patientStats.totalPatients}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">New patients:</span>
                                    <span className="font-medium text-green-600">+{patientStats.newPatients}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Active patients:</span>
                                    <span className="font-medium">{patientStats.activePatients}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Average age:</span>
                                    <span className="font-medium">{patientStats.averageAge} years</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gender Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Female</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">{patientStats.genderDistribution.female}</span>
                                        <Badge variant="secondary">
                                            {calculatePercentage(patientStats.genderDistribution.female, patientStats.totalPatients)}%
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Male</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">{patientStats.genderDistribution.male}</span>
                                        <Badge variant="secondary">
                                            {calculatePercentage(patientStats.genderDistribution.male, patientStats.totalPatients)}%
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Age Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {patientStats.ageDistribution.map((group, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{group.range} years</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">{group.count}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {calculatePercentage(group.count, patientStats.totalPatients)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Appointment Report */}
                <TabsContent value="appointments" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">{appointmentStats.completedAppointments}</p>
                                        <p className="text-sm text-green-700">Completed</p>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <p className="text-2xl font-bold text-red-600">{appointmentStats.cancelledAppointments}</p>
                                        <p className="text-sm text-red-700">Cancelled</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600">Average time:</span>
                                        <span className="font-medium">{appointmentStats.averageConsultationTime} min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600">Pending appointments:</span>
                                        <span className="font-medium text-yellow-600">{appointmentStats.pendingAppointments}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Appointments by Consultation Type</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {appointmentStats.appointmentsByType.map((type, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{type.type}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">{type.count}</span>
                                            <Badge variant="secondary">
                                                {calculatePercentage(type.count, appointmentStats.totalAppointments)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Appointment Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {appointmentStats.appointmentsByDay.map((day, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{day.day}</span>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-32 bg-slate-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${(day.count / Math.max(...appointmentStats.appointmentsByDay.map(d => d.count))) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-medium w-8 text-right">{day.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Prescription Report */}
                <TabsContent value="prescriptions" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Most Prescribed Medications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {prescriptionStats.mostPrescribedMedications.map((med, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                                                    {index + 1}
                                                </Badge>
                                                <span className="text-sm">{med.medication}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-600 h-2 rounded-full"
                                                        style={{ width: `${(med.count / prescriptionStats.mostPrescribedMedications[0].count) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-medium w-8 text-right">{med.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Most Frequent Diagnoses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {prescriptionStats.frequentDiagnoses.map((diag, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Heart className="h-4 w-4 text-red-500" />
                                                <span className="text-sm">{diag.diagnosis}</span>
                                            </div>
                                            <Badge variant="secondary">{diag.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Prescription Types</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                {prescriptionStats.prescriptionsByType.map((type, index) => (
                                    <div key={index} className="text-center p-4 border rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">{type.count}</p>
                                        <p className="text-sm text-slate-600">{type.type}</p>
                                        <p className="text-xs text-slate-500">
                                            {calculatePercentage(type.count, prescriptionStats.totalPrescriptions)}%
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Income Report */}
                <TabsContent value="income" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-sm text-slate-600">Total Income</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(incomeStats.totalIncome)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-sm text-slate-600">This Month</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(incomeStats.monthlyIncome)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
