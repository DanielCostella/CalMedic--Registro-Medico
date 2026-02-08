import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Eye, EyeOff, Plus, X, Stethoscope, GraduationCap, Building, Clock } from 'lucide-react';
import { DoctorData, MEDICAL_SPECIALTIES, MEDICAL_INSURANCES } from '@/types/doctor';
import { calculateAge, validatePassword, validateEmail, validateNationalId, validatePhone } from '@/utils/validation';

interface CreateDoctorFormProps {
    onDoctorCreated: (doctor: DoctorData) => void;
    onCancel: () => void;
}

export default function CreateDoctorForm({ onDoctorCreated, onCancel }: CreateDoctorFormProps) {
    const [formData, setFormData] = useState<DoctorData>({
        // Personal data
        idType: 'V',
        nationalId: '',
        firstNames: '',
        lastNames: '',
        birthDate: '',
        gender: 'Female',
        mobilePhone: '',
        email: '',
        address: '',
        birthPlace: '',
        password: '',

        // Professional data
        medicalLicenseNumber: '',
        specialty: '',
        subspecialty: '',
        degreeUniversity: '',
        graduationYear: new Date().getFullYear() - 5,
        yearsExperience: 0,
        office: '',
        consultationHours: '',
        consultationFee: 0,
        languages: ['English'],
        certifications: [],

        // Additional data
        hospitalAffiliation: '',
        acceptedInsurances: [],
        officePhone: '',
        officeAddress: '',

        // Professional status
        licenseStatus: 'Active',
        licenseExpiryDate: ''
    });

    const [age, setAge] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [newLanguage, setNewLanguage] = useState('');
    const [newCertification, setNewCertification] = useState('');

    const selectedSpecialty = MEDICAL_SPECIALTIES.find(esp => esp.id === formData.specialty);

    useEffect(() => {
        if (formData.birthDate) {
            const calculatedAge = calculateAge(formData.birthDate);
            setAge(calculatedAge);
        }
    }, [formData.birthDate]);

    const validateField = (field: string, value: string | number): string => {
        switch (field) {
            case 'nationalId': {
                return !validateNationalId(value as string) ? 'National ID must have a maximum of 9 digits' : '';
            }
            case 'email': {
                return !validateEmail(value as string) ? 'Invalid email address' : '';
            }
            case 'mobilePhone': {
                return !validatePhone(value as string) ? 'Phone number must have exactly 10 digits' : '';
            }
            case 'password': {
                const passwordValidation = validatePassword(value as string);
                return !passwordValidation.isValid ? passwordValidation.message : '';
            }
            case 'medicalLicenseNumber': {
                return !/^\d{4,8}$/.test(value as string) ? 'Medical license number must have between 4 and 8 digits' : '';
            }
            case 'graduationYear': {
                const currentYear = new Date().getFullYear();
                const year = value as number;
                return (year < 1950 || year > currentYear) ? `Year must be between 1950 and ${currentYear}` : '';
            }
            default:
                return '';
        }
    };

    const handleInputChange = (field: keyof DoctorData, value: string | number | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (typeof value === 'string' || typeof value === 'number') {
            const fieldError = validateField(field, value);
            setFieldErrors(prev => ({ ...prev, [field]: fieldError }));
        }

        if (error) setError('');
    };

    const addLanguage = () => {
        if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
            handleInputChange('languages', [...formData.languages, newLanguage.trim()]);
            setNewLanguage('');
        }
    };

    const removeLanguage = (language: string) => {
        handleInputChange('languages', formData.languages.filter(i => i !== language));
    };

    const addCertification = () => {
        if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
            handleInputChange('certifications', [...formData.certifications, newCertification.trim()]);
            setNewCertification('');
        }
    };

    const removeCertification = (cert: string) => {
        handleInputChange('certifications', formData.certifications.filter(c => c !== cert));
    };

    const handleInsuranceChange = (insuranceId: string, checked: boolean) => {
        if (checked) {
            handleInputChange('acceptedInsurances', [...formData.acceptedInsurances, insuranceId]);
        } else {
            handleInputChange('acceptedInsurances', formData.acceptedInsurances.filter(s => s !== insuranceId));
        }
    };

    const validateStep = (step: number): boolean => {
        const errors: Record<string, string> = {};

        if (step === 1) {
            // Validate personal data
            if (!formData.nationalId) errors.nationalId = 'National ID is required';
            if (!formData.firstNames) errors.firstNames = 'First names are required';
            if (!formData.lastNames) errors.lastNames = 'Last names are required';
            if (!formData.birthDate) errors.birthDate = 'Birth date is required';
            if (!formData.mobilePhone) errors.mobilePhone = 'Mobile phone is required';
            if (!formData.email) errors.email = 'Email is required';
            if (!formData.password) errors.password = 'Password is required';

            if (age < 25) errors.age = 'The doctor must be at least 25 years old';
        } else if (step === 2) {
            // Validate professional data
            if (!formData.medicalLicenseNumber) errors.medicalLicenseNumber = 'Medical license number is required';
            if (!formData.specialty) errors.specialty = 'Specialty is required';
            if (!formData.degreeUniversity) errors.degreeUniversity = 'Degree university is required';
            if (!formData.licenseExpiryDate) errors.licenseExpiryDate = 'License expiry date is required';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(1) || !validateStep(2)) {
            setError('Please complete all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Simulate doctor creation
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Calculate experience based on graduation year
            const calculatedExperience = new Date().getFullYear() - formData.graduationYear;

            const completeDoctor: DoctorData = {
                ...formData,
                yearsExperience: Math.max(0, calculatedExperience)
            };

            onDoctorCreated(completeDoctor);
        } catch (err) {
            setError('Error creating the doctor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <Card className="w-full max-w-4xl shadow-xl border-0 bg-white/95 backdrop-blur">
                <CardHeader className="text-center space-y-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="absolute left-4 top-4 text-slate-600 hover:text-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>

                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                        <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">Register New Doctor</CardTitle>
                    <CardDescription className="text-slate-600">
                        Complete the doctor's professional and personal information
                    </CardDescription>

                    {/* Step indicator */}
                    <div className="flex justify-center space-x-4 mt-4">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`flex items-center space-x-2 ${step <= currentStep ? 'text-blue-600' : 'text-slate-400'
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-200 text-slate-500'
                                        }`}
                                >
                                    {step}
                                </div>
                                <span className="text-sm font-medium">
                                    {step === 1 && 'Personal Data'}
                                    {step === 2 && 'Professional Information'}
                                    {step === 3 && 'Practice Setup'}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-700">{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Step 1: Personal Data */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 font-bold">1</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
                                </div>

                                {/* ID Type and National ID */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700">ID Prefix</Label>
                                        <Select value={formData.idType} onValueChange={(value: 'V' | 'E' | 'J' | 'P' | 'G' | 'M') => handleInputChange('idType', value)}>
                                            <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="V">V</SelectItem>
                                                <SelectItem value="E">E</SelectItem>
                                                <SelectItem value="J">J</SelectItem>
                                                <SelectItem value="P">P</SelectItem>
                                                <SelectItem value="G">G</SelectItem>
                                                <SelectItem value="M">M</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="nationalId" className="text-slate-700">National ID *</Label>
                                        <Input
                                            id="nationalId"
                                            type="text"
                                            placeholder="12345678"
                                            maxLength={9}
                                            value={formData.nationalId}
                                            onChange={(e) => handleInputChange('nationalId', e.target.value.replace(/\D/g, ''))}
                                            className={`border-slate-200 focus:border-blue-500 ${fieldErrors.nationalId ? 'border-red-300' : ''}`}
                                            required
                                        />
                                        {fieldErrors.nationalId && <p className="text-sm text-red-600">{fieldErrors.nationalId}</p>}
                                    </div>
                                </div>

                                {/* Names and Surnames */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstNames" className="text-slate-700">First Names *</Label>
                                        <Input
                                            id="firstNames"
                                            type="text"
                                            placeholder="Dr. John Carlos"
                                            value={formData.firstNames}
                                            onChange={(e) => handleInputChange('firstNames', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors.firstNames && <p className="text-sm text-red-600">{fieldErrors.firstNames}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastNames" className="text-slate-700">Last Names *</Label>
                                        <Input
                                            id="lastNames"
                                            type="text"
                                            placeholder="Perez Garcia"
                                            value={formData.lastNames}
                                            onChange={(e) => handleInputChange('lastNames', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors.lastNames && <p className="text-sm text-red-600">{fieldErrors.lastNames}</p>}
                                    </div>
                                </div>

                                {/* Birth Date, Age and Gender */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="birthDate" className="text-slate-700">Birth Date *</Label>
                                        <Input
                                            id="birthDate"
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors.birthDate && <p className="text-sm text-red-600">{fieldErrors.birthDate}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Age</Label>
                                        <Input
                                            type="text"
                                            value={age > 0 ? `${age} years` : ''}
                                            readOnly
                                            className={`border-slate-200 bg-slate-50 ${age < 25 ? 'border-red-300 bg-red-50' : ''}`}
                                        />
                                        {age > 0 && age < 25 && (
                                            <p className="text-sm text-red-600">Must be at least 25 years old</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Gender</Label>
                                        <Select value={formData.gender} onValueChange={(value: 'Female' | 'Male') => handleInputChange('gender', value)}>
                                            <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Male">Male</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="mobilePhone" className="text-slate-700">Mobile Phone *</Label>
                                        <Input
                                            id="mobilePhone"
                                            type="text"
                                            placeholder="4141234567"
                                            maxLength={10}
                                            value={formData.mobilePhone}
                                            onChange={(e) => handleInputChange('mobilePhone', e.target.value.replace(/\D/g, ''))}
                                            className={`border-slate-200 focus:border-blue-500 ${fieldErrors.mobilePhone ? 'border-red-300' : ''}`}
                                            required
                                        />
                                        {fieldErrors.mobilePhone && <p className="text-sm text-red-600">{fieldErrors.mobilePhone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="doctor@example.com"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={`border-slate-200 focus:border-blue-500 ${fieldErrors.email ? 'border-red-300' : ''}`}
                                            required
                                        />
                                        {fieldErrors.email && <p className="text-sm text-red-600">{fieldErrors.email}</p>}
                                    </div>
                                </div>

                                {/* Address and Birth Place */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-slate-700">Residential Address</Label>
                                        <Textarea
                                            id="address"
                                            placeholder="Main Ave, Building..., Floor..., Apartment..."
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500 min-h-[80px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birthPlace" className="text-slate-700">Birth Place</Label>
                                        <Input
                                            id="birthPlace"
                                            type="text"
                                            placeholder="Caracas, Venezuela"
                                            value={formData.birthPlace}
                                            onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-700">Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Min 8 characters, 1 uppercase, 1 number"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className={`border-slate-200 focus:border-blue-500 pr-10 ${fieldErrors.password ? 'border-red-300' : ''}`}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            )}
                                        </Button>
                                    </div>
                                    {fieldErrors.password && <p className="text-sm text-red-600">{fieldErrors.password}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Professional Information */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <GraduationCap className="h-4 w-4 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800">Professional Information</h3>
                                </div>

                                {/* License Number and Specialty */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="medicalLicenseNumber" className="text-slate-700">Medical License Number *</Label>
                                        <Input
                                            id="medicalLicenseNumber"
                                            type="text"
                                            placeholder="12345"
                                            value={formData.medicalLicenseNumber}
                                            onChange={(e) => handleInputChange('medicalLicenseNumber', e.target.value.replace(/\D/g, ''))}
                                            className={`border-slate-200 focus:border-blue-500 ${fieldErrors.medicalLicenseNumber ? 'border-red-300' : ''}`}
                                            required
                                        />
                                        {fieldErrors.medicalLicenseNumber && <p className="text-sm text-red-600">{fieldErrors.medicalLicenseNumber}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Medical Specialty *</Label>
                                        <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                                            <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                                <SelectValue placeholder="Select specialty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MEDICAL_SPECIALTIES.map((esp) => (
                                                    <SelectItem key={esp.id} value={esp.id}>
                                                        {esp.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldErrors.specialty && <p className="text-sm text-red-600">{fieldErrors.specialty}</p>}
                                    </div>
                                </div>

                                {/* Subspecialty */}
                                {selectedSpecialty?.subspecialties && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Subspecialty (Optional)</Label>
                                        <Select value={formData.subspecialty || 'none'} onValueChange={(value) => handleInputChange('subspecialty', value === 'none' ? '' : value)}>
                                            <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                                <SelectValue placeholder="Select subspecialty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No subspecialty</SelectItem>
                                                {selectedSpecialty.subspecialties.map((sub) => (
                                                    <SelectItem key={sub} value={sub}>
                                                        {sub}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* University and Graduation Year */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="degreeUniversity" className="text-slate-700">Degree University *</Label>
                                        <Input
                                            id="degreeUniversity"
                                            type="text"
                                            placeholder="University of California"
                                            value={formData.degreeUniversity}
                                            onChange={(e) => handleInputChange('degreeUniversity', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors.degreeUniversity && <p className="text-sm text-red-600">{fieldErrors.degreeUniversity}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="graduationYear" className="text-slate-700">Graduation Year</Label>
                                        <Input
                                            id="graduationYear"
                                            type="number"
                                            min="1950"
                                            max={new Date().getFullYear()}
                                            value={formData.graduationYear}
                                            onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                        {fieldErrors.graduationYear && <p className="text-sm text-red-600">{fieldErrors.graduationYear}</p>}
                                    </div>
                                </div>

                                {/* License Status and Expiry Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Medical License Status</Label>
                                        <Select value={formData.licenseStatus} onValueChange={(value: 'Active' | 'Suspended' | 'In Review') => handleInputChange('licenseStatus', value)}>
                                            <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="In Review">In Review</SelectItem>
                                                <SelectItem value="Suspended">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="licenseExpiryDate" className="text-slate-700">License Expiry *</Label>
                                        <Input
                                            id="licenseExpiryDate"
                                            type="date"
                                            value={formData.licenseExpiryDate}
                                            onChange={(e) => handleInputChange('licenseExpiryDate', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors.licenseExpiryDate && <p className="text-sm text-red-600">{fieldErrors.licenseExpiryDate}</p>}
                                    </div>
                                </div>

                                {/* Languages */}
                                <div className="space-y-2">
                                    <Label className="text-slate-700">Languages Spoken</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.languages.map((language) => (
                                            <Badge key={language} variant="secondary" className="flex items-center space-x-1">
                                                <span>{language}</span>
                                                {language !== 'English' && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-4 w-4 p-0 hover:bg-transparent"
                                                        onClick={() => removeLanguage(language)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="text"
                                            placeholder="Add language"
                                            value={newLanguage}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                                        />
                                        <Button type="button" onClick={addLanguage} variant="outline">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div className="space-y-2">
                                    <Label className="text-slate-700">Additional Certifications</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.certifications.map((cert) => (
                                            <Badge key={cert} variant="outline" className="flex items-center space-x-1">
                                                <span>{cert}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                                    onClick={() => removeCertification(cert)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="text"
                                            placeholder="Add certification"
                                            value={newCertification}
                                            onChange={(e) => setNewCertification(e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                                        />
                                        <Button type="button" onClick={addCertification} variant="outline">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Practice Setup */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Building className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800">Medical Practice Setup</h3>
                                </div>

                                {/* Office Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="office" className="text-slate-700">Office Name</Label>
                                        <Input
                                            id="office"
                                            type="text"
                                            placeholder="Comprehensive Medical Center"
                                            value={formData.office || ''}
                                            onChange={(e) => handleInputChange('office', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="officePhone" className="text-slate-700">Office Phone</Label>
                                        <Input
                                            id="officePhone"
                                            type="text"
                                            placeholder="02121234567"
                                            value={formData.officePhone || ''}
                                            onChange={(e) => handleInputChange('officePhone', e.target.value.replace(/\D/g, ''))}
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="officeAddress" className="text-slate-700">Office Address</Label>
                                    <Textarea
                                        id="officeAddress"
                                        placeholder="Main Ave, Shopping Center..., Floor..., Office..."
                                        value={formData.officeAddress || ''}
                                        onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                                        className="border-slate-200 focus:border-blue-500 min-h-[80px]"
                                    />
                                </div>

                                {/* Hours and Fee */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="consultationHours" className="text-slate-700">Consultation Hours</Label>
                                        <Input
                                            id="consultationHours"
                                            type="text"
                                            placeholder="Monday to Friday 8:00 AM - 6:00 PM"
                                            value={formData.consultationHours || ''}
                                            onChange={(e) => handleInputChange('consultationHours', e.target.value)}
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="consultationFee" className="text-slate-700">Consultation Fee (USD)</Label>
                                        <Input
                                            id="consultationFee"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="50.00"
                                            value={formData.consultationFee || ''}
                                            onChange={(e) => handleInputChange('consultationFee', parseFloat(e.target.value) || 0)}
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hospitalAffiliation" className="text-slate-700">Hospital Affiliation</Label>
                                    <Input
                                        id="hospitalAffiliation"
                                        type="text"
                                        placeholder="General University Hospital"
                                        value={formData.hospitalAffiliation || ''}
                                        onChange={(e) => handleInputChange('hospitalAffiliation', e.target.value)}
                                        className="border-slate-200 focus:border-blue-500"
                                    />
                                </div>

                                {/* Accepted Insurances */}
                                <div className="space-y-3">
                                    <Label className="text-slate-700">Accepted Medical Insurances</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {MEDICAL_INSURANCES.map((insurance) => (
                                            <div key={insurance.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={insurance.id}
                                                    checked={formData.acceptedInsurances.includes(insurance.id)}
                                                    onCheckedChange={(checked) => handleInsuranceChange(insurance.id, checked as boolean)}
                                                />
                                                <Label htmlFor={insurance.id} className="text-sm text-slate-700 cursor-pointer">
                                                    {insurance.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation buttons */}
                        <Separator />
                        <div className="flex justify-between">
                            {currentStep > 1 && (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>
                            )}

                            {currentStep < 3 ? (
                                <Button type="button" onClick={nextStep} className="ml-auto">
                                    Next
                                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={loading} className="ml-auto bg-green-600 hover:bg-green-700 text-white">
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Register Doctor
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
