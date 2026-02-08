import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Calendar, FileText, CreditCard, Bell, MessageCircle, Video, Upload, Heart, Pill, Activity, Download, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino';
  seguroMedico: string;
  numeroPoliza: string;
}

interface ResultadoExamen {
  id: string;
  fecha: string;
  tipoExamen: string;
  laboratorio: string;
  estado: 'Pendiente' | 'Completado' | 'Crítico';
  resultados: ParametroExamen[];
  medico: string;
  observaciones: string;
  archivoUrl?: string;
}

interface ParametroExamen {
  nombre: string;
  valor: string;
  unidad: string;
  rangoNormal: string;
  estado: 'Normal' | 'Alto' | 'Bajo' | 'Crítico';
}

interface RecetaMedica {
  id: string;
  fecha: string;
  medico: string;
  especialidad: string;
  medicamentos: MedicamentoReceta[];
  estado: 'Activa' | 'Dispensada' | 'Vencida';
  validaHasta: string;
  observaciones: string;
}

interface MedicamentoReceta {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  viaAdministracion: string;
  indicaciones: string;
  dispensado: boolean;
}

interface CitaMedica {
  id: string;
  fecha: string;
  hora: string;
  medico: string;
  especialidad: string;
  motivo: string;
  estado: 'Programada' | 'Confirmada' | 'En curso' | 'Completada' | 'Cancelada';
  modalidad: 'Presencial' | 'Virtual';
  consultorio?: string;
  enlaceVideo?: string;
  costo: number;
}

interface Factura {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  estado: 'Pendiente' | 'Pagada' | 'Vencida';
  fechaVencimiento: string;
  metodoPago?: string;
  numeroTransaccion?: string;
}

interface MedicoDisponible {
  id: string;
  nombre: string;
  especialidad: string;
  foto: string;
  horarios: HorarioDisponible[];
  costo: number;
  rating: number;
  experiencia: string;
}

interface HorarioDisponible {
  fecha: string;
  horas: string[];
}

