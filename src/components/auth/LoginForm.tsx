import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, User, Lock, AlertCircle, CheckCircle, Copy, Stethoscope } from 'lucide-react';
import { authService, LoginCredentials, User as UserType } from '@/services/authService';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginCredentials>({
    cedulaRif: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(true);

  // Credenciales de prueba
  const credencialesPrueba = [
    {
      tipo: 'Administrador',
      cedula: 'V12345678',
      password: 'admin123',
      nombre: 'Juan Carlos Pérez',
      color: 'bg-red-100 text-red-800'
    },
    {
      tipo: 'Médico',
      cedula: 'V87654321',
      password: 'medico123',
      nombre: 'María Elena López',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      tipo: 'Usuario',
      cedula: 'V11111111',
      password: 'usuario123',
      nombre: 'Ana Sofía García',
      color: 'bg-green-100 text-green-800'
    },
    {
      tipo: 'Médico',
      cedula: '11111111',
      password: 'medico123',
      nombre: 'Dr. Carlos Mendoza',
      color: 'bg-blue-100 text-blue-800'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(formData);
      
      if (result.success && result.user) {
        authService.saveUser(result.user);
        onLogin(result.user);
      } else {
        setError(result.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (cedula: string, password: string) => {
    setFormData({ cedulaRif: cedula, password });
    setLoading(true);
    setError('');

    try {
      const result = await authService.login({ cedulaRif: cedula, password });
      
      if (result.success && result.user) {
        authService.saveUser(result.user);
        onLogin(result.user);
      } else {
        setError(result.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = (cedula: string, password: string) => {
    navigator.clipboard.writeText(`${cedula} / ${password}`);
    setFormData({ cedulaRif: cedula, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sistema Médico</h1>
          <p className="text-slate-600 mt-1">Ingresa a tu cuenta</p>
        </div>

        {/* Credenciales de prueba */}
        {showCredentials && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  Credenciales de Prueba
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCredentials(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </CardTitle>
              <CardDescription className="text-xs">
                Haz clic en cualquier credencial para usarla automáticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {credencialesPrueba.map((cred, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => loginWithCredentials(cred.cedula, cred.password)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={cred.color} variant="secondary">
                        {cred.tipo}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-1">{cred.nombre}</p>
                    <p className="text-xs text-slate-500">{cred.cedula} / {cred.password}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCredentials(cred.cedula, cred.password);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Formulario de login */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cedulaRif">Cédula o RIF</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="cedulaRif"
                    type="text"
                    placeholder="V12345678"
                    value={formData.cedulaRif}
                    onChange={(e) => setFormData({ ...formData, cedulaRif: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600">
                ¿No tienes cuenta?{' '}
                <Button variant="link" className="p-0 h-auto font-normal">
                  Contacta al administrador
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Sistema Demo Funcional</p>
                <p className="text-xs text-green-700 mt-1">
                  Todas las funcionalidades están operativas. Usa las credenciales de prueba para explorar el sistema completo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}