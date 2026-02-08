import { supabase } from '../lib/supabase';
import { User, LoginCredentials, RegisterData, RegisterDoctorData, UserRole } from '../types/user';

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const { email, password } = credentials;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return {
          success: false,
          message: authError.message === 'Invalid login credentials'
            ? 'Incorrect email or password'
            : authError.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return {
          success: false,
          message: 'Error fetching user profile'
        };
      }

      const user: User = {
        id: profile.id,
        idType: profile.id_type,
        nationalId: profile.national_id,
        firstNames: profile.first_names,
        lastNames: profile.last_names,
        birthDate: profile.birth_date,
        age: profile.age || 0,
        gender: profile.gender,
        mobilePhone: profile.mobile_phone,
        email: profile.email,
        address: profile.address,
        birthPlace: profile.birth_place,
        role: profile.role as UserRole,
        createdAt: profile.created_at,
      };

      // If user is a Doctor, fetch doctor-specific data
      if (user.role === 'Doctor') {
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!doctorError && doctorData) {
          // Add doctor specific fields to the user object or handle as needed
          // For now, let's just make sure we save the doctor data if needed
          // or we can extend the User type to include optional Doctor fields
          (user as any).doctorDetails = {
            ...doctorData,
            professionCategory: doctorData.profession_category // Ensure we map the category to camelCase if needed
          };
        }
      }

      authService.saveUser(user);

      return {
        success: true,
        user
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred'
      };
    }
  },

  registerDoctor: async (registerData: RegisterDoctorData): Promise<{ success: boolean; message?: string }> => {
    try {
      const {
        email, password, firstNames, lastNames, nationalId, idType,
        medicalLicenseNumber, specialty, consultationFee,
        degreeUniversity, graduationYear, yearsExperience, professionCategory, // Added
        office // Added
      } = registerData;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_names: firstNames,
            last_names: lastNames,
            national_id: nationalId,
            id_type: idType,
            role: 'Doctor',
            // Pass doctor specific data in metadata so the Trigger handles it
            profession_category: professionCategory || 'Medical',
            medical_license_number: medicalLicenseNumber || '',
            specialty: specialty,
            consultation_fee: consultationFee,
            // Nuevos datos
            degree_university: degreeUniversity || '',
            graduation_year: graduationYear || '',
            years_experience: yearsExperience,
            office: office || ''
          }
        }
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      // The Trigger (handle_new_user) will now create both the profile and the doctor record.
      // We don't need to manually insert into 'doctors' anymore, avoiding the RLS issue.

      if (!authData.user) {
        return { success: false, message: 'Failed to create user' };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  register: async (registerData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      const { email, password, firstNames, lastNames, nationalId, idType, role } = registerData;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_names: firstNames,
            last_names: lastNames,
            national_id: nationalId,
            id_type: idType,
            role: role || 'User' // Default role
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  saveUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  }
};