const PortalPacientes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [resultadosExamenes, setResultadosExamenes] = useState<ResultadoExamen[]>([]);
  const [recetas, setRecetas] = useState<RecetaMedica[]>([]);
  const [citas, setCitas] = useState<CitaMedica[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [medicos, setMedicos] = useState<MedicoDisponible[]>([]);
  
  const [showNuevaCita, setShowNuevaCita] = useState(false);
  const [showPago, setShowPago] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState<MedicoDisponible | null>(null);
  
  const [nuevaCita, setNuevaCita] = useState({
    medicoId: '',
    fecha: '',
    hora: '',
    motivo: '',
    modalidad: 'Presencial' as 'Presencial' | 'Virtual'
  });

  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: '',
    tipoTarjeta: 'Visa' as 'Visa' | 'Mastercard' | 'American Express'
  });

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Demo/Mock Fallback logic
          setTimeout(() => {
             const userStr = localStorage.getItem('currentUser');
             const user = userStr ? JSON.parse(userStr) : null;
             
             if (user) {
                setPaciente({
                  id: user.id || '1',
                  nombre: user.firstNames || 'Paciente',
                  apellido: user.lastNames || '',
                  cedula: user.nationalId || '',
                  email: user.email || '',
                  telefono: user.mobilePhone || '',
                  fechaNacimiento: user.birthDate || new Date().toISOString().split('T')[0],
                  genero: user.gender === 'Male' ? 'Masculino' : 'Femenino',
                  seguroMedico: 'Por definir',
                  numeroPoliza: ''
                });
             } else {
                 setPaciente({ id: '1', nombre: 'Invitado', apellido: '', cedula: '', email: '', telefono: '', fechaNacimiento: '', genero: 'Femenino', seguroMedico: '', numeroPoliza: '' });
             }
             setLoading(false);
          }, 500);
          return;
        }

        // Real Data Logic
        let { data: patientData } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', user.id)
          .single();

         // Rescue attempt by National ID if link is missing
        if (!patientData) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('national_id')
              .eq('id', user.id)
              .single();
            
            if (profile?.national_id) {
               const { data: pByCedula } = await supabase
                 .from('patients')
                 .select('*')
                 .eq('national_id', profile.national_id)
                 .single();
               
               if (pByCedula) {
                 patientData = pByCedula;
                 // Self-repair: Link the user now
                 supabase.from('patients').update({ user_id: user.id }).eq('id', patientData.id).then();
               }
            }
        }

        if (patientData) {
          setPaciente({
            id: patientData.id,
            nombre: patientData.first_name,
            apellido: patientData.last_name,
            cedula: patientData.national_id,
            email: patientData.email || user.email || '',
            telefono: patientData.phone || '',
            fechaNacimiento: patientData.birth_date || '',
            genero: patientData.gender === 'Male' ? 'Masculino' : 'Femenino',
            seguroMedico: patientData.medical_insurance || 'No registrado',
            numeroPoliza: ''
          });
        } else {
           // Fallback to minimal profile data if no patient record exists
           const { data: profile } = await supabase
             .from('profiles')
             .select('*')
             .eq('id', user.id)
             .single();
            
           if (profile) {
              setPaciente({
                id: profile.id,
                nombre: profile.first_names,
                apellido: profile.last_names,
                cedula: profile.national_id,
                email: profile.email,
                telefono: profile.mobile_phone || '',
                fechaNacimiento: profile.birth_date || '',
                genero: profile.gender === 'Male' ? 'Masculino' : 'Femenino',
                seguroMedico: 'No registrado',
                numeroPoliza: ''
              });
           }
        }
        
      } catch (error) {
        console.error("Error loading patient data", error);
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();

    // MOCK DATA LOADING FOR SUB-COMPONENTS
    const resultadosData: ResultadoExamen[] = [
        {
          id: '1',
          fecha: '2024-01-15',
          tipoExamen: 'Hemograma Completo',
          laboratorio: 'Lab Central',
          estado: 'Completado',
          medico: 'Dr. Juan Pérez',
          observaciones: 'Valores dentro de parámetros normales',
          archivoUrl: '/resultados/hemograma_123.pdf',
          resultados: [
            { nombre: 'Hemoglobina', valor: '13.5', unidad: 'g/dL', rangoNormal: '12.0-15.5', estado: 'Normal' },
            { nombre: 'Hematocrito', valor: '40.2', unidad: '%', rangoNormal: '36.0-46.0', estado: 'Normal' },
            { nombre: 'Leucocitos', valor: '7.2', unidad: '10³/μL', rangoNormal: '4.5-11.0', estado: 'Normal' },
            { nombre: 'Plaquetas', valor: '280', unidad: '10³/μL', rangoNormal: '150-450', estado: 'Normal' }
          ]
        },
        {
          id: '2',
          fecha: '2024-01-10',
          tipoExamen: 'Perfil Lipídico',
          laboratorio: 'Lab Central',
          estado: 'Crítico',
          medico: 'Dr. Juan Pérez',
          observaciones: 'Colesterol total elevado. Requiere seguimiento.',
          archivoUrl: '/resultados/lipidos_124.pdf',
          resultados: [
            { nombre: 'Colesterol Total', valor: '245', unidad: 'mg/dL', rangoNormal: '<200', estado: 'Alto' },
            { nombre: 'HDL', valor: '35', unidad: 'mg/dL', rangoNormal: '>40', estado: 'Bajo' },
            { nombre: 'LDL', valor: '165', unidad: 'mg/dL', rangoNormal: '<100', estado: 'Alto' },
            { nombre: 'Triglicéridos', valor: '220', unidad: 'mg/dL', rangoNormal: '<150', estado: 'Alto' }
          ]
        },
        {
          id: '3',
          fecha: '2024-01-05',
          tipoExamen: 'Glucosa en Ayunas',
          laboratorio: 'Lab Express',
          estado: 'Completado',
          medico: 'Dra. Ana Martínez',
          observaciones: 'Glucosa normal',
          resultados: [
            { nombre: 'Glucosa', valor: '92', unidad: 'mg/dL', rangoNormal: '70-100', estado: 'Normal' }
          ]
        }
      ];

      const recetasData: RecetaMedica[] = [
        {
          id: '1',
          fecha: '2024-01-16',
          medico: 'Dr. Juan Pérez',
          especialidad: 'Medicina Interna',
          estado: 'Activa',
          validaHasta: '2024-02-16',
          observaciones: 'Tomar con alimentos. Control en 15 días.',
          medicamentos: [
            {
              nombre: 'Atorvastatina 20mg',
              dosis: '20mg',
              frecuencia: '1 vez al día',
              duracion: '30 días',
              viaAdministracion: 'Oral',
              indicaciones: 'Tomar en la noche con la cena',
              dispensado: false
            },
            {
              nombre: 'Omega 3 1000mg',
              dosis: '1000mg',
              frecuencia: '2 veces al día',
              duracion: '30 días',
              viaAdministracion: 'Oral',
              indicaciones: 'Tomar con las comidas principales',
              dispensado: true
            }
          ]
        },
        {
          id: '2',
          fecha: '2024-01-10',
          medico: 'Dra. Ana Martínez',
          especialidad: 'Endocrinología',
          estado: 'Dispensada',
          validaHasta: '2024-01-25',
          observaciones: 'Tratamiento completado exitosamente',
          medicamentos: [
            {
              nombre: 'Metformina 850mg',
              dosis: '850mg',
              frecuencia: '2 veces al día',
              duracion: '15 días',
              viaAdministracion: 'Oral',
              indicaciones: 'Tomar con desayuno y cena',
              dispensado: true
            }
          ]
        }
      ];

      const citasData: CitaMedica[] = [
        {
          id: '1',
          fecha: '2024-01-20',
          hora: '10:00',
          medico: 'Dr. Juan Pérez',
          especialidad: 'Medicina Interna',
          motivo: 'Control de colesterol',
          estado: 'Programada',
          modalidad: 'Presencial',
          consultorio: 'Consultorio 2',
          costo: 75
        },
        {
          id: '2',
          fecha: '2024-01-18',
          hora: '15:30',
          medico: 'Dra. Ana Martínez',
          especialidad: 'Endocrinología',
          motivo: 'Videoconsulta de seguimiento',
          estado: 'Confirmada',
          modalidad: 'Virtual',
          enlaceVideo: 'https://meet.clinica.com/room/abc123',
          costo: 60
        },
        {
          id: '3',
          fecha: '2024-01-15',
          hora: '09:00',
          medico: 'Dr. Carlos Rodríguez',
          especialidad: 'Cardiología',
          motivo: 'Consulta inicial',
          estado: 'Completada',
          modalidad: 'Presencial',
          consultorio: 'Consultorio 1',
          costo: 85
        }
      ];

      const facturasData: Factura[] = [
        {
          id: '1',
          fecha: '2024-01-16',
          concepto: 'Consulta - Dr. Juan Pérez',
          monto: 75,
          estado: 'Pendiente',
          fechaVencimiento: '2024-01-30'
        },
        {
          id: '2',
          fecha: '2024-01-15',
          concepto: 'Exámenes de Laboratorio',
          monto: 120,
          estado: 'Pendiente',
          fechaVencimiento: '2024-01-29'
        },
        {
          id: '3',
          fecha: '2024-01-10',
          concepto: 'Videoconsulta - Dra. Ana Martínez',
          monto: 60,
          estado: 'Pagada',
          fechaVencimiento: '2024-01-24',
          metodoPago: 'Tarjeta Visa ****1234',
          numeroTransaccion: 'TXN-789456123'
        }
      ];

      const medicosData: MedicoDisponible[] = [
        {
          id: '1',
          nombre: 'Dr. Juan Pérez',
          especialidad: 'Medicina Interna',
          foto: '/avatars/dr-perez.jpg',
          costo: 75,
          rating: 4.8,
          experiencia: '15 años de experiencia',
          horarios: [
            {
              fecha: '2024-01-22',
              horas: ['09:00', '10:00', '11:00', '14:00', '15:00']
            },
            {
              fecha: '2024-01-23',
              horas: ['08:00', '09:00', '16:00', '17:00']
            }
          ]
        },
        {
          id: '2',
          nombre: 'Dra. Ana Martínez',
          especialidad: 'Endocrinología',
          foto: '/avatars/dra-martinez.jpg',
          costo: 85,
          rating: 4.9,
          experiencia: '12 años de experiencia',
          horarios: [
            {
              fecha: '2024-01-22',
              horas: ['10:00', '11:00', '15:00', '16:00']
            },
            {
              fecha: '2024-01-24',
              horas: ['09:00', '14:00', '15:00']
            }
          ]
        },
        {
          id: '3',
          nombre: 'Dr. Carlos Rodríguez',
          especialidad: 'Cardiología',
          foto: '/avatars/dr-rodriguez.jpg',
          costo: 95,
          rating: 4.7,
          experiencia: '20 años de experiencia',
          horarios: [
            {
              fecha: '2024-01-23',
              horas: ['08:00', '09:00', '10:00', '14:00']
            },
            {
              fecha: '2024-01-25',
              horas: ['11:00', '15:00', '16:00', '17:00']
            }
          ]
        }
      ];

      // setPaciente(pacienteData); 
      setResultadosExamenes(resultadosData);
      setRecetas(recetasData);
      setCitas(citasData);
      setFacturas(facturasData);
      setMedicos(medicosData);

  }, []);

  const solicitarCita = () => {
    if (!nuevaCita.medicoId || !nuevaCita.fecha || !nuevaCita.hora || !nuevaCita.motivo) {
      alert('Por favor complete todos los campos');
      return;
    }

    const medico = medicos.find(m => m.id === nuevaCita.medicoId);
    if (!medico) return;

    const cita: CitaMedica = {
      id: Date.now().toString(),
      fecha: nuevaCita.fecha,
      hora: nuevaCita.hora,
      medico: medico.nombre,
      especialidad: medico.especialidad,
      motivo: nuevaCita.motivo,
      estado: 'Programada',
      modalidad: nuevaCita.modalidad,
      consultorio: nuevaCita.modalidad === 'Presencial' ? 'Por asignar' : undefined,
      enlaceVideo: nuevaCita.modalidad === 'Virtual' ? 'Se enviará por email' : undefined,
      costo: medico.costo
    };

    setCitas(prev => [cita, ...prev]);
    setShowNuevaCita(false);
    setNuevaCita({
      medicoId: '',
      fecha: '',
      hora: '',
      motivo: '',
      modalidad: 'Presencial'
    });

    alert('Cita solicitada exitosamente. Recibirá confirmación por email.');
  };

  const procesarPago = () => {
    if (!facturaSeleccionada || !datosPago.numeroTarjeta || !datosPago.nombreTitular) {
      alert('Por favor complete todos los campos de pago');
      return;
    }

    // Simular procesamiento de pago
    setTimeout(() => {
      setFacturas(prev => prev.map(f => 
        f.id === facturaSeleccionada.id ? {
          ...f,
          estado: 'Pagada' as const,
          metodoPago: `Tarjeta ${datosPago.tipoTarjeta} ****${datosPago.numeroTarjeta.slice(-4)}`,
          numeroTransaccion: `TXN-${Date.now()}`
        } : f
      ));

      setShowPago(false);
      setFacturaSeleccionada(null);
      setDatosPago({
        numeroTarjeta: '',
        nombreTitular: '',
        fechaExpiracion: '',
        cvv: '',
        tipoTarjeta: 'Visa'
      });

      alert('Pago procesado exitosamente. Recibirá el comprobante por email.');
    }, 2000);
  };

  const cancelarCita = (citaId: string) => {
    if (confirm('¿Está seguro de que desea cancelar esta cita?')) {
      setCitas(prev => prev.map(c => 
        c.id === citaId ? { ...c, estado: 'Cancelada' as const } : c
      ));
      alert('Cita cancelada exitosamente.');
    }
  };

  const descargarResultado = (resultado: ResultadoExamen) => {
    // Simular descarga de PDF
    const contenido = `
RESULTADO DE EXAMEN MÉDICO

Paciente: ${paciente?.nombre} ${paciente?.apellido}
Cédula: ${paciente?.cedula}
Fecha: ${resultado.fecha}
Examen: ${resultado.tipoExamen}
Laboratorio: ${resultado.laboratorio}
Médico: ${resultado.medico}

RESULTADOS:
${resultado.resultados.map(r => 
  `${r.nombre}: ${r.valor} ${r.unidad} (Normal: ${r.rangoNormal}) - ${r.estado}`
).join('\n')}

OBSERVACIONES:
${resultado.observaciones}

---
Documento generado automáticamente por el Portal de Pacientes
    `;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultado_${resultado.tipoExamen}_${resultado.fecha}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'Normal': case 'Completado': case 'Pagada': case 'Activa': case 'Confirmada':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Alto': case 'Bajo': case 'Pendiente': case 'Programada':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Crítico': case 'Vencida': case 'Cancelada':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Dispensada': case 'Completada':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPaciente />;
      case 'examenes':
        return <ResultadosExamenes />;
      case 'recetas':
        return <RecetasMedicas />;
      case 'citas':
        return <GestionCitas />;
      case 'pagos':
        return <GestionPagos />;
      case 'perfil':
        return <PerfilPaciente />;
      default:
        return <DashboardPaciente />;
    }
  };

  const DashboardPaciente = () => (
    <div className="space-y-6">
      {/* Bienvenida */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">¡Bienvenida, {paciente?.nombre}!</h2>
              <p className="text-blue-100">Gestiona tu salud de manera fácil y segura</p>
            </div>
            <Heart className="h-12 w-12 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Próxima Cita</p>
                <p className="text-lg font-bold">20 Enero</p>
                <p className="text-green-200 text-sm">Dr. Juan Pérez</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Recetas Activas</p>
                <p className="text-2xl font-bold">{recetas.filter(r => r.estado === 'Activa').length}</p>
                <p className="text-orange-200 text-sm">Medicamentos</p>
              </div>
              <Pill className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Exámenes</p>
                <p className="text-2xl font-bold">{resultadosExamenes.length}</p>
                <p className="text-purple-200 text-sm">Resultados</p>
              </div>
              <FileText className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Facturas</p>
                <p className="text-2xl font-bold">${facturas.filter(f => f.estado === 'Pendiente').reduce((sum, f) => sum + f.monto, 0)}</p>
                <p className="text-red-200 text-sm">Pendientes</p>
              </div>
              <CreditCard className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas importantes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resultadosExamenes.filter(r => r.estado === 'Crítico').map(resultado => (
                <div key={resultado.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-red-900">{resultado.tipoExamen}</p>
                      <p className="text-sm text-red-700">{resultado.observaciones}</p>
                      <p className="text-xs text-red-600">Fecha: {resultado.fecha}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('examenes')}>
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {facturas.filter(f => f.estado === 'Pendiente').slice(0, 2).map(factura => (
                <div key={factura.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-yellow-900">Factura Pendiente</p>
                      <p className="text-sm text-yellow-700">{factura.concepto} - ${factura.monto}</p>
                      <p className="text-xs text-yellow-600">Vence: {factura.fechaVencimiento}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('pagos')}>
                      Pagar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Próximas Actividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {citas.filter(c => c.estado === 'Programada' || c.estado === 'Confirmada').slice(0, 3).map(cita => (
                <div key={cita.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-blue-900">{cita.medico}</p>
                      <p className="text-sm text-blue-700">{cita.especialidad}</p>
                      <p className="text-xs text-blue-600">{cita.fecha} a las {cita.hora}</p>
                      <Badge className={`mt-1 ${obtenerColorEstado(cita.estado)}`}>
                        {cita.estado}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {cita.modalidad === 'Virtual' && (
                        <Button size="sm" variant="outline">
                          <Video className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('citas')}>
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => setShowNuevaCita(true)}>
              <Calendar className="w-6 h-6 mb-2" />
              Solicitar Cita
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('examenes')}>
              <FileText className="w-6 h-6 mb-2" />
              Ver Exámenes
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('recetas')}>
              <Pill className="w-6 h-6 mb-2" />
              Mis Recetas
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('pagos')}>
              <CreditCard className="w-6 h-6 mb-2" />
              Pagar Facturas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ResultadosExamenes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resultados de Exámenes</h2>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Subir Documento
        </Button>
      </div>

      <div className="space-y-4">
        {resultadosExamenes.map(resultado => (
          <Card key={resultado.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{resultado.tipoExamen}</h3>
                  <p className="text-gray-600">{resultado.laboratorio} - {resultado.medico}</p>
                  <p className="text-sm text-gray-500">Fecha: {resultado.fecha}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={obtenerColorEstado(resultado.estado)}>
                    {resultado.estado}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => descargarResultado(resultado)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {resultado.resultados.map((param, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium">{param.nombre}</span>
                      <Badge variant="outline" className={obtenerColorEstado(param.estado)}>
                        {param.estado}
                      </Badge>
                    </div>
                    <div className="text-lg font-bold">{param.valor} {param.unidad}</div>
                    <div className="text-xs text-gray-500">Normal: {param.rangoNormal}</div>
                  </div>
                ))}
              </div>

              {resultado.observaciones && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm"><strong>Observaciones:</strong> {resultado.observaciones}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const RecetasMedicas = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recetas Médicas</h2>

      <div className="space-y-4">
        {recetas.map(receta => (
          <Card key={receta.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{receta.medico}</h3>
                  <p className="text-gray-600">{receta.especialidad}</p>
                  <p className="text-sm text-gray-500">Fecha: {receta.fecha} | Válida hasta: {receta.validaHasta}</p>
                </div>
                <Badge className={obtenerColorEstado(receta.estado)}>
                  {receta.estado}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                {receta.medicamentos.map((medicamento, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{medicamento.nombre}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mt-1">
                          <div><strong>Dosis:</strong> {medicamento.dosis}</div>
                          <div><strong>Frecuencia:</strong> {medicamento.frecuencia}</div>
                          <div><strong>Duración:</strong> {medicamento.duracion}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Vía:</strong> {medicamento.viaAdministracion}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Indicaciones:</strong> {medicamento.indicaciones}
                        </div>
                      </div>
                      <div className="ml-4">
                        {medicamento.dispensado ? (
                          <Badge variant="default">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Dispensado
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {receta.observaciones && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm"><strong>Observaciones:</strong> {receta.observaciones}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const GestionCitas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Citas</h2>
        <Button onClick={() => setShowNuevaCita(true)} className="bg-blue-600 hover:bg-blue-700">
          <Calendar className="w-4 h-4 mr-2" />
          Solicitar Cita
        </Button>
      </div>

      <div className="space-y-4">
        {citas.map(cita => (
          <Card key={cita.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{cita.medico}</h3>
                    <Badge className={obtenerColorEstado(cita.estado)}>
                      {cita.estado}
                    </Badge>
                    <Badge variant="outline">
                      {cita.modalidad === 'Virtual' ? '🎥' : '🏥'} {cita.modalidad}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div><strong>Especialidad:</strong> {cita.especialidad}</div>
                    <div><strong>Fecha:</strong> {cita.fecha}</div>
                    <div><strong>Hora:</strong> {cita.hora}</div>
                    <div><strong>Costo:</strong> ${cita.costo}</div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Motivo:</strong> {cita.motivo}
                  </div>
                  
                  {cita.consultorio && (
                    <div className="text-sm text-gray-600">
                      <strong>Consultorio:</strong> {cita.consultorio}
                    </div>
                  )}
                  
                  {cita.enlaceVideo && (
                    <div className="text-sm text-gray-600">
                      <strong>Enlace:</strong> {cita.enlaceVideo}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {cita.modalidad === 'Virtual' && cita.estado === 'Confirmada' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Video className="w-4 h-4 mr-1" />
                      Unirse
                    </Button>
                  )}
                  
                  {(cita.estado === 'Programada' || cita.estado === 'Confirmada') && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => cancelarCita(cita.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancelar
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const GestionPagos = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Pagos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Pendientes</p>
                <p className="text-2xl font-bold">
                  ${facturas.filter(f => f.estado === 'Pendiente').reduce((sum, f) => sum + f.monto, 0)}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Pagadas</p>
                <p className="text-2xl font-bold">
                  ${facturas.filter(f => f.estado === 'Pagada').reduce((sum, f) => sum + f.monto, 0)}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Facturas</p>
                <p className="text-2xl font-bold">{facturas.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {facturas.map(factura => (
          <Card key={factura.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{factura.concepto}</h3>
                    <Badge className={obtenerColorEstado(factura.estado)}>
                      {factura.estado}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div><strong>Fecha:</strong> {factura.fecha}</div>
                    <div><strong>Monto:</strong> ${factura.monto}</div>
                    <div><strong>Vence:</strong> {factura.fechaVencimiento}</div>
                  </div>
                  
                  {factura.metodoPago && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Método de pago:</strong> {factura.metodoPago}
                    </div>
                  )}
                  
                  {factura.numeroTransaccion && (
                    <div className="text-sm text-gray-600">
                      <strong>Transacción:</strong> {factura.numeroTransaccion}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {factura.estado === 'Pendiente' && (
                    <Button 
                      size="sm" 
                      onClick={() => {setFacturaSeleccionada(factura); setShowPago(true);}}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Pagar
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const PerfilPaciente = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mi Perfil</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre</Label>
                <Input value={paciente?.nombre || ''} readOnly />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input value={paciente?.apellido || ''} readOnly />
              </div>
            </div>
            
            <div>
              <Label>Cédula</Label>
              <Input value={paciente?.cedula || ''} readOnly />
            </div>
            
            <div>
              <Label>Email</Label>
              <Input value={paciente?.email || ''} />
            </div>
            
            <div>
              <Label>Teléfono</Label>
              <Input value={paciente?.telefono || ''} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha de Nacimiento</Label>
                <Input type="date" value={paciente?.fechaNacimiento || ''} readOnly />
              </div>
              <div>
                <Label>Género</Label>
                <Input value={paciente?.genero || ''} readOnly />
              </div>
            </div>
            
            <Button className="w-full">
              Actualizar Información
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Seguro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Seguro Médico</Label>
              <Input value={paciente?.seguroMedico || ''} readOnly />
            </div>
            
            <div>
              <Label>Número de Póliza</Label>
              <Input value={paciente?.numeroPoliza || ''} readOnly />
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Estado del Seguro</h4>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Activo y al día</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Recordatorios de Citas</h4>
              <p className="text-sm text-gray-600">Recibir recordatorios por email y SMS</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Resultados de Exámenes</h4>
              <p className="text-sm text-gray-600">Notificar cuando lleguen nuevos resultados</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Recordatorios de Medicamentos</h4>
              <p className="text-sm text-gray-600">Recordatorios para tomar medicamentos</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Promociones y Ofertas</h4>
              <p className="text-sm text-gray-600">Recibir información sobre descuentos</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando portal del paciente..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portal del Paciente</h1>
                <p className="text-sm text-gray-500">Tu salud en tus manos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Médico
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {paciente?.nombre?.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {paciente?.nombre} {paciente?.apellido}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 py-4 px-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <Activity className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="examenes"
                className="flex items-center gap-2 py-4 px-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <FileText className="h-4 w-4" />
                Exámenes
              </TabsTrigger>
              <TabsTrigger 
                value="recetas"
                className="flex items-center gap-2 py-4 px-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <Pill className="h-4 w-4" />
                Recetas
              </TabsTrigger>
              <TabsTrigger 
                value="citas"
                className="flex items-center gap-2 py-4 px-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <Calendar className="h-4 w-4" />
                Citas
              </TabsTrigger>
              <TabsTrigger 
                value="pagos"
                className="flex items-center gap-2 py-4 px-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <CreditCard className="h-4 w-4" />
                Pagos
              </TabsTrigger>
              <TabsTrigger 
                value="perfil"
                className="flex items-center gap-2 py-4 px-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <User className="h-4 w-4" />
                Perfil
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      {/* Modal Nueva Cita */}
      <Dialog open={showNuevaCita} onOpenChange={setShowNuevaCita}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar Nueva Cita</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="medico">Seleccionar Médico</Label>
              <Select 
                value={nuevaCita.medicoId} 
                onValueChange={(value) => {
                  setNuevaCita({...nuevaCita, medicoId: value});
                  setMedicoSeleccionado(medicos.find(m => m.id === value) || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map(medico => (
                    <SelectItem key={medico.id} value={medico.id}>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{medico.nombre}</div>
                          <div className="text-sm text-gray-500">{medico.especialidad} - ${medico.costo}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {medicoSeleccionado && (
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {medicoSeleccionado.nombre.split(' ')[1]?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{medicoSeleccionado.nombre}</h4>
                      <p className="text-sm text-gray-600">{medicoSeleccionado.especialidad}</p>
                      <p className="text-sm text-gray-600">{medicoSeleccionado.experiencia}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">{medicoSeleccionado.rating}</span>
                        <span className="text-sm text-gray-500">• ${medicoSeleccionado.costo}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Select value={nuevaCita.fecha} onValueChange={(value) => setNuevaCita({...nuevaCita, fecha: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicoSeleccionado?.horarios.map(horario => (
                      <SelectItem key={horario.fecha} value={horario.fecha}>
                        {horario.fecha}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Select value={nuevaCita.hora} onValueChange={(value) => setNuevaCita({...nuevaCita, hora: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicoSeleccionado?.horarios
                      .find(h => h.fecha === nuevaCita.fecha)?.horas
                      .map(hora => (
                        <SelectItem key={hora} value={hora}>
                          {hora}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="modalidad">Modalidad</Label>
              <Select 
                value={nuevaCita.modalidad} 
                onValueChange={(value: 'Presencial' | 'Virtual') => 
                  setNuevaCita({...nuevaCita, modalidad: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">🏥 Presencial</SelectItem>
                  <SelectItem value="Virtual">🎥 Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="motivo">Motivo de la Consulta</Label>
              <Textarea
                id="motivo"
                value={nuevaCita.motivo}
                onChange={(e) => setNuevaCita({...nuevaCita, motivo: e.target.value})}
                placeholder="Describa el motivo de su consulta..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowNuevaCita(false)}>
              Cancelar
            </Button>
            <Button onClick={solicitarCita}>
              Solicitar Cita
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Pago */}
      <Dialog open={showPago} onOpenChange={setShowPago}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Procesar Pago</DialogTitle>
          </DialogHeader>
          
          {facturaSeleccionada && (
            <div className="space-y-4">
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium">{facturaSeleccionada.concepto}</h4>
                  <p className="text-2xl font-bold text-green-600">${facturaSeleccionada.monto}</p>
                  <p className="text-sm text-gray-600">Vence: {facturaSeleccionada.fechaVencimiento}</p>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="tipo-tarjeta">Tipo de Tarjeta</Label>
                <Select 
                  value={datosPago.tipoTarjeta} 
                  onValueChange={(value: 'Visa' | 'Mastercard' | 'American Express') => 
                    setDatosPago({...datosPago, tipoTarjeta: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visa">💳 Visa</SelectItem>
                    <SelectItem value="Mastercard">💳 Mastercard</SelectItem>
                    <SelectItem value="American Express">💳 American Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="numero-tarjeta">Número de Tarjeta</Label>
                <Input
                  id="numero-tarjeta"
                  value={datosPago.numeroTarjeta}
                  onChange={(e) => setDatosPago({...datosPago, numeroTarjeta: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div>
                <Label htmlFor="nombre-titular">Nombre del Titular</Label>
                <Input
                  id="nombre-titular"
                  value={datosPago.nombreTitular}
                  onChange={(e) => setDatosPago({...datosPago, nombreTitular: e.target.value})}
                  placeholder="Como aparece en la tarjeta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha-expiracion">Fecha de Expiración</Label>
                  <Input
                    id="fecha-expiracion"
                    value={datosPago.fechaExpiracion}
                    onChange={(e) => setDatosPago({...datosPago, fechaExpiracion: e.target.value})}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={datosPago.cvv}
                    onChange={(e) => setDatosPago({...datosPago, cvv: e.target.value})}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowPago(false)}>
              Cancelar
            </Button>
            <Button onClick={procesarPago} className="bg-green-600 hover:bg-green-700">
              <CreditCard className="w-4 h-4 mr-2" />
              Pagar ${facturaSeleccionada?.monto}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortalPacientes;