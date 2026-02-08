import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, User, Lock, Calendar, Users, HeartPulse, Shield } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/language-switcher';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/authService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  color: string;
  patients: number;
  appointmentsToday: number;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  // Using useLocation to get query params
  const location = useLocation();

  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]); // New state for filtering

  // Determine context type from URL
  const searchParams = new URLSearchParams(location.search);
  const contextType = searchParams.get('type') || 'medical'; // 'medical' | 'aesthetic' | 'beauty'

  // UI Text based on context
  const getContextTitle = () => {
    if (contextType === 'aesthetic') return 'Aesthetic Center Access';
    if (contextType === 'beauty') return 'Beauty Salon Access';
    return 'Medical Staff Access';
  };

  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Fetch real doctors from Supabase
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id,
          specialty,
          profession_category,
          profiles!inner(
            id,
            first_names,
            last_names,
            email
          )
        `);
      // .eq('license_status', 'Active'); // Show all doctors including those in review

      if (error) {
        console.error('Error fetching doctors:', error);
        setLoginError(error.message);
        setLoading(false);
        return;
      }

      const colors = ['bg-blue-500', 'bg-green-600', 'bg-pink-600', 'bg-purple-600', 'bg-red-600', 'bg-orange-600'];

      const formattedDoctors: Doctor[] = (data || []).map((doc: any, index: number) => ({
        id: doc.id,
        name: `Dr. ${doc.profiles.first_names} ${doc.profiles.last_names}`,
        specialty: doc.specialty,
        email: doc.profiles.email,
        color: colors[index % colors.length],
        patients: 0,
        appointmentsToday: 0,
        // Use profession_category from doctors table
        category: doc.profession_category || 'Medical'
      }));

      setDoctors(formattedDoctors);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // Effect to filter doctors when list or context changes
  useEffect(() => {
    if (doctors.length > 0) {
      const targetCategory =
        contextType === 'aesthetic' ? 'Aesthetic' :
          contextType === 'beauty' ? 'Beauty' : 'Medical';

      setFilteredDoctors(doctors.filter((d: any) => d.category === targetCategory));
    }
  }, [doctors, contextType]);


  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setEmail(doctor.email);
    }
    setLoginError('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Please enter email and password');
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const response = await authService.login({ email, password });

      if (response.success && response.user) {
        // Save user info
        localStorage.setItem('currentUser', JSON.stringify(response.user));

        // Redirect based on role
        if (response.user.role === 'Admin') {
          navigate('/admin');
        } else if (response.user.role === 'Doctor') {
          // We cast to any because typescript might not know about doctorDetails yet in the base interface unless updated globally
          const docDetails = (response.user as any).doctorDetails;

          if (docDetails?.profession_category === 'Medical') {
            navigate('/doctor-dashboard');
          } else if (docDetails?.profession_category === 'Aesthetic') {
            // For now, these share the same dashboard but could be split later
            navigate('/doctor-dashboard?type=aesthetic');
          } else if (docDetails?.profession_category === 'Beauty') {
            navigate('/doctor-dashboard?type=beauty');
          } else {
            navigate('/doctor-dashboard');
          }
        } else {
          navigate('/portal-pacientes');
        }
      } else {
        setLoginError(response.message || 'Login failed');
      }
    } catch (error: any) {
      setLoginError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Main Login Card */}
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center pb-2">
          {contextType !== 'admin' && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {contextType !== 'admin' && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mr-2 px-2 hover:bg-slate-100">
                    ←
                  </Button>
                )}
                <Stethoscope className="w-10 h-10 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {getContextTitle()}
                  </CardTitle>
                  <p className="text-gray-600">
                    {contextType === 'medical' ? 'Access for Medical Professionals' : 'Access for Staff Members'}
                  </p>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          )}
        </CardHeader>

        <CardContent>
          {contextType === 'admin' ? (
            <div className="space-y-6 pt-0">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Shield className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Portal de Administración</h3>
                <p className="text-sm text-gray-500 mt-1">Acceso seguro para gestión de la plataforma</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Email de Administrador</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="admin@medicomgx.com"
                      className="pl-10 h-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none">Contraseña</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="•••••••"
                      className="pl-10 h-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md flex items-center gap-2 border border-red-100">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    {loginError}
                  </div>
                )}

                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800 h-11 font-medium"
                  size="lg"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Verificando credenciales...
                    </>
                  ) : (
                    'Ingresar al Panel'
                  )}
                </Button>
              </div>

              <div className="text-center mt-6">
                <Button variant="link" size="sm" onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800">
                  ← Volver al inicio
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue={contextType === 'patient' ? 'patient' : 'medical'} className="w-full" onValueChange={(val) => {
              if (val === 'patient') {
                setSelectedDoctor('');
                setEmail('');
                setPassword('');
                setLoginError('');
              }
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="medical" className="flex items-center gap-2 text-xs md:text-sm">
                  <Stethoscope className="w-4 h-4" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="patient" className="flex items-center gap-2 text-xs md:text-sm">
                  <HeartPulse className="w-4 h-4" />
                  Patient
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medical" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t('login.selectDoctor')}
                  </h3>

                  {loading && doctors.length === 0 ? (
                    <div className="text-center py-8">
                      <LoadingSpinner />
                      <p className="text-gray-500 mt-2">Loading professionals...</p>
                    </div>
                  ) : loginError && !selectedDoctor ? (
                    <div className="text-center py-8">
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 inline-block">
                        <p className="font-bold">Error loading list</p>
                        <p className="text-sm">{loginError}</p>
                      </div>
                      <Button variant="outline" onClick={fetchDoctors}>
                        Try Again
                      </Button>
                    </div>
                  ) : filteredDoctors.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg bg-gray-50">
                      <p className="text-gray-600 font-medium">No professionals found for {contextType}</p>
                      <p className="text-xs text-gray-400 mt-1">Please register as an {contextType} professional first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDoctors.map((doctor) => (
                        <Card
                          key={doctor.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${selectedDoctor === doctor.id
                            ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50'
                            : 'hover:shadow-md'
                            }`}
                          onClick={() => handleDoctorSelect(doctor.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center space-y-3">
                              <div className={`w-16 h-16 rounded-full ${doctor.color} flex items-center justify-center`}>
                                {contextType === 'medical' ? (
                                  <Stethoscope className="w-8 h-8 text-white" />
                                ) : contextType === 'aesthetic' ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><path d="M12 21.5c-1.6 0-3-3.1-4.7-5.5-1.5-2-3-4.1-2.9-6.3.2-3.8 3.2-6.7 7.6-6.7 4.4 0 7.4 2.9 7.6 6.7.1 2.2-1.4 4.3-2.9 6.3-1.7 2.4-3.1 5.5-4.7 5.5Z" /><path d="m10 7 2 2 2-2" /></svg>
                                ) : (
                                  <Users className="w-8 h-8 text-white" />
                                )}
                              </div>

                              <div>
                                <h4 className="font-semibold text-sm">{doctor.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">{doctor.specialty}</p>
                                <p className="text-xs text-gray-500 mt-1">{doctor.email}</p>
                              </div>

                              <div className="flex gap-2 flex-wrap justify-center">
                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {doctor.patients} patients
                                </Badge>
                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {doctor.appointmentsToday} today
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {selectedDoctor && (
                  <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                      </div>
                    </div>

                    {loginError && selectedDoctor && (
                      <div className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        {loginError}
                      </div>
                    )}

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      <Stethoscope className="w-5 h-5 mr-2" />
                      {loading ? 'Logging in...' : t('login.loginButton')}
                    </Button>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/register-doctor')}
                    className="text-gray-500 hover:text-blue-600 text-sm"
                  >
                    Register as a new Doctor
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="patient" className="space-y-6 pt-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Patient Portal Access</h3>
                  <p className="text-sm text-gray-500">Access your medical history securely</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Email</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="*******"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      {loginError}
                    </div>
                  )}

                  <div className="text-center text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                    <p>Demo Patient:</p>
                    <p className="font-mono mt-1">user: paciente@demo.com</p>
                    <p className="font-mono">pass: paciente123</p>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-blue-600 mt-1"
                      onClick={async () => {
                        setLoading(true);
                        // Try to register the demo user silently if not exists
                        try {
                          await authService.register({
                            email: 'paciente@demo.com',
                            password: 'paciente123',
                            firstNames: 'Juan',
                            lastNames: 'Pérez Testing',
                            nationalId: '99999999',
                            idType: 'V',
                            role: 'User'
                          });
                        } catch (e) {
                          // Ignore error if already exists
                        }
                        setEmail('paciente@demo.com');
                        setPassword('paciente123');
                        handleLogin();
                      }}
                    >
                      Auto-login Demo User
                    </Button>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Accessing...
                      </>
                    ) : (
                      'Login to Portal'
                    )}
                  </Button>

                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 mb-2">First time here?</p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/register')}
                      className="w-full text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                    >
                      Create Patient Account
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
