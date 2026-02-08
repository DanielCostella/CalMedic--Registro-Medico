import React, { useState, useEffect } from 'react';
import { Video, Phone, MessageCircle, Calendar, Users, Clock, Settings, Mic, MicOff, VideoOff, Monitor, PhoneOff } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

interface VirtualConsultation {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    dateTime: string;
    duration: number; // in minutes
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Canceled' | 'No-show';
    type: 'Video Call' | 'Voice Call' | 'Chat';
    reason: string;
    notes: string;
    recording?: {
        url: string;
        duration: number;
        size: number;
    };
    participants: Participant[];
    settings: ConsultationSettings;
}

interface Participant {
    id: string;
    name: string;
    role: 'Doctor' | 'Patient' | 'Companion' | 'Specialist';
    status: 'Connected' | 'Disconnected' | 'Waiting';
    connectionTime?: string;
}

interface ConsultationSettings {
    cameraEnabled: boolean;
    microphoneEnabled: boolean;
    recordingEnabled: boolean;
    chatEnabled: boolean;
    screenShareEnabled: boolean;
    waitingRoomEnabled: boolean;
    remindersEnabled: boolean;
}

interface ChatMessage {
    id: string;
    consultationId: string;
    authorId: string;
    authorName: string;
    message: string;
    date: string;
    type: 'text' | 'file' | 'image';
    fileUrl?: string;
}

interface VirtualRoom {
    id: string;
    name: string;
    status: 'Available' | 'Occupied' | 'Maintenance';
    maxCapacity: number;
    currentParticipants: number;
    settings: RoomSettings;
}

interface RoomSettings {
    videoQuality: 'HD' | 'Full HD' | '4K';
    audioQuality: 'Standard' | 'High';
    encryption: boolean;
    autoRecording: boolean;
    maxSessionTime: number; // in minutes
}

