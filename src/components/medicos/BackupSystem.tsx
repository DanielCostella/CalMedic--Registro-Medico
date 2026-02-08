import React, { useState, useEffect } from 'react';
import { Cloud, Database, Download, Upload, RefreshCw, Shield, Clock, CheckCircle, AlertTriangle, Settings, HardDrive, Wifi, WifiOff } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';

interface BackupEntry {
    id: string;
    date: string;
    time: string;
    type: 'Automatic' | 'Manual' | 'Scheduled';
    status: 'Completed' | 'In Progress' | 'Failed' | 'Cancelled';
    size: number; // in bytes
    duration: number; // in seconds
    location: 'Local' | 'Cloud' | 'Both';
    description: string;
    tables: string[];
    records: number;
}

interface BackupConfig {
    automatic: boolean;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    time: string;
    retention: number; // days
    compression: boolean;
    encryption: boolean;
    primaryLocation: 'Local' | 'Cloud';
    secondaryLocation: 'Local' | 'Cloud' | 'None';
    notifications: boolean;
}

interface SystemStatus {
    connected: boolean;
    lastBackup: string;
    nextBackup: string;
    localSpace: {
        used: number;
        total: number;
    };
    cloudSpace: {
        used: number;
        total: number;
    };
    syncing: {
        status: 'Synced' | 'Syncing' | 'Error' | 'Disconnected';
        lastSync: string;
        pending: number;
    };
}

const BackupSystem: React.FC = () => {
    const [backups, setBackups] = useState<BackupEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [backupInProgress, setBackupInProgress] = useState(false);
    const [backupProgress, setBackupProgress] = useState(0);
    const [showConfig, setShowConfig] = useState(false);
    const [showRestore, setShowRestore] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState<BackupEntry | null>(null);

    const [config, setConfig] = useState<BackupConfig>({
        automatic: true,
        frequency: 'Daily',
        time: '02:00',
        retention: 30,
        compression: true,
        encryption: true,
        primaryLocation: 'Cloud',
        secondaryLocation: 'Local',
        notifications: true
    });

    const [systemStatus, setSystemStatus] = useState<SystemStatus>({
        connected: true,
        lastBackup: '2024-01-16 02:00:00',
        nextBackup: '2024-01-17 02:00:00',
        localSpace: {
            used: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
            total: 100 * 1024 * 1024 * 1024 // 100 GB
        },
        cloudSpace: {
            used: 1.8 * 1024 * 1024 * 1024, // 1.8 GB
            total: 50 * 1024 * 1024 * 1024 // 50 GB
        },
        syncing: {
            status: 'Synced',
            lastSync: '2024-01-16 14:30:00',
            pending: 0
        }
    });

    useEffect(() => {
        // Simulate loading backup history
        setTimeout(() => {
            const initialBackups: BackupEntry[] = [
                {
                    id: '1',
                    date: '2024-01-16',
                    time: '02:00:00',
                    type: 'Automatic',
                    status: 'Completed',
                    size: 256 * 1024 * 1024, // 256 MB
                    duration: 180, // 3 minutes
                    location: 'Both',
                    description: 'Daily automatic backup',
                    tables: ['patients', 'appointments', 'histories', 'prescriptions', 'files'],
                    records: 15420
                },
                {
                    id: '2',
                    date: '2024-01-15',
                    time: '02:00:00',
                    type: 'Automatic',
                    status: 'Completed',
                    size: 248 * 1024 * 1024, // 248 MB
                    duration: 175,
                    location: 'Both',
                    description: 'Daily automatic backup',
                    tables: ['patients', 'appointments', 'histories', 'prescriptions', 'files'],
                    records: 15380
                },
                {
                    id: '3',
                    date: '2024-01-14',
                    time: '15:30:00',
                    type: 'Manual',
                    status: 'Completed',
                    size: 245 * 1024 * 1024, // 245 MB
                    duration: 95,
                    location: 'Cloud',
                    description: 'Manual backup before update',
                    tables: ['patients', 'appointments', 'histories', 'prescriptions'],
                    records: 15350
                },
                {
                    id: '4',
                    date: '2024-01-14',
                    time: '02:00:00',
                    type: 'Automatic',
                    status: 'Completed',
                    size: 243 * 1024 * 1024, // 243 MB
                    duration: 170,
                    location: 'Both',
                    description: 'Daily automatic backup',
                    tables: ['patients', 'appointments', 'histories', 'prescriptions', 'files'],
                    records: 15320
                },
                {
                    id: '5',
                    date: '2024-01-13',
                    time: '02:00:00',
                    type: 'Automatic',
                    status: 'Failed',
                    size: 0,
                    duration: 0,
                    location: 'Cloud',
                    description: 'Connection error during backup',
                    tables: [],
                    records: 0
                }
            ];

            setBackups(initialBackups);
            setLoading(false);
        }, 1000);

        // Simulate system status updates
        const interval = setInterval(() => {
            setSystemStatus(prev => ({
                ...prev,
                syncing: {
                    ...prev.syncing,
                    lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19)
                }
            }));
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const calculateUsagePercentage = (used: number, total: number): number => {
        return Math.round((used / total) * 100);
    };

    const calculateNextBackup = (): string => {
        const now = new Date();
        const next = new Date(now);

        switch (config.frequency) {
            case 'Daily':
                next.setDate(now.getDate() + 1);
                break;
            case 'Weekly':
                next.setDate(now.getDate() + 7);
                break;
            case 'Monthly':
                next.setMonth(now.getMonth() + 1);
                break;
        }

        const [hours, minutes] = config.time.split(':');
        next.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        return next.toISOString().replace('T', ' ').substring(0, 19);
    };

    const startManualBackup = async () => {
        setBackupInProgress(true);
        setBackupProgress(0);

        // Simulate backup progress
        for (let i = 0; i <= 100; i += 5) {
            setBackupProgress(i);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Create new backup
        const nextBackupTime = calculateNextBackup();
        const newBackup: BackupEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            type: 'Manual',
            status: 'Completed',
            size: Math.floor(Math.random() * 50 + 200) * 1024 * 1024, // 200-250 MB
            duration: Math.floor(Math.random() * 60 + 90), // 90-150 seconds
            location: config.primaryLocation === 'Cloud' ? 'Cloud' : 'Local',
            description: 'Manual backup initiated by user',
            tables: ['patients', 'appointments', 'histories', 'prescriptions', 'files'],
            records: Math.floor(Math.random() * 100 + 15400)
        };

        setBackups(prev => [newBackup, ...prev]);
        setBackupInProgress(false);
        setBackupProgress(0);

        // Update system status
        setSystemStatus(prev => ({
            ...prev,
            lastBackup: `${newBackup.date} ${newBackup.time}`,
            nextBackup: nextBackupTime
        }));
    };

    const restoreBackup = async (backup: BackupEntry) => {
        if (!confirm(`Are you sure you want to restore the backup from ${new Date(backup.date).toLocaleDateString()} at ${backup.time}? This action will overwrite current data.`)) {
            return;
        }

        setLoading(true);

        // Simulate restore process
        await new Promise(resolve => setTimeout(resolve, 3000));

        setLoading(false);
        setShowRestore(false);
        alert('Backup restored successfully');
    };

    const deleteBackup = (backupId: string) => {
        if (confirm('Are you sure you want to delete this backup?')) {
            setBackups(prev => prev.filter(b => b.id !== backupId));
        }
    };

    const saveConfig = () => {
        // Simulate config save
        setSystemStatus(prev => ({
            ...prev,
            nextBackup: calculateNextBackup()
        }));

        setShowConfig(false);
    };

    const getStatusColor = (status: BackupEntry['status']) => {
        switch (status) {
            case 'Completed': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/50 dark:text-green-400';
            case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/50 dark:text-blue-400';
            case 'Failed': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50 dark:text-red-400';
            case 'Cancelled': return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    if (loading && backups.length === 0) {
        return (
            <div className="p-6">
                <LoadingSpinner size="lg" text="Loading backup system..." />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Database className="w-8 h-8 text-blue-600" />
                        Backup and Persistence System
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Automatic backup management and data synchronization
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowConfig(true)} className="dark:border-slate-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Configuration
                    </Button>

                    <Button
                        onClick={startManualBackup}
                        disabled={backupInProgress}
                        className="bg-blue-600 hover:bg-blue-700 h-10 px-6"
                    >
                        {backupInProgress ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Manual Backup
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {backupInProgress && (
                <Card className="dark:bg-slate-800 dark:border-slate-700 animate-pulse">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Upload className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 dark:text-slate-400">
                                    <span>Creating backup...</span>
                                    <span>{backupProgress}%</span>
                                </div>
                                <Progress value={backupProgress} className="w-full h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* System Status Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg dark:text-gray-100">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Backup Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                            <span className="text-xs font-bold uppercase text-slate-500">Last backup:</span>
                            <span className="text-sm font-bold dark:text-slate-200">
                                {new Date(systemStatus.lastBackup).toLocaleString('en-US')}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                            <span className="text-xs font-bold uppercase text-slate-500">Next backup:</span>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {new Date(systemStatus.nextBackup).toLocaleString('en-US')}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-xs font-bold uppercase text-slate-500">Connection:</span>
                            <div className="flex items-center gap-2">
                                {systemStatus.connected ? (
                                    <Badge className="bg-green-600">Connected</Badge>
                                ) : (
                                    <Badge variant="destructive">Disconnected</Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg dark:text-gray-100">
                            <HardDrive className="w-5 h-5 text-green-600" />
                            Local Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-[10px] font-bold uppercase text-slate-500">Used</Label>
                                <div className="text-lg font-bold dark:text-slate-200">{formatFileSize(systemStatus.localSpace.used)}</div>
                            </div>
                            <div>
                                <Label className="text-[10px] font-bold uppercase text-slate-500">Total</Label>
                                <div className="text-lg font-bold dark:text-slate-200">{formatFileSize(systemStatus.localSpace.total)}</div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest dark:text-slate-400">
                                <span>Disk Usage</span>
                                <span>{calculateUsagePercentage(systemStatus.localSpace.used, systemStatus.localSpace.total)}%</span>
                            </div>
                            <Progress
                                value={calculateUsagePercentage(systemStatus.localSpace.used, systemStatus.localSpace.total)}
                                className="w-full h-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg dark:text-gray-100">
                            <Cloud className="w-5 h-5 text-purple-600" />
                            Cloud Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-[10px] font-bold uppercase text-slate-500">Used</Label>
                                <div className="text-lg font-bold dark:text-slate-200">{formatFileSize(systemStatus.cloudSpace.used)}</div>
                            </div>
                            <div>
                                <Label className="text-[10px] font-bold uppercase text-slate-500">Total</Label>
                                <div className="text-lg font-bold dark:text-slate-200">{formatFileSize(systemStatus.cloudSpace.total)}</div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest dark:text-slate-400">
                                <span>Space Usage</span>
                                <span>{calculateUsagePercentage(systemStatus.cloudSpace.used, systemStatus.cloudSpace.total)}%</span>
                            </div>
                            <Progress
                                value={calculateUsagePercentage(systemStatus.cloudSpace.used, systemStatus.cloudSpace.total)}
                                className="w-full h-2"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Backups', value: backups.length, icon: Database, color: 'bg-blue-600' },
                    { label: 'Successful', value: backups.filter(b => b.status === 'Completed').length, icon: CheckCircle, color: 'bg-green-600' },
                    { label: 'Failed', value: backups.filter(b => b.status === 'Failed').length, icon: AlertTriangle, color: 'bg-red-600' },
                    { label: 'Total Size', value: formatFileSize(backups.reduce((t, b) => t + b.size, 0)), icon: HardDrive, color: 'bg-purple-600' }
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.color} text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200`}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <stat.icon className="w-8 h-8 text-white/30" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Backup History */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="dark:text-gray-100">Backup History</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">
                        Export CSV
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {backups.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Database className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                                <p className="font-bold">No backups recorded yet</p>
                            </div>
                        ) : (
                            backups.map(backup => (
                                <div key={backup.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge className={`${getStatusColor(backup.status)} font-bold text-[10px] uppercase tracking-wider`}>
                                                {backup.status}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] font-bold border-slate-300 dark:border-slate-700 uppercase">{backup.type}</Badge>
                                            <Badge variant="outline" className="text-[10px] font-bold border-slate-300 dark:border-slate-700 uppercase">
                                                {backup.location === 'Both' ? 'Cloud + Local' : backup.location}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase text-slate-500">Date/Time</Label>
                                                <div className="text-xs font-bold dark:text-slate-300">{new Date(backup.date).toLocaleDateString()} {backup.time}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase text-slate-500">Size</Label>
                                                <div className="text-xs font-bold dark:text-slate-300">{formatFileSize(backup.size)}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase text-slate-500">Duration</Label>
                                                <div className="text-xs font-bold dark:text-slate-300">{formatDuration(backup.duration)}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase text-slate-500">Records</Label>
                                                <div className="text-xs font-bold dark:text-slate-300">{backup.records.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-600 dark:text-gray-400 italic">
                                            {backup.description}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {backup.status === 'Completed' && (
                                            <>
                                                <Button size="icon" variant="outline" onClick={() => restoreBackup(backup)} className="h-9 w-9 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                                                    <Download className="w-4 h-4 text-blue-600" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-9 w-9 dark:border-slate-700">
                                                    <RefreshCw className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => deleteBackup(backup.id)}
                                            className="h-9 w-9 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Config Dialog */}
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
                <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold dark:text-slate-100">Backup Configuration</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="automatic" className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-3 dark:bg-slate-800">
                            <TabsTrigger value="automatic">Schedule</TabsTrigger>
                            <TabsTrigger value="location">Storage</TabsTrigger>
                            <TabsTrigger value="security">Encryption</TabsTrigger>
                        </TabsList>

                        <TabsContent value="automatic" className="space-y-6 pt-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                <div className="space-y-1">
                                    <Label className="font-bold dark:text-slate-100">Automatic Backup</Label>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Automatically perform system backups</p>
                                </div>
                                <Switch
                                    checked={config.automatic}
                                    onCheckedChange={(checked) => setConfig({ ...config, automatic: checked })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Frequency</Label>
                                    <Select
                                        value={config.frequency}
                                        onValueChange={(value: BackupConfig['frequency']) =>
                                            setConfig({ ...config, frequency: value })
                                        }
                                    >
                                        <SelectTrigger className="dark:bg-slate-900 dark:border-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Daily">Daily</SelectItem>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Backup Time</Label>
                                    <Input
                                        type="time"
                                        value={config.time}
                                        onChange={(e) => setConfig({ ...config, time: e.target.value })}
                                        className="dark:bg-slate-900 dark:border-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Retention (days)</Label>
                                <Input
                                    type="number"
                                    value={config.retention}
                                    onChange={(e) => setConfig({ ...config, retention: parseInt(e.target.value) })}
                                    min="1"
                                    max="365"
                                    className="dark:bg-slate-900 dark:border-slate-700"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="location" className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Primary Location</Label>
                                <Select
                                    value={config.primaryLocation}
                                    onValueChange={(value: 'Local' | 'Cloud') =>
                                        setConfig({ ...config, primaryLocation: value })
                                    }
                                >
                                    <SelectTrigger className="dark:bg-slate-900 dark:border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Local">Local Disk Drive</SelectItem>
                                        <SelectItem value="Cloud">Secure Cloud Storage</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secondary Location (Optional)</Label>
                                <Select
                                    value={config.secondaryLocation}
                                    onValueChange={(value: any) =>
                                        setConfig({ ...config, secondaryLocation: value })
                                    }
                                >
                                    <SelectTrigger className="dark:bg-slate-900 dark:border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="None">No Redundancy</SelectItem>
                                        <SelectItem value="Local">Local Disk Drive</SelectItem>
                                        <SelectItem value="Cloud">Secure Cloud Storage</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="security" className="space-y-6 pt-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                <div className="space-y-1">
                                    <Label className="font-bold dark:text-slate-100">Gzip Compression</Label>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Reduce storage size of backups</p>
                                </div>
                                <Switch
                                    checked={config.compression}
                                    onCheckedChange={(checked) => setConfig({ ...config, compression: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                <div className="space-y-1">
                                    <Label className="font-bold dark:text-slate-100">AES-256 Encryption</Label>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Protect sensitive medical information</p>
                                </div>
                                <Switch
                                    checked={config.encryption}
                                    onCheckedChange={(checked) => setConfig({ ...config, encryption: checked })}
                                />
                            </div>

                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start gap-3">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-400">Secure Vault Protection</h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-500/80 leading-relaxed mt-1">
                                        All encrypted backups use industry-standard AES-256.
                                        Decryption keys are managed by our secure infrastructure.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-slate-800">
                        <Button variant="outline" onClick={() => setShowConfig(false)} className="dark:border-slate-700">
                            Cancel
                        </Button>
                        <Button onClick={saveConfig} className="bg-blue-600 hover:bg-blue-700 h-11 px-8">
                            Save Configuration
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BackupSystem;
