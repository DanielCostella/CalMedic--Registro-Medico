import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Stethoscope, Users, Heart, ArrowRight,
  CheckCircle, Star, LogIn, UserPlus, Scissors, Activity,
  Sparkles, Search, MonitorSmartphone, Shield, LayoutDashboard,
  BrainCircuit, Menu, CalendarCheck, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header / Navbar - Separated Logic */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">

            {/* Logo Section */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-blue-600 rounded-lg p-2 mr-3 shadow-sm">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CalMedic</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">SaaS Healthcare Solution</p>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="hidden md:flex items-center gap-8">

              {/* Zone 1: Patients (Isolated) */}
              <div className="flex items-center gap-4 border-r border-gray-200 pr-8">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Pacientes</p>
                  <p className="text-xs text-blue-600 font-medium">Gestiona tu salud</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/portal-pacientes')} className="text-gray-600 hover:text-blue-600">
                  <Heart className="w-4 h-4 mr-2" />
                  Portal Pacientes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/reservar')} className="text-gray-600 hover:text-blue-600">
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Solicitar Turno
                </Button>
              </div>

              {/* Zone 2: Professionals (Login/Register) */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Profesionales</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50">Ingresar</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Selecciona tu Perfil</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/login?type=medical')}>
                      <Stethoscope className="mr-2 h-4 w-4 text-blue-500" /> Médico / Clínica
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/login?type=aesthetic')}>
                      <Sparkles className="mr-2 h-4 w-4 text-purple-500" /> Centro Estético
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/login?type=beauty')}>
                      <Scissors className="mr-2 h-4 w-4 text-pink-500" /> Salón de Belleza
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/login?type=admin')}>
                      <Shield className="mr-2 h-4 w-4 text-slate-700" /> Administración
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={() => navigate('/register-doctor')}
                  className="bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                >
                  Registrar Consultorio
                </Button>
              </div>
            </div>

            {/* Mobile Menu Placeholder */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon"><Menu /></Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.4] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge className="mb-8 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-1.5 rounded-md text-sm font-semibold border border-blue-100 inline-flex items-center gap-2 tracking-wide uppercase">
              <Sparkles className="w-4 h-4" /> La plataforma SaaS #1 para Profesionales
            </Badge>

            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
              Potencia tu negocio de <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Salud</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Belleza</span>
            </h2>

            <p className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              CalMedic centraliza toda tu operación: desde historias clínicas avanzadas y telemedicina, hasta marketing de fidelización y control de inventario. Elige tu especialidad y comienza hoy.
            </p>

            {/* Segment Cards - Copywriting Updated */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">

              {/* Medical Card */}
              <Card className="group hover:-translate-y-2 transition-all duration-300 border-blue-100 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer bg-white overflow-hidden relative" onClick={() => navigate('/login?type=medical')}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <CardContent className="p-8 text-left">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Clínica Médica</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    <strong>Solución Integral:</strong> Centraliza el historial de tus pacientes, emite recetas digitales validadas, gestiona turnos automáticamente y realiza seguimiento post-consulta con nuestra herramienta de CRM médico.
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1 mb-4">
                    <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Historia Clínica Digital (EMR)</li>
                    <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Telemedicina Integrada</li>
                  </ul>
                  <div className="text-blue-600 text-sm font-bold flex items-center mt-auto group-hover:translate-x-1 transition-transform">
                    Acceder a Clínica <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Aesthetic Card */}
              <Card className="group hover:-translate-y-2 transition-all duration-300 border-purple-100 hover:shadow-2xl hover:shadow-purple-900/10 cursor-pointer bg-white overflow-hidden relative" onClick={() => navigate('/login?type=aesthetic')}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardContent className="p-8 text-left">
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Centro Estético</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    <strong>Gestión Total:</strong> Control de tratamientos por sesiones, fotos de seguimiento, stock de productos, señas y recordatorios automáticos por WhatsApp.
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1 mb-4">
                    <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Agenda y Señas</li>
                    <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Control de Stock e Insumos</li>
                  </ul>
                  <div className="text-purple-600 text-sm font-bold flex items-center mt-auto group-hover:translate-x-1 transition-transform">
                    Acceder a Centro <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Beauty Card */}
              <Card className="group hover:-translate-y-2 transition-all duration-300 border-pink-100 hover:shadow-2xl hover:shadow-pink-900/10 cursor-pointer bg-white overflow-hidden relative" onClick={() => navigate('/login?type=beauty')}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                <CardContent className="p-8 text-left">
                  <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                    <Scissors className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">Salón de Belleza</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    <strong>Tu Negocio al Día:</strong> Agenda veloz, cálculo de comisiones para empleados, historial de estilos del cliente y herramientas de marketing para llenar tus huecos libres.
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1 mb-4">
                    <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Comisiones y empleados</li>
                    <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Fidelización de clientes</li>
                  </ul>
                  <div className="text-pink-500 text-sm font-bold flex items-center mt-auto group-hover:translate-x-1 transition-transform">
                    Acceder a Salón <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Trust / Features Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-3 hover:bg-blue-200 uppercase tracking-widest text-[10px]">Características del Sistema</Badge>
            <p className="mt-4 text-4xl md:text-5xl leading-tight font-extrabold tracking-tight text-gray-900">
              Todo lo que necesitas para <br /> gestionar tu consulta
            </p>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Tecnología de punta simplificada para que te enfoques en lo que mejor sabes hacer: atender a tus clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white text-blue-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <MonitorSmartphone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Acceso Multi-Dispositivo</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Tu agenda en la palma de tu mano. Tablet, móvil o escritorio.</p>
            </div>
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-green-100 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white text-green-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Máxima Seguridad</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Encriptación de grado bancario para proteger historiales.</p>
            </div>
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white text-purple-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Asistente IA</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Diagnósticos sugeridos y predicción inteligente de stock.</p>
            </div>
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white text-orange-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analíticas en Vivo</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Métricas de retención y crecimiento en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Patient Flow Call to Action - SOFTENED COLORS, NO BUTTONS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl overflow-hidden border border-slate-100 shadow-lg">
            <div className="relative z-10 px-8 py-12 md:px-16 text-center md:text-left md:flex md:items-center md:justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">Portal del Paciente</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">¿Eres un paciente buscando atención?</h3>
                <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
                  Nuestra red de especialistas verificados está lista para atenderte.
                  Utiliza la barra de navegación superior para <strong>Buscar Especialistas</strong> o ingresar a tu <strong>Portal Personal</strong>.
                </p>
              </div>
              <div className="hidden md:block">
                <CalendarCheck className="w-32 h-32 text-blue-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Redesigned - NO NUMBERS */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 text-center border-y border-gray-100 py-8">
            <div className="p-4">
              <p className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> Pacientes
              </p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Plataforma Activa</p>
            </div>
            <div className="p-4">
              <p className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                <Stethoscope className="w-5 h-5 text-green-500" /> Especialidades
              </p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Cobertura Total</p>
            </div>
            <div className="p-4">
              <p className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" /> Seguridad
              </p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Datos Encriptados</p>
            </div>
            <div className="p-4">
              <p className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-red-500" /> Soporte
              </p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Atención Dedicada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 rounded p-1 mr-2"><Activity className="h-5 w-5 text-white" /></div>
                <h4 className="text-lg font-bold text-gray-900">CalMedic</h4>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                El ecosistema digital líder para profesionales de la salud y el bienestar. Simplificamos la gestión para que puedas enfocarte en tus pacientes.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Plataforma</h5>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Clínica Médica</a></li>
                <li><a href="#" className="hover:text-blue-600">Centro Estético</a></li>
                <li><a href="#" className="hover:text-blue-600">Salón de Belleza</a></li>
                <li><a href="#" className="hover:text-blue-600">Portal Pacientes</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Compañía</h5>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Nosotros</a></li>
                <li><a href="#" className="hover:text-blue-600">Carreras</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Soporte</h5>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-blue-600">Documentación</a></li>
                <li><a href="#" className="hover:text-blue-600">Estado del Servicio</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2024 CalMedic. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              {/* Social icons kept generic */}
              <a href="#" className="text-gray-400 hover:text-gray-600"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-gray-600"><span className="sr-only">GitHub</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Helper component for Badge */}
      <style>{`
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);
