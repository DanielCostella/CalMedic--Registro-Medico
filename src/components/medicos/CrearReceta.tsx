import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  Mail, 
  FileText, 
  User, 
  Calendar,
  Stethoscope,
  Pill,
  Clock,
  MapPin,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { generarPDFReceta, enviarRecetaPorEmail, descargarPDFReceta, RecetaData } from '../../utils/pdfGenerator';

interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  indicaciones: string;
}

interface Paciente {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  edad: number;
  telefono: string;
  email?: string;
}

interface CrearRecetaProps {
  medicoId: string;
  medicoNombre: string;
  numeroColMedico: string;
}

// Simulated patient data
const pacientesSimulados: Paciente[] = [
  { id: '1', nombres: 'Ana María', apellidos: 'González López', cedula: 'V12345678', edad: 45, telefono: '04141234567', email: 'ana.gonzalez@email.com' },
  { id: '2', nombres: 'Carlos Eduardo', apellidos: 'Pérez Silva', cedula: 'V87654321', edad: 32, telefono: '04169876543', email: 'carlos.perez@email.com' },
  { id: '3', nombres: 'María Elena', apellidos: 'Rodríguez Castro', cedula: 'V11223344', edad: 28, telefono: '04121122334', email: 'maria.rodriguez@email.com' },
  { id: '4', nombres: 'José Antonio', apellidos: 'Martínez Herrera', cedula: 'V44332211', edad: 55, telefono: '04143344221' },
];

