import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Search, Filter, Bell, CheckCircle, XCircle, AlertTriangle, UserPlus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import MedicalHistory from './MedicalHistory';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    phone: string;
    email: string;
    dateOfBirth: string;
}

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    licenseNumber: string;
}

interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    time: string;
    duration: number;
    reason: string;
    type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Procedure';
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
    reminder: boolean;
    notes?: string;
    patientName?: string; // Denormalized for display
}

interface AppointmentsManagementProps {
    doctorId?: string;
    doctorName?: string;
}

const AppointmentsManagement: React.FC<AppointmentsManagementProps> = ({ doctorId, doctorName }) => {
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showNewAppointment, setShowNewAppointment] = useState(false);
    const [showMedicalHistory, setShowMedicalHistory] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const [searchPatient, setSearchPatient] = useState('');
    const [showPatientList, setShowPatientList] = useState(false);
    
    // Placeholder for doctor prop
    const loggedInDoctor = { 
        id: doctorId || 'current', 
        firstName: doctorName || 'Doctor', 
        lastName: '', 
        specialty: 'General', 
        licenseNumber: '' 
    };

    const [newAppointment, setNewAppointment] = useState({
        patientId: '',
        patientName: '',
        doctorId: doctorId || '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 45, // Default duration set to 45 mins
        reason: '',
        type: 'Consultation' as const,
        reminder: true
    });

    // Generate 45 min slots from 09:00 to 18:00
    const generateTimeSlots = () => {
        const slots = [];
        let startTime = 9 * 60; // 09:00 in minutes
        const endTime = 18 * 60; // 18:00 in minutes

        while (startTime < endTime) {
            const hours = Math.floor(startTime / 60);
            const minutes = startTime % 60;
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            slots.push(timeString);
            startTime += 45; // Increment by 45 minutes
        }
        return slots;
    };

    const allSlots = generateTimeSlots();

    // Filter available slots based on existing appointments for the selected date
    const getAvailableSlots = () => {
        const appointmentsOnDate = appointments.filter(a => a.date === newAppointment.date && a.status !== 'Cancelled');
        const takenTimes = appointmentsOnDate.map(a => a.time);
        
        return allSlots.map(slot => ({
            time: slot,
            available: !takenTimes.includes(slot)
        }));
    };

    const availableSlots = getAvailableSlots();

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Patients
            const { data: patientsData, error: patientsError } = await supabase
                .from('patients')
                .select('*')
                .eq('status', 'Active');
            
            if (patientsError) throw patientsError;
            
            if (patientsData) {
               setPatients(patientsData.map((p: any) => ({
                   id: p.id,
                   firstName: p.first_name,
                   lastName: p.last_name,
                   idNumber: p.national_id,
                   phone: p.phone,
                   email: p.email,
                   dateOfBirth: p.birth_date
               })));
            }

            // Fetch Appointments
            let query = supabase
                .from('appointments')
                .select('*')
                .order('date', { ascending: true })
                .order('time', { ascending: true });

            if (doctorId) {
                query = query.eq('doctor_id', doctorId);
            }

            const { data: appointmentsData, error: appointmentsError } = await query;
                
            if (appointmentsError) throw appointmentsError;

            if (appointmentsData) {
                setAppointments(appointmentsData.map((a: any) => ({
                    id: a.id,
                    patientId: a.patient_id,
                    doctorId: a.doctor_id,
                    date: a.date,
                    time: a.time,
                    duration: a.duration,
                    reason: a.reason,
                    type: a.type,
                    status: a.status,
                    reminder: a.reminder,
                    notes: a.notes,
                    patientName: a.patient_name
                })));
            }

        } catch (error: any) {
             console.error('Error fetching data:', error);
             toast({
                 title: "Error loading data",
                 description: error.message,
                 variant: "destructive"
             });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [doctorId]);

    // Filter patients for new appointment search
    const filteredPatients = patients.filter(patient => {
        if (!searchPatient) return false;
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return fullName.includes(searchPatient.toLowerCase()) || 
               patient.idNumber.includes(searchPatient);
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Scheduled': return <Clock className="w-4 h-4" />;
            case 'In Progress': return <AlertTriangle className="w-4 h-4" />;
            case 'Completed': return <CheckCircle className="w-4 h-4" />;
            case 'Cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const handleCreateAppointment = async () => {
        console.log("🚀 Iniciando creación de cita...", newAppointment);
        try {
            if (!newAppointment.patientId || !newAppointment.date || !newAppointment.time) {
                toast({
                    title: "Missing information",
                    description: "Please select a patient, date and time.",
                    variant: "destructive"
                });
                return;
            }

            const dbAppointment = {
                patient_id: newAppointment.patientId,
                doctor_id: doctorId, 
                patient_name: newAppointment.patientName,
                date: newAppointment.date,
                time: newAppointment.time,
                duration: newAppointment.duration,
                reason: newAppointment.reason,
                type: newAppointment.type,
                reminder: newAppointment.reminder,
                status: 'Scheduled',
                priority: 'Medium'
            };
            
            console.log("📤 Enviando payload a Supabase:", dbAppointment);

            const { data, error } = await supabase
                .from('appointments')
                .insert([dbAppointment])
                .select();

            if (error) {
                console.error("❌ Error Supabase al guardar cita:", error);
                throw error;
            }

            console.log("✅ Cita guardada con éxito:", data);

            toast({
                title: "Success",
                description: "Appointment scheduled successfully",
            });
            
            setShowNewAppointment(false);
            setNewAppointment({
                patientId: '',
                patientName: '',
                doctorId: doctorId || '',
                date: new Date().toISOString().split('T')[0],
                time: '09:00',
                duration: 30,
                reason: '',
                type: 'Consultation',
                reminder: true
            });
            setSearchPatient('');
            fetchData(); // Reload appointments

        } catch (error: any) {
            console.error(error);
             
             // Friendly error message for duplicate key
             const errorMessage = error.message?.includes('appointment_doctor_date_time_unique') 
                ? "This time slot is already booked for another patient." 
                : error.message;

             toast({
                title: "Error creating appointment",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return <div className="p-6 flex justify-center items-center">Loading appointments...</div>;
    }

    if (showMedicalHistory && selectedPatient) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Medical History - {selectedPatient.firstName} {selectedPatient.lastName}</h1>
                        <p className="text-gray-600">ID: {selectedPatient.idNumber}</p>
                    </div>
                    <Button variant="outline" onClick={() => setShowMedicalHistory(false)}>← Back to Schedule</Button>
                </div>
                <MedicalHistory patient={selectedPatient} doctor={loggedInDoctor} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Appointment Schedule</h1>
                    <p className="text-gray-600">Manage medical appointments and schedules</p>
                </div>

                <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Appointment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Schedule New Appointment</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Patient Search</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Search by name or ID..."
                                        value={searchPatient}
                                        onChange={(e) => setSearchPatient(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Date</Label>
                                    <Input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Time</Label>
                                    <Select value={newAppointment.time} onValueChange={(val) => setNewAppointment({ ...newAppointment, time: val })}>
                                        <SelectTrigger><SelectValue placeholder="Select Slot" /></SelectTrigger>
                                        <SelectContent>
                                            {availableSlots.map(slot => (
                                                <SelectItem 
                                                    key={slot.time} 
                                                    value={slot.time}
                                                    disabled={!slot.available} // Disable taken slots
                                                    className={!slot.available ? "text-gray-400 line-through" : ""}
                                                >
                                                    {slot.time} {slot.available ? '' : '(Taken)'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleCreateAppointment} className="w-full">Schedule Appointment</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><CardTitle>Calendar</CardTitle></CardHeader>
                    <CardContent>
                        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader><CardTitle>Upcoming Appointments</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {appointments.length === 0 ? (
                                    <p className="text-center py-8 text-gray-500">No appointments found</p>
                                ) : (
                                    appointments.map(app => (
                                        <div key={app.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <Badge className={getStatusColor(app.status)}>{getStatusIcon(app.status)} {app.status}</Badge>
                                                    <h4 className="font-bold mt-2">Patient ID: {app.patientId}</h4>
                                                    <p className="text-sm text-gray-600">{app.reason}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold">{app.date}</p>
                                                    <p className="text-sm text-gray-500">{app.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsManagement;
