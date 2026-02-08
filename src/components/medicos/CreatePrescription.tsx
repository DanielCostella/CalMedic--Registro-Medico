import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Plus,
    Trash2,
    Save,
    Printer,
    Mail,
    FileText,
    User,
    Calendar,
    Stethoscope,
    Pill,
    Clock,
    MapPin,
    Download
} from 'lucide-react';
import { toast } from 'sonner';
import { generatePrescriptionPDF, sendPrescriptionByEmail, downloadPrescriptionPDF, PrescriptionData } from '../../utils/prescriptionPdfGenerator';

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
}

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    age: number;
    phone: string;
    email?: string;
}

interface CreatePrescriptionProps {
    doctorId: string;
    doctorName: string;
    medicalLicenseNumber: string;
}

// Simulated patient data
const simulatedPatients: Patient[] = [
    { id: '1', firstName: 'Ana María', lastName: 'González López', idNumber: 'V12345678', age: 45, phone: '04141234567', email: 'ana.gonzalez@email.com' },
    { id: '2', firstName: 'Carlos Eduardo', lastName: 'Pérez Silva', idNumber: 'V87654321', age: 32, phone: '04169876543', email: 'carlos.perez@email.com' },
    { id: '3', firstName: 'María Elena', lastName: 'Rodríguez Castro', idNumber: 'V11223344', age: 28, phone: '04121122334', email: 'maria.rodriguez@email.com' },
    { id: '4', firstName: 'José Antonio', lastName: 'Martínez Herrera', idNumber: 'V44332211', age: 55, phone: '04143344221' },
];

