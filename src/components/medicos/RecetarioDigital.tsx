import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Edit, Trash2, AlertTriangle, Clock, User, Printer, Save, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Checkbox } from '@/components/ui/checkbox';

interface Medicamento {
  id: string;
  nombre: string;
  nombreGenerico: string;
  concentracion: string;
  formaFarmaceutica: string;
  laboratorio: string;
  categoria: string;
  requiereReceta: boolean;
  contraindicaciones: string[];
  efectosSecundarios: string[];
  interacciones: string[];
  dosisAdulto: string;
  dosisNino: string;
  embarazo: 'A' | 'B' | 'C' | 'D' | 'X';
  lactancia: boolean;
}

interface Prescripcion {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  cantidad: string;
  indicaciones: string;
  viaAdministracion: string;
}

interface Receta {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteCedula: string;
  medicoId: string;
  medicoNombre: string;
  medicoLicencia: string;
  fecha: string;
  prescripciones: Prescripcion[];
  diagnostico: string;
  observaciones: string;
  estado: 'Borrador' | 'Emitida' | 'Dispensada' | 'Cancelada';
  validaHasta: string;
}

const RecetarioDigitalComponent: React.FC = () => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNuevaReceta, setShowNuevaReceta] = useState(false);
  const [showBuscarMedicamento, setShowBuscarMedicamento] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);
  const [busquedaMedicamento, setBusquedaMedicamento] = useState('');
  const [busquedaReceta, setBusquedaReceta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const [nuevaReceta, setNuevaReceta] = useState<Omit<Receta, 'id'>>({
    pacienteId: '',
    pacienteNombre: '',
    pacienteCedula: '',
    medicoId: '1',
    medicoNombre: 'Dr. Sistema Médico',
    medicoLicencia: 'LIC-12345',
    fecha: new Date().toISOString().split('T')[0],
    prescripciones: [],
    diagnostico: '',
    observaciones: '',
    estado: 'Borrador',
    validaHasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 días
  });

  const [prescripcionTemporal, setPrescripcionTemporal] = useState<Omit<Prescripcion, 'id' | 'medicamentoId' | 'medicamentoNombre'>>({
    dosis: '',
    frecuencia: '',
    duracion: '',
    cantidad: '',
    indicaciones: '',
    viaAdministracion: 'Oral'
  });

  useEffect(() => {
    // Simular carga de medicamentos
    setTimeout(() => {
      const medicamentosIniciales: Medicamento[] = [
        {
          id: '1',
          nombre: 'Paracetamol',
          nombreGenerico: 'Acetaminofén',
          concentracion: '500mg',
          formaFarmaceutica: 'Tableta',
          laboratorio: 'Laboratorios Unidos',
          categoria: 'Analgésico',
          requiereReceta: false,
          contraindicaciones: ['Insuficiencia hepática severa', 'Alergia al acetaminofén'],
          efectosSecundarios: ['Náuseas leves', 'Erupción cutánea (raro)'],
          interacciones: ['Warfarina', 'Alcohol'],
          dosisAdulto: '500-1000mg cada 6-8 horas',
          dosisNino: '10-15mg/kg cada 6-8 horas',
          embarazo: 'B',
          lactancia: true
        },
        {
          id: '2',
          nombre: 'Amoxicilina',
          nombreGenerico: 'Amoxicilina',
          concentracion: '500mg',
          formaFarmaceutica: 'Cápsula',
          laboratorio: 'Antibióticos SA',
          categoria: 'Antibiótico',
          requiereReceta: true,
          contraindicaciones: ['Alergia a penicilinas', 'Mononucleosis'],
          efectosSecundarios: ['Diarrea', 'Náuseas', 'Erupción cutánea'],
          interacciones: ['Anticoagulantes orales', 'Metotrexato'],
          dosisAdulto: '500mg cada 8 horas',
          dosisNino: '20-40mg/kg/día dividido en 3 dosis',
          embarazo: 'B',
          lactancia: true
        },
        {
          id: '3',
          nombre: 'Enalapril',
          nombreGenerico: 'Enalapril maleato',
          concentracion: '10mg',
          formaFarmaceutica: 'Tableta',
          laboratorio: 'Cardio Pharma',
          categoria: 'Antihipertensivo',
          requiereReceta: true,
          contraindicaciones: ['Embarazo', 'Angioedema previo', 'Estenosis renal bilateral'],
          efectosSecundarios: ['Tos seca', 'Hipotensión', 'Hiperpotasemia'],
          interacciones: ['Diuréticos', 'Litio', 'AINEs'],
          dosisAdulto: '5-40mg/día en 1-2 dosis',
          dosisNino: '0.08-0.6mg/kg/día',
          embarazo: 'D',
          lactancia: false
        },
        {
          id: '4',
          nombre: 'Metformina',
          nombreGenerico: 'Metformina clorhidrato',
          concentracion: '500mg',
          formaFarmaceutica: 'Tableta',
          laboratorio: 'Diabetes Control',
          categoria: 'Antidiabético',
          requiereReceta: true,
          contraindicaciones: ['Insuficiencia renal', 'Acidosis metabólica', 'Insuficiencia cardíaca'],
          efectosSecundarios: ['Diarrea', 'Náuseas', 'Dolor abdominal'],
          interacciones: ['Alcohol', 'Contrastes yodados', 'Diuréticos'],
          dosisAdulto: '500-2000mg/día dividido en 2-3 dosis',
          dosisNino: 'No recomendado < 10 años',
          embarazo: 'B',
          lactancia: false
        },
        {
          id: '5',
          nombre: 'Omeprazol',
          nombreGenerico: 'Omeprazol',
          concentracion: '20mg',
          formaFarmaceutica: 'Cápsula',
          laboratorio: 'Gastro Med',
          categoria: 'Inhibidor de bomba de protones',
          requiereReceta: false,
          contraindicaciones: ['Alergia a benzimidazoles'],
          efectosSecundarios: ['Cefalea', 'Diarrea', 'Dolor abdominal'],
          interacciones: ['Warfarina', 'Digoxina', 'Ketoconazol'],
          dosisAdulto: '20-40mg/día',
          dosisNino: '0.7-3.3mg/kg/día',
          embarazo: 'C',
          lactancia: true
        },
        {
          id: '6',
          nombre: 'Ibuprofeno',
          nombreGenerico: 'Ibuprofeno',
          concentracion: '400mg',
          formaFarmaceutica: 'Tableta',
          laboratorio: 'Anti-inflamatorios Ltd',
          categoria: 'AINE',
          requiereReceta: false,
          contraindicaciones: ['Úlcera péptica activa', 'Insuficiencia cardíaca severa', 'Tercer trimestre embarazo'],
          efectosSecundarios: ['Dispepsia', 'Náuseas', 'Cefalea'],
          interacciones: ['Warfarina', 'Litio', 'Metotrexato'],
          dosisAdulto: '400-800mg cada 6-8 horas',
          dosisNino: '5-10mg/kg cada 6-8 horas',
          embarazo: 'C',
          lactancia: true
        },
        {
          id: '7',
          nombre: 'Losartán',
          nombreGenerico: 'Losartán potásico',
          concentracion: '50mg',
          formaFarmaceutica: 'Tableta',
          laboratorio: 'Cardio Pharma',
          categoria: 'Antihipertensivo',
          requiereReceta: true,
          contraindicaciones: ['Embarazo', 'Lactancia', 'Estenosis renal bilateral'],
          efectosSecundarios: ['Mareos', 'Fatiga', 'Hiperpotasemia'],
          interacciones: ['Diuréticos ahorradores de potasio', 'Litio'],
          dosisAdulto: '25-100mg/día',
          dosisNino: 'No establecida',
          embarazo: 'D',
          lactancia: false
        },
        {
          id: '8',
          nombre: 'Atorvastatina',
          nombreGenerico: 'Atorvastatina cálcica',
          concentracion: '20mg',
          formaFarmaceutica: 'Tableta',
          laboratorio: 'Colesterol Control',
          categoria: 'Hipolipemiante',
          requiereReceta: true,
          contraindicaciones: ['Enfermedad hepática activa', 'Embarazo', 'Lactancia'],
          efectosSecundarios: ['Mialgia', 'Cefalea', 'Dispepsia'],
          interacciones: ['Digoxina', 'Warfarina', 'Ciclosporina'],
          dosisAdulto: '10-80mg/día por la noche',
          dosisNino: 'No recomendado',
          embarazo: 'X',
          lactancia: false
        }
      ];

      const recetasIniciales: Receta[] = [
        {
          id: '1',
          pacienteId: '1',
          pacienteNombre: 'María González',
          pacienteCedula: '12345678',
          medicoId: '1',
          medicoNombre: 'Dr. Sistema Médico',
          medicoLicencia: 'LIC-12345',
          fecha: '2024-01-15',
          prescripciones: [
            {
              id: '1',
              medicamentoId: '4',
              medicamentoNombre: 'Metformina 500mg',
              dosis: '500mg',
              frecuencia: 'Cada 12 horas',
              duracion: '30 días',
              cantidad: '60 tabletas',
              indicaciones: 'Tomar con las comidas',
              viaAdministracion: 'Oral'
            },
            {
              id: '2',
              medicamentoId: '3',
              medicamentoNombre: 'Enalapril 10mg',
              dosis: '10mg',
              frecuencia: 'Una vez al día',
              duracion: '30 días',
              cantidad: '30 tabletas',
              indicaciones: 'Tomar en ayunas',
              viaAdministracion: 'Oral'
            }
          ],
          diagnostico: 'Diabetes Mellitus Tipo 2 + Hipertensión Arterial',
          observaciones: 'Control en 30 días. Monitorear glicemia y presión arterial.',
          estado: 'Emitida',
          validaHasta: '2024-02-15'
        }
      ];

      setMedicamentos(medicamentosIniciales);
      setRecetas(recetasIniciales);
      setLoading(false);
    }, 1000);
  }, []);

  const verificarInteracciones = (medicamentoId: string): string[] => {
    const medicamento = medicamentos.find(m => m.id === medicamentoId);
    if (!medicamento) return [];

    const interaccionesEncontradas: string[] = [];
    
    nuevaReceta.prescripciones.forEach(prescripcion => {
      const otroMedicamento = medicamentos.find(m => m.id === prescripcion.medicamentoId);
      if (otroMedicamento && otroMedicamento.id !== medicamentoId) {
        // Verificar si hay interacciones
        const interaccionesComunes = medicamento.interacciones.filter(interaccion =>
          otroMedicamento.nombre.toLowerCase().includes(interaccion.toLowerCase()) ||
          otroMedicamento.categoria.toLowerCase().includes(interaccion.toLowerCase())
        );
        interaccionesEncontradas.push(...interaccionesComunes.map(i => `${i} (con ${otroMedicamento.nombre})`));
      }
    });

    return interaccionesEncontradas;
  };

  const verificarAlergias = (medicamentoId: string): boolean => {
    // Simular verificación de alergias del paciente
    const alergiasSimuladas = ['Penicilina', 'Aspirina'];
    const medicamento = medicamentos.find(m => m.id === medicamentoId);
    
    if (!medicamento) return false;
    
    return alergiasSimuladas.some(alergia => 
      medicamento.nombre.toLowerCase().includes(alergia.toLowerCase()) ||
      medicamento.categoria.toLowerCase().includes(alergia.toLowerCase())
    );
  };

  const agregarMedicamentoAReceta = (medicamento: Medicamento) => {
    const nuevaPrescripcion: Prescripcion = {
      id: Date.now().toString(),
      medicamentoId: medicamento.id,
      medicamentoNombre: `${medicamento.nombre} ${medicamento.concentracion}`,
      ...prescripcionTemporal
    };

    setNuevaReceta(prev => ({
      ...prev,
      prescripciones: [...prev.prescripciones, nuevaPrescripcion]
    }));

    setPrescripcionTemporal({
      dosis: '',
      frecuencia: '',
      duracion: '',
      cantidad: '',
      indicaciones: '',
      viaAdministracion: 'Oral'
    });

    setShowBuscarMedicamento(false);
  };

  const eliminarPrescripcion = (prescripcionId: string) => {
    setNuevaReceta(prev => ({
      ...prev,
      prescripciones: prev.prescripciones.filter(p => p.id !== prescripcionId)
    }));
  };

  const handleCrearReceta = () => {
    const recetaCompleta: Receta = {
      ...nuevaReceta,
      id: Date.now().toString()
    };
    
    setRecetas(prev => [...prev, recetaCompleta]);
    setShowNuevaReceta(false);
    resetFormulario();
  };

  const resetFormulario = () => {
    setNuevaReceta({
      pacienteId: '',
      pacienteNombre: '',
      pacienteCedula: '',
      medicoId: '1',
      medicoNombre: 'Dr. Sistema Médico',
      medicoLicencia: 'LIC-12345',
      fecha: new Date().toISOString().split('T')[0],
      prescripciones: [],
      diagnostico: '',
      observaciones: '',
      estado: 'Borrador',
      validaHasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const imprimirReceta = (receta: Receta) => {
    const contenidoReceta = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receta Médica</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .patient-info { margin: 20px 0; }
          .prescription { border: 1px solid #ccc; margin: 10px 0; padding: 10px; }
          .footer { margin-top: 30px; text-align: center; }
          .signature { margin-top: 50px; border-top: 1px solid #333; width: 200px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RECETA MÉDICA</h1>
          <p><strong>Dr. ${receta.medicoNombre}</strong></p>
          <p>Licencia Médica: ${receta.medicoLicencia}</p>
          <p>Fecha: ${new Date(receta.fecha).toLocaleDateString('es-ES')}</p>
        </div>
        
        <div class="patient-info">
          <p><strong>Paciente:</strong> ${receta.pacienteNombre}</p>
          <p><strong>Cédula:</strong> ${receta.pacienteCedula}</p>
          <p><strong>Diagnóstico:</strong> ${receta.diagnostico}</p>
        </div>
        
        <h3>PRESCRIPCIONES:</h3>
        ${receta.prescripciones.map((prescripcion, index) => `
          <div class="prescription">
            <p><strong>${index + 1}. ${prescripcion.medicamentoNombre}</strong></p>
            <p><strong>Dosis:</strong> ${prescripcion.dosis}</p>
            <p><strong>Frecuencia:</strong> ${prescripcion.frecuencia}</p>
            <p><strong>Duración:</strong> ${prescripcion.duracion}</p>
            <p><strong>Cantidad:</strong> ${prescripcion.cantidad}</p>
            <p><strong>Vía:</strong> ${prescripcion.viaAdministracion}</p>
            ${prescripcion.indicaciones ? `<p><strong>Indicaciones:</strong> ${prescripcion.indicaciones}</p>` : ''}
          </div>
        `).join('')}
        
        ${receta.observaciones ? `<p><strong>Observaciones:</strong> ${receta.observaciones}</p>` : ''}
        
        <div class="footer">
          <p><strong>Válida hasta:</strong> ${new Date(receta.validaHasta).toLocaleDateString('es-ES')}</p>
          <div class="signature">
            <p>Firma y Sello del Médico</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(contenidoReceta);
      ventana.document.close();
      ventana.print();
    }
  };

  const medicamentosFiltrados = medicamentos.filter(medicamento => {
    const matchBusqueda = !busquedaMedicamento || 
      medicamento.nombre.toLowerCase().includes(busquedaMedicamento.toLowerCase()) ||
      medicamento.nombreGenerico.toLowerCase().includes(busquedaMedicamento.toLowerCase()) ||
      medicamento.categoria.toLowerCase().includes(busquedaMedicamento.toLowerCase());
    
    const matchCategoria = !filtroCategoria || medicamento.categoria === filtroCategoria;
    
    return matchBusqueda && matchCategoria;
  });

  const recetasFiltradas = recetas.filter(receta => {
    const matchBusqueda = !busquedaReceta || 
      receta.pacienteNombre.toLowerCase().includes(busquedaReceta.toLowerCase()) ||
      receta.pacienteCedula.includes(busquedaReceta) ||
      receta.diagnostico.toLowerCase().includes(busquedaReceta.toLowerCase());
    
    const matchEstado = !filtroEstado || receta.estado === filtroEstado;
    
    return matchBusqueda && matchEstado;
  });

  const categoriasMedicamentos = [...new Set(medicamentos.map(m => m.categoria))];

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando recetario digital..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Pill className="w-8 h-8 text-blue-600" />
            Recetario Digital
          </h1>
          <p className="text-gray-600">
            Sistema completo de prescripciones médicas con verificación de interacciones
          </p>
        </div>
        
        <Dialog open={showNuevaReceta} onOpenChange={setShowNuevaReceta}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Receta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Receta</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="paciente" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paciente">Datos del Paciente</TabsTrigger>
                <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
                <TabsTrigger value="revision">Revisión</TabsTrigger>
              </TabsList>
              
              <TabsContent value="paciente" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paciente-nombre">Nombre del Paciente *</Label>
                    <Input
                      id="paciente-nombre"
                      value={nuevaReceta.pacienteNombre}
                      onChange={(e) => setNuevaReceta({...nuevaReceta, pacienteNombre: e.target.value})}
                      placeholder="Nombre completo del paciente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paciente-cedula">Cédula *</Label>
                    <Input
                      id="paciente-cedula"
                      value={nuevaReceta.pacienteCedula}
                      onChange={(e) => setNuevaReceta({...nuevaReceta, pacienteCedula: e.target.value})}
                      placeholder="Número de cédula"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="diagnostico">Diagnóstico *</Label>
                  <Input
                    id="diagnostico"
                    value={nuevaReceta.diagnostico}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, diagnostico: e.target.value})}
                    placeholder="Diagnóstico principal"
                  />
                </div>
                
                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={nuevaReceta.observaciones}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, observaciones: e.target.value})}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha">Fecha de Emisión</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={nuevaReceta.fecha}
                      onChange={(e) => setNuevaReceta({...nuevaReceta, fecha: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="valida-hasta">Válida Hasta</Label>
                    <Input
                      id="valida-hasta"
                      type="date"
                      value={nuevaReceta.validaHasta}
                      onChange={(e) => setNuevaReceta({...nuevaReceta, validaHasta: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medicamentos" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Medicamentos Prescritos</h3>
                  <Dialog open={showBuscarMedicamento} onOpenChange={setShowBuscarMedicamento}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Medicamento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Buscar y Agregar Medicamento</DialogTitle>
                      </DialogHeader>
                      
                      {/* Filtros de búsqueda */}
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Buscar medicamento..."
                            value={busquedaMedicamento}
                            onChange={(e) => setBusquedaMedicamento(e.target.value)}
                          />
                        </div>
                        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todas</SelectItem>
                            {categoriasMedicamentos.map(categoria => (
                              <SelectItem key={categoria} value={categoria}>
                                {categoria}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Lista de medicamentos */}
                      <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                        {medicamentosFiltrados.map(medicamento => {
                          const tieneInteracciones = verificarInteracciones(medicamento.id).length > 0;
                          const esAlergico = verificarAlergias(medicamento.id);
                          
                          return (
                            <div 
                              key={medicamento.id}
                              className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                                esAlergico ? 'border-red-300 bg-red-50' : 
                                tieneInteracciones ? 'border-yellow-300 bg-yellow-50' : 
                                'border-gray-200'
                              }`}
                              onClick={() => {
                                if (!esAlergico) {
                                  // Aquí se abriría un modal para configurar la prescripción
                                  alert('Configurar prescripción para: ' + medicamento.nombre);
                                }
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium">{medicamento.nombre}</div>
                                  <div className="text-sm text-gray-600">
                                    {medicamento.nombreGenerico} - {medicamento.concentracion}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {medicamento.formaFarmaceutica} | {medicamento.categoria}
                                  </div>
                                  
                                  {esAlergico && (
                                    <div className="mt-2 flex items-center gap-1 text-red-600">
                                      <AlertTriangle className="w-4 h-4" />
                                      <span className="text-sm font-medium">ALERGIA DETECTADA</span>
                                    </div>
                                  )}
                                  
                                  {tieneInteracciones && !esAlergico && (
                                    <div className="mt-2 flex items-center gap-1 text-yellow-600">
                                      <AlertTriangle className="w-4 h-4" />
                                      <span className="text-sm">Posibles interacciones</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                  {medicamento.requiereReceta && (
                                    <Badge variant="outline" className="text-xs">
                                      Receta
                                    </Badge>
                                  )}
                                  <Badge variant="secondary" className="text-xs">
                                    {medicamento.embarazo}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Formulario de prescripción */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Configurar Prescripción</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Dosis</Label>
                            <Input
                              value={prescripcionTemporal.dosis}
                              onChange={(e) => setPrescripcionTemporal({...prescripcionTemporal, dosis: e.target.value})}
                              placeholder="ej: 500mg"
                            />
                          </div>
                          <div>
                            <Label>Frecuencia</Label>
                            <Select 
                              value={prescripcionTemporal.frecuencia} 
                              onValueChange={(value) => setPrescripcionTemporal({...prescripcionTemporal, frecuencia: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Cada 4 horas">Cada 4 horas</SelectItem>
                                <SelectItem value="Cada 6 horas">Cada 6 horas</SelectItem>
                                <SelectItem value="Cada 8 horas">Cada 8 horas</SelectItem>
                                <SelectItem value="Cada 12 horas">Cada 12 horas</SelectItem>
                                <SelectItem value="Una vez al día">Una vez al día</SelectItem>
                                <SelectItem value="Dos veces al día">Dos veces al día</SelectItem>
                                <SelectItem value="Tres veces al día">Tres veces al día</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Duración</Label>
                            <Select 
                              value={prescripcionTemporal.duracion} 
                              onValueChange={(value) => setPrescripcionTemporal({...prescripcionTemporal, duracion: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3 días">3 días</SelectItem>
                                <SelectItem value="5 días">5 días</SelectItem>
                                <SelectItem value="7 días">7 días</SelectItem>
                                <SelectItem value="10 días">10 días</SelectItem>
                                <SelectItem value="15 días">15 días</SelectItem>
                                <SelectItem value="30 días">30 días</SelectItem>
                                <SelectItem value="60 días">60 días</SelectItem>
                                <SelectItem value="90 días">90 días</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Cantidad</Label>
                            <Input
                              value={prescripcionTemporal.cantidad}
                              onChange={(e) => setPrescripcionTemporal({...prescripcionTemporal, cantidad: e.target.value})}
                              placeholder="ej: 30 tabletas"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label>Indicaciones Especiales</Label>
                          <Textarea
                            value={prescripcionTemporal.indicaciones}
                            onChange={(e) => setPrescripcionTemporal({...prescripcionTemporal, indicaciones: e.target.value})}
                            placeholder="ej: Tomar con las comidas"
                            rows={2}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Lista de medicamentos agregados */}
                <div className="space-y-3">
                  {nuevaReceta.prescripciones.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay medicamentos agregados a esta receta
                    </p>
                  ) : (
                    nuevaReceta.prescripciones.map((prescripcion, index) => (
                      <div key={prescripcion.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-lg">
                              {index + 1}. {prescripcion.medicamentoNombre}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                              <div><strong>Dosis:</strong> {prescripcion.dosis}</div>
                              <div><strong>Frecuencia:</strong> {prescripcion.frecuencia}</div>
                              <div><strong>Duración:</strong> {prescripcion.duracion}</div>
                              <div><strong>Cantidad:</strong> {prescripcion.cantidad}</div>
                            </div>
                            {prescripcion.indicaciones && (
                              <div className="mt-2 text-sm">
                                <strong>Indicaciones:</strong> {prescripcion.indicaciones}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => eliminarPrescripcion(prescripcion.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="revision" className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Resumen de la Receta</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Paciente:</strong> {nuevaReceta.pacienteNombre}</div>
                    <div><strong>Cédula:</strong> {nuevaReceta.pacienteCedula}</div>
                    <div><strong>Diagnóstico:</strong> {nuevaReceta.diagnostico}</div>
                    <div><strong>Fecha:</strong> {nuevaReceta.fecha}</div>
                  </div>
                  
                  <div className="mt-4">
                    <strong>Medicamentos ({nuevaReceta.prescripciones.length}):</strong>
                    <ul className="mt-2 space-y-1">
                      {nuevaReceta.prescripciones.map((prescripcion, index) => (
                        <li key={prescripcion.id} className="text-sm">
                          {index + 1}. {prescripcion.medicamentoNombre} - {prescripcion.dosis} {prescripcion.frecuencia}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Verificaciones de seguridad */}
                <div className="space-y-3">
                  <h4 className="font-medium">Verificaciones de Seguridad</h4>
                  
                  {nuevaReceta.prescripciones.map(prescripcion => {
                    const interacciones = verificarInteracciones(prescripcion.medicamentoId);
                    const esAlergico = verificarAlergias(prescripcion.medicamentoId);
                    
                    if (interacciones.length > 0 || esAlergico) {
                      return (
                        <div key={prescripcion.id} className={`p-3 rounded-lg ${esAlergico ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-4 h-4 ${esAlergico ? 'text-red-600' : 'text-yellow-600'}`} />
                            <span className={`font-medium ${esAlergico ? 'text-red-900' : 'text-yellow-900'}`}>
                              {prescripcion.medicamentoNombre}
                            </span>
                          </div>
                          {esAlergico && (
                            <p className="text-sm text-red-700">⚠️ ALERGIA DETECTADA - No prescribir</p>
                          )}
                          {interacciones.length > 0 && (
                            <div className="text-sm text-yellow-700">
                              <p>Posibles interacciones:</p>
                              <ul className="list-disc list-inside ml-2">
                                {interacciones.map((interaccion, i) => (
                                  <li key={i}>{interaccion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                  
                  {nuevaReceta.prescripciones.every(p => 
                    verificarInteracciones(p.medicamentoId).length === 0 && 
                    !verificarAlergias(p.medicamentoId)
                  ) && nuevaReceta.prescripciones.length > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-900 font-medium">
                          No se detectaron interacciones ni alergias
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {setShowNuevaReceta(false); resetFormulario();}}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCrearReceta}
                disabled={!nuevaReceta.pacienteNombre || !nuevaReceta.diagnostico || nuevaReceta.prescripciones.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Crear Receta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Recetas</p>
                <p className="text-2xl font-bold">{recetas.length}</p>
              </div>
              <Pill className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Emitidas</p>
                <p className="text-2xl font-bold">
                  {recetas.filter(r => r.estado === 'Emitida').length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Medicamentos</p>
                <p className="text-2xl font-bold">{medicamentos.length}</p>
              </div>
              <Pill className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Borradores</p>
                <p className="text-2xl font-bold">
                  {recetas.filter(r => r.estado === 'Borrador').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente, cédula o diagnóstico..."
                  value={busquedaReceta}
                  onChange={(e) => setBusquedaReceta(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Borrador">Borrador</SelectItem>
                  <SelectItem value="Emitida">Emitida</SelectItem>
                  <SelectItem value="Dispensada">Dispensada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Recetas */}
      <div className="space-y-4">
        {recetasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron recetas que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          recetasFiltradas.map(receta => (
            <Card key={receta.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {receta.pacienteNombre}
                      </h3>
                      <Badge variant={
                        receta.estado === 'Emitida' ? 'default' :
                        receta.estado === 'Dispensada' ? 'secondary' :
                        receta.estado === 'Cancelada' ? 'destructive' : 'outline'
                      }>
                        {receta.estado}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Cédula: {receta.pacienteCedula}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(receta.fecha).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Válida hasta: {new Date(receta.validaHasta).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Diagnóstico: </span>
                      <span className="text-sm text-gray-600">{receta.diagnostico}</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Medicamentos ({receta.prescripciones.length}):
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {receta.prescripciones.slice(0, 3).map((prescripcion, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {prescripcion.medicamentoNombre}
                          </Badge>
                        ))}
                        {receta.prescripciones.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{receta.prescripciones.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRecetaSeleccionada(receta)}
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => imprimirReceta(receta)}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Vista Detallada */}
      <Dialog open={!!recetaSeleccionada} onOpenChange={() => setRecetaSeleccionada(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {recetaSeleccionada && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Pill className="w-6 h-6 text-blue-600" />
                  Receta - {recetaSeleccionada.pacienteNombre}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Información del paciente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Información del Paciente</h4>
                    <div><strong>Nombre:</strong> {recetaSeleccionada.pacienteNombre}</div>
                    <div><strong>Cédula:</strong> {recetaSeleccionada.pacienteCedula}</div>
                    <div><strong>Diagnóstico:</strong> {recetaSeleccionada.diagnostico}</div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Información de la Receta</h4>
                    <div><strong>Médico:</strong> {recetaSeleccionada.medicoNombre}</div>
                    <div><strong>Fecha:</strong> {new Date(recetaSeleccionada.fecha).toLocaleDateString('es-ES')}</div>
                    <div><strong>Válida hasta:</strong> {new Date(recetaSeleccionada.validaHasta).toLocaleDateString('es-ES')}</div>
                    <div><strong>Estado:</strong> 
                      <Badge className="ml-2" variant={
                        recetaSeleccionada.estado === 'Emitida' ? 'default' :
                        recetaSeleccionada.estado === 'Dispensada' ? 'secondary' :
                        recetaSeleccionada.estado === 'Cancelada' ? 'destructive' : 'outline'
                      }>
                        {recetaSeleccionada.estado}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Prescripciones */}
                <div>
                  <h4 className="font-semibold mb-3">Medicamentos Prescritos</h4>
                  <div className="space-y-3">
                    {recetaSeleccionada.prescripciones.map((prescripcion, index) => (
                      <div key={prescripcion.id} className="border rounded-lg p-4">
                        <div className="font-medium text-lg mb-2">
                          {index + 1}. {prescripcion.medicamentoNombre}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><strong>Dosis:</strong> {prescripcion.dosis}</div>
                          <div><strong>Frecuencia:</strong> {prescripcion.frecuencia}</div>
                          <div><strong>Duración:</strong> {prescripcion.duracion}</div>
                          <div><strong>Cantidad:</strong> {prescripcion.cantidad}</div>
                        </div>
                        <div className="mt-2 text-sm">
                          <strong>Vía:</strong> {prescripcion.viaAdministracion}
                        </div>
                        {prescripcion.indicaciones && (
                          <div className="mt-2 text-sm">
                            <strong>Indicaciones:</strong> {prescripcion.indicaciones}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Observaciones */}
                {recetaSeleccionada.observaciones && (
                  <div>
                    <h4 className="font-semibold mb-2">Observaciones</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {recetaSeleccionada.observaciones}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => imprimirReceta(recetaSeleccionada)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Receta
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecetarioDigitalComponent;