import React, { useState, useEffect } from 'react';
import { Eye, Camera, Glasses, TrendingUp, Calendar, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExamenVisual {
  fecha: Date;
  ojoDerechoSC: string; // Sin corrección
  ojoIzquierdoSC: string;
  ojoDerechoCC: string; // Con corrección
  ojoIzquierdoCC: string;
  visionBinocular: string;
  observaciones?: string;
}

interface PresionIntraocular {
  fecha: Date;
  ojoDerechoMañana: number;
  ojoIzquierdoMañana: number;
  ojoDerechoTarde?: number;
  ojoIzquierdoTarde?: number;
  metodo: 'goldmann' | 'tonopen' | 'pneumatico';
  observaciones?: string;
}

interface PrescripcionLentes {
  id: string;
  fecha: Date;
  tipo: 'lejos' | 'cerca' | 'bifocales' | 'progresivos';
  ojoDerechoEsfera: number;
  ojoDerechoCilindro: number;
  ojoDerechoEje: number;
  ojoIzquierdoEsfera: number;
  ojoIzquierdoCilindro: number;
  ojoIzquierdoEje: number;
  adicion?: number;
  distanciaPupilar: number;
  observaciones?: string;
  estado: 'activa' | 'vencida' | 'reemplazada';
}

interface EstudioOcular {
  tipo: 'fondo_ojo' | 'campo_visual' | 'oct' | 'angiografia' | 'topografia';
  fecha: Date;
  resultados: string;
  hallazgos: string[];
  recomendaciones: string[];
  imagenes?: string[];
}

interface PatologiaOcular {
  nombre: string;
  ojo: 'derecho' | 'izquierdo' | 'ambos';
  fechaDiagnostico: Date;
  estado: 'activa' | 'controlada' | 'resuelta';
  tratamiento: string;
  seguimiento: string;
}

const OftalmologiaModuleComponent: React.FC = () => {
  const [examenes, setExamenes] = useState<ExamenVisual[]>([]);
  const [presiones, setPresiones] = useState<PresionIntraocular[]>([]);
  const [prescripciones, setPrescripciones] = useState<PrescripcionLentes[]>([]);
  const [estudios, setEstudios] = useState<EstudioOcular[]>([]);
  const [patologias, setPatologias] = useState<PatologiaOcular[]>([]);
  
  const [nuevoExamen, setNuevoExamen] = useState({
    ojoDerechoSC: '',
    ojoIzquierdoSC: '',
    ojoDerechoCC: '',
    ojoIzquierdoCC: '',
    visionBinocular: '',
    observaciones: ''
  });

  const [nuevaPresion, setNuevaPresion] = useState({
    ojoDerechoMañana: 0,
    ojoIzquierdoMañana: 0,
    metodo: 'goldmann' as const,
    observaciones: ''
  });

  const [nuevaPrescripcion, setNuevaPrescripcion] = useState({
    tipo: 'lejos' as const,
    ojoDerechoEsfera: 0,
    ojoDerechoCilindro: 0,
    ojoDerechoEje: 0,
    ojoIzquierdoEsfera: 0,
    ojoIzquierdoCilindro: 0,
    ojoIzquierdoEje: 0,
    distanciaPupilar: 0,
    observaciones: ''
  });

  useEffect(() => {
    // Datos de ejemplo
    const examenesEjemplo: ExamenVisual[] = [
      {
        fecha: new Date(),
        ojoDerechoSC: '20/30',
        ojoIzquierdoSC: '20/25',
        ojoDerechoCC: '20/20',
        ojoIzquierdoCC: '20/20',
        visionBinocular: '20/20',
        observaciones: 'Paciente refiere visión borrosa ocasional'
      },
      {
        fecha: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        ojoDerechoSC: '20/40',
        ojoIzquierdoSC: '20/30',
        ojoDerechoCC: '20/25',
        ojoIzquierdoCC: '20/20',
        visionBinocular: '20/25'
      }
    ];

    const presionesEjemplo: PresionIntraocular[] = [
      {
        fecha: new Date(),
        ojoDerechoMañana: 16,
        ojoIzquierdoMañana: 14,
        metodo: 'goldmann',
        observaciones: 'Presión dentro de límites normales'
      },
      {
        fecha: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        ojoDerechoMañana: 18,
        ojoIzquierdoMañana: 16,
        metodo: 'goldmann'
      }
    ];

    const prescripcionesEjemplo: PrescripcionLentes[] = [
      {
        id: '1',
        fecha: new Date(),
        tipo: 'lejos',
        ojoDerechoEsfera: -1.25,
        ojoDerechoCilindro: -0.50,
        ojoDerechoEje: 90,
        ojoIzquierdoEsfera: -1.00,
        ojoIzquierdoCilindro: -0.25,
        ojoIzquierdoEje: 85,
        distanciaPupilar: 62,
        estado: 'activa',
        observaciones: 'Primera prescripción para miopía leve'
      }
    ];

    const estudiosEjemplo: EstudioOcular[] = [
      {
        tipo: 'fondo_ojo',
        fecha: new Date(),
        resultados: 'Fondo de ojo normal bilateral',
        hallazgos: ['Papila óptica normal', 'Mácula sin alteraciones', 'Vasos retinianos normales'],
        recomendaciones: ['Control anual', 'Protección UV']
      }
    ];

    const patologiasEjemplo: PatologiaOcular[] = [
      {
        nombre: 'Miopía',
        ojo: 'ambos',
        fechaDiagnostico: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        estado: 'controlada',
        tratamiento: 'Corrección óptica',
        seguimiento: 'Control anual'
      }
    ];

    setExamenes(examenesEjemplo);
    setPresiones(presionesEjemplo);
    setPrescripciones(prescripcionesEjemplo);
    setEstudios(estudiosEjemplo);
    setPatologias(patologiasEjemplo);
  }, []);

  const agregarExamen = () => {
    if (!nuevoExamen.ojoDerechoSC || !nuevoExamen.ojoIzquierdoSC) return;

    const examen: ExamenVisual = {
      fecha: new Date(),
      ...nuevoExamen
    };

    setExamenes(prev => [examen, ...prev]);
    setNuevoExamen({
      ojoDerechoSC: '',
      ojoIzquierdoSC: '',
      ojoDerechoCC: '',
      ojoIzquierdoCC: '',
      visionBinocular: '',
      observaciones: ''
    });
  };

  const agregarPresion = () => {
    if (nuevaPresion.ojoDerechoMañana <= 0 || nuevaPresion.ojoIzquierdoMañana <= 0) return;

    const presion: PresionIntraocular = {
      fecha: new Date(),
      ...nuevaPresion
    };

    setPresiones(prev => [presion, ...prev]);
    setNuevaPresion({
      ojoDerechoMañana: 0,
      ojoIzquierdoMañana: 0,
      metodo: 'goldmann',
      observaciones: ''
    });
  };

  const agregarPrescripcion = () => {
    if (nuevaPrescripcion.distanciaPupilar <= 0) return;

    const prescripcion: PrescripcionLentes = {
      id: Date.now().toString(),
      fecha: new Date(),
      ...nuevaPrescripcion,
      estado: 'activa'
    };

    setPrescripciones(prev => [prescripcion, ...prev]);
    setNuevaPrescripcion({
      tipo: 'lejos',
      ojoDerechoEsfera: 0,
      ojoDerechoCilindro: 0,
      ojoDerechoEje: 0,
      ojoIzquierdoEsfera: 0,
      ojoIzquierdoCilindro: 0,
      ojoIzquierdoEje: 0,
      distanciaPupilar: 0,
      observaciones: ''
    });
  };

  const getColorPresion = (presion: number): string => {
    if (presion > 21) return 'text-red-600 bg-red-50';
    if (presion > 18) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getIconoEstudio = (tipo: string) => {
    switch (tipo) {
      case 'fondo_ojo': return <Eye className="w-4 h-4" />;
      case 'campo_visual': return <TrendingUp className="w-4 h-4" />;
      case 'oct': return <Camera className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">Módulo de Oftalmología</h2>
            <p className="text-gray-600">Evaluación integral de la salud ocular y visual</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Tomar Foto Fondo
          </Button>
          <Button>
            <Glasses className="w-4 h-4 mr-2" />
            Nueva Prescripción
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agudeza" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="agudeza">Agudeza Visual</TabsTrigger>
          <TabsTrigger value="presion">Presión Ocular</TabsTrigger>
          <TabsTrigger value="prescripciones">Prescripciones</TabsTrigger>
          <TabsTrigger value="estudios">Estudios</TabsTrigger>
          <TabsTrigger value="patologias">Patologías</TabsTrigger>
          <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="agudeza" className="space-y-6">
          {/* Nuevo examen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Nuevo Examen de Agudeza Visual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>OD Sin Corrección</Label>
                  <Select 
                    value={nuevoExamen.ojoDerechoSC}
                    onValueChange={(valor) => setNuevoExamen(prev => ({ ...prev, ojoDerechoSC: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20/20">20/20</SelectItem>
                      <SelectItem value="20/25">20/25</SelectItem>
                      <SelectItem value="20/30">20/30</SelectItem>
                      <SelectItem value="20/40">20/40</SelectItem>
                      <SelectItem value="20/50">20/50</SelectItem>
                      <SelectItem value="20/60">20/60</SelectItem>
                      <SelectItem value="20/80">20/80</SelectItem>
                      <SelectItem value="20/100">20/100</SelectItem>
                      <SelectItem value="20/200">20/200</SelectItem>
                      <SelectItem value="CD">Cuenta Dedos</SelectItem>
                      <SelectItem value="MM">Movimiento Manos</SelectItem>
                      <SelectItem value="PL">Percepción Luz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>OI Sin Corrección</Label>
                  <Select 
                    value={nuevoExamen.ojoIzquierdoSC}
                    onValueChange={(valor) => setNuevoExamen(prev => ({ ...prev, ojoIzquierdoSC: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20/20">20/20</SelectItem>
                      <SelectItem value="20/25">20/25</SelectItem>
                      <SelectItem value="20/30">20/30</SelectItem>
                      <SelectItem value="20/40">20/40</SelectItem>
                      <SelectItem value="20/50">20/50</SelectItem>
                      <SelectItem value="20/60">20/60</SelectItem>
                      <SelectItem value="20/80">20/80</SelectItem>
                      <SelectItem value="20/100">20/100</SelectItem>
                      <SelectItem value="20/200">20/200</SelectItem>
                      <SelectItem value="CD">Cuenta Dedos</SelectItem>
                      <SelectItem value="MM">Movimiento Manos</SelectItem>
                      <SelectItem value="PL">Percepción Luz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Visión Binocular</Label>
                  <Select 
                    value={nuevoExamen.visionBinocular}
                    onValueChange={(valor) => setNuevoExamen(prev => ({ ...prev, visionBinocular: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20/20">20/20</SelectItem>
                      <SelectItem value="20/25">20/25</SelectItem>
                      <SelectItem value="20/30">20/30</SelectItem>
                      <SelectItem value="20/40">20/40</SelectItem>
                      <SelectItem value="20/50">20/50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>OD Con Corrección</Label>
                  <Select 
                    value={nuevoExamen.ojoDerechoCC}
                    onValueChange={(valor) => setNuevoExamen(prev => ({ ...prev, ojoDerechoCC: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Opcional..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20/20">20/20</SelectItem>
                      <SelectItem value="20/25">20/25</SelectItem>
                      <SelectItem value="20/30">20/30</SelectItem>
                      <SelectItem value="20/40">20/40</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>OI Con Corrección</Label>
                  <Select 
                    value={nuevoExamen.ojoIzquierdoCC}
                    onValueChange={(valor) => setNuevoExamen(prev => ({ ...prev, ojoIzquierdoCC: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Opcional..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20/20">20/20</SelectItem>
                      <SelectItem value="20/25">20/25</SelectItem>
                      <SelectItem value="20/30">20/30</SelectItem>
                      <SelectItem value="20/40">20/40</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={agregarExamen} className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Registrar
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Observaciones</Label>
                <Textarea
                  value={nuevoExamen.observaciones}
                  onChange={(e) => setNuevoExamen(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Observaciones del examen..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Historial de exámenes */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Agudeza Visual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {examenes.map((examen, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Examen de Agudeza Visual</h4>
                      <span className="text-sm text-gray-500">
                        {examen.fecha.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">OD S/C</p>
                        <p className="font-medium">{examen.ojoDerechoSC}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">OI S/C</p>
                        <p className="font-medium">{examen.ojoIzquierdoSC}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">OD C/C</p>
                        <p className="font-medium">{examen.ojoDerechoCC || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">OI C/C</p>
                        <p className="font-medium">{examen.ojoIzquierdoCC || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Binocular</p>
                        <p className="font-medium">{examen.visionBinocular}</p>
                      </div>
                    </div>
                    
                    {examen.observaciones && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{examen.observaciones}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presion" className="space-y-6">
          {/* Nueva medición */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Nueva Medición de Presión Intraocular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>OD Mañana (mmHg)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={nuevaPresion.ojoDerechoMañana || ''}
                    onChange={(e) => setNuevaPresion(prev => ({ ...prev, ojoDerechoMañana: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label>OI Mañana (mmHg)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={nuevaPresion.ojoIzquierdoMañana || ''}
                    onChange={(e) => setNuevaPresion(prev => ({ ...prev, ojoIzquierdoMañana: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label>Método</Label>
                  <Select 
                    value={nuevaPresion.metodo}
                    onValueChange={(valor: 'goldmann' | 'tonopen' | 'pneumatico') => setNuevaPresion(prev => ({ ...prev, metodo: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="goldmann">Goldmann</SelectItem>
                      <SelectItem value="tonopen">Tonopen</SelectItem>
                      <SelectItem value="pneumatico">Neumático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={agregarPresion} className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Registrar
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Observaciones</Label>
                <Textarea
                  value={nuevaPresion.observaciones}
                  onChange={(e) => setNuevaPresion(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Observaciones de la medición..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Historial de presiones */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Presión Intraocular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {presiones.map((presion, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Medición PIO</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{presion.metodo}</Badge>
                        <span className="text-sm text-gray-500">
                          {presion.fecha.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Ojo Derecho</p>
                          <p className="text-lg font-bold">{presion.ojoDerechoMañana} mmHg</p>
                        </div>
                        <Badge className={getColorPresion(presion.ojoDerechoMañana)}>
                          {presion.ojoDerechoMañana > 21 ? 'Alto' : 
                           presion.ojoDerechoMañana > 18 ? 'Límite' : 'Normal'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Ojo Izquierdo</p>
                          <p className="text-lg font-bold">{presion.ojoIzquierdoMañana} mmHg</p>
                        </div>
                        <Badge className={getColorPresion(presion.ojoIzquierdoMañana)}>
                          {presion.ojoIzquierdoMañana > 21 ? 'Alto' : 
                           presion.ojoIzquierdoMañana > 18 ? 'Límite' : 'Normal'}
                        </Badge>
                      </div>
                    </div>
                    
                    {presion.observaciones && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{presion.observaciones}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescripciones" className="space-y-6">
          {/* Nueva prescripción */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Glasses className="w-5 h-5" />
                Nueva Prescripción de Lentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Lentes</Label>
                    <Select 
                      value={nuevaPrescripcion.tipo}
                      onValueChange={(valor: 'lejos' | 'cerca' | 'bifocales' | 'progresivos') => setNuevaPrescripcion(prev => ({ ...prev, tipo: valor }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lejos">Lejos</SelectItem>
                        <SelectItem value="cerca">Cerca</SelectItem>
                        <SelectItem value="bifocales">Bifocales</SelectItem>
                        <SelectItem value="progresivos">Progresivos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Distancia Pupilar (mm)</Label>
                    <Input
                      type="number"
                      min="50"
                      max="80"
                      value={nuevaPrescripcion.distanciaPupilar || ''}
                      onChange={(e) => setNuevaPrescripcion(prev => ({ ...prev, distanciaPupilar: Number(e.target.value) }))}
                      placeholder="62"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ojo Derecho */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-center">Ojo Derecho</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Esfera</Label>
                        <Input
                          type="number"
                          step="0.25"
                          value={nuevaPrescripcion.ojoDerechoEsfera || ''}
                          onChange={(e) => setNuevaPrescripcion(prev => ({ ...prev, ojoDerechoEsfera: Number(e.target.value) }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Cilindro</Label>
                        <Input
                          type="number"
                          step="0.25"
                          value={nuevaPrescripcion.ojoDerechoCilindro || ''}
                          onChange={(e) => setNuevaPrescripcion(prev => ({ ...prev, ojoDerechoCilindro: Number(e.target.value) }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Eje</Label>
                        <Input
                          type="number"
                          min="0"
                          max="180"
                          value={nuevaPrescripcion.ojoDerechoEje || ''}
                          onChange={(e) => setNuevaPrescripcion(prev => ({ ...prev, ojoDerechoEje: Number(e.target.value) }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Ojo Izquierdo */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-center">Ojo Izquierdo</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Esfera</Label>
                        <Input
                          type="number"
                          step="0.25"
                          value={nuevaPrescripcion.ojoIzquierdoEsfera || ''}
                          onChange={(e) => setNuevaPrescripcion(prev => ({ ...prev, ojoIzquierdoEsfera: Number(e.target.value) }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Cilindro</Label>
                        <Input
                          type="number"
                          step="0.25"
                          value={nuevaPrescripcion.ojoIzquierdoCilindro || ''}
                          onChange={(e) => setNuevaPrescripcion(prev => ({ ...prev, ojoIzquierdoCilindro: Number(e.target.value) }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Eje</Label>
                        <Input
                          type="number"
                          min="0"
                          max="180"
                          value={nuevaPrescripcion.ojoIzquierdoEje || ''}
                          onChange={(e) => setNuevaPrescripcion(prev => ({ ...prev, ojoIzquierdoEje: Number(e.target.value) }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Observaciones</Label>
                  <Textarea
                    value={nuevaPrescripcion.observaciones}
                    onChange={(e) => setNuevaPrescripcion(prev => ({ ...prev, observaciones: e.target.value }))}
                    placeholder="Observaciones de la prescripción..."
                  />
                </div>
                
                <Button onClick={agregarPrescripcion} className="w-full">
                  <Glasses className="w-4 h-4 mr-2" />
                  Crear Prescripción
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de prescripciones */}
          <Card>
            <CardHeader>
              <CardTitle>Prescripciones de Lentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescripciones.map((prescripcion) => (
                  <div key={prescripcion.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Glasses className="w-4 h-4" />
                        <h4 className="font-medium">Lentes para {prescripcion.tipo}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            prescripcion.estado === 'activa' ? 'bg-green-100 text-green-800' :
                            prescripcion.estado === 'vencida' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {prescripcion.estado}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {prescripcion.fecha.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Ojo Derecho</h5>
                        <div className="space-y-1">
                          <p>Esfera: {prescripcion.ojoDerechoEsfera > 0 ? '+' : ''}{prescripcion.ojoDerechoEsfera}</p>
                          <p>Cilindro: {prescripcion.ojoDerechoCilindro > 0 ? '+' : ''}{prescripcion.ojoDerechoCilindro}</p>
                          <p>Eje: {prescripcion.ojoDerechoEje}°</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Ojo Izquierdo</h5>
                        <div className="space-y-1">
                          <p>Esfera: {prescripcion.ojoIzquierdoEsfera > 0 ? '+' : ''}{prescripcion.ojoIzquierdoEsfera}</p>
                          <p>Cilindro: {prescripcion.ojoIzquierdoCilindro > 0 ? '+' : ''}{prescripcion.ojoIzquierdoCilindro}</p>
                          <p>Eje: {prescripcion.ojoIzquierdoEje}°</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm"><strong>DP:</strong> {prescripcion.distanciaPupilar}mm</p>
                      {prescripcion.observaciones && (
                        <p className="text-sm text-gray-600 mt-1">{prescripcion.observaciones}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estudios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Estudios Complementarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estudios.map((estudio, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getIconoEstudio(estudio.tipo)}
                        <h4 className="font-medium capitalize">
                          {estudio.tipo.replace('_', ' ')}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-500">
                        {estudio.fecha.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm">Resultados:</h5>
                        <p className="text-sm text-gray-700">{estudio.resultados}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm">Hallazgos:</h5>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                          {estudio.hallazgos.map((hallazgo, i) => (
                            <li key={i}>{hallazgo}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm">Recomendaciones:</h5>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                          {estudio.recomendaciones.map((recomendacion, i) => (
                            <li key={i}>{recomendacion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patologias">
          <Card>
            <CardHeader>
              <CardTitle>Patologías Oculares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patologias.map((patologia, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{patologia.nombre}</h4>
                      <Badge 
                        className={
                          patologia.estado === 'controlada' ? 'bg-green-100 text-green-800' :
                          patologia.estado === 'activa' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {patologia.estado}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Ojo afectado:</strong> {patologia.ojo}</p>
                        <p><strong>Fecha diagnóstico:</strong> {patologia.fechaDiagnostico.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p><strong>Tratamiento:</strong> {patologia.tratamiento}</p>
                        <p><strong>Seguimiento:</strong> {patologia.seguimiento}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguimiento">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Plan de Seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Próximo Control</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Control de presión intraocular programado en 3 meses
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-800">Recomendaciones</h4>
                  </div>
                  <ul className="text-sm text-green-700 list-disc list-inside">
                    <li>Usar lentes de sol con protección UV</li>
                    <li>Realizar descansos visuales cada 20 minutos</li>
                    <li>Mantener distancia adecuada de pantallas</li>
                  </ul>
                </div>
                
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h4 className="font-medium text-orange-800">Signos de Alarma</h4>
                  </div>
                  <ul className="text-sm text-orange-700 list-disc list-inside">
                    <li>Dolor ocular intenso</li>
                    <li>Pérdida súbita de visión</li>
                    <li>Visión de halos alrededor de las luces</li>
                    <li>Destellos o moscas volantes súbitas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OftalmologiaModuleComponent;