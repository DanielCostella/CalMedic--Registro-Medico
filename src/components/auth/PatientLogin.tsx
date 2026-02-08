import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { HeartPulse, Lock, User } from 'lucide-react';

interface PatientLoginProps {
    onLoginSuccess: (patientData: any) => void;
}

const PatientLogin: React.FC<PatientLoginProps> = ({ onLoginSuccess }) => {
    const [dni, setDni] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni || !birthDate) {
            setError('Please enter both DNI and Date of Birth');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Check if patient exists with this DNI
            const trimmedDni = dni.trim();
            const trimmedBirthDate = birthDate.trim();

            console.log('Searching for patient:', { trimmedDni, trimmedBirthDate });

            const { data, error: dbError } = await supabase
                .from('patients')
                .select('*')
                .eq('national_id', trimmedDni) // Use exact match instead of ilike
                .maybeSingle();

            if (dbError) {
                console.error("Database error fetching patient:", dbError);
                setError('Error de conexión. Intente nuevamente.');
                setLoading(false);
                return;
            }

            if (!data) {
                console.warn("Patient not found for DNI:", trimmedDni);
                console.log("Tip: Check if the DNI in the database matches exactly (no spaces, same format)");
                setError('Paciente no encontrado. Verifique su DNI.');
                setLoading(false);
                return;
            }

            console.log('Patient found:', { id: data.id, name: `${data.first_name} ${data.last_name}`, birthDate: data.birth_date });

            // 2. Verify Birth Date (Simple Password)
            // Database format is YYYY-MM-DD. Input is YYYY-MM-DD.
            console.log('Comparing dates:', { dbDate: data.birth_date, inputDate: trimmedBirthDate });
            if (data.birth_date !== trimmedBirthDate) {
                setError('Fecha de nacimiento incorrecta. Verifique e intente nuevamente.');
                setLoading(false);
                return;
            }

            // 3. Success!
            toast.success(`Welcome back, ${data.first_name}!`);
            onLoginSuccess(data);

        } catch (err: any) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-teal-600">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                        <HeartPulse className="w-8 h-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Portal del Paciente</CardTitle>
                    <p className="text-gray-500 text-sm">Ingresa con tus datos para ver tu historial</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="dni">DNI / Documento</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="dni"
                                    type="text"
                                    placeholder="Sin puntos ni espacios"
                                    className="pl-10"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="birthDate"
                                    type="date"
                                    className="pl-10"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-gray-500">Esta es tu contraseña de acceso</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md animate-pulse">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" size="lg" disabled={loading}>
                            {loading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : 'Ingresar al Portal'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PatientLogin;
