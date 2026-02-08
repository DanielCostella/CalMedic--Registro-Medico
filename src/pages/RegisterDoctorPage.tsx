import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Added Tabs
import { User, Stethoscope, Mail, Lock, FileText, Phone, MapPin, CreditCard, Scissors, Sparkles } from 'lucide-react'; // Added icons
import { authService } from '@/services/authService';
import { RegisterDoctorData, ProfessionCategory } from '@/types/user';

const RegisterDoctorPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('auth');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<RegisterDoctorData>({
        firstNames: '',
        lastNames: '',
        email: '',
        password: '',
        idType: 'DNI',
        nationalId: '',
        mobilePhone: '',
        address: '',
        birthDate: '',
        gender: 'Male',
        birthPlace: '',
        specialty: 'General Medicine',
        medicalLicenseNumber: '',
        consultationFee: 0,
        degreeUniversity: '',
        graduationYear: new Date().getFullYear(),
        yearsExperience: 0,
        office: '',
        professionCategory: 'Medical' // Default
    });

    const [selectedRole, setSelectedRole] = useState<ProfessionCategory | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'consultationFee' || name === 'yearsExperience' || name === 'graduationYear') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.email || !formData.password || !formData.firstNames || !formData.lastNames) {
                throw new Error('Please fill in all required fields');
            }

            if (formData.professionCategory === 'Medical') {
                if (!formData.medicalLicenseNumber || !formData.degreeUniversity) {
                    throw new Error('Medical professionals must provide License Number and University');
                }
            }

            const response = await authService.registerDoctor(formData);

            if (response.success) {
                alert('Registro exitoso! Tu cuenta está en revisión. Te notificaremos cuando sea aprobada.');
                navigate('/');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getProfessionIcon = () => {
        switch (formData.professionCategory) {
            case 'Aesthetic': return <Sparkles className="w-10 h-10 text-pink-500" />;
            case 'Beauty': return <Scissors className="w-10 h-10 text-purple-600" />;
            default: return <Stethoscope className="w-10 h-10 text-blue-600" />;
        }
    };

    // Initial Selection View
    if (!selectedRole) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Únete a CalMedic</h1>
                        <p className="text-lg text-slate-600">Selecciona tu perfil profesional para comenzar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Medical Card */}
                        <Card
                            className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-blue-100 hover:border-blue-400 group"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, professionCategory: 'Medical', specialty: 'General Medicine' }));
                                setSelectedRole('Medical');
                            }}
                        >
                            <CardContent className="p-8 text-center flex flex-col items-center h-full justify-center space-y-4">
                                <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                    <Stethoscope className="w-12 h-12 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Médico / Clínica</h3>
                                    <p className="text-sm text-slate-500 mt-2">Para doctores, especialistas y centros de salud.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Aesthetic Card */}
                        <Card
                            className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-pink-100 hover:border-pink-400 group"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, professionCategory: 'Aesthetic', specialty: '' }));
                                setSelectedRole('Aesthetic');
                            }}
                        >
                            <CardContent className="p-8 text-center flex flex-col items-center h-full justify-center space-y-4">
                                <div className="p-4 bg-pink-50 rounded-full group-hover:bg-pink-100 transition-colors">
                                    <Sparkles className="w-12 h-12 text-pink-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Centro de Estética</h3>
                                    <p className="text-sm text-slate-500 mt-2">Tratamientos faciales, corporales y aparatología.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Beauty Card */}
                        <Card
                            className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-purple-100 hover:border-purple-400 group"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, professionCategory: 'Beauty', specialty: '' }));
                                setSelectedRole('Beauty');
                            }}
                        >
                            <CardContent className="p-8 text-center flex flex-col items-center h-full justify-center space-y-4">
                                <div className="p-4 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors">
                                    <Scissors className="w-12 h-12 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Salón de Belleza</h3>
                                    <p className="text-sm text-slate-500 mt-2">Peluquería, uñas, maquillaje y spa.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Link removed as requested */}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader className="text-center relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0"
                        onClick={() => setSelectedRole(null)}
                    >
                        ← Volver
                    </Button>
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-3 rounded-full shadow-sm border">
                            {getProfessionIcon()}
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold text-gray-900">
                        Registro {selectedRole === 'Medical' ? 'Profesional Médico' : (selectedRole === 'Aesthetic' ? 'Centro Estético' : 'Salón de Belleza')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {/* HIDDEN TABS - Logic is now in Step 1 Selection */}
                        {/* <div className="bg-slate-100 p-1 rounded-lg mb-6"> <Tabs ... /> </div> */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info - Always Visible */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                                {/* Common fields for all */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Names</label>
                                    <Input name="firstNames" value={formData.firstNames} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Names</label>
                                    <Input name="lastNames" value={formData.lastNames} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ID Type</label>
                                    <Select onValueChange={(val) => handleSelectChange('idType', val)} defaultValue={formData.idType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select ID Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DNI">DNI</SelectItem>
                                            <SelectItem value="Passport">Passport</SelectItem>
                                            <SelectItem value="License">License</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">National ID</label>
                                    <Input name="nationalId" value={formData.nationalId} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                                    <Input name="mobilePhone" value={formData.mobilePhone} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Your Email (Login)</label>
                                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Create Password</label>
                                    <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                                </div>
                            </div>

                            {/* Professional Info - DYNAMIC */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Professional Details</h3>

                                {/* MEDICAL FORM */}
                                {formData.professionCategory === 'Medical' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-2">
                                            Medical professionals require license verification.
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Medical Specialty</label>
                                            <Select onValueChange={(val) => handleSelectChange('specialty', val)} defaultValue={formData.specialty}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Specialty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                                                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Medical License Number *</label>
                                            <Input
                                                name="medicalLicenseNumber"
                                                value={formData.medicalLicenseNumber}
                                                onChange={handleChange}
                                                required
                                                placeholder="Required"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">University / Degree</label>
                                            <Input name="degreeUniversity" value={formData.degreeUniversity} onChange={handleChange} required />
                                        </div>
                                    </div>
                                )}

                                {/* AESTHETIC FORM */}
                                {formData.professionCategory === 'Aesthetic' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="bg-pink-50 p-3 rounded-md text-sm text-pink-700 mb-2">
                                            Focus on treatments and certifications.
                                        </div>
                                        {/* REMOVED SINGLE SELECT PRIMARY FOCUS - Use Services Multi-select below instead */}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                                            <Input
                                                type="number"
                                                name="yearsExperience"
                                                value={formData.yearsExperience}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Certifications (Comma separated)</label>
                                            <Input
                                                name="degreeUniversity"
                                                value={formData.degreeUniversity}
                                                onChange={handleChange}
                                                placeholder="e.g. Laser Tech, cosmetologist..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* BEAUTY FORM */}
                                {formData.professionCategory === 'Beauty' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="bg-purple-50 p-3 rounded-md text-sm text-purple-700 mb-2">
                                            Register your salon or freelance profile.
                                        </div>
                                        {/* REMOVED SINGLE SELECT SERVICE TYPE - Use Services Multi-select below instead */}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Salon Name (or Freelance)</label>
                                            <Input
                                                name="office"
                                                value={formData.office}
                                                onChange={handleChange}
                                                placeholder="My Beauty Salon"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {formData.professionCategory === 'Medical' ? 'Specialty' : 'Services Offered (Select multiple or add custom)'}
                                    </label>

                                    {formData.professionCategory === 'Medical' ? (
                                        <Select onValueChange={(val) => handleSelectChange('specialty', val)} value={formData.specialty}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Specialty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General Medicine">General Medicine</SelectItem>
                                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                <SelectItem value="Dentistry">Dentistry</SelectItem>
                                                <SelectItem value="Dermatology">Dermatology</SelectItem>
                                                <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                                                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Predefined Options based on Category */}
                                            <div className="flex flex-wrap gap-2">
                                                {(formData.professionCategory === 'Aesthetic' ? [
                                                    "Facial Treatments", "Body Contouring", "Laser Therapy", "Injectables", "Dermatology", "Massages"
                                                ] : [
                                                    "Hair Styling", "Barber", "Coloring", "Nail Art", "Makeup", "Manicure", "Pedicure"
                                                ]).map((option) => (
                                                    <Button
                                                        key={option}
                                                        type="button"
                                                        variant={formData.specialty.includes(option) ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            const current = formData.specialty ? formData.specialty.split(', ').filter(Boolean) : [];
                                                            let updated;
                                                            if (current.includes(option)) {
                                                                updated = current.filter(s => s !== option);
                                                            } else {
                                                                updated = [...current, option];
                                                            }
                                                            handleSelectChange('specialty', updated.join(', '));
                                                        }}
                                                        className={`text-xs ${formData.specialty.includes(option) ? 'bg-pink-600 hover:bg-pink-700 text-white' : ''}`}
                                                    >
                                                        {option}
                                                    </Button>
                                                ))}
                                            </div>

                                            {/* Custom Input */}
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Add custom service (e.g. Microblading)..."
                                                    id="custom-service-input"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = e.currentTarget.value.trim();
                                                            if (val) {
                                                                const current = formData.specialty ? formData.specialty.split(', ').filter(Boolean) : [];
                                                                if (!current.includes(val)) {
                                                                    handleSelectChange('specialty', [...current, val].join(', '));
                                                                }
                                                                e.currentTarget.value = '';
                                                            }
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        const input = document.getElementById('custom-service-input') as HTMLInputElement;
                                                        const val = input.value.trim();
                                                        if (val) {
                                                            const current = formData.specialty ? formData.specialty.split(', ').filter(Boolean) : [];
                                                            if (!current.includes(val)) {
                                                                handleSelectChange('specialty', [...current, val].join(', '));
                                                            }
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </div>

                                            {/* Selected Display */}
                                            {formData.specialty && (
                                                <div className="p-3 bg-gray-50 rounded-md border text-sm">
                                                    <span className="font-medium text-gray-700">Selected Services:</span>
                                                    <p className="text-gray-600 mt-1">{formData.specialty}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Common Footer Fields */}
                                <div className="pt-4 border-t mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Standard Consultation/Service Fee</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                                        <Input
                                            type="number"
                                            className="pl-7"
                                            name="consultationFee"
                                            value={formData.consultationFee}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <Button type="button" variant="ghost" onClick={() => navigate('/login')}>
                                Back to Login
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[150px]">
                                {loading ? 'Creating Account...' : 'Register Doctor'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterDoctorPage;
