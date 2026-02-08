import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

interface RegisterPageProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
}

export default function RegisterPage({ onRegisterSuccess, onBackToLogin }: RegisterPageProps) {
  const navigate = useNavigate();

  const handleSuccess = () => {
    if (onRegisterSuccess) {
      onRegisterSuccess();
    } else {
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate('/login');
    }
  };

  return (
    <RegisterForm 
      onRegisterSuccess={handleSuccess} 
      onBackToLogin={handleBack} 
    />
  );
}