import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import MedicalDashboard from '@/components/dashboard/MedicalDashboard';
import AestheticDashboard from '@/components/dashboard/AestheticDashboard';
import BeautyDashboard from '@/components/dashboard/BeautyDashboard';
import PendingApproval from '@/components/auth/PendingApproval';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/user';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [professionType, setProfessionType] = useState<'medical' | 'aesthetic' | 'beauty'>('medical');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        if (user.role !== 'Doctor') {
          navigate('/portal-pacientes'); // Redirect to patient portal if not a doctor
          return;
        }

        setCurrentUser(user);
        
        // Determine profession type from user details
        const category = user.doctorDetails?.profession_category?.toLowerCase() || 'medical';
        if (category === 'aesthetic') setProfessionType('aesthetic');
        else if (category === 'beauty') setProfessionType('beauty');
        else setProfessionType('medical');

      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentUser) return null;

  // Check for license status
  const licenseStatus = currentUser.doctorDetails?.license_status || 'In Review';
  
  if (licenseStatus !== 'Active') {
    return <PendingApproval status={licenseStatus} onLogout={handleLogout} />;
  }

  // Prepare currentDoctor object for the dashboards
  // This matches the structure expected by the original dashboard logic
  const doctorProfile = {
    id: currentUser.id, // Using user ID for fetching data
    name: `${currentUser.firstNames} ${currentUser.lastNames}`,
    role: currentUser.role,
    specialty: currentUser.doctorDetails?.specialty || 'General Practice',
    medical_license_number: currentUser.doctorDetails?.medical_license_number,
    color: professionType === 'beauty' ? 'bg-pink-500' : (professionType === 'aesthetic' ? 'bg-purple-600' : 'bg-blue-600'),
    profession_category: currentUser.doctorDetails?.profession_category
  };

  // Dictionary Pattern: Map profession types to components
  // This is cleaner than switch/if-else chains and easier to extend
  const DASHBOARD_COMPONENTS: Record<string, React.FC<any>> = {
    medical: MedicalDashboard,
    aesthetic: AestheticDashboard,
    beauty: BeautyDashboard,
  };

  // Select the component or fallback to Medical
  const SelectedDashboard = DASHBOARD_COMPONENTS[professionType] || MedicalDashboard;

  return <SelectedDashboard currentDoctor={doctorProfile} onLogout={handleLogout} />;
};

export default DoctorDashboard;
