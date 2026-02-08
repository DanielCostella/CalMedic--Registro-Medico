import { supabase } from '../lib/supabase';
import { DoctorData } from '../types/doctor';
import { User, UserRole } from '../types/user';
import { Appointment, Patient } from '../types/medical';

class DoctorService {
    async createDoctor(doctorData: DoctorData): Promise<{ success: boolean; doctor?: User; message?: string }> {
        try {
            // First, create the user in Auth if they don't exist (assuming this is an admin creating a doctor)
            // or if they are already registered as a user, we upgrade them.
            // For now, let's assume we are inserting into the doctors table for an existing profile.

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', doctorData.email)
                .single();

            if (profileError || !profile) {
                return { success: false, message: 'User profile not found. Please register the user first.' };
            }

            const { error: doctorError } = await supabase
                .from('doctors')
                .insert({
                    id: profile.id,
                    medical_license_number: doctorData.medicalLicenseNumber,
                    specialty: doctorData.specialty,
                    subspecialty: doctorData.subspecialty,
                    degree_university: doctorData.degreeUniversity,
                    graduation_year: doctorData.graduationYear,
                    years_experience: doctorData.yearsExperience,
                    office: doctorData.office,
                    consultation_hours: doctorData.consultationHours,
                    consultation_fee: doctorData.consultationFee,
                    languages: doctorData.languages,
                    certifications: doctorData.certifications,
                    hospital_affiliation: doctorData.hospitalAffiliation,
                    accepted_insurances: doctorData.acceptedInsurances,
                    office_phone: doctorData.officePhone,
                    office_address: doctorData.officeAddress,
                    license_status: doctorData.licenseStatus,
                    license_expiry_date: doctorData.licenseExpiryDate
                });

            if (doctorError) {
                return { success: false, message: doctorError.message };
            }

            // Update role to Doctor in profiles
            await supabase.from('profiles').update({ role: 'Doctor' }).eq('id', profile.id);

            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async getDoctors(): Promise<DoctorData[]> {
        const { data, error } = await supabase
            .from('doctors')
            .select('*, profiles(*)');

        if (error) {
            console.error('Error fetching doctors:', error);
            return [];
        }

        return data.map(this.mapToDoctorData);
    }

    async getDoctorById(id: string): Promise<DoctorData | null> {
        const { data, error } = await supabase
            .from('doctors')
            .select('*, profiles(*)')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        return this.mapToDoctorData(data);
    }

    // --- Insurance Management ---
    
    async getAllInsurances(): Promise<{id: string, name: string}[]> {
        const { data, error } = await supabase
            .from('insurance_providers')
            .select('id, name')
            .order('name');
        
        if (error) {
            console.error('Error fetching insurances:', error);
            return [];
        }
        return data || [];
    }

    async getDoctorInsuranceIds(doctorId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('doctor_insurances')
            .select('insurance_provider_id')
            .eq('doctor_id', doctorId);

        if (error) {
            console.error('Error fetching doctor insurances:', error);
            return [];
        }
        return data.map(d => d.insurance_provider_id);
    }

    async updateDoctorInsurances(doctorId: string, insuranceIds: string[]): Promise<boolean> {
        try {
            // 1. Delete existing (RLS allows deleting own)
            const { error: deleteError } = await supabase
                .from('doctor_insurances')
                .delete()
                .eq('doctor_id', doctorId);
            
            if (deleteError) throw deleteError;

            if (insuranceIds.length === 0) return true;

            // 2. Insert new
            const rows = insuranceIds.map(id => ({
                doctor_id: doctorId,
                insurance_provider_id: id
            }));

            const { error: insertError } = await supabase
                .from('doctor_insurances')
                .insert(rows);

            if (insertError) throw insertError;

            return true;
        } catch (error) {
            console.error('Error updating doctor insurances:', error);
            return false;
        }
    }

    async updateDoctor(id: string, updates: Partial<DoctorData>): Promise<boolean> {
        const { error } = await supabase
            .from('doctors')
            .update(updates)
            .eq('id', id);

        return !error;
    }

    async deleteDoctor(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('doctors')
            .delete()
            .eq('id', id);

        return !error;
    }

    async getAppointments(doctorId: string): Promise<Appointment[]> {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctorId)
            .order('date', { ascending: true })
            .order('time', { ascending: true });

        if (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }

        return data.map(this.mapToAppointment);
    }

    async getPatients(doctorId: string): Promise<Patient[]> {
        // Enforce Data Isolation:
        // Fetch patients that have either an appointment OR a medical record with this doctor.
        try {
            const { data: appointments } = await supabase
                .from('appointments')
                .select('patient_id')
                .eq('doctor_id', doctorId);

            const { data: records } = await supabase
                .from('medical_records')
                .select('patient_id')
                .eq('doctor_id', doctorId);

            const patientIds = new Set([
                ...(appointments?.map(a => a.patient_id) || []),
                ...(records?.map(r => r.patient_id) || [])
            ]);

            if (patientIds.size === 0) return [];

            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .in('id', Array.from(patientIds));

            if (error) {
                console.error('Error fetching patients:', error);
                return [];
            }

            return data.map(this.mapToPatient);
        } catch (error) {
            console.error("Error in getPatients:", error);
            return [];
        }
    }

    async createPatient(patientData: any, doctorId?: string): Promise<{ success: boolean; data?: Patient; message?: string }> {
        try {
            // Validación de Campos Obligatorios
            if (!patientData.email || !patientData.phone) {
                return { success: false, message: 'Faltan datos de contacto: Email y Teléfono son obligatorios.' };
            }

            const names = (patientData.name || '').split(' ');
            const firstName = names[0] || 'Unknown';
            const lastName = names.slice(1).join(' ') || 'Patient';

            let birthDateStr: string | null = patientData.birthDate || null;
            if (!birthDateStr && patientData.age) {
                const currentYear = new Date().getFullYear();
                const birthYear = currentYear - (parseInt(patientData.age) || 30);
                birthDateStr = `${birthYear}-01-01`;
            }

            const nationalId = patientData.nationalId || `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const { data: existingPatient } = await supabase
                .from('patients')
                .select('*')
                .eq('national_id', nationalId)
                .single();

            if (existingPatient) {
                // If patient exists, we ideally check if they are linked to this doctor. 
                // If not, we might want to "link" them? 
                // For now, return error as duplicate DNI implies a conflict or need to search and "Import" patient.
                // But for Isolation, maybe we allow re-linking? 
                // Let's standardly return duplicate error for now to avoid confusion.
                return { success: false, message: 'Un paciente con este DNI ya existe en el sistema.' };
            }

            const { data, error } = await supabase
                .from('patients')
                .insert({
                    first_name: firstName,
                    last_name: lastName,
                    national_id: nationalId,
                    birth_date: birthDateStr,
                    phone: patientData.phone,
                    email: patientData.email,
                    status: 'Active'
                })
                .select()
                .single();

            if (error) return { success: false, message: error.message };

            // ISOLATION: Automatically link patient to the doctor via an initial record
            if (doctorId && data) {
                await this.createMedicalRecord({
                    patientId: data.id,
                    doctorId: doctorId,
                    diagnosis: 'Initial Registration',
                    notes: `Patient registered by Dr. via Aesthetic Dashboard.`,
                    symptoms: '',
                    prescription: '',
                    vitalSigns: {}
                });
            }

            return { success: true, data: this.mapToPatient(data) };
        } catch (error: any) {
            return { success: false, message: error.message || 'Error creating patient' };
        }
    }

    async createMedicalRecord(record: {
        patientId: string;
        doctorId: string;
        appointmentId?: string;
        diagnosis?: string;
        symptoms?: string;
        notes?: string;
        prescription?: string;
        vitalSigns?: any;
    }): Promise<{ success: boolean; data?: any; message?: string }> {
        try {
            const { data, error } = await supabase
                .from('medical_records')
                .insert({
                    patient_id: record.patientId,
                    doctor_id: record.doctorId,
                    appointment_id: record.appointmentId,
                    diagnosis: record.diagnosis,
                    symptoms: record.symptoms,
                    notes: record.notes,
                    prescription: record.prescription,
                    vital_signs: record.vitalSigns
                })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async getPatientHistory(patientId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('medical_records')
            .select(`
                *,
                doctors:doctor_id (
                    specialty,
                    profiles (first_names, last_names)
                )
            `)
            .eq('patient_id', patientId)
            .order('visit_date', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error);
            return [];
        }
        return data || [];
    }

    async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<{ success: boolean; data?: Appointment; message?: string }> {
        const snakeAppointment = {
            patient_id: appointment.patientId,
            doctor_id: appointment.doctorId,
            patient_name: appointment.patientName,
            date: appointment.date,
            time: appointment.time,
            duration: appointment.duration,
            reason: appointment.reason,
            status: appointment.status,
            notes: appointment.notes,
            type: appointment.type,
            reminder: appointment.reminder,
            priority: appointment.priority
        };

        const { data, error } = await supabase
            .from('appointments')
            .insert(snakeAppointment)
            .select()
            .single();

        if (error) return { success: false, message: error.message };
        return { success: true, data: this.mapToAppointment(data) };
    }

    async updateAppointmentStatus(id: string, status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show' | 'In Progress'): Promise<boolean> {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id);

        return !error;
    }

    async getStatistics() {
        const { data: doctors, error } = await supabase.from('doctors').select('specialty, license_status, years_experience');

        if (error || !doctors) return null;

        const totalDoctors = doctors.length;
        const specialties = [...new Set(doctors.map(d => d.specialty))];
        const activeDoctors = doctors.filter(d => d.license_status === 'Active').length;
        const avgExperience = totalDoctors > 0
            ? Math.round(doctors.reduce((sum, d) => sum + d.years_experience, 0) / totalDoctors)
            : 0;

        return {
            totalDoctors,
            specialtiesCount: specialties.length,
            activeDoctors,
            avgExperience,
            specialtyDistribution: specialties.map(spec => ({
                specialty: spec,
                count: doctors.filter(d => d.specialty === spec).length
            }))
        };
    }

    private mapToAppointment(row: any): Appointment {
        return {
            id: row.id,
            patientId: row.patient_id,
            doctorId: row.doctor_id,
            patientName: row.patient_name,
            date: row.date,
            time: row.time,
            duration: row.duration,
            reason: row.reason,
            status: row.status,
            notes: row.notes,
            type: row.type,
            reminder: row.reminder,
            priority: row.priority
        };
    }

    private mapToPatient(row: any): Patient {
        return {
            id: row.id,
            nationalId: row.national_id,
            firstName: row.first_name,
            lastName: row.last_name,
            birthDate: row.birth_date,
            gender: row.gender,
            phone: row.phone,
            email: row.email,
            address: row.address,
            bloodType: row.blood_type,
            allergies: row.allergies || [],
            emergencyContact: {
                name: row.emergency_contact_name,
                phone: row.emergency_contact_phone,
                relationship: row.emergency_contact_relationship
            },
            medicalInsurance: row.medical_insurance,
            registrationDate: row.registration_date,
            status: row.status
        };
    }

    async getNextSequentialId(prefix: string = 'CLI'): Promise<string> {
        // Find the latest patient created with a format like "PREFIX-XXXX"
        const { data, error } = await supabase
            .from('patients')
            .select('national_id')
            .ilike('national_id', `${prefix}-%`)
            .order('created_at', { ascending: false })
            .limit(1);

        if (error || !data || data.length === 0) {
            return `${prefix}-0001`;
        }

        const lastId = data[0].national_id;
        // Handle potential different formats or dirty data
        const parts = lastId.split('-');
        if (parts.length < 2) return `${prefix}-0001`;

        const numberPart = parseInt(parts[1]);

        if (isNaN(numberPart)) {
            return `${prefix}-0001`;
        }

        const nextNumber = numberPart + 1;
        return `${prefix}-${nextNumber.toString().padStart(4, '0')}`;
    }

    private mapToDoctorData(row: any): DoctorData {
        const profile = row.profiles;
        return {
            idType: profile.id_type,
            nationalId: profile.national_id,
            firstNames: profile.first_names,
            lastNames: profile.last_names,
            birthDate: profile.birth_date,
            gender: profile.gender,
            mobilePhone: profile.mobile_phone,
            email: profile.email,
            address: profile.address,
            birthPlace: profile.birth_place,
            password: '', // Password is not returned
            medicalLicenseNumber: row.medical_license_number,
            specialty: row.specialty,
            subspecialty: row.subspecialty,
            degreeUniversity: row.degree_university,
            graduationYear: row.graduation_year,
            yearsExperience: row.years_experience,
            office: row.office,
            consultationHours: row.consultation_hours,
            consultationFee: row.consultation_fee,
            languages: row.languages,
            certifications: row.certifications,
            hospitalAffiliation: row.hospital_affiliation,
            acceptedInsurances: row.accepted_insurances,
            officePhone: row.office_phone,
            officeAddress: row.office_address,
            licenseStatus: row.license_status,
            licenseExpiryDate: row.license_expiry_date
        };
    }
}

export const doctorService = new DoctorService();
