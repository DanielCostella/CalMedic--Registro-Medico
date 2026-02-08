import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Scissors, Calendar, Clock,
  LogOut, Star, MessageSquare, Plus, Search,
  UserPlus, RefreshCw
} from 'lucide-react';
import ThemeToggleComponent from '@/components/ui/theme-toggle';
import { doctorService } from '@/services/doctorService';
import { Appointment, Patient } from '@/types/medical';

// Subcomponent for showing service history/preferences
const ServiceHistoryTab = ({ patientId }: { patientId: string }) => {
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadHistory = async () => {
      const records = await doctorService.getPatientHistory(patientId);
      setHistory(records);
      setLoading(false);
    };
    loadHistory();
  }, [patientId]);

  if (loading) return <div className="text-center py-4">Loading history...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Service History</h3>
      {history.length === 0 ? (
         <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
           No prior services found.
         </div>
      ) : (
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {history.map((record) => (
              <Card key={record.id}>
                <CardHeader className="py-3 bg-pink-50">
                   <div className="flex justify-between items-center">
                     <CardTitle className="text-sm font-medium">
                       {new Date(record.visit_date).toLocaleDateString()}
                     </CardTitle>
                     <Badge variant="outline" className="text-pink-600 border-pink-200">{record.diagnosis || 'Service'}</Badge>
                   </div>
                   <p className="text-xs text-gray-500">Stylist/Pro: {record.doctors?.profiles?.first_names}</p>
                </CardHeader>
                <CardContent className="py-3">
                   <div className="space-y-2 text-sm">
                      <p><strong>Notes:</strong> {record.notes}</p>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

interface DashboardProps {
  currentDoctor: any;
  onLogout: () => void;
}

const BeautyDashboard: React.FC<DashboardProps> = ({ currentDoctor, onLogout }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [serviceNotes, setServiceNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recentClients, setRecentClients] = useState<Patient[]>([]);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  
  const [newClient, setNewClient] = useState({
    name: '',
    nationalId: '', 
    birthDate: '', 
    phone: '',
    email: '',
    condition: '', // Preferences
    allergies: '',
    medicalHistory: ''
  });
  
  const [newAppointment, setNewAppointment] = useState({
    clientName: '',
    date: '',
    time: '',
    service: '',
    duration: '45'
  });

  useEffect(() => {
    const fetchData = async () => {
        try {
          const [fetchedAppointments, fetchedPatients] = await Promise.all([
            doctorService.getAppointments(currentDoctor.id),
            doctorService.getPatients(currentDoctor.id)
          ]);
          setAppointments(fetchedAppointments);
          setRecentClients(fetchedPatients);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
    };
    fetchData();
  }, [currentDoctor.id]);

  useEffect(() => {
    const generateId = async () => {
      if (showNewClientDialog) {
        // Beauty clients uses 'BE' prefix
        const nextId = await doctorService.getNextSequentialId('BE');
        setNewClient(prev => ({ ...prev, nationalId: nextId }));
      }
    };
    generateId();
  }, [showNewClientDialog]);

  const handleAttendClient = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setServiceNotes(appointment.notes || '');
  };

  const handleCompleteService = async () => {
    if (selectedAppointment && serviceNotes.trim()) {
      try {
        const result = await doctorService.createMedicalRecord({
          patientId: selectedAppointment.patientId,
          doctorId: currentDoctor.id,
          appointmentId: selectedAppointment.id,
          diagnosis: 'Beauty Service',
          notes: serviceNotes,
          symptoms: '',
          prescription: '',
          vitalSigns: {}
        });

        if (result.success) {
          const updatedAppointments = appointments.map(apt =>
            apt.id === selectedAppointment.id
              ? { ...apt, status: 'Completed' as const, notes: serviceNotes }
              : apt
          );
          setAppointments(updatedAppointments);
          alert('Service marked as completed!');
          setSelectedAppointment(null);
        } else {
          alert('Error completing service: ' + result.message);
        }
      } catch (error: any) {
        alert('Error: ' + error.message);
      }
    } else {
      alert('Please enter service notes.');
    }
  };

  const handleRegisterClient = async () => {
    if (newClient.name && newClient.phone) {
      try {
        const result = await doctorService.createPatient(newClient);
        if (result.success && result.data) {
          alert(`Client registered successfully!`);
          setRecentClients(prev => [result.data!, ...prev]);
          if (!newAppointment.clientName) {
            setNewAppointment(prev => ({ 
              ...prev, 
              clientName: result.data!.firstName + ' ' + result.data!.lastName,
              clientId: result.data!.id 
            } as any));
          }
          setShowNewClientDialog(false);
          setNewClient({ name: '', nationalId: '', birthDate: '', phone: '', email: '', condition: '', allergies: '', medicalHistory: '' });
        } else {
          alert('Error registering client: ' + result.message);
        }
      } catch (error: any) {
        alert('Error: ' + error.message);
      }
    } else {
      alert('Please fill in required fields');
    }
  };

  const handleScheduleAppointment = async () => {
    if (newAppointment.clientName && newAppointment.date && newAppointment.time) {
      try {
        let clientId = (newAppointment as any).clientId;
        if (!clientId) {
          const found = recentClients.find(p => `${p.firstName} ${p.lastName}` === newAppointment.clientName);
          if (found) clientId = found.id;
          else {
             alert('Client not found. Please register client first.');
             return;
          }
        }

        const aptData = {
          patientId: clientId,
          doctorId: currentDoctor.id,
          patientName: newAppointment.clientName,
          date: newAppointment.date,
          time: newAppointment.time,
          duration: parseInt(newAppointment.duration) || 45,
          reason: newAppointment.service || 'Beauty Service',
          status: 'Scheduled' as const,
          type: 'Control' as const,
          reminder: true,
          priority: 'Low' as const
        };

        const result = await doctorService.createAppointment(aptData);
        if (result.success && result.data) {
          alert('Appointment scheduled successfully');
          setAppointments(prev => [...prev, result.data!]);
          setShowNewAppointmentDialog(false);
        } else {
          alert('Error scheduling appointment: ' + result.message);
        }
      } catch (error: any) {
         alert('Error: ' + error.message);
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-pink-100 text-pink-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30">
      <div className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center`}>
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentDoctor.name}</h1>
                <p className="text-sm text-gray-600">{currentDoctor.specialty} Stylist/Pro</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggleComponent />
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                     <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-gray-500">Today</p><p className="text-xl font-bold">{appointments.length}</p></div>
                            <Calendar className="text-pink-500" />
                        </CardContent>
                     </Card>
                     <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-gray-500">Upcoming</p><p className="text-xl font-bold">{appointments.filter(a => a.status === 'Scheduled').length}</p></div>
                            <Clock className="text-purple-500" />
                        </CardContent>
                     </Card>
                     <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-gray-500">Done</p><p className="text-xl font-bold">{appointments.filter(a => a.status === 'Completed').length}</p></div>
                            <Star className="text-yellow-500" />
                        </CardContent>
                     </Card>
                </div>

                {/* Agenda */}
                <Card className="h-[600px] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                         <CardTitle>Appointments</CardTitle>
                         <div className="flex gap-2">
                             <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input placeholder="Search client..." className="pl-8 w-[200px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                             </div>
                             <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
                                <DialogTrigger asChild><Button size="sm" className="bg-pink-600 hover:bg-pink-700"><Plus className="w-4 h-4" /></Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>New Appointment</DialogTitle></DialogHeader>
                                    <div className="space-y-4">
                                        <Label>Select Client</Label>
                                        <select className="flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm" 
                                            value={newAppointment.clientName}
                                            onChange={(e) => {
                                                const p = recentClients.find(pat => `${pat.firstName} ${pat.lastName}` === e.target.value);
                                                setNewAppointment({ ...newAppointment, clientName: e.target.value, clientId: p?.id } as any);
                                            }}
                                        >
                                            <option value="">Select...</option>
                                            {recentClients.map(p => <option key={p.id} value={`${p.firstName} ${p.lastName}`}>{p.firstName} {p.lastName}</option>)}
                                        </select>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><Label>Date</Label><Input type="date" value={newAppointment.date} onChange={e => setNewAppointment({...newAppointment, date: e.target.value})} /></div>
                                            <div><Label>Time</Label><Input type="time" value={newAppointment.time} onChange={e => setNewAppointment({...newAppointment, time: e.target.value})} /></div>
                                        </div>
                                        <div><Label>Service</Label><Input value={newAppointment.service} onChange={e => setNewAppointment({...newAppointment, service: e.target.value})} /></div>
                                        <Button onClick={handleScheduleAppointment} className="w-full bg-pink-600">Schedule</Button>
                                    </div>
                                </DialogContent>
                             </Dialog>
                         </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full">
                            {appointments.filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase())).map(app => (
                                <div key={app.id} className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center w-16">
                                            <p className="font-bold">{app.time}</p>
                                            <Badge variant="outline" className={getStatusColor(app.status)}>{app.status}</Badge>
                                        </div>
                                        <div>
                                            <p className="font-medium">{app.patientName}</p>
                                            <p className="text-sm text-gray-500">{app.reason}</p>
                                        </div>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="secondary" onClick={() => handleAttendClient(app)}>
                                                Process
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <DialogHeader><DialogTitle>Service Processing</DialogTitle></DialogHeader>
                                            <Tabs defaultValue="service">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="service">Service & Outcomes</TabsTrigger>
                                                    <TabsTrigger value="history">History</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="service" className="space-y-4">
                                                    <div>
                                                        <Label>Service Notes / Preferences / Styles Used</Label>
                                                        <Textarea className="mt-2" rows={8} value={serviceNotes} onChange={e => setServiceNotes(e.target.value)} placeholder="E.g. Dye color used, cut style, client feedback..." />
                                                    </div>
                                                    <Button onClick={handleCompleteService} className="w-full bg-pink-600 hover:bg-pink-700">Service Completed</Button>
                                                </TabsContent>
                                                <TabsContent value="history">
                                                    <ServiceHistoryTab patientId={app.patientId} />
                                                </TabsContent>
                                            </Tabs>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Clients Sidebar */}
            <div className="space-y-6">
                 <Card>
                    <CardHeader><CardTitle>Clients</CardTitle></CardHeader>
                    <CardContent>
                        <Button className="w-full mb-4 bg-pink-500 hover:bg-pink-600" onClick={() => setShowNewClientDialog(true)}><UserPlus className="w-4 h-4 mr-2"/> New Client</Button>
                        <ScrollArea className="h-[300px]">
                            {recentClients.map(p => (
                                <div key={p.id} className="p-2 border-b text-sm flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{p.firstName} {p.lastName}</p>
                                        <p className="text-gray-500 text-xs">{p.phone}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px]">{p.nationalId}</Badge>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                 </Card>

                 <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Customer</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                            <Input placeholder="Full Name" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                            <div className="flex gap-2">
                                <Input value={newClient.nationalId} readOnly placeholder="ID Auto-gen" className="bg-gray-50"/>
                                <Button size="sm" variant="outline" onClick={async () => {
                                    const nextId = await doctorService.getNextSequentialId('BE');
                                    setNewClient(prev => ({ ...prev, nationalId: nextId }));
                                }}><RefreshCw className="w-4 h-4"/></Button>
                            </div>
                            <Input placeholder="Phone" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                            <Input type="email" placeholder="Email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                            <Textarea placeholder="Preferences / Notes" value={newClient.condition} onChange={e => setNewClient({...newClient, condition: e.target.value})} />
                            
                            <Button onClick={handleRegisterClient} className="w-full bg-pink-600">Save Customer</Button>
                        </div>
                    </DialogContent>
                 </Dialog>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BeautyDashboard;
