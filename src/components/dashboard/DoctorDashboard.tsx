import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Heart,
  Activity,
  DollarSign,
  Stethoscope,
  UserPlus,
  CalendarPlus,
  PlusCircle,
  BarChart3,
  Eye,
  Settings,
  Bell,
  MessageSquare,
  Link,
  Search,
  Send,
  PieChart,
  RefreshCw,
  Filter,
  User as UserIcon,
  AlertTriangle, CheckSquare, Zap, Database
} from 'lucide-react';
import { User } from '../../types/user';
import { mockCitas, mockPacientes, mockMedicos } from '@/data/mockData';
import { Appointment, Patient, Doctor } from '@/types/medical';
import PatientsManagement from '../medicos/PatientsManagement';
import AppointmentsManagement from '../medicos/AppointmentsManagement';
import CreatePrescription from '../medicos/CreatePrescription';
import MedicalReports from '../medicos/MedicalReports';
import PushNotifications from '../medicos/PushNotifications';
import AdvancedSearch from '../medicos/AdvancedSearch';
import AdvancedReports from '../medicos/AdvancedReports';
import AutomaticReports from '../medicos/AutomaticReports';
import InteractiveCharts from '../medicos/InteractiveCharts';
import MedicalReportsList from '../medicos/MedicalReportsList';
import MedicalChatbot from '../medicos/MedicalChatbot';
import LabIntegration from '../medicos/LabIntegration';
import ExternalIntegrations from '../medicos/ExternalIntegrations';
import EnhancedNotifications from '../medicos/EnhancedNotifications';
import AdvancedOptimizations from '../medicos/AdvancedOptimizations';
import BackupSystem from '../medicos/BackupSystem';

import { supabase } from '@/lib/supabase';

interface DoctorDashboardProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export default function DoctorDashboard({ user, activeSection, onSectionChange, onLogout }: DoctorDashboardProps) {
  const { metrics, isUpdating, updateMetrics } = useRealTimeMetrics(30000); // 30 seconds

  // States for doctor's appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]); // Initialize empty
  const [doctors] = useState<Doctor[]>(mockMedicos); // Keep doctors mock for now or fetch if needed
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
          // 1. Fetch Patients (needed for names)
          const { data: patientsData } = await supabase
              .from('patients')
              .select('*');
          
          if (patientsData) {
              const mappedPatients: Patient[] = patientsData.map((p: any) => ({
                  id: p.id,
                  firstName: p.first_name,
                  lastName: p.last_name,
                  nationalId: p.national_id, // Fixed: nationalId instead of idNumber
                  email: p.email,
                  phone: p.phone,
                  gender: p.gender,
                  birthDate: p.birth_date, // Fixed: birthDate instead of dateOfBirth
                  // Add required fields with defaults
                  address: p.address || '',
                  bloodType: p.blood_type || '',
                  allergies: p.allergies || [],
                  emergencyContact: {
                      name: p.emergency_contact_name || '',
                      phone: p.emergency_contact_phone || '',
                      relationship: p.emergency_contact_relationship || ''
                  },
                  registrationDate: p.registration_date,
                  status: p.status
              }));
              setPatients(mappedPatients);
          }

          // 2. Fetch Appointments for this doctor
          const { data: appsData } = await supabase
              .from('appointments')
              .select('*')
              .eq('doctor_id', user.id);

          if (appsData) {
              const mappedApps: Appointment[] = appsData.map((a: any) => ({
                  id: a.id,
                  patientId: a.patient_id,
                  doctorId: a.doctor_id,
                  date: a.date,
                  time: a.time,
                  duration: a.duration,
                  reason: a.reason,
                  status: a.status,
                  type: a.type,
                  patientName: a.patient_name || 'Unknown',
                  // Add required fields with defaults
                  priority: a.priority || 'Medium',
                  reminder: a.reminder !== undefined ? a.reminder : true
              }));
              setAppointments(mappedApps);
          }
      } catch (error) {
          console.error("Dashboard load error", error);
      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, [user.id, activeSection]);

  const getPatient = (id: string) => patients.find(p => p.id === id);
  const getDoctor = (id: string) => doctors.find(m => m.id === id);

  // Filter appointments for the logged-in doctor
  const doctorAppointments = appointments.filter(appointment => appointment.doctorId === user.id);

  // Today's appointments
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAppointments = doctorAppointments.filter(appointment => appointment.date === todayDate);

  // Filtered day's appointments
  const filteredDayAppointments = doctorAppointments.filter(appointment => appointment.date === filterDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'In Progress':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'No Show':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Scheduled': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <Activity className="w-4 h-4" />;
      case 'Completed': return <Eye className="w-4 h-4" />;
      case 'Cancelled': return <RefreshCw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const changeAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(appointment =>
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
    ));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'patients':
        return <PatientsManagement doctorId={user.id} />;
      case 'appointments':
        return <AppointmentsManagement doctorId={user.id} doctorName={user.firstNames || 'Doctor'} />;
      case 'prescriptions':
        return (
          <CreatePrescription
            doctorId={user.id}
            doctorName={user.firstNames || 'Doctor'}
            medicalLicenseNumber="12345"
          />
        );
      case 'reports':
        return (
          <MedicalReports
            doctorId={user.id}
            doctorName={user.firstNames || 'Doctor'}
          />
        );
      case 'notifications':
        return (
          <PushNotifications
            doctorId={user.id}
            doctorName={user.firstNames || 'Doctor'}
          />
        );
      case 'advanced-reports':
        return (
          <AdvancedReports />
        );
      case 'search':
        return (
          <AdvancedSearch
            doctorId={user.id}
          />
        );
      case 'lab-integration':
        return (
          <LabIntegration />
        );
      case 'external-integrations':
        return (
          <ExternalIntegrations />
        );
      case 'enhanced-notifications':
        return (
          <EnhancedNotifications />
        );
      case 'advanced-optimizations':
        return (
          <AdvancedOptimizations />
        );
      case 'backup-system':
        return (
          <BackupSystem />
        );
      case 'medical-reports-list':
        return (
          <MedicalReportsList
            doctorId={user.id}
            doctorName={user.firstNames || 'Doctor'}
          />
        );
      case 'automatic-reports':
        return (
          <AutomaticReports
            doctorId={user.id}
            doctorName={user.firstNames || 'Doctor'}
          />
        );
      case 'charts':
        return (
          <InteractiveCharts
            doctorId={user.id}
            doctorName={user.firstNames || 'Doctor'}
          />
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Profile</h2>
              <p className="text-slate-600 dark:text-slate-400">Personal and professional information</p>
            </div>
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</label>
                    <p className="font-medium dark:text-slate-100">{user.firstNames} {user.lastNames}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">ID Number</label>
                    <p className="font-medium dark:text-slate-100">{user.idType}-{user.nationalId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
                    <p className="font-medium dark:text-slate-100">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone</label>
                    <p className="font-medium dark:text-slate-100">{user.mobilePhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  Welcome, Dr. {user.firstNames}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Doctor's Dashboard - {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={updateMetrics}
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  className="dark:border-slate-600 dark:text-slate-300"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                  Update
                </Button>
                <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                  <Activity className="h-3 w-3 mr-1" />
                  Real-time
                </Badge>
              </div>
            </div>

            {/* Main statistics with animations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className={`border-l-4 border-l-blue-500 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 ${isUpdating ? 'animate-pulse-slow' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Patients</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{metrics.totalPatients}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+{metrics.newPatients} this month</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-l-4 border-l-green-500 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 ${isUpdating ? 'animate-pulse-slow' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Appointments Today</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{todayAppointments.length}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{doctorAppointments.length} total scheduled</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-l-4 border-l-purple-500 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 ${isUpdating ? 'animate-pulse-slow' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Prescriptions Issued</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{metrics.prescriptionsIssued}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">This month</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-l-4 border-l-orange-500 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300 ${isUpdating ? 'animate-pulse-slow' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Income</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">${metrics.monthlyIncome.toLocaleString()}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+12% vs previous month</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Last update */}
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last update: {new Date(metrics.lastUpdate).toLocaleTimeString('en-US')}
              </p>
            </div>

            {/* Main quick actions */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Main Actions</span>
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Quickly access the most used functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => onSectionChange('advanced-reports')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Advanced Analytics</span>
                  </Button>

                  <Button
                    onClick={() => onSectionChange('external-integrations')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Link className="h-6 w-6" />
                    <span className="text-sm">External Systems</span>
                  </Button>

                  <Button
                    onClick={() => onSectionChange('patients')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm">Manage Patients</span>
                  </Button>

                  <Button
                    onClick={() => onSectionChange('appointments')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <CalendarPlus className="h-6 w-6" />
                    <span className="text-sm">Schedule Appointment</span>
                  </Button>

                  <Button
                    onClick={() => onSectionChange('prescriptions')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <PlusCircle className="h-6 w-6" />
                    <span className="text-sm">Create Prescription</span>
                  </Button>

                  <Button
                    onClick={() => onSectionChange('medical-reports-list')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">Medical Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* New advanced modules */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Advanced Modules</span>
                  <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">NEW</Badge>
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Professional tools for advanced medical management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => onSectionChange('backup-system')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Database className="h-6 w-6" />
                    <span className="text-sm">Backup System</span>
                  </Button>

                  <Button
                    onClick={() => onSectionChange('search')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Search className="h-6 w-6" />
                    <span className="text-sm">Advanced Search</span>
                  </Button>

                  <Button
                    onClick={() => onSectionChange('automatic-reports')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Send className="h-6 w-6" />
                    <span className="text-sm">Automatic Reports</span>
                  </Button>

                  <Button
                    onClick={() => onSectionChange('charts')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <PieChart className="h-6 w-6" />
                    <span className="text-sm">Interactive Charts</span>
                  </Button>

                  <Button
                    onClick={() => setIsChatbotOpen(true)}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">Medical Chatbot</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Patients scheduled for today and future days filter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Patients Scheduled Today</span>
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    {todayAppointments.length} patients scheduled for today - You can only attend today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : todayAppointments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No patients scheduled for today</p>
                      </div>
                    ) : (
                      todayAppointments.map((appointment) => {
                        const patient = getPatient(appointment.patientId);
                        const isToday = appointment.date === todayDate;

                        return (
                          <div key={appointment.id} className="flex items-center justify-between p-3 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                              <div>
                                <p className="font-medium dark:text-slate-100">{patient?.firstName} {patient?.lastName}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{appointment.time} - {appointment.type}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Reason: {appointment.reason}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(appointment.status)}>
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1">{appointment.status}</span>
                              </Badge>
                              {isToday && appointment.status === 'Scheduled' && (
                                <Button
                                  size="sm"
                                  onClick={() => changeAppointmentStatus(appointment.id, 'In Progress')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Attend
                                </Button>
                              )}
                              {isToday && appointment.status === 'In Progress' && (
                                <Button
                                  size="sm"
                                  onClick={() => changeAppointmentStatus(appointment.id, 'Completed')}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => onSectionChange('appointments')}
                  >
                    View all appointments
                  </Button>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                    <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Consult Future Appointments</span>
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Review appointments scheduled for other days (consultation only)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                        Select date
                      </label>
                      <Input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {filteredDayAppointments.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No appointments for this date</p>
                        </div>
                      ) : (
                        filteredDayAppointments.map((appointment) => {
                          const patient = getPatient(appointment.patientId);
                          const isFuture = appointment.date > todayDate;

                          return (
                            <div key={appointment.id} className={`p-3 border rounded-lg ${isFuture ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <div>
                                    <p className="font-medium text-sm dark:text-slate-100">{patient?.firstName} {patient?.lastName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{appointment.time} - {appointment.type}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {appointment.status}
                                  </Badge>
                                  {isFuture && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                                      Future
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {isFuture && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  Consultation only - Cannot be attended until the scheduled date
                                </p>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Summary */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span>Weekly Summary</span>
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Statistics for the current week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm dark:text-slate-300">Patients attended</span>
                    </div>
                    <span className="font-medium dark:text-slate-100">38</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm dark:text-slate-300">Average satisfaction</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium dark:text-slate-100">{metrics.averageSatisfaction.toFixed(1)}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/5.0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm dark:text-slate-300">Prescriptions issued</span>
                    </div>
                    <span className="font-medium dark:text-slate-100">{metrics.prescriptionsIssued}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm dark:text-slate-300">Generated income</span>
                    </div>
                    <span className="font-medium dark:text-slate-100">${(metrics.monthlyIncome * 0.25).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => onSectionChange('charts')}
                >
                  View detailed charts
                </Button>
              </CardContent>
            </Card>

            {/* Alerts and notifications */}
            <div className="space-y-4">
              <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>You have {todayAppointments.filter(c => c.status === 'Scheduled').length} patients pending to be attended today.</span>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <AlertDescription className="text-blue-800 dark:text-blue-300">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4" />
                    <span>Remember to update the medical history of attended patients.</span>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
                <AlertDescription className="text-indigo-800 dark:text-indigo-300">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>New modules available! Explore advanced notification, search, and chart tools.</span>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );
    }
  };

  return renderContent();
}