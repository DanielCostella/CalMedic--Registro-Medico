import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Calendar,
    Clock,
    Mail,
    FileText,
    Settings,
    Play,
    Pause,
    Download,
    Eye,
    Plus,
    Trash2,
    CheckCircle,
    AlertCircle,
    Send
} from 'lucide-react';

interface AutomaticReport {
    id: string;
    name: string;
    type: 'weekly' | 'monthly' | 'quarterly' | 'annual';
    frequency: string;
    recipients: string[];
    reportType: 'patients' | 'appointments' | 'prescriptions' | 'income' | 'complete';
    active: boolean;
    nextSend: string;
    lastSend: string;
    status: 'active' | 'paused' | 'error';
    configuration: {
        includeCharts: boolean;
        pdfFormat: boolean;
        excelFormat: boolean;
        includeDetails: boolean;
    };
}

interface SendHistory {
    id: string;
    reportId: string;
    date: string;
    recipients: string[];
    status: 'sent' | 'error' | 'pending';
    size: string;
    generationTime: number;
}

interface AutomaticReportsProps {
    doctorId: string;
    doctorName: string;
}

export default function AutomaticReports({ doctorId, doctorName }: AutomaticReportsProps) {
    const [reports, setReports] = useState<AutomaticReport[]>([]);
    const [history, setHistory] = useState<SendHistory[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingReport, setEditingReport] = useState<AutomaticReport | null>(null);
    const [loading, setLoading] = useState(false);

    // Simulated data
    const simulatedReports: AutomaticReport[] = [
        {
            id: '1',
            name: 'Monthly Patient Report',
            type: 'monthly',
            frequency: 'First Monday of each month',
            recipients: ['director@clinic.com', 'admin@clinic.com'],
            reportType: 'patients',
            active: true,
            nextSend: '2024-02-05T09:00:00Z',
            lastSend: '2024-01-01T09:00:00Z',
            status: 'active',
            configuration: {
                includeCharts: true,
                pdfFormat: true,
                excelFormat: false,
                includeDetails: true
            }
        },
        {
            id: '2',
            name: 'Weekly Appointment Summary',
            type: 'weekly',
            frequency: 'Every Friday at 17:00',
            recipients: ['secretary@clinic.com'],
            reportType: 'appointments',
            active: true,
            nextSend: '2024-01-19T17:00:00Z',
            lastSend: '2024-01-12T17:00:00Z',
            status: 'active',
            configuration: {
                includeCharts: false,
                pdfFormat: true,
                excelFormat: true,
                includeDetails: false
            }
        },
        {
            id: '3',
            name: 'Quarterly Income Analysis',
            type: 'quarterly',
            frequency: 'Last day of the quarter',
            recipients: ['accounting@clinic.com', 'management@clinic.com'],
            reportType: 'income',
            active: false,
            nextSend: '2024-03-31T23:59:00Z',
            lastSend: '2023-12-31T23:59:00Z',
            status: 'paused',
            configuration: {
                includeCharts: true,
                pdfFormat: true,
                excelFormat: true,
                includeDetails: true
            }
        }
    ];

    const simulatedHistory: SendHistory[] = [
        {
            id: '1',
            reportId: '1',
            date: '2024-01-01T09:00:00Z',
            recipients: ['director@clinic.com', 'admin@clinic.com'],
            status: 'sent',
            size: '2.4 MB',
            generationTime: 45
        },
        {
            id: '2',
            reportId: '2',
            date: '2024-01-12T17:00:00Z',
            recipients: ['secretary@clinic.com'],
            status: 'sent',
            size: '1.2 MB',
            generationTime: 23
        },
        {
            id: '3',
            reportId: '1',
            date: '2023-12-01T09:00:00Z',
            recipients: ['director@clinic.com'],
            status: 'error',
            size: '0 MB',
            generationTime: 0
        }
    ];

    useEffect(() => {
        setReports(simulatedReports);
        setHistory(simulatedHistory);
    }, []);

    const createReport = () => {
        const newReport: AutomaticReport = {
            id: Date.now().toString(),
            name: 'New Report',
            type: 'monthly',
            frequency: 'First day of the month',
            recipients: [],
            reportType: 'complete',
            active: false,
            nextSend: new Date().toISOString(),
            lastSend: '',
            status: 'paused',
            configuration: {
                includeCharts: true,
                pdfFormat: true,
                excelFormat: false,
                includeDetails: true
            }
        };
        setEditingReport(newReport);
        setShowForm(true);
    };

    const editReport = (report: AutomaticReport) => {
        setEditingReport({ ...report });
        setShowForm(true);
    };

    const saveReport = () => {
        if (!editingReport) return;

        if (reports.find(r => r.id === editingReport.id)) {
            // Update existing
            setReports(prev => prev.map(r => r.id === editingReport.id ? editingReport : r));
        } else {
            // Create new
            setReports(prev => [...prev, editingReport]);
        }

        setShowForm(false);
        setEditingReport(null);
    };

    const deleteReport = (id: string) => {
        setReports(prev => prev.filter(r => r.id !== id));
    };

    const toggleReport = (id: string) => {
        setReports(prev => prev.map(r =>
            r.id === id
                ? { ...r, active: !r.active, status: !r.active ? 'active' : 'paused' }
                : r
        ));
    };

    const manualSendReport = async (id: string) => {
        setLoading(true);
        try {
            // Simulate sending
            await new Promise(resolve => setTimeout(resolve, 2000));

            const report = reports.find(r => r.id === id);
            if (report) {
                const newSend: SendHistory = {
                    id: Date.now().toString(),
                    reportId: id,
                    date: new Date().toISOString(),
                    recipients: report.recipients,
                    status: 'sent',
                    size: '1.8 MB',
                    generationTime: 32
                };
                setHistory(prev => [newSend, ...prev]);
            }
        } catch (error) {
            console.error('Error sending report:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSendStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Automatic Reports</h1>
                    <p className="text-slate-600 mt-1">Configure and manage automatic report delivery</p>
                </div>
                <Button onClick={createReport}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Report
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Active Reports</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {reports.filter(r => r.active).length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Paused Reports</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {reports.filter(r => !r.active).length}
                                </p>
                            </div>
                            <Pause className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Sent This Month</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {history.filter(h => new Date(h.date).getMonth() === new Date().getMonth()).length}
                                </p>
                            </div>
                            <Send className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {history.length > 0 ? Math.round((history.filter(h => h.status === 'sent').length / history.length) * 100) : 0}%
                                </p>
                            </div>
                            <FileText className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Report List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span>Configured Reports</span>
                    </CardTitle>
                    <CardDescription>
                        Manage your scheduled automatic reports
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {reports.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600">No reports configured</p>
                            <Button onClick={createReport} className="mt-4">
                                Create First Report
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report.id} className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Switch
                                                checked={report.active}
                                                onCheckedChange={() => toggleReport(report.id)}
                                            />
                                            <div>
                                                <h4 className="font-medium text-slate-900">{report.name}</h4>
                                                <p className="text-sm text-slate-600">{report.frequency}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge className={getStatusColor(report.status)}>
                                                        {report.status}
                                                    </Badge>
                                                    <Badge variant="outline" className="capitalize">
                                                        {report.reportType}
                                                    </Badge>
                                                    <span className="text-xs text-slate-500">
                                                        {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right text-sm">
                                                <p className="text-slate-600">Next send:</p>
                                                <p className="font-medium">{formatDate(report.nextSend)}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => manualSendReport(report.id)}
                                                disabled={loading}
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => editReport(report)}
                                            >
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => deleteReport(report.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Send History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span>Send History</span>
                    </CardTitle>
                    <CardDescription>
                        Registry of all sent reports
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Report</TableHead>
                                <TableHead>Recipients</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((send) => {
                                const report = reports.find(r => r.id === send.reportId);
                                return (
                                    <TableRow key={send.id}>
                                        <TableCell>{formatDate(send.date)}</TableCell>
                                        <TableCell>{report?.name || 'Deleted report'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                                <span>{send.recipients.length}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getSendStatusColor(send.status)}>
                                                {send.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{send.size}</TableCell>
                                        <TableCell>{send.generationTime}s</TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="ghost">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Form Modal */}
            {showForm && editingReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {reports.find(r => r.id === editingReport.id) ? 'Edit' : 'Create'} Report
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Report Name</Label>
                                <Input
                                    id="name"
                                    value={editingReport.name}
                                    onChange={(e) => setEditingReport({
                                        ...editingReport,
                                        name: e.target.value
                                    })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Report Type</Label>
                                    <Select
                                        value={editingReport.reportType}
                                        onValueChange={(value: 'patients' | 'appointments' | 'prescriptions' | 'income' | 'complete') => setEditingReport({
                                            ...editingReport,
                                            reportType: value
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="patients">Patients</SelectItem>
                                            <SelectItem value="appointments">Appointments</SelectItem>
                                            <SelectItem value="prescriptions">Prescriptions</SelectItem>
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="complete">Complete</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Frequency</Label>
                                    <Select
                                        value={editingReport.type}
                                        onValueChange={(value: 'weekly' | 'monthly' | 'quarterly' | 'annual') => setEditingReport({
                                            ...editingReport,
                                            type: value
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="annual">Annual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="recipients">Recipients (comma separated)</Label>
                                <Input
                                    id="recipients"
                                    value={editingReport.recipients.join(', ')}
                                    onChange={(e) => setEditingReport({
                                        ...editingReport,
                                        recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                                    })}
                                    placeholder="email1@example.com, email2@example.com"
                                />
                            </div>

                            <div>
                                <Label>Configuration</Label>
                                <div className="space-y-3 mt-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="include-charts">Include charts</Label>
                                        <Switch
                                            id="include-charts"
                                            checked={editingReport.configuration.includeCharts}
                                            onCheckedChange={(checked) => setEditingReport({
                                                ...editingReport,
                                                configuration: {
                                                    ...editingReport.configuration,
                                                    includeCharts: checked
                                                }
                                            })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="pdf-format">PDF Format</Label>
                                        <Switch
                                            id="pdf-format"
                                            checked={editingReport.configuration.pdfFormat}
                                            onCheckedChange={(checked) => setEditingReport({
                                                ...editingReport,
                                                configuration: {
                                                    ...editingReport.configuration,
                                                    pdfFormat: checked
                                                }
                                            })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="excel-format">Excel Format</Label>
                                        <Switch
                                            id="excel-format"
                                            checked={editingReport.configuration.excelFormat}
                                            onCheckedChange={(checked) => setEditingReport({
                                                ...editingReport,
                                                configuration: {
                                                    ...editingReport.configuration,
                                                    excelFormat: checked
                                                }
                                            })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="include-details">Include details</Label>
                                        <Switch
                                            id="include-details"
                                            checked={editingReport.configuration.includeDetails}
                                            onCheckedChange={(checked) => setEditingReport({
                                                ...editingReport,
                                                configuration: {
                                                    ...editingReport.configuration,
                                                    includeDetails: checked
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={saveReport}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
