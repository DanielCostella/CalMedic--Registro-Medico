// TypeScript Types for the Medical System

export interface Patient {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInsurance?: string;
  registrationDate: string;
  status: 'Active' | 'Inactive';
}

export interface Doctor {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string;
  email: string;
  licenseNumber: string;
  insuranceProviders?: string[]; // Added: List of accepted insurances
  registrationDate: string;
  status: 'Active' | 'Inactive';
  officeHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string; // Denormalized for easier display in lists
  date: string;
  time: string;
  duration: number; // in minutes
  reason: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  notes?: string;
  type: 'Consultation' | 'Control' | 'Emergency' | 'Procedure';
  reminder: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: Medication[];
  exams: Exam[];
  nextConsultation?: string;
  notes: string;
  attachments: MedicalFile[];
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: PrescriptionMedication[];
  indications: string;
  validity: string;
  status: 'Active' | 'Expired' | 'Used';
  prescriptionNumber: string;
}

export interface PrescriptionMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  indications: string;
  quantity: number;
}

export interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  presentation: string;
  concentration: string;
  laboratory: string;
  price: number;
  stock: number;
  expiryDate: string;
}

export interface Exam {
  id: string;
  name: string;
  type: 'Laboratory' | 'Imaging' | 'Functional';
  date: string;
  result: string;
  referenceValue: string;
  status: 'Pending' | 'Completed';
  file?: string;
}

export interface MedicalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
  url: string;
}

export interface Notification {
  id: string;
  type: 'Appointment' | 'Medication' | 'Exam' | 'System' | 'Emergency';
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  recipient: string; // User ID
  action?: {
    type: string;
    url: string;
    text: string;
  };
}

export interface Report {
  id: string;
  type: 'Patients' | 'Appointments' | 'Income' | 'Medications' | 'Statistics';
  title: string;
  description: string;
  generationDate: string;
  parameters: Record<string, string | number | boolean>;
  data: Record<string, string | number | boolean>[];
  format: 'PDF' | 'Excel' | 'CSV';
}

export interface DashboardStatistics {
  totalPatients: number;
  appointmentsToday: number;
  appointmentsWeek: number;
  newPatients: number;
  monthlyIncome: number;
  medicationsStock: number;
  criticalAlerts: number;
  averageSatisfaction: number;
}

export interface SearchFilters {
  text?: string;
  startDate?: string;
  endDate?: string;
  specialty?: string;
  status?: string;
  type?: string;
  priority?: string;
  doctor?: string;
  patient?: string;
  diagnosis?: string;
  medication?: string;
}

export interface SearchResult {
  type: 'Patient' | 'Doctor' | 'Appointment' | 'History' | 'Prescription';
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  relevance: number;
  data: Patient | Doctor | Appointment | MedicalHistory | Prescription;
  matches: string[];
}

export interface ChartData {
  [key: string]: string | number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    value: string | number;
  }>;
  label?: string;
}

export interface HistoryForm {
  patientId: string;
  doctorId: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: PrescriptionMedication[];
  exams: Exam[];
  nextConsultation: string;
  notes: string;
  attachments: MedicalFile[];
}

export interface PrescriptionForm {
  patientId: string;
  doctorId: string;
  medications: PrescriptionMedication[];
  indications: string;
  validity: string;
}