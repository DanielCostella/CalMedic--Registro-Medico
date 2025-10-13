import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export default function RegisterPage({ onRegisterSuccess, onBackToLogin }: RegisterPageProps) {
  return (
    <RegisterForm 
      onRegisterSuccess={onRegisterSuccess} 
      onBackToLogin={onBackToLogin} 
    />
  );
}