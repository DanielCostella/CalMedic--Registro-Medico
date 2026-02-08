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
import { Patient, Doctor } from '@/types/medical';

interface MedicalReportsListProps {
    selectedPatient?: Patient | null;
    loggedInDoctor?: Doctor | null;
    doctorId?: string;
    doctorName?: string;
}

// Specific types for chart data
interface VitalSigns {
    date: string;
    systolicPressure: number;
    diastolicPressure: number;
    heartRate: number;
    temperature: number;
    weight: number;
}

interface ExamData {
    type: string;
    count: number;
    percentage: number;
}

interface DiagnosisData {
    diagnosis: string;
    count: number;
    percentage: number;
}

interface MonthlyConsultations {
    month: string;
    consultations: number;
    newPatients: number;
    followUp: number;
}

interface DetailedReport {
    id: string;
    type: string;
    patient: Patient | null;
    startDate: string;
    endDate: string;
    generationDate: string;
    doctor: Doctor | null;
    data: {
        vitalSigns: VitalSigns[];
        exams: ExamData[];
        diagnoses: DiagnosisData[];
        monthlyConsultations: MonthlyConsultations[];
    };
}

// Mock data for charts
const mockVitalSigns: VitalSigns[] = [
    { date: '2024-01-01', systolicPressure: 120, diastolicPressure: 80, heartRate: 72, temperature: 36.5, weight: 70 },
    { date: '2024-01-15', systolicPressure: 125, diastolicPressure: 82, heartRate: 75, temperature: 36.7, weight: 69.5 },
    { date: '2024-02-01', systolicPressure: 118, diastolicPressure: 78, heartRate: 70, temperature: 36.4, weight: 69 },
    { date: '2024-02-15', systolicPressure: 122, diastolicPressure: 79, heartRate: 73, temperature: 36.6, weight: 68.5 },
    { date: '2024-03-01', systolicPressure: 115, diastolicPressure: 75, heartRate: 68, temperature: 36.3, weight: 68 }
];

const mockExams: ExamData[] = [
    { type: 'Laboratory', count: 45, percentage: 60 },
    { type: 'Imaging', count: 20, percentage: 27 },
    { type: 'Functional', count: 10, percentage: 13 }
];

const mockDiagnoses: DiagnosisData[] = [
    { diagnosis: 'Hypertension', count: 15, percentage: 25 },
    { diagnosis: 'Diabetes', count: 12, percentage: 20 },
    { diagnosis: 'Respiratory Infections', count: 10, percentage: 17 },
    { diagnosis: 'Gastritis', count: 8, percentage: 13 },
    { diagnosis: 'Others', count: 15, percentage: 25 }
];

const mockMonthlyConsultations: MonthlyConsultations[] = [
    { month: 'Jan', consultations: 45, newPatients: 12, followUp: 33 },
    { month: 'Feb', consultations: 52, newPatients: 15, followUp: 37 },
    { month: 'Mar', consultations: 48, newPatients: 10, followUp: 38 },
    { month: 'Apr', consultations: 55, newPatients: 18, followUp: 37 },
    { month: 'May', consultations: 60, newPatients: 20, followUp: 40 }
];

