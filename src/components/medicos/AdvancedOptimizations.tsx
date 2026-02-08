import React, { useState, useEffect } from 'react';
import { Zap, Wifi, WifiOff, Download, Smartphone, Monitor, Gauge, Settings, CheckCircle, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PerformanceMetric {
    name: string;
    value: number;
    unit: string;
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
    recommendation?: string;
}

interface PWAConfig {
    enabled: boolean;
    name: string;
    shortDescription: string;
    longDescription: string;
    themeColor: string;
    backgroundColor: string;
    orientation: 'portrait' | 'landscape' | 'any';
    splashScreen: boolean;
    pushNotifications: boolean;
    autoInstallation: boolean;
}

interface CacheStatus {
    size: number;
    items: number;
    lastUpdate: string;
    strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
    fileTypes: {
        html: number;
        css: number;
        js: number;
        images: number;
        data: number;
    };
}

interface ConnectionStatus {
    online: boolean;
    connectionType: string;
    speed: number; // Mbps
    latency: number; // ms
    stable: boolean;
}

const AdvancedOptimizations: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
    const [pwaConfig, setPwaConfig] = useState<PWAConfig>({
        enabled: false,
        name: 'Integrated Medical System',
        shortDescription: 'Complete medical system',
        longDescription: 'Comprehensive medical management system with full functionality for offices and clinics',
        themeColor: '#3B82F6',
        backgroundColor: '#FFFFFF',
        orientation: 'portrait',
        splashScreen: true,
        pushNotifications: true,
        autoInstallation: false
    });
    const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
        size: 15.7 * 1024 * 1024, // 15.7 MB
        items: 247,
        lastUpdate: '2024-01-16 14:30:00',
        strategy: 'stale-while-revalidate',
        fileTypes: {
            html: 12,
            css: 8,
            js: 45,
            images: 156,
            data: 26
        }
    });
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
        online: true,
        connectionType: 'wifi',
        speed: 25.6,
        latency: 45,
        stable: true
    });

    const [loading, setLoading] = useState(true);
    const [installingPWA, setInstallingPWA] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);

    useEffect(() => {
        // Simulate performance metrics loading
        setTimeout(() => {
            const initialMetrics: PerformanceMetric[] = [
                {
                    name: 'First Contentful Paint',
                    value: 1.2,
                    unit: 's',
                    status: 'Excellent',
                    description: 'Time until the first content appears',
                    recommendation: 'Maintain below 1.8s'
                },
                {
                    name: 'Largest Contentful Paint',
                    value: 2.1,
                    unit: 's',
                    status: 'Good',
                    description: 'Time until the main content appears',
                    recommendation: 'Optimize large images'
                },
                {
                    name: 'Cumulative Layout Shift',
                    value: 0.05,
                    unit: '',
                    status: 'Excellent',
                    description: 'Visual stability of the page',
                    recommendation: 'Maintain below 0.1'
                },
                {
                    name: 'First Input Delay',
                    value: 45,
                    unit: 'ms',
                    status: 'Excellent',
                    description: 'Response time to the first interaction',
                    recommendation: 'Maintain below 100ms'
                },
                {
                    name: 'Total Blocking Time',
                    value: 150,
                    unit: 'ms',
                    status: 'Good',
                    description: 'Total main thread blocking time',
                    recommendation: 'Reduce non-critical JavaScript'
                },
                {
                    name: 'Speed Index',
                    value: 2.8,
                    unit: 's',
                    status: 'Fair',
                    description: 'Visual load speed of content',
                    recommendation: 'Implement lazy loading'
                },
                {
                    name: 'Bundle Size',
                    value: 1.2,
                    unit: 'MB',
                    status: 'Good',
                    description: 'Total JavaScript size',
                    recommendation: 'Consider code splitting'
                },
                {
                    name: 'Memory Usage',
                    value: 45,
                    unit: 'MB',
                    status: 'Excellent',
                    description: 'Application memory usage',
                    recommendation: 'Monitor memory leaks'
                }
            ];

            setMetrics(initialMetrics);
            setLoading(false);
        }, 1000);

        // Simulate connection monitoring
        const connectionInterval = setInterval(() => {
            setConnectionStatus(prev => ({
                ...prev,
                speed: Math.random() * 30 + 10, // 10-40 Mbps
                latency: Math.random() * 50 + 20, // 20-70 ms
                stable: Math.random() > 0.1 // 90% stable
            }));
        }, 5000);

        return () => clearInterval(connectionInterval);
    }, []);

    const installPWA = async () => {
        setInstallingPWA(true);

        // Simulate PWA installation
        await new Promise(resolve => setTimeout(resolve, 3000));

        setPwaConfig(prev => ({ ...prev, enabled: true }));
        setInstallingPWA(false);

        // Show successful installation notification
        if (Notification.permission === 'granted') {
            new Notification('PWA Installed', {
                body: 'The Integrated Medical System is now available as an application',
                icon: '/favicon.png'
            });
        }
    };

    const optimizePerformance = async () => {
        setOptimizing(true);

        // Simulate optimizations
        const stages = [
            'Compressing CSS and JS resources...',
            'Optimizing images...',
            'Configuring strategic cache...',
            'Implementing lazy loading...',
            'Minifying code...',
            'Configuring service worker...'
        ];

        for (const stage of stages) {
            console.log(stage);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Update metrics simulating improvements
        setMetrics(prev => prev.map(metric => {
            let newValue = metric.value;
            let newStatus = metric.status;

            switch (metric.name) {
                case 'Speed Index':
                    newValue = Math.max(1.5, metric.value - 0.5);
                    newStatus = newValue < 2.0 ? 'Excellent' : 'Good';
                    break;
                case 'Total Blocking Time':
                    newValue = Math.max(50, metric.value - 30);
                    newStatus = newValue < 100 ? 'Excellent' : 'Good';
                    break;
                case 'Bundle Size':
                    newValue = Math.max(0.8, metric.value - 0.2);
                    newStatus = newValue < 1.0 ? 'Excellent' : 'Good';
                    break;
            }

            return { ...metric, value: newValue, status: newStatus };
        }));

        // Update cache
        setCacheStatus(prev => ({
            ...prev,
            lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19),
            items: prev.items + 15
        }));

        setOptimizing(false);
    };

    const clearCache = async () => {
        // Simulate cache clearing
        await new Promise(resolve => setTimeout(resolve, 1000));

        setCacheStatus(prev => ({
            ...prev,
            size: prev.size * 0.3, // Reduce to 30%
            items: Math.floor(prev.items * 0.3),
            lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }));
    };

    const toggleOfflineMode = () => {
        setOfflineMode(!offlineMode);
        setConnectionStatus(prev => ({ ...prev, online: !offlineMode }));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getMetricColor = (status: PerformanceMetric['status']) => {
        switch (status) {
            case 'Excellent': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/50 dark:text-green-400';
            case 'Good': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/50 dark:text-blue-400';
            case 'Fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/50 dark:text-yellow-400';
            case 'Poor': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const calculateOverallScore = (): number => {
        const scores = metrics.map(metric => {
            switch (metric.status) {
                case 'Excellent': return 100;
                case 'Good': return 80;
                case 'Fair': return 60;
                case 'Poor': return 40;
                default: return 50;
            }
        });

        return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    };

    if (loading) {
        return (
            <div className="p-6">
                <LoadingSpinner size="lg" text="Loading advanced optimizations..." />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Zap className="w-8 h-8 text-blue-600" />
                        Advanced Optimizations
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        PWA, offline mode, performance optimization and advanced metrics
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={optimizePerformance}
                        disabled={optimizing}
                        variant="outline"
                        className="dark:border-slate-700"
                    >
                        {optimizing ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Optimizing...
                            </>
                        ) : (
                            <>
                                <Gauge className="w-4 h-4 mr-2" />
                                Optimize
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={installPWA}
                        disabled={installingPWA || pwaConfig.enabled}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {installingPWA ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Installing...
                            </>
                        ) : pwaConfig.enabled ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                PWA Installed
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Install PWA
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Connection Status */}
            <Card className={`border-2 ${connectionStatus.online ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/50' : 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50'}`}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {connectionStatus.online ? (
                                <Wifi className="w-6 h-6 text-green-600 dark:text-green-400" />
                            ) : (
                                <WifiOff className="w-6 h-6 text-red-600 dark:text-red-400" />
                            )}
                            <div>
                                <h3 className="font-semibold dark:text-gray-100">
                                    {connectionStatus.online ? 'Connected' : 'Offline Mode'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {connectionStatus.online ?
                                        `${connectionStatus.connectionType.toUpperCase()} - ${connectionStatus.speed.toFixed(1)} Mbps - ${connectionStatus.latency}ms` :
                                        'Working with cached data'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant={connectionStatus.stable ? 'default' : 'destructive'} className={connectionStatus.stable ? 'bg-green-600' : ''}>
                                {connectionStatus.stable ? 'Stable' : 'Unstable'}
                            </Badge>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={toggleOfflineMode}
                                className="dark:border-slate-700"
                            >
                                {offlineMode ? 'Go Online' : 'Simulate Offline'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Overall Score */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold dark:text-gray-100">Performance Score</h3>
                            <p className="text-gray-600 dark:text-gray-400">Based on Core Web Vitals metrics</p>
                        </div>
                        <div className="text-center">
                            <div className={`text-6xl font-bold ${calculateOverallScore() >= 90 ? 'text-green-600 dark:text-green-400' :
                                    calculateOverallScore() >= 70 ? 'text-blue-600 dark:text-blue-400' :
                                        calculateOverallScore() >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                {calculateOverallScore()}
                            </div>
                            <div className="text-sm text-gray-500 uppercase font-bold tracking-widest mt-1">out of 100</div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Progress value={calculateOverallScore()} className="h-3" />
                    </div>
                </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-4 dark:bg-slate-800">
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="pwa">PWA</TabsTrigger>
                    <TabsTrigger value="cache">Cache</TabsTrigger>
                    <TabsTrigger value="offline">Offline Mode</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((metric, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">{metric.name}</h4>
                                        <Badge className={`${getMetricColor(metric.status)} font-bold text-[10px]`}>
                                            {metric.status}
                                        </Badge>
                                    </div>

                                    <div className="text-3xl font-bold mb-2 dark:text-slate-100">
                                        {metric.value}{metric.unit}
                                    </div>

                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                        {metric.description}
                                    </p>

                                    {metric.recommendation && (
                                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                            💡 {metric.recommendation}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardHeader>
                            <CardTitle className="dark:text-slate-100 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                Optimization Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-yellow-900 dark:text-yellow-400">Implement Lazy Loading</h4>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-500/80">
                                            Images and non-critical components should be loaded on demand to improve the Speed Index.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                                    <Zap className="w-6 h-6 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 dark:text-blue-400">Code Splitting</h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-500/80">
                                            Splitting JavaScript into smaller chunks can reduce Total Blocking Time.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-green-900 dark:text-green-400">Excellent Metrics</h4>
                                        <p className="text-sm text-green-700 dark:text-green-500/80">
                                            FCP, CLS and FID are in excellent ranges. Maintain current best practices.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pwa" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="dark:bg-slate-800 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                                    <Smartphone className="w-5 h-5 text-blue-500" />
                                    PWA Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b dark:border-slate-700">
                                    <span className="text-sm font-medium dark:text-slate-300">PWA Enabled</span>
                                    <Badge variant={pwaConfig.enabled ? 'default' : 'secondary'} className={pwaConfig.enabled ? 'bg-green-600' : ''}>
                                        {pwaConfig.enabled ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b dark:border-slate-700">
                                    <span className="text-sm font-medium dark:text-slate-300">Installable</span>
                                    <Badge variant={pwaConfig.enabled ? 'default' : 'outline'} className={pwaConfig.enabled ? 'bg-blue-600' : 'dark:border-slate-700'}>
                                        {pwaConfig.enabled ? 'Yes' : 'No'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b dark:border-slate-700">
                                    <span className="text-sm font-medium dark:text-slate-300">Service Worker</span>
                                    <Badge variant="default" className="bg-green-600">Registered</Badge>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b dark:border-slate-700">
                                    <span className="text-sm font-medium dark:text-slate-300">Manifest</span>
                                    <Badge variant="default" className="bg-green-600">Valid</Badge>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b dark:border-slate-700">
                                    <span className="text-sm font-medium dark:text-slate-300">HTTPS</span>
                                    <Badge variant="default" className="bg-green-600">Secure</Badge>
                                </div>

                                {pwaConfig.enabled && (
                                    <div className="pt-4">
                                        <h4 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-4">Active PWA Features</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 text-xs font-semibold dark:text-slate-200 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>Device Install</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold dark:text-slate-200 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>Offline Ops</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold dark:text-slate-200 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>Push Notifs</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold dark:text-slate-200 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span>Auto Updates</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="dark:bg-slate-800 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="dark:text-slate-100">PWA Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">App Name</Label>
                                    <div className="text-sm font-bold dark:text-slate-200">{pwaConfig.name}</div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</Label>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{pwaConfig.longDescription}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Theme Color</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div
                                                className="w-4 h-4 rounded-full border dark:border-slate-700 shadow-sm"
                                                style={{ backgroundColor: pwaConfig.themeColor }}
                                            />
                                            <span className="text-xs font-mono font-bold dark:text-slate-300">{pwaConfig.themeColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Orientation</Label>
                                        <div className="text-xs font-bold capitalize dark:text-slate-300">{pwaConfig.orientation}</div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                        <Label className="text-xs font-bold dark:text-slate-300">Splash Screen</Label>
                                        <Badge variant={pwaConfig.splashScreen ? 'default' : 'secondary'} className={pwaConfig.splashScreen ? 'bg-blue-600' : ''}>
                                            {pwaConfig.splashScreen ? 'Enabled' : 'Disabled'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                        <Label className="text-xs font-bold dark:text-slate-300">Push Notifications</Label>
                                        <Badge variant={pwaConfig.pushNotifications ? 'default' : 'secondary'} className={pwaConfig.pushNotifications ? 'bg-blue-600' : ''}>
                                            {pwaConfig.pushNotifications ? 'Enabled' : 'Disabled'}
                                        </Badge>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setShowConfig(true)}
                                    variant="outline"
                                    className="w-full h-11 dark:border-slate-700"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configure PWA
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="cache" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="dark:bg-slate-800 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                                    <Database className="w-5 h-5 text-blue-500" />
                                    Cache Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-700">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Total Size</Label>
                                        <div className="text-2xl font-bold dark:text-slate-100">{formatFileSize(cacheStatus.size)}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-700">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Cached Items</Label>
                                        <div className="text-2xl font-bold dark:text-slate-100">{cacheStatus.items}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Strategy</Label>
                                    <Badge variant="outline" className="font-bold border-blue-200 text-blue-600 dark:border-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10">
                                        {cacheStatus.strategy}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between px-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Last Update</Label>
                                    <div className="text-xs font-bold dark:text-slate-300">
                                        {new Date(cacheStatus.lastUpdate).toLocaleString('en-US')}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={clearCache} className="flex-1 h-11 dark:border-slate-700">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Clear Cache
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-11 dark:border-slate-700">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Configure
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="dark:bg-slate-800 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="dark:text-slate-100">Distribution by Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-5 pt-2">
                                    {Object.entries(cacheStatus.fileTypes).map(([type, amount]) => (
                                        <div key={type} className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="capitalize text-xs font-bold dark:text-slate-200">{type}</span>
                                                <span className="text-[10px] font-mono font-bold text-slate-500">{amount} files</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden border dark:border-slate-800">
                                                <div
                                                    className="bg-blue-600 h-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                                    style={{
                                                        width: `${(amount / Math.max(...Object.values(cacheStatus.fileTypes))) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="dark:bg-slate-800 dark:border-slate-700 mt-6">
                        <CardHeader>
                            <CardTitle className="dark:text-slate-100">Cache Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                <div className="space-y-2">
                                    <Label htmlFor="cache-strategy" className="text-xs font-bold uppercase text-slate-500">Cache Strategy</Label>
                                    <Select value={cacheStatus.strategy} onValueChange={() => { }}>
                                        <SelectTrigger className="dark:bg-slate-900 dark:border-slate-700 h-10 border-none font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cache-first" className="font-bold text-xs uppercase">Cache First</SelectItem>
                                            <SelectItem value="network-first" className="font-bold text-xs uppercase">Network First</SelectItem>
                                            <SelectItem value="stale-while-revalidate" className="font-bold text-xs uppercase">Stale While Revalidate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-700">
                                    <Label className="text-xs font-bold dark:text-slate-200">Auto Caching</Label>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-700">
                                    <Label className="text-xs font-bold dark:text-slate-200">Critical Preload</Label>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="offline" className="space-y-4 pt-4">
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                                <WifiOff className="w-5 h-5 text-red-500" />
                                Offline Functionality
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 dark:border-slate-700">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${offlineMode ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {offlineMode ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold dark:text-slate-100">Offline Mode Simulation</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md">
                                            Simulate app behavior when there is no internet connection.
                                            Enables the testing of local data persistence and caching mechanisms.
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={offlineMode}
                                    onCheckedChange={toggleOfflineMode}
                                    className="scale-125"
                                />
                            </div>

                            {offlineMode && (
                                <div className="p-5 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-900/50 rounded-2xl animate-pulse">
                                    <div className="flex items-center gap-3 mb-2">
                                        <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                        <h4 className="font-bold text-orange-900 dark:text-orange-400">Offline Mode Active</h4>
                                    </div>
                                    <p className="text-sm text-orange-700 dark:text-orange-500/90 leading-relaxed font-bold">
                                        The application is currently working with cached data.
                                        Some cloud-syncing functionalities will be resumed once online.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <Card className="dark:bg-slate-800 dark:border-slate-700 border-t-4 border-t-green-500/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 dark:text-slate-100">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Available Offline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm font-bold dark:text-slate-300">View saved patients</span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm font-bold dark:text-slate-300">Consult medical histories</span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm font-bold dark:text-slate-300">Access previous reports</span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm font-bold dark:text-slate-300">Emergency contact list</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="dark:bg-slate-800 dark:border-slate-700 border-t-4 border-t-red-500/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 dark:text-slate-100">
                                    <X className="w-5 h-5 text-red-500" />
                                    Limited Offline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 group opacity-70">
                                        <div className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm font-bold dark:text-slate-300">New patient registration</span>
                                    </div>
                                    <div className="flex items-center gap-3 group opacity-70">
                                        <div className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm font-bold dark:text-slate-300">Real-time lab results</span>
                                    </div>
                                    <div className="flex items-center gap-3 group opacity-70">
                                        <div className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm font-bold dark:text-slate-300">Video consultations</span>
                                    </div>
                                    <div className="flex items-center gap-3 group opacity-70">
                                        <div className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm font-bold dark:text-slate-300">External system integrations</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Configuration Dialog */}
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
                <DialogContent className="max-w-xl dark:bg-slate-900 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold dark:text-slate-100">PWA Configuration</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">App Name</Label>
                            <Input value={pwaConfig.name} onChange={() => { }} className="dark:bg-slate-800 dark:border-slate-700" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Short Description</Label>
                            <Input value={pwaConfig.shortDescription} onChange={() => { }} className="dark:bg-slate-800 dark:border-slate-700" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Theme Color</Label>
                                <Input type="color" value={pwaConfig.themeColor} onChange={() => { }} className="h-10 p-1 dark:bg-slate-800 dark:border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Background Color</Label>
                                <Input type="color" value={pwaConfig.backgroundColor} onChange={() => { }} className="h-10 p-1 dark:bg-slate-800 dark:border-slate-700" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t dark:border-slate-800">
                            <Button variant="outline" onClick={() => setShowConfig(false)} className="dark:border-slate-700">Cancel</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">Save Configuration</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdvancedOptimizations;
