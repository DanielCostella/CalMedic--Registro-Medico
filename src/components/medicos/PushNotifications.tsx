import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, AlertTriangle, Calendar, Pill, UserCheck, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
// import { LoadingSpinner } from '@/components/ui/loading-spinner'; // Replaced with a fallback if not available

interface Notification {
    id: string;
    type: 'appointment' | 'medication' | 'consultation' | 'follow-up' | 'urgent';
    title: string;
    message: string;
    date: string;
    time: string;
    read: boolean;
    priority: 'high' | 'medium' | 'low';
    actionRequired?: boolean;
    patientId?: string;
    patientName?: string;
}

interface NotificationSettings {
    appointments: boolean;
    medications: boolean;
    consultations: boolean;
    followUps: boolean;
    urgents: boolean;
    sound: boolean;
    email: boolean;
    startTime: string;
    endTime: string;
}

interface PushNotificationsProps {
    doctorId: string;
    doctorName: string;
}

const PushNotifications: React.FC<PushNotificationsProps> = ({ doctorId, doctorName }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfig, setShowConfig] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [readFilter, setReadFilter] = useState<string>('all');

    const [settings, setSettings] = useState<NotificationSettings>({
        appointments: true,
        medications: true,
        consultations: true,
        followUps: true,
        urgents: true,
        sound: true,
        email: false,
        startTime: '08:00',
        endTime: '18:00'
    });

    useEffect(() => {
        // Simulate notification loading
        setTimeout(() => {
            const initialNotifications: Notification[] = [
                {
                    id: '1',
                    type: 'appointment',
                    title: 'Upcoming Appointment',
                    message: 'Appointment with María González in 30 minutes - Follow-up consultation',
                    date: new Date().toISOString().split('T')[0],
                    time: '14:30',
                    read: false,
                    priority: 'high',
                    actionRequired: true,
                    patientId: '1',
                    patientName: 'María González'
                },
                {
                    id: '2',
                    type: 'medication',
                    title: 'Expired Medication',
                    message: 'Carlos Rodríguez\'s Atenolol expires tomorrow - Renew prescription',
                    date: new Date().toISOString().split('T')[0],
                    time: '12:15',
                    read: false,
                    priority: 'medium',
                    actionRequired: true,
                    patientId: '2',
                    patientName: 'Carlos Rodríguez'
                },
                {
                    id: '3',
                    type: 'consultation',
                    title: 'Inter-consultation Response',
                    message: 'Dr. Pérez (Cardiology) responded to Ana Martínez\'s inter-consultation',
                    date: new Date().toISOString().split('T')[0],
                    time: '11:45',
                    read: false,
                    priority: 'medium',
                    actionRequired: true,
                    patientId: '3',
                    patientName: 'Ana Martínez'
                },
                {
                    id: '4',
                    type: 'follow-up',
                    title: 'Pending Follow-up',
                    message: 'Luis García requires post-operative follow-up - 7 days since surgery',
                    date: new Date().toISOString().split('T')[0],
                    time: '10:20',
                    read: true,
                    priority: 'medium',
                    patientId: '4',
                    patientName: 'Luis García'
                },
                {
                    id: '5',
                    type: 'urgent',
                    title: 'Critical Result',
                    message: 'Critical lab result for Elena Torres - Contact immediately',
                    date: new Date().toISOString().split('T')[0],
                    time: '09:30',
                    read: false,
                    priority: 'high',
                    actionRequired: true,
                    patientId: '5',
                    patientName: 'Elena Torres'
                },
                {
                    id: '6',
                    type: 'appointment',
                    title: 'Appointment Cancelled',
                    message: 'Pedro Sánchez cancelled his 16:00 appointment - Reschedule',
                    date: new Date().toISOString().split('T')[0],
                    time: '08:45',
                    read: true,
                    priority: 'low',
                    actionRequired: true,
                    patientId: '6',
                    patientName: 'Pedro Sánchez'
                }
            ];
            setNotifications(initialNotifications);
            setLoading(false);
        }, 1000);

        // Simulate real-time notifications
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% probability every 10 seconds
                addRealTimeNotification();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const addRealTimeNotification = () => {
        const notificationTypes = ['appointment', 'medication', 'consultation', 'follow-up'];
        const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)] as Notification['type'];

        const messages = {
            appointment: 'New appointment scheduled for tomorrow at 10:00',
            medication: 'Reminder: Review Metformin prescription',
            consultation: 'New inter-consultation received from Internal Medicine',
            'follow-up': 'Patient requires treatment follow-up'
        };

        const newNotification: Notification = {
            id: Date.now().toString(),
            type,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} - Real Time`,
            message: messages[type as keyof typeof messages],
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            read: false,
            priority: 'medium'
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Show browser notification if permitted
        if (window.Notification && window.Notification.permission === 'granted') {
            new window.Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/favicon.png'
            });
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await window.Notification.requestPermission();
            if (permission === 'granted') {
                alert('Notifications activated successfully');
            }
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'appointment': return <Calendar className="w-5 h-5 text-blue-600" />;
            case 'medication': return <Pill className="w-5 h-5 text-green-600" />;
            case 'consultation': return <UserCheck className="w-5 h-5 text-orange-600" />;
            case 'follow-up': return <FileText className="w-5 h-5 text-purple-600" />;
            case 'urgent': return <AlertTriangle className="w-5 h-5 text-red-600" />;
            default: return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getPriorityColor = (priority: Notification['priority']) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-gray-500 bg-gray-50';
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        const matchesType = typeFilter === 'all' || notif.type === typeFilter;
        const matchesRead = readFilter === 'all' ||
            (readFilter === 'read' && notif.read) ||
            (readFilter === 'unread' && !notif.read);

        return matchesType && matchesRead;
    });

    const unreadNotificationsCount = notifications.filter(n => !n.read).length;
    const urgentNotificationsCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p>Loading notifications...</p>
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
                        <Bell className="w-8 h-8 text-blue-600" />
                        Push Notifications
                        {unreadNotificationsCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {unreadNotificationsCount}
                            </Badge>
                        )}
                    </h1>
                    <p className="text-gray-600">
                        Real-time medical alerts and reminders system
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={requestNotificationPermission}
                        className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                    >
                        <Bell className="w-4 h-4 mr-2" />
                        Activate Notifications
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowConfig(true)}
                    >
                        Settings
                    </Button>
                    {unreadNotificationsCount > 0 && (
                        <Button
                            onClick={markAllAsRead}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Mark All as Read
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total</p>
                                <p className="text-2xl font-bold">{notifications.length}</p>
                            </div>
                            <Bell className="w-8 h-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100">Unread</p>
                                <p className="text-2xl font-bold">{unreadNotificationsCount}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Urgent</p>
                                <p className="text-2xl font-bold">{urgentNotificationsCount}</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Action Required</p>
                                <p className="text-2xl font-bold">
                                    {notifications.filter(n => n.actionRequired && !n.read).length}
                                </p>
                            </div>
                            <Check className="w-8 h-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="type-filter">Filter by type:</Label>
                            <select
                                id="type-filter"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">All notifications</option>
                                <option value="appointment">Appointments</option>
                                <option value="medication">Medications</option>
                                <option value="consultation">Consultations</option>
                                <option value="follow-up">Follow-ups</option>
                                <option value="urgent">Urgents</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <Label htmlFor="read-filter">Status:</Label>
                            <select
                                id="read-filter"
                                value={readFilter}
                                onChange={(e) => setReadFilter(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">All</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No notifications match the filters</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map(notification => (
                        <Card
                            key={notification.id}
                            className={`border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'shadow-md' : 'opacity-75'
                                } hover:shadow-lg transition-shadow cursor-pointer`}
                            onClick={() => setSelectedNotification(notification)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        {getTypeIcon(notification.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                )}
                                                {notification.actionRequired && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Action required
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'} mb-2`}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {notification.time}
                                                </span>
                                                {notification.patientName && (
                                                    <span>Patient: {notification.patientName}</span>
                                                )}
                                                <Badge
                                                    variant={notification.priority === 'high' ? 'destructive' :
                                                        notification.priority === 'medium' ? 'default' : 'secondary'}
                                                    className="text-xs"
                                                >
                                                    {notification.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {!notification.read && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                            >
                                                <Check className="w-3 h-3" />
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Notification Detail Modal */}
            <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
                <DialogContent className="max-w-2xl">
                    {selectedNotification && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {getTypeIcon(selectedNotification.type)}
                                    {selectedNotification.title}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {selectedNotification.date} - {selectedNotification.time}
                                    </span>
                                    <Badge
                                        variant={selectedNotification.priority === 'high' ? 'destructive' :
                                            selectedNotification.priority === 'medium' ? 'default' : 'secondary'}
                                    >
                                        Priority {selectedNotification.priority}
                                    </Badge>
                                    <Badge variant={selectedNotification.read ? 'default' : 'destructive'}>
                                        {selectedNotification.read ? 'Read' : 'Unread'}
                                    </Badge>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p>{selectedNotification.message}</p>
                                </div>

                                {selectedNotification.patientName && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm">
                                            <strong>Related Patient:</strong> {selectedNotification.patientName}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    {!selectedNotification.read && (
                                        <Button
                                            onClick={() => {
                                                markAsRead(selectedNotification.id);
                                                setSelectedNotification(null);
                                            }}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Mark as Read
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedNotification(null)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Settings Modal */}
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Notification Settings</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="types" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="types">Notification Types</TabsTrigger>
                            <TabsTrigger value="schedules">Schedules & Sounds</TabsTrigger>
                        </TabsList>

                        <TabsContent value="types" className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="appointments">Appointment Notifications</Label>
                                        <p className="text-sm text-gray-600">Reminders for upcoming appointments and changes</p>
                                    </div>
                                    <Switch
                                        id="appointments"
                                        checked={settings.appointments}
                                        onCheckedChange={(checked) => setSettings({ ...settings, appointments: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="medications">Medication Notifications</Label>
                                        <p className="text-sm text-gray-600">Alerts for expired medications and renewals</p>
                                    </div>
                                    <Switch
                                        id="medications"
                                        checked={settings.medications}
                                        onCheckedChange={(checked) => setSettings({ ...settings, medications: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="consultations">Consultation Notifications</Label>
                                        <p className="text-sm text-gray-600">Responses and new inter-consultations</p>
                                    </div>
                                    <Switch
                                        id="consultations"
                                        checked={settings.consultations}
                                        onCheckedChange={(checked) => setSettings({ ...settings, consultations: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="followUps">Follow-up Notifications</Label>
                                        <p className="text-sm text-gray-600">Patient follow-up reminders</p>
                                    </div>
                                    <Switch
                                        id="followUps"
                                        checked={settings.followUps}
                                        onCheckedChange={(checked) => setSettings({ ...settings, followUps: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="urgents">Urgent Notifications</Label>
                                        <p className="text-sm text-gray-600">Critical alerts and urgent results</p>
                                    </div>
                                    <Switch
                                        id="urgents"
                                        checked={settings.urgents}
                                        onCheckedChange={(checked) => setSettings({ ...settings, urgents: checked })}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="schedules" className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="sound">Notification Sound</Label>
                                        <p className="text-sm text-gray-600">Play sound when receiving notifications</p>
                                    </div>
                                    <Switch
                                        id="sound"
                                        checked={settings.sound}
                                        onCheckedChange={(checked) => setSettings({ ...settings, sound: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="email">Email Notifications</Label>
                                        <p className="text-sm text-gray-600">Send notification copy via email</p>
                                    </div>
                                    <Switch
                                        id="email"
                                        checked={settings.email}
                                        onCheckedChange={(checked) => setSettings({ ...settings, email: checked })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="start-time">Start Time</Label>
                                        <input
                                            id="start-time"
                                            type="time"
                                            value={settings.startTime}
                                            onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="end-time">End Time</Label>
                                        <input
                                            id="end-time"
                                            type="time"
                                            value={settings.endTime}
                                            onChange={(e) => setSettings({ ...settings, endTime: e.target.value })}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Note:</strong> Urgent notifications will always be shown,
                                        regardless of the configured schedule.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowConfig(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setShowConfig(false)}>
                            Save Settings
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PushNotifications;
