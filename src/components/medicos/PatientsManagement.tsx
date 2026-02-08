import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, Calendar, AlertTriangle, FileText, User, Users, Heart, Pill, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { doctorService } from '@/services/doctorService';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    dateOfBirth: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    email: string;
    address: string;
    bloodType: string;
    maritalStatus: string;
    occupation: string;
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    allergies: string[];
    medicalConditions: string[];
    currentMedications: string[];
    insurance: {
        company: string;
        policyNumber: string;
        validUntil: string;
    };
    registrationDate: string;
    lastVisit: string;
    status: 'Active' | 'Inactive' | 'Deceased';
    notes: string;
}

interface PatientsManagementProps {
    doctorId?: string;
}

const PatientsManagement: React.FC<PatientsManagementProps> = ({ doctorId }) => {
    const { toast } = useToast();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewPatient, setShowNewPatient] = useState(false);
    const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [registrationType, setRegistrationType] = useState('patient');

    const [newPatient, setNewPatient] = useState<Omit<Patient, 'id' | 'age' | 'registrationDate' | 'lastVisit'>>({
        firstName: '',
        lastName: '',
        idNumber: '',
        dateOfBirth: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        bloodType: '',
        maritalStatus: '',
        occupation: '',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
        },
        allergies: [],
        medicalConditions: [],
        currentMedications: [],
        insurance: {
            company: '',
            policyNumber: '',
            validUntil: ''
        },
        status: 'Active',
        notes: ''
    });

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedPatients: Patient[] = data.map((p: any) => ({
                    id: p.id,
                    firstName: p.first_name,
                    lastName: p.last_name,
                    idNumber: p.national_id,
                    dateOfBirth: p.birth_date,
                    age: calculateAge(p.birth_date),
                    gender: p.gender,
                    phone: p.phone,
                    email: p.email,
                    address: p.address,
                    bloodType: p.blood_type || '',
                    maritalStatus: 'Single', // Default or fetch if added to DB
                    occupation: '', // Default or fetch if added to DB
                    emergencyContact: {
                        name: p.emergency_contact_name || '',
                        phone: p.emergency_contact_phone || '',
                        relationship: p.emergency_contact_relationship || ''
                    },
                    allergies: p.allergies || [],
                    medicalConditions: [], // Needs DB field
                    currentMedications: [], // Needs DB field
                    insurance: {
                        company: p.medical_insurance || '',
                        policyNumber: '', 
                        validUntil: ''
                    },
                    registrationDate: p.registration_date,
                    lastVisit: p.registration_date, // Placeholder
                    status: p.status,
                    notes: '' // Needs DB field
                }));
                setPatients(mappedPatients);
            }
        } catch (error: any) {
            console.error('Error fetching patients:', error);
            toast({
                title: "Error fetching patients",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        const generateId = async () => {
            if (showNewPatient && !editingPatientId) {
                const prefix = registrationType === 'patient' ? 'ID' : 'CLI';
                const nextId = await doctorService.getNextSequentialId(prefix);
                setNewPatient(prev => ({ ...prev, idNumber: nextId }));
            }
        };
        generateId();
    }, [showNewPatient, registrationType, editingPatientId]);

    const calculateAge = (dob: string): number => {
        if (!dob) return 0;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleCreatePatient = async () => {
        console.log("Intentando crear/actualizar paciente...", newPatient);

        try {
            if (!newPatient.firstName || !newPatient.lastName || !newPatient.idNumber) {
                toast({
                    title: "Missing fields",
                    description: "First name, Last Name and ID Number are required.",
                    variant: "destructive"
                });
                return;
            }

            const dbPatient = {
                first_name: newPatient.firstName,
                last_name: newPatient.lastName,
                national_id: newPatient.idNumber,
                birth_date: newPatient.dateOfBirth || null,
                gender: newPatient.gender,
                phone: newPatient.phone,
                email: newPatient.email,
                address: newPatient.address,
                blood_type: newPatient.bloodType,
                emergency_contact_name: newPatient.emergencyContact.name,
                emergency_contact_phone: newPatient.emergencyContact.phone,
                emergency_contact_relationship: newPatient.emergencyContact.relationship,
                medical_insurance: newPatient.insurance.company,
                allergies: newPatient.allergies,
                status: 'Active'
            };

            let error;
            
            if (editingPatientId) {
                // UPDATE
                 const { error: updateError } = await supabase
                    .from('patients')
                    .update(dbPatient)
                    .eq('id', editingPatientId);
                 error = updateError;
            } else {
                // CREATE
                const { error: insertError } = await supabase
                    .from('patients')
                    .insert([dbPatient]);
                error = insertError;
            }

            if (error) {
                console.error("ERROR SUPABASE:", error);
                throw error;
            }

            toast({
                title: "Success",
                description: editingPatientId ? "Patient updated successfully" : "Patient registered successfully",
            });
            
            setShowNewPatient(false);
            setEditingPatientId(null);
            resetForm();
            fetchPatients(); // Reload list

        } catch (error: any) {
            console.error('Error creating/updating patient:', error);
            toast({
                title: "Error",
                description: error.message || "Unknown database error",
                variant: "destructive"
            });
        }
    };

    const handleEditClick = (patient: Patient) => {
        setNewPatient({
            firstName: patient.firstName,
            lastName: patient.lastName,
            idNumber: patient.idNumber,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            bloodType: patient.bloodType,
            maritalStatus: patient.maritalStatus,
            occupation: patient.occupation,
            emergencyContact: patient.emergencyContact,
            allergies: patient.allergies,
            medicalConditions: patient.medicalConditions,
            currentMedications: patient.currentMedications,
            insurance: patient.insurance,
            status: patient.status,
            notes: patient.notes
        });
        setEditingPatientId(patient.id);
        setShowNewPatient(true);
    };

    const resetForm = () => {
        setEditingPatientId(null);
        setNewPatient({
            firstName: '',
            lastName: '',
            idNumber: '',
            dateOfBirth: '',
            gender: 'Male',
            phone: '',
            email: '',
            address: '',
            bloodType: '',
            maritalStatus: '',
            occupation: '',
            emergencyContact: {
                name: '',
                phone: '',
                relationship: ''
            },
            allergies: [],
            medicalConditions: [],
            currentMedications: [],
            insurance: {
                company: '',
                policyNumber: '',
                validUntil: ''
            },
            status: 'Active',
            notes: ''
        });
    };

    const filteredPatients = patients.filter(patient => {
        const matchSearch = !search ||
            patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
            patient.idNumber.includes(search) ||
            patient.phone.includes(search);

        const matchGender = !genderFilter || patient.gender === genderFilter;
        const matchStatus = !statusFilter || patient.status === statusFilter;

        return matchSearch && matchGender && matchStatus;
    });

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <p>Loading patients...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-8 h-8 text-blue-600" />
                        Patient Management
                    </h1>
                    <p className="text-gray-600">Manage comprehensive patient information</p>
                </div>

                <Dialog open={showNewPatient} onOpenChange={setShowNewPatient}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Patient
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingPatientId ? 'Edit Patient' : `Register New ${registrationType === 'patient' ? 'Patient' : 'Client'}`}</DialogTitle>
                        </DialogHeader>

                        {!editingPatientId && (
                           <Tabs value={registrationType} onValueChange={setRegistrationType} className="w-full mb-4">
                            <TabsList className="grid w-full grid-cols-2">
                                 <TabsTrigger value="patient" className="flex items-center gap-2">
                                    <User className="w-4 h-4"/> Medical Patient
                                 </TabsTrigger>
                                 <TabsTrigger value="client" className="flex items-center gap-2">
                                    <Users className="w-4 h-4"/> Aesthetic Client
                                 </TabsTrigger>
                            </TabsList>
                           </Tabs>
                        )}

                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="personal">Personal Data</TabsTrigger>
                                <TabsTrigger value="contact">Contact</TabsTrigger>
                                <TabsTrigger value="medical">Medical Info</TabsTrigger>
                                <TabsTrigger value="insurance">Insurance & Notes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input id="firstName" value={newPatient.firstName} onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input id="lastName" value={newPatient.lastName} onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="idNumber">
                                            {registrationType === 'patient' ? 'Patient ID (Auto)' : 'Client ID (Auto)'} *
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input 
                                                id="idNumber" 
                                                value={newPatient.idNumber} 
                                                readOnly 
                                                className="bg-gray-50 font-mono"
                                            />
                                            {/* Refresh Button */}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                title="Refresh ID"
                                                type="button"
                                                onClick={async () => {
                                                    const prefix = registrationType === 'patient' ? 'ID' : 'CLI';
                                                    const nextId = await doctorService.getNextSequentialId(prefix);
                                                    setNewPatient(prev => ({ ...prev, idNumber: nextId }));
                                                }}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="dob">Date of Birth *</Label>
                                        <Input id="dob" type="date" value={newPatient.dateOfBirth} onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Gender *</Label>
                                        <Select value={newPatient.gender} onValueChange={(val: any) => setNewPatient({ ...newPatient, gender: val })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="contact" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone">Phone *</Label>
                                        <Input id="phone" value={newPatient.phone} onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={newPatient.email} onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea id="address" value={newPatient.address} onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })} />
                                </div>
                            </TabsContent>

                            <TabsContent value="medical" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Blood Type</Label>
                                        <Select value={newPatient.bloodType} onValueChange={(val) => setNewPatient({ ...newPatient, bloodType: val })}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="O+">O+</SelectItem>
                                                <SelectItem value="O-">O-</SelectItem>
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A-">A-</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="insurance" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Insurance Company</Label>
                                        <Input value={newPatient.insurance.company} onChange={(e) => setNewPatient({ ...newPatient, insurance: { ...newPatient.insurance, company: e.target.value } })} />
                                    </div>
                                    <div>
                                        <Label>Policy Number</Label>
                                        <Input value={newPatient.insurance.policyNumber} onChange={(e) => setNewPatient({ ...newPatient, insurance: { ...newPatient.insurance, policyNumber: e.target.value } })} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Additional Notes</Label>
                                    <Textarea value={newPatient.notes} onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })} />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => { setShowNewPatient(false); setEditingPatientId(null); resetForm(); }}>Cancel</Button>
                            <Button onClick={handleCreatePatient}>{editingPatientId ? 'Update Patient' : 'Register Patient'}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div><p className="text-blue-100">Total Patients</p><p className="text-2xl font-bold">{patients.length}</p></div>
                            <User className="w-8 h-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search by name, ID or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                        </div>
                        <div className="flex gap-2">
                            <Select value={genderFilter} onValueChange={setGenderFilter}>
                                <SelectTrigger className="w-40"><SelectValue placeholder="Gender" /></SelectTrigger>
                                <SelectContent><SelectItem value="">All</SelectItem><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Patient List */}
            <div className="space-y-4">
                {filteredPatients.map(patient => (
                    <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{patient.firstName} {patient.lastName}</h3>
                                    <div className="flex gap-2 mt-2">
                                        <Badge>{patient.status}</Badge>
                                        {patient.allergies.length > 0 && <Badge variant="destructive">Allergies</Badge>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
                                        <span className="flex items-center gap-2"><User className="w-4 h-4" />ID: {patient.idNumber}</span>
                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{patient.age} years</span>
                                        <span className="flex items-center gap-2"><Phone className="w-4 h-4" />{patient.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                                    <Button size="sm" variant="outline" onClick={() => handleEditClick(patient)}><Edit className="w-4 h-4" /></Button>
                                    <Button size="sm" variant="outline" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PatientsManagement;
