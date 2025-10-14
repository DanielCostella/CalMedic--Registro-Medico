import React, { useState, useEffect } from 'react';
import { Baby, TrendingUp, Syringe, Scale, Ruler, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface MedidaCrecimiento {
  fecha: Date;
  edad: number; // en meses
  peso: number; // en kg
  talla: number; // en cm
  perimetroCefalico: number; // en cm
  percentilPeso: number;
  percentilTalla: number;
  percentilPC: number;
  observaciones?: string;
}

interface Vacuna {
  nombre: string;
  edad: string;
  fecha?: Date;
  aplicada: boolean;
  lote?: string;
  observaciones?: string;
  reaccionAdversa?: boolean;
}

interface DesarrolloPsicomotor {
  area: 'motor_grueso' | 'motor_fino' | 'lenguaje' | 'social' | 'cognitivo';
  hito: string;
  edadEsperada: number; // en meses
  edadLograda?: number; // en meses
  logrado: boolean;
  observaciones?: string;
}

interface EvaluacionNutricional {
  fecha: Date;
  tipoAlimentacion: 'lactancia_exclusiva' | 'lactancia_mixta' | 'formula' | 'alimentacion_complementaria';
  alergias: string[];
  suplementos: string[];
  observaciones: string;
  recomendaciones: string[];
}

const PediatriaModuleComponent: React.FC = () => {
  const [medidas, setMedidas] = useState<MedidaCrecimiento[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [desarrollo, setDesarrollo] = useState<DesarrolloPsicomotor[]>([]);
  const [evaluacionNutricional, setEvaluacionNutricional] = useState<EvaluacionNutricional[]>([]);
  const [nuevaMedida, setNuevaMedida] = useState({
    peso: 0,
    talla: 0,
    perimetroCefalico: 0,
    observaciones: ''
  });

  const esquemaVacunacion: Vacuna[] = [
    // Recién nacido
    { nombre: 'BCG', edad: 'Recién nacido', aplicada: false },
    { nombre: 'Hepatitis B', edad: 'Recién nacido', aplicada: false },
    
    // 2 meses
    { nombre: 'Pentavalente (1ra dosis)', edad: '2 meses', aplicada: false },
    { nombre: 'Polio (1ra dosis)', edad: '2 meses', aplicada: false },
    { nombre: 'Rotavirus (1ra dosis)', edad: '2 meses', aplicada: false },
    { nombre: 'Neumococo (1ra dosis)', edad: '2 meses', aplicada: false },
    
    // 4 meses
    { nombre: 'Pentavalente (2da dosis)', edad: '4 meses', aplicada: false },
    { nombre: 'Polio (2da dosis)', edad: '4 meses', aplicada: false },
    { nombre: 'Rotavirus (2da dosis)', edad: '4 meses', aplicada: false },
    { nombre: 'Neumococo (2da dosis)', edad: '4 meses', aplicada: false },
    
    // 6 meses
    { nombre: 'Pentavalente (3ra dosis)', edad: '6 meses', aplicada: false },
    { nombre: 'Polio (3ra dosis)', edad: '6 meses', aplicada: false },
    { nombre: 'Influenza (1ra dosis)', edad: '6 meses', aplicada: false },
    
    // 12 meses
    { nombre: 'SRP (Triple viral)', edad: '12 meses', aplicada: false },
    { nombre: 'Neumococo (refuerzo)', edad: '12 meses', aplicada: false },
    { nombre: 'Varicela', edad: '12 meses', aplicada: false },
    
    // 18 meses
    { nombre: 'Pentavalente (refuerzo)', edad: '18 meses', aplicada: false },
    { nombre: 'Polio (refuerzo)', edad: '18 meses', aplicada: false },
    
    // 5 años
    { nombre: 'SRP (refuerzo)', edad: '5 años', aplicada: false },
    { nombre: 'DPT (refuerzo)', edad: '5 años', aplicada: false }
  ];

  const hitosDesarrollo: DesarrolloPsicomotor[] = [
    // Motor grueso
    { area: 'motor_grueso', hito: 'Sostiene la cabeza', edadEsperada: 3, logrado: false },
    { area: 'motor_grueso', hito: 'Se sienta sin apoyo', edadEsperada: 6, logrado: false },
    { area: 'motor_grueso', hito: 'Gatea', edadEsperada: 9, logrado: false },
    { area: 'motor_grueso', hito: 'Camina solo', edadEsperada: 12, logrado: false },
    { area: 'motor_grueso', hito: 'Corre', edadEsperada: 18, logrado: false },
    { area: 'motor_grueso', hito: 'Salta con ambos pies', edadEsperada: 24, logrado: false },
    
    // Motor fino
    { area: 'motor_fino', hito: 'Agarra objetos', edadEsperada: 4, logrado: false },
    { area: 'motor_fino', hito: 'Pinza fina', edadEsperada: 9, logrado: false },
    { area: 'motor_fino', hito: 'Garabatea', edadEsperada: 15, logrado: false },
    { area: 'motor_fino', hito: 'Copia círculo', edadEsperada: 36, logrado: false },
    
    // Lenguaje
    { area: 'lenguaje', hito: 'Sonríe socialmente', edadEsperada: 2, logrado: false },
    { area: 'lenguaje', hito: 'Balbucea', edadEsperada: 6, logrado: false },
    { area: 'lenguaje', hito: 'Primera palabra', edadEsperada: 12, logrado: false },
    { area: 'lenguaje', hito: '10 palabras', edadEsperada: 18, logrado: false },
    { area: 'lenguaje', hito: 'Frases de 2 palabras', edadEsperada: 24, logrado: false },
    
    // Social
    { area: 'social', hito: 'Reconoce a la madre', edadEsperada: 3, logrado: false },
    { area: 'social', hito: 'Juega peek-a-boo', edadEsperada: 9, logrado: false },
    { area: 'social', hito: 'Imita actividades', edadEsperada: 18, logrado: false },
    { area: 'social', hito: 'Juego paralelo', edadEsperada: 24, logrado: false }
  ];

  useEffect(() => {
    setVacunas(esquemaVacunacion);
    setDesarrollo(hitosDesarrollo);

    // Datos de ejemplo
    const medidasEjemplo: MedidaCrecimiento[] = [
      {
        fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        edad: 6,
        peso: 7.5,
        talla: 67,
        perimetroCefalico: 43,
        percentilPeso: 50,
        percentilTalla: 45,
        percentilPC: 55
      },
      {
        fecha: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        edad: 4,
        peso: 6.8,
        talla: 63,
        perimetroCefalico: 41,
        percentilPeso: 45,
        percentilTalla: 40,
        percentilPC: 50
      },
      {
        fecha: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        edad: 2,
        peso: 5.2,
        talla: 58,
        perimetroCefalico: 38,
        percentilPeso: 40,
        percentilTalla: 35,
        percentilPC: 45
      }
    ];

    setMedidas(medidasEjemplo);
  }, []);

  const calcularPercentil = (valor: number, tipo: 'peso' | 'talla' | 'pc', edad: number): number => {
    // Simulación de cálculo de percentil basado en tablas de crecimiento OMS
    // En implementación real, se usarían las tablas oficiales
    if (tipo === 'peso') {
      if (edad <= 6) return Math.min(95, Math.max(5, 30 + (valor / edad) * 10));
      return Math.min(95, Math.max(5, 25 + (valor / edad) * 8));
    } else if (tipo === 'talla') {
      return Math.min(95, Math.max(5, 20 + (valor / edad) * 0.8));
    } else {
      return Math.min(95, Math.max(5, 35 + (valor / edad) * 1.2));
    }
  };

  const agregarMedida = () => {
    if (nuevaMedida.peso <= 0 || nuevaMedida.talla <= 0) return;

    const edad = 6; // Simulado - en implementación real se calcularía basado en fecha de nacimiento
    
    const medida: MedidaCrecimiento = {
      fecha: new Date(),
      edad,
      peso: nuevaMedida.peso,
      talla: nuevaMedida.talla,
      perimetroCefalico: nuevaMedida.perimetroCefalico,
      percentilPeso: calcularPercentil(nuevaMedida.peso, 'peso', edad),
      percentilTalla: calcularPercentil(nuevaMedida.talla, 'talla', edad),
      percentilPC: calcularPercentil(nuevaMedida.perimetroCefalico, 'pc', edad),
      observaciones: nuevaMedida.observaciones
    };

    setMedidas(prev => [medida, ...prev]);
    setNuevaMedida({ peso: 0, talla: 0, perimetroCefalico: 0, observaciones: '' });
  };

  const marcarVacuna = (index: number, aplicada: boolean) => {
    setVacunas(prev => prev.map((vacuna, i) => 
      i === index ? { ...vacuna, aplicada, fecha: aplicada ? new Date() : undefined } : vacuna
    ));
  };

  const marcarHito = (index: number, logrado: boolean) => {
    setDesarrollo(prev => prev.map((hito, i) => 
      i === index ? { ...hito, logrado, edadLograda: logrado ? 6 : undefined } : hito
    ));
  };

  const getColorPercentil = (percentil: number): string => {
    if (percentil < 10) return 'text-red-600 bg-red-50';
    if (percentil < 25) return 'text-orange-600 bg-orange-50';
    if (percentil > 90) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  const getColorArea = (area: string): string => {
    switch (area) {
      case 'motor_grueso': return 'bg-blue-100 text-blue-800';
      case 'motor_fino': return 'bg-green-100 text-green-800';
      case 'lenguaje': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      case 'cognitivo': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Baby className="w-6 h-6 text-pink-600" />
          <div>
            <h2 className="text-2xl font-bold">Módulo de Pediatría</h2>
            <p className="text-gray-600">Seguimiento integral del crecimiento y desarrollo infantil</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Gráficos de Crecimiento
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Próxima Consulta
          </Button>
        </div>
      </div>

      <Tabs defaultValue="crecimiento" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="crecimiento">Crecimiento</TabsTrigger>
          <TabsTrigger value="vacunacion">Vacunación</TabsTrigger>
          <TabsTrigger value="desarrollo">Desarrollo</TabsTrigger>
          <TabsTrigger value="nutricion">Nutrición</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="crecimiento" className="space-y-6">
          {/* Nueva medida */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Registrar Nueva Medida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevaMedida.peso || ''}
                    onChange={(e) => setNuevaMedida(prev => ({ ...prev, peso: Number(e.target.value) }))}
                    placeholder="0.0"
                  />
                </div>
                
                <div>
                  <Label>Talla (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevaMedida.talla || ''}
                    onChange={(e) => setNuevaMedida(prev => ({ ...prev, talla: Number(e.target.value) }))}
                    placeholder="0.0"
                  />
                </div>
                
                <div>
                  <Label>Perímetro Cefálico (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevaMedida.perimetroCefalico || ''}
                    onChange={(e) => setNuevaMedida(prev => ({ ...prev, perimetroCefalico: Number(e.target.value) }))}
                    placeholder="0.0"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button onClick={agregarMedida} className="w-full">
                    <Scale className="w-4 h-4 mr-2" />
                    Registrar
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Observaciones</Label>
                <Textarea
                  value={nuevaMedida.observaciones}
                  onChange={(e) => setNuevaMedida(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Observaciones sobre la medición..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Curvas de crecimiento */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Peso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medidas.slice(0, 3).map((medida, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{medida.peso} kg</p>
                        <p className="text-sm text-gray-600">{medida.fecha.toLocaleDateString()}</p>
                      </div>
                      <Badge className={getColorPercentil(medida.percentilPeso)}>
                        P{medida.percentilPeso}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Talla</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medidas.slice(0, 3).map((medida, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{medida.talla} cm</p>
                        <p className="text-sm text-gray-600">{medida.fecha.toLocaleDateString()}</p>
                      </div>
                      <Badge className={getColorPercentil(medida.percentilTalla)}>
                        P{medida.percentilTalla}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Perímetro Cefálico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medidas.slice(0, 3).map((medida, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{medida.perimetroCefalico} cm</p>
                        <p className="text-sm text-gray-600">{medida.fecha.toLocaleDateString()}</p>
                      </div>
                      <Badge className={getColorPercentil(medida.percentilPC)}>
                        P{medida.percentilPC}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico simulado */}
          <Card>
            <CardHeader>
              <CardTitle>Curva de Crecimiento - Peso/Edad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Gráfico de curvas de crecimiento OMS</p>
                  <p className="text-sm mt-2">Integración con Chart.js en desarrollo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacunacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="w-5 h-5" />
                Esquema de Vacunación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vacunas.map((vacuna, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                          vacuna.aplicada 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                        onClick={() => marcarVacuna(index, !vacuna.aplicada)}
                      >
                        {vacuna.aplicada && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{vacuna.nombre}</h4>
                        <p className="text-sm text-gray-600">{vacuna.edad}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {vacuna.aplicada ? (
                        <div>
                          <Badge className="bg-green-100 text-green-800">Aplicada</Badge>
                          {vacuna.fecha && (
                            <p className="text-sm text-gray-600 mt-1">
                              {vacuna.fecha.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline">Pendiente</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de vacunación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vacunas Aplicadas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {vacunas.filter(v => v.aplicada).length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vacunas Pendientes</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {vacunas.filter(v => !v.aplicada).length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cobertura</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round((vacunas.filter(v => v.aplicada).length / vacunas.length) * 100)}%
                    </p>
                  </div>
                  <Syringe className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="desarrollo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hitos del Desarrollo Psicomotor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['motor_grueso', 'motor_fino', 'lenguaje', 'social'].map(area => (
                  <div key={area}>
                    <h4 className="font-medium mb-3 capitalize flex items-center gap-2">
                      <Badge className={getColorArea(area)}>
                        {area.replace('_', ' ')}
                      </Badge>
                    </h4>
                    
                    <div className="space-y-2">
                      {desarrollo.filter(h => h.area === area).map((hito, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                                hito.logrado 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                              onClick={() => marcarHito(desarrollo.indexOf(hito), !hito.logrado)}
                            >
                              {hito.logrado && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            
                            <div>
                              <p className="font-medium">{hito.hito}</p>
                              <p className="text-sm text-gray-600">
                                Edad esperada: {hito.edadEsperada} meses
                              </p>
                            </div>
                          </div>
                          
                          {hito.logrado ? (
                            <Badge className="bg-green-100 text-green-800">Logrado</Badge>
                          ) : (
                            <Badge variant="outline">Pendiente</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutricion">
          <Card>
            <CardHeader>
              <CardTitle>Evaluación Nutricional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Tipo de Alimentación</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lactancia_exclusiva">Lactancia Exclusiva</SelectItem>
                        <SelectItem value="lactancia_mixta">Lactancia Mixta</SelectItem>
                        <SelectItem value="formula">Fórmula</SelectItem>
                        <SelectItem value="alimentacion_complementaria">Alimentación Complementaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Suplementos</Label>
                    <Input placeholder="Vitamina D, Hierro, etc." />
                  </div>
                </div>
                
                <div>
                  <Label>Alergias Alimentarias</Label>
                  <Textarea placeholder="Registrar alergias conocidas..." />
                </div>
                
                <div>
                  <Label>Recomendaciones Nutricionales</Label>
                  <Textarea placeholder="Recomendaciones específicas para la edad..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Alertas y Seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h4 className="font-medium text-orange-800">Vacuna Pendiente</h4>
                  </div>
                  <p className="text-sm text-orange-700">
                    Pentavalente (2da dosis) programada para los 4 meses
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Seguimiento de Crecimiento</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Próxima medición programada en 2 semanas
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-800">Desarrollo Normal</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Todos los hitos del desarrollo están dentro del rango esperado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PediatriaModuleComponent;