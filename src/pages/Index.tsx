import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, Users, Calendar, FileText, Heart, ArrowRight, CheckCircle, Star, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema Médico Integral</h1>
                <p className="text-sm text-gray-500">Plataforma completa de gestión médica</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/portal-pacientes')}
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Portal Pacientes
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Acceso Médicos
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
              Sistema Médico Integral con Agendas Personalizadas
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plataforma completa de gestión médica con <strong>agendas personalizadas por médico</strong>, 
              diseñada para optimizar la práctica médica moderna con tecnología de vanguardia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Acceso Médicos (Con Agendas)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/portal-pacientes')}
                className="text-lg px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Heart className="w-5 h-5 mr-2" />
                Portal Pacientes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Badges de funcionalidades */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                ✅ 6 Médicos con Agendas Personalizadas
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                🏥 Login por Especialidad Médica
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                📅 Citas y Pacientes Específicos
              </div>
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                👨‍⚕️ Dashboard Personalizado
              </div>
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                🔐 Sistema de Autenticación
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Médicos disponibles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Médicos con Agendas Personalizadas
            </h3>
            <p className="text-lg text-gray-600">
              Cada médico tiene su propia agenda, pacientes y especialidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dr. Juan Pérez */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold">Dr. Juan Pérez</h4>
                    <p className="text-sm text-gray-600">Medicina General</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    247 pacientes activos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    12 citas programadas hoy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Consultas generales y controles
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Dra. María González */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold">Dra. María González</h4>
                    <p className="text-sm text-gray-600">Odontología</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    189 pacientes activos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    8 citas programadas hoy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Tratamientos dentales y ortodoncia
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Dr. Carlos Rodríguez */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold">Dr. Carlos Rodríguez</h4>
                    <p className="text-sm text-gray-600">Pediatría</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    156 pacientes pediátricos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    15 citas programadas hoy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Controles de crecimiento y vacunas
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Dra. Ana Martínez */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold">Dra. Ana Martínez</h4>
                    <p className="text-sm text-gray-600">Oftalmología</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    134 pacientes activos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    6 citas programadas hoy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Exámenes oculares y cirugías
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Dr. Luis Fernández */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold">Dr. Luis Fernández</h4>
                    <p className="text-sm text-gray-600">Cirugía General</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    98 pacientes quirúrgicos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    4 cirugías programadas hoy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Pre y post operatorios
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Dr. Roberto Silva */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold">Dr. Roberto Silva</h4>
                    <p className="text-sm text-gray-600">Cirugía Bariátrica</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    67 pacientes bariátricos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    3 seguimientos hoy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Controles post-operatorios
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema con Agendas Personalizadas Completado
            </h3>
            <p className="text-lg text-gray-600">
              Cada médico tiene su propio dashboard y agenda personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">6</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Médicos Especialistas</h4>
              <p className="text-gray-600">Con agendas personalizadas</p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">891</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Pacientes Totales</h4>
              <p className="text-gray-600">Distribuidos por especialidad</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">48</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Citas Hoy</h4>
              <p className="text-gray-600">Entre todos los médicos</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">100%</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Funcional</h4>
              <p className="text-gray-600">Login y agendas personalizadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            ¡Prueba el Sistema con Agendas Personalizadas!
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Cada médico tiene su propia agenda, pacientes y citas específicas de su especialidad
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Probar Login de Médicos
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/portal-pacientes')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
            >
              <Heart className="w-5 h-5 mr-2" />
              Portal de Pacientes
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Stethoscope className="h-8 w-8 text-blue-400 mr-3" />
                <h4 className="text-xl font-bold">Sistema Médico Integral</h4>
              </div>
              <p className="text-gray-400">
                Plataforma completa con agendas personalizadas por médico y especialidad.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Especialidades</h5>
              <ul className="space-y-2 text-gray-400">
                <li>• Medicina General</li>
                <li>• Odontología</li>
                <li>• Pediatría</li>
                <li>• Oftalmología</li>
                <li>• Cirugía General y Bariátrica</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Funcionalidades</h5>
              <ul className="space-y-2 text-gray-400">
                <li>• Login por Médico</li>
                <li>• Agendas Personalizadas</li>
                <li>• Pacientes por Especialidad</li>
                <li>• Dashboard Individual</li>
                <li>• Sistema de Citas</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Sistema Médico Integral - Desarrollado con ❤️ por el equipo MGX</p>
            <p className="mt-2">🎉 <strong>¡Agendas personalizadas por médico implementadas exitosamente!</strong> 🎉</p>
          </div>
        </div>
      </footer>
    </div>
  );
}