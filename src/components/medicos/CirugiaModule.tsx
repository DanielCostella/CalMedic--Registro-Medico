import React, { useState, useEffect } from 'react';
import { Scissors, Calendar, AlertTriangle, CheckCircle, Clock, FileText, User, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface EvaluacionPreoperatoria {
  paciente: string;
  cirugia: string;
  fechaCirugia: Date;
  riesgoAnestesico: 'ASA I' | 'ASA II' | 'ASA III' | 'ASA IV';
  examenes: ExamenPreoperatorio[];
  consentimiento: boolean;
  ayuno: boolean;
  medicacionPrevia: string[];
  alergias: string[];
  observaciones: string;
  estado: 'pendiente' | 'completada' | 'incompleta';
}

interface ExamenPreoperatorio {
  tipo: string;
  resultado: string;
  fecha: Date;
  normal: boolean;
  observaciones?: string;
}

interface ProcedimientoQuirurgico {
  id: string;
  paciente: string;
  cirugia: string;
  fecha: Date;
  duracion: number; // en minutos
  cirujano: string;
  anestesiologo: string;
  instrumentista: string;
  tipoAnestesia: 'general' | 'regional' | 'local' | 'sedacion';
  incidentes: string[];
  materialesUsados: string[];
  hallazgos: string;
  procedimiento: string;
  estado: 'programada' | 'en_curso' | 'completada' | 'cancelada';
}

interface SeguimientoPostoperatorio {
  cirugia: string;
  fechaCirugia: Date;
  dia: number;
  dolor: number; // escala 1-10
  signos: {
    temperatura: number;
    presionSistolica: number;
    presionDiastolica: number;
    frecuenciaCardiaca: number;
    frecuenciaRespiratoria: number;
  };
  herida: {
    aspecto: 'limpia' | 'eritematosa' | 'secrecion' | 'dehiscencia';
    dolor: number;
    edema: boolean;
    sangrado: boolean;
  };
  movilidad: 'normal' | 'limitada' | 'restringida';
  complicaciones: string[];
  medicamentos: string[];
  observaciones: string;
  proximaVisita: Date;
}

interface ComplicacionQuirurgica {
  tipo: 'intraoperatoria' | 'postoperatoria_temprana' | 'postoperatoria_tardia';
  descripcion: string;
  gravedad: 'leve' | 'moderada' | 'grave';
  fecha: Date;
  tratamiento: string;
  resolucion: 'resuelta' | 'en_tratamiento' | 'secuela';
}

const CirugiaModuleComponent: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionPreoperatoria[]>([]);
  const [procedimientos, setProcedimientos] = useState<ProcedimientoQuirurgico[]>([]);
  const [seguimientos, setSeguimientos] = useState<SeguimientoPostoperatorio[]>([]);
  const [complicaciones, setComplicaciones] = useState<ComplicacionQuirurgica[]>([]);
  
  const [nuevaEvaluacion, setNuevaEvaluacion] = useState({
    paciente: '',
    cirugia: '',
    riesgoAnestesico: 'ASA I' as const,
    observaciones: ''
  });

  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({
    dolor: 0,
    temperatura: 36.5,
    presionSistolica: 120,
    presionDiastolica: 80,
    frecuenciaCardiaca: 70,
    aspectoHerida: 'limpia' as const,
    observaciones: ''
  });

  useEffect(() => {
    // Datos de ejemplo
    const evaluacionesEjemplo: EvaluacionPreoperatoria[] = [
      {
        paciente: 'María González',
        cirugia: 'Colecistectomía Laparoscópica',
        fechaCirugia: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        riesgoAnestesico: 'ASA II',
        examenes: [
          {
            tipo: 'Hemograma',
            resultado: 'Normal',
            fecha: new Date(),
            normal: true
          },
          {
            tipo: 'Química sanguínea',
            resultado: 'Glucosa: 95 mg/dl, Creatinina: 0.8 mg/dl',
            fecha: new Date(),
            normal: true
          },
          {
            tipo: 'Electrocardiograma',
            resultado: 'Ritmo sinusal normal',
            fecha: new Date(),
            normal: true
          }
        ],
        consentimiento: true,
        ayuno: false,
        medicacionPrevia: ['Omeprazol 20mg'],
        alergias: [],
        observaciones: 'Paciente ansiosa, requiere premedicación',
        estado: 'completada'
      }
    ];

    const procedimientosEjemplo: ProcedimientoQuirurgico[] = [
      {
        id: '1',
        paciente: 'Carlos Rodríguez',
        cirugia: 'Apendicectomía',
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        duracion: 45,
        cirujano: 'Dr. Pérez',
        anestesiologo: 'Dr. García',
        instrumentista: 'Enf. López',
        tipoAnestesia: 'general',
        incidentes: [],
        materialesUsados: ['Endograpadoras', 'Trocares', 'Clips'],
        hallazgos: 'Apéndice inflamado sin perforación',
        procedimiento: 'Apendicectomía laparoscópica sin complicaciones',
        estado: 'completada'
      }
    ];

    const seguimientosEjemplo: SeguimientoPostoperatorio[] = [
      {
        cirugia: 'Apendicectomía',
        fechaCirugia: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dia: 2,
        dolor: 3,
        signos: {
          temperatura: 36.8,
          presionSistolica: 125,
          presionDiastolica: 80,
          frecuenciaCardiaca: 75,
          frecuenciaRespiratoria: 18
        },
        herida: {
          aspecto: 'limpia',
          dolor: 2,
          edema: false,
          sangrado: false
        },
        movilidad: 'normal',
        complicaciones: [],
        medicamentos: ['Acetaminofén 500mg c/8h', 'Omeprazol 20mg c/24h'],
        observaciones: 'Evolución satisfactoria, tolera vía oral',
        proximaVisita: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ];

    setEvaluaciones(evaluacionesEjemplo);
    setProcedimientos(procedimientosEjemplo);
    setSeguimientos(seguimientosEjemplo);
  }, []);

  const agregarEvaluacion = () => {
    if (!nuevaEvaluacion.paciente || !nuevaEvaluacion.cirugia) return;

    const evaluacion: EvaluacionPreoperatoria = {
      ...nuevaEvaluacion,
      fechaCirugia: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      examenes: [],
      consentimiento: false,
      ayuno: false,
      medicacionPrevia: [],
      alergias: [],
      estado: 'pendiente'
    };

    setEvaluaciones(prev => [evaluacion, ...prev]);
    setNuevaEvaluacion({
      paciente: '',
      cirugia: '',
      riesgoAnestesico: 'ASA I',
      observaciones: ''
    });
  };

  const agregarSeguimiento = () => {
    const seguimiento: SeguimientoPostoperatorio = {
      cirugia: 'Procedimiento Actual',
      fechaCirugia: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dia: 1,
      dolor: nuevoSeguimiento.dolor,
      signos: {
        temperatura: nuevoSeguimiento.temperatura,
        presionSistolica: nuevoSeguimiento.presionSistolica,
        presionDiastolica: nuevoSeguimiento.presionDiastolica,
        frecuenciaCardiaca: nuevoSeguimiento.frecuenciaCardiaca,
        frecuenciaRespiratoria: 18
      },
      herida: {
        aspecto: nuevoSeguimiento.aspectoHerida,
        dolor: Math.floor(nuevoSeguimiento.dolor / 2),
        edema: false,
        sangrado: false
      },
      movilidad: 'normal',
      complicaciones: [],
      medicamentos: [],
      observaciones: nuevoSeguimiento.observaciones,
      proximaVisita: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    setSeguimientos(prev => [seguimiento, ...prev]);
    setNuevoSeguimiento({
      dolor: 0,
      temperatura: 36.5,
      presionSistolica: 120,
      presionDiastolica: 80,
      frecuenciaCardiaca: 70,
      aspectoHerida: 'limpia',
      observaciones: ''
    });
  };

  const getColorRiesgo = (riesgo: string): string => {
    switch (riesgo) {
      case 'ASA I': return 'bg-green-100 text-green-800';
      case 'ASA II': return 'bg-yellow-100 text-yellow-800';
      case 'ASA III': return 'bg-orange-100 text-orange-800';
      case 'ASA IV': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorDolor = (dolor: number): string => {
    if (dolor <= 3) return 'text-green-600';
    if (dolor <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case 'completada': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'en_curso': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'programada': return <Calendar className="w-4 h-4 text-orange-600" />;
      case 'pendiente': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="w-6 h-6 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold">Módulo de Cirugía</h2>
            <p className="text-gray-600">Seguimiento integral pre, intra y post operatorio</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Protocolo Quirúrgico
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Programar Cirugía
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preoperatorio" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="preoperatorio">Pre-operatorio</TabsTrigger>
          <TabsTrigger value="intraoperatorio">Intra-operatorio</TabsTrigger>
          <TabsTrigger value="postoperatorio">Post-operatorio</TabsTrigger>
          <TabsTrigger value="complicaciones">Complicaciones</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="preoperatorio" className="space-y-6">
          {/* Nueva evaluación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Nueva Evaluación Pre-operatoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Paciente</Label>
                  <Input
                    value={nuevaEvaluacion.paciente}
                    onChange={(e) => setNuevaEvaluacion(prev => ({ ...prev, paciente: e.target.value }))}
                    placeholder="Nombre del paciente"
                  />
                </div>
                
                <div>
                  <Label>Cirugía Programada</Label>
                  <Select 
                    value={nuevaEvaluacion.cirugia}
                    onValueChange={(valor) => setNuevaEvaluacion(prev => ({ ...prev, cirugia: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apendicectomia">Apendicectomía</SelectItem>
                      <SelectItem value="colecistectomia">Colecistectomía</SelectItem>
                      <SelectItem value="hernioplastia">Hernioplastia</SelectItem>
                      <SelectItem value="tiroidectomia">Tiroidectomía</SelectItem>
                      <SelectItem value="mastectomia">Mastectomía</SelectItem>
                      <SelectItem value="histerectomia">Histerectomía</SelectItem>
                      <SelectItem value="artroscopia">Artroscopia</SelectItem>
                      <SelectItem value="otra">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Riesgo Anestésico (ASA)</Label>
                  <Select 
                    value={nuevaEvaluacion.riesgoAnestesico}
                    onValueChange={(valor: 'ASA I' | 'ASA II' | 'ASA III' | 'ASA IV') => setNuevaEvaluacion(prev => ({ ...prev, riesgoAnestesico: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASA I">ASA I - Paciente sano</SelectItem>
                      <SelectItem value="ASA II">ASA II - Enfermedad sistémica leve</SelectItem>
                      <SelectItem value="ASA III">ASA III - Enfermedad sistémica grave</SelectItem>
                      <SelectItem value="ASA IV">ASA IV - Amenaza constante para la vida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Observaciones</Label>
                <Textarea
                  value={nuevaEvaluacion.observaciones}
                  onChange={(e) => setNuevaEvaluacion(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Observaciones de la evaluación pre-operatoria..."
                />
              </div>
              
              <Button onClick={agregarEvaluacion} className="mt-4">
                <User className="w-4 h-4 mr-2" />
                Crear Evaluación
              </Button>
            </CardContent>
          </Card>

          {/* Lista de evaluaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluaciones Pre-operatorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluaciones.map((evaluacion, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getIconoEstado(evaluacion.estado)}
                        <div>
                          <h4 className="font-medium">{evaluacion.paciente}</h4>
                          <p className="text-sm text-gray-600">{evaluacion.cirugia}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getColorRiesgo(evaluacion.riesgoAnestesico)}>
                          {evaluacion.riesgoAnestesico}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {evaluacion.fechaCirugia.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Checklist pre-operatorio */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Exámenes</h5>
                        <div className="space-y-1">
                          {evaluacion.examenes.map((examen, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className={`w-3 h-3 ${examen.normal ? 'text-green-600' : 'text-red-600'}`} />
                              <span>{examen.tipo}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Documentación</h5>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`w-3 h-3 ${evaluacion.consentimiento ? 'text-green-600' : 'text-red-600'}`} />
                            <span>Consentimiento informado</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`w-3 h-3 ${evaluacion.ayuno ? 'text-green-600' : 'text-red-600'}`} />
                            <span>Ayuno confirmado</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Medicación</h5>
                        <div className="text-sm">
                          {evaluacion.medicacionPrevia.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {evaluacion.medicacionPrevia.map((med, i) => (
                                <li key={i}>{med}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-500">Sin medicación previa</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {evaluacion.observaciones && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{evaluacion.observaciones}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intraoperatorio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Registro Intra-operatorio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {procedimientos.map((procedimiento) => (
                  <div key={procedimiento.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getIconoEstado(procedimiento.estado)}
                        <div>
                          <h4 className="font-medium">{procedimiento.paciente}</h4>
                          <p className="text-sm text-gray-600">{procedimiento.cirugia}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">{procedimiento.duracion} min</p>
                        <p className="text-sm text-gray-500">
                          {procedimiento.fecha.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Equipo Quirúrgico</h5>
                        <div className="space-y-1">
                          <p><strong>Cirujano:</strong> {procedimiento.cirujano}</p>
                          <p><strong>Anestesiólogo:</strong> {procedimiento.anestesiologo}</p>
                          <p><strong>Instrumentista:</strong> {procedimiento.instrumentista}</p>
                          <p><strong>Anestesia:</strong> {procedimiento.tipoAnestesia}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Procedimiento</h5>
                        <div className="space-y-1">
                          <p><strong>Hallazgos:</strong> {procedimiento.hallazgos}</p>
                          <p><strong>Técnica:</strong> {procedimiento.procedimiento}</p>
                          {procedimiento.incidentes.length > 0 && (
                            <p><strong>Incidentes:</strong> {procedimiento.incidentes.join(', ')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {procedimiento.materialesUsados.length > 0 && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <h5 className="font-medium text-sm mb-1">Materiales Utilizados:</h5>
                        <p className="text-sm text-gray-700">
                          {procedimiento.materialesUsados.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="postoperatorio" className="space-y-6">
          {/* Nuevo seguimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Nuevo Seguimiento Post-operatorio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Dolor (0-10)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={nuevoSeguimiento.dolor}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, dolor: Number(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label>Temperatura (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevoSeguimiento.temperatura}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, temperatura: Number(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label>Presión Sistólica</Label>
                  <Input
                    type="number"
                    value={nuevoSeguimiento.presionSistolica}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, presionSistolica: Number(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label>Frecuencia Cardíaca</Label>
                  <Input
                    type="number"
                    value={nuevoSeguimiento.frecuenciaCardiaca}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, frecuenciaCardiaca: Number(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Aspecto de la Herida</Label>
                  <Select 
                    value={nuevoSeguimiento.aspectoHerida}
                    onValueChange={(valor: 'limpia' | 'eritematosa' | 'secrecion' | 'dehiscencia') => setNuevoSeguimiento(prev => ({ ...prev, aspectoHerida: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="limpia">Limpia</SelectItem>
                      <SelectItem value="eritematosa">Eritematosa</SelectItem>
                      <SelectItem value="secrecion">Con secreción</SelectItem>
                      <SelectItem value="dehiscencia">Dehiscencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Observaciones</Label>
                  <Textarea
                    value={nuevoSeguimiento.observaciones}
                    onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, observaciones: e.target.value }))}
                    placeholder="Observaciones del seguimiento..."
                  />
                </div>
              </div>
              
              <Button onClick={agregarSeguimiento} className="mt-4">
                <Activity className="w-4 h-4 mr-2" />
                Registrar Seguimiento
              </Button>
            </CardContent>
          </Card>

          {/* Lista de seguimientos */}
          <Card>
            <CardHeader>
              <CardTitle>Seguimiento Post-operatorio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seguimientos.map((seguimiento, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{seguimiento.cirugia}</h4>
                        <p className="text-sm text-gray-600">
                          Día {seguimiento.dia} post-operatorio
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {seguimiento.fechaCirugia.toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          Próxima visita: {seguimiento.proximaVisita.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Signos Vitales</h5>
                        <div className="space-y-1 text-sm">
                          <p>Temperatura: {seguimiento.signos.temperatura}°C</p>
                          <p>PA: {seguimiento.signos.presionSistolica}/{seguimiento.signos.presionDiastolica}</p>
                          <p>FC: {seguimiento.signos.frecuenciaCardiaca} lpm</p>
                          <p>FR: {seguimiento.signos.frecuenciaRespiratoria} rpm</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Estado de la Herida</h5>
                        <div className="space-y-1 text-sm">
                          <p>Aspecto: {seguimiento.herida.aspecto}</p>
                          <p>Dolor herida: {seguimiento.herida.dolor}/10</p>
                          <p>Edema: {seguimiento.herida.edema ? 'Sí' : 'No'}</p>
                          <p>Sangrado: {seguimiento.herida.sangrado ? 'Sí' : 'No'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Evaluación General</h5>
                        <div className="space-y-1 text-sm">
                          <p className={`font-medium ${getColorDolor(seguimiento.dolor)}`}>
                            Dolor: {seguimiento.dolor}/10
                          </p>
                          <p>Movilidad: {seguimiento.movilidad}</p>
                          <p>Complicaciones: {seguimiento.complicaciones.length || 'Ninguna'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {seguimiento.medicamentos.length > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded">
                        <h5 className="font-medium text-sm mb-1">Medicamentos:</h5>
                        <ul className="text-sm text-blue-700 list-disc list-inside">
                          {seguimiento.medicamentos.map((med, i) => (
                            <li key={i}>{med}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
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

        <TabsContent value="complicaciones">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Registro de Complicaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No se han registrado complicaciones</p>
                <p className="text-sm mt-2">Las complicaciones se registrarán automáticamente durante el seguimiento</p>
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
                    <p className="text-sm text-gray-600">Cirugías Realizadas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {procedimientos.filter(p => p.estado === 'completada').length}
                    </p>
                  </div>
                  <Scissors className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Promedio</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(procedimientos.reduce((acc, p) => acc + p.duracion, 0) / procedimientos.length || 0)} min
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tasa de Complicaciones</p>
                    <p className="text-2xl font-bold text-red-600">0%</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por Tipo de Cirugía</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Apendicectomía', 'Colecistectomía', 'Hernioplastia'].map((tipo, index) => (
                  <div key={tipo} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{tipo}</span>
                    <div className="flex items-center gap-3">
                      <Progress value={(index + 1) * 20} className="w-32" />
                      <span className="text-sm text-gray-600">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CirugiaModuleComponent;