import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Eye, EyeOff, Plus, X, Stethoscope, GraduationCap, Building, Clock } from 'lucide-react';
import { MedicoData, ESPECIALIDADES_MEDICAS, SEGUROS_MEDICOS } from '../../types/medico';
import { calculateAge, validatePassword, validateEmail, validateCedula, validatePhone } from '../../utils/validation';

interface CrearMedicoFormProps {
  onMedicoCreated: (medico: MedicoData) => void;
  onCancel: () => void;
}

export default function CrearMedicoForm({ onMedicoCreated, onCancel }: CrearMedicoFormProps) {
  const [formData, setFormData] = useState<MedicoData>({
    // Datos personales
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
    password: '',
    
    // Datos profesionales
    numeroColMedico: '',
    especialidad: '',
    subespecialidad: '',
    universidadGrado: '',
    añoGraduacion: new Date().getFullYear() - 5,
    experienciaAños: 0,
    consultorio: '',
    horarioAtencion: '',
    tarifaConsulta: 0,
    idiomas: ['Español'],
    certificaciones: [],
    
    // Datos adicionales
    hospitalAfiliacion: '',
    segurosAceptados: [],
    telefonoConsultorio: '',
    direccionConsultorio: '',
    
    // Estado profesional
    estadoLicencia: 'Activa',
    fechaVencimientoLicencia: ''
  });
  
  const [edad, setEdad] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [nuevoIdioma, setNuevoIdioma] = useState('');
  const [nuevaCertificacion, setNuevaCertificacion] = useState('');

  const especialidadSeleccionada = ESPECIALIDADES_MEDICAS.find(esp => esp.id === formData.especialidad);

  useEffect(() => {
    if (formData.fechaNacimiento) {
      const calculatedAge = calculateAge(formData.fechaNacimiento);
      setEdad(calculatedAge);
    }
  }, [formData.fechaNacimiento]);

  const validateField = (field: string, value: string | number): string => {
    switch (field) {
      case 'cedula': {
        return !validateCedula(value as string) ? 'Cédula debe tener máximo 9 dígitos' : '';
      }
      case 'correoElectronico': {
        return !validateEmail(value as string) ? 'Correo electrónico inválido' : '';
      }
      case 'telefonoMovil': {
        return !validatePhone(value as string) ? 'Teléfono debe tener exactamente 10 dígitos' : '';
      }
      case 'password': {
        const passwordValidation = validatePassword(value as string);
        return !passwordValidation.isValid ? passwordValidation.message : '';
      }
      case 'numeroColMedico': {
        return !/^\d{4,8}$/.test(value as string) ? 'Número de colegio médico debe tener entre 4 y 8 dígitos' : '';
      }
      case 'añoGraduacion': {
        const currentYear = new Date().getFullYear();
        const year = value as number;
        return (year < 1950 || year > currentYear) ? `Año debe estar entre 1950 y ${currentYear}` : '';
      }
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof MedicoData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (typeof value === 'string' || typeof value === 'number') {
      const fieldError = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, [field]: fieldError }));
    }
    
    if (error) setError('');
  };

  const agregarIdioma = () => {
    if (nuevoIdioma.trim() && !formData.idiomas.includes(nuevoIdioma.trim())) {
      handleInputChange('idiomas', [...formData.idiomas, nuevoIdioma.trim()]);
      setNuevoIdioma('');
    }
  };

  const eliminarIdioma = (idioma: string) => {
    handleInputChange('idiomas', formData.idiomas.filter(i => i !== idioma));
  };

  const agregarCertificacion = () => {
    if (nuevaCertificacion.trim() && !formData.certificaciones.includes(nuevaCertificacion.trim())) {
      handleInputChange('certificaciones', [...formData.certificaciones, nuevaCertificacion.trim()]);
      setNuevaCertificacion('');
    }
  };

  const eliminarCertificacion = (cert: string) => {
    handleInputChange('certificaciones', formData.certificaciones.filter(c => c !== cert));
  };

  const handleSeguroChange = (seguroId: string, checked: boolean) => {
    if (checked) {
      handleInputChange('segurosAceptados', [...formData.segurosAceptados, seguroId]);
    } else {
      handleInputChange('segurosAceptados', formData.segurosAceptados.filter(s => s !== seguroId));
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      // Validar datos personales
      if (!formData.cedula) errors.cedula = 'Cédula es requerida';
      if (!formData.nombres) errors.nombres = 'Nombres son requeridos';
      if (!formData.apellidos) errors.apellidos = 'Apellidos son requeridos';
      if (!formData.fechaNacimiento) errors.fechaNacimiento = 'Fecha de nacimiento es requerida';
      if (!formData.telefonoMovil) errors.telefonoMovil = 'Teléfono es requerido';
      if (!formData.correoElectronico) errors.correoElectronico = 'Correo es requerido';
      if (!formData.password) errors.password = 'Contraseña es requerida';
      
      if (edad < 25) errors.edad = 'El médico debe tener al menos 25 años';
    } else if (step === 2) {
      // Validar datos profesionales
      if (!formData.numeroColMedico) errors.numeroColMedico = 'Número de colegio médico es requerido';
      if (!formData.especialidad) errors.especialidad = 'Especialidad es requerida';
      if (!formData.universidadGrado) errors.universidadGrado = 'Universidad de grado es requerida';
      if (!formData.fechaVencimientoLicencia) errors.fechaVencimientoLicencia = 'Fecha de vencimiento de licencia es requerida';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2)) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simular creación del médico
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calcular experiencia basada en año de graduación
      const experienciaCalculada = new Date().getFullYear() - formData.añoGraduacion;
      
      const medicoCompleto: MedicoData = {
        ...formData,
        experienciaAños: Math.max(0, experienciaCalculada)
      };
      
      onMedicoCreated(medicoCompleto);
    } catch (err) {
      setError('Error al crear el médico. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-4xl shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="absolute left-4 top-4 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Registrar Nuevo Médico</CardTitle>
          <CardDescription className="text-slate-600">
            Complete la información profesional y personal del médico
          </CardDescription>
          
          {/* Indicador de pasos */}
          <div className="flex justify-center space-x-4 mt-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center space-x-2 ${
                  step <= currentStep ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step}
                </div>
                <span className="text-sm font-medium">
                  {step === 1 && 'Datos Personales'}
                  {step === 2 && 'Información Profesional'}
                  {step === 3 && 'Configuración Práctica'}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Paso 1: Datos Personales */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Información Personal</h3>
                </div>

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
                    <Label htmlFor="cedula" className="text-slate-700">Cédula *</Label>
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
                    <Label htmlFor="nombres" className="text-slate-700">Nombres *</Label>
                    <Input
                      id="nombres"
                      type="text"
                      placeholder="Dr. Juan Carlos"
                      value={formData.nombres}
                      onChange={(e) => handleInputChange('nombres', e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                      required
                    />
                    {fieldErrors.nombres && <p className="text-sm text-red-600">{fieldErrors.nombres}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apellidos" className="text-slate-700">Apellidos *</Label>
                    <Input
                      id="apellidos"
                      type="text"
                      placeholder="Pérez García"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                      required
                    />
                    {fieldErrors.apellidos && <p className="text-sm text-red-600">{fieldErrors.apellidos}</p>}
                  </div>
                </div>

                {/* Fecha de Nacimiento, Edad y Sexo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento" className="text-slate-700">Fecha de Nacimiento *</Label>
                    <Input
                      id="fechaNacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                      required
                    />
                    {fieldErrors.fechaNacimiento && <p className="text-sm text-red-600">{fieldErrors.fechaNacimiento}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-700">Edad</Label>
                    <Input
                      type="text"
                      value={edad > 0 ? `${edad} años` : ''}
                      readOnly
                      className={`border-slate-200 bg-slate-50 ${edad < 25 ? 'border-red-300 bg-red-50' : ''}`}
                    />
                    {edad > 0 && edad < 25 && (
                      <p className="text-sm text-red-600">Debe tener al menos 25 años</p>
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

                {/* Contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefonoMovil" className="text-slate-700">Teléfono Móvil *</Label>
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
                    <Label htmlFor="correoElectronico" className="text-slate-700">Correo Electrónico *</Label>
                    <Input
                      id="correoElectronico"
                      type="email"
                      placeholder="doctor@ejemplo.com"
                      value={formData.correoElectronico}
                      onChange={(e) => handleInputChange('correoElectronico', e.target.value)}
                      className={`border-slate-200 focus:border-blue-500 ${fieldErrors.correoElectronico ? 'border-red-300' : ''}`}
                      required
                    />
                    {fieldErrors.correoElectronico && <p className="text-sm text-red-600">{fieldErrors.correoElectronico}</p>}
                  </div>
                </div>

                {/* Dirección y Lugar de Nacimiento */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="direccion" className="text-slate-700">Dirección de Residencia</Label>
                    <Textarea
                      id="direccion"
                      placeholder="Av. Principal, Edificio..., Piso..., Apartamento..."
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="border-slate-200 focus:border-blue-500 min-h-[80px]"
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
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Contraseña *</Label>
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
              </div>
            )}

            {/* Paso 2: Información Profesional */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Información Profesional</h3>
                </div>

                {/* Número de Colegio y Especialidad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroColMedico" className="text-slate-700">Número de Colegio Médico *</Label>
                    <Input
                      id="numeroColMedico"
                      type="text"
                      placeholder="12345"
                      value={formData.numeroColMedico}
                      onChange={(e) => handleInputChange('numeroColMedico', e.target.value.replace(/\D/g, ''))}
                      className={`border-slate-200 focus:border-blue-500 ${fieldErrors.numeroColMedico ? 'border-red-300' : ''}`}
                      required
                    />
                    {fieldErrors.numeroColMedico && <p className="text-sm text-red-600">{fieldErrors.numeroColMedico}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Especialidad Médica *</Label>
                    <Select value={formData.especialidad} onValueChange={(value) => handleInputChange('especialidad', value)}>
                      <SelectTrigger className="border-slate-200 focus:border-blue-500">
                        <SelectValue placeholder="Seleccione especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESPECIALIDADES_MEDICAS.map((esp) => (
                          <SelectItem key={esp.id} value={esp.id}>
                            {esp.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.especialidad && <p className="text-sm text-red-600">{fieldErrors.especialidad}</p>}
                  </div>
                </div>

                {/* Subespecialidad */}
                {especialidadSeleccionada?.subespecialidades && (
                  <div className="space-y-2">
                    <Label className="text-slate-700">Subespecialidad (Opcional)</Label>
                    <Select value={formData.subespecialidad || 'ninguna'} onValueChange={(value) => handleInputChange('subespecialidad', value === 'ninguna' ? '' : value)}>
                      <SelectTrigger className="border-slate-200 focus:border-blue-500">
                        <SelectValue placeholder="Seleccione subespecialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ninguna">Sin subespecialidad</SelectItem>
                        {especialidadSeleccionada.subespecialidades.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Universidad y Año de Graduación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="universidadGrado" className="text-slate-700">Universidad de Grado *</Label>
                    <Input
                      id="universidadGrado"
                      type="text"
                      placeholder="Universidad Central de Venezuela"
                      value={formData.universidadGrado}
                      onChange={(e) => handleInputChange('universidadGrado', e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                      required
                    />
                    {fieldErrors.universidadGrado && <p className="text-sm text-red-600">{fieldErrors.universidadGrado}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="añoGraduacion" className="text-slate-700">Año de Graduación</Label>
                    <Input
                      id="añoGraduacion"
                      type="number"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={formData.añoGraduacion}
                      onChange={(e) => handleInputChange('añoGraduacion', parseInt(e.target.value))}
                      className="border-slate-200 focus:border-blue-500"
                    />
                    {fieldErrors.añoGraduacion && <p className="text-sm text-red-600">{fieldErrors.añoGraduacion}</p>}
                  </div>
                </div>

                {/* Estado de Licencia y Fecha de Vencimiento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Estado de Licencia Médica</Label>
                    <Select value={formData.estadoLicencia} onValueChange={(value: 'Activa' | 'Suspendida' | 'En Revisión') => handleInputChange('estadoLicencia', value)}>
                      <SelectTrigger className="border-slate-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activa">Activa</SelectItem>
                        <SelectItem value="En Revisión">En Revisión</SelectItem>
                        <SelectItem value="Suspendida">Suspendida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaVencimientoLicencia" className="text-slate-700">Vencimiento de Licencia *</Label>
                    <Input
                      id="fechaVencimientoLicencia"
                      type="date"
                      value={formData.fechaVencimientoLicencia}
                      onChange={(e) => handleInputChange('fechaVencimientoLicencia', e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                      required
                    />
                    {fieldErrors.fechaVencimientoLicencia && <p className="text-sm text-red-600">{fieldErrors.fechaVencimientoLicencia}</p>}
                  </div>
                </div>

                {/* Idiomas */}
                <div className="space-y-2">
                  <Label className="text-slate-700">Idiomas que Habla</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.idiomas.map((idioma) => (
                      <Badge key={idioma} variant="secondary" className="flex items-center space-x-1">
                        <span>{idioma}</span>
                        {idioma !== 'Español' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => eliminarIdioma(idioma)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Agregar idioma"
                      value={nuevoIdioma}
                      onChange={(e) => setNuevoIdioma(e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarIdioma())}
                    />
                    <Button type="button" onClick={agregarIdioma} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Certificaciones */}
                <div className="space-y-2">
                  <Label className="text-slate-700">Certificaciones Adicionales</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.certificaciones.map((cert) => (
                      <Badge key={cert} variant="outline" className="flex items-center space-x-1">
                        <span>{cert}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => eliminarCertificacion(cert)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Agregar certificación"
                      value={nuevaCertificacion}
                      onChange={(e) => setNuevaCertificacion(e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarCertificacion())}
                    />
                    <Button type="button" onClick={agregarCertificacion} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Configuración de Práctica */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Configuración de Práctica Médica</h3>
                </div>

                {/* Información del Consultorio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consultorio" className="text-slate-700">Nombre del Consultorio</Label>
                    <Input
                      id="consultorio"
                      type="text"
                      placeholder="Centro Médico Integral"
                      value={formData.consultorio || ''}
                      onChange={(e) => handleInputChange('consultorio', e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefonoConsultorio" className="text-slate-700">Teléfono del Consultorio</Label>
                    <Input
                      id="telefonoConsultorio"
                      type="text"
                      placeholder="02121234567"
                      value={formData.telefonoConsultorio || ''}
                      onChange={(e) => handleInputChange('telefonoConsultorio', e.target.value.replace(/\D/g, ''))}
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccionConsultorio" className="text-slate-700">Dirección del Consultorio</Label>
                  <Textarea
                    id="direccionConsultorio"
                    placeholder="Av. Francisco de Miranda, Centro Comercial..., Piso..., Consultorio..."
                    value={formData.direccionConsultorio || ''}
                    onChange={(e) => handleInputChange('direccionConsultorio', e.target.value)}
                    className="border-slate-200 focus:border-blue-500 min-h-[80px]"
                  />
                </div>

                {/* Horario y Tarifa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horarioAtencion" className="text-slate-700">Horario de Atención</Label>
                    <Input
                      id="horarioAtencion"
                      type="text"
                      placeholder="Lunes a Viernes 8:00 AM - 6:00 PM"
                      value={formData.horarioAtencion || ''}
                      onChange={(e) => handleInputChange('horarioAtencion', e.target.value)}
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tarifaConsulta" className="text-slate-700">Tarifa de Consulta (USD)</Label>
                    <Input
                      id="tarifaConsulta"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="50.00"
                      value={formData.tarifaConsulta || ''}
                      onChange={(e) => handleInputChange('tarifaConsulta', parseFloat(e.target.value) || 0)}
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalAfiliacion" className="text-slate-700">Hospital de Afiliación</Label>
                  <Input
                    id="hospitalAfiliacion"
                    type="text"
                    placeholder="Hospital Universitario de Caracas"
                    value={formData.hospitalAfiliacion || ''}
                    onChange={(e) => handleInputChange('hospitalAfiliacion', e.target.value)}
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>

                {/* Seguros Aceptados */}
                <div className="space-y-3">
                  <Label className="text-slate-700">Seguros Médicos Aceptados</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SEGUROS_MEDICOS.map((seguro) => (
                      <div key={seguro.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={seguro.id}
                          checked={formData.segurosAceptados.includes(seguro.id)}
                          onCheckedChange={(checked) => handleSeguroChange(seguro.id, checked as boolean)}
                        />
                        <Label htmlFor={seguro.id} className="text-sm text-slate-700 cursor-pointer">
                          {seguro.nombre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <Separator />
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Siguiente
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="ml-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando Médico...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Crear Médico
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}