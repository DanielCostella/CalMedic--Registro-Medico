import { supabase } from '../lib/supabase';
import { Establishment, EstablishmentMember } from '../types/establishment';
import { User } from '../types/user';

class EstablishmentService {
    
    // Obtener todos los establecimientos (para el directorio)
    async getAllEstablishments(): Promise<Establishment[]> {
        const { data, error } = await supabase
            .from('establishments')
            .select('*')
            .order('name');
        
        if (error) {
            console.error('Error fetching establishments:', error);
            return [];
        }
        return data as Establishment[];
    }

    // Obtener establecimientos por tipo (ej: solo Clinicas)
    async getEstablishmentsByType(type: string): Promise<Establishment[]> {
        const { data, error } = await supabase
            .from('establishments')
            .select('*')
            .eq('type', type)
            .order('name');
            
        if (error) throw error;
        return data as Establishment[];
    }

    // Buscar profesionales que trabajan en un establecimiento especifico
    // Esta es la funcion clave para "filtrar esos 5 médicos por clínica"
    async getProfessionalsByEstablishment(establishmentId: string): Promise<User[]> {
        const { data, error } = await supabase
            .from('establishment_members')
            .select(`
                profile_id,
                profiles:profile_id (
                    *,
                    doctors (*)
                )
            `)
            .eq('establishment_id', establishmentId);

        if (error) {
            console.error('Error fetching members:', error);
            return [];
        }

        // Mapear la respuesta compleja de Supabase a nuestra interfaz User
        return data.map((item: any) => {
            // Aseguramos que profiles sea tratado como objeto, por si Supabase lo devuelve como array
            const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
            return {
                ...profile,
                doctorDetails: profile?.doctors
            };
        }) as User[];
    }

    // Crear un nuevo establecimiento (para admins o dueños)
    async createEstablishment(establishment: Partial<Establishment>): Promise<Establishment | null> {
        const { data, error } = await supabase
            .from('establishments')
            .insert(establishment)
            .select()
            .single();
            
        if (error) {
            console.error('Error creating establishment:', error);
            return null;
        }
        return data;
    }
}

export const establishmentService = new EstablishmentService();