export default function CrearReceta({ medicoId, medicoNombre, numeroColMedico }: CrearRecetaProps) {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [diagnostico, setDiagnostico] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const recetaRef = useRef<HTMLDivElement>(null);

  const [nuevoMedicamento, setNuevoMedicamento] = useState<Omit<Medicamento, 'id'>>({
    nombre: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    indicaciones: ''
  });

  const agregarMedicamento = () => {
    if (!nuevoMedicamento.nombre || !nuevoMedicamento.dosis) {
      toast.error('Nombre y dosis del medicamento son obligatorios');
      return;
    }

    const medicamento: Medicamento = {
      id: Date.now().toString(),
      ...nuevoMedicamento
    };

    setMedicamentos([...medicamentos, medicamento]);
    setNuevoMedicamento({
      nombre: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      indicaciones: ''
    });
    toast.success('Medicamento agregado');
  };

  const eliminarMedicamento = (id: string) => {
    setMedicamentos(medicamentos.filter(med => med.id !== id));
    toast.success('Medicamento eliminado');
  };

  const seleccionarPaciente = (pacienteId: string) => {
    const paciente = pacientesSimulados.find(p => p.id === pacienteId);
    setPacienteSeleccionado(paciente || null);
  };

  const guardarReceta = async () => {
    if (!pacienteSeleccionado || medicamentos.length === 0) {
      toast.error('Debe seleccionar un paciente y agregar al menos un medicamento');
      return;
    }

    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Receta guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la receta');
    } finally {
      setLoading(false);
    }
  };

  const prepararDatosReceta = (): RecetaData => {
    if (!pacienteSeleccionado) {
      throw new Error('No hay paciente seleccionado');
    }

    return {
      medicoNombre,
      numeroColMedico,
      paciente: pacienteSeleccionado,
      diagnostico: diagnostico || undefined,
      medicamentos: medicamentos.map(med => ({
        nombre: med.nombre,
        dosis: med.dosis,
        frecuencia: med.frecuencia || undefined,
        duracion: med.duracion || undefined,
        indicaciones: med.indicaciones || undefined
      })),
      observaciones: observaciones || undefined
    };
  };

  const imprimirReceta = () => {
    if (!pacienteSeleccionado || medicamentos.length === 0) {
      toast.error('Debe completar la receta antes de imprimir');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const recetaHTML = generarHTMLReceta();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receta Médica - ${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 20px; 
              margin-bottom: 30px;
            }
            .doctor-info { 
              background: #f8fafc; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 20px;
            }
            .patient-info { 
              background: #f1f5f9; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 20px;
            }
            .medication { 
              border: 1px solid #e2e8f0; 
              padding: 15px; 
              margin-bottom: 15px; 
              border-radius: 8px;
              background: white;
            }
            .medication-name { 
              font-weight: bold; 
              color: #1e40af; 
              font-size: 16px;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 20px;
            }
            .signature-line {
              border-top: 1px solid #333;
              width: 300px;
              margin: 40px auto 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${recetaHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    toast.success('Receta enviada a impresora');
  };

  const descargarPDF = async () => {
    if (!pacienteSeleccionado || medicamentos.length === 0) {
      toast.error('Debe completar la receta antes de descargar');
      return;
    }

    setPdfLoading(true);
    try {
      const datosReceta = prepararDatosReceta();
      await descargarPDFReceta(datosReceta);
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      toast.error('Error al generar el PDF');
      console.error('Error:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  const enviarPorEmail = async () => {
    if (!pacienteSeleccionado || medicamentos.length === 0) {
      toast.error('Debe completar la receta antes de enviar');
      return;
    }

    if (!pacienteSeleccionado.email) {
      toast.error('El paciente no tiene email registrado');
      return;
    }

    setEmailLoading(true);
    try {
      const datosReceta = prepararDatosReceta();
      const exito = await enviarRecetaPorEmail(datosReceta, pacienteSeleccionado.email);
      
      if (exito) {
        toast.success(`Receta enviada por email a ${pacienteSeleccionado.email}`);
      } else {
        toast.error('Error al enviar la receta por email');
      }
    } catch (error) {
      toast.error('Error al enviar la receta por email');
      console.error('Error:', error);
    } finally {
      setEmailLoading(false);
    }
  };

  const generarHTMLReceta = () => {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div class="header">
        <h1 style="color: #2563eb; margin: 0;">RECETA MÉDICA</h1>
        <p style="margin: 5px 0;">Sistema EstiloLibre</p>
      </div>

      <div class="doctor-info">
        <h3 style="margin-top: 0; color: #059669;">Información del Médico</h3>
        <p><strong>Nombre:</strong> ${medicoNombre}</p>
        <p><strong>Colegio Médico:</strong> ${numeroColMedico}</p>
        <p><strong>Fecha:</strong> ${fechaActual}</p>
      </div>

      <div class="patient-info">
        <h3 style="margin-top: 0; color: #7c3aed;">Información del Paciente</h3>
        <p><strong>Nombre:</strong> ${pacienteSeleccionado?.nombres} ${pacienteSeleccionado?.apellidos}</p>
        <p><strong>Cédula:</strong> ${pacienteSeleccionado?.cedula}</p>
        <p><strong>Edad:</strong> ${pacienteSeleccionado?.edad} años</p>
        <p><strong>Teléfono:</strong> ${pacienteSeleccionado?.telefono}</p>
      </div>

      ${diagnostico ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #dc2626;">Diagnóstico</h3>
          <p style="background: #fef2f2; padding: 10px; border-radius: 5px;">${diagnostico}</p>
        </div>
      ` : ''}

      <div>
        <h3 style="color: #2563eb;">Medicamentos Prescritos</h3>
        ${medicamentos.map((med, index) => `
          <div class="medication">
            <div class="medication-name">${index + 1}. ${med.nombre}</div>
            <p><strong>Dosis:</strong> ${med.dosis}</p>
            ${med.frecuencia ? `<p><strong>Frecuencia:</strong> ${med.frecuencia}</p>` : ''}
            ${med.duracion ? `<p><strong>Duración:</strong> ${med.duracion}</p>` : ''}
            ${med.indicaciones ? `<p><strong>Indicaciones:</strong> ${med.indicaciones}</p>` : ''}
          </div>
        `).join('')}
      </div>

      ${observaciones ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #7c2d12;">Observaciones</h3>
          <p style="background: #fefbf2; padding: 10px; border-radius: 5px;">${observaciones}</p>
        </div>
      ` : ''}

      <div class="footer">
        <div class="signature-line"></div>
        <p><strong>Firma del Médico</strong></p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">
          Esta receta fue generada electrónicamente por el Sistema EstiloLibre<br>
          Fecha de emisión: ${new Date().toLocaleString('es-ES')}
        </p>
      </div>
    `;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Crear Receta Médica</h1>
          <p className="text-slate-600 mt-1">Prescripción de medicamentos</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={imprimirReceta}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={!pacienteSeleccionado || medicamentos.length === 0}
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir</span>
          </Button>
          <Button
            onClick={descargarPDF}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={!pacienteSeleccionado || medicamentos.length === 0 || pdfLoading}
          >
            <Download className="h-4 w-4" />
            <span>{pdfLoading ? 'Generando...' : 'Descargar PDF'}</span>
          </Button>
          <Button
            onClick={enviarPorEmail}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={!pacienteSeleccionado || medicamentos.length === 0 || emailLoading}
          >
            <Mail className="h-4 w-4" />
            <span>{emailLoading ? 'Enviando...' : 'Enviar Email'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de Receta */}
        <div className="space-y-6">
          {/* Selección de Paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Seleccionar Paciente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={seleccionarPaciente}>
                <SelectTrigger>
                  <SelectValue placeholder="Buscar paciente..." />
                </SelectTrigger>
                <SelectContent>
                  {pacientesSimulados.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nombres} {paciente.apellidos} - {paciente.cedula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {pacienteSeleccionado && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Paciente Seleccionado</h4>
                  <div className="mt-2 space-y-1 text-sm text-blue-800">
                    <p><strong>Nombre:</strong> {pacienteSeleccionado.nombres} {pacienteSeleccionado.apellidos}</p>
                    <p><strong>Cédula:</strong> {pacienteSeleccionado.cedula}</p>
                    <p><strong>Edad:</strong> {pacienteSeleccionado.edad} años</p>
                    <p><strong>Teléfono:</strong> {pacienteSeleccionado.telefono}</p>
                    {pacienteSeleccionado.email && (
                      <p><strong>Email:</strong> {pacienteSeleccionado.email}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diagnóstico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-red-600" />
                <span>Diagnóstico</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ingrese el diagnóstico del paciente..."
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Agregar Medicamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5 text-green-600" />
                <span>Agregar Medicamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Medicamento *</Label>
                  <Input
                    id="nombre"
                    value={nuevoMedicamento.nombre}
                    onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, nombre: e.target.value})}
                    placeholder="Ej: Paracetamol"
                  />
                </div>
                <div>
                  <Label htmlFor="dosis">Dosis *</Label>
                  <Input
                    id="dosis"
                    value={nuevoMedicamento.dosis}
                    onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, dosis: e.target.value})}
                    placeholder="Ej: 500mg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frecuencia">Frecuencia</Label>
                  <Input
                    id="frecuencia"
                    value={nuevoMedicamento.frecuencia}
                    onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, frecuencia: e.target.value})}
                    placeholder="Ej: Cada 8 horas"
                  />
                </div>
                <div>
                  <Label htmlFor="duracion">Duración</Label>
                  <Input
                    id="duracion"
                    value={nuevoMedicamento.duracion}
                    onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, duracion: e.target.value})}
                    placeholder="Ej: 7 días"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="indicaciones">Indicaciones Especiales</Label>
                <Textarea
                  id="indicaciones"
                  value={nuevoMedicamento.indicaciones}
                  onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, indicaciones: e.target.value})}
                  placeholder="Ej: Tomar con alimentos"
                  rows={2}
                />
              </div>

              <Button onClick={agregarMedicamento} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Medicamento
              </Button>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Observaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Observaciones adicionales, recomendaciones, próxima cita..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Vista Previa de la Receta */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Vista Previa de la Receta</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={recetaRef} className="space-y-4 p-4 border rounded-lg bg-white">
                {/* Header */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold text-blue-600">RECETA MÉDICA</h2>
                  <p className="text-sm text-slate-600">Sistema EstiloLibre</p>
                </div>

                {/* Información del Médico */}
                <div className="bg-green-50 p-3 rounded">
                  <h3 className="font-semibold text-green-800 mb-2">Información del Médico</h3>
                  <p className="text-sm"><strong>Nombre:</strong> {medicoNombre}</p>
                  <p className="text-sm"><strong>Colegio Médico:</strong> {numeroColMedico}</p>
                  <p className="text-sm"><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                </div>

                {/* Información del Paciente */}
                {pacienteSeleccionado && (
                  <div className="bg-blue-50 p-3 rounded">
                    <h3 className="font-semibold text-blue-800 mb-2">Información del Paciente</h3>
                    <p className="text-sm"><strong>Nombre:</strong> {pacienteSeleccionado.nombres} {pacienteSeleccionado.apellidos}</p>
                    <p className="text-sm"><strong>Cédula:</strong> {pacienteSeleccionado.cedula}</p>
                    <p className="text-sm"><strong>Edad:</strong> {pacienteSeleccionado.edad} años</p>
                  </div>
                )}

                {/* Diagnóstico */}
                {diagnostico && (
                  <div className="bg-red-50 p-3 rounded">
                    <h3 className="font-semibold text-red-800 mb-2">Diagnóstico</h3>
                    <p className="text-sm">{diagnostico}</p>
                  </div>
                )}

                {/* Medicamentos */}
                {medicamentos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Medicamentos Prescritos</h3>
                    <div className="space-y-3">
                      {medicamentos.map((medicamento, index) => (
                        <div key={medicamento.id} className="border p-3 rounded bg-slate-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-600">
                                {index + 1}. {medicamento.nombre}
                              </h4>
                              <p className="text-sm mt-1"><strong>Dosis:</strong> {medicamento.dosis}</p>
                              {medicamento.frecuencia && (
                                <p className="text-sm"><strong>Frecuencia:</strong> {medicamento.frecuencia}</p>
                              )}
                              {medicamento.duracion && (
                                <p className="text-sm"><strong>Duración:</strong> {medicamento.duracion}</p>
                              )}
                              {medicamento.indicaciones && (
                                <p className="text-sm"><strong>Indicaciones:</strong> {medicamento.indicaciones}</p>
                              )}
                            </div>
                            <Button
                              onClick={() => eliminarMedicamento(medicamento.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observaciones */}
                {observaciones && (
                  <div className="bg-yellow-50 p-3 rounded">
                    <h3 className="font-semibold text-yellow-800 mb-2">Observaciones</h3>
                    <p className="text-sm">{observaciones}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center pt-4 border-t">
                  <div className="w-48 mx-auto border-t border-slate-400 mt-8 mb-2"></div>
                  <p className="text-sm font-medium">Firma del Médico</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex space-x-4">
            <Button
              onClick={guardarReceta}
              disabled={loading || !pacienteSeleccionado || medicamentos.length === 0}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Receta'}
            </Button>
          </div>

          {/* Estado de funciones */}
          {pacienteSeleccionado && medicamentos.length > 0 && (
            <Alert>
              <AlertDescription>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Printer className="h-4 w-4 text-blue-600" />
                    <span>Impresión: Lista</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4 text-purple-600" />
                    <span>PDF: Lista</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span>Email: {pacienteSeleccionado.email ? 'Disponible' : 'No disponible'}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}