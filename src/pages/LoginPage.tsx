import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, User, Lock, Calendar, Users } from 'lucide-react';

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
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const doctors: Doctor[] = [
    {
      id: 'juan-perez',
      name: 'Dr. Juan Pérez',
      specialty: 'Medicina General',
      email: 'juan.perez@hospital.com',
      color: 'bg-blue-500',
      patients: 247,
      appointmentsToday: 12
    },
    {
      id: 'maria-gonzalez',
      name: 'Dra. María González',
      specialty: 'Odontología',
      email: 'maria.gonzalez@hospital.com',
      color: 'bg-green-600',
      patients: 189,
      appointmentsToday: 8
    },
    {
      id: 'carlos-rodriguez',
      name: 'Dr. Carlos Rodríguez',
      specialty: 'Pediatría',
      email: 'carlos.rodriguez@hospital.com',
      color: 'bg-pink-600',
      patients: 156,
      appointmentsToday: 15
    },
    {
      id: 'ana-martinez',
      name: 'Dra. Ana Martínez',
      specialty: 'Oftalmología',
      email: 'ana.martinez@hospital.com',
      color: 'bg-purple-600',
      patients: 134,
      appointmentsToday: 6
    },
    {
      id: 'luis-fernandez',
      name: 'Dr. Luis Fernández',
      specialty: 'Cirugía General',
      email: 'luis.fernandez@hospital.com',
      color: 'bg-red-600',
      patients: 98,
      appointmentsToday: 4
    },
    {
      id: 'roberto-silva',
      name: 'Dr. Roberto Silva',
      specialty: 'Cirugía Bariátrica',
      email: 'roberto.silva@hospital.com',
      color: 'bg-orange-600',
      patients: 67,
      appointmentsToday: 3
    }
  ];

  const handleLogin = () => {
    if (selectedDoctor && password) {
      // Guardar información del médico en localStorage
      const doctor = doctors.find(d => d.id === selectedDoctor);
      if (doctor) {
        localStorage.setItem('currentDoctor', JSON.stringify(doctor));
        navigate('/doctor-dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Stethoscope className="w-10 h-10 text-blue-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Sistema Médico Integral
              </CardTitle>
              <p className="text-gray-600">Acceso para Profesionales Médicos</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Selecciona tu perfil médico
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    selectedDoctor === doctor.id
                      ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`w-16 h-16 rounded-full ${doctor.color} flex items-center justify-center`}>
                        <Stethoscope className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm">{doctor.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">{doctor.email}</p>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap justify-center">
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {doctor.patients} pacientes
                        </Badge>
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {doctor.appointmentsToday} citas hoy
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedDoctor && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para demo: usa cualquier contraseña
                </p>
              </div>

              <Button
                onClick={handleLogin}
                disabled={!selectedDoctor || !password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Acceder al Dashboard Médico
              </Button>
            </div>
          )}

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              ¿No tienes acceso médico?
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/portal-pacientes')}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Ir al Portal de Pacientes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;