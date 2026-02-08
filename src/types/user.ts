export interface User {
  id: string;
  idType: 'V' | 'E' | 'J' | 'P' | 'G' | 'M' | 'DNI' | 'Passport' | 'License';
  nationalId: string;
  firstNames: string;
  lastNames: string;
  birthDate: string;
  age: number;
  gender: 'Female' | 'Male';
  mobilePhone: string;
  email: string;
  address: string;
  birthPlace: string;
  role: UserRole;
  createdAt: string;
  doctorDetails?: {
    specialty: string;
    medical_license_number: string;
    profession_category?: ProfessionCategory;
    license_status?: 'Active' | 'Suspended' | 'In Review';
    [key: string]: any;
  };
}

export type UserRole = 'Admin' | 'User' | 'Doctor';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  idType: 'V' | 'E' | 'J' | 'P' | 'G' | 'M' | 'DNI' | 'Passport' | 'License';
  nationalId: string;
  firstNames: string;
  lastNames: string;
  birthDate?: string;
  gender?: 'Female' | 'Male';
  mobilePhone?: string;
  email: string;
  address?: string;
  birthPlace?: string;
  password: string;
  role?: UserRole;
}

export type ProfessionCategory = 'Medical' | 'Aesthetic' | 'Beauty' | 'Wellness' | 'Therapy';

export interface RegisterDoctorData extends RegisterData {
  professionCategory?: ProfessionCategory; // New field
  medicalLicenseNumber?: string; // Made optional
  specialty: string;
  consultationFee: number;
  // Campos
  degreeUniversity?: string; // Made optional
  graduationYear?: number;
  yearsExperience: number;
  office?: string; // Nombre del consultorio o Salón
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}