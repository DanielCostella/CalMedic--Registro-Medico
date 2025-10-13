export interface User {
  id: string;
  rifInitial: 'V' | 'E' | 'J' | 'P' | 'G' | 'M';
  cedula: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  edad: number;
  sexo: 'Femenino' | 'Masculino';
  telefonoMovil: string;
  correoElectronico: string;
  direccion: string;
  lugarNacimiento: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export type UserRole = 'Administrador' | 'Usuario' | 'Médico';

export interface LoginCredentials {
  cedulaRif: string;
  password: string;
}

export interface RegisterData {
  rifInitial: 'V' | 'E' | 'J' | 'P' | 'G' | 'M';
  cedula: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: 'Femenino' | 'Masculino';
  telefonoMovil: string;
  correoElectronico: string;
  direccion: string;
  lugarNacimiento: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}