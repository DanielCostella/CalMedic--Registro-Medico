import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Stethoscope, Calendar, Users, Clock, FileText,
  LogOut, Bell, Activity, Phone, Video, MessageSquare, Plus, Search, User,
  Save, Download, X, Printer, Send, UserPlus, CalendarPlus,
  MoreVertical, RefreshCw
} from 'lucide-react';
import ThemeToggleComponent from '@/components/ui/theme-toggle';
import MedicalChatbot from '@/components/medicos/MedicalChatbot';
import { authService } from '@/services/authService';
import { doctorService } from '@/services/doctorService';
import { Appointment, Patient } from '@/types/medical';

// Subcomponente para mostrar el historial médico
const HistoryTab = ({ patientId }: { patientId: string }) => {
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
      <h3 className="text-lg font-semibold">Medical History</h3>
      {history.length === 0 ? (
         <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
           No medical records found for this patient.
         </div>
      ) : (
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {history.map((record) => (
              <Card key={record.id}>
                <CardHeader className="py-3 bg-gray-50">
                   <div className="flex justify-between items-center">
                     <CardTitle className="text-sm font-medium">
                       {new Date(record.visit_date).toLocaleDateString()} - {new Date(record.visit_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </CardTitle>
                     <Badge variant="outline">{record.diagnosis || 'Consultation'}</Badge>
                   </div>
                   <p className="text-xs text-gray-500">Dr. {record.doctors?.profiles?.first_names} {record.doctors?.profiles?.last_names}</p>
                </CardHeader>
                <CardContent className="py-3">
                   <div className="space-y-2 text-sm">
                      {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                      {record.prescription && <div className="bg-yellow-50 p-2 rounded mt-2 border border-yellow-100"><strong>Prescription:</strong> {record.prescription}</div>}
                      {record.vital_signs && Object.keys(record.vital_signs).length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t">
                             {Object.entries(record.vital_signs).map(([key, val]) => (
                                val ? <div key={key}><span className="capitalize text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {val as React.ReactNode}</div> : null
                             ))}
                          </div>
                      )}
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

const MedicalDashboard: React.FC<DashboardProps> = ({ currentDoctor, onLogout }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: ''
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [showNewPatientDialog, setShowNewPatientDialog] = useState(false);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    nationalId: '', 
    birthDate: '', 
    phone: '',
    email: '',
    condition: '',
    allergies: '',
    medicalHistory: ''
  });
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: '',
    time: '',
    type: '',
    duration: '30',
    patientId: ''
  });

  // Fetch Data specific to this doctor
  useEffect(() => {
    const fetchData = async () => {
        try {
          const [fetchedAppointments, fetchedPatients] = await Promise.all([
            doctorService.getAppointments(currentDoctor.id),
            doctorService.getPatients(currentDoctor.id)
          ]);
          setAppointments(fetchedAppointments);
          setRecentPatients(fetchedPatients);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
    };
    fetchData();
  }, [currentDoctor.id]);

  // Auto-generate ID logic for medical patients
  useEffect(() => {
    const generateId = async () => {
      if (showNewPatientDialog) {
        // Medical uses 'ID' prefix usually
        const nextId = await doctorService.getNextSequentialId('ID');
        setNewPatient(prev => ({ ...prev, nationalId: nextId }));
      }
    };
    generateId();
  }, [showNewPatientDialog]);

  const handleAttendPatient = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setConsultationNotes(appointment.notes || '');
    setPrescription('');
    setVitalSigns({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      oxygenSaturation: ''
    });
  };

  const handleSaveConsultation = async () => {
    if (selectedAppointment && consultationNotes.trim()) {
      try {
        const result = await doctorService.createMedicalRecord({
          patientId: selectedAppointment.patientId,
          doctorId: currentDoctor.id,
          appointmentId: selectedAppointment.id,
          diagnosis: 'Medical Consultation',
          notes: consultationNotes,
          symptoms: '',
          prescription: prescription,
          vitalSigns: vitalSigns
        });

        if (result.success) {
          const updatedAppointments = appointments.map(apt =>
            apt.id === selectedAppointment.id
              ? { ...apt, status: 'Completed' as const, notes: consultationNotes }
              : apt
          );
          setAppointments(updatedAppointments);
          alert('Consultation saved successfully to Medical Record!');
          setSelectedAppointment(null);
        } else {
          alert('Error saving medical record: ' + result.message);
        }
      } catch (error: any) {
        alert('Error: ' + error.message);
      }
    } else {
      alert('Please enter consultation notes before saving.');
    }
  };

  const handleGeneratePrescription = () => {
    if (prescription.trim()) {
      alert('Prescription generated and sent to patient');
    } else {
      alert('Please write the medical prescription');
    }
  };

  const handleGenerateReport = () => {
    alert('Medical report generated successfully');
  };

  const handleRegisterPatient = async () => {
    if (newPatient.name && newPatient.birthDate && newPatient.phone) {
      try {
        const result = await doctorService.createPatient(newPatient);
        if (result.success && result.data) {
          const tempPassword = `${newPatient.name.trim().split(' ')[0]}123!`;
          alert(`Patient registered successfully!\n\nAccess: ${newPatient.email}\nTemp Password: ${tempPassword}`);
          setRecentPatients(prev => [result.data!, ...prev]);
          if (!newAppointment.patientName) {
            setNewAppointment(prev => ({ 
              ...prev, 
              patientName: result.data!.firstName + ' ' + result.data!.lastName,
              patientId: result.data!.id 
            }));
          }
          setShowNewPatientDialog(false);
          setNewPatient({ name: '', nationalId: '', birthDate: '', phone: '', email: '', condition: '', allergies: '', medicalHistory: '' });
        } else {
          alert('Error registering patient: ' + result.message);
        }
      } catch (error: any) {
        alert('Error: ' + error.message);
      }
    } else {
      alert('Please fill in required fields');
    }
  };

  const handleScheduleAppointment = async () => {
    if (newAppointment.patientName && newAppointment.date && newAppointment.time) {
      try {
        let patientId = (newAppointment as any).patientId;
        if (!patientId) {
          const found = recentPatients.find(p => `${p.firstName} ${p.lastName}` === newAppointment.patientName);
          if (found) patientId = found.id;
          else {
             alert('Patient not found. Please register patient first.');
             return;
          }
        }

        const aptData = {
          patientId: patientId,
          doctorId: currentDoctor.id,
          patientName: newAppointment.patientName,
          date: newAppointment.date,
          time: newAppointment.time,
          duration: parseInt(newAppointment.duration) || 30,
          reason: 'Medical Consultation',
          status: 'Scheduled' as const,
          type: (newAppointment.type || 'Consultation') as "Consultation" | "Control" | "Emergency" | "Procedure",
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

  const handleUpdateStatus = async (status: 'Cancelled' | 'No Show', appointmentId?: string) => {
      const id = appointmentId || selectedAppointment?.id;
      if (!id) return;
      try {
          const success = await doctorService.updateAppointmentStatus(id, status);
          if (success) {
               setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
               if (selectedAppointment?.id === id) setSelectedAppointment(null);
          }
      } catch (e) { console.error(e); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'No Show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDentist = currentDoctor.specialty === 'Dentistry' || currentDoctor.specialty === 'Odontología';

  return (
    <div className="min-h-screen bg-blue-50/30">
      {/* Header Specific for Medical */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${currentDoctor.color} flex items-center justify-center`}>
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dr. {currentDoctor.name}</h1>
                <p className="text-sm text-gray-600">{currentDoctor.specialty} - Medical License: {currentDoctor.medical_license_number || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Total Patients: {recentPatients.length}
               </Badge>
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
         {/* Main Content */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                     <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-gray-500">Today</p><p className="text-xl font-bold">{appointments.length}</p></div>
                            <Calendar className="text-blue-500" />
                        </CardContent>
                     </Card>
                     <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-gray-500">Pending</p><p className="text-xl font-bold">{appointments.filter(a => a.status === 'Scheduled').length}</p></div>
                            <Clock className="text-orange-500" />
                        </CardContent>
                     </Card>
                     <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-gray-500">Completed</p><p className="text-xl font-bold">{appointments.filter(a => a.status === 'Completed').length}</p></div>
                            <Activity className="text-green-500" />
                        </CardContent>
                     </Card>
                </div>

                {/* Appointments List */}
                <Card className="h-[600px] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                         <CardTitle>Daily Agenda</CardTitle>
                         <div className="flex gap-2">
                             <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input placeholder="Search patient..." className="pl-8 w-[200px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                             </div>
                             <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
                                <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4" /></Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>New Medical Appointment</DialogTitle></DialogHeader>
                                    <div className="space-y-4">
                                        <Label>Select Patient</Label>
                                        <select className="flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm" 
                                            value={newAppointment.patientName}
                                            onChange={(e) => {
                                                const p = recentPatients.find(pat => `${pat.firstName} ${pat.lastName}` === e.target.value);
                                                setNewAppointment({ ...newAppointment, patientName: e.target.value, patientId: p?.id || '' });
                                            }}
                                        >
                                            <option value="">Select...</option>
                                            {recentPatients.map(p => <option key={p.id} value={`${p.firstName} ${p.lastName}`}>{p.firstName} {p.lastName}</option>)}
                                        </select>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><Label>Date</Label><Input type="date" value={newAppointment.date} onChange={e => setNewAppointment({...newAppointment, date: e.target.value})} /></div>
                                            <div><Label>Time</Label><Input type="time" value={newAppointment.time} onChange={e => setNewAppointment({...newAppointment, time: e.target.value})} /></div>
                                        </div>
                                        <Button onClick={handleScheduleAppointment} className="w-full">Schedule</Button>
                                    </div>
                                </DialogContent>
                             </Dialog>
                         </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full">
                            {/* Simplified List for brevity */}
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
                                            <Button size="sm" onClick={() => handleAttendPatient(app)}>
                                                Attendees
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader><DialogTitle>Medical Consultation</DialogTitle></DialogHeader>
                                            <Tabs defaultValue="consultation">
                                                <TabsList>
                                                    <TabsTrigger value="consultation">Consultation</TabsTrigger>
                                                    <TabsTrigger value="history">History</TabsTrigger>
                                                    <TabsTrigger value="prescription">Prescription</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="consultation" className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Vital Signs</Label>
                                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                                {isDentist ? (
                                                                    <>
                                                                     <Input placeholder="Tooth #" value={vitalSigns.bloodPressure} onChange={e => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})} />
                                                                     <Input placeholder="Procedure" value={vitalSigns.heartRate} onChange={e => setVitalSigns({...vitalSigns, heartRate: e.target.value})} />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                    <Input placeholder="Blood Pressure" value={vitalSigns.bloodPressure} onChange={e => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})} />
                                                                    <Input placeholder="Heart Rate" value={vitalSigns.heartRate} onChange={e => setVitalSigns({...vitalSigns, heartRate: e.target.value})} />
                                                                    <Input placeholder="Temp" value={vitalSigns.temperature} onChange={e => setVitalSigns({...vitalSigns, temperature: e.target.value})} />
                                                                    <Input placeholder="Weight" value={vitalSigns.weight} onChange={e => setVitalSigns({...vitalSigns, weight: e.target.value})} />
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label>Diagnosis & Notes</Label>
                                                            <Textarea className="mt-2" rows={5} value={consultationNotes} onChange={e => setConsultationNotes(e.target.value)} placeholder="Clinical notes..." />
                                                        </div>
                                                    </div>
                                                    <Button onClick={handleSaveConsultation} className="w-full">Finish Consultation</Button>
                                                </TabsContent>
                                                <TabsContent value="history">
                                                    <HistoryTab patientId={app.patientId} />
                                                </TabsContent>
                                                <TabsContent value="prescription">
                                                    <Textarea rows={8} value={prescription} onChange={e => setPrescription(e.target.value)} placeholder="Rx..." />
                                                    <div className="flex gap-2 mt-2">
                                                        <Button onClick={handleGeneratePrescription}><Printer className="w-4 h-4 mr-2"/> Print/Send</Button>
                                                    </div>
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

            {/* Sidebar */}
            <div className="space-y-6">
                 <Card>
                    <CardHeader><CardTitle>Patients</CardTitle></CardHeader>
                    <CardContent>
                        <Button className="w-full mb-4" onClick={() => setShowNewPatientDialog(true)}><UserPlus className="w-4 h-4 mr-2"/> Register Patient</Button>
                        <ScrollArea className="h-[300px]">
                            {recentPatients.map(p => (
                                <div key={p.id} className="p-2 border-b text-sm">
                                    <p className="font-medium">{p.firstName} {p.lastName}</p>
                                    <p className="text-gray-500 text-xs">ID: {p.nationalId}</p>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                 </Card>

                 {/* New Patient Dialog */}
                 <Dialog open={showNewPatientDialog} onOpenChange={setShowNewPatientDialog}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Register New Patient</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                            <Input placeholder="Full Name" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
                            <div className="flex gap-2">
                                <Input value={newPatient.nationalId} readOnly placeholder="ID Auto-gen" className="bg-gray-50"/>
                                <Button size="sm" variant="outline" onClick={async () => {
                                    const nextId = await doctorService.getNextSequentialId('ID');
                                    setNewPatient(prev => ({ ...prev, nationalId: nextId }));
                                }}><RefreshCw className="w-4 h-4"/></Button>
                            </div>
                            <Input type="date" value={newPatient.birthDate} onChange={e => setNewPatient({...newPatient, birthDate: e.target.value})} />
                            <Input placeholder="Phone" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
                            <Input type="email" placeholder="Email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
                            
                            <Button onClick={handleRegisterPatient} className="w-full">Register Patient</Button>
                        </div>
                    </DialogContent>
                 </Dialog>
            </div>
         </div>
      </div>

      {isChatbotOpen && (
        <MedicalChatbot
          onClose={() => setIsChatbotOpen(false)}
          onToggleMinimize={() => setIsChatbotMinimized(!isChatbotMinimized)}
          isMinimized={isChatbotMinimized}
        />
      )}
      <Button className="fixed bottom-4 right-4 rounded-full w-12 h-12" onClick={() => setIsChatbotOpen(true)}><MessageSquare /></Button>
    </div>
  );
};

export default MedicalDashboard;
