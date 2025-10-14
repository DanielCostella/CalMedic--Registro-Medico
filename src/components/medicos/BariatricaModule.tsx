import React, { useState, useEffect } from 'react';
import { Scale, TrendingDown, Apple, Activity, AlertTriangle, CheckCircle, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface EvaluacionBariatrica {
  paciente: string;
  fechaEvaluacion: Date;
  pesoInicial: number;
  talla: number;
  imcInicial: number;
  pesoIdeal: number;
  excesoWeight: number;
  
  // Comorbilidades
  diabetesTipo2: boolean;
  hipertension: boolean;
  apneaSueno: boolean;
  dislipidemia: boolean;
  artritis: boolean;
  reflujoGastrico: boolean;
  
  // Evaluaciones requeridas
  evaluacionPsicologica: 'pendiente' | 'aprobada' | 'rechazada';
  evaluacionNutricional: 'pendiente' | 'aprobada' | 'rechazada';
  evaluacionCardiologica: 'pendiente' | 'aprobada' | 'rechazada';
  evaluacionEndocrinologica: 'pendiente' | 'aprobada' | 'rechazada';
  
  // Estudios pre-operatorios
  endoscopiaAlta: 'pendiente' | 'normal' | 'alterado';
  ultrasonidoAbdominal: 'pendiente' | 'normal' | 'alterado';
  serieBario: 'pendiente' | 'normal' | 'alterado';
  
  candidato: boolean;
  observaciones: string;
}

interface SeguimientoPeso {
  fecha: Date;
  peso: number;
  imc: number;
  porcentajePerdidaPeso: number;
  porcentajeExcesoPerdido: number;
  circunferenciaAbdominal: number;
  presionArterial: string;
  glucosa: number;
  observaciones?: string;
}

interface LaboratorioBariatrico {
  fecha: Date;
  // Seguimiento nutricional
  albumina: number;
  prealbumina: number;
  transferrina: number;
  
  // Vitaminas y minerales
  vitaminaB12: number;
  acidoFolico: number;
  vitaminaD: number;
  hierro: number;
  ferritina: number;
  calcio: number;
  magnesio: number;
  zinc: number;
  
  // Metabolismo
  glucosa: number;
  hba1c: number;
  insulina: number;
  colesterolTotal: number;
  hdl: number;
  ldl: number;
  trigliceridos: number;
  
  // Función hepática
  alt: number;
  ast: number;
  bilirrubina: number;
  
  deficiencias: string[];
  recomendaciones: string[];
}

const BariatricaModuleComponent: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionBariatrica[]>([]);
  const [seguimientos, setSeguimientos] = useState<SeguimientoPeso[]>([]);
  const [laboratorios, setLaboratorios] = useState<LaboratorioBariatrico[]>([]);
  
  const [nuevaEvaluacion, setNuevaEvaluacion] = useState({
    paciente: '',
    pesoInicial: 0,
    talla: 0,
    observaciones: ''
  });

  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({
    peso: 0,
    circunferenciaAbdominal: 0,
    presionArterial: '',
    glucosa: 0,
    observaciones: ''
  });

  useEffect(() => {
    // Datos de ejemplo
    const evaluacionesEjemplo: EvaluacionBariatrica[] = [
      {
        paciente: 'María González',
        fechaEvaluacion: new Date(),
        pesoInicial: 120,
        talla: 165,
        imcInicial: 44.1,
        pesoIdeal: 65,
        excesoWeight: 55,
        diabetesTipo2: true,
        hipertension: true,
        apneaSueno: false,
        dislipidemia: true,
        artritis: false,
        reflujoGastrico: true,
        evaluacionPsicologica: 'aprobada',
        evaluacionNutricional: 'aprobada',
        evaluacionCardiologica: 'pendiente',
        evaluacionEndocrinologica: 'aprobada',
        endoscopiaAlta: 'normal',
        ultrasonidoAbdominal: 'normal',
        serieBario: 'pendiente',
        candidato: true,
        observaciones: 'Candidata ideal para manga gástrica'
      }
    ];

    const seguimientosEjemplo: SeguimientoPeso[] = [
      {
        fecha: new Date(),
        peso: 95,
        imc: 34.9,
        porcentajePerdidaPeso: 20.8,
        porcentajeExcesoPerdido: 45.5,
        circunferenciaAbdominal: 95,
        presionArterial: '130/85',
        glucosa: 110,
        observaciones: 'Excelente progreso, continuar con plan nutricional'
      },
      {
        fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        peso: 105,
        imc: 38.6,
        porcentajePerdidaPeso: 12.5,
        porcentajeExcesoPerdido: 27.3,
        circunferenciaAbdominal: 105,
        presionArterial: '140/90',
        glucosa: 125
      }
    ];

    const laboratoriosEjemplo: LaboratorioBariatrico[] = [
      {
        fecha: new Date(),
        albumina: 4.2,
        prealbumina: 25,
        transferrina: 280,
        vitaminaB12: 350,
        acidoFolico: 8,
        vitaminaD: 25,
        hierro: 80,
        ferritina: 45,
        calcio: 9.5,
        magnesio: 2.1,
        zinc: 85,
        glucosa: 110,
        hba1c: 6.2,
        insulina: 12,
        colesterolTotal: 180,
        hdl: 45,
        ldl: 110,
        trigliceridos: 125,
        alt: 25,
        ast: 22,
        bilirrubina: 0.8,
        deficiencias: ['Vitamina D'],
        recomendaciones: ['Suplementar vitamina D 2000 UI/día']
      }
    ];

    setEvaluaciones(evaluacionesEjemplo);
    setSeguimientos(seguimientosEjemplo);
    setLaboratorios(laboratoriosEjemplo);
  }, []);

  const calcularIMC = (peso: number, talla: number): number => {
    if (peso <= 0 || talla <= 0) return 0;
    return peso / ((talla / 100) ** 2);
  };

  const calcularPesoIdeal = (talla: number): number => {
    // Fórmula de Devine para peso ideal
    return talla > 150 ? 50 + 0.91 * (talla - 152.4) : 45.5;
  };

  const agregarEvaluacion = () => {
    if (!nuevaEvaluacion.paciente || nuevaEvaluacion.pesoInicial <= 0 || nuevaEvaluacion.talla <= 0) return;

    const imc = calcularIMC(nuevaEvaluacion.pesoInicial, nuevaEvaluacion.talla);
    const pesoIdeal = calcularPesoIdeal(nuevaEvaluacion.talla);
    
    const evaluacion: EvaluacionBariatrica = {
      paciente: nuevaEvaluacion.paciente,
      fechaEvaluacion: new Date(),
      pesoInicial: nuevaEvaluacion.pesoInicial,
      talla: nuevaEvaluacion.talla,
      imcInicial: imc,
      pesoIdeal,
      excesoWeight: nuevaEvaluacion.pesoInicial - pesoIdeal,
      diabetesTipo2: false,
      hipertension: false,
      apneaSueno: false,
      dislipidemia: false,
      artritis: false,
      reflujoGastrico: false,
      evaluacionPsicologica: 'pendiente',
      evaluacionNutricional: 'pendiente',
      evaluacionCardiologica: 'pendiente',
      evaluacionEndocrinologica: 'pendiente',
      endoscopiaAlta: 'pendiente',
      ultrasonidoAbdominal: 'pendiente',
      serieBario: 'pendiente',
      candidato: imc >= 40 || (imc >= 35 && true), // Simplificado
      observaciones: nuevaEvaluacion.observaciones
    };

    setEvaluaciones(prev => [evaluacion, ...prev]);
    setNuevaEvaluacion({
      paciente: '',
      pesoInicial: 0,
      talla: 0,
      observaciones: ''
    });
  };

  const agregarSeguimiento = () => {
    if (nuevoSeguimiento.peso <= 0) return;

    const pesoInicial = evaluaciones[0]?.pesoInicial || 120;
    const talla = evaluaciones[0]?.talla || 165;
    const pesoIdeal = evaluaciones[0]?.pesoIdeal || 65;
    const excesoInicial = pesoInicial - pesoIdeal;
    
    const seguimiento: SeguimientoPeso = {
      fecha: new Date(),
      peso: nuevoSeguimiento.peso,
      imc: calcularIMC(nuevoSeguimiento.peso, talla),
      porcentajePerdidaPeso: ((pesoInicial - nuevoSeguimiento.peso) / pesoInicial) * 100,
      porcentajeExcesoPerdido: ((pesoInicial - nuevoSeguimiento.peso) / excesoInicial) * 100,
      circunferenciaAbdominal: nuevoSeguimiento.circunferenciaAbdominal,
      presionArterial: nuevoSeguimiento.presionArterial,
      glucosa: nuevoSeguimiento.glucosa,
      observaciones: nuevoSeguimiento.observaciones
    };

    setSeguimientos(prev => [seguimiento, ...prev]);
    setNuevoSeguimiento({
      peso: 0,
      circunferenciaAbdominal: 0,
      presionArterial: '',
      glucosa: 0,
      observaciones: ''
    });
  };

  const getColorIMC = (imc: number): string => {
    if (imc < 25) return 'text-green-600 bg-green-50';
    if (imc < 30) return 'text-yellow-600 bg-yellow-50';
    if (imc < 35) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getColorEvaluacion = (estado: string): string => {
    switch (estado) {
      case 'aprobada': return 'bg-green-100 text-green-800';
      case 'rechazada': return 'bg-red-100 text-red-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorDeficiencia = (valor: number, rango: { min: number; max: number }): string => {
    if (valor < rango.min) return 'text-red-600 bg-red-50';
    if (valor > rango.max) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-600" />
          <div>
            <h2 className="text-2xl font-bold">Módulo de Cirugía Bariátrica</h2>
            <p className="text-gray-600">Seguimiento integral de cirugía de pérdida de peso</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingDown className="w-4 h-4 mr-2" />
            Gráfico de Progreso
          </Button>
          <Button>
            <Target className="w-4 h-4 mr-2" />
            Nueva Evaluación
          </Button>
        </div>
      </div>

      <Tabs defaultValue="evaluacion" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="evaluacion">Evaluación</TabsTrigger>
          <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
          <TabsTrigger value="nutricion">Nutrición</TabsTrigger>
          <TabsTrigger value="laboratorios">Laboratorios</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluacion" className="space-y-6">
          {/* Nueva evaluación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Nueva Evaluación Bariátrica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Paciente</Label>
                  <Input
                    value={nuevaEvaluacion.paciente}
                    onChange={(e) => setNuevaEvaluacion(prev => ({ ...prev, paciente: e.target.value }))}
                    placeholder="Nombre del paciente"
                  />
                </div>
                
                <div>
                  <Label>Peso Inicial (kg)</Label>
                  <Input
                    type="number"
                    value={nuevaEvaluacion.pesoInicial || ''}
                    onChange={(e) => setNuevaEvaluacion(prev => ({ ...prev, pesoInicial: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label>Talla (cm)</Label>
                  <Input
                    type="number"
                    value={nuevaEvaluacion.talla || ''}
                    onChange={(e) => setNuevaEvaluacion(prev => ({ ...prev, talla: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button onClick={agregarEvaluacion} className="w-full">
                    <Scale className="w-4 h-4 mr-2" />
                    Crear Evaluación
                  </Button>
                </div>
              </div>
              
              {nuevaEvaluacion.pesoInicial > 0 && nuevaEvaluacion.talla > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">IMC Calculado</p>
                      <p className="text-lg font-bold text-blue-600">
                        {calcularIMC(nuevaEvaluacion.pesoInicial, nuevaEvaluacion.talla).toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Peso Ideal</p>
                      <p className="text-lg font-bold text-green-600">
                        {calcularPesoIdeal(nuevaEvaluacion.talla).toFixed(1)} kg
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Exceso de Peso</p>
                      <p className="text-lg font-bold text-red-600">
                        {(nuevaEvaluacion.pesoInicial - calcularPesoIdeal(nuevaEvaluacion.talla)).toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <Label>Observaciones</Label>
                <Textarea
                  value={nuevaEvaluacion.observaciones}
                  onChange={(e) => setNuevaEvaluacion(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Observaciones de la evaluación..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de evaluaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluaciones Bariátricas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluaciones.map((evaluacion, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{evaluacion.paciente}</h4>
                        <p className="text-sm text-gray-600">
                          {evaluacion.fechaEvaluacion.toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={evaluacion.candidato ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {evaluacion.candidato ? 'Candidato' : 'No Candidato'}
                        </Badge>
                        <Badge className={getColorIMC(evaluacion.imcInicial)}>
                          IMC: {evaluacion.imcInicial.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Datos Antropométricos</h5>
                        <div className="space-y-1 text-sm">
                          <p>Peso inicial: {evaluacion.pesoInicial} kg</p>
                          <p>Talla: {evaluacion.talla} cm</p>
                          <p>Peso ideal: {evaluacion.pesoIdeal.toFixed(1)} kg</p>
                          <p>Exceso: {evaluacion.excesoWeight.toFixed(1)} kg</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Comorbilidades</h5>
                        <div className="space-y-1 text-sm">
                          {evaluacion.diabetesTipo2 && <p>• Diabetes tipo 2</p>}
                          {evaluacion.hipertension && <p>• Hipertensión</p>}
                          {evaluacion.apneaSueno && <p>• Apnea del sueño</p>}
                          {evaluacion.dislipidemia && <p>• Dislipidemia</p>}
                          {evaluacion.artritis && <p>• Artritis</p>}
                          {evaluacion.reflujoGastrico && <p>• Reflujo gastroesofágico</p>}
                          {!evaluacion.diabetesTipo2 && !evaluacion.hipertension && !evaluacion.apneaSueno && 
                           !evaluacion.dislipidemia && !evaluacion.artritis && !evaluacion.reflujoGastrico && (
                            <p className="text-gray-500">Sin comorbilidades</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Estado de Evaluaciones</h5>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Psicológica</span>
                            <Badge className={getColorEvaluacion(evaluacion.evaluacionPsicologica)}>
                              {evaluacion.evaluacionPsicologica}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Nutricional</span>
                            <Badge className={getColorEvaluacion(evaluacion.evaluacionNutricional)}>
                              {evaluacion.evaluacionNutricional}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Cardiológica</span>
                            <Badge className={getColorEvaluacion(evaluacion.evaluacionCardiologica)}>
                              {evaluacion.evaluacionCardiologica}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {evaluacion.observaciones && (
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{evaluacion.observaciones}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguimiento" className="space-y-6">
          {/* Nuevo seguimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Nuevo Seguimiento de Peso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Peso Actual (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevoSeguimiento.peso || ''}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, peso: Number(e.target.value) }))}
                    placeholder="0.0"
                  />
                </div>
                
                <div>
                  <Label>Circunferencia Abdominal (cm)</Label>
                  <Input
                    type="number"
                    value={nuevoSeguimiento.circunferenciaAbdominal || ''}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, circunferenciaAbdominal: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label>Presión Arterial</Label>
                  <Input
                    value={nuevoSeguimiento.presionArterial}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, presionArterial: e.target.value }))}
                    placeholder="120/80"
                  />
                </div>
                
                <div>
                  <Label>Glucosa (mg/dl)</Label>
                  <Input
                    type="number"
                    value={nuevoSeguimiento.glucosa || ''}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, glucosa: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Observaciones</Label>
                <Textarea
                  value={nuevoSeguimiento.observaciones}
                  onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Observaciones del seguimiento..."
                />
              </div>
              
              <Button onClick={agregarSeguimiento} className="mt-4">
                <TrendingDown className="w-4 h-4 mr-2" />
                Registrar Seguimiento
              </Button>
            </CardContent>
          </Card>

          {/* Progreso de pérdida de peso */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Peso Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {seguimientos[0]?.peso || 0} kg
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    IMC: {seguimientos[0]?.imc.toFixed(1) || 0}
                  </p>
                  <Badge className={getColorIMC(seguimientos[0]?.imc || 0)}>
                    {seguimientos[0]?.imc < 25 ? 'Normal' :
                     seguimientos[0]?.imc < 30 ? 'Sobrepeso' :
                     seguimientos[0]?.imc < 35 ? 'Obesidad I' :
                     seguimientos[0]?.imc < 40 ? 'Obesidad II' : 'Obesidad III'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pérdida de Peso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {seguimientos[0]?.porcentajePerdidaPeso.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {((evaluaciones[0]?.pesoInicial || 120) - (seguimientos[0]?.peso || 120)).toFixed(1)} kg perdidos
                  </p>
                  <Progress 
                    value={seguimientos[0]?.porcentajePerdidaPeso || 0} 
                    className="mt-3"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exceso Perdido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {seguimientos[0]?.porcentajeExcesoPerdido.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Meta: 60-70%
                  </p>
                  <Progress 
                    value={Math.min(100, seguimientos[0]?.porcentajeExcesoPerdido || 0)} 
                    className="mt-3"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historial de seguimientos */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Seguimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seguimientos.map((seguimiento, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">
                        Seguimiento - {seguimiento.fecha.toLocaleDateString()}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getColorIMC(seguimiento.imc)}>
                          IMC: {seguimiento.imc.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Peso</p>
                        <p className="font-bold text-lg">{seguimiento.peso} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Pérdida de Peso</p>
                        <p className="font-bold text-lg text-green-600">
                          {seguimiento.porcentajePerdidaPeso.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Exceso Perdido</p>
                        <p className="font-bold text-lg text-purple-600">
                          {seguimiento.porcentajeExcesoPerdido.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Circunf. Abdominal</p>
                        <p className="font-bold text-lg">{seguimiento.circunferenciaAbdominal} cm</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-600">Presión Arterial: {seguimiento.presionArterial}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Glucosa: {seguimiento.glucosa} mg/dl</p>
                      </div>
                    </div>
                    
                    {seguimiento.observaciones && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{seguimiento.observaciones}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutricion">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="w-5 h-5" />
                Plan Nutricional Post-Bariátrica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="font-medium text-blue-600">Líquidos</h4>
                        <p className="text-sm text-gray-600">Días 1-7</p>
                        <ul className="text-xs mt-2 space-y-1">
                          <li>• Agua</li>
                          <li>• Caldos claros</li>
                          <li>• Gelatina</li>
                          <li>• Té sin azúcar</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="font-medium text-green-600">Puré</h4>
                        <p className="text-sm text-gray-600">Días 8-21</p>
                        <ul className="text-xs mt-2 space-y-1">
                          <li>• Proteínas licuadas</li>
                          <li>• Yogurt sin azúcar</li>
                          <li>• Purés de vegetales</li>
                          <li>• Huevo batido</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="font-medium text-orange-600">Blando</h4>
                        <p className="text-sm text-gray-600">Días 22-42</p>
                        <ul className="text-xs mt-2 space-y-1">
                          <li>• Pollo desmenuzado</li>
                          <li>• Pescado suave</li>
                          <li>• Vegetales cocidos</li>
                          <li>• Frutas blandas</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="font-medium text-purple-600">Normal</h4>
                        <p className="text-sm text-gray-600">Día 43+</p>
                        <ul className="text-xs mt-2 space-y-1">
                          <li>• Proteínas variadas</li>
                          <li>• Vegetales frescos</li>
                          <li>• Frutas enteras</li>
                          <li>• Granos integrales</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Suplementos Requeridos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-3">Vitaminas</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Multivitamínico</span>
                            <span className="text-gray-600">2 tabletas/día</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vitamina B12</span>
                            <span className="text-gray-600">1000 mcg/mes IM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vitamina D</span>
                            <span className="text-gray-600">2000 UI/día</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ácido Fólico</span>
                            <span className="text-gray-600">400 mcg/día</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-3">Minerales</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Hierro</span>
                            <span className="text-gray-600">65 mg/día</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Calcio</span>
                            <span className="text-gray-600">1200 mg/día</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Magnesio</span>
                            <span className="text-gray-600">400 mg/día</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Zinc</span>
                            <span className="text-gray-600">15 mg/día</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laboratorios">
          <Card>
            <CardHeader>
              <CardTitle>Laboratorios Especializados Bariátricos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {laboratorios.map((lab, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">
                        Panel Bariátrico - {lab.fecha.toLocaleDateString()}
                      </h4>
                      {lab.deficiencias.length > 0 && (
                        <Badge className="bg-red-100 text-red-800">
                          {lab.deficiencias.length} Deficiencias
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-medium text-sm mb-3">Proteínas</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Albúmina</span>
                            <Badge className={getColorDeficiencia(lab.albumina, { min: 3.5, max: 5.0 })}>
                              {lab.albumina} g/dl
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Prealbúmina</span>
                            <Badge className={getColorDeficiencia(lab.prealbumina, { min: 20, max: 40 })}>
                              {lab.prealbumina} mg/dl
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Transferrina</span>
                            <Badge className={getColorDeficiencia(lab.transferrina, { min: 200, max: 360 })}>
                              {lab.transferrina} mg/dl
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-3">Vitaminas</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>B12</span>
                            <Badge className={getColorDeficiencia(lab.vitaminaB12, { min: 300, max: 900 })}>
                              {lab.vitaminaB12} pg/ml
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Ácido Fólico</span>
                            <Badge className={getColorDeficiencia(lab.acidoFolico, { min: 3, max: 20 })}>
                              {lab.acidoFolico} ng/ml
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Vitamina D</span>
                            <Badge className={getColorDeficiencia(lab.vitaminaD, { min: 30, max: 100 })}>
                              {lab.vitaminaD} ng/ml
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-3">Minerales</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Hierro</span>
                            <Badge className={getColorDeficiencia(lab.hierro, { min: 60, max: 150 })}>
                              {lab.hierro} mcg/dl
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Ferritina</span>
                            <Badge className={getColorDeficiencia(lab.ferritina, { min: 15, max: 200 })}>
                              {lab.ferritina} ng/ml
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Calcio</span>
                            <Badge className={getColorDeficiencia(lab.calcio, { min: 8.5, max: 10.5 })}>
                              {lab.calcio} mg/dl
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {lab.deficiencias.length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 rounded">
                        <h5 className="font-medium text-sm text-red-800 mb-2">Deficiencias Detectadas:</h5>
                        <ul className="text-sm text-red-700 list-disc list-inside">
                          {lab.deficiencias.map((def, i) => (
                            <li key={i}>{def}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {lab.recomendaciones.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <h5 className="font-medium text-sm text-blue-800 mb-2">Recomendaciones:</h5>
                        <ul className="text-sm text-blue-700 list-disc list-inside">
                          {lab.recomendaciones.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pacientes Evaluados</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {evaluaciones.length}
                    </p>
                  </div>
                  <Scale className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pérdida Promedio</p>
                    <p className="text-2xl font-bold text-green-600">
                      {seguimientos.length > 0 
                        ? (seguimientos.reduce((acc, s) => acc + s.porcentajePerdidaPeso, 0) / seguimientos.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Éxito (más de 50% EPP)</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {seguimientos.filter(s => s.porcentajeExcesoPerdido > 50).length}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Excelente (más de 70% EPP)</span>
                  <div className="flex items-center gap-3">
                    <Progress value={20} className="w-32" />
                    <span className="text-sm text-gray-600">
                      {seguimientos.filter(s => s.porcentajeExcesoPerdido > 70).length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bueno (50-70% EPP)</span>
                  <div className="flex items-center gap-3">
                    <Progress value={40} className="w-32" />
                    <span className="text-sm text-gray-600">
                      {seguimientos.filter(s => s.porcentajeExcesoPerdido >= 50 && s.porcentajeExcesoPerdido <= 70).length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Regular (25-50% EPP)</span>
                  <div className="flex items-center gap-3">
                    <Progress value={30} className="w-32" />
                    <span className="text-sm text-gray-600">
                      {seguimientos.filter(s => s.porcentajeExcesoPerdido >= 25 && s.porcentajeExcesoPerdido < 50).length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Insuficiente (menos de 25% EPP)</span>
                  <div className="flex items-center gap-3">
                    <Progress value={10} className="w-32" />
                    <span className="text-sm text-gray-600">
                      {seguimientos.filter(s => s.porcentajeExcesoPerdido < 25).length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BariatricaModuleComponent;