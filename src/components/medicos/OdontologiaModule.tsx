import React, { useState, useEffect } from 'react';
import { Zap, Plus, Save, Printer, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Diente {
  numero: number;
  nombre: string;
  estado: 'sano' | 'caries' | 'obturado' | 'corona' | 'extraccion' | 'implante' | 'endodoncia';
  observaciones?: string;
  fecha?: string;
  tratamiento?: string;
}

interface TratamientoDental {
  id: string;
  paciente: string;
  fecha: Date;
  tipo: string;
  dientes: number[];
  descripcion: string;
  costo: number;
  estado: 'planificado' | 'en_progreso' | 'completado' | 'cancelado';
  sesiones: number;
  sesionActual: number;
}

interface PlanTratamiento {
  id: string;
  paciente: string;
  fechaCreacion: Date;
  tratamientos: TratamientoDental[];
  costoTotal: number;
  estado: 'propuesto' | 'aceptado' | 'en_progreso' | 'completado';
  observaciones: string;
}

const OdontologiaModuleComponent: React.FC = () => {
  const [odontograma, setOdontograma] = useState<Diente[]>([]);
  const [tratamientos, setTratamientos] = useState<TratamientoDental[]>([]);
  const [planes, setPlanes] = useState<PlanTratamiento[]>([]);
  const [dienteSeleccionado, setDienteSeleccionado] = useState<number | null>(null);
  const [nuevoTratamiento, setNuevoTratamiento] = useState({
    tipo: '',
    descripcion: '',
    costo: 0,
    sesiones: 1
  });

  // Inicializar odontograma con 32 dientes
  useEffect(() => {
    const dientesIniciales: Diente[] = [];
    
    // Dientes superiores (18-11, 21-28)
    for (let i = 18; i >= 11; i--) {
      dientesIniciales.push({
        numero: i,
        nombre: getNombreDiente(i),
        estado: 'sano'
      });
    }
    for (let i = 21; i <= 28; i++) {
      dientesIniciales.push({
        numero: i,
        nombre: getNombreDiente(i),
        estado: 'sano'
      });
    }
    
    // Dientes inferiores (48-41, 31-38)
    for (let i = 48; i >= 41; i--) {
      dientesIniciales.push({
        numero: i,
        nombre: getNombreDiente(i),
        estado: 'sano'
      });
    }
    for (let i = 31; i <= 38; i++) {
      dientesIniciales.push({
        numero: i,
        nombre: getNombreDiente(i),
        estado: 'sano'
      });
    }

    setOdontograma(dientesIniciales);

    // Datos de ejemplo
    const tratamientosEjemplo: TratamientoDental[] = [
      {
        id: '1',
        paciente: 'María González',
        fecha: new Date(),
        tipo: 'Obturación',
        dientes: [16, 17],
        descripcion: 'Obturación de amalgama en molares superiores',
        costo: 150000,
        estado: 'completado',
        sesiones: 1,
        sesionActual: 1
      },
      {
        id: '2',
        paciente: 'Carlos Rodríguez',
        fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tipo: 'Endodoncia',
        dientes: [26],
        descripcion: 'Tratamiento de conducto en molar superior',
        costo: 350000,
        estado: 'planificado',
        sesiones: 3,
        sesionActual: 0
      },
      {
        id: '3',
        paciente: 'Ana Martínez',
        fecha: new Date(),
        tipo: 'Limpieza',
        dientes: [],
        descripcion: 'Profilaxis dental completa',
        costo: 80000,
        estado: 'en_progreso',
        sesiones: 1,
        sesionActual: 1
      }
    ];

    setTratamientos(tratamientosEjemplo);
  }, []);

  const getNombreDiente = (numero: number): string => {
    const nombres: { [key: number]: string } = {
      // Superiores derechos
      18: 'Tercer Molar', 17: 'Segundo Molar', 16: 'Primer Molar', 15: 'Segundo Premolar',
      14: 'Primer Premolar', 13: 'Canino', 12: 'Incisivo Lateral', 11: 'Incisivo Central',
      // Superiores izquierdos
      21: 'Incisivo Central', 22: 'Incisivo Lateral', 23: 'Canino', 24: 'Primer Premolar',
      25: 'Segundo Premolar', 26: 'Primer Molar', 27: 'Segundo Molar', 28: 'Tercer Molar',
      // Inferiores derechos
      48: 'Tercer Molar', 47: 'Segundo Molar', 46: 'Primer Molar', 45: 'Segundo Premolar',
      44: 'Primer Premolar', 43: 'Canino', 42: 'Incisivo Lateral', 41: 'Incisivo Central',
      // Inferiores izquierdos
      31: 'Incisivo Central', 32: 'Incisivo Lateral', 33: 'Canino', 34: 'Primer Premolar',
      35: 'Segundo Premolar', 36: 'Primer Molar', 37: 'Segundo Molar', 38: 'Tercer Molar'
    };
    return nombres[numero] || 'Diente';
  };

  const getColorDiente = (estado: string): string => {
    switch (estado) {
      case 'sano': return 'bg-green-100 border-green-300 text-green-800';
      case 'caries': return 'bg-red-100 border-red-300 text-red-800';
      case 'obturado': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'corona': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'extraccion': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'implante': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'endodoncia': return 'bg-orange-100 border-orange-300 text-orange-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const actualizarDiente = (numero: number, nuevoEstado: string, observaciones?: string) => {
    setOdontograma(prev => prev.map(diente => 
      diente.numero === numero 
        ? { 
            ...diente, 
            estado: nuevoEstado as Diente['estado'], 
            observaciones,
            fecha: new Date().toLocaleDateString()
          }
        : diente
    ));
  };

  const agregarTratamiento = () => {
    if (!dienteSeleccionado || !nuevoTratamiento.tipo) return;

    const tratamiento: TratamientoDental = {
      id: Date.now().toString(),
      paciente: 'Paciente Actual',
      fecha: new Date(),
      tipo: nuevoTratamiento.tipo,
      dientes: [dienteSeleccionado],
      descripcion: nuevoTratamiento.descripcion,
      costo: nuevoTratamiento.costo,
      estado: 'planificado',
      sesiones: nuevoTratamiento.sesiones,
      sesionActual: 0
    };

    setTratamientos(prev => [...prev, tratamiento]);
    setNuevoTratamiento({ tipo: '', descripcion: '', costo: 0, sesiones: 1 });
    setDienteSeleccionado(null);
  };

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case 'completado': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'en_progreso': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'planificado': return <Calendar className="w-4 h-4 text-orange-600" />;
      case 'cancelado': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Módulo de Odontología</h2>
            <p className="text-gray-600">Odontograma digital y gestión de tratamientos dentales</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Odontograma
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="odontograma" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="odontograma">Odontograma</TabsTrigger>
          <TabsTrigger value="tratamientos">Tratamientos</TabsTrigger>
          <TabsTrigger value="planes">Planes de Tratamiento</TabsTrigger>
          <TabsTrigger value="historial">Historial Dental</TabsTrigger>
        </TabsList>

        <TabsContent value="odontograma" className="space-y-6">
          {/* Leyenda */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Leyenda del Odontograma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {[
                  { estado: 'sano', label: 'Sano' },
                  { estado: 'caries', label: 'Caries' },
                  { estado: 'obturado', label: 'Obturado' },
                  { estado: 'corona', label: 'Corona' },
                  { estado: 'extraccion', label: 'Extracción' },
                  { estado: 'implante', label: 'Implante' },
                  { estado: 'endodoncia', label: 'Endodoncia' }
                ].map(item => (
                  <div key={item.estado} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 ${getColorDiente(item.estado)}`}></div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Odontograma */}
          <Card>
            <CardHeader>
              <CardTitle>Odontograma Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Dientes Superiores */}
                <div>
                  <h4 className="font-medium mb-4 text-center">Maxilar Superior</h4>
                  <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
                    {odontograma.slice(0, 16).map((diente) => (
                      <div
                        key={diente.numero}
                        className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          getColorDiente(diente.estado)
                        } ${dienteSeleccionado === diente.numero ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setDienteSeleccionado(diente.numero)}
                      >
                        <div className="text-center">
                          <div className="text-xs font-bold">{diente.numero}</div>
                          <Zap className="w-6 h-6 mx-auto my-1" />
                          <div className="text-xs">{diente.nombre.split(' ')[0]}</div>
                        </div>
                        {diente.observaciones && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dientes Inferiores */}
                <div>
                  <h4 className="font-medium mb-4 text-center">Maxilar Inferior</h4>
                  <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
                    {odontograma.slice(16, 32).map((diente) => (
                      <div
                        key={diente.numero}
                        className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          getColorDiente(diente.estado)
                        } ${dienteSeleccionado === diente.numero ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setDienteSeleccionado(diente.numero)}
                      >
                        <div className="text-center">
                          <div className="text-xs font-bold">{diente.numero}</div>
                          <Zap className="w-6 h-6 mx-auto my-1" />
                          <div className="text-xs">{diente.nombre.split(' ')[0]}</div>
                        </div>
                        {diente.observaciones && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panel de edición */}
          {dienteSeleccionado && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Editar Diente {dienteSeleccionado} - {
                    odontograma.find(d => d.numero === dienteSeleccionado)?.nombre
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Estado del diente</Label>
                    <Select 
                      value={odontograma.find(d => d.numero === dienteSeleccionado)?.estado}
                      onValueChange={(valor: string) => actualizarDiente(dienteSeleccionado, valor)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sano">Sano</SelectItem>
                        <SelectItem value="caries">Caries</SelectItem>
                        <SelectItem value="obturado">Obturado</SelectItem>
                        <SelectItem value="corona">Corona</SelectItem>
                        <SelectItem value="extraccion">Extracción</SelectItem>
                        <SelectItem value="implante">Implante</SelectItem>
                        <SelectItem value="endodoncia">Endodoncia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Observaciones</Label>
                    <Textarea
                      placeholder="Notas sobre el diente..."
                      value={odontograma.find(d => d.numero === dienteSeleccionado)?.observaciones || ''}
                      onChange={(e) => actualizarDiente(
                        dienteSeleccionado, 
                        odontograma.find(d => d.numero === dienteSeleccionado)?.estado || 'sano',
                        e.target.value
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tratamientos" className="space-y-6">
          {/* Nuevo tratamiento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nuevo Tratamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Tipo de tratamiento</Label>
                  <Select 
                    value={nuevoTratamiento.tipo}
                    onValueChange={(valor) => setNuevoTratamiento(prev => ({ ...prev, tipo: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="limpieza">Limpieza</SelectItem>
                      <SelectItem value="obturacion">Obturación</SelectItem>
                      <SelectItem value="endodoncia">Endodoncia</SelectItem>
                      <SelectItem value="extraccion">Extracción</SelectItem>
                      <SelectItem value="corona">Corona</SelectItem>
                      <SelectItem value="implante">Implante</SelectItem>
                      <SelectItem value="ortodoncia">Ortodoncia</SelectItem>
                      <SelectItem value="blanqueamiento">Blanqueamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Costo (COP)</Label>
                  <Input
                    type="number"
                    value={nuevoTratamiento.costo}
                    onChange={(e) => setNuevoTratamiento(prev => ({ ...prev, costo: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label>Sesiones</Label>
                  <Input
                    type="number"
                    min="1"
                    value={nuevoTratamiento.sesiones}
                    onChange={(e) => setNuevoTratamiento(prev => ({ ...prev, sesiones: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button onClick={agregarTratamiento} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Descripción del tratamiento</Label>
                <Textarea
                  value={nuevoTratamiento.descripcion}
                  onChange={(e) => setNuevoTratamiento(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descripción detallada del tratamiento..."
                />
              </div>
              
              {dienteSeleccionado && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Diente seleccionado: <strong>{dienteSeleccionado}</strong> - {
                      odontograma.find(d => d.numero === dienteSeleccionado)?.nombre
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de tratamientos */}
          <Card>
            <CardHeader>
              <CardTitle>Tratamientos Programados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tratamientos.map((tratamiento) => (
                  <div key={tratamiento.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getIconoEstado(tratamiento.estado)}
                        <div>
                          <h4 className="font-medium">{tratamiento.tipo}</h4>
                          <p className="text-sm text-gray-600">{tratamiento.paciente}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${tratamiento.costo.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {tratamiento.fecha.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{tratamiento.descripcion}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span>Dientes: {tratamiento.dientes.join(', ')}</span>
                        <span>Sesión {tratamiento.sesionActual}/{tratamiento.sesiones}</span>
                      </div>
                      
                      <Badge 
                        className={
                          tratamiento.estado === 'completado' ? 'bg-green-100 text-green-800' :
                          tratamiento.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                          tratamiento.estado === 'planificado' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {tratamiento.estado.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planes">
          <Card>
            <CardHeader>
              <CardTitle>Planes de Tratamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Funcionalidad de planes de tratamiento en desarrollo</p>
                <p className="text-sm mt-2">Próximamente: Creación y gestión de planes integrales</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial Dental del Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Limpieza Dental</h4>
                    <span className="text-sm text-gray-500">15/01/2024</span>
                  </div>
                  <p className="text-sm text-gray-600">Profilaxis completa, aplicación de flúor</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Obturación Diente 16</h4>
                    <span className="text-sm text-gray-500">08/01/2024</span>
                  </div>
                  <p className="text-sm text-gray-600">Obturación de resina compuesta</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Evaluación Inicial</h4>
                    <span className="text-sm text-gray-500">20/12/2023</span>
                  </div>
                  <p className="text-sm text-gray-600">Primera consulta, radiografías panorámicas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OdontologiaModuleComponent;