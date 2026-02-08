import React, { useState } from 'react';
import {
  Stethoscope, Users, Calendar, FileText, Pill, FolderOpen,
  TestTube, HardDrive, BarChart3, Bell, Activity, UserCheck,
  Link, Video, Zap, Search, MessageCircle, TrendingUp,
  Camera, Palette, Baby, Eye, Scissors, Scale, CheckCircle, ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import specialized components (Note: we will rename these soon)
import SpecialtySelector from '@/components/medicos/SpecialtySelector';
import DentistryModule from '@/components/medicos/DentistryModule';
import PediatricsModule from '@/components/medicos/PediatricsModule';
import OphthalmologyModule from '@/components/medicos/OphthalmologyModule';
import SurgeryModule from '@/components/medicos/SurgeryModule';
import BariatricsModule from '@/components/medicos/BariatricsModule';

// Import existing general components
import DoctorInsurancesModule from '@/components/medicos/DoctorInsurancesModule';
import PushNotifications from '@/components/medicos/PushNotifications';
import PatientsManagement from '@/components/medicos/PatientsManagement';
import AppointmentsManagement from '@/components/medicos/AppointmentsManagement';
import MedicalHistory from '@/components/medicos/MedicalHistory';
import DigitalPrescriptionSystem from '@/components/medicos/DigitalPrescriptionSystem';
import FileSystem from '@/components/medicos/FileSystem';
import LabIntegration from '@/components/medicos/LabIntegration';
import BackupSystem from '@/components/medicos/BackupSystem';
import AdvancedReports from '@/components/medicos/AdvancedReports';
import MedicalReportsList from '@/components/medicos/MedicalReportsList';
import AdvancedSearch from '@/components/medicos/AdvancedSearch';
import UserManagementSystem from '@/components/medicos/UserManagementSystem';
import ExternalIntegrations from '@/components/medicos/ExternalIntegrations';
import Telemedicine from '@/components/medicos/Telemedicine';
import AdvancedOptimizations from '@/components/medicos/AdvancedOptimizations';
import MedicalChatbot from '@/components/medicos/MedicalChatbot';
import ExecutiveDashboard from '@/components/medicos/ExecutiveDashboard';
import DoctorFinanceDashboard from '@/components/medicos/DoctorFinanceDashboard';
import EnhancedNotifications from '@/components/medicos/EnhancedNotifications';
import IntegratedCamera from '@/components/medicos/IntegratedCamera';
import GlobalSearchComponent from '@/components/ui/global-search';
import ThemeToggleComponent from '@/components/ui/theme-toggle';

interface MedicalModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'general' | 'specialized';
  specialties?: string[];
  component: React.ComponentType;
  isNew?: boolean;
}

const DoctorDashboardPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('general');
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(true);
  const [isChatbotVisible, setIsChatbotVisible] = useState(true);

  const modules: MedicalModule[] = [
    // General Modules
    {
      id: 'dashboard',
      name: 'Main Dashboard',
      description: 'Main panel with statistics and general overview',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-blue-500',
      category: 'general',
      component: () => <DoctorFinanceDashboard doctorId="1" doctorName="Sistema Médico" specialty="General" />
    },
    {
      id: 'executive-dashboard',
      name: 'Executive Dashboard',
      description: 'KPIs and advanced management metrics',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-purple-500',
      category: 'general',
      component: ExecutiveDashboard,
      isNew: true
    },
    {
      id: 'patients',
      name: 'Patient Management',
      description: 'Complete patient registration and administration',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-500',
      category: 'general',
      component: PatientsManagement
    },
    {
      id: 'appointments',
      name: 'Appointment System',
      description: 'Scheduling and management of medical appointments',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-orange-500',
      category: 'general',
      component: AppointmentsManagement
    },
    {
      id: 'history',
      name: 'Medical Records',
      description: 'Complete clinical history with exams and consultations',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-indigo-500',
      category: 'general',
      component: MedicalHistory
    },
    {
      id: 'search',
      name: 'Advanced Search',
      description: 'Intelligent search engine with AI',
      icon: <Search className="w-5 h-5" />,
      color: 'bg-indigo-500',
      category: 'general',
      component: AdvancedSearch
    },
    {
      id: 'prescriptions',
      name: 'Digital Prescriptions',
      description: 'Digital prescriptions with interaction verification',
      icon: <Pill className="w-5 h-5" />,
      color: 'bg-red-500',
      category: 'general',
      component: DigitalPrescriptionSystem
    },
    {
      id: 'files',
      name: 'File System',
      description: 'Management of medical documents and DICOM files',
      icon: <FolderOpen className="w-5 h-5" />,
      color: 'bg-yellow-500',
      category: 'general',
      component: FileSystem
    },
    {
      id: 'camera-ocr',
      name: 'Camera with OCR',
      description: 'Capture and automatic processing of medical documents',
      icon: <Camera className="w-5 h-5" />,
      color: 'bg-cyan-500',
      category: 'general',
      component: IntegratedCamera,
      isNew: true
    },
    {
      id: 'labs',
      name: 'Lab Integration',
      description: 'Automatic reception of laboratory results',
      icon: <TestTube className="w-5 h-5" />,
      color: 'bg-pink-500',
      category: 'general',
      component: LabIntegration
    },
    {
      id: 'backup',
      name: 'Backup System',
      description: 'Automatic backup and data security',
      icon: <HardDrive className="w-5 h-5" />,
      color: 'bg-gray-500',
      category: 'general',
      component: BackupSystem
    },
    {
      id: 'reports',
      name: 'Advanced Reports',
      description: 'Customizable report generation and analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-teal-500',
      category: 'general',
      component: AdvancedReports
    },
    {
      id: 'notifications',
      name: 'Push Notifications',
      description: 'Real-time notification system',
      icon: <Bell className="w-5 h-5" />,
      color: 'bg-amber-500',
      category: 'general',
      component: PushNotifications
    },
    {
      id: 'notifications-plus',
      name: 'Notifications+',
      description: 'Advanced multi-channel notification system',
      icon: <Bell className="w-5 h-5" />,
      color: 'bg-violet-500',
      category: 'general',
      component: EnhancedNotifications,
      isNew: true
    },
    {
      id: 'analytics',
      name: 'Analytics and Reports',
      description: 'Metrics dashboard and data analysis',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-emerald-500',
      category: 'general',
      component: MedicalReportsList
    },
    {
      id: 'insurances',
      name: 'Accepted Insurances',
      description: 'Manage accepted Health Insurances and Providers',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'bg-blue-600',
      category: 'general',
      component: DoctorInsurancesModule,
      isNew: true
    },
    {
      id: 'users',
      name: 'User Management',
      description: 'Management of users, roles, and permissions',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'bg-indigo-500',
      category: 'general',
      component: UserManagementSystem
    },
    {
      id: 'integrations',
      name: 'External Integrations',
      description: 'Connections with external APIs and services',
      icon: <Link className="w-5 h-5" />,
      color: 'bg-rose-500',
      category: 'general',
      component: ExternalIntegrations
    },
    {
      id: 'telemedicine',
      name: 'Telemedicine',
      description: 'Virtual consultations and medical video calls',
      icon: <Video className="w-5 h-5" />,
      color: 'bg-emerald-500',
      category: 'general',
      component: Telemedicine
    },
    {
      id: 'pwa-optimizations',
      name: 'PWA Optimizations',
      description: 'Progressive Web App and advanced optimizations',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-lime-500',
      category: 'general',
      component: AdvancedOptimizations
    },
    {
      id: 'chatbot',
      name: 'Medical Chatbot',
      description: 'AI-powered virtual assistant for basic medical queries',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-fuchsia-500',
      category: 'general',
      component: MedicalChatbot,
      isNew: true
    },

    // Specialized Modules
    {
      id: 'dentistry',
      name: 'Dentistry',
      description: 'Digital odontogram and dental treatment management',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-green-600',
      category: 'specialized',
      specialties: ['dentistry'],
      component: DentistryModule,
      isNew: true
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      description: 'Growth curves and comprehensive pediatric tracking',
      icon: <Baby className="w-5 h-5" />,
      color: 'bg-pink-600',
      category: 'specialized',
      specialties: ['pediatrics'],
      component: PediatricsModule,
      isNew: true
    },
    {
      id: 'ophthalmology',
      name: 'Ophthalmology',
      description: 'Complete ocular evaluation and eyewear prescription',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-purple-600',
      category: 'specialized',
      specialties: ['ophthalmology'],
      component: OphthalmologyModule,
      isNew: true
    },
    {
      id: 'surgery',
      name: 'General Surgery',
      description: 'Complete pre, intra, and post-operative tracking',
      icon: <Scissors className="w-5 h-5" />,
      color: 'bg-red-600',
      category: 'specialized',
      specialties: ['surgery'],
      component: SurgeryModule,
      isNew: true
    },
    {
      id: 'bariatrics',
      name: 'Bariatric Surgery',
      description: 'Specialized tracking for weight loss surgery',
      icon: <Scale className="w-5 h-5" />,
      color: 'bg-orange-600',
      category: 'specialized',
      specialties: ['bariatrics'],
      component: BariatricsModule,
      isNew: true
    }
  ];

  // Filter modules based on selected specialty
  const filteredModules = modules.filter(module => {
    if (module.category === 'general') return true;
    if (module.category === 'specialized') {
      return module.specialties?.includes(selectedSpecialty);
    }
    return false;
  });

  const ActiveComponent = activeModule ? modules.find(m => m.id === activeModule)?.component : null;

  if (ActiveComponent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Button
                variant="ghost"
                onClick={() => setActiveModule(null)}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Back to Dashboard</span>
                <span className="xs:hidden">Back</span>
              </Button>

              <div className="flex items-center gap-1 sm:gap-4">
                <div className="hidden sm:block">
                  <GlobalSearchComponent />
                </div>
                <ThemeToggleComponent />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <ActiveComponent />
        </div>

        {isChatbotVisible && (
          <MedicalChatbot
            isMinimized={isChatbotMinimized}
            onToggleMinimize={() => setIsChatbotMinimized(!isChatbotMinimized)}
            onClose={() => setIsChatbotVisible(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">
                  Comprehensive Medical System
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Main Dashboard - {filteredModules.length} modules available
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
              <div className="hidden md:block">
                <GlobalSearchComponent />
              </div>
              <ThemeToggleComponent />
              <Badge className="bg-green-100 text-green-800 text-xs hidden lg:inline-flex">
                Complete System + Specialties
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Specialty Selector - Responsive */}
        <div className="mb-6 sm:mb-8">
          <SpecialtySelector
            onSpecialtyChange={setSelectedSpecialty}
            currentSpecialty={selectedSpecialty}
          />
        </div>

        {/* Quick Statistics - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Available Modules</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{filteredModules.length}</p>
                </div>
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">New Modules</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {filteredModules.filter(m => m.isNew).length}
                  </p>
                </div>
                <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Active Specialty</p>
                  <p className="text-sm sm:text-lg font-bold text-purple-600 capitalize truncate">
                    {selectedSpecialty === 'general' ? 'General Medicine' : selectedSpecialty}
                  </p>
                </div>
                <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">System Status</p>
                  <p className="text-sm sm:text-lg font-bold text-orange-600">100% Functional</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredModules.map((module) => (
            <Card
              key={module.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 relative"
              onClick={() => setActiveModule(module.id)}
            >
              {module.isNew && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white z-10 text-xs">
                  New
                </Badge>
              )}

              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${module.color} text-white`}>
                    {module.icon}
                  </div>
                  {module.category === 'specialized' && (
                    <Badge variant="outline" className="text-xs">
                      Specialized
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardTitle className="text-sm sm:text-lg mb-2 line-clamp-2">{module.name}</CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{module.description}</p>

                <Button className="w-full" size="sm">
                  Open Module
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info - Responsive */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Comprehensive Integrated Medical System
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {filteredModules.length} functional modules with integrated medical specialties
            </p>
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              <Badge className="bg-blue-100 text-blue-800 text-xs">Full PWA</Badge>
              <Badge className="bg-green-100 text-green-800 text-xs">Real-Time</Badge>
              <Badge className="bg-purple-100 text-purple-800 text-xs">Specialties</Badge>
              <Badge className="bg-orange-100 text-orange-800 text-xs">AI Integrated</Badge>
              <Badge className="bg-pink-100 text-pink-800 text-xs hidden sm:inline-flex">Custom Themes</Badge>
              <Badge className="bg-cyan-100 text-cyan-800 text-xs hidden sm:inline-flex">Global Search</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot - Responsive */}
      {isChatbotVisible && (
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50">
          <MedicalChatbot
            isMinimized={isChatbotMinimized}
            onToggleMinimize={() => setIsChatbotMinimized(!isChatbotMinimized)}
            onClose={() => setIsChatbotVisible(false)}
          />
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component - Responsive
const MainDashboard: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Main Dashboard</h2>
          <p className="text-sm sm:text-base text-gray-600">General medical system overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Registered Patients</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">1,247</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Today's Appointments</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">28</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Prescriptions Issued</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">156</p>
              </div>
              <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending Lab Tests</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">12</p>
              </div>
              <TestTube className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm flex-1">New appointment scheduled - Dr. Garcia</p>
                <span className="text-xs text-gray-500">5 min ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm flex-1">Lab result received</p>
                <span className="text-xs text-gray-500">12 min ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm flex-1">Digital prescription issued</p>
                <span className="text-xs text-gray-500">18 min ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm flex-1">Automatic backup completed</p>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Active Modules</span>
                <Badge className="bg-green-100 text-green-800 text-xs">24/24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Integrations</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Backup</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Up to date</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Performance</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Optimal</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Security</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Protected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;