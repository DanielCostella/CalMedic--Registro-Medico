import React, { useState, useEffect } from 'react';
import { Bell, X, Settings, Filter, Volume2, VolumeX, Smartphone, Mail, MessageSquare, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EnhancedNotification {
    id: string;
    title: string;
    message: string;
    type: 'critical' | 'urgent' | 'normal' | 'info';
    category: 'appointment' | 'medication' | 'laboratory' | 'system' | 'emergency';
    date: Date;
    read: boolean;
    channels: ('push' | 'email' | 'sms')[];
    action?: {
        text: string;
        url: string;
    };
    patient?: {
        name: string;
        id: string;
    };
}

interface NotificationSettings {
    push: boolean;
    email: boolean;
    sms: boolean;
    sound: boolean;
    vibration: boolean;
    startTime: string;
    endTime: string;
    weekdays: string[];
    categories: {
        [key: string]: {
            active: boolean;
            priority: 'high' | 'medium' | 'low';
            channels: string[];
        };
    };
}

const EnhancedNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
    const [settings, setSettings] = useState<NotificationSettings>({
        push: true,
        email: true,
        sms: false,
        sound: true,
        vibration: true,
        startTime: '08:00',
        endTime: '20:00',
        weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        categories: {
            appointment: { active: true, priority: 'high', channels: ['push', 'email'] },
            medication: { active: true, priority: 'medium', channels: ['push'] },
            laboratory: { active: true, priority: 'high', channels: ['push', 'email', 'sms'] },
            system: { active: false, priority: 'low', channels: ['push'] },
            emergency: { active: true, priority: 'high', channels: ['push', 'email', 'sms'] }
        }
    });
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [showSettings, setShowSettings] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newNotification, setNewNotification] = useState<{
        title: string;
        message: string;
        type: 'critical' | 'urgent' | 'normal' | 'info';
        category: 'appointment' | 'medication' | 'laboratory' | 'system' | 'emergency';
        channels: ('push' | 'email' | 'sms')[];
    }>({
        title: '',
        message: '',
        type: 'normal',
        category: 'system',
        channels: ['push']
    });

    useEffect(() => {
        const savedConfig = localStorage.getItem('notifications-config');
        if (savedConfig) {
            setSettings(JSON.parse(savedConfig));
        }

        const sampleNotifications: EnhancedNotification[] = [
            {
                id: '1',
                title: 'Critical Lab Result',
                message: 'Patient Maria Gonzalez - Hemoglobin: 6.8 g/dL (Critical)',
                type: 'critical',
                category: 'laboratory',
                date: new Date(Date.now() - 15 * 60 * 1000),
                read: false,
                channels: ['push', 'email', 'sms'],
                action: { text: 'View Result', url: '/laboratories' },
                patient: { name: 'Maria Gonzalez', id: 'PAC001' }
            },
            {
                id: '2',
                title: 'Appointment Confirmed',
                message: 'Carlos Rodriguez confirmed his appointment for tomorrow at 10:00 AM',
                type: 'normal',
                category: 'appointment',
                date: new Date(Date.now() - 30 * 60 * 1000),
                read: false,
                channels: ['push', 'email'],
                action: { text: 'View Appointment', url: '/appointments' },
                patient: { name: 'Carlos Rodriguez', id: 'PAC002' }
            }
        ];

        setNotifications(sampleNotifications);

        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                const newerNotif: EnhancedNotification = {
                    id: Date.now().toString(),
                    title: 'System Alert',
                    message: `Update performed at ${new Date().toLocaleTimeString()}`,
                    type: 'info',
                    category: 'system',
                    date: new Date(),
                    read: false,
                    channels: ['push']
                };
                setNotifications(prev => [newerNotif, ...prev.slice(0, 19)]);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const saveSettings = () => {
        localStorage.setItem('notifications-config', JSON.stringify(settings));
        setShowSettings(false);
    };

    const sendCustomNotification = () => {
        const notif: EnhancedNotification = {
            id: Date.now().toString(),
            ...newNotification,
            date: new Date(),
            read: false
        };
        setNotifications(prev => [notif, ...prev]);
        setNewNotification({
            title: '',
            message: '',
            type: 'normal',
            category: 'system',
            channels: ['push']
        });
        setShowForm(false);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'urgent': return <Clock className="w-5 h-5 text-orange-600" />;
            case 'normal': return <Info className="w-5 h-5 text-blue-600" />;
            case 'info': return <CheckCircle className="w-5 h-5 text-green-600" />;
            default: return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50';
            case 'urgent': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-900/50';
            case 'normal': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/50';
            case 'info': return 'border-l-green-500 bg-green-50 dark:bg-green-900/10 dark:border-green-900/50';
            default: return 'border-l-gray-500 bg-gray-50 dark:bg-slate-800';
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        const categoryMatches = categoryFilter === 'all' || notif.category === categoryFilter;
        const typeMatches = typeFilter === 'all' || notif.type === typeFilter;
        return categoryMatches && typeMatches;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bell className="w-8 h-8 text-blue-600" />
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white font-bold">
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold dark:text-gray-100">Enhanced Notifications</h2>
                        <p className="text-gray-600 dark:text-gray-400">{unreadCount} unread</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowForm(true)} className="dark:border-slate-700">
                        <MessageSquare className="w-4 h-4 mr-2" /> New
                    </Button>
                    <Button variant="outline" onClick={markAllAsRead} className="dark:border-slate-700">
                        <CheckCircle className="w-4 h-4 mr-2" /> Mark All
                    </Button>
                    <Button variant="outline" onClick={() => setShowSettings(true)} className="dark:border-slate-700">
                        <Settings className="w-4 h-4 mr-2" /> Settings
                    </Button>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4 flex flex-wrap gap-4 items-center">
                    <Label className="dark:text-slate-300 font-bold uppercase text-[10px] tracking-widest">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-40 dark:bg-slate-900 dark:border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="appointment">Appointment</SelectItem>
                            <SelectItem value="medication">Medication</SelectItem>
                            <SelectItem value="laboratory">Laboratory</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                    </Select>
                    <Label className="dark:text-slate-300 font-bold uppercase text-[10px] tracking-widest ml-4">Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-40 dark:bg-slate-900 dark:border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {filteredNotifications.map(notification => (
                    <Card key={notification.id} className={`border-l-4 ${getTypeColor(notification.type)} dark:bg-slate-800`}>
                        <CardContent className="p-5 flex justify-between items-start">
                            <div className="flex gap-4">
                                {getTypeIcon(notification.type)}
                                <div>
                                    <h4 className={`text-lg dark:text-gray-100 ${!notification.read ? 'font-bold' : 'font-semibold'}`}>
                                        {notification.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                                    <div className="flex gap-4 text-[10px] font-bold text-gray-500 uppercase">
                                        <span>{notification.date.toLocaleString()}</span>
                                        <span>{notification.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {!notification.read && (
                                    <Button size="icon" variant="ghost" onClick={() => markAsRead(notification.id)}>
                                        <CheckCircle className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle>Notification Settings</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="channels" className="mt-4">
                        <TabsList className="grid w-full grid-cols-2 dark:bg-slate-800">
                            <TabsTrigger value="channels">Channels</TabsTrigger>
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                        </TabsList>
                        <TabsContent value="channels" className="space-y-4 pt-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                <Label>Push Notifications</Label>
                                <Switch checked={settings.push} onCheckedChange={checked => setSettings(p => ({ ...p, push: checked }))} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                <Label>Email Notifications</Label>
                                <Switch checked={settings.email} onCheckedChange={checked => setSettings(p => ({ ...p, email: checked }))} />
                            </div>
                        </TabsContent>
                        <TabsContent value="schedule" className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input type="time" value={settings.startTime} onChange={e => setSettings(p => ({ ...p, startTime: e.target.value }))} className="dark:bg-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input type="time" value={settings.endTime} onChange={e => setSettings(p => ({ ...p, endTime: e.target.value }))} className="dark:bg-slate-900" />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
                        <Button onClick={saveSettings}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-md dark:bg-slate-900 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle>New Notification</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={newNotification.title} onChange={e => setNewNotification(p => ({ ...p, title: e.target.value }))} className="dark:bg-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea value={newNotification.message} onChange={e => setNewNotification(p => ({ ...p, message: e.target.value }))} className="dark:bg-slate-800" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={newNotification.type} onValueChange={(v: any) => setNewNotification(p => ({ ...p, type: v }))}>
                                    <SelectTrigger className="dark:bg-slate-800"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={newNotification.category} onValueChange={(v: any) => setNewNotification(p => ({ ...p, category: v }))}>
                                    <SelectTrigger className="dark:bg-slate-800"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">System</SelectItem>
                                        <SelectItem value="appointment">Appointment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button onClick={sendCustomNotification}>Send</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EnhancedNotifications;
