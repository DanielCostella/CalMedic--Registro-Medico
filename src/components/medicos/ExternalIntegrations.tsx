import React, { useState, useEffect } from 'react';
import { Link, Calendar, DollarSign, Video, Shield, Settings, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

interface ExternalIntegration {
    id: string;
    name: string;
    description: string;
    category: 'Calendar' | 'Billing' | 'Telemedicine' | 'Insurance' | 'Laboratories' | 'Pharmacy';
    provider: string;
    version: string;
    status: 'Connected' | 'Disconnected' | 'Error' | 'Configuring';
    connectionDate: string;
    lastSync: string;
    configuration: IntegrationConfiguration;
    statistics: IntegrationStatistics;
    icon: string;
    color: string;
}

interface IntegrationConfiguration {
    apiKey?: string;
    apiSecret?: string;
    endpoint?: string;
    webhookUrl?: string;
    autoSync: boolean;
    syncInterval: number; // in minutes
    specificSettings: Record<string, string | number | boolean>;
}

interface IntegrationStatistics {
    totalSyncs: number;
    successfulSyncs: number;
    errors: number;
    lastError?: string;
    dataTransferred: number; // in bytes
    averageResponseTime: number; // in ms
}

interface IntegrationLog {
    id: string;
    integrationId: string;
    date: string;
    type: 'Sync' | 'Error' | 'Configuration' | 'Webhook';
    message: string;
    details?: string;
    status: 'Success' | 'Error' | 'Warning';
}

const ExternalIntegrations: React.FC = () => {
    const [integrations, setIntegrations] = useState<ExternalIntegration[]>([]);
    const [logs, setLogs] = useState<IntegrationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState<string | null>(null);
    const [selectedIntegration, setSelectedIntegration] = useState<ExternalIntegration | null>(null);

    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        // Simulate loading integrations
        setTimeout(() => {
            const initialIntegrations: ExternalIntegration[] = [
                {
                    id: '1',
                    name: 'Google Calendar',
                    description: 'Sync appointments with Google Calendar',
                    category: 'Calendar',
                    provider: 'Google',
                    version: '3.0',
                    status: 'Connected',
                    connectionDate: '2024-01-01',
                    lastSync: '2024-01-16 14:30:00',
                    configuration: {
                        apiKey: 'AIza***************',
                        autoSync: true,
                        syncInterval: 15,
                        specificSettings: {
                            calendarId: 'primary',
                            eventTypes: 'medical_appointments',
                            reminders: true
                        }
                    },
                    statistics: {
                        totalSyncs: 1250,
                        successfulSyncs: 1245,
                        errors: 5,
                        dataTransferred: 2048000,
                        averageResponseTime: 150
                    },
                    icon: '📅',
                    color: '#4285F4'
                },
                {
                    id: '2',
                    name: 'Stripe Payments',
                    description: 'Payment processing and billing',
                    category: 'Billing',
                    provider: 'Stripe',
                    version: '2023-10-16',
                    status: 'Connected',
                    connectionDate: '2024-01-02',
                    lastSync: '2024-01-16 13:45:00',
                    configuration: {
                        apiKey: 'sk_test_***************',
                        webhookUrl: 'https://api.clinica.com/webhooks/stripe',
                        autoSync: true,
                        syncInterval: 60,
                        specificSettings: {
                            currency: 'USD',
                            acceptedMethods: 'card,bank_transfer',
                            autoInvoice: true
                        }
                    },
                    statistics: {
                        totalSyncs: 890,
                        successfulSyncs: 885,
                        errors: 5,
                        dataTransferred: 1536000,
                        averageResponseTime: 200
                    },
                    icon: '💳',
                    color: '#635BFF'
                },
                {
                    id: '3',
                    name: 'Zoom Healthcare',
                    description: 'Telemedicine and video consultation platform',
                    category: 'Telemedicine',
                    provider: 'Zoom',
                    version: '5.16.10',
                    status: 'Connected',
                    connectionDate: '2024-01-03',
                    lastSync: '2024-01-16 15:20:00',
                    configuration: {
                        apiKey: 'zoom_api_***************',
                        apiSecret: 'zoom_secret_***************',
                        autoSync: true,
                        syncInterval: 30,
                        specificSettings: {
                            meetingType: 'healthcare',
                            autoRecording: false,
                            waitingRoom: true,
                            encryption: true
                        }
                    },
                    statistics: {
                        totalSyncs: 456,
                        successfulSyncs: 450,
                        errors: 6,
                        dataTransferred: 5120000,
                        averageResponseTime: 300
                    },
                    icon: '🎥',
                    color: '#2D8CFF'
                },
                {
                    id: '4',
                    name: 'Microsoft Outlook',
                    description: 'Calendar and email sync',
                    category: 'Calendar',
                    provider: 'Microsoft',
                    version: 'Graph API 1.0',
                    status: 'Disconnected',
                    connectionDate: '2024-01-04',
                    lastSync: '2024-01-15 10:00:00',
                    configuration: {
                        apiKey: 'outlook_***************',
                        autoSync: false,
                        syncInterval: 30,
                        specificSettings: {
                            calendarId: 'calendar',
                            syncEmail: false,
                            notifications: true
                        }
                    },
                    statistics: {
                        totalSyncs: 234,
                        successfulSyncs: 220,
                        errors: 14,
                        lastError: 'Access token expired',
                        dataTransferred: 1024000,
                        averageResponseTime: 250
                    },
                    icon: '📧',
                    color: '#0078D4'
                },
                {
                    id: '5',
                    name: 'LabCorp Connect',
                    description: 'Integration with LabCorp laboratory',
                    category: 'Laboratories',
                    provider: 'LabCorp',
                    version: '2.1',
                    status: 'Error',
                    connectionDate: '2024-01-05',
                    lastSync: '2024-01-16 08:00:00',
                    configuration: {
                        endpoint: 'https://api.labcorp.com/v2',
                        apiKey: 'labcorp_***************',
                        autoSync: true,
                        syncInterval: 60,
                        specificSettings: {
                            resultTypes: 'hematology,chemistry,microbiology',
                            criticalAlerts: true,
                            resultFormat: 'HL7'
                        }
                    },
                    statistics: {
                        totalSyncs: 167,
                        successfulSyncs: 145,
                        errors: 22,
                        lastError: 'Authentication error - Verify credentials',
                        dataTransferred: 3072000,
                        averageResponseTime: 500
                    },
                    icon: '🧪',
                    color: '#E74C3C'
                },
                {
                    id: '6',
                    name: 'Aetna Insurance API',
                    description: 'Medical insurance verification',
                    category: 'Insurance',
                    provider: 'Aetna',
                    version: '1.5',
                    status: 'Configuring',
                    connectionDate: '2024-01-15',
                    lastSync: '',
                    configuration: {
                        endpoint: 'https://api.aetna.com/v1',
                        apiKey: '',
                        autoSync: false,
                        syncInterval: 120,
                        specificSettings: {
                            verificationTypes: 'eligibility,benefits,authorizations',
                            responseFormat: 'JSON'
                        }
                    },
                    statistics: {
                        totalSyncs: 0,
                        successfulSyncs: 0,
                        errors: 0,
                        dataTransferred: 0,
                        averageResponseTime: 0
                    },
                    icon: '🛡️',
                    color: '#FF6B35'
                }
            ];

            const initialLogs: IntegrationLog[] = [
                {
                    id: '1',
                    integrationId: '1',
                    date: '2024-01-16 14:30:00',
                    type: 'Sync',
                    message: 'Successful sync with Google Calendar',
                    details: '15 events synced correctly',
                    status: 'Success'
                },
                {
                    id: '2',
                    integrationId: '5',
                    date: '2024-01-16 08:00:00',
                    type: 'Error',
                    message: 'Authentication error with LabCorp',
                    details: 'Invalid or expired API token. Error code: AUTH_001',
                    status: 'Error'
                },
                {
                    id: '3',
                    integrationId: '2',
                    date: '2024-01-16 13:45:00',
                    type: 'Webhook',
                    message: 'Webhook received from Stripe',
                    details: 'Payment processed successfully - $150.00',
                    status: 'Success'
                },
                {
                    id: '4',
                    integrationId: '4',
                    date: '2024-01-15 10:00:00',
                    type: 'Error',
                    message: 'Lost connection with Microsoft Outlook',
                    details: 'Access token expired. Re-authentication required.',
                    status: 'Error'
                },
                {
                    id: '5',
                    integrationId: '3',
                    date: '2024-01-16 15:20:00',
                    type: 'Sync',
                    message: 'Zoom meeting created',
                    details: 'Video consultation scheduled for Dr. Perez - 16:00',
                    status: 'Success'
                }
            ];

            setIntegrations(initialIntegrations);
            setLogs(initialLogs);
            setLoading(false);
        }, 1000);
    }, []);

    const syncIntegration = async (integrationId: string) => {
        setSyncing(integrationId);

        // Simulate sync
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update last sync
        setIntegrations(prev => prev.map(integration =>
            integration.id === integrationId ? {
                ...integration,
                lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19),
                statistics: {
                    ...integration.statistics,
                    totalSyncs: integration.statistics.totalSyncs + 1,
                    successfulSyncs: integration.statistics.successfulSyncs + 1
                }
            } : integration
        ));

        // Add log
        const newLog: IntegrationLog = {
            id: Date.now().toString(),
            integrationId,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            type: 'Sync',
            message: `Manual sync successful`,
            status: 'Success'
        };

        setLogs(prev => [newLog, ...prev]);
        setSyncing(null);
    };

    const changeIntegrationStatus = (integrationId: string, newStatus: ExternalIntegration['status']) => {
        setIntegrations(prev => prev.map(integration =>
            integration.id === integrationId ? { ...integration, status: newStatus } : integration
        ));
    };

    const testConnection = async (integrationId: string) => {
        setSyncing(integrationId);

        // Simulate connection test
        await new Promise(resolve => setTimeout(resolve, 1500));

        const success = Math.random() > 0.3; // 70% success rate

        const newLog: IntegrationLog = {
            id: Date.now().toString(),
            integrationId,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            type: 'Configuration',
            message: success ? 'Connection test successful' : 'Connection test failed',
            details: success ? 'All endpoints are responding correctly' : 'Connection timeout',
            status: success ? 'Success' : 'Error'
        };

        setLogs(prev => [newLog, ...prev]);

        if (success) {
            changeIntegrationStatus(integrationId, 'Connected');
        }

        setSyncing(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusColor = (status: ExternalIntegration['status']) => {
        switch (status) {
            case 'Connected': return 'text-green-600 bg-green-50 border-green-200';
            case 'Disconnected': return 'text-gray-600 bg-gray-50 border-gray-200';
            case 'Error': return 'text-red-600 bg-red-50 border-red-200';
            case 'Configuring': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const filteredIntegrations = integrations.filter(integration => {
        const matchCategory = !categoryFilter || integration.category === categoryFilter;
        const matchStatus = !statusFilter || integration.status === statusFilter;

        return matchCategory && matchStatus;
    });

    const categories = [...new Set(integrations.map(i => i.category))];

    if (loading) {
        return (
            <div className="p-6">
                <LoadingSpinner size="lg" text="Loading external integrations..." />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Link className="w-8 h-8 text-blue-600" />
                        External Integrations
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Connections with external systems and third-party APIs
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="dark:border-slate-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Global Settings
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Zap className="w-4 h-4 mr-2" />
                        New Integration
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Integrations</p>
                                <p className="text-2xl font-bold">{integrations.length}</p>
                            </div>
                            <Link className="w-8 h-8 text-blue-200/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Connected</p>
                                <p className="text-2xl font-bold">
                                    {integrations.filter(i => i.status === 'Connected').length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-200/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">With Errors</p>
                                <p className="text-2xl font-bold">
                                    {integrations.filter(i => i.status === 'Error').length}
                                </p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-200/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Data Transferred</p>
                                <p className="text-2xl font-bold">
                                    {formatFileSize(integrations.reduce((total, i) => total + i.statistics.dataTransferred, 0))}
                                </p>
                            </div>
                            <Zap className="w-8 h-8 text-orange-200/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center">
                            <Label className="dark:text-slate-300">Filter integrations</Label>
                        </div>

                        <div className="flex gap-2">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-40 dark:bg-slate-900 dark:border-slate-700">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Categories">All Categories</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40 dark:bg-slate-900 dark:border-slate-700">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                                    <SelectItem value="Connected">Connected</SelectItem>
                                    <SelectItem value="Disconnected">Disconnected</SelectItem>
                                    <SelectItem value="Error">Error</SelectItem>
                                    <SelectItem value="Configuring">Configuring</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Integration List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredIntegrations.map(integration => (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{integration.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-lg dark:text-slate-100">{integration.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={getStatusColor(integration.status)}
                                >
                                    {integration.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <div>
                                    <strong>Provider:</strong> {integration.provider}
                                </div>
                                <div>
                                    <strong>Version:</strong> {integration.version}
                                </div>
                                <div>
                                    <strong>Category:</strong> {integration.category}
                                </div>
                                <div>
                                    <strong>Last Sync:</strong> {
                                        integration.lastSync ?
                                            new Date(integration.lastSync).toLocaleString('en-US') :
                                            'Never'
                                    }
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 mb-4 border dark:border-slate-700">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-3">
                                    <div className="space-y-1">
                                        <span className="text-gray-500 uppercase font-bold tracking-wider text-[10px]">Syncs</span>
                                        <div className="font-bold dark:text-slate-200">
                                            {integration.statistics.successfulSyncs}/{integration.statistics.totalSyncs}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-gray-500 uppercase font-bold tracking-wider text-[10px]">Data</span>
                                        <div className="font-bold dark:text-slate-200">{formatFileSize(integration.statistics.dataTransferred)}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-gray-500 uppercase font-bold tracking-wider text-[10px]">Resp. Time</span>
                                        <div className="font-bold dark:text-slate-200">{integration.statistics.averageResponseTime}ms</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-gray-500 uppercase font-bold tracking-wider text-[10px]">Errors</span>
                                        <div className="font-bold text-red-600">{integration.statistics.errors}</div>
                                    </div>
                                </div>

                                {integration.statistics.totalSyncs > 0 && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-500 uppercase tracking-tighter">
                                            <span>Success Rate</span>
                                            <span>{Math.round((integration.statistics.successfulSyncs / integration.statistics.totalSyncs) * 100)}%</span>
                                        </div>
                                        <Progress
                                            value={(integration.statistics.successfulSyncs / integration.statistics.totalSyncs) * 100}
                                            className="h-1"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Error message */}
                            {integration.statistics.lastError && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-lg p-3 mb-4">
                                    <p className="text-xs text-red-700 dark:text-red-400">
                                        <strong>Last Error:</strong> {integration.statistics.lastError}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => syncIntegration(integration.id)}
                                    disabled={syncing === integration.id}
                                    className="h-9 w-9 p-0 dark:border-slate-700"
                                    title="Manual Sync"
                                >
                                    {syncing === integration.id ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => testConnection(integration.id)}
                                    disabled={syncing === integration.id}
                                    className="h-9 w-9 p-0 dark:border-slate-700"
                                    title="Test Connection"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedIntegration(integration)}
                                    className="h-9 flex-1 dark:border-slate-700"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configure
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open('#', '_blank')}
                                    className="h-9 w-9 p-0 dark:border-slate-700"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Activity Logs */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                        <Shield className="w-5 h-5 text-blue-500" />
                        Activity Logs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {logs.slice(0, 5).map(log => (
                            <div key={log.id} className="flex items-start gap-4 p-4 border dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                                <div className={`w-2.5 h-2.5 rounded-full mt-2.5 flex-shrink-0 ${log.status === 'Success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                        log.status === 'Error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                                    }`} />

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{log.message}</span>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-1.5 h-5">
                                                {log.type}
                                            </Badge>
                                            <span className="text-[10px] font-semibold text-slate-500">
                                                {new Date(log.date).toLocaleString('en-US')}
                                            </span>
                                        </div>
                                    </div>

                                    {log.details && (
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{log.details}</p>
                                    )}

                                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 uppercase">
                                        {integrations.find(i => i.id === log.integrationId)?.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Configuration Modal */}
            <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
                    {selectedIntegration && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-3 text-2xl font-bold dark:text-slate-100">
                                    <div className="text-3xl">{selectedIntegration.icon}</div>
                                    Configuration - {selectedIntegration.name}
                                </DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="general" className="w-full mt-4">
                                <TabsList className="grid w-full grid-cols-3 dark:bg-slate-800">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="config">Settings</TabsTrigger>
                                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-6 pt-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Name</Label>
                                            <Input value={selectedIntegration.name} readOnly className="dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Provider</Label>
                                            <Input value={selectedIntegration.provider} readOnly className="dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Description</Label>
                                        <Input value={selectedIntegration.description} readOnly className="dark:bg-slate-800 dark:border-slate-700" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Category</Label>
                                            <Input value={selectedIntegration.category} readOnly className="dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Version</Label>
                                            <Input value={selectedIntegration.version} readOnly className="dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider block">Status</Label>
                                            <Badge className={`${getStatusColor(selectedIntegration.status)} h-10 w-full justify-center text-sm font-bold`}>
                                                {selectedIntegration.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Connection Date</Label>
                                            <Input value={new Date(selectedIntegration.connectionDate).toLocaleDateString('en-US')} readOnly className="dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Last Sync</Label>
                                            <Input value={
                                                selectedIntegration.lastSync ?
                                                    new Date(selectedIntegration.lastSync).toLocaleString('en-US') :
                                                    'Never'
                                            } readOnly className="dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="config" className="space-y-6 pt-6">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                        <div>
                                            <Label className="font-bold dark:text-slate-200">Auto Sync</Label>
                                            <p className="text-xs text-slate-500">Automatically sync data in the background</p>
                                        </div>
                                        <Switch
                                            checked={selectedIntegration.configuration.autoSync}
                                            onCheckedChange={() => { }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Sync Interval (minutes)</Label>
                                        <Input
                                            type="number"
                                            value={selectedIntegration.configuration.syncInterval}
                                            onChange={() => { }}
                                            className="dark:bg-slate-800 dark:border-slate-700"
                                        />
                                    </div>

                                    {selectedIntegration.configuration.apiKey !== undefined && (
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">API Key</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="password"
                                                    value={selectedIntegration.configuration.apiKey}
                                                    readOnly
                                                    className="font-mono dark:bg-slate-800 dark:border-slate-700 flex-1"
                                                />
                                                <Button variant="outline" size="sm" className="h-10">Rotate</Button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedIntegration.configuration.webhookUrl && (
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Webhook URL</Label>
                                            <Input value={selectedIntegration.configuration.webhookUrl} readOnly className="dark:bg-slate-800 dark:border-slate-700" />
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="stats" className="pt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">Total Syncs</span>
                                            <div className="text-2xl font-bold dark:text-slate-100">{selectedIntegration.statistics.totalSyncs}</div>
                                        </div>
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/50">
                                            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest block mb-1">Success Rate</span>
                                            <div className="text-2xl font-bold dark:text-slate-100">
                                                {selectedIntegration.statistics.totalSyncs > 0 ?
                                                    Math.round((selectedIntegration.statistics.successfulSyncs / selectedIntegration.statistics.totalSyncs) * 100) : 0}%
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Data Volume</span>
                                            <div className="text-xl font-bold dark:text-slate-100">{formatFileSize(selectedIntegration.statistics.dataTransferred)}</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Avg. Latency</span>
                                            <div className="text-xl font-bold dark:text-slate-100">{selectedIntegration.statistics.averageResponseTime}ms</div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-slate-700">
                                <Button variant="outline" onClick={() => setSelectedIntegration(null)} className="dark:border-slate-700">
                                    Cancel
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExternalIntegrations;
