import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { RegisterData } from '../../types/user';
import { calculateAge, validatePassword, validateEmail, validateCedula, validatePhone } from '../../utils/validation';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export default function RegisterForm({ onRegisterSuccess, onBackToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    rifInitial: 'V',
    cedula: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: 'Femenino',
    telefonoMovil: '',
    correoElectronico: '',
    direccion: '',
    lugarNacimiento: '',
    password: ''
  });
  
  const [edad, setEdad] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (formData.fechaNacimiento) {
      const calculatedAge = calculateAge(formData.fechaNacimiento);
      setEdad(calculatedAge);
    }
  }, [formData.fechaNacimiento]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'cedula': {
        return !validateCedula(value) ? 'Cédula debe tener máximo 9 dígitos' : '';
      }
      case 'correoElectronico': {
        return !validateEmail(value) ? 'Correo electrónico inválido' : '';
      }
      case 'telefonoMovil': {
        return !validatePhone(value) ? 'Teléfono debe tener exactamente 10 dígitos' : '';
      }
      case 'password': {
        const passwordValidation = validatePassword(value);
        return !passwordValidation.isValid ? passwordValidation.message : '';
      }
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validar campo en tiempo real
    const fieldError = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: fieldError }));
    
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar edad
    if (edad < 18) {
      setError('Debe ser mayor de 18 años para registrarse');
      setLoading(false);
      return;
    }

    // Validar todos los campos
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const fieldError = validateField(key, formData[key as keyof RegisterData]);
      if (fieldError) errors[key] = fieldError;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Por favor corrija los errores en el formulario');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register(formData);
      if (result.success) {
        onRegisterSuccess();
      } else {
        setError(result.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToLogin}
            className="absolute left-4 top-4 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">EL</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Crear Cuenta</CardTitle>
          <CardDescription className="text-slate-600">
            Complete todos los campos para registrarse
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            
            {/* RIF y Cédula */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Inicial RIF</Label>
                <Select value={formData.rifInitial} onValueChange={(value: 'V' | 'E' | 'J' | 'P' | 'G' | 'M') => handleInputChange('rifInitial', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="J">J</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="cedula" className="text-slate-700">Cédula</Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="12345678"
                  maxLength={9}
                  value={formData.cedula}
                  onChange={(e) => handleInputChange('cedula', e.target.value.replace(/\D/g, ''))}
                  className={`border-slate-200 focus:border-blue-500 ${fieldErrors.cedula ? 'border-red-300' : ''}`}
                  required
                />
                {fieldErrors.cedula && <p className="text-sm text-red-600">{fieldErrors.cedula}</p>}
              </div>
            </div>

            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres" className="text-slate-700">Nombres</Label>
                <Input
                  id="nombres"
                  type="text"
                  placeholder="Juan Carlos"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange('nombres', e.target.value)}
                  className="border-slate-200 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apellidos" className="text-slate-700">Apellidos</Label>
                <Input
                  id="apellidos"
                  type="text"
                  placeholder="Pérez García"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange('apellidos', e.target.value)}
                  className="border-slate-200 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Fecha de Nacimiento, Edad y Sexo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento" className="text-slate-700">Fecha de Nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                  className="border-slate-200 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700">Edad</Label>
                <Input
                  type="text"
                  value={edad > 0 ? `${edad} años` : ''}
                  readOnly
                  className={`border-slate-200 bg-slate-50 ${edad < 18 ? 'border-red-300 bg-red-50' : ''}`}
                />
                {edad > 0 && edad < 18 && (
                  <p className="text-sm text-red-600">Debe ser mayor de 18 años</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700">Sexo</Label>
                <Select value={formData.sexo} onValueChange={(value: 'Femenino' | 'Masculino') => handleInputChange('sexo', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Teléfono y Correo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefonoMovil" className="text-slate-700">Teléfono Móvil</Label>
                <Input
                  id="telefonoMovil"
                  type="text"
                  placeholder="4141234567"
                  maxLength={10}
                  value={formData.telefonoMovil}
                  onChange={(e) => handleInputChange('telefonoMovil', e.target.value.replace(/\D/g, ''))}
                  className={`border-slate-200 focus:border-blue-500 ${fieldErrors.telefonoMovil ? 'border-red-300' : ''}`}
                  required
                />
                {fieldErrors.telefonoMovil && <p className="text-sm text-red-600">{fieldErrors.telefonoMovil}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="correoElectronico" className="text-slate-700">Correo Electrónico</Label>
                <Input
                  id="correoElectronico"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={formData.correoElectronico}
                  onChange={(e) => handleInputChange('correoElectronico', e.target.value)}
                  className={`border-slate-200 focus:border-blue-500 ${fieldErrors.correoElectronico ? 'border-red-300' : ''}`}
                  required
                />
                {fieldErrors.correoElectronico && <p className="text-sm text-red-600">{fieldErrors.correoElectronico}</p>}
              </div>
            </div>

            {/* Dirección y Lugar de Nacimiento */}
            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-slate-700">Dirección</Label>
              <Textarea
                id="direccion"
                placeholder="Av. Principal, Edificio..., Piso..., Apartamento..."
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                className="border-slate-200 focus:border-blue-500 min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lugarNacimiento" className="text-slate-700">Lugar de Nacimiento</Label>
              <Input
                id="lugarNacimiento"
                type="text"
                placeholder="Caracas, Venezuela"
                value={formData.lugarNacimiento}
                onChange={(e) => handleInputChange('lugarNacimiento', e.target.value)}
                className="border-slate-200 focus:border-blue-500"
                required
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`border-slate-200 focus:border-blue-500 pr-10 ${fieldErrors.password ? 'border-red-300' : ''}`}
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
              {fieldErrors.password && <p className="text-sm text-red-600">{fieldErrors.password}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 transition-all duration-200 mt-6"
              disabled={loading || edad < 18}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}