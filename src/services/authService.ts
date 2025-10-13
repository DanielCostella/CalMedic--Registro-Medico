// Simulación de servicio de autenticación
export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  cedula: string;
  rol: 'admin' | 'medico' | 'usuario';
  especialidad?: string;
  telefono?: string;
}

export interface LoginCredentials {
  cedulaRif: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// Base de datos simulada de usuarios
const usuarios: User[] = [
  {
    id: '1',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez González',
    email: 'admin@clinica.com',
    cedula: 'V12345678',
    rol: 'admin',
    telefono: '+58 414-1234567'
  },
  {
    id: '2', 
    nombres: 'María Elena',
    apellidos: 'López Rodríguez',
    email: 'maria.lopez@clinica.com',
    cedula: 'V87654321',
    rol: 'medico',
    especialidad: 'Cardiología',
    telefono: '+58 424-9876543'
  },
  {
    id: '3',
    nombres: 'Ana Sofía',
    apellidos: 'García Martínez',
    email: 'ana.garcia@clinica.com', 
    cedula: 'V11111111',
    rol: 'usuario',
    telefono: '+58 412-5555555'
  },
  {
    id: '4',
    nombres: 'Carlos Alberto',
    apellidos: 'Mendoza Silva',
    email: 'carlos.mendoza@clinica.com',
    cedula: '11111111',
    rol: 'medico',
    especialidad: 'Medicina Interna',
    telefono: '+58 416-1111111'
  },
  {
    id: '5',
    nombres: 'Ana Beatriz',
    apellidos: 'Rodríguez López',
    email: 'ana.rodriguez@clinica.com',
    cedula: '22222222', 
    rol: 'medico',
    especialidad: 'Pediatría',
    telefono: '+58 426-2222222'
  },
  {
    id: '6',
    nombres: 'Luis Fernando',
    apellidos: 'García Pérez',
    email: 'luis.garcia@clinica.com',
    cedula: '33333333',
    rol: 'medico',
    especialidad: 'Neurología',
    telefono: '+58 414-3333333'
  },
  {
    id: '7',
    nombres: 'María José',
    apellidos: 'López Martínez',
    email: 'maria.lopez2@clinica.com',
    cedula: '44444444',
    rol: 'medico',
    especialidad: 'Ginecología',
    telefono: '+58 424-4444444'
  }
];

// Credenciales válidas (cedula -> password)
const credenciales: Record<string, string> = {
  'V12345678': 'admin123',
  'V87654321': 'medico123',
  'V11111111': 'usuario123',
  '11111111': 'medico123',
  '22222222': 'medico123', 
  '33333333': 'medico123',
  '44444444': 'medico123',
  '12345678': 'Admin123',
  '87654321': 'User123'
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { cedulaRif, password } = credentials;
    
    // Verificar credenciales
    if (!credenciales[cedulaRif] || credenciales[cedulaRif] !== password) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }
    
    // Buscar usuario
    const usuario = usuarios.find(u => u.cedula === cedulaRif);
    
    if (!usuario) {
      return {
        success: false,
        message: 'Usuario no encontrado'
      };
    }
    
    return {
      success: true,
      user: usuario
    };
  },

  logout: () => {
    // Limpiar datos de sesión si es necesario
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