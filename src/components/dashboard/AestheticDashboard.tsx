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
  Sparkles, Calendar, Clock,
  LogOut, Activity, MessageSquare, Plus, Search,
  UserPlus, RefreshCw, Printer
} from 'lucide-react';
import ThemeToggleComponent from '@/components/ui/theme-toggle';
import { doctorService } from '@/services/doctorService';
import { Appointment, Patient } from '@/types/medical';

// Subcomponente para mostrar el historial de tratamientos
const TreatmentHistoryTab = ({ patientId }: { patientId: string }) => {
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
      <h3 className="text-lg font-semibold">Treatment History</h3>
      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
          No prior treatments found.
        </div>
      ) : (
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {history.map((record) => (
              <Card key={record.id}>
                <CardHeader className="py-3 bg-purple-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">
                      {new Date(record.visit_date).toLocaleDateString()}
                    </CardTitle>
                    <Badge variant="outline" className="text-purple-700 border-purple-200">{record.diagnosis || 'Session'}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">Specialist: {record.doctors?.profiles?.first_names} {record.doctors?.profiles?.last_names}</p>
                </CardHeader>
                <CardContent className="py-3">
                  <div className="space-y-2 text-sm">
                    <p><strong>Treatment:</strong> {record.notes}</p>
                    {record.prescription && <div className="bg-purple-50 p-2 rounded mt-2"><strong>Products Used/Recommended:</strong> {record.prescription}</div>}
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

const AestheticDashboard: React.FC<DashboardProps> = ({ currentDoctor, onLogout }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [productRecs, setProductRecs] = useState('');
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
    gender: '',
    address: '',
    condition: '', // Used for skin type maybe?
    allergies: '',
    medicalHistory: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newAppointment, setNewAppointment] = useState({
    clientName: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    time: '',
    service: '',
    duration: '60'
  });

  /* REMOVED selectedDate state and input */
  // const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 
  const [filterDate, setFilterDate] = useState(''); // New State for filtering by specific date
  const [appointmentPage, setAppointmentPage] = useState(1);
  const appointmentsPerPage = 7; // Increased size to show more context

  // 1. Filter & Sort Appointments
  const filteredAppointments = appointments
    .filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(a => filterDate ? a.date === filterDate : true) // Filter by date if selected
    .sort((a, b) => {
      // Sort Descending (Newest to Oldest) as requested
      const dateA = new Date(a.date + 'T' + a.time).getTime();
      const dateB = new Date(b.date + 'T' + b.time).getTime();
      return dateB - dateA;
    });

  const totalAppointmentPages = Math.ceil(filteredAppointments.length / appointmentsPerPage) || 1;

  // 2. Paginate the FILTERED & SORTED list
  const paginatedAppointments = filteredAppointments.slice(
    (appointmentPage - 1) * appointmentsPerPage,
    appointmentPage * appointmentsPerPage
  );

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
        // Aesthetic clients uses 'AE' prefix
        const nextId = await doctorService.getNextSequentialId('AE');
        setNewClient(prev => ({ ...prev, nationalId: nextId }));
      }
    };
    generateId();
  }, [showNewClientDialog]);

  const handleAttendClient = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setTreatmentNotes(appointment.notes || '');
    setProductRecs('');
  };

  const handleSaveSession = async () => {
    if (selectedAppointment && treatmentNotes.trim()) {
      try {
        const result = await doctorService.createMedicalRecord({
          patientId: selectedAppointment.patientId,
          doctorId: currentDoctor.id,
          appointmentId: selectedAppointment.id,
          diagnosis: 'Aesthetic Treatment',
          notes: treatmentNotes,
          symptoms: '',
          prescription: productRecs, // storing product recs in prescription field
          vitalSigns: {}
        });

        if (result.success) {
          const updatedAppointments = appointments.map(apt =>
            apt.id === selectedAppointment.id
              ? { ...apt, status: 'Completed' as const, notes: treatmentNotes }
              : apt
          );
          setAppointments(updatedAppointments);
          alert('Session saved successfully!');
          setSelectedAppointment(null);
        } else {
          alert('Error saving session: ' + result.message);
        }
      } catch (error: any) {
        alert('Error: ' + error.message);
      }
    } else {
      alert('Please enter treatment details.');
    }
  };

  const handleRegisterClient = async () => {
    if (newClient.name && newClient.phone) {
      try {
        // Pass currentDoctor.id to link the patient!
        const result = await doctorService.createPatient(newClient, currentDoctor.id);
        if (result.success && result.data) {
          alert(`Client registered successfully!`);
          setRecentClients(prev => [result.data!, ...prev]); // Update local state immediately

          // Auto-select the new client for appointment if applicable
          if (!newAppointment.clientName) {
            setNewAppointment(prev => ({
              ...prev,
              clientName: result.data!.firstName + ' ' + result.data!.lastName,
              clientId: result.data!.id
            } as any));
          }
          setShowNewClientDialog(false);
          setNewClient({ name: '', nationalId: '', birthDate: '', phone: '', email: '', gender: '', address: '', condition: '', allergies: '', medicalHistory: '' });
        } else {
          // Show specific error message from service (e.g., "Medical record already exists for this DNI")
          alert('Error registering client: ' + (result.message || 'Unknown error'));
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
          // Ensure we save exact date string without timezone shifts
          date: newAppointment.date,
          time: newAppointment.time,
          duration: parseInt(newAppointment.duration) || 60,
          reason: newAppointment.service || 'Aesthetic Service',
          status: 'Scheduled' as const,
          type: 'Control' as const, // Mapping to existing types
          reminder: true,
          priority: 'Medium' as const
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
      case 'Completed': return 'bg-purple-100 text-purple-800';
      case 'Scheduled': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-purple-50/30">
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentDoctor.name}</h1>
                <p className="text-sm text-gray-600">{currentDoctor.specialty} Specialist</p>
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
                  <div><p className="text-sm text-gray-500">Today's Sessions</p><p className="text-xl font-bold">{appointments.length}</p></div>
                  <Calendar className="text-purple-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Upcoming</p><p className="text-xl font-bold">{appointments.filter(a => a.status === 'Scheduled').length}</p></div>
                  <Clock className="text-pink-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Completed</p><p className="text-xl font-bold">{appointments.filter(a => a.status === 'Completed').length}</p></div>
                  <Activity className="text-green-500" />
                </CardContent>
              </Card>
            </div>

            {/* Agenda */}
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle>Schedule</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex gap-2">
                    <Input
                      type="date"
                      className="w-[150px]"
                      value={filterDate}
                      onChange={e => setFilterDate(e.target.value)}
                    />
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input placeholder="Search client..." className="pl-8 w-[200px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                  <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
                    <DialogTrigger asChild><Button size="sm" className="bg-purple-600 hover:bg-purple-700"><Plus className="w-4 h-4" /></Button></DialogTrigger>
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
                          <div><Label>Date</Label><Input type="date" value={newAppointment.date} onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })} /></div>
                          <div><Label>Time</Label><Input type="time" value={newAppointment.time} onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })} /></div>
                        </div>
                        <div><Label>Service/Reason</Label><Input value={newAppointment.service} onChange={e => setNewAppointment({ ...newAppointment, service: e.target.value })} /></div>
                        <Button onClick={handleScheduleAppointment} className="w-full bg-purple-600">Schedule</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {paginatedAppointments
                    .map((app, index) => {
                      const isPast = new Date(app.date + 'T' + app.time) < new Date() && app.status !== 'Completed';

                      // Logic for Date Header:
                      // Show header if it's the first item OR if the date is different from the previous item
                      const showDateHeader = index === 0 || paginatedAppointments[index - 1].date !== app.date;

                      return (
                        <div key={app.id}>
                          {showDateHeader && (
                            <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                              {new Date(app.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                          )}
                          <div className={`flex items-center justify-between p-4 border-b hover:bg-gray-50 ${isPast ? 'opacity-60 bg-gray-50' : ''}`}>
                            <div className="flex items-center gap-4">
                              <div className="text-center w-24">
                                <p className="font-bold text-lg">{app.time}</p>
                                <Badge variant="outline" className={`mt-1 ${getStatusColor(app.status)}`}>{app.status}</Badge>
                              </div>
                              <div>
                                <p className="font-medium">{app.patientName}</p>
                                <p className="text-sm text-gray-500">{app.reason}</p>
                                {isPast && <p className="text-xs text-red-500 font-medium">Overdue / Past</p>}
                              </div>
                            </div>
                            <div className="flex gap-2 h-8 items-center">
                              {app.status === 'Scheduled' ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-gray-400 hover:text-red-600 px-2"
                                    title="Cancel Appointment"
                                    onClick={async () => {
                                      if (confirm('Cancel this appointment?')) {
                                        const updated = appointments.map(a => a.id === app.id ? { ...a, status: 'Cancelled' as const } : a);
                                        setAppointments(updated);
                                        await doctorService.updateAppointmentStatus(app.id, 'Cancelled');
                                      }
                                    }}
                                  >
                                    <LogOut className="w-4 h-4" />
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="secondary" onClick={() => handleAttendClient(app)}>
                                        Open Session
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                      <DialogHeader><DialogTitle>Treatment Session</DialogTitle></DialogHeader>
                                      <Tabs defaultValue="treatment">
                                        <TabsList className="grid w-full grid-cols-3">
                                          <TabsTrigger value="treatment">Current Session</TabsTrigger>
                                          <TabsTrigger value="history">History</TabsTrigger>
                                          <TabsTrigger value="products">Products</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="treatment" className="space-y-4">
                                          <div>
                                            <Label>Treatment Notes / Procedures Performed</Label>
                                            <Textarea className="mt-2" rows={8} value={treatmentNotes} onChange={e => setTreatmentNotes(e.target.value)} placeholder="Describe the treatment..." />
                                          </div>
                                          <Button onClick={handleSaveSession} className="w-full bg-purple-600 hover:bg-purple-700">Complete Session</Button>
                                        </TabsContent>
                                        <TabsContent value="history">
                                          <TreatmentHistoryTab patientId={app.patientId} />
                                        </TabsContent>
                                        <TabsContent value="products">
                                          <Label>Recommended Products / Used Products</Label>
                                          <Textarea rows={6} value={productRecs} onChange={e => setProductRecs(e.target.value)} placeholder="List products..." />
                                        </TabsContent>
                                      </Tabs>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  {app.status === 'Completed' ? 'Completed' : 'Cancelled'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  {filteredAppointments.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                      No appointments found.
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              {/* Pagination Fixed at Bottom */}
              <div className="p-4 border-t bg-white">
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAppointmentPage(p => Math.max(1, p - 1))}
                    disabled={appointmentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-gray-500">
                    Page {appointmentPage} of {totalAppointmentPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAppointmentPage(p => Math.min(totalAppointmentPages, p + 1))}
                    disabled={appointmentPage >= totalAppointmentPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Clients Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Clients</CardTitle></CardHeader>
              <CardContent>
                <Button className="w-full mb-4 bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewClientDialog(true)}><UserPlus className="w-4 h-4 mr-2" /> Add Client</Button>
                <ScrollArea className="h-[300px]">
                  {recentClients
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map(p => (
                      <div key={p.id} className="p-2 border-b text-sm flex justify-between items-center hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{p.firstName} {p.lastName}</p>
                          <p className="text-gray-500 text-xs">{p.phone}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{p.nationalId}</Badge>
                      </div>
                    ))}
                </ScrollArea>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-gray-500">
                    Page {currentPage} of {Math.ceil(recentClients.length / itemsPerPage) || 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(recentClients.length / itemsPerPage), p + 1))}
                    disabled={currentPage >= Math.ceil(recentClients.length / itemsPerPage)}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Add New Client / Patient</DialogTitle></DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Full Name</Label>
                    <Input value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} placeholder="e.g. Maria Gonzalez" />
                  </div>

                  <div>
                    <Label>National ID (DNI)</Label>
                    <div className="flex gap-2">
                      <Input value={newClient.nationalId} onChange={e => setNewClient({ ...newClient, nationalId: e.target.value })} placeholder="Unique ID for Login" />
                      <Button size="icon" variant="outline" title="Auto-generate" onClick={async () => {
                        const nextId = await doctorService.getNextSequentialId('AE');
                        setNewClient(prev => ({ ...prev, nationalId: nextId }));
                      }}><RefreshCw className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div>
                    <Label>Date of Birth</Label>
                    <Input type="date" value={newClient.birthDate} onChange={e => setNewClient({ ...newClient, birthDate: e.target.value })} />
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newClient.gender || ''}
                      onChange={e => setNewClient({ ...newClient, gender: e.target.value as any })}
                    >
                      <option value="">Select...</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} placeholder="+54 9 ..." />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label>Email</Label>
                    <Input type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} placeholder="client@email.com" />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label>Address</Label>
                    <Input value={newClient.address || ''} onChange={e => setNewClient({ ...newClient, address: e.target.value })} placeholder="Street, Number, City" />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label>Notes / Skin Type / Allergies</Label>
                    <Textarea className="h-20" value={newClient.condition} onChange={e => setNewClient({ ...newClient, condition: e.target.value })} placeholder="Relevant medical or aesthetic information..." />
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-4">
                    <Button onClick={handleRegisterClient} className="w-full bg-purple-600 hover:bg-purple-700 h-11 text-base">
                      <UserPlus className="w-4 h-4 mr-2" /> Save Client Profile
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AestheticDashboard;
