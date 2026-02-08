export type EstablishmentType = 'Clinic' | 'Aesthetic Center' | 'Beauty Salon' | 'Other';

export interface Establishment {
    id: string;
    name: string;
    type: EstablishmentType;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo_url?: string;
    created_at: string;
}

export interface EstablishmentMember {
    id: string;
    establishment_id: string;
    profile_id: string;
    role_in_establishment: 'Admin' | 'Staff' | 'Owner' | 'Member';
    joined_at: string;
    // Expanded details for UI
    profile?: {
        first_names: string;
        last_names: string;
        email: string;
        role: string;
    };
    establishment?: Establishment;
}