const Telemedicine: React.FC = () => {
    const [consultations, setConsultations] = useState<VirtualConsultation[]>([]);
    const [rooms, setRooms] = useState<VirtualRoom[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeConsultation, setActiveConsultation] = useState<VirtualConsultation | null>(null);
    const [showNewConsultation, setShowNewConsultation] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Active call states
    const [inCall, setInCall] = useState(false);
    const [cameraActive, setCameraActive] = useState(true);
    const [microphoneActive, setMicrophoneActive] = useState(true);
    const [screenShareActive, setScreenShareActive] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');

    const [newConsultation, setNewConsultation] = useState<Omit<VirtualConsultation, 'id' | 'status' | 'participants'>>({
        patientId: '',
        patientName: '',
        doctorId: '1',
        doctorName: 'System Dr.',
        dateTime: '',
        duration: 30,
        type: 'Video Call',
        reason: '',
        notes: '',
        settings: {
            cameraEnabled: true,
            microphoneEnabled: true,
            recordingEnabled: false,
            chatEnabled: true,
            screenShareEnabled: true,
            waitingRoomEnabled: true,
            remindersEnabled: true
        }
    });

    useEffect(() => {
        // Mock data loading
        setTimeout(() => {
            const initialConsultations: VirtualConsultation[] = [
                {
                    id: '1',
                    patientId: '1',
                    patientName: 'María González',
                    doctorId: '1',
                    doctorName: 'Dr. Juan Pérez',
                    dateTime: '2024-01-16 16:00:00',
                    duration: 30,
                    status: 'Scheduled',
                    type: 'Video Call',
                    reason: 'Diabetes control',
                    notes: '',
                    participants: [
                        {
                            id: '1',
                            name: 'Dr. Juan Pérez',
                            role: 'Doctor',
                            status: 'Disconnected'
                        },
                        {
                            id: '2',
                            name: 'María González',
                            role: 'Patient',
                            status: 'Disconnected'
                        }
                    ],
                    settings: {
                        cameraEnabled: true,
                        microphoneEnabled: true,
                        recordingEnabled: false,
                        chatEnabled: true,
                        screenShareEnabled: true,
                        waitingRoomEnabled: true,
                        remindersEnabled: true
                    }
                },
                {
                    id: '2',
                    patientId: '2',
                    patientName: 'Carlos Rodríguez',
                    doctorId: '2',
                    doctorName: 'Dra. María González',
                    dateTime: '2024-01-16 14:30:00',
                    duration: 45,
                    status: 'Completed',
                    type: 'Video Call',
                    reason: 'Cardiology consultation',
                    notes: 'Patient shows improvement in symptoms. Continue with current medication.',
                    recording: {
                        url: '/recordings/consultation-2.mp4',
                        duration: 42,
                        size: 256000000 // 256MB
                    },
                    participants: [
                        {
                            id: '3',
                            name: 'Dra. María González',
                            role: 'Doctor',
                            status: 'Disconnected',
                            connectionTime: '42 minutes'
                        },
                        {
                            id: '4',
                            name: 'Carlos Rodríguez',
                            role: 'Patient',
                            status: 'Disconnected',
                            connectionTime: '42 minutes'
                        }
                    ],
                    settings: {
                        cameraEnabled: true,
                        microphoneEnabled: true,
                        recordingEnabled: true,
                        chatEnabled: true,
                        screenShareEnabled: false,
                        waitingRoomEnabled: true,
                        remindersEnabled: true
                    }
                },
                {
                    id: '3',
                    patientId: '3',
                    patientName: 'Ana Martínez',
                    doctorId: '1',
                    doctorName: 'Dr. Juan Pérez',
                    dateTime: '2024-01-16 10:00:00',
                    duration: 20,
                    status: 'In Progress',
                    type: 'Voice Call',
                    reason: 'Post-operative follow-up',
                    notes: '',
                    participants: [
                        {
                            id: '1',
                            name: 'Dr. Juan Pérez',
                            role: 'Doctor',
                            status: 'Connected',
                            connectionTime: '15 minutes'
                        },
                        {
                            id: '5',
                            name: 'Ana Martínez',
                            role: 'Patient',
                            status: 'Connected',
                            connectionTime: '15 minutes'
                        }
                    ],
                    settings: {
                        cameraEnabled: false,
                        microphoneEnabled: true,
                        recordingEnabled: false,
                        chatEnabled: true,
                        screenShareEnabled: false,
                        waitingRoomEnabled: false,
                        remindersEnabled: true
                    }
                }
            ];

            const initialRooms: VirtualRoom[] = [
                {
                    id: '1',
                    name: 'Virtual Room 1',
                    status: 'Occupied',
                    maxCapacity: 4,
                    currentParticipants: 2,
                    settings: {
                        videoQuality: 'HD',
                        audioQuality: 'High',
                        encryption: true,
                        autoRecording: false,
                        maxSessionTime: 120
                    }
                },
                {
                    id: '2',
                    name: 'Virtual Room 2',
                    status: 'Available',
                    maxCapacity: 6,
                    currentParticipants: 0,
                    settings: {
                        videoQuality: 'Full HD',
                        audioQuality: 'High',
                        encryption: true,
                        autoRecording: true,
                        maxSessionTime: 180
                    }
                },
                {
                    id: '3',
                    name: 'Emergency Room',
                    status: 'Available',
                    maxCapacity: 8,
                    currentParticipants: 0,
                    settings: {
                        videoQuality: '4K',
                        audioQuality: 'High',
                        encryption: true,
                        autoRecording: true,
                        maxSessionTime: 240
                    }
                }
            ];

            const initialMessages: ChatMessage[] = [
                {
                    id: '1',
                    consultationId: '3',
                    authorId: '1',
                    authorName: 'Dr. Juan Pérez',
                    message: 'Good morning Ana, how do you feel after the operation?',
                    date: '2024-01-16 10:05:00',
                    type: 'text'
                },
                {
                    id: '2',
                    consultationId: '3',
                    authorId: '5',
                    authorName: 'Ana Martínez',
                    message: 'Good morning doctor, I feel much better. The pain has decreased significantly.',
                    date: '2024-01-16 10:06:00',
                    type: 'text'
                },
                {
                    id: '3',
                    consultationId: '3',
                    authorId: '1',
                    authorName: 'Dr. Juan Pérez',
                    message: 'Excellent. Have you followed the post-operative instructions we gave you?',
                    date: '2024-01-16 10:07:00',
                    type: 'text'
                }
            ];

            setConsultations(initialConsultations);
            setRooms(initialRooms);
            setChatMessages(initialMessages);
            setLoading(false);
        }, 1000);
    }, []);

    const startConsultation = (consultation: VirtualConsultation) => {
        setActiveConsultation(consultation);
        setInCall(true);

        // Update consultation status
        setConsultations(prev => prev.map(c =>
            c.id === consultation.id ? { ...c, status: 'In Progress' as const } : c
        ));
    };

    const endConsultation = () => {
        if (activeConsultation) {
            setConsultations(prev => prev.map(c =>
                c.id === activeConsultation.id ? { ...c, status: 'Completed' as const } : c
            ));
        }

        setActiveConsultation(null);
        setInCall(false);
        setCameraActive(true);
        setMicrophoneActive(true);
        setScreenShareActive(false);
        setChatOpen(false);
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !activeConsultation) return;

        const message: ChatMessage = {
            id: Date.now().toString(),
            consultationId: activeConsultation.id,
            authorId: '1',
            authorName: 'System Dr.',
            message: newMessage,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            type: 'text'
        };

        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const createConsultation = () => {
        const consultation: VirtualConsultation = {
            ...newConsultation,
            id: Date.now().toString(),
            status: 'Scheduled',
            participants: [
                {
                    id: '1',
                    name: newConsultation.doctorName,
                    role: 'Doctor',
                    status: 'Disconnected'
                },
                {
                    id: '2',
                    name: newConsultation.patientName,
                    role: 'Patient',
                    status: 'Disconnected'
                }
            ]
        };

        setConsultations(prev => [...prev, consultation]);
        setShowNewConsultation(false);
        resetForm();
    };

    const resetForm = () => {
        setNewConsultation({
            patientId: '',
            patientName: '',
            doctorId: '1',
            doctorName: 'System Dr.',
            dateTime: '',
            duration: 30,
            type: 'Video Call',
            reason: '',
            notes: '',
            settings: {
                cameraEnabled: true,
                microphoneEnabled: true,
                recordingEnabled: false,
                chatEnabled: true,
                screenShareEnabled: true,
                waitingRoomEnabled: true,
                remindersEnabled: true
            }
        });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusColor = (status: VirtualConsultation['status']) => {
        switch (status) {
            case 'Scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'In Progress': return 'text-green-600 bg-green-50 border-green-200';
            case 'Completed': return 'text-gray-600 bg-gray-50 border-gray-200';
            case 'Canceled': return 'text-red-600 bg-red-50 border-red-200';
            case 'No-show': return 'text-orange-600 bg-orange-50 border-orange-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const filteredConsultations = consultations.filter(consultation => {
        const matchStatus = !statusFilter || consultation.status === statusFilter;
        const matchType = !typeFilter || consultation.type === typeFilter;
        const matchDate = !dateFilter || consultation.dateTime.startsWith(dateFilter);

        return matchStatus && matchType && matchDate;
    });

    const activeConsultationMessages = chatMessages.filter(m => m.consultationId === activeConsultation?.id);

    if (loading) {
        return (
            <div className="p-6">
                <LoadingSpinner size="lg" text="Loading telemedicine system..." />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Video className="w-8 h-8 text-blue-600" />
                        Telemedicine System
                    </h1>
                    <p className="text-gray-600">
                        Virtual consultations, video calls, and real-time medical chat
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowSettings(true)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>

                    <Dialog open={showNewConsultation} onOpenChange={setShowNewConsultation}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Video className="w-4 h-4 mr-2" />
                                New Virtual Consultation
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Schedule New Virtual Consultation</DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="general">General Information</TabsTrigger>
                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="patient-name">Patient Name *</Label>
                                            <Input
                                                id="patient-name"
                                                value={newConsultation.patientName}
                                                onChange={(e) => setNewConsultation({ ...newConsultation, patientName: e.target.value })}
                                                placeholder="Full Name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="doctor-name">Assigned Doctor</Label>
                                            <Input
                                                id="doctor-name"
                                                value={newConsultation.doctorName}
                                                onChange={(e) => setNewConsultation({ ...newConsultation, doctorName: e.target.value })}
                                                placeholder="System Dr."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="date-time">Date and Time *</Label>
                                            <Input
                                                id="date-time"
                                                type="datetime-local"
                                                value={newConsultation.dateTime}
                                                onChange={(e) => setNewConsultation({ ...newConsultation, dateTime: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="duration">Duration (minutes)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={newConsultation.duration}
                                                onChange={(e) => setNewConsultation({ ...newConsultation, duration: parseInt(e.target.value) })}
                                                min="15"
                                                max="180"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="type">Consultation Type</Label>
                                        <Select
                                            value={newConsultation.type}
                                            onValueChange={(value: VirtualConsultation['type']) =>
                                                setNewConsultation({ ...newConsultation, type: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Video Call">Video Call</SelectItem>
                                                <SelectItem value="Voice Call">Voice Call</SelectItem>
                                                <SelectItem value="Chat">Chat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="reason">Consultation Reason</Label>
                                        <Textarea
                                            id="reason"
                                            value={newConsultation.reason}
                                            onChange={(e) => setNewConsultation({ ...newConsultation, reason: e.target.value })}
                                            placeholder="Describe the reason for the consultation..."
                                            rows={3}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="settings" className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Camera Enabled</Label>
                                            <Switch
                                                checked={newConsultation.settings.cameraEnabled}
                                                onCheckedChange={(checked) =>
                                                    setNewConsultation({
                                                        ...newConsultation,
                                                        settings: { ...newConsultation.settings, cameraEnabled: checked }
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Microphone Enabled</Label>
                                            <Switch
                                                checked={newConsultation.settings.microphoneEnabled}
                                                onCheckedChange={(checked) =>
                                                    setNewConsultation({
                                                        ...newConsultation,
                                                        settings: { ...newConsultation.settings, microphoneEnabled: checked }
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Recording Enabled</Label>
                                            <Switch
                                                checked={newConsultation.settings.recordingEnabled}
                                                onCheckedChange={(checked) =>
                                                    setNewConsultation({
                                                        ...newConsultation,
                                                        settings: { ...newConsultation.settings, recordingEnabled: checked }
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Chat Enabled</Label>
                                            <Switch
                                                checked={newConsultation.settings.chatEnabled}
                                                onCheckedChange={(checked) =>
                                                    setNewConsultation({
                                                        ...newConsultation,
                                                        settings: { ...newConsultation.settings, chatEnabled: checked }
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Screen Share</Label>
                                            <Switch
                                                checked={newConsultation.settings.screenShareEnabled}
                                                onCheckedChange={(checked) =>
                                                    setNewConsultation({
                                                        ...newConsultation,
                                                        settings: { ...newConsultation.settings, screenShareEnabled: checked }
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Waiting Room</Label>
                                            <Switch
                                                checked={newConsultation.settings.waitingRoomEnabled}
                                                onCheckedChange={(checked) =>
                                                    setNewConsultation({
                                                        ...newConsultation,
                                                        settings: { ...newConsultation.settings, waitingRoomEnabled: checked }
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label>Automatic Reminders</Label>
                                            <Switch
                                                checked={newConsultation.settings.remindersEnabled}
                                                onCheckedChange={(checked) =>
                                                    setNewConsultation({
                                                        ...newConsultation,
                                                        settings: { ...newConsultation.settings, remindersEnabled: checked }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" onClick={() => { setShowNewConsultation(false); resetForm(); }}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={createConsultation}
                                    disabled={!newConsultation.patientName || !newConsultation.dateTime}
                                >
                                    Schedule Consultation
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total Consultations</p>
                                <p className="text-2xl font-bold">{consultations.length}</p>
                            </div>
                            <Video className="w-8 h-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">In Progress</p>
                                <p className="text-2xl font-bold">
                                    {consultations.filter(c => c.status === 'In Progress').length}
                                </p>
                            </div>
                            <Phone className="w-8 h-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Scheduled Today</p>
                                <p className="text-2xl font-bold">
                                    {consultations.filter(c =>
                                        c.status === 'Scheduled' &&
                                        c.dateTime.startsWith(new Date().toISOString().split('T')[0])
                                    ).length}
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100">Available Rooms</p>
                                <p className="text-2xl font-bold">
                                    {rooms.filter(s => s.status === 'Available').length}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Videocall Interface */}
            {inCall && activeConsultation && (
                <Card className="border-2 border-blue-500">
                    <CardHeader className="bg-blue-50">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Video className="w-6 h-6 text-blue-600" />
                                Consultation in Progress - {activeConsultation.patientName}
                            </div>
                            <Badge className="bg-green-500 text-white">
                                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                                LIVE
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Video */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                                    <div className="text-white text-center">
                                        <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">Video Call Simulation</p>
                                        <p className="text-sm opacity-75">
                                            {activeConsultation.type} with {activeConsultation.patientName}
                                        </p>
                                    </div>

                                    {/* Video controls */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={microphoneActive ? "default" : "destructive"}
                                            onClick={() => setMicrophoneActive(!microphoneActive)}
                                        >
                                            {microphoneActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant={cameraActive ? "default" : "destructive"}
                                            onClick={() => setCameraActive(!cameraActive)}
                                        >
                                            {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant={screenShareActive ? "default" : "outline"}
                                            onClick={() => setScreenShareActive(!screenShareActive)}
                                        >
                                            <Monitor className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant={chatOpen ? "default" : "outline"}
                                            onClick={() => setChatOpen(!chatOpen)}
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={endConsultation}
                                        >
                                            <PhoneOff className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-4">
                                {/* Participants */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Participants</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3">
                                        <div className="space-y-2">
                                            {activeConsultation.participants.map(participant => (
                                                <div key={participant.id} className="flex items-center justify-between text-sm">
                                                    <span>{participant.name}</span>
                                                    <Badge variant={participant.status === 'Connected' ? 'default' : 'secondary'}>
                                                        {participant.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Chat */}
                                {chatOpen && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm">Chat</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3">
                                            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                                                {activeConsultationMessages.map(message => (
                                                    <div key={message.id} className="text-xs">
                                                        <div className="font-medium">{message.authorName}</div>
                                                        <div className="text-gray-600">{message.message}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Type message..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                    className="text-sm"
                                                />
                                                <Button size="sm" onClick={sendMessage}>
                                                    Send
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Consultation Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 text-xs space-y-1">
                                        <div><strong>Reason:</strong> {activeConsultation.reason}</div>
                                        <div><strong>Duration:</strong> {activeConsultation.duration} min</div>
                                        <div><strong>Type:</strong> {activeConsultation.type}</div>
                                        {activeConsultation.settings.recordingEnabled && (
                                            <div className="text-red-600">
                                                <strong>⚫ Recording</strong>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Tabs */}
            <Tabs defaultValue="consultations" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="consultations">Consultations</TabsTrigger>
                    <TabsTrigger value="rooms">Virtual Rooms</TabsTrigger>
                    <TabsTrigger value="recordings">Recordings</TabsTrigger>
                </TabsList>

                <TabsContent value="consultations" className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Label>Filter consultations</Label>
                                </div>

                                <div className="flex gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All</SelectItem>
                                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Canceled">Canceled</SelectItem>
                                            <SelectItem value="No-show">No-show</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All</SelectItem>
                                            <SelectItem value="Video Call">Video Call</SelectItem>
                                            <SelectItem value="Voice Call">Voice Call</SelectItem>
                                            <SelectItem value="Chat">Chat</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="date"
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                        className="w-40"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Consultation List */}
                    <div className="space-y-4">
                        {filteredConsultations.map(consultation => (
                            <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {consultation.patientName}
                                                </h3>
                                                <Badge className={getStatusColor(consultation.status)}>
                                                    {consultation.status}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {consultation.type === 'Video Call' ? '🎥' :
                                                        consultation.type === 'Voice Call' ? '📞' : '💬'} {consultation.type}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                                <div>
                                                    <strong>Doctor:</strong> {consultation.doctorName}
                                                </div>
                                                <div>
                                                    <strong>Date:</strong> {new Date(consultation.dateTime).toLocaleString()}
                                                </div>
                                                <div>
                                                    <strong>Duration:</strong> {consultation.duration} min
                                                </div>
                                                <div>
                                                    <strong>Participants:</strong> {consultation.participants.length}
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-600 mb-2">
                                                <strong>Reason:</strong> {consultation.reason}
                                            </div>

                                            {consultation.notes && (
                                                <div className="text-sm text-gray-600">
                                                    <strong>Notes:</strong> {consultation.notes}
                                                </div>
                                            )}

                                            {consultation.recording && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                    <strong>Recording available:</strong> {consultation.recording.duration} min - {formatFileSize(consultation.recording.size)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {consultation.status === 'Scheduled' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => startConsultation(consultation)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Video className="w-4 h-4 mr-1" />
                                                    Start
                                                </Button>
                                            )}

                                            {consultation.status === 'In Progress' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => startConsultation(consultation)}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Video className="w-4 h-4 mr-1" />
                                                    Join
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="rooms" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map(room => (
                            <Card key={room.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-lg">{room.name}</h3>
                                        <Badge variant={
                                            room.status === 'Available' ? 'default' :
                                                room.status === 'Occupied' ? 'secondary' : 'destructive'
                                        }>
                                            {room.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex justify-between">
                                            <span>Capacity:</span>
                                            <span>{room.currentParticipants}/{room.maxCapacity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Video Quality:</span>
                                            <span>{room.settings.videoQuality}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Encryption:</span>
                                            <span>{room.settings.encryption ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Max Time:</span>
                                            <span>{room.settings.maxSessionTime} min</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            disabled={room.status !== 'Available'}
                                            className="flex-1"
                                        >
                                            <Video className="w-4 h-4 mr-1" />
                                            Use Room
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="recordings" className="space-y-4">
                    <div className="space-y-4">
                        {consultations.filter(c => c.recording).map(consultation => (
                            <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-2">
                                                {consultation.patientName} - {consultation.doctorName}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                                <div>
                                                    <strong>Date:</strong> {new Date(consultation.dateTime).toLocaleDateString()}
                                                </div>
                                                <div>
                                                    <strong>Duration:</strong> {consultation.recording?.duration} min
                                                </div>
                                                <div>
                                                    <strong>Size:</strong> {consultation.recording && formatFileSize(consultation.recording.size)}
                                                </div>
                                                <div>
                                                    <strong>Type:</strong> {consultation.type}
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                <strong>Reason:</strong> {consultation.reason}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                                <Video className="w-4 h-4 mr-1" />
                                                Play
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Telemedicine;