export default function CreatePrescription({ doctorId, doctorName, medicalLicenseNumber }: CreatePrescriptionProps) {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [diagnosis, setDiagnosis] = useState('');
    const [observations, setObservations] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const prescriptionRef = useRef<HTMLDivElement>(null);

    const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    });

    const addMedication = () => {
        if (!newMedication.name || !newMedication.dosage) {
            toast.error('Medication name and dosage are required');
            return;
        }

        const medication: Medication = {
            id: Date.now().toString(),
            ...newMedication
        };

        setMedications([...medications, medication]);
        setNewMedication({
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        });
        toast.success('Medication added');
    };

    const removeMedication = (id: string) => {
        setMedications(medications.filter(med => med.id !== id));
        toast.success('Medication removed');
    };

    const selectPatient = (patientId: string) => {
        const patient = simulatedPatients.find(p => p.id === patientId);
        setSelectedPatient(patient || null);
    };

    const savePrescription = async () => {
        if (!selectedPatient || medications.length === 0) {
            toast.error('You must select a patient and add at least one medication');
            return;
        }

        setLoading(true);
        try {
            // Simulate saving
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Prescription saved successfully');
        } catch (error) {
            toast.error('Error saving prescription');
        } finally {
            setLoading(false);
        }
    };

    const preparePrescriptionData = (): PrescriptionData => {
        if (!selectedPatient) {
            throw new Error('No patient selected');
        }

        return {
            doctorName,
            medicalLicenseNumber,
            patient: selectedPatient,
            diagnosis: diagnosis || undefined,
            medications: medications.map(med => ({
                name: med.name,
                dosage: med.dosage,
                frequency: med.frequency || undefined,
                duration: med.duration || undefined,
                instructions: med.instructions || undefined
            })),
            observations: observations || undefined
        };
    };

    const printPrescription = () => {
        if (!selectedPatient || medications.length === 0) {
            toast.error('You must complete the prescription before printing');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const prescriptionHTML = generatePrescriptionHTML();

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Prescription - ${selectedPatient.firstName} ${selectedPatient.lastName}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 20px; 
              margin-bottom: 30px;
            }
            .doctor-info { 
              background: #f8fafc; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 20px;
            }
            .patient-info { 
              background: #f1f5f9; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 20px;
            }
            .medication { 
              border: 1px solid #e2e8f0; 
              padding: 15px; 
              margin-bottom: 15px; 
              border-radius: 8px;
              background: white;
            }
            .medication-name { 
              font-weight: bold; 
              color: #1e40af; 
              font-size: 16px;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 20px;
            }
            .signature-line {
              border-top: 1px solid #333;
              width: 300px;
              margin: 40px auto 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${prescriptionHTML}
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        toast.success('Prescription sent to printer');
    };

    const downloadPDF = async () => {
        if (!selectedPatient || medications.length === 0) {
            toast.error('You must complete the prescription before downloading');
            return;
        }

        setPdfLoading(true);
        try {
            const prescriptionData = preparePrescriptionData();
            await downloadPrescriptionPDF(prescriptionData);
            toast.success('PDF downloaded successfully');
        } catch (error) {
            toast.error('Error generating PDF');
            console.error('Error:', error);
        } finally {
            setPdfLoading(false);
        }
    };

    const sendByEmail = async () => {
        if (!selectedPatient || medications.length === 0) {
            toast.error('You must complete the prescription before sending');
            return;
        }

        if (!selectedPatient.email) {
            toast.error('The patient has no registered email');
            return;
        }

        setEmailLoading(true);
        try {
            const prescriptionData = preparePrescriptionData();
            const success = await sendPrescriptionByEmail(prescriptionData, selectedPatient.email);

            if (success) {
                toast.success(`Prescription sent by email to ${selectedPatient.email}`);
            } else {
                toast.error('Error sending prescription by email');
            }
        } catch (error) {
            toast.error('Error sending prescription by email');
            console.error('Error:', error);
        } finally {
            setEmailLoading(false);
        }
    };

    const generatePrescriptionHTML = () => {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
      <div class="header">
        <h1 style="color: #2563eb; margin: 0;">MEDICAL PRESCRIPTION</h1>
        <p style="margin: 5px 0;">EstiloLibre System</p>
      </div>

      <div class="doctor-info">
        <h3 style="margin-top: 0; color: #059669;">Doctor Information</h3>
        <p><strong>Name:</strong> ${doctorName}</p>
        <p><strong>Medical License:</strong> ${medicalLicenseNumber}</p>
        <p><strong>Date:</strong> ${currentDate}</p>
      </div>

      <div class="patient-info">
        <h3 style="margin-top: 0; color: #7c3aed;">Patient Information</h3>
        <p><strong>Name:</strong> ${selectedPatient?.firstName} ${selectedPatient?.lastName}</p>
        <p><strong>ID Number:</strong> ${selectedPatient?.idNumber}</p>
        <p><strong>Age:</strong> ${selectedPatient?.age} years</p>
        <p><strong>Phone:</strong> ${selectedPatient?.phone}</p>
      </div>

      ${diagnosis ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #dc2626;">Diagnosis</h3>
          <p style="background: #fef2f2; padding: 10px; border-radius: 5px;">${diagnosis}</p>
        </div>
      ` : ''}

      <div>
        <h3 style="color: #2563eb;">Prescribed Medications</h3>
        ${medications.map((med, index) => `
          <div class="medication">
            <div class="medication-name">${index + 1}. ${med.name}</div>
            <p><strong>Dosage:</strong> ${med.dosage}</p>
            ${med.frequency ? `<p><strong>Frequency:</strong> ${med.frequency}</p>` : ''}
            ${med.duration ? `<p><strong>Duration:</strong> ${med.duration}</p>` : ''}
            ${med.instructions ? `<p><strong>Instructions:</strong> ${med.instructions}</p>` : ''}
          </div>
        `).join('')}
      </div>

      ${observations ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #7c2d12;">Observations</h3>
          <p style="background: #fefbf2; padding: 10px; border-radius: 5px;">${observations}</p>
        </div>
      ` : ''}

      <div class="footer">
        <div class="signature-line"></div>
        <p><strong>Doctor's Signature</strong></p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">
          This prescription was generated electronically by the EstiloLibre System<br>
          Issue date: ${new Date().toLocaleString('en-US')}
        </p>
      </div>
    `;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Create Medical Prescription</h1>
                    <p className="text-slate-600 mt-1">Medication prescription</p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={printPrescription}
                        variant="outline"
                        className="flex items-center space-x-2"
                        disabled={!selectedPatient || medications.length === 0}
                    >
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                    </Button>
                    <Button
                        onClick={downloadPDF}
                        variant="outline"
                        className="flex items-center space-x-2"
                        disabled={!selectedPatient || medications.length === 0 || pdfLoading}
                    >
                        <Download className="h-4 w-4" />
                        <span>{pdfLoading ? 'Generating...' : 'Download PDF'}</span>
                    </Button>
                    <Button
                        onClick={sendByEmail}
                        variant="outline"
                        className="flex items-center space-x-2"
                        disabled={!selectedPatient || medications.length === 0 || emailLoading}
                    >
                        <Mail className="h-4 w-4" />
                        <span>{emailLoading ? 'Sending...' : 'Send Email'}</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prescription Form */}
                <div className="space-y-6">
                    {/* Patient Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-blue-600" />
                                <span>Select Patient</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select onValueChange={selectPatient}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Search patient..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {simulatedPatients.map((patient) => (
                                        <SelectItem key={patient.id} value={patient.id}>
                                            {patient.firstName} {patient.lastName} - {patient.idNumber}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedPatient && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-900">Selected Patient</h4>
                                    <div className="mt-2 space-y-1 text-sm text-blue-800">
                                        <p><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                                        <p><strong>ID Number:</strong> {selectedPatient.idNumber}</p>
                                        <p><strong>Age:</strong> {selectedPatient.age} years</p>
                                        <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                                        {selectedPatient.email && (
                                            <p><strong>Email:</strong> {selectedPatient.email}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Diagnosis */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Stethoscope className="h-5 w-5 text-red-600" />
                                <span>Diagnosis</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Enter patient diagnosis..."
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    {/* Add Medication */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Pill className="h-5 w-5 text-green-600" />
                                <span>Add Medication</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Medication Name *</Label>
                                    <Input
                                        id="name"
                                        value={newMedication.name}
                                        onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                                        placeholder="e.g.: Paracetamol"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dosage">Dosage *</Label>
                                    <Input
                                        id="dosage"
                                        value={newMedication.dosage}
                                        onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                                        placeholder="e.g.: 500mg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="frequency">Frequency</Label>
                                    <Input
                                        id="frequency"
                                        value={newMedication.frequency}
                                        onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                                        placeholder="e.g.: Every 8 hours"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={newMedication.duration}
                                        onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                                        placeholder="e.g.: 7 days"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="instructions">Special Instructions</Label>
                                <Textarea
                                    id="instructions"
                                    value={newMedication.instructions}
                                    onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                                    placeholder="e.g.: Take with food"
                                    rows={2}
                                />
                            </div>

                            <Button onClick={addMedication} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Medication
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Observations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-purple-600" />
                                <span>Observations</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Additional observations, recommendations, next appointment..."
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                rows={3}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Prescription Preview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span>Prescription Preview</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div ref={prescriptionRef} className="space-y-4 p-4 border rounded-lg bg-white">
                                {/* Header */}
                                <div className="text-center border-b pb-4">
                                    <h2 className="text-xl font-bold text-blue-600">MEDICAL PRESCRIPTION</h2>
                                    <p className="text-sm text-slate-600">EstiloLibre System</p>
                                </div>

                                {/* Doctor Information */}
                                <div className="bg-green-50 p-3 rounded">
                                    <h3 className="font-semibold text-green-800 mb-2">Doctor Information</h3>
                                    <p className="text-sm"><strong>Name:</strong> {doctorName}</p>
                                    <p className="text-sm"><strong>Medical License:</strong> {medicalLicenseNumber}</p>
                                    <p className="text-sm"><strong>Date:</strong> {new Date().toLocaleDateString('en-US')}</p>
                                </div>

                                {/* Patient Information */}
                                {selectedPatient && (
                                    <div className="bg-blue-50 p-3 rounded">
                                        <h3 className="font-semibold text-blue-800 mb-2">Patient Information</h3>
                                        <p className="text-sm"><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                                        <p className="text-sm"><strong>ID Number:</strong> {selectedPatient.idNumber}</p>
                                        <p className="text-sm"><strong>Age:</strong> {selectedPatient.age} years</p>
                                    </div>
                                )}

                                {/* Diagnosis */}
                                {diagnosis && (
                                    <div className="bg-red-50 p-3 rounded">
                                        <h3 className="font-semibold text-red-800 mb-2">Diagnosis</h3>
                                        <p className="text-sm">{diagnosis}</p>
                                    </div>
                                )}

                                {/* Medications */}
                                {medications.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-slate-800 mb-3">Prescribed Medications</h3>
                                        <div className="space-y-3">
                                            {medications.map((medication, index) => (
                                                <div key={medication.id} className="border p-3 rounded bg-slate-50">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-blue-600">
                                                                {index + 1}. {medication.name}
                                                            </h4>
                                                            <p className="text-sm mt-1"><strong>Dosage:</strong> {medication.dosage}</p>
                                                            {medication.frequency && (
                                                                <p className="text-sm"><strong>Frequency:</strong> {medication.frequency}</p>
                                                            )}
                                                            {medication.duration && (
                                                                <p className="text-sm"><strong>Duration:</strong> {medication.duration}</p>
                                                            )}
                                                            {medication.instructions && (
                                                                <p className="text-sm"><strong>Instructions:</strong> {medication.instructions}</p>
                                                            )}
                                                        </div>
                                                        <Button
                                                            onClick={() => removeMedication(medication.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Observations */}
                                {observations && (
                                    <div className="bg-yellow-50 p-3 rounded">
                                        <h3 className="font-semibold text-yellow-800 mb-2">Observations</h3>
                                        <p className="text-sm">{observations}</p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="text-center pt-4 border-t">
                                    <div className="w-48 mx-auto border-t border-slate-400 mt-8 mb-2"></div>
                                    <p className="text-sm font-medium">Doctor's Signature</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex space-x-4">
                        <Button
                            onClick={savePrescription}
                            disabled={loading || !selectedPatient || medications.length === 0}
                            className="flex-1"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Prescription'}
                        </Button>
                    </div>

                    {/* Feature Status */}
                    {selectedPatient && medications.length > 0 && (
                        <Alert>
                            <AlertDescription>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <Printer className="h-4 w-4 text-blue-600" />
                                        <span>Printing: Ready</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Download className="h-4 w-4 text-purple-600" />
                                        <span>PDF: Ready</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Mail className="h-4 w-4 text-green-600" />
                                        <span>Email: {selectedPatient.email ? 'Available' : 'Not available'}</span>
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
