import React, { useState, useEffect } from 'react';
import { User, Calendar, FileText, CreditCard, Bell, MessageCircle, Video, Upload, Heart, Pill, Activity, Download, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: 'Male' | 'Female';
    insurance: string;
    policyNumber: string;
}

interface TestResult {
    id: string;
    date: string;
    testType: string;
    laboratory: string;
    status: 'Pending' | 'Completed' | 'Critical';
    results: TestParameter[];
    doctor: string;
    observations: string;
    fileUrl?: string;
}

interface TestParameter {
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
}

interface Prescription {
    id: string;
    date: string;
    doctor: string;
    specialty: string;
    medications: PrescriptionMedication[];
    status: 'Active' | 'Dispensed' | 'Expired';
    validUntil: string;
    observations: string;
}

interface PrescriptionMedication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    administrationRoute: string;
    instructions: string;
    dispensed: boolean;
}

interface MedicalAppointment {
    id: string;
    date: string;
    time: string;
    doctor: string;
    specialty: string;
    reason: string;
    status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
    modality: 'In-Person' | 'Virtual';
    office?: string;
    videoLink?: string;
    cost: number;
}

interface Invoice {
    id: string;
    date: string;
    concept: string;
    amount: number;
    status: 'Pending' | 'Paid' | 'Overdue';
    dueDate: string;
    paymentMethod?: string;
    transactionNumber?: string;
}

interface AvailableDoctor {
    id: string;
    name: string;
    specialty: string;
    photo: string;
    schedule: AvailableSchedule[];
    cost: number;
    rating: number;
    experience: string;
}

interface AvailableSchedule {
    date: string;
    hours: string[];
}

import PatientLogin from '@/components/auth/PatientLogin';

// ... (Existing Interfaces kept exactly as they are until line 110)

const PatientPortal: React.FC = () => {
    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [patient, setPatient] = useState<any>(null); // Using 'any' briefly to map Supabase data later

    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false); // Changed initial to false, login handles loading

    // Data States
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [doctors, setDoctors] = useState<AvailableDoctor[]>([]);

    const [showNewAppointment, setShowNewAppointment] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<AvailableDoctor | null>(null);

    const [newAppointment, setNewAppointment] = useState({
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        modality: 'In-Person' as 'In-Person' | 'Virtual'
    });

    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        cardholderName: '',
        expirationDate: '',
        cvv: '',
        cardType: 'Visa' as 'Visa' | 'Mastercard' | 'American Express'
    });

    // Handle Login Success
    const handleLoginSuccess = async (patientData: any) => {
        setPatient(patientData);
        setIsLoggedIn(true);
        // Here we would fetch real data based on patientData.id
        // fetchPatientData(patientData.id);
    };

    // If not logged in, show Login Screen
    if (!isLoggedIn) {
        return <PatientLogin onLoginSuccess={handleLoginSuccess} />;
    }

    // ... (Rest of the component logic)

    useEffect(() => {
        // Simulate loading patient data
        setTimeout(() => {
            const patientData: Patient = {
                id: '1',
                firstName: 'Maria',
                lastName: 'Gonzalez',
                nationalId: '1234567890',
                email: 'maria.gonzalez@email.com',
                phone: '+1234567890',
                birthDate: '1985-03-15',
                gender: 'Female',
                insurance: 'Universal Insurance',
                policyNumber: 'UI-123456789'
            };

            const testResultsData: TestResult[] = [
                {
                    id: '1',
                    date: '2024-01-15',
                    testType: 'Complete Blood Count',
                    laboratory: 'Central Lab',
                    status: 'Completed',
                    doctor: 'Dr. John Perez',
                    observations: 'Values within normal parameters',
                    fileUrl: '/results/cbc_123.pdf',
                    results: [
                        { name: 'Hemoglobin', value: '13.5', unit: 'g/dL', normalRange: '12.0-15.5', status: 'Normal' },
                        { name: 'Hematocrit', value: '40.2', unit: '%', normalRange: '36.0-46.0', status: 'Normal' },
                        { name: 'White Blood Cells', value: '7.2', unit: '10³/μL', normalRange: '4.5-11.0', status: 'Normal' },
                        { name: 'Platelets', value: '280', unit: '10³/μL', normalRange: '150-450', status: 'Normal' }
                    ]
                },
                {
                    id: '2',
                    date: '2024-01-10',
                    testType: 'Lipid Profile',
                    laboratory: 'Central Lab',
                    status: 'Critical',
                    doctor: 'Dr. John Perez',
                    observations: 'Elevated total cholesterol. Requires follow-up.',
                    fileUrl: '/results/lipids_124.pdf',
                    results: [
                        { name: 'Total Cholesterol', value: '245', unit: 'mg/dL', normalRange: '<200', status: 'High' },
                        { name: 'HDL', value: '35', unit: 'mg/dL', normalRange: '>40', status: 'Low' },
                        { name: 'LDL', value: '165', unit: 'mg/dL', normalRange: '<100', status: 'High' },
                        { name: 'Triglycerides', value: '220', unit: 'mg/dL', normalRange: '<150', status: 'High' }
                    ]
                },
                {
                    id: '3',
                    date: '2024-01-05',
                    testType: 'Fasting Glucose',
                    laboratory: 'Express Lab',
                    status: 'Completed',
                    doctor: 'Dr. Ann Martinez',
                    observations: 'Normal glucose',
                    results: [
                        { name: 'Glucose', value: '92', unit: 'mg/dL', normalRange: '70-100', status: 'Normal' }
                    ]
                }
            ];

            const prescriptionsData: Prescription[] = [
                {
                    id: '1',
                    date: '2024-01-16',
                    doctor: 'Dr. John Perez',
                    specialty: 'Internal Medicine',
                    status: 'Active',
                    validUntil: '2024-02-16',
                    observations: 'Take with food. Follow-up in 15 days.',
                    medications: [
                        {
                            name: 'Atorvastatin 20mg',
                            dosage: '20mg',
                            frequency: 'Once daily',
                            duration: '30 days',
                            administrationRoute: 'Oral',
                            instructions: 'Take at night with dinner',
                            dispensed: false
                        },
                        {
                            name: 'Omega 3 1000mg',
                            dosage: '1000mg',
                            frequency: 'Twice daily',
                            duration: '30 days',
                            administrationRoute: 'Oral',
                            instructions: 'Take with main meals',
                            dispensed: true
                        }
                    ]
                },
                {
                    id: '2',
                    date: '2024-01-10',
                    doctor: 'Dr. Ann Martinez',
                    specialty: 'Endocrinology',
                    status: 'Dispensed',
                    validUntil: '2024-01-25',
                    observations: 'Treatment completed successfully',
                    medications: [
                        {
                            name: 'Metformin 850mg',
                            dosage: '850mg',
                            frequency: 'Twice daily',
                            duration: '15 days',
                            administrationRoute: 'Oral',
                            instructions: 'Take with breakfast and dinner',
                            dispensed: true
                        }
                    ]
                }
            ];

            const appointmentsData: MedicalAppointment[] = [
                {
                    id: '1',
                    date: '2024-01-20',
                    time: '10:00',
                    doctor: 'Dr. John Perez',
                    specialty: 'Internal Medicine',
                    reason: 'Cholesterol follow-up',
                    status: 'Scheduled',
                    modality: 'In-Person',
                    office: 'Office 2',
                    cost: 75
                },
                {
                    id: '2',
                    date: '2024-01-18',
                    time: '15:30',
                    doctor: 'Dr. Ann Martinez',
                    specialty: 'Endocrinology',
                    reason: 'Follow-up video consultation',
                    status: 'Confirmed',
                    modality: 'Virtual',
                    videoLink: 'https://meet.clinic.com/room/abc123',
                    cost: 60
                },
                {
                    id: '3',
                    date: '2024-01-15',
                    time: '09:00',
                    doctor: 'Dr. Charles Rodriguez',
                    specialty: 'Cardiology',
                    reason: 'Initial consultation',
                    status: 'Completed',
                    modality: 'In-Person',
                    office: 'Office 1',
                    cost: 85
                }
            ];

            const invoicesData: Invoice[] = [
                {
                    id: '1',
                    date: '2024-01-16',
                    concept: 'Consultation - Dr. John Perez',
                    amount: 75,
                    status: 'Pending',
                    dueDate: '2024-01-30'
                },
                {
                    id: '2',
                    date: '2024-01-15',
                    concept: 'Laboratory Tests',
                    amount: 120,
                    status: 'Pending',
                    dueDate: '2024-01-29'
                },
                {
                    id: '3',
                    date: '2024-01-10',
                    concept: 'Video Consultation - Dr. Ann Martinez',
                    amount: 60,
                    status: 'Paid',
                    dueDate: '2024-01-24',
                    paymentMethod: 'Visa Card ****1234',
                    transactionNumber: 'TXN-789456123'
                }
            ];

            const doctorsData: AvailableDoctor[] = [
                {
                    id: '1',
                    name: 'Dr. John Perez',
                    specialty: 'Internal Medicine',
                    photo: '/avatars/dr-perez.jpg',
                    cost: 75,
                    rating: 4.8,
                    experience: '15 years of experience',
                    schedule: [
                        {
                            date: '2024-01-22',
                            hours: ['09:00', '10:00', '11:00', '14:00', '15:00']
                        },
                        {
                            date: '2024-01-23',
                            hours: ['08:00', '09:00', '16:00', '17:00']
                        }
                    ]
                },
                {
                    id: '2',
                    name: 'Dr. Ann Martinez',
                    specialty: 'Endocrinology',
                    photo: '/avatars/dr-martinez.jpg',
                    cost: 85,
                    rating: 4.9,
                    experience: '12 years of experience',
                    schedule: [
                        {
                            date: '2024-01-22',
                            hours: ['10:00', '11:00', '15:00', '16:00']
                        },
                        {
                            date: '2024-01-24',
                            hours: ['09:00', '14:00', '15:00']
                        }
                    ]
                },
                {
                    id: '3',
                    name: 'Dr. Charles Rodriguez',
                    specialty: 'Cardiology',
                    photo: '/avatars/dr-rodriguez.jpg',
                    cost: 95,
                    rating: 4.7,
                    experience: '20 years of experience',
                    schedule: [
                        {
                            date: '2024-01-23',
                            hours: ['08:00', '09:00', '10:00', '14:00']
                        },
                        {
                            date: '2024-01-25',
                            hours: ['11:00', '15:00', '16:00', '17:00']
                        }
                    ]
                }
            ];

            setPatient(patientData);
            setTestResults(testResultsData);
            setPrescriptions(prescriptionsData);
            setAppointments(appointmentsData);
            setInvoices(invoicesData);
            setDoctors(doctorsData);
            setLoading(false);
        }, 1000);
    }, []);

    const requestAppointment = () => {
        if (!newAppointment.doctorId || !newAppointment.date || !newAppointment.time || !newAppointment.reason) {
            alert('Please complete all fields');
            return;
        }

        const doctor = doctors.find(d => d.id === newAppointment.doctorId);
        if (!doctor) return;

        const appointment: MedicalAppointment = {
            id: Date.now().toString(),
            date: newAppointment.date,
            time: newAppointment.time,
            doctor: doctor.name,
            specialty: doctor.specialty,
            reason: newAppointment.reason,
            status: 'Scheduled',
            modality: newAppointment.modality,
            office: newAppointment.modality === 'In-Person' ? 'To be assigned' : undefined,
            videoLink: newAppointment.modality === 'Virtual' ? 'Will be sent by email' : undefined,
            cost: doctor.cost
        };

        setAppointments(prev => [appointment, ...prev]);
        setShowNewAppointment(false);
        setNewAppointment({
            doctorId: '',
            date: '',
            time: '',
            reason: '',
            modality: 'In-Person'
        });

        alert('Appointment requested successfully. You will receive confirmation by email.');
    };

    const processPayment = () => {
        if (!selectedInvoice || !paymentData.cardNumber || !paymentData.cardholderName) {
            alert('Please complete all payment fields');
            return;
        }

        // Simulate payment processing
        setTimeout(() => {
            setInvoices(prev => prev.map(inv =>
                inv.id === selectedInvoice.id ? {
                    ...inv,
                    status: 'Paid' as const,
                    paymentMethod: `${paymentData.cardType} Card ****${paymentData.cardNumber.slice(-4)}`,
                    transactionNumber: `TXN-${Date.now()}`
                } : inv
            ));

            setShowPayment(false);
            setSelectedInvoice(null);
            setPaymentData({
                cardNumber: '',
                cardholderName: '',
                expirationDate: '',
                cvv: '',
                cardType: 'Visa'
            });

            alert('Payment processed successfully. You will receive the receipt by email.');
        }, 2000);
    };

    const cancelAppointment = (appointmentId: string) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            setAppointments(prev => prev.map(app =>
                app.id === appointmentId ? { ...app, status: 'Cancelled' as const } : app
            ));
            alert('Appointment cancelled successfully.');
        }
    };

    const downloadResult = (result: TestResult) => {
        // Simulate PDF download
        const content = `
MEDICAL TEST RESULT

Patient: ${patient?.firstName} ${patient?.lastName}
ID: ${patient?.nationalId}
Date: ${result.date}
Test: ${result.testType}
Laboratory: ${result.laboratory}
Doctor: ${result.doctor}

RESULTS:
${result.results.map(r =>
            `${r.name}: ${r.value} ${r.unit} (Normal: ${r.normalRange}) - ${r.status}`
        ).join('\n')}

OBSERVATIONS:
${result.observations}

---
Document automatically generated by the Patient Portal
    `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `result_${result.testType}_${result.date}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Normal': case 'Completed': case 'Paid': case 'Active': case 'Confirmed':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'High': case 'Low': case 'Pending': case 'Scheduled':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Critical': case 'Overdue': case 'Cancelled':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'Dispensed': case 'Completed':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <PatientDashboard />;
            case 'tests':
                return <TestResults />;
            case 'prescriptions':
                return <MedicalPrescriptions />;
            case 'appointments':
                return <AppointmentManagement />;
            case 'payments':
                return <PaymentManagement />;
            case 'profile':
                return <PatientProfile />;
            default:
                return <PatientDashboard />;
        }
    };

    const PatientDashboard = () => (
        <div className="space-y-6">
            {/* Welcome */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Welcome, {patient?.firstName}!</h2>
                            <p className="text-blue-100">Manage your health easily and securely</p>
                        </div>
                        <Heart className="h-12 w-12 text-blue-200" />
                    </div>
                </CardContent>
            </Card>

            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Next Appointment</p>
                                <p className="text-lg font-bold">Jan 20</p>
                                <p className="text-green-200 text-sm">Dr. John Perez</p>
                            </div>
                            <Calendar className="w-8 h-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Active Prescriptions</p>
                                <p className="text-2xl font-bold">{prescriptions.filter(r => r.status === 'Active').length}</p>
                                <p className="text-orange-200 text-sm">Medications</p>
                            </div>
                            <Pill className="w-8 h-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100">Tests</p>
                                <p className="text-2xl font-bold">{testResults.length}</p>
                                <p className="text-purple-200 text-sm">Results</p>
                            </div>
                            <FileText className="w-8 h-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100">Invoices</p>
                                <p className="text-2xl font-bold">${invoices.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0)}</p>
                                <p className="text-red-200 text-sm">Pending</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-red-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Important alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            Important Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {testResults.filter(r => r.status === 'Critical').map(result => (
                                <div key={result.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-red-900">{result.testType}</p>
                                            <p className="text-sm text-red-700">{result.observations}</p>
                                            <p className="text-xs text-red-600">Date: {result.date}</p>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => setActiveTab('tests')}>
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {invoices.filter(f => f.status === 'Pending').slice(0, 2).map(invoice => (
                                <div key={invoice.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-yellow-900">Pending Invoice</p>
                                            <p className="text-sm text-yellow-700">{invoice.concept} - ${invoice.amount}</p>
                                            <p className="text-xs text-yellow-600">Due: {invoice.dueDate}</p>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => setActiveTab('payments')}>
                                            Pay
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Upcoming Activities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {appointments.filter(c => c.status === 'Scheduled' || c.status === 'Confirmed').slice(0, 3).map(appointment => (
                                <div key={appointment.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-blue-900">{appointment.doctor}</p>
                                            <p className="text-sm text-blue-700">{appointment.specialty}</p>
                                            <p className="text-xs text-blue-600">{appointment.date} at {appointment.time}</p>
                                            <Badge className={`mt-1 ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                            {appointment.modality === 'Virtual' && (
                                                <Button size="sm" variant="outline">
                                                    <Video className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" onClick={() => setActiveTab('appointments')}>
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick access */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-20 flex-col" onClick={() => setShowNewAppointment(true)}>
                            <Calendar className="w-6 h-6 mb-2" />
                            Request Appointment
                        </Button>
                        <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('tests')}>
                            <FileText className="w-6 h-6 mb-2" />
                            View Tests
                        </Button>
                        <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('prescriptions')}>
                            <Pill className="w-6 h-6 mb-2" />
                            My Prescriptions
                        </Button>
                        <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('payments')}>
                            <CreditCard className="w-6 h-6 mb-2" />
                            Pay Invoices
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const TestResults = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Test Results</h2>
                <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                </Button>
            </div>

            <div className="space-y-4">
                {testResults.map(result => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">{result.testType}</h3>
                                    <p className="text-gray-600">{result.laboratory} - {result.doctor}</p>
                                    <p className="text-sm text-gray-500">Date: {result.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(result.status)}>
                                        {result.status}
                                    </Badge>
                                    <Button size="sm" variant="outline" onClick={() => downloadResult(result)}>
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                {result.results.map((param, index) => (
                                    <div key={index} className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-medium">{param.name}</span>
                                            <Badge variant="outline" className={getStatusColor(param.status)}>
                                                {param.status}
                                            </Badge>
                                        </div>
                                        <div className="text-lg font-bold">{param.value} {param.unit}</div>
                                        <div className="text-xs text-gray-500">Normal: {param.normalRange}</div>
                                    </div>
                                ))}
                            </div>

                            {result.observations && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm"><strong>Observations:</strong> {result.observations}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const MedicalPrescriptions = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Medical Prescriptions</h2>

            <div className="space-y-4">
                {prescriptions.map(prescription => (
                    <Card key={prescription.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">{prescription.doctor}</h3>
                                    <p className="text-gray-600">{prescription.specialty}</p>
                                    <p className="text-sm text-gray-500">Date: {prescription.date} | Valid until: {prescription.validUntil}</p>
                                </div>
                                <Badge className={getStatusColor(prescription.status)}>
                                    {prescription.status}
                                </Badge>
                            </div>

                            <div className="space-y-3 mb-4">
                                {prescription.medications.map((medication, index) => (
                                    <div key={index} className="p-3 border rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium">{medication.name}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mt-1">
                                                    <div><strong>Dosage:</strong> {medication.dosage}</div>
                                                    <div><strong>Frequency:</strong> {medication.frequency}</div>
                                                    <div><strong>Duration:</strong> {medication.duration}</div>
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <strong>Route:</strong> {medication.administrationRoute}
                                                </div>
                                                <div className="text-sm text-gray-700 mt-1 bg-blue-50 p-2 rounded">
                                                    <strong>Instructions:</strong> {medication.instructions}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                {medication.dispensed ? (
                                                    <Badge className="bg-green-100 text-green-800">Dispensed</Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {prescription.observations && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm"><strong>Observations:</strong> {prescription.observations}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const AppointmentManagement = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Appointments</h2>
                <Button onClick={() => setShowNewAppointment(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Appointment
                </Button>
            </div>

            <div className="space-y-4">
                {appointments.map(appointment => (
                    <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold">{appointment.doctor}</h3>
                                        <Badge className={getStatusColor(appointment.status)}>
                                            {appointment.status}
                                        </Badge>
                                        <Badge variant="outline">
                                            {appointment.modality}
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600">{appointment.specialty}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{appointment.date} at {appointment.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            <span>Reason: {appointment.reason}</span>
                                        </div>
                                        {appointment.office && (
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{appointment.office}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            <span>Cost: ${appointment.cost}</span>
                                        </div>
                                    </div>
                                    {appointment.videoLink && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                                            <strong>Video link:</strong> {appointment.videoLink}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                    {appointment.modality === 'Virtual' && appointment.status === 'Confirmed' && (
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                            <Video className="w-4 h-4 mr-2" />
                                            Join
                                        </Button>
                                    )}
                                    {(appointment.status === 'Scheduled' || appointment.status === 'Confirmed') && (
                                        <Button size="sm" variant="outline" onClick={() => cancelAppointment(appointment.id)}>
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New appointment dialog */}
            <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Request New Appointment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Select Doctor</Label>
                            <Select value={newAppointment.doctorId} onValueChange={(value) => {
                                setNewAppointment({ ...newAppointment, doctorId: value });
                                setSelectedDoctor(doctors.find(d => d.id === value) || null);
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map(doctor => (
                                        <SelectItem key={doctor.id} value={doctor.id}>
                                            {doctor.name} - {doctor.specialty} (${doctor.cost})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedDoctor && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium">{selectedDoctor.name}</p>
                                        <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                                        <p className="text-sm text-gray-600">{selectedDoctor.experience}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Activity className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm">{selectedDoctor.rating} / 5.0</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-600">${selectedDoctor.cost}</p>
                                        <p className="text-sm text-gray-600">per consultation</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={newAppointment.date}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <Label>Time</Label>
                                <Select value={newAppointment.time} onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedDoctor?.schedule
                                            .find(s => s.date === newAppointment.date)
                                            ?.hours.map(hour => (
                                                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                            )) || <SelectItem value="">No available hours</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label>Modality</Label>
                            <Select value={newAppointment.modality} onValueChange={(value: 'In-Person' | 'Virtual') => setNewAppointment({ ...newAppointment, modality: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="In-Person">In-Person</SelectItem>
                                    <SelectItem value="Virtual">Virtual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Reason for Consultation</Label>
                            <Textarea
                                value={newAppointment.reason}
                                onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                                placeholder="Describe the reason for your appointment"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowNewAppointment(false)}>
                                Cancel
                            </Button>
                            <Button onClick={requestAppointment}>
                                Request Appointment
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );

    const PaymentManagement = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Invoices and Payments</h2>

            <div className="space-y-4">
                {invoices.map(invoice => (
                    <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold">{invoice.concept}</h3>
                                        <Badge className={getStatusColor(invoice.status)}>
                                            {invoice.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                        <div>
                                            <strong>Date:</strong> {invoice.date}
                                        </div>
                                        <div>
                                            <strong>Due date:</strong> {invoice.dueDate}
                                        </div>
                                        <div>
                                            <strong>Amount:</strong> <span className="text-lg font-bold text-blue-600">${invoice.amount}</span>
                                        </div>
                                    </div>
                                    {invoice.paymentMethod && (
                                        <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                                            <div><strong>Payment method:</strong> {invoice.paymentMethod}</div>
                                            <div><strong>Transaction:</strong> {invoice.transactionNumber}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4">
                                    {invoice.status === 'Pending' && (
                                        <Button onClick={() => {
                                            setSelectedInvoice(invoice);
                                            setShowPayment(true);
                                        }}>
                                            Pay Now
                                        </Button>
                                    )}
                                    {invoice.status === 'Paid' && (
                                        <Button variant="outline">
                                            <Download className="w-4 h-4 mr-2" />
                                            Receipt
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Payment dialog */}
            <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Process Payment</DialogTitle>
                    </DialogHeader>
                    {selectedInvoice && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="font-medium">{selectedInvoice.concept}</p>
                                <p className="text-2xl font-bold text-blue-600">${selectedInvoice.amount}</p>
                            </div>

                            <div>
                                <Label>Card Type</Label>
                                <Select value={paymentData.cardType} onValueChange={(value: 'Visa' | 'Mastercard' | 'American Express') => setPaymentData({ ...paymentData, cardType: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Visa">Visa</SelectItem>
                                        <SelectItem value="Mastercard">Mastercard</SelectItem>
                                        <SelectItem value="American Express">American Express</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Card Number</Label>
                                <Input
                                    value={paymentData.cardNumber}
                                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={16}
                                />
                            </div>

                            <div>
                                <Label>Cardholder Name</Label>
                                <Input
                                    value={paymentData.cardholderName}
                                    onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                                    placeholder="Name as it appears on card"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Expiration Date</Label>
                                    <Input
                                        value={paymentData.expirationDate}
                                        onChange={(e) => setPaymentData({ ...paymentData, expirationDate: e.target.value })}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <Label>CVV</Label>
                                    <Input
                                        value={paymentData.cvv}
                                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                                        placeholder="123"
                                        maxLength={4}
                                        type="password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setShowPayment(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={processPayment}>
                                    Process Payment
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );

    const PatientProfile = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Profile</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>First Name</Label>
                            <Input value={patient?.firstName} readOnly />
                        </div>
                        <div>
                            <Label>Last Name</Label>
                            <Input value={patient?.lastName} readOnly />
                        </div>
                        <div>
                            <Label>National ID</Label>
                            <Input value={patient?.nationalId} readOnly />
                        </div>
                        <div>
                            <Label>Birth Date</Label>
                            <Input value={patient?.birthDate} readOnly />
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <Input value={patient?.gender} readOnly />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input value={patient?.email} readOnly />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input value={patient?.phone} readOnly />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Insurance Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Insurance Provider</Label>
                            <Input value={patient?.insurance} readOnly />
                        </div>
                        <div>
                            <Label>Policy Number</Label>
                            <Input value={patient?.policyNumber} readOnly />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button>Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Heart className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Patient Portal</h1>
                                <p className="text-sm text-gray-500">Comprehensive Medical System</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                                <Bell className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <MessageCircle className="w-5 h-5" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                    {patient?.firstName.charAt(0)}
                                </div>
                                <span className="text-sm font-medium">{patient?.firstName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="dashboard" className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Dashboard
                            </TabsTrigger>
                            <TabsTrigger value="appointments" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Appointments
                            </TabsTrigger>
                            <TabsTrigger value="tests" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Tests
                            </TabsTrigger>
                            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                                <Pill className="w-4 h-4" />
                                Prescriptions
                            </TabsTrigger>
                            <TabsTrigger value="payments" className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payments
                            </TabsTrigger>
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default PatientPortal;
