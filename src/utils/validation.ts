export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe tener al menos una mayúscula' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe tener al menos un número' };
  }
  
  return { isValid: true, message: '' };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCedula = (cedula: string): boolean => {
  return /^\d{1,9}$/.test(cedula);
};

export const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};