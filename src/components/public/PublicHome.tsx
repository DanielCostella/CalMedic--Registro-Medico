import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Clock, ArrowRight, Building2, Stethoscope, Video, Wifi } from 'lucide-react';
import { publicService } from '@/services/publicService';
import { useNavigate } from 'react-router-dom';

const PublicHome = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('Mendoza');
    const [specialty, setSpecialty] = useState('all');
    const [insurance, setInsurance] = useState('all');
    const [isTelemedicine, setIsTelemedicine] = useState(false);
    const [isOnlineBooking, setIsOnlineBooking] = useState(false);

    const [insurances, setInsurances] = useState<{ id: string, name: string }[]>([]);
    const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [insList, specList] = await Promise.all([
                    publicService.getInsuranceProviders(),
                    publicService.getUniqueSpecialties()
                ]);
                setInsurances(insList);
                setAvailableSpecialties(specList);
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    const handleSearch = () => {
        // Navigate to booking page with query params
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        if (specialty !== 'all') params.set('specialties', specialty);
        if (insurance !== 'all') params.set('insurance', insurance);
        navigate(`/reservar?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar Placeholder */}
            <header className="bg-white shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            C
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            CalMedic
                        </span>
                    </div>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                        <a href="/reservar" className="hover:text-blue-600">Para Pacientes</a>
                        <a href="/register-doctor" className="hover:text-blue-600">Para Especialistas</a>
                        <a href="#" className="hover:text-blue-600">Centros Médicos</a>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/login')}>Ingresar</Button>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 py-16 md:py-24 relative overflow-hidden">
                {/* Decoration Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">
                        Bienvenido a CalMedic
                    </h1>
                    <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
                        Tu aliado para promover el bienestar de tu familia. Encuentra el especialista ideal en segundos.
                    </p>

                    {/* Search Box Card */}
                    <Card className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-2xl border-0">
                        <h2 className="text-left text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Search className="w-5 h-5 text-orange-500" />
                            Encontrar turno médico
                        </h2>

                        {/* Toggles */}
                        <div className="flex gap-6 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${isTelemedicine ? 'bg-orange-500' : 'bg-gray-300'}`} onClick={() => setIsTelemedicine(!isTelemedicine)}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isTelemedicine ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <span className="text-sm text-gray-700 font-medium flex items-center gap-1">
                                    <Video className="w-4 h-4" /> Teleconsulta
                                </span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${isOnlineBooking ? 'bg-orange-500' : 'bg-gray-300'}`} onClick={() => setIsOnlineBooking(!isOnlineBooking)}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOnlineBooking ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <span className="text-sm text-gray-700 font-medium flex items-center gap-1">
                                    <Wifi className="w-4 h-4" /> Solo turnos online
                                </span>
                            </label>
                        </div>

                        {/* Search Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Main Search */}
                            <div className="md:col-span-12">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input 
                                        className="pl-10 h-12 text-lg" 
                                        placeholder="Ej. Institución, Nombre de Profesional" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="md:col-span-3">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                    <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger className="pl-10 h-12">
                                            <SelectValue placeholder="Ubicación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mendoza">Mendoza</SelectItem>
                                            <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                                            <SelectItem value="Online">Online</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <div className="relative">
                                    <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                    <Select value={specialty} onValueChange={setSpecialty}>
                                        <SelectTrigger className="pl-10 h-12">
                                            <SelectValue placeholder="Especialidad" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            <SelectItem value="all">Todas</SelectItem>
                                            {availableSpecialties.map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                    <Select value={insurance} onValueChange={setInsurance}>
                                        <SelectTrigger className="pl-10 h-12">
                                            <SelectValue placeholder="Obra Social" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Particular / Todas</SelectItem>
                                            {insurances.map(i => (
                                                <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <Button className="w-full h-12 text-lg font-bold bg-orange-500 hover:bg-orange-600 shadow-lg" onClick={handleSearch}>
                                    Encontrar <Search className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* How it works Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-12">¿Cómo usar CalMedic?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-gray-50 rounded-xl p-8 transition-transform hover:-translate-y-2 duration-300">
                            <div className="bg-gray-200 text-gray-600 font-bold text-xl w-12 h-12 flex items-center justify-center rounded-lg mb-6 mx-auto">1</div>
                            <div className="h-24 flex items-center justify-center mb-4 text-orange-500">
                                <Search className="w-16 h-16" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Filtrá y Encontrá</h3>
                            <p className="text-gray-600">Busca por nombre, especialidad u obra social. Filtra por ubicación y cercanía.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-gray-50 rounded-xl p-8 transition-transform hover:-translate-y-2 duration-300">
                            <div className="bg-gray-200 text-gray-600 font-bold text-xl w-12 h-12 flex items-center justify-center rounded-lg mb-6 mx-auto">2</div>
                            <div className="h-24 flex items-center justify-center mb-4 text-orange-500">
                                <Clock className="w-16 h-16" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Elegí un profesional</h3>
                            <p className="text-gray-600">Selecciona el horario que más te convenga de la agenda en tiempo real.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-gray-50 rounded-xl p-8 transition-transform hover:-translate-y-2 duration-300">
                            <div className="bg-gray-200 text-gray-600 font-bold text-xl w-12 h-12 flex items-center justify-center rounded-lg mb-6 mx-auto">3</div>
                            <div className="h-24 flex items-center justify-center mb-4 text-orange-500">
                                <Calendar className="w-16 h-16" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Reservá tu turno ideal!</h3>
                            <p className="text-gray-600">Confirma tus datos y recibe un recordatorio automático. ¡Sin llamadas!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* B2B / Institution Section */}
            <div className="bg-blue-900 py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-4">Agilizá las gestiones de Turnos en tu Institución médica</h2>
                        <p className="text-blue-100 text-lg mb-6">
                            Tus pacientes necesitan rapidez y soluciones. Ofrecele Turnos Online con nuestra plataforma que permite:
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2"><ArrowRight className="text-orange-400" /> Solicitud de turnos las 24hs</li>
                            <li className="flex items-center gap-2"><ArrowRight className="text-orange-400" /> Recordatorios automáticos por WhatsApp</li>
                            <li className="flex items-center gap-2"><ArrowRight className="text-orange-400" /> Historia Clínica Digital Integrada</li>
                        </ul>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-8 text-lg rounded-lg shadow-lg">
                            Quiero registrar mi institución
                        </Button>
                    </div>
                    
                    {/* Placeholder for Illustration */}
                    <div className="md:w-1/2 flex justify-center">
                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 w-full max-w-md">
                            <div className="aspect-video bg-blue-800/50 rounded-lg flex items-center justify-center">
                                <Building2 className="w-20 h-20 text-blue-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm">
                <p>&copy; 2026 CalMedic. Todos los derechos reservados.</p>
                <div className="flex justify-center gap-4 mt-4">
                    <a href="#" className="hover:text-white">Términos y Condiciones</a>
                    <a href="#" className="hover:text-white">Privacidad</a>
                    <a href="#" className="hover:text-white">Ayuda</a>
                </div>
            </footer>
        </div>
    );
};

export default PublicHome;
