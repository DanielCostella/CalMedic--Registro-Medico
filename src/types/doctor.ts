export interface DoctorData {
    // Basic personal data (inherited from RegisterData logic)
    idType: 'V' | 'E' | 'J' | 'P' | 'G' | 'M';
    nationalId: string;
    firstNames: string;
    lastNames: string;
    birthDate: string;
    gender: 'Female' | 'Male';
    mobilePhone: string;
    email: string;
    address: string;
    birthPlace: string;
    password: string;

    // Doctor specific data
    medicalLicenseNumber: string;
    specialty: string;
    subspecialty?: string;
    degreeUniversity: string;
    graduationYear: number;
    yearsExperience: number;
    office?: string;
    consultationHours?: string;
    consultationFee?: number;
    languages: string[];
    certifications: string[];

    // Additional professional data
    hospitalAffiliation?: string;
    acceptedInsurances: string[];
    officePhone?: string;
    officeAddress?: string;

    // Professional status
    licenseStatus: 'Active' | 'Suspended' | 'In Review';
    licenseExpiryDate: string;
}

export interface Specialty {
    id: string;
    name: string;
    subspecialties?: string[];
}

export interface Insurance {
    id: string;
    name: string;
}

export const MEDICAL_SPECIALTIES: Specialty[] = [
    {
        id: 'general-medicine',
        name: 'General Medicine',
        subspecialties: ['Family Medicine', 'Preventive Medicine']
    },
    {
        id: 'cardiology',
        name: 'Cardiology',
        subspecialties: ['Interventional Cardiology', 'Electrophysiology', 'Pediatric Cardiology']
    },
    {
        id: 'neurology',
        name: 'Neurology',
        subspecialties: ['Pediatric Neurology', 'Neurophysiology', 'Vascular Neurology']
    },
    {
        id: 'gynecology',
        name: 'Gynecology and Obstetrics',
        subspecialties: ['Maternal-Fetal Medicine', 'Gynecologic Oncology', 'Human Reproduction']
    },
    {
        id: 'pediatrics',
        name: 'Pediatrics',
        subspecialties: ['Neonatology', 'Pediatric Intensive Care', 'Pediatric Endocrinology']
    },
    {
        id: 'traumatology',
        name: 'Traumatology and Orthopedics',
        subspecialties: ['Spine Surgery', 'Arthroscopy', 'Pediatric Traumatology']
    },
    {
        id: 'dermatology',
        name: 'Dermatology',
        subspecialties: ['Cosmetic Dermatology', 'Dermatopathology', 'Pediatric Dermatology']
    },
    {
        id: 'psychiatry',
        name: 'Psychiatry',
        subspecialties: ['Child Psychiatry', 'Geriatric Psychiatry', 'Addiction Psychiatry']
    }
];

export const MEDICAL_INSURANCES: Insurance[] = [
    { id: 'social-security', name: 'Mandatory Social Security' },
    { id: 'horizonte-insurance', name: 'Horizonte Insurance' },
    { id: 'mercantil-insurance', name: 'Mercantil Insurance' },
    { id: 'mapfre', name: 'MAPFRE' },
    { id: 'caracas-insurance', name: 'Caracas Insurance' },
    { id: 'occidental', name: 'Occidental Insurance' },
    { id: 'private', name: 'Private Patients' }
];
