import { supabase } from '../lib/supabase';
import { Doctor, Patient, Appointment } from '../types/medical';

export const publicService = {
    // 1. Get Doctors by Specialty (Medical vs Aesthetic vs Beauty)
    async getDoctorsBySpecialty(type: 'Medical' | 'Aesthetic' | 'Beauty'): Promise<Doctor[]> {
        try {
            console.log('Fetching doctors of type:', type);

            // Fetch doctors filtered by professional_type
            // Also fetch their linked insurance providers
            const { data, error } = await supabase
                .from('doctors')
                .select(`
                    id,
                    specialty,
                    medical_license_number,
                    profiles!inner (
                        first_names,
                        last_names,
                        email,
                        professional_type,
                        created_at
                    ),
                    doctor_insurances (
                        insurance_providers (
                            name
                        )
                    )
                `)
                .eq('profiles.professional_type', type);

            if (error) {
                console.error('Error fetching doctors:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                return [];
            }

            if (!data || data.length === 0) {
                console.warn(`No doctors found for type: ${type}`);
                return [];
            }

            console.log(`Doctors fetched successfully for ${type}:`, data.length);

            // Map to Doctor type using correct column names
            return data.map(d => {
                const profile = d.profiles as any;
                // Flatten insurance providers
                const insurances = d.doctor_insurances?.map((di: any) => di.insurance_providers?.name).filter(Boolean) || [];

                return {
                    id: d.id,
                    nationalId: '',
                    firstName: profile?.first_names || 'Doctor',
                    lastName: profile?.last_names || '',
                    specialty: d.specialty || 'General',
                    email: profile?.email || '',
                    phone: profile?.phone || '',
                    licenseNumber: d.medical_license_number || '',
                    registrationDate: profile?.created_at || '',
                    status: 'Active' as const,
                    insuranceProviders: insurances,
                    officeHours: {}
                };
            });
        } catch (error) {
            console.error('Exception in getDoctorsBySpecialty:', error);
            return [];
        }
    },

    // New: Get all unique specialties for the search dropdown
    async getUniqueSpecialties(): Promise<string[]> {
        const { data, error } = await supabase
            .from('doctors')
            .select('specialty');
        
        if (error) {
            console.error('Error fetching specialties:', error);
            return [];
        }

        // Extract and deduplicate
        const specialties = data.map(d => d.specialty).filter(Boolean);
        return [...new Set(specialties)].sort();
    },

    // 1.5 Get All Insurance Providers
    async getInsuranceProviders(): Promise<{id: string, name: string}[]> {
        const { data, error } = await supabase
            .from('insurance_providers')
            .select('id, name')
            .order('name');
        
        if (error) {
            console.error('Error fetching insurances:', error);
            return [];
        }
        return data || [];
    },

    // 2. Get Available Slots (Enforcing 45 Minute duration)
    async getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
        // Define working hours (e.g., 9:00 to 18:00)
        const startHour = 9;
        const endHour = 18;
        const intervalQuery = 45; // minutes
        
        // Fetch existing appointments for that doctor and date
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select('time, duration')
            .eq('doctor_id', doctorId)
            .eq('date', date)
            .neq('status', 'Cancelled');

        if (error) throw error;

        // Helper to convert "HH:MM:SS" to minutes from midnight
        const toMinutes = (timeStr: string) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        // Helper to convert minutes from midnight to "HH:MM"
        const toTimeStr = (totalMinutes: number) => {
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        };

        const busyIntervals = appointments?.map(app => {
            const start = toMinutes(app.time);
            const dur = app.duration || 60; 
            return { start, end: start + dur };
        }) || [];

        const slots: string[] = [];
        let currentMinutes = startHour * 60;
        const endMinutes = endHour * 60;

        while (currentMinutes + intervalQuery <= endMinutes) {
            const slotStart = currentMinutes;
            const slotEnd = currentMinutes + intervalQuery;

            // Check collision with ANY existing appointment
            const isTaken = busyIntervals.some(busy => {
                // Returns true if overlap exists
                // Overlap condition: Not (EndA <= StartB or StartA >= EndB)
                return !(slotEnd <= busy.start || slotStart >= busy.end);
            });

            if (!isTaken) {
                slots.push(toTimeStr(slotStart));
            }

            // Next slot
            currentMinutes += intervalQuery;
        }

        return slots;
    },

    // 3. Book Appointment (Guest Flow)
    async bookGuestAppointment(
        guestDetails: { name: string; dni: string; phone: string; email?: string },
        appointmentDetails: { doctorId: string; date: string; time: string; reason: string }
    ): Promise<{ success: boolean; message?: string; appointmentId?: string }> {
        try {
            // Updated to use Secure RPC to avoid RLS issues on 'patients' table
            const { data, error } = await supabase.rpc('book_appointment_public_v2', {
                p_name: guestDetails.name,
                p_dni: guestDetails.dni,
                p_phone: guestDetails.phone,
                p_email: guestDetails.email || '',
                p_doctor_id: appointmentDetails.doctorId,
                p_date: appointmentDetails.date,
                p_time: appointmentDetails.time,
                p_reason: appointmentDetails.reason
            });

            if (error) throw error;

            if (data && data.success) {
                 return { success: true, appointmentId: data.appointment_id };
            } else {
                 return { success: false, message: data?.message || 'Unknown error' };
            }

        } catch (error: any) {
            console.error('Booking Error:', error);
            return { success: false, message: error.message };
        }
    }
};
