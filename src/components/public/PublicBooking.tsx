import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar'; // Ensure you have this or use input type date
import { publicService } from '@/services/publicService';
import { Doctor } from '@/types/medical';
import { Calendar as CalendarIcon, User, Clock, CheckCircle } from 'lucide-react';

const PublicBooking = () => {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [specialty, setSpecialty] = useState<'Medical' | 'Aesthetic' | 'Beauty'>('Medical'); // Default to Medical to be safer with search
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    
    // Search & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [date, setDate] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    
    // Insurance State
    const [insurances, setInsurances] = useState<{ id: string, name: string }[]>([]);
    const [selectedInsurance, setSelectedInsurance] = useState<string>('all');

    const [guestDetails, setGuestDetails] = useState({
        name: '',
        dni: '',
        phone: '',
        email: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Initialize from URL Params
    useEffect(() => {
        const q = searchParams.get('q');
        const s = searchParams.get('specialties');
        const i = searchParams.get('insurance');

        if (s && s !== 'all') {
            // Map known specialties or just default to Medical for now
            // Future: if functionality expands, map 'Botox' to Aesthetic, etc.
            setSpecialty('Medical'); 
            // If no explicit search term, use the specialty as the search term
            if (!q) {
                setSearchTerm(s);
            }
        }
        
        if (q) {
            setSearchTerm(q);
        }

        if (i && i !== 'all') {
            setSelectedInsurance(i);
        }
    }, [searchParams]);

    // Initial Load (Insurances)
    useEffect(() => {
        const loadInsurances = async () => {
             try {
                 const list = await publicService.getInsuranceProviders();
                 setInsurances(list);
             } catch (e) {
                 console.error("Failed to load insurances", e);
             }
        }
        loadInsurances();
    }, []);

    // Load Doctors on Mount or when specialty changes
    useEffect(() => {
        const loadDoctors = async () => {
            try {
                console.log('Loading doctors for specialty:', specialty);
                const docs = await publicService.getDoctorsBySpecialty(specialty);
                console.log('Doctors loaded:', docs);
                setDoctors(docs);
                setFilteredDoctors(docs);
                // Reset selection when changing specialty
                setSelectedDoctor(null);
                setCurrentPage(1);
            } catch (e) {
                console.error('Error loading doctors:', e);
            }
        };
        loadDoctors();
    }, [specialty]);

    // Filter Doctors when Insurance, List or Search Term changes
    useEffect(() => {
        let result = doctors;

        // 1. Filter by Insurance
        if (selectedInsurance !== 'all') {
            result = result.filter(doc => 
                doc.insuranceProviders?.includes(selectedInsurance) || 
                (selectedInsurance === 'Particular' && (!doc.insuranceProviders || doc.insuranceProviders.length === 0))
            );
        }

        // 2. Filter by Search Term (Name or Specialty)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(doc => 
                doc.firstName.toLowerCase().includes(lowerTerm) ||
                doc.lastName.toLowerCase().includes(lowerTerm) ||
                doc.specialty.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredDoctors(result);
        setCurrentPage(1); // Reset page on filter change
    }, [selectedInsurance, doctors, searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
    const paginatedDoctors = filteredDoctors.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Load Slots when Date/Doctor changes
    useEffect(() => {
        if (selectedDoctor && date) {
            const loadSlots = async () => {
                setLoading(true);
                try {
                    const slots = await publicService.getAvailableSlots(selectedDoctor.id, date);
                    setAvailableSlots(slots);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            loadSlots();
        }
    }, [selectedDoctor, date]);

    const handleBooking = async () => {
        if (!guestDetails.name || !guestDetails.dni || !guestDetails.phone) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        setLoading(true);
        try {
            const result = await publicService.bookGuestAppointment(guestDetails, {
                doctorId: selectedDoctor!.id,
                date: date,
                time: selectedSlot,
                reason: `${specialty} Consultation (Web Booking)`
            });

            if (result.success) {
                setSuccess(true);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (e) {
            alert('Error en la reserva.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8 shadow-2xl">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">¡Reserva Confirmada!</h2>
                    <p className="text-gray-600 mb-6">Te esperamos el {date} a las {selectedSlot}.</p>
                    <Button onClick={() => window.location.reload()} className="w-full">Volver al Inicio</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full shadow-xl">
                <CardHeader className="bg-white border-b">
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                        <CalendarIcon className="w-6 h-6" />
                        Reserva tu Turno Online
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {/* Step Progress */}
                    <div className="flex justify-center mb-8 text-sm">
                        <div className={`px-4 py-2 rounded-full ${step >= 1 ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-400'}`}>1. Profesional</div>
                        <div className="w-8 h-px bg-gray-300 self-center mx-2"></div>
                        <div className={`px-4 py-2 rounded-full ${step >= 2 ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-400'}`}>2. Fecha y Hora</div>
                        <div className="w-8 h-px bg-gray-300 self-center mx-2"></div>
                        <div className={`px-4 py-2 rounded-full ${step >= 3 ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-400'}`}>3. Tus Datos</div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <Label className="mb-2 block">Tipo de Servicio</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    <Button
                                        variant={specialty === 'Medical' ? 'default' : 'outline'}
                                        onClick={() => setSpecialty('Medical')}
                                        className={`h-20 flex flex-col items-center justify-center ${specialty === 'Medical' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                                    >
                                        <span className="text-2xl mb-1">🩺</span>
                                        <span>Médico</span>
                                    </Button>
                                    <Button
                                        variant={specialty === 'Aesthetic' ? 'default' : 'outline'}
                                        onClick={() => setSpecialty('Aesthetic')}
                                        className={`h-20 flex flex-col items-center justify-center ${specialty === 'Aesthetic' ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
                                    >
                                        <span className="text-2xl mb-1">💆‍♀️</span>
                                        <span>Estética</span>
                                    </Button>
                                    <Button
                                        variant={specialty === 'Beauty' ? 'default' : 'outline'}
                                        onClick={() => setSpecialty('Beauty')}
                                        className={`h-20 flex flex-col items-center justify-center ${specialty === 'Beauty' ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                                    >
                                        <span className="text-2xl mb-1">💇‍♀️</span>
                                        <span>Belleza</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Insurance Filter - Only for Medical */}
                            {specialty === 'Medical' && (
                                <div>
                                    <Label className="mb-2 block">Obra Social / Prepaga</Label>
                                    <select 
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedInsurance}
                                        onChange={(e) => setSelectedInsurance(e.target.value)}
                                    >
                                        <option value="all">Todas</option>
                                        {insurances.map(ins => (
                                            <option key={ins.id} value={ins.name}>{ins.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Search Input */}
                            <div>
                                <Label className="mb-2 block">Buscar Profesional</Label>
                                <Input 
                                    placeholder="Nombre, Apellido o Especialidad..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block">Seleccionar Profesional ({filteredDoctors.length} encontrados)</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paginatedDoctors.length === 0 ? (
                                        <div className="col-span-2 text-center py-8 text-gray-500">
                                            No se encontraron especialistas{specialty === 'Medical' ? ' con los filtros seleccionados' : ''}.
                                        </div>
                                    ) : (
                                        paginatedDoctors.map(doc => (
                                            <div
                                                key={doc.id}
                                                onClick={() => setSelectedDoctor(doc)}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedDoctor?.id === doc.id ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' : 'hover:border-purple-300 hover:bg-gray-50'}`}
                                            >
                                                <div className="font-bold">{doc.firstName} {doc.lastName}</div>
                                                <div className="text-sm text-gray-500">{doc.specialty}</div>
                                                
                                                {/* Only show insurance badges for Medical */}
                                                {specialty === 'Medical' && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {doc.insuranceProviders && doc.insuranceProviders.length > 0 ? (
                                                            doc.insuranceProviders.slice(0, 3).map((prov, i) => (
                                                                <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                    {prov}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Particular</span>
                                                        )}
                                                        {doc.insuranceProviders && doc.insuranceProviders.length > 3 && (
                                                            <span className="text-xs text-gray-500">+{doc.insuranceProviders.length - 3}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-6">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                        >
                                            Anterior
                                        </Button>
                                        <span className="self-center text-sm text-gray-600">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button disabled={!selectedDoctor} onClick={() => setStep(2)}>Siguiente</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <Label>Selecciona una Fecha</Label>
                                    <Input
                                        type="date"
                                        className="mt-2"
                                        min={new Date().toISOString().split('T')[0]} // Disable past dates
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Horarios Disponibles ({date || 'Selecciona fecha'})</Label>
                                    {loading && <div className="text-sm text-gray-500 mt-2">Buscando horarios...</div>}
                                    {!date && <div className="text-sm text-gray-400 mt-2 italic">Elige una fecha primero</div>}

                                    {date && !loading && availableSlots.length === 0 && (
                                        <div className="text-red-500 text-sm mt-2">No hay turnos disponibles para esta fecha.</div>
                                    )}

                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {availableSlots.map(slot => (
                                            <Button
                                                key={slot}
                                                variant={selectedSlot === slot ? 'default' : 'outline'}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`text-sm ${selectedSlot === slot ? 'bg-purple-600' : ''}`}
                                            >
                                                {slot}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <Button variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
                                <Button disabled={!date || !selectedSlot} onClick={() => setStep(3)}>Siguiente</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 max-w-md mx-auto">
                            <h3 className="font-semibold text-lg text-center text-gray-700">Completa tus datos para confirmar</h3>

                            <div>
                                <Label>Nombre Completo</Label>
                                <Input value={guestDetails.name} onChange={e => setGuestDetails({ ...guestDetails, name: e.target.value })} placeholder="Ej: Maria Perez" />
                            </div>

                            <div>
                                <Label>DNI (Identificación)</Label>
                                <Input value={guestDetails.dni} onChange={e => setGuestDetails({ ...guestDetails, dni: e.target.value })} placeholder="Sin puntos" type="number" />
                                <p className="text-xs text-gray-500 mt-1">Lo usamos para identificar tu historia clínica.</p>
                            </div>

                            <div>
                                <Label>Teléfono / WhatsApp</Label>
                                <Input value={guestDetails.phone} onChange={e => setGuestDetails({ ...guestDetails, phone: e.target.value })} placeholder="+54 9..." />
                            </div>

                            <div>
                                <Label>Email (Opcional)</Label>
                                <Input type="email" value={guestDetails.email} onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })} />
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg mt-4 text-sm">
                                <p><strong>Resumen del Turno:</strong></p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><strong>Profesional:</strong> {selectedDoctor?.firstName} {selectedDoctor?.lastName}</li>
                                    <li><strong>Fecha:</strong> {date} a las {selectedSlot} hs</li>
                                    <li><strong>Duración:</strong> 60 minutos</li>
                                </ul>
                            </div>

                            <div className="flex justify-between mt-8">
                                <Button variant="ghost" onClick={() => setStep(2)}>Atrás</Button>
                                <Button onClick={handleBooking} disabled={loading} className="bg-purple-600 hover:bg-purple-700 w-1/2">
                                    {loading ? 'Confirmando...' : 'Confirmar Reserva'}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PublicBooking;
