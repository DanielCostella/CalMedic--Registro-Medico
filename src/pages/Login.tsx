import React from 'react';
import LoginForm from '../components/auth/LoginForm';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onLoginSuccess, onSwitchToRegister }: LoginPageProps) {
  return (
    <LoginForm 
      onLoginSuccess={onLoginSuccess} 
      onSwitchToRegister={onSwitchToRegister} 
    />
  );
}