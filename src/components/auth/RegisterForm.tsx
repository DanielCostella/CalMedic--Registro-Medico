import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';
import { RegisterData } from '@/types/user';
import { calculateAge, validatePassword, validateEmail, validateNationalId, validatePhone } from '@/utils/validation';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export default function RegisterForm({ onRegisterSuccess, onBackToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    idType: 'V',
    nationalId: '',
    firstNames: '',
    lastNames: '',
    birthDate: '',
    gender: 'Female',
    mobilePhone: '',
    email: '',
    address: '',
    birthPlace: '',
    password: ''
  });

  const [age, setAge] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (formData.birthDate) {
      const calculatedAge = calculateAge(formData.birthDate);
      setAge(calculatedAge);
    }
  }, [formData.birthDate]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'nationalId': {
        return !validateNationalId(value) ? 'ID must have up to 9 digits' : '';
      }
      case 'email': {
        return !validateEmail(value) ? 'Invalid email address' : '';
      }
      case 'mobilePhone': {
        return !validatePhone(value) ? 'Phone must have exactly 10 digits' : '';
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
    const fieldError = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: fieldError }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (age < 18) {
      setError('You must be at least 18 years old to register');
      setLoading(false);
      return;
    }

    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const fieldError = validateField(key, formData[key as keyof RegisterData]);
      if (fieldError) errors[key] = fieldError;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please correct the errors in the form');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register(formData);
      if (result.success) {
        onRegisterSuccess();
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
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
            Back
          </Button>

          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">CM</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Create Account</CardTitle>
          <CardDescription className="text-slate-600">
            Fill in all fields to register
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {/* ID Type and National ID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700">ID Type</Label>
                <Select value={formData.idType} onValueChange={(value: 'V' | 'E' | 'J' | 'P' | 'G' | 'M') => handleInputChange('idType', value)}>
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
                <Label htmlFor="nationalId" className="text-slate-700">National ID</Label>
                <Input
                  id="nationalId"
                  type="text"
                  placeholder="12345678"
                  maxLength={9}
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange('nationalId', e.target.value.replace(/\D/g, ''))}
                  className={`border-slate-200 focus:border-blue-500 ${fieldErrors.nationalId ? 'border-red-300' : ''}`}
                  required
                />
                {fieldErrors.nationalId && <p className="text-sm text-red-600">{fieldErrors.nationalId}</p>}
              </div>
            </div>

            {/* First and Last Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstNames" className="text-slate-700">First Names</Label>
                <Input
                  id="firstNames"
                  type="text"
                  placeholder="John Doe"
                  value={formData.firstNames}
                  onChange={(e) => handleInputChange('firstNames', e.target.value)}
                  className="border-slate-200 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastNames" className="text-slate-700">Last Names</Label>
                <Input
                  id="lastNames"
                  type="text"
                  placeholder="Smith Jones"
                  value={formData.lastNames}
                  onChange={(e) => handleInputChange('lastNames', e.target.value)}
                  className="border-slate-200 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Birth Date, Age and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-slate-700">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="border-slate-200 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Age</Label>
                <Input
                  type="text"
                  value={age > 0 ? `${age} years` : ''}
                  readOnly
                  className={`border-slate-200 bg-slate-50 ${age < 18 ? 'border-red-300 bg-red-50' : ''}`}
                />
                {age > 0 && age < 18 && (
                  <p className="text-sm text-red-600">Must be at least 18</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Gender</Label>
                <Select value={formData.gender} onValueChange={(value: 'Female' | 'Male') => handleInputChange('gender', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobilePhone" className="text-slate-700">Mobile Phone</Label>
                <Input
                  id="mobilePhone"
                  type="text"
                  placeholder="4141234567"
                  maxLength={10}
                  value={formData.mobilePhone}
                  onChange={(e) => handleInputChange('mobilePhone', e.target.value.replace(/\D/g, ''))}
                  className={`border-slate-200 focus:border-blue-500 ${fieldErrors.mobilePhone ? 'border-red-300' : ''}`}
                  required
                />
                {fieldErrors.mobilePhone && <p className="text-sm text-red-600">{fieldErrors.mobilePhone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`border-slate-200 focus:border-blue-500 ${fieldErrors.email ? 'border-red-300' : ''}`}
                  required
                />
                {fieldErrors.email && <p className="text-sm text-red-600">{fieldErrors.email}</p>}
              </div>
            </div>

            {/* Address and Birth Place */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-700">Address</Label>
              <Textarea
                id="address"
                placeholder="Main St, Building, Floor..."
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="border-slate-200 focus:border-blue-500 min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace" className="text-slate-700">Birth Place</Label>
              <Input
                id="birthPlace"
                type="text"
                placeholder="City, Country"
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                className="border-slate-200 focus:border-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
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
              disabled={loading || age < 18}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}