const MedicalReportsList: React.FC<MedicalReportsListProps> = ({
    selectedPatient,
    loggedInDoctor,
    doctorId,
    doctorName
}) => {
    const [patients] = useState<Patient[]>(mockPacientes);
    const [doctors] = useState<Doctor[]>(mockMedicos);
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('individual');
    const [patientReportId, setPatientReportId] = useState(selectedPatient?.id || '');
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-05-31');
    const [showDetailedReport, setShowDetailedReport] = useState(false);
    const [selectedDetailedReport, setSelectedDetailedReport] = useState<DetailedReport | null>(null);

    // Default doctor if none provided
    const currentDoctor = loggedInDoctor || doctors.find(d => d.id === doctorId) || doctors[0];

    useEffect(() => {
        // Simulate data loading
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const getPatient = (id: string) => patients.find(p => p.id === id);

    const generateReport = () => {
        const patient = getPatient(patientReportId);

        const report: DetailedReport = {
            id: Date.now().toString(),
            type: reportType,
            patient: patient || null,
            startDate,
            endDate,
            generationDate: new Date().toISOString().split('T')[0],
            doctor: currentDoctor,
            data: {
                vitalSigns: mockVitalSigns,
                exams: mockExams,
                diagnoses: mockDiagnoses,
                monthlyConsultations: mockMonthlyConsultations
            }
        };

        setSelectedDetailedReport(report);
        setShowDetailedReport(true);
    };

    const exportReportPDF = (report: DetailedReport) => {
        console.log('Exporting report to PDF:', report);
        alert('Medical report exported to PDF (simulation)');
    };

    // Simple chart component (mocked)
    const LineChart = ({ data, title, field }: { data: VitalSigns[] | MonthlyConsultations[], title: string, field: string }) => (
        <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-100">{title}</h4>
            <div className="h-48 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-end justify-around p-4 border dark:border-slate-600">
                {data.map((item, index) => {
                    const value = (item as any)[field] as number;
                    const maxValue = Math.max(...data.map(d => (d as any)[field] as number));

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className="bg-blue-500 dark:bg-blue-400 rounded-t w-8 mb-2 transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-500"
                                style={{ height: `${(value / maxValue) * 120}px` }}
                            />
                            <div className="text-[10px] text-slate-600 dark:text-slate-400 transform rotate-45 origin-left w-6 truncate">
                                {(item as VitalSigns).date?.split('-')[1] || (item as MonthlyConsultations).month}
                            </div>
                            <div className="text-[10px] font-medium mt-1 dark:text-slate-300">{value}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const BarChart = ({ data, title }: { data: ExamData[] | DiagnosisData[], title: string }) => (
        <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-100">{title}</h4>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-24 text-xs text-slate-600 dark:text-slate-400 truncate">
                            {(item as ExamData).type || (item as DiagnosisData).diagnosis}
                        </div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 relative overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                                style={{ width: `${item.percentage}%` }}
                            >
                                <span className="text-white text-[10px] font-medium">{item.count}</span>
                            </div>
                        </div>
                        <div className="w-10 text-xs text-slate-600 dark:text-slate-400">{item.percentage}%</div>
                    </div>
                ))}
            </div>
        </div>
    );

    const PieChartComponent = ({ data, title }: { data: DiagnosisData[], title: string }) => {
        const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

        return (
            <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-100">{title}</h4>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="relative w-32 h-32">
                        <div className="w-32 h-32 rounded-full border-8 border-slate-100 dark:border-slate-800 bg-gradient-to-tr from-purple-400 via-blue-400 to-green-400 animate-spin-slow"></div>
                        <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
                            <div className="text-center">
                                <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.reduce((sum, item) => sum + item.count, 0)}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                />
                                <div className="text-xs text-slate-700 dark:text-slate-300">
                                    {item.diagnosis}: <span className="font-semibold">{item.count}</span> ({item.percentage}%)
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
                <LoadingSpinner size="lg" text="Loading medical reports..." />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Medical Reports</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Results visualization and statistical analysis
                    </p>
                </div>
            </div>

            {/* Report Configuration */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Generate Report
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="reportType" className="dark:text-slate-300">Report Type</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger className="dark:bg-slate-750 dark:border-slate-600">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="individual">Patient Individual</SelectItem>
                                    <SelectItem value="follow-up">Treatment Follow-up</SelectItem>
                                    <SelectItem value="statistical">General Statistical</SelectItem>
                                    <SelectItem value="exams">Exam Results</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {reportType === 'individual' && (
                            <div className="space-y-1">
                                <Label htmlFor="patient" className="dark:text-slate-300">Patient</Label>
                                {selectedPatient ? (
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-sm text-blue-800 dark:text-blue-300">
                                        {selectedPatient.firstName} {selectedPatient.lastName}
                                    </div>
                                ) : (
                                    <Select value={patientReportId} onValueChange={setPatientReportId}>
                                        <SelectTrigger className="dark:bg-slate-750 dark:border-slate-600">
                                            <SelectValue placeholder="Select patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map(patient => (
                                                <SelectItem key={patient.id} value={patient.id}>
                                                    {patient.firstName} {patient.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="startDate" className="dark:text-slate-300">Start Date</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="dark:bg-slate-750 dark:border-slate-600 dark:text-slate-100"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="endDate" className="dark:text-slate-300">End Date</Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="dark:bg-slate-750 dark:border-slate-600 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Generate Report
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Statistical Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow duration-300 dark:bg-slate-800 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Patients</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">248</p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">+12% vs last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300 dark:bg-slate-800 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Consultations</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">1,245</p>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
                                <Stethoscope className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">+8% vs last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300 dark:bg-slate-800 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Exams</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">756</p>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                                <TestTube className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">+15% vs last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300 dark:bg-slate-800 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Medications</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">2,134</p>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                                <Pill className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">+5% vs last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChart
                    data={mockVitalSigns}
                    title="Blood Pressure Evolution"
                    field="systolicPressure"
                />
                <BarChart
                    data={mockExams}
                    title="Exam Distribution"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieChartComponent
                    data={mockDiagnoses}
                    title="Most Frequent Diagnoses"
                />
                <LineChart
                    data={mockMonthlyConsultations}
                    title="Monthly Consultations"
                    field="consultations"
                />
            </div>

            {/* Recent Reports */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                        <FileText className="w-5 h-5 text-slate-500" />
                        Recent Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            {
                                id: '1',
                                type: 'Patient Individual',
                                patient: 'Maria Gonzalez',
                                date: '2024-05-15',
                                doctor: 'Dr. Carlos Rodriguez'
                            },
                            {
                                id: '2',
                                type: 'General Statistical',
                                patient: 'All patients',
                                date: '2024-05-10',
                                doctor: 'Dr. Ana Martinez'
                            },
                            {
                                id: '3',
                                type: 'Treatment Follow-up',
                                patient: 'Juan Perez',
                                date: '2024-05-08',
                                doctor: 'Dr. Carlos Rodriguez'
                            }
                        ].map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-100">{report.type}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                {report.patient} • {report.doctor} • {new Date(report.date).toLocaleDateString('en-US')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                        <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                        <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Report Modal */}
            <Dialog open={showDetailedReport} onOpenChange={setShowDetailedReport}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-700">
                    {selectedDetailedReport && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold dark:text-slate-100">
                                    Medical Report - {selectedDetailedReport.type}
                                    {selectedDetailedReport.patient && (
                                        <span className="text-sm font-normal text-slate-500 block mt-1 italic">
                                            Patient: {selectedDetailedReport.patient.firstName} {selectedDetailedReport.patient.lastName}
                                        </span>
                                    )}
                                </DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="charts" className="w-full mt-6">
                                <TabsList className="grid w-full grid-cols-4 dark:bg-slate-800">
                                    <TabsTrigger value="charts">Charts</TabsTrigger>
                                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                                    <TabsTrigger value="trends">Trends</TabsTrigger>
                                    <TabsTrigger value="summary">Summary</TabsTrigger>
                                </TabsList>

                                <TabsContent value="charts" className="space-y-6 pt-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <LineChart
                                            data={selectedDetailedReport.data.vitalSigns}
                                            title="Systolic Blood Pressure"
                                            field="systolicPressure"
                                        />
                                        <LineChart
                                            data={selectedDetailedReport.data.vitalSigns}
                                            title="Heart Rate"
                                            field="heartRate"
                                        />
                                        <LineChart
                                            data={selectedDetailedReport.data.vitalSigns}
                                            title="Body Weight"
                                            field="weight"
                                        />
                                        <LineChart
                                            data={selectedDetailedReport.data.vitalSigns}
                                            title="Temperature"
                                            field="temperature"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="statistics" className="space-y-6 pt-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <BarChart
                                            data={selectedDetailedReport.data.exams}
                                            title="Exam Distribution"
                                        />
                                        <PieChartComponent
                                            data={selectedDetailedReport.data.diagnoses}
                                            title="Diagnoses by Frequency"
                                        />
                                    </div>

                                    {/* Detailed Statistics Table */}
                                    <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                                        <CardHeader className="bg-slate-50 dark:bg-slate-750">
                                            <CardTitle className="text-lg">Detailed Statistics</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
                                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Parameter</th>
                                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Average</th>
                                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Minimum</th>
                                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Maximum</th>
                                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Trend</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y dark:divide-slate-700">
                                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors">
                                                            <td className="p-4 font-medium dark:text-slate-200">Systolic Pressure</td>
                                                            <td className="p-4 dark:text-slate-300">120 mmHg</td>
                                                            <td className="p-4 dark:text-slate-300">115 mmHg</td>
                                                            <td className="p-4 dark:text-slate-300">125 mmHg</td>
                                                            <td className="p-4">
                                                                <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                                                                    Improving
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors">
                                                            <td className="p-4 font-medium dark:text-slate-200">Heart Rate</td>
                                                            <td className="p-4 dark:text-slate-300">72 bpm</td>
                                                            <td className="p-4 dark:text-slate-300">68 bpm</td>
                                                            <td className="p-4 dark:text-slate-300">75 bpm</td>
                                                            <td className="p-4">
                                                                <Badge variant="outline" className="text-blue-600 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                                                                    Stable
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors">
                                                            <td className="p-4 font-medium dark:text-slate-200">Weight</td>
                                                            <td className="p-4 dark:text-slate-300">69.0 kg</td>
                                                            <td className="p-4 dark:text-slate-300">68.0 kg</td>
                                                            <td className="p-4 dark:text-slate-300">70.0 kg</td>
                                                            <td className="p-4">
                                                                <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                                                                    Reducing
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="trends" className="space-y-6 pt-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <LineChart
                                            data={selectedDetailedReport.data.monthlyConsultations}
                                            title="Evolution of Monthly Consultations"
                                            field="consultations"
                                        />
                                    </div>

                                    {/* Trends Analysis */}
                                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Trends Analysis</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="p-5 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="p-2 bg-green-600 rounded-lg">
                                                            <TrendingUp className="w-4 h-4 text-white" />
                                                        </div>
                                                        <h4 className="font-bold text-green-900 dark:text-green-400">Positive Trends</h4>
                                                    </div>
                                                    <ul className="text-sm text-green-800 dark:text-green-300/80 space-y-2">
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-green-600 dark:text-green-500">•</span>
                                                            <span>Progressive reduction in blood pressure</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-green-600 dark:text-green-500">•</span>
                                                            <span>Constant and healthy weight loss</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-green-600 dark:text-green-500">•</span>
                                                            <span>Improvement in resting heart rate</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="p-2 bg-blue-600 rounded-lg">
                                                            <Activity className="w-4 h-4 text-white" />
                                                        </div>
                                                        <h4 className="font-bold text-blue-900 dark:text-blue-400">Stable Parameters</h4>
                                                    </div>
                                                    <ul className="text-sm text-blue-800 dark:text-blue-300/80 space-y-2">
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-blue-600 dark:text-blue-500">•</span>
                                                            <span>Body temperature within normal ranges</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-blue-600 dark:text-blue-500">•</span>
                                                            <span>Adherence to pharmacological treatment</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-blue-600 dark:text-blue-500">•</span>
                                                            <span>Regular attendance at follow-up consultations</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="summary" className="space-y-6 pt-6">
                                    {/* Report Information */}
                                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Report Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-blue-500" />
                                                        Patient Data
                                                    </h4>
                                                    {selectedDetailedReport.patient && (
                                                        <div className="text-sm space-y-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-750 p-4 rounded-lg">
                                                            <div className="flex justify-between border-b dark:border-slate-600 pb-1">
                                                                <span className="font-medium text-slate-500 uppercase text-[10px]">Name</span>
                                                                <span>{selectedDetailedReport.patient.firstName} {selectedDetailedReport.patient.lastName}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b dark:border-slate-600 pb-1">
                                                                <span className="font-medium text-slate-500 uppercase text-[10px]">National ID</span>
                                                                <span>{selectedDetailedReport.patient.nationalId}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b dark:border-slate-600 pb-1">
                                                                <span className="font-medium text-slate-500 uppercase text-[10px]">Birth Date</span>
                                                                <span>{selectedDetailedReport.patient.birthDate}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-purple-500" />
                                                        Report Details
                                                    </h4>
                                                    <div className="text-sm space-y-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-750 p-4 rounded-lg">
                                                        <div className="flex justify-between border-b dark:border-slate-600 pb-1">
                                                            <span className="font-medium text-slate-500 uppercase text-[10px]">Type</span>
                                                            <span>{selectedDetailedReport.type.charAt(0).toUpperCase() + selectedDetailedReport.type.slice(1)}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b dark:border-slate-600 pb-1">
                                                            <span className="font-medium text-slate-500 uppercase text-[10px]">Period</span>
                                                            <span>{selectedDetailedReport.startDate} to {selectedDetailedReport.endDate}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b dark:border-slate-600 pb-1">
                                                            <span className="font-medium text-slate-500 uppercase text-[10px]">Generated By</span>
                                                            <span>Dr. {selectedDetailedReport.doctor?.firstName} {selectedDetailedReport.doctor?.lastName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium text-slate-500 uppercase text-[10px]">Generation Date</span>
                                                            <span>{new Date(selectedDetailedReport.generationDate).toLocaleDateString('en-US')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Executive Summary */}
                                    <Card className="dark:bg-slate-800 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Executive Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0">
                                            <div className="prose dark:prose-invert max-w-none">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                                    This report analyzes the patient's clinical evolution during the period from
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200"> {selectedDetailedReport.startDate} </span> to
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200"> {selectedDetailedReport.endDate}</span>.
                                                </p>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                                                            <Badge className="bg-blue-600 h-2 w-2 rounded-full p-0" />
                                                            Key Findings:
                                                        </h5>
                                                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-none p-0">
                                                            <li className="flex items-center gap-2">• Significant improvement in blood pressure control</li>
                                                            <li className="flex items-center gap-2">• Progressive reduction in body weight</li>
                                                            <li className="flex items-center gap-2">• Stabilization of heart rate</li>
                                                            <li className="flex items-center gap-2">• Good adherence to the prescribed treatment</li>
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                                                            <Badge className="bg-green-600 h-2 w-2 rounded-full p-0" />
                                                            Recommendations:
                                                        </h5>
                                                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-none p-0">
                                                            <li className="flex items-center gap-2">• Continue with current antihypertensive treatment</li>
                                                            <li className="flex items-center gap-2">• Maintain regular physical exercise program</li>
                                                            <li className="flex items-center gap-2">• Medical check-up every 3 months</li>
                                                            <li className="flex items-center gap-2">• Home blood pressure monitoring</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-slate-700">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDetailedReport(false)}
                                    className="dark:border-slate-600 dark:text-slate-300"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => exportReportPDF(selectedDetailedReport)}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MedicalReportsList;
