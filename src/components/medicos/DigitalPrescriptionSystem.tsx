import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Edit, Trash2, AlertTriangle, Clock, User, Printer, Save, X, Check, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Checkbox } from '@/components/ui/checkbox';

interface Medication {
    id: string;
    name: string;
    genericName: string;
    concentration: string;
    dosageForm: string;
    laboratory: string;
    category: string;
    requiresPrescription: boolean;
    contraindications: string[];
    sideEffects: string[];
    interactions: string[];
    adultDosage: string;
    childDosage: string;
    pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X';
    breastfeedingSafe: boolean;
}

interface PrescriptionItem {
    id: string;
    medicationId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: string;
    instructions: string;
    administrationRoute: string;
}

interface MedicalPrescription {
    id: string;
    patientId: string;
    patientName: string;
    patientIdNumber: string;
    doctorId: string;
    doctorName: string;
    doctorLicense: string;
    date: string;
    prescriptions: PrescriptionItem[];
    diagnosis: string;
    observations: string;
    status: 'Draft' | 'Issued' | 'Dispensed' | 'Cancelled';
    validUntil: string;
}

const DigitalPrescriptionSystem: React.FC = () => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [prescriptions, setPrescriptions] = useState<MedicalPrescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewPrescription, setShowNewPrescription] = useState(false);
    const [showSearchMedication, setShowSearchMedication] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<MedicalPrescription | null>(null);
    const [medicationSearch, setMedicationSearch] = useState('');
    const [prescriptionSearch, setPrescriptionSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [newPrescription, setNewPrescription] = useState<Omit<MedicalPrescription, 'id'>>({
        patientId: '',
        patientName: '',
        patientIdNumber: '',
        doctorId: '1',
        doctorName: 'Dr. Medical System',
        doctorLicense: 'LIC-12345',
        date: new Date().toISOString().split('T')[0],
        prescriptions: [],
        diagnosis: '',
        observations: '',
        status: 'Draft',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days
    });

    const [tempPrescription, setTempPrescription] = useState<Omit<PrescriptionItem, 'id' | 'medicationId' | 'medicationName'>>({
        dosage: '',
        frequency: '',
        duration: '',
        quantity: '',
        instructions: '',
        administrationRoute: 'Oral'
    });

    useEffect(() => {
        // Mock data loading
        setTimeout(() => {
            const initialMedications: Medication[] = [
                {
                    id: '1',
                    name: 'Paracetamol',
                    genericName: 'Acetaminophen',
                    concentration: '500mg',
                    dosageForm: 'Tablet',
                    laboratory: 'United Laboratories',
                    category: 'Analgesic',
                    requiresPrescription: false,
                    contraindications: ['Severe hepatic insufficiency', 'Acetaminophen allergy'],
                    sideEffects: ['Mild nausea', 'Skin rash (rare)'],
                    interactions: ['Warfarin', 'Alcohol'],
                    adultDosage: '500-1000mg every 6-8 hours',
                    childDosage: '10-15mg/kg every 6-8 hours',
                    pregnancyCategory: 'B',
                    breastfeedingSafe: true
                },
                {
                    id: '2',
                    name: 'Amoxicillin',
                    genericName: 'Amoxicillin',
                    concentration: '500mg',
                    dosageForm: 'Capsule',
                    laboratory: 'Antibiotics SA',
                    category: 'Antibiotic',
                    requiresPrescription: true,
                    contraindications: ['Penicillin allergy', 'Mononucleosis'],
                    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
                    interactions: ['Oral anticoagulants', 'Methotrexate'],
                    adultDosage: '500mg every 8 hours',
                    childDosage: '20-40mg/kg/day divided into 3 doses',
                    pregnancyCategory: 'B',
                    breastfeedingSafe: true
                },
                {
                    id: '3',
                    name: 'Enalapril',
                    genericName: 'Enalapril maleate',
                    concentration: '10mg',
                    dosageForm: 'Tablet',
                    laboratory: 'Cardio Pharma',
                    category: 'Antihypertensive',
                    requiresPrescription: true,
                    contraindications: ['Pregnancy', 'Previous angioedema', 'Bilateral renal stenosis'],
                    sideEffects: ['Dry cough', 'Hypotension', 'Hyperkalemia'],
                    interactions: ['Diuretics', 'Lithium', 'NSAIDs'],
                    adultDosage: '5-40mg/day in 1-2 doses',
                    childDosage: '0.08-0.6mg/kg/day',
                    pregnancyCategory: 'D',
                    breastfeedingSafe: false
                },
                {
                    id: '4',
                    name: 'Metformin',
                    genericName: 'Metformin hydrochloride',
                    concentration: '500mg',
                    dosageForm: 'Tablet',
                    laboratory: 'Diabetes Control',
                    category: 'Antidiabetic',
                    requiresPrescription: true,
                    contraindications: ['Renal failure', 'Metabolic acidosis', 'Heart failure'],
                    sideEffects: ['Diarrhea', 'Nausea', 'Abdominal pain'],
                    interactions: ['Alcohol', 'Iodinated contrasts', 'Diuretics'],
                    adultDosage: '500-2000mg/day divided into 2-3 doses',
                    childDosage: 'Not recommended < 10 years',
                    pregnancyCategory: 'B',
                    breastfeedingSafe: false
                },
                {
                    id: '5',
                    name: 'Omeprazole',
                    genericName: 'Omeprazole',
                    concentration: '20mg',
                    dosageForm: 'Capsule',
                    laboratory: 'Gastro Med',
                    category: 'Proton pump inhibitor',
                    requiresPrescription: false,
                    contraindications: ['Benzimidazole allergy'],
                    sideEffects: ['Headache', 'Diarrhea', 'Abdominal pain'],
                    interactions: ['Warfarin', 'Digoxin', 'Ketoconazole'],
                    adultDosage: '20-40mg/day',
                    childDosage: '0.7-3.3mg/kg/day',
                    pregnancyCategory: 'C',
                    breastfeedingSafe: true
                }
            ];

            const initialPrescriptions: MedicalPrescription[] = [
                {
                    id: '1',
                    patientId: '1',
                    patientName: 'Maria Gonzalez',
                    patientIdNumber: '12345678',
                    doctorId: '1',
                    doctorName: 'Dr. Medical System',
                    doctorLicense: 'LIC-12345',
                    date: '2024-01-15',
                    prescriptions: [
                        {
                            id: '1',
                            medicationId: '4',
                            medicationName: 'Metformin 500mg',
                            dosage: '500mg',
                            frequency: 'Every 12 hours',
                            duration: '30 days',
                            quantity: '60 tablets',
                            instructions: 'Take with meals',
                            administrationRoute: 'Oral'
                        },
                        {
                            id: '2',
                            medicationId: '3',
                            medicationName: 'Enalapril 10mg',
                            dosage: '10mg',
                            frequency: 'Once a day',
                            duration: '30 days',
                            quantity: '30 tablets',
                            instructions: 'Take on an empty stomach',
                            administrationRoute: 'Oral'
                        }
                    ],
                    diagnosis: 'Type 2 Diabetes Mellitus + Hypertension',
                    observations: 'Review in 30 days. Monitor blood glucose and blood pressure.',
                    status: 'Issued',
                    validUntil: '2024-02-15'
                }
            ];

            setMedications(initialMedications);
            setPrescriptions(initialPrescriptions);
            setLoading(false);
        }, 1000);
    }, []);

    const checkInteractions = (medicationId: string): string[] => {
        const medication = medications.find(m => m.id === medicationId);
        if (!medication) return [];

        const interactionsFound: string[] = [];

        newPrescription.prescriptions.forEach(p => {
            const otherMed = medications.find(m => m.id === p.medicationId);
            if (otherMed && otherMed.id !== medicationId) {
                const commonInteractions = medication.interactions.filter(interaction =>
                    otherMed.name.toLowerCase().includes(interaction.toLowerCase()) ||
                    otherMed.category.toLowerCase().includes(interaction.toLowerCase())
                );
                interactionsFound.push(...commonInteractions.map(i => `${i} (with ${otherMed.name})`));
            }
        });

        return interactionsFound;
    };

    const checkAllergies = (medicationId: string): boolean => {
        const mockAllergies = ['Penicillin', 'Aspirin'];
        const medication = medications.find(m => m.id === medicationId);

        if (!medication) return false;

        return mockAllergies.some(allergy =>
            medication.name.toLowerCase().includes(allergy.toLowerCase()) ||
            medication.category.toLowerCase().includes(allergy.toLowerCase())
        );
    };

    const addMedicationToPrescription = (medication: Medication) => {
        const newItem: PrescriptionItem = {
            id: Date.now().toString(),
            medicationId: medication.id,
            medicationName: `${medication.name} ${medication.concentration}`,
            ...tempPrescription
        };

        setNewPrescription(prev => ({
            ...prev,
            prescriptions: [...prev.prescriptions, newItem]
        }));

        setTempPrescription({
            dosage: '',
            frequency: '',
            duration: '',
            quantity: '',
            instructions: '',
            administrationRoute: 'Oral'
        });

        setShowSearchMedication(false);
    };

    const removePrescriptionItem = (itemId: string) => {
        setNewPrescription(prev => ({
            ...prev,
            prescriptions: prev.prescriptions.filter(p => p.id !== itemId)
        }));
    };

    const handleCreatePrescription = () => {
        const fullPrescription: MedicalPrescription = {
            ...newPrescription,
            id: Date.now().toString()
        };

        setPrescriptions(prev => [...prev, fullPrescription]);
        setShowNewPrescription(false);
        resetForm();
    };

    const resetForm = () => {
        setNewPrescription({
            patientId: '',
            patientName: '',
            patientIdNumber: '',
            doctorId: '1',
            doctorName: 'Dr. Medical System',
            doctorLicense: 'LIC-12345',
            date: new Date().toISOString().split('T')[0],
            prescriptions: [],
            diagnosis: '',
            observations: '',
            status: 'Draft',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
    };

    const printPrescription = (prescription: MedicalPrescription) => {
        const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Prescription</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .patient-info { margin: 20px 0; }
          .prescription { border: 1px solid #ccc; margin: 10px 0; padding: 10px; }
          .footer { margin-top: 30px; text-align: center; }
          .signature { margin-top: 50px; border-top: 1px solid #333; width: 200px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MEDICAL PRESCRIPTION</h1>
          <p><strong>Dr. ${prescription.doctorName}</strong></p>
          <p>Medical License: ${prescription.doctorLicense}</p>
          <p>Date: ${new Date(prescription.date).toLocaleDateString()}</p>
        </div>
        
        <div class="patient-info">
          <p><strong>Patient:</strong> ${prescription.patientName}</p>
          <p><strong>ID Number:</strong> ${prescription.patientIdNumber}</p>
          <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
        </div>
        
        <h3>PRESCRIPTIONS:</h3>
        ${prescription.prescriptions.map((p, index) => `
          <div class="prescription">
            <p><strong>${index + 1}. ${p.medicationName}</strong></p>
            <p><strong>Dosage:</strong> ${p.dosage}</p>
            <p><strong>Frequency:</strong> ${p.frequency}</p>
            <p><strong>Duration:</strong> ${p.duration}</p>
            <p><strong>Quantity:</strong> ${p.quantity}</p>
            <p><strong>Route:</strong> ${p.administrationRoute}</p>
            ${p.instructions ? `<p><strong>Instructions:</strong> ${p.instructions}</p>` : ''}
          </div>
        `).join('')}
        
        ${prescription.observations ? `<p><strong>Observations:</strong> ${prescription.observations}</p>` : ''}
        
        <div class="footer">
          <p><strong>Valid until:</strong> ${new Date(prescription.validUntil).toLocaleDateString()}</p>
          <div class="signature">
            <p>Doctor Signature and Stamp</p>
          </div>
        </div>
      </body>
      </html>
    `;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(content);
            win.document.close();
            win.print();
        }
    };

    const filteredMedications = medications.filter(m => {
        const matchSearch = !medicationSearch ||
            m.name.toLowerCase().includes(medicationSearch.toLowerCase()) ||
            m.genericName.toLowerCase().includes(medicationSearch.toLowerCase()) ||
            m.category.toLowerCase().includes(medicationSearch.toLowerCase());

        const matchCategory = !categoryFilter || m.category === categoryFilter;

        return matchSearch && matchCategory;
    });

    const filteredPrescriptions = prescriptions.filter(p => {
        const matchSearch = !prescriptionSearch ||
            p.patientName.toLowerCase().includes(prescriptionSearch.toLowerCase()) ||
            p.patientIdNumber.includes(prescriptionSearch) ||
            p.diagnosis.toLowerCase().includes(prescriptionSearch.toLowerCase());

        const matchStatus = !statusFilter || p.status === statusFilter;

        return matchSearch && matchStatus;
    });

    const medicationCategories = [...new Set(medications.map(m => m.category))];

    if (loading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading prescription system...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Pill className="w-8 h-8 text-blue-600" />
                        Digital Prescription System
                    </h1>
                    <p className="text-gray-600">
                        Complete medical prescription system with interaction checking
                    </p>
                </div>

                <Dialog open={showNewPrescription} onOpenChange={setShowNewPrescription}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Prescription
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Prescription</DialogTitle>
                        </DialogHeader>

                        <Tabs defaultValue="patient" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="patient">Patient Details</TabsTrigger>
                                <TabsTrigger value="medications">Medications</TabsTrigger>
                                <TabsTrigger value="review">Review</TabsTrigger>
                            </TabsList>

                            <TabsContent value="patient" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="patient-name">Patient Name *</Label>
                                        <Input
                                            id="patient-name"
                                            value={newPrescription.patientName}
                                            onChange={(e) => setNewPrescription({ ...newPrescription, patientName: e.target.value })}
                                            placeholder="Full patient name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="patient-id">ID Number *</Label>
                                        <Input
                                            id="patient-id"
                                            value={newPrescription.patientIdNumber}
                                            onChange={(e) => setNewPrescription({ ...newPrescription, patientIdNumber: e.target.value })}
                                            placeholder="ID number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="diagnosis">Diagnosis *</Label>
                                    <Input
                                        id="diagnosis"
                                        value={newPrescription.diagnosis}
                                        onChange={(e) => setNewPrescription({ ...newPrescription, diagnosis: e.target.value })}
                                        placeholder="Main diagnosis"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="observations">Observations</Label>
                                    <Textarea
                                        id="observations"
                                        value={newPrescription.observations}
                                        onChange={(e) => setNewPrescription({ ...newPrescription, observations: e.target.value })}
                                        placeholder="Additional observations..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="date">Issue Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={newPrescription.date}
                                            onChange={(e) => setNewPrescription({ ...newPrescription, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="valid-until">Valid Until</Label>
                                        <Input
                                            id="valid-until"
                                            type="date"
                                            value={newPrescription.validUntil}
                                            onChange={(e) => setNewPrescription({ ...newPrescription, validUntil: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="medications" className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Prescribed Medications</h3>
                                    <Dialog open={showSearchMedication} onOpenChange={setShowSearchMedication}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Medication
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Search and Add Medication</DialogTitle>
                                            </DialogHeader>

                                            {/* Search Filters */}
                                            <div className="flex gap-4 mb-4">
                                                <div className="flex-1">
                                                    <Input
                                                        placeholder="Search medication..."
                                                        value={medicationSearch}
                                                        onChange={(e) => setMedicationSearch(e.target.value)}
                                                    />
                                                </div>
                                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                                    <SelectTrigger className="w-48">
                                                        <SelectValue placeholder="Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">All</SelectItem>
                                                        {medicationCategories.map(cat => (
                                                            <SelectItem key={cat} value={cat}>
                                                                {cat}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Medications List */}
                                            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                                                {filteredMedications.map(med => {
                                                    const interactions = checkInteractions(med.id).length > 0;
                                                    const isAllergic = checkAllergies(med.id);

                                                    return (
                                                        <div
                                                            key={med.id}
                                                            className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${isAllergic ? 'border-red-300 bg-red-50' :
                                                                    interactions ? 'border-yellow-300 bg-yellow-50' :
                                                                        'border-gray-200'
                                                                }`}
                                                            onClick={() => {
                                                                if (!isAllergic) {
                                                                    // Open config or just add for now as mock
                                                                    const genericItem: PrescriptionItem = {
                                                                        id: Date.now().toString(),
                                                                        medicationId: med.id,
                                                                        medicationName: `${med.name} ${med.concentration}`,
                                                                        dosage: '1 tablet',
                                                                        frequency: 'Every 8 hours',
                                                                        duration: '5 days',
                                                                        quantity: '15 tablets',
                                                                        instructions: 'Take with water',
                                                                        administrationRoute: 'Oral'
                                                                    };
                                                                    setNewPrescription(prev => ({
                                                                        ...prev,
                                                                        prescriptions: [...prev.prescriptions, genericItem]
                                                                    }));
                                                                    setShowSearchMedication(false);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="font-medium">{med.name}</div>
                                                                    <div className="text-sm text-gray-600">
                                                                        {med.genericName} - {med.concentration}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {med.dosageForm} | {med.category}
                                                                    </div>

                                                                    {isAllergic && (
                                                                        <div className="mt-2 flex items-center gap-1 text-red-600">
                                                                            <AlertTriangle className="w-4 h-4" />
                                                                            <span className="text-sm font-medium">ALLERGY DETECTED</span>
                                                                        </div>
                                                                    )}

                                                                    {interactions && !isAllergic && (
                                                                        <div className="mt-2 flex items-center gap-1 text-yellow-600">
                                                                            <AlertTriangle className="w-4 h-4" />
                                                                            <span className="text-sm">Potential interactions</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-col gap-1">
                                                                    {med.requiresPrescription && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            Rx Required
                                                                        </Badge>
                                                                    )}
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Cat. {med.pregnancyCategory}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Added Medications List */}
                                <div className="space-y-3">
                                    {newPrescription.prescriptions.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">
                                            No medications added to this prescription
                                        </p>
                                    ) : (
                                        newPrescription.prescriptions.map((p, index) => (
                                            <div key={p.id} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-lg">
                                                            {index + 1}. {p.medicationName}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                                            <div><strong>Dosage:</strong> {p.dosage}</div>
                                                            <div><strong>Frequency:</strong> {p.frequency}</div>
                                                            <div><strong>Duration:</strong> {p.duration}</div>
                                                            <div><strong>Quantity:</strong> {p.quantity}</div>
                                                        </div>
                                                        {p.instructions && (
                                                            <div className="mt-2 text-sm">
                                                                <strong>Instructions:</strong> {p.instructions}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => removePrescriptionItem(p.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="review" className="space-y-4">
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-semibold mb-3">Prescription Summary</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><strong>Patient:</strong> {newPrescription.patientName}</div>
                                        <div><strong>ID:</strong> {newPrescription.patientIdNumber}</div>
                                        <div><strong>Diagnosis:</strong> {newPrescription.diagnosis}</div>
                                        <div><strong>Date:</strong> {newPrescription.date}</div>
                                    </div>

                                    <div className="mt-4">
                                        <strong>Medications ({newPrescription.prescriptions.length}):</strong>
                                        <ul className="mt-2 space-y-1">
                                            {newPrescription.prescriptions.map((p, index) => (
                                                <li key={p.id} className="text-sm">
                                                    {index + 1}. {p.medicationName} - {p.dosage} {p.frequency}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Safety Checks */}
                                <div className="space-y-3">
                                    <h4 className="font-medium">Safety Verifications</h4>

                                    {newPrescription.prescriptions.map(p => {
                                        const interactions = checkInteractions(p.medicationId);
                                        const isAllergic = checkAllergies(p.medicationId);

                                        if (interactions.length > 0 || isAllergic) {
                                            return (
                                                <div key={p.id} className={`p-3 rounded-lg ${isAllergic ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <AlertTriangle className={`w-4 h-4 ${isAllergic ? 'text-red-600' : 'text-yellow-600'}`} />
                                                        <span className={`font-medium ${isAllergic ? 'text-red-900' : 'text-yellow-900'}`}>
                                                            {p.medicationName}
                                                        </span>
                                                    </div>
                                                    {isAllergic && (
                                                        <p className="text-sm text-red-700">⚠️ ALLERGY DETECTED - Do not prescribe</p>
                                                    )}
                                                    {interactions.length > 0 && (
                                                        <div className="text-sm text-yellow-700">
                                                            <p>Potential interactions:</p>
                                                            <ul className="list-disc list-inside ml-2">
                                                                {interactions.map((i, idx) => (
                                                                    <li key={idx}>{i}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}

                                    {newPrescription.prescriptions.every(p =>
                                        checkInteractions(p.medicationId).length === 0 &&
                                        !checkAllergies(p.medicationId)
                                    ) && newPrescription.prescriptions.length > 0 && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    <span className="text-green-900 font-medium">
                                                        No interactions or allergies detected
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => { setShowNewPrescription(false); resetForm(); }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreatePrescription}
                                disabled={!newPrescription.patientName || !newPrescription.diagnosis || newPrescription.prescriptions.length === 0}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Create Prescription
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total Prescriptions</p>
                                <p className="text-2xl font-bold">{prescriptions.length}</p>
                            </div>
                            <Pill className="w-8 h-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Issued</p>
                                <p className="text-2xl font-bold">
                                    {prescriptions.filter(r => r.status === 'Issued').length}
                                </p>
                            </div>
                            <Check className="w-8 h-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Medications</p>
                                <p className="text-2xl font-bold">{medications.length}</p>
                            </div>
                            <Pill className="w-8 h-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100">Drafts</p>
                                <p className="text-2xl font-bold">
                                    {prescriptions.filter(r => r.status === 'Draft').length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by patient, ID or diagnosis..."
                                    value={prescriptionSearch}
                                    onChange={(e) => setPrescriptionSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Issued">Issued</SelectItem>
                                    <SelectItem value="Dispensed">Dispensed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Prescriptions List */}
            <div className="space-y-4">
                {filteredPrescriptions.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-gray-500">
                            <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No prescriptions found matching your filters</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredPrescriptions.map(p => (
                        <Card key={p.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {p.patientName}
                                            </h3>
                                            <Badge variant={
                                                p.status === 'Issued' ? 'default' :
                                                    p.status === 'Dispensed' ? 'secondary' :
                                                        p.status === 'Cancelled' ? 'destructive' : 'outline'
                                            }>
                                                {p.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>ID: {p.patientIdNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(p.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Valid until: {new Date(p.validUntil).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-sm font-medium text-gray-700">Diagnosis: </span>
                                            <span className="text-sm text-gray-600">{p.diagnosis}</span>
                                        </div>

                                        <div className="mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Medications ({p.prescriptions.length}):
                                            </span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {p.prescriptions.slice(0, 3).map((item, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {item.medicationName}
                                                    </Badge>
                                                ))}
                                                {p.prescriptions.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{p.prescriptions.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedPrescription(p)}
                                        >
                                            <User className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => printPrescription(p)}
                                        >
                                            <Printer className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Detailed View Modal */}
            <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedPrescription && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Pill className="w-6 h-6 text-blue-600" />
                                    Prescription - {selectedPrescription.patientName}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Patient Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold">Patient Information</h4>
                                        <div><strong>Name:</strong> {selectedPrescription.patientName}</div>
                                        <div><strong>ID Number:</strong> {selectedPrescription.patientIdNumber}</div>
                                        <div><strong>Diagnosis:</strong> {selectedPrescription.diagnosis}</div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-semibold">Prescription Information</h4>
                                        <div><strong>Doctor:</strong> {selectedPrescription.doctorName}</div>
                                        <div><strong>Date:</strong> {new Date(selectedPrescription.date).toLocaleDateString()}</div>
                                        <div><strong>Valid until:</strong> {new Date(selectedPrescription.validUntil).toLocaleDateString()}</div>
                                        <div><strong>Status:</strong>
                                            <Badge className="ml-2" variant={
                                                selectedPrescription.status === 'Issued' ? 'default' :
                                                    selectedPrescription.status === 'Dispensed' ? 'secondary' :
                                                        selectedPrescription.status === 'Cancelled' ? 'destructive' : 'outline'
                                            }>
                                                {selectedPrescription.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Prescriptions */}
                                <div>
                                    <h4 className="font-semibold mb-3">Prescribed Medications</h4>
                                    <div className="space-y-3">
                                        {selectedPrescription.prescriptions.map((p, idx) => (
                                            <div key={p.id} className="border rounded-lg p-4">
                                                <div className="font-medium text-lg mb-2">
                                                    {idx + 1}. {p.medicationName}
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div><strong>Dosage:</strong> {p.dosage}</div>
                                                    <div><strong>Frequency:</strong> {p.frequency}</div>
                                                    <div><strong>Duration:</strong> {p.duration}</div>
                                                    <div><strong>Quantity:</strong> {p.quantity}</div>
                                                </div>
                                                <div className="mt-2 text-sm">
                                                    <strong>Route:</strong> {p.administrationRoute}
                                                </div>
                                                {p.instructions && (
                                                    <div className="mt-2 text-sm">
                                                        <strong>Instructions:</strong> {p.instructions}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Observations */}
                                {selectedPrescription.observations && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Observations</h4>
                                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                                            {selectedPrescription.observations}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => printPrescription(selectedPrescription)}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print Prescription
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DigitalPrescriptionSystem;
