import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Download, Eye, Calendar, User, Stethoscope, Pill, TestTube, Upload, Filter, Clipboard, FlaskConical, UserCheck, Camera, Send, Printer, Save } from 'lucide-react';
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
import { mockHistorialMedico, mockPacientes, mockMedicos } from '@/data/mockData';
import { HistorialMedico, Paciente, Medico, MedicamentoReceta, Examen, ArchivoMedico } from '@/types/medical';

interface HistorialMedicoProps {
  pacienteSeleccionado?: Paciente | null;
  medicoLogueado?: Medico | null;
}

interface InterconsultaRegistro {
  id: string;
  fecha: string;
  medicoOrigen: string;
  medicoDestino: string;
  especialidad: string;
  motivo: string;
  urgencia: 'Urgente' | 'Normal' | 'Programada';
  notas: string;
  estado: 'Enviada' | 'Recibida' | 'Respondida';
  respuesta?: string;
  fechaRespuesta?: string;
}

// Exámenes de laboratorio predefinidos
const examenesLaboratorio = [
  {
    categoria: 'Hematología',
    examenes: [
      { nombre: 'Hemograma completo', descripcion: 'Conteo completo de células sanguíneas' },
      { nombre: 'Velocidad de sedimentación (VSG)', descripcion: 'Marcador de inflamación' },
      { nombre: 'Tiempo de protrombina (TP)', descripcion: 'Evaluación de coagulación' },
      { nombre: 'Tiempo parcial de tromboplastina (TPT)', descripcion: 'Evaluación de coagulación' },
      { nombre: 'Plaquetas', descripcion: 'Conteo de plaquetas' }
    ]
  },
  {
    categoria: 'Química Sanguínea',
    examenes: [
      { nombre: 'Glucosa en ayunas', descripcion: 'Nivel de azúcar en sangre' },
      { nombre: 'Hemoglobina glicosilada (HbA1c)', descripcion: 'Control diabético' },
      { nombre: 'Creatinina', descripcion: 'Función renal' },
      { nombre: 'Urea', descripcion: 'Función renal' },
      { nombre: 'Ácido úrico', descripcion: 'Metabolismo de purinas' },
      { nombre: 'Transaminasas (ALT/AST)', descripcion: 'Función hepática' },
      { nombre: 'Bilirrubina total y directa', descripcion: 'Función hepática' }
    ]
  },
  {
    categoria: 'Perfil Lipídico',
    examenes: [
      { nombre: 'Colesterol total', descripcion: 'Nivel de colesterol' },
      { nombre: 'Colesterol HDL', descripcion: 'Colesterol bueno' },
      { nombre: 'Colesterol LDL', descripcion: 'Colesterol malo' },
      { nombre: 'Triglicéridos', descripcion: 'Grasas en sangre' }
    ]
  },
  {
    categoria: 'Electrolitos',
    examenes: [
      { nombre: 'Sodio (Na+)', descripcion: 'Balance electrolítico' },
      { nombre: 'Potasio (K+)', descripcion: 'Balance electrolítico' },
      { nombre: 'Cloro (Cl-)', descripcion: 'Balance electrolítico' },
      { nombre: 'Magnesio (Mg++)', descripcion: 'Balance electrolítico' }
    ]
  },
  {
    categoria: 'Hormonas',
    examenes: [
      { nombre: 'TSH', descripcion: 'Función tiroidea' },
      { nombre: 'T3 libre', descripcion: 'Hormona tiroidea' },
      { nombre: 'T4 libre', descripcion: 'Hormona tiroidea' },
      { nombre: 'Cortisol', descripcion: 'Hormona del estrés' },
      { nombre: 'Insulina', descripcion: 'Hormona reguladora de glucosa' }
    ]
  },
  {
    categoria: 'Marcadores Cardíacos',
    examenes: [
      { nombre: 'Troponina I', descripcion: 'Daño cardíaco' },
      { nombre: 'CK-MB', descripcion: 'Enzima cardíaca' },
      { nombre: 'BNP', descripcion: 'Péptido natriurético' }
    ]
  },
  {
    categoria: 'Orina',
    examenes: [
      { nombre: 'Examen general de orina', descripcion: 'Análisis completo de orina' },
      { nombre: 'Urocultivo', descripcion: 'Cultivo bacteriano de orina' },
      { nombre: 'Proteínas en orina 24h', descripcion: 'Función renal' }
    ]
  },
  {
    categoria: 'Heces',
    examenes: [
      { nombre: 'Coprocultivo', descripcion: 'Cultivo bacteriano de heces' },
      { nombre: 'Parásitos en heces', descripcion: 'Detección de parásitos' },
      { nombre: 'Sangre oculta en heces', descripcion: 'Detección de sangrado digestivo' }
    ]
  }
];

// Estudios de imágenes predefinidos
const estudiosImagenes = [
  {
    categoria: 'Radiología Simple',
    estudios: [
      { nombre: 'Radiografía de tórax', descripcion: 'Evaluación de pulmones y corazón' },
      { nombre: 'Radiografía de abdomen', descripcion: 'Evaluación abdominal simple' },
      { nombre: 'Radiografía de columna lumbar', descripcion: 'Evaluación de columna vertebral' },
      { nombre: 'Radiografía de columna cervical', descripcion: 'Evaluación de cuello' },
      { nombre: 'Radiografía de pelvis', descripcion: 'Evaluación de huesos pélvicos' },
      { nombre: 'Radiografía de extremidades', descripcion: 'Evaluación de brazos o piernas' }
    ]
  },
  {
    categoria: 'Tomografía Computarizada (TC)',
    estudios: [
      { nombre: 'TC de cráneo sin contraste', descripcion: 'Evaluación cerebral' },
      { nombre: 'TC de cráneo con contraste', descripcion: 'Evaluación cerebral detallada' },
      { nombre: 'TC de tórax', descripcion: 'Evaluación pulmonar detallada' },
      { nombre: 'TC de abdomen y pelvis', descripcion: 'Evaluación abdominal completa' },
      { nombre: 'TC de columna', descripcion: 'Evaluación vertebral detallada' },
      { nombre: 'Angio-TC', descripcion: 'Evaluación de vasos sanguíneos' }
    ]
  },
  {
    categoria: 'Resonancia Magnética (RM)',
    estudios: [
      { nombre: 'RM de cráneo', descripcion: 'Evaluación cerebral de alta resolución' },
      { nombre: 'RM de columna cervical', descripcion: 'Evaluación detallada del cuello' },
      { nombre: 'RM de columna lumbar', descripcion: 'Evaluación detallada de espalda baja' },
      { nombre: 'RM de rodilla', descripcion: 'Evaluación de articulación de rodilla' },
      { nombre: 'RM de hombro', descripcion: 'Evaluación de articulación del hombro' },
      { nombre: 'RM abdominal', descripcion: 'Evaluación de órganos abdominales' }
    ]
  },
  {
    categoria: 'Ultrasonido',
    estudios: [
      { nombre: 'Ecografía abdominal', descripcion: 'Evaluación de órganos abdominales' },
      { nombre: 'Ecografía pélvica', descripcion: 'Evaluación de órganos pélvicos' },
      { nombre: 'Ecografía tiroidea', descripcion: 'Evaluación de glándula tiroides' },
      { nombre: 'Ecografía cardíaca (Ecocardiograma)', descripcion: 'Evaluación del corazón' },
      { nombre: 'Ecografía renal', descripcion: 'Evaluación de riñones' },
      { nombre: 'Ecografía obstétrica', descripcion: 'Evaluación durante embarazo' }
    ]
  },
  {
    categoria: 'Estudios Especializados',
    estudios: [
      { nombre: 'Mamografía', descripcion: 'Evaluación de mamas' },
      { nombre: 'Densitometría ósea', descripcion: 'Evaluación de densidad ósea' },
      { nombre: 'Arteriografía', descripcion: 'Evaluación de arterias' },
      { nombre: 'Venografía', descripcion: 'Evaluación de venas' },
      { nombre: 'Histerosalpingografía', descripcion: 'Evaluación de útero y trompas' },
      { nombre: 'Urografía', descripcion: 'Evaluación del sistema urinario' }
    ]
  }
];

// Especialidades médicas predefinidas
const especialidadesMedicas = [
  'Cardiología',
  'Dermatología',
  'Endocrinología',
  'Gastroenterología',
  'Ginecología',
  'Hematología',
  'Medicina Interna',
  'Nefrología',
  'Neumología',
  'Neurología',
  'Oftalmología',
  'Oncología',
  'Ortopedia',
  'Otorrinolaringología',
  'Pediatría',
  'Psiquiatría',
  'Radiología',
  'Reumatología',
  'Urología'
];

const HistorialMedicoComponent: React.FC<HistorialMedicoProps> = ({ 
  pacienteSeleccionado, 
  medicoLogueado 
}) => {
  const [historiales, setHistoriales] = useState<HistorialMedico[]>([]);
  const [pacientes] = useState<Paciente[]>(mockPacientes);
  const [medicos] = useState<Medico[]>(mockMedicos);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPaciente, setFiltroPaciente] = useState('');
  const [filtroMedico, setFiltroMedico] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [showNuevoHistorial, setShowNuevoHistorial] = useState(false);
  const [historialSeleccionado, setHistorialSeleccionado] = useState<HistorialMedico | null>(null);

  // Estados para exámenes de laboratorio
  const [showExamenesLab, setShowExamenesLab] = useState(false);
  const [examenesSeleccionados, setExamenesSeleccionados] = useState<string[]>([]);
  const [busquedaExamen, setBusquedaExamen] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('all');

  // Estados para estudios de imágenes
  const [showEstudiosImg, setShowEstudiosImg] = useState(false);
  const [estudiosSeleccionados, setEstudiosSeleccionados] = useState<string[]>([]);
  const [busquedaEstudio, setBusquedaEstudio] = useState('');
  const [categoriaEstudioFiltro, setCategoriaEstudioFiltro] = useState('all');

  // Estados para interconsulta
  const [showInterconsulta, setShowInterconsulta] = useState(false);
  const [interconsulta, setInterconsulta] = useState({
    medicoDestino: '',
    medicoDestinoManual: '',
    especialidad: '',
    especialidadManual: '',
    motivo: '',
    urgencia: 'Normal' as 'Urgente' | 'Normal' | 'Programada',
    notas: '',
    usarMedicoManual: false,
    usarEspecialidadManual: false
  });

  // Estados para interconsultas registradas
  const [interconsultasRegistradas, setInterconsultasRegistradas] = useState<InterconsultaRegistro[]>([]);
  const [showInterconsultasHistorial, setShowInterconsultasHistorial] = useState(false);

  // Médico por defecto si no se pasa uno
  const medicoActual = medicoLogueado || medicos[0];

  // Nuevo historial form - Preseleccionar paciente y médico si están disponibles
  const [nuevoHistorial, setNuevoHistorial] = useState({
    pacienteId: pacienteSeleccionado?.id || '',
    medicoId: medicoActual?.id || '',
    motivo: '',
    sintomas: '',
    diagnostico: '',
    tratamiento: '',
    medicamentos: [] as MedicamentoReceta[],
    examenes: [] as Examen[],
    proximaConsulta: '',
    notas: '',
    archivosAdjuntos: [] as ArchivoMedico[]
  });

  const [nuevoMedicamento, setNuevoMedicamento] = useState<MedicamentoReceta>({
    nombre: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    indicaciones: '',
    cantidad: 1
  });

  const [nuevoExamen, setNuevoExamen] = useState<Examen>({
    id: '',
    nombre: '',
    tipo: 'Laboratorio' as const,
    fecha: '',
    resultado: '',
    valorReferencia: '',
    estado: 'Pendiente' as const
  });

  // Actualizar el formulario cuando cambie el paciente o médico seleccionado
  useEffect(() => {
    setNuevoHistorial(prev => ({
      ...prev,
      pacienteId: pacienteSeleccionado?.id || prev.pacienteId,
      medicoId: medicoActual?.id || prev.medicoId
    }));
  }, [pacienteSeleccionado, medicoActual]);

  useEffect(() => {
    // Simular carga de datos con historiales más completos
    setTimeout(() => {
      const historialesCompletos: HistorialMedico[] = [
        {
          id: '1',
          pacienteId: '1',
          medicoId: '1',
          fecha: '2024-01-10',
          motivo: 'Control cardiológico rutinario',
          sintomas: 'Palpitaciones ocasionales, especialmente durante ejercicio moderado. Fatiga leve al subir escaleras.',
          diagnostico: 'Arritmia sinusal leve. Posible hipertensión arterial grado I.',
          tratamiento: 'Medicación antiarrítmica. Modificaciones en el estilo de vida: dieta baja en sodio, ejercicio regular moderado.',
          medicamentos: [
            {
              nombre: 'Atenolol',
              dosis: '50mg',
              frecuencia: '1 vez al día',
              duracion: '30 días',
              indicaciones: 'Tomar en ayunas, preferiblemente en la mañana',
              cantidad: 30
            },
            {
              nombre: 'Losartán',
              dosis: '50mg',
              frecuencia: '1 vez al día',
              duracion: '30 días',
              indicaciones: 'Tomar por la noche',
              cantidad: 30
            }
          ],
          examenes: [
            {
              id: '1',
              nombre: 'Electrocardiograma',
              tipo: 'Funcional',
              fecha: '2024-01-10',
              resultado: 'Ritmo sinusal con extrasístoles ventriculares ocasionales',
              valorReferencia: 'Normal: 60-100 lpm',
              estado: 'Completado'
            },
            {
              id: '2',
              nombre: 'Perfil lipídico',
              tipo: 'Laboratorio',
              fecha: '2024-01-15',
              resultado: 'Pendiente',
              valorReferencia: 'Colesterol total < 200 mg/dL',
              estado: 'Pendiente'
            }
          ],
          proximaConsulta: '2024-02-10',
          notas: 'Paciente colaborador. Se recomienda seguimiento estrecho de la presión arterial. Educar sobre signos de alarma cardiovascular.',
          archivosAdjuntos: [
            {
              id: '1',
              nombre: 'ECG_2024-01-10.pdf',
              tipo: 'application/pdf',
              tamaño: 245760,
              fecha: '2024-01-10',
              url: '/files/ecg_001.pdf'
            }
          ]
        },
        {
          id: '2',
          pacienteId: '2',
          medicoId: '2',
          fecha: '2024-01-08',
          motivo: 'Consulta por fiebre y malestar general',
          sintomas: 'Fiebre de 38.5°C, dolor de garganta, congestión nasal, cefalea leve, malestar general desde hace 3 días.',
          diagnostico: 'Rinofaringitis viral aguda (resfriado común)',
          tratamiento: 'Tratamiento sintomático. Reposo relativo, hidratación abundante, analgésicos según necesidad.',
          medicamentos: [
            {
              nombre: 'Paracetamol',
              dosis: '500mg',
              frecuencia: 'Cada 6 horas',
              duracion: '5 días',
              indicaciones: 'Solo si hay fiebre o dolor',
              cantidad: 20
            },
            {
              nombre: 'Loratadina',
              dosis: '10mg',
              frecuencia: '1 vez al día',
              duracion: '7 días',
              indicaciones: 'Tomar por la noche',
              cantidad: 7
            }
          ],
          examenes: [],
          notas: 'Evolución favorable esperada en 5-7 días. Regresar si persiste fiebre por más de 5 días o aparecen signos de alarma.',
          archivosAdjuntos: []
        }
      ];
      setHistoriales(historialesCompletos);
      setLoading(false);
    }, 1000);
  }, []);

  const obtenerPaciente = (id: string) => pacientes.find(p => p.id === id);
  const obtenerMedico = (id: string) => medicos.find(m => m.id === id);

  const historialesFiltrados = historiales.filter(historial => {
    const paciente = obtenerPaciente(historial.pacienteId);
    const medico = obtenerMedico(historial.medicoId);
    
    // Si hay un paciente seleccionado, filtrar solo sus historiales
    const matchPacienteSeleccionado = !pacienteSeleccionado || historial.pacienteId === pacienteSeleccionado.id;
    
    const matchBusqueda = !busqueda || 
      paciente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente?.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      historial.diagnostico.toLowerCase().includes(busqueda.toLowerCase()) ||
      historial.motivo.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchPaciente = !filtroPaciente || filtroPaciente === 'todos' || historial.pacienteId === filtroPaciente;
    const matchMedico = !filtroMedico || filtroMedico === 'todos' || historial.medicoId === filtroMedico;
    const matchFecha = !filtroFecha || historial.fecha === filtroFecha;

    return matchPacienteSeleccionado && matchBusqueda && matchPaciente && matchMedico && matchFecha;
  });

  // Filtrar exámenes de laboratorio
  const examenesFiltrados = examenesLaboratorio.filter(categoria => {
    if (categoriaFiltro && categoriaFiltro !== 'all' && categoria.categoria !== categoriaFiltro) return false;
    
    if (busquedaExamen) {
      return categoria.examenes.some(examen => 
        examen.nombre.toLowerCase().includes(busquedaExamen.toLowerCase()) ||
        examen.descripcion.toLowerCase().includes(busquedaExamen.toLowerCase())
      );
    }
    
    return true;
  }).map(categoria => ({
    ...categoria,
    examenes: categoria.examenes.filter(examen => 
      !busquedaExamen || 
      examen.nombre.toLowerCase().includes(busquedaExamen.toLowerCase()) ||
      examen.descripcion.toLowerCase().includes(busquedaExamen.toLowerCase())
    )
  }));

  // Filtrar estudios de imágenes
  const estudiosImagenesFiltrados = estudiosImagenes.filter(categoria => {
    if (categoriaEstudioFiltro && categoriaEstudioFiltro !== 'all' && categoria.categoria !== categoriaEstudioFiltro) return false;
    
    if (busquedaEstudio) {
      return categoria.estudios.some(estudio => 
        estudio.nombre.toLowerCase().includes(busquedaEstudio.toLowerCase()) ||
        estudio.descripcion.toLowerCase().includes(busquedaEstudio.toLowerCase())
      );
    }
    
    return true;
  }).map(categoria => ({
    ...categoria,
    estudios: categoria.estudios.filter(estudio => 
      !busquedaEstudio || 
      estudio.nombre.toLowerCase().includes(busquedaEstudio.toLowerCase()) ||
      estudio.descripcion.toLowerCase().includes(busquedaEstudio.toLowerCase())
    )
  }));

  const agregarMedicamento = () => {
    if (nuevoMedicamento.nombre && nuevoMedicamento.dosis) {
      setNuevoHistorial({
        ...nuevoHistorial,
        medicamentos: [...nuevoHistorial.medicamentos, nuevoMedicamento]
      });
      setNuevoMedicamento({
        nombre: '',
        dosis: '',
        frecuencia: '',
        duracion: '',
        indicaciones: '',
        cantidad: 1
      });
    }
  };

  const agregarExamen = () => {
    if (nuevoExamen.nombre) {
      const examenConId = {
        ...nuevoExamen,
        id: Date.now().toString()
      };
      setNuevoHistorial({
        ...nuevoHistorial,
        examenes: [...nuevoHistorial.examenes, examenConId]
      });
      setNuevoExamen({
        id: '',
        nombre: '',
        tipo: 'Laboratorio',
        fecha: '',
        resultado: '',
        valorReferencia: '',
        estado: 'Pendiente'
      });
    }
  };

  const agregarExamenesSeleccionados = () => {
    const nuevosExamenes = examenesSeleccionados.map(nombreExamen => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      nombre: nombreExamen,
      tipo: 'Laboratorio' as const,
      fecha: new Date().toISOString().split('T')[0],
      resultado: '',
      valorReferencia: '',
      estado: 'Pendiente' as const
    }));

    setNuevoHistorial({
      ...nuevoHistorial,
      examenes: [...nuevoHistorial.examenes, ...nuevosExamenes]
    });

    setExamenesSeleccionados([]);
    setShowExamenesLab(false);
  };

  const agregarEstudiosSeleccionados = () => {
    const nuevosEstudios = estudiosSeleccionados.map(nombreEstudio => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      nombre: nombreEstudio,
      tipo: 'Imagen' as const,
      fecha: new Date().toISOString().split('T')[0],
      resultado: '',
      valorReferencia: '',
      estado: 'Pendiente' as const
    }));

    setNuevoHistorial({
      ...nuevoHistorial,
      examenes: [...nuevoHistorial.examenes, ...nuevosEstudios]
    });

    setEstudiosSeleccionados([]);
    setShowEstudiosImg(false);
  };

  const toggleExamenSeleccionado = (nombreExamen: string) => {
    setExamenesSeleccionados(prev => 
      prev.includes(nombreExamen)
        ? prev.filter(e => e !== nombreExamen)
        : [...prev, nombreExamen]
    );
  };

  const toggleEstudioSeleccionado = (nombreEstudio: string) => {
    setEstudiosSeleccionados(prev => 
      prev.includes(nombreEstudio)
        ? prev.filter(e => e !== nombreEstudio)
        : [...prev, nombreEstudio]
    );
  };

  const guardarInterconsultaEnHistorial = () => {
    const paciente = obtenerPaciente(nuevoHistorial.pacienteId);
    
    // Determinar médico destino y especialidad
    const nombreMedicoDestino = interconsulta.usarMedicoManual 
      ? interconsulta.medicoDestinoManual 
      : (() => {
          const medico = obtenerMedico(interconsulta.medicoDestino);
          return medico ? `Dr. ${medico.nombre} ${medico.apellido}` : '';
        })();
    
    const especialidadFinal = interconsulta.usarEspecialidadManual 
      ? interconsulta.especialidadManual 
      : interconsulta.especialidad;

    // Crear registro de interconsulta
    const nuevaInterconsulta: InterconsultaRegistro = {
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0],
      medicoOrigen: `Dr. ${medicoActual?.nombre} ${medicoActual?.apellido}`,
      medicoDestino: nombreMedicoDestino,
      especialidad: especialidadFinal,
      motivo: interconsulta.motivo,
      urgencia: interconsulta.urgencia,
      notas: interconsulta.notas,
      estado: 'Enviada'
    };

    // Agregar a la lista de interconsultas
    setInterconsultasRegistradas(prev => [...prev, nuevaInterconsulta]);

    // Agregar como nota en el historial actual
    const notaInterconsulta = `INTERCONSULTA ENVIADA - ${new Date().toLocaleDateString('es-ES')}
Especialidad: ${especialidadFinal}
Médico destino: ${nombreMedicoDestino}
Motivo: ${interconsulta.motivo}
Urgencia: ${interconsulta.urgencia}
${interconsulta.notas ? `Notas: ${interconsulta.notas}` : ''}`;

    setNuevoHistorial(prev => ({
      ...prev,
      notas: prev.notas ? `${prev.notas}\n\n${notaInterconsulta}` : notaInterconsulta
    }));

    return nuevaInterconsulta;
  };

  const imprimirInterconsulta = (interconsultaData?: InterconsultaRegistro) => {
    const paciente = obtenerPaciente(nuevoHistorial.pacienteId);
    
    let datosImprimir;
    
    if (interconsultaData) {
      // Imprimir interconsulta existente
      datosImprimir = interconsultaData;
    } else {
      // Imprimir interconsulta actual
      const nombreMedicoDestino = interconsulta.usarMedicoManual 
        ? interconsulta.medicoDestinoManual 
        : (() => {
            const medico = obtenerMedico(interconsulta.medicoDestino);
            return medico ? `Dr. ${medico.nombre} ${medico.apellido}` : '';
          })();
      
      const especialidadFinal = interconsulta.usarEspecialidadManual 
        ? interconsulta.especialidadManual 
        : interconsulta.especialidad;

      datosImprimir = {
        fecha: new Date().toISOString().split('T')[0],
        medicoOrigen: `Dr. ${medicoActual?.nombre} ${medicoActual?.apellido}`,
        medicoDestino: nombreMedicoDestino,
        especialidad: especialidadFinal,
        motivo: interconsulta.motivo,
        urgencia: interconsulta.urgencia,
        notas: interconsulta.notas
      };
    }

    // Crear contenido HTML para imprimir
    const contenidoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orden de Interconsulta</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .titulo { font-size: 24px; font-weight: bold; color: #333; }
          .subtitulo { font-size: 16px; color: #666; }
          .seccion { margin: 15px 0; }
          .label { font-weight: bold; color: #333; }
          .valor { margin-left: 10px; }
          .urgencia { padding: 5px 10px; border-radius: 5px; font-weight: bold; }
          .urgente { background-color: #fee; color: #c33; }
          .normal { background-color: #efe; color: #363; }
          .programada { background-color: #eef; color: #336; }
          .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 15px; }
          .firma { margin-top: 40px; }
          .linea-firma { border-bottom: 1px solid #333; width: 300px; margin: 20px 0 5px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="titulo">ORDEN DE INTERCONSULTA MÉDICA</div>
          <div class="subtitulo">Sistema de Gestión Médica</div>
        </div>
        
        <div class="seccion">
          <span class="label">Fecha:</span>
          <span class="valor">${new Date(datosImprimir.fecha).toLocaleDateString('es-ES')}</span>
        </div>
        
        <div class="seccion">
          <span class="label">Paciente:</span>
          <span class="valor">${paciente?.nombre} ${paciente?.apellido}</span>
        </div>
        
        <div class="seccion">
          <span class="label">Cédula:</span>
          <span class="valor">${paciente?.cedula}</span>
        </div>
        
        <div class="seccion">
          <span class="label">Médico solicitante:</span>
          <span class="valor">${datosImprimir.medicoOrigen || `Dr. ${medicoActual?.nombre} ${medicoActual?.apellido}`}</span>
        </div>
        
        <div class="seccion">
          <span class="label">Especialidad solicitada:</span>
          <span class="valor">${datosImprimir.especialidad}</span>
        </div>
        
        <div class="seccion">
          <span class="label">Médico destino:</span>
          <span class="valor">${datosImprimir.medicoDestino}</span>
        </div>
        
        <div class="seccion">
          <span class="label">Nivel de urgencia:</span>
          <span class="valor urgencia ${datosImprimir.urgencia?.toLowerCase()}">${datosImprimir.urgencia}</span>
        </div>
        
        <div class="seccion">
          <div class="label">Motivo de la interconsulta:</div>
          <div class="valor" style="margin-top: 5px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            ${datosImprimir.motivo}
          </div>
        </div>
        
        ${datosImprimir.notas ? `
        <div class="seccion">
          <div class="label">Notas adicionales:</div>
          <div class="valor" style="margin-top: 5px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            ${datosImprimir.notas}
          </div>
        </div>
        ` : ''}
        
        <div class="footer">
          <div class="firma">
            <div class="linea-firma"></div>
            <div><strong>Firma y sello del médico solicitante</strong></div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Abrir ventana de impresión
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(contenidoHTML);
      ventanaImpresion.document.close();
      ventanaImpresion.focus();
      ventanaImpresion.print();
    }
  };

  const enviarInterconsulta = () => {
    // Guardar en historial
    const interconsultaGuardada = guardarInterconsultaEnHistorial();
    
    console.log('Interconsulta enviada y guardada:', interconsultaGuardada);
    
    alert(`Interconsulta enviada a ${interconsultaGuardada.medicoDestino} - ${interconsultaGuardada.especialidad}\n\nLa interconsulta ha sido guardada en el historial del paciente.`);
    
    // Limpiar formulario
    setInterconsulta({
      medicoDestino: '',
      medicoDestinoManual: '',
      especialidad: '',
      especialidadManual: '',
      motivo: '',
      urgencia: 'Normal',
      notas: '',
      usarMedicoManual: false,
      usarEspecialidadManual: false
    });
    setShowInterconsulta(false);
  };

  const handleCrearHistorial = () => {
    const nuevoId = (historiales.length + 1).toString();
    
    const historialCompleto: HistorialMedico = {
      ...nuevoHistorial,
      id: nuevoId,
      fecha: new Date().toISOString().split('T')[0],
      archivosAdjuntos: []
    };
    
    setHistoriales([...historiales, historialCompleto]);
    setShowNuevoHistorial(false);
    setNuevoHistorial({
      pacienteId: pacienteSeleccionado?.id || '',
      medicoId: medicoActual?.id || '',
      motivo: '',
      sintomas: '',
      diagnostico: '',
      tratamiento: '',
      medicamentos: [],
      examenes: [],
      proximaConsulta: '',
      notas: '',
      archivosAdjuntos: []
    });
  };

  const exportarHistorialPDF = (historial: HistorialMedico) => {
    const paciente = obtenerPaciente(historial.pacienteId);
    const medico = obtenerMedico(historial.medicoId);
    
    console.log('Exportando historial a PDF:', {
      paciente: `${paciente?.nombre} ${paciente?.apellido}`,
      medico: `${medico?.nombre} ${medico?.apellido}`,
      fecha: historial.fecha,
      diagnostico: historial.diagnostico
    });
    
    alert('Historial médico exportado a PDF (simulación)');
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Cargando historiales médicos..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historial Médico</h1>
          <p className="text-gray-600">
            {pacienteSeleccionado 
              ? `Registro de ${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}` 
              : 'Registro completo de consultas y tratamientos'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          {interconsultasRegistradas.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setShowInterconsultasHistorial(true)}
              className="bg-orange-50 hover:bg-orange-100 border-orange-200"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Ver Interconsultas ({interconsultasRegistradas.length})
            </Button>
          )}
          
          <Dialog open={showNuevoHistorial} onOpenChange={setShowNuevoHistorial}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Crear Nuevo Registro Médico
                  {pacienteSeleccionado && (
                    <span className="text-sm font-normal text-gray-600 block mt-1">
                      Para: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
                  <TabsTrigger value="examenes">Exámenes</TabsTrigger>
                  <TabsTrigger value="laboratorio">Laboratorio</TabsTrigger>
                  <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
                  <TabsTrigger value="interconsulta">Interconsulta</TabsTrigger>
                  <TabsTrigger value="archivos">Archivos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paciente">Paciente</Label>
                      {pacienteSeleccionado ? (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="font-medium text-blue-900">
                            {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                          </div>
                          <div className="text-sm text-blue-700">
                            Cédula: {pacienteSeleccionado.cedula} | Tel: {pacienteSeleccionado.telefono}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            (Paciente seleccionado desde agenda)
                          </div>
                        </div>
                      ) : (
                        <Select value={nuevoHistorial.pacienteId} onValueChange={(value) => setNuevoHistorial({...nuevoHistorial, pacienteId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar paciente" />
                          </SelectTrigger>
                          <SelectContent>
                            {pacientes.map(paciente => (
                              <SelectItem key={paciente.id} value={paciente.id}>
                                {paciente.nombre} {paciente.apellido} - {paciente.cedula}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="medico">Médico</Label>
                      {medicoLogueado || medicoActual ? (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="font-medium text-green-900">
                            Dr. {medicoActual?.nombre} {medicoActual?.apellido}
                          </div>
                          <div className="text-sm text-green-700">
                            {medicoActual?.especialidad} | Lic. {medicoActual?.numeroLicencia}
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            (Médico logueado)
                          </div>
                        </div>
                      ) : (
                        <Select value={nuevoHistorial.medicoId} onValueChange={(value) => setNuevoHistorial({...nuevoHistorial, medicoId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar médico" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicos.map(medico => (
                              <SelectItem key={medico.id} value={medico.id}>
                                {medico.nombre} {medico.apellido} - {medico.especialidad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="motivo">Motivo de la consulta</Label>
                    <Input
                      placeholder="Motivo principal de la visita..."
                      value={nuevoHistorial.motivo}
                      onChange={(e) => setNuevoHistorial({...nuevoHistorial, motivo: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sintomas">Síntomas</Label>
                    <Textarea
                      placeholder="Descripción detallada de los síntomas..."
                      value={nuevoHistorial.sintomas}
                      onChange={(e) => setNuevoHistorial({...nuevoHistorial, sintomas: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="diagnostico">Diagnóstico</Label>
                    <Textarea
                      placeholder="Diagnóstico médico..."
                      value={nuevoHistorial.diagnostico}
                      onChange={(e) => setNuevoHistorial({...nuevoHistorial, diagnostico: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tratamiento">Tratamiento</Label>
                    <Textarea
                      placeholder="Plan de tratamiento..."
                      value={nuevoHistorial.tratamiento}
                      onChange={(e) => setNuevoHistorial({...nuevoHistorial, tratamiento: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="proximaConsulta">Próxima consulta</Label>
                      <Input
                        type="date"
                        value={nuevoHistorial.proximaConsulta}
                        onChange={(e) => setNuevoHistorial({...nuevoHistorial, proximaConsulta: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notas">Notas adicionales</Label>
                    <Textarea
                      placeholder="Observaciones adicionales..."
                      value={nuevoHistorial.notas}
                      onChange={(e) => setNuevoHistorial({...nuevoHistorial, notas: e.target.value})}
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="medicamentos" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Agregar Medicamento</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor="medicamento">Medicamento</Label>
                        <Input
                          placeholder="Nombre del medicamento"
                          value={nuevoMedicamento.nombre}
                          onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, nombre: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dosis">Dosis</Label>
                        <Input
                          placeholder="ej: 500mg"
                          value={nuevoMedicamento.dosis}
                          onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, dosis: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="frecuencia">Frecuencia</Label>
                        <Input
                          placeholder="ej: Cada 8 horas"
                          value={nuevoMedicamento.frecuencia}
                          onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, frecuencia: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor="duracion">Duración</Label>
                        <Input
                          placeholder="ej: 7 días"
                          value={nuevoMedicamento.duracion}
                          onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, duracion: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cantidad">Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          value={nuevoMedicamento.cantidad}
                          onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, cantidad: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={agregarMedicamento} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="indicaciones-med">Indicaciones específicas</Label>
                      <Input
                        placeholder="ej: Tomar con alimentos"
                        value={nuevoMedicamento.indicaciones}
                        onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, indicaciones: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Lista de medicamentos agregados */}
                  {nuevoHistorial.medicamentos.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Medicamentos agregados:</h4>
                      <div className="space-y-2">
                        {nuevoHistorial.medicamentos.map((med, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{med.nombre} - {med.dosis}</div>
                              <div className="text-sm text-gray-600">
                                {med.frecuencia} por {med.duracion} - Cantidad: {med.cantidad}
                              </div>
                              {med.indicaciones && (
                                <div className="text-sm text-gray-500">
                                  Indicaciones: {med.indicaciones}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="examenes" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Agregar Examen</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor="examen">Nombre del examen</Label>
                        <Input
                          placeholder="ej: Hemograma completo"
                          value={nuevoExamen.nombre}
                          onChange={(e) => setNuevoExamen({...nuevoExamen, nombre: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select value={nuevoExamen.tipo} onValueChange={(value: Examen['tipo']) => setNuevoExamen({...nuevoExamen, tipo: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                            <SelectItem value="Imagen">Imagen</SelectItem>
                            <SelectItem value="Funcional">Funcional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="fecha-examen">Fecha</Label>
                        <Input
                          type="date"
                          value={nuevoExamen.fecha}
                          onChange={(e) => setNuevoExamen({...nuevoExamen, fecha: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="resultado">Resultado</Label>
                        <Textarea
                          placeholder="Resultado del examen..."
                          value={nuevoExamen.resultado}
                          onChange={(e) => setNuevoExamen({...nuevoExamen, resultado: e.target.value})}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="valorReferencia">Valor de referencia</Label>
                        <Textarea
                          placeholder="Valores normales..."
                          value={nuevoExamen.valorReferencia}
                          onChange={(e) => setNuevoExamen({...nuevoExamen, valorReferencia: e.target.value})}
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <Label htmlFor="estado">Estado</Label>
                        <Select value={nuevoExamen.estado} onValueChange={(value: Examen['estado']) => setNuevoExamen({...nuevoExamen, estado: value})}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="Completado">Completado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={agregarExamen}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Examen
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Lista de exámenes agregados */}
                  {nuevoHistorial.examenes.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Exámenes agregados:</h4>
                      <div className="space-y-2">
                        {nuevoHistorial.examenes.map((examen, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{examen.nombre}</div>
                                <div className="text-sm text-gray-600">
                                  Tipo: {examen.tipo} | Fecha: {examen.fecha} | Estado: {examen.estado}
                                </div>
                                {examen.resultado && (
                                  <div className="text-sm text-gray-700 mt-1">
                                    <strong>Resultado:</strong> {examen.resultado}
                                  </div>
                                )}
                              </div>
                              <Badge variant={examen.estado === 'Completado' ? 'default' : 'secondary'}>
                                {examen.estado}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="laboratorio" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Exámenes de Laboratorio</h3>
                      </div>
                      <Button 
                        onClick={() => setShowExamenesLab(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Clipboard className="w-4 h-4 mr-2" />
                        Seleccionar Exámenes
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Selecciona los exámenes de laboratorio que deseas solicitar para este paciente.
                    </p>

                    {/* Exámenes seleccionados */}
                    {examenesSeleccionados.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Exámenes seleccionados ({examenesSeleccionados.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {examenesSeleccionados.map((examen, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                              {examen}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          onClick={agregarExamenesSeleccionados}
                          className="mt-3 bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar {examenesSeleccionados.length} examen(es)
                        </Button>
                      </div>
                    )}

                    {/* Lista de exámenes de laboratorio ya agregados */}
                    {nuevoHistorial.examenes.filter(e => e.tipo === 'Laboratorio').length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Exámenes de laboratorio agregados:</h4>
                        <div className="space-y-2">
                          {nuevoHistorial.examenes
                            .filter(e => e.tipo === 'Laboratorio')
                            .map((examen, index) => (
                              <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-green-900">{examen.nombre}</div>
                                    <div className="text-sm text-green-700">
                                      Fecha: {examen.fecha} | Estado: {examen.estado}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="border-green-300 text-green-700">
                                    {examen.estado}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal de selección de exámenes */}
                  <Dialog open={showExamenesLab} onOpenChange={setShowExamenesLab}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FlaskConical className="w-5 h-5 text-blue-600" />
                          Seleccionar Exámenes de Laboratorio
                        </DialogTitle>
                      </DialogHeader>

                      {/* Filtros */}
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Buscar examen..."
                            value={busquedaExamen}
                            onChange={(e) => setBusquedaExamen(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrar por categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {examenesLaboratorio.map(categoria => (
                              <SelectItem key={categoria.categoria} value={categoria.categoria}>
                                {categoria.categoria}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Lista de exámenes por categoría */}
                      <div className="space-y-6 max-h-96 overflow-y-auto">
                        {examenesFiltrados.map(categoria => (
                          <div key={categoria.categoria}>
                            <h4 className="font-semibold text-lg mb-3 text-blue-900 border-b border-blue-200 pb-2">
                              {categoria.categoria}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {categoria.examenes.map(examen => (
                                <div 
                                  key={examen.nombre}
                                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                  onClick={() => toggleExamenSeleccionado(examen.nombre)}
                                >
                                  <Checkbox
                                    checked={examenesSeleccionados.includes(examen.nombre)}
                                    onChange={() => toggleExamenSeleccionado(examen.nombre)}
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{examen.nombre}</div>
                                    <div className="text-xs text-gray-600">{examen.descripcion}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer del modal */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          {examenesSeleccionados.length} examen(es) seleccionado(s)
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowExamenesLab(false)}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={agregarExamenesSeleccionados}
                            disabled={examenesSeleccionados.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Seleccionados
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                <TabsContent value="imagenes" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">Estudios de Imágenes</h3>
                      </div>
                      <Button 
                        onClick={() => setShowEstudiosImg(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Clipboard className="w-4 h-4 mr-2" />
                        Seleccionar Estudios
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Selecciona los estudios de imágenes que deseas solicitar para este paciente.
                    </p>

                    {/* Estudios seleccionados */}
                    {estudiosSeleccionados.length > 0 && (
                      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">
                          Estudios seleccionados ({estudiosSeleccionados.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {estudiosSeleccionados.map((estudio, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                              {estudio}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          onClick={agregarEstudiosSeleccionados}
                          className="mt-3 bg-purple-600 hover:bg-purple-700"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar {estudiosSeleccionados.length} estudio(s)
                        </Button>
                      </div>
                    )}

                    {/* Lista de estudios de imágenes ya agregados */}
                    {nuevoHistorial.examenes.filter(e => e.tipo === 'Imagen').length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Estudios de imágenes agregados:</h4>
                        <div className="space-y-2">
                          {nuevoHistorial.examenes
                            .filter(e => e.tipo === 'Imagen')
                            .map((examen, index) => (
                              <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-purple-900">{examen.nombre}</div>
                                    <div className="text-sm text-purple-700">
                                      Fecha: {examen.fecha} | Estado: {examen.estado}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                                    {examen.estado}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal de selección de estudios */}
                  <Dialog open={showEstudiosImg} onOpenChange={setShowEstudiosImg}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Camera className="w-5 h-5 text-purple-600" />
                          Seleccionar Estudios de Imágenes
                        </DialogTitle>
                      </DialogHeader>

                      {/* Filtros */}
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Buscar estudio..."
                            value={busquedaEstudio}
                            onChange={(e) => setBusquedaEstudio(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Select value={categoriaEstudioFiltro} onValueChange={setCategoriaEstudioFiltro}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrar por categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {estudiosImagenes.map(categoria => (
                              <SelectItem key={categoria.categoria} value={categoria.categoria}>
                                {categoria.categoria}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Lista de estudios por categoría */}
                      <div className="space-y-6 max-h-96 overflow-y-auto">
                        {estudiosImagenesFiltrados.map(categoria => (
                          <div key={categoria.categoria}>
                            <h4 className="font-semibold text-lg mb-3 text-purple-900 border-b border-purple-200 pb-2">
                              {categoria.categoria}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {categoria.estudios.map(estudio => (
                                <div 
                                  key={estudio.nombre}
                                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                  onClick={() => toggleEstudioSeleccionado(estudio.nombre)}
                                >
                                  <Checkbox
                                    checked={estudiosSeleccionados.includes(estudio.nombre)}
                                    onChange={() => toggleEstudioSeleccionado(estudio.nombre)}
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{estudio.nombre}</div>
                                    <div className="text-xs text-gray-600">{estudio.descripcion}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer del modal */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          {estudiosSeleccionados.length} estudio(s) seleccionado(s)
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowEstudiosImg(false)}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={agregarEstudiosSeleccionados}
                            disabled={estudiosSeleccionados.length === 0}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Seleccionados
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                <TabsContent value="interconsulta" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-semibold">Interconsulta Médica</h3>
                      </div>
                      <Button 
                        onClick={() => setShowInterconsulta(true)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Interconsulta
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Envía al paciente a otro especialista para evaluación o tratamiento específico.
                    </p>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-medium text-orange-900 mb-2">¿Cuándo enviar una interconsulta?</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Cuando se requiere evaluación especializada</li>
                        <li>• Para procedimientos específicos de otra especialidad</li>
                        <li>• Casos complejos que requieren segunda opinión</li>
                        <li>• Seguimiento especializado de patologías crónicas</li>
                      </ul>
                    </div>

                    {/* Mostrar interconsultas guardadas en este historial */}
                    {interconsultasRegistradas.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Interconsultas registradas:</h4>
                        <div className="space-y-2">
                          {interconsultasRegistradas.slice(-3).map((ic, index) => (
                            <div key={ic.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-orange-900">
                                    {ic.especialidad} - {ic.medicoDestino}
                                  </div>
                                  <div className="text-sm text-orange-700">
                                    {new Date(ic.fecha).toLocaleDateString('es-ES')} | {ic.urgencia}
                                  </div>
                                  <div className="text-xs text-orange-600 mt-1">
                                    {ic.motivo.substring(0, 100)}...
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                                    {ic.estado}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => imprimirInterconsulta(ic)}
                                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                                  >
                                    <Printer className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal de interconsulta */}
                  <Dialog open={showInterconsulta} onOpenChange={setShowInterconsulta}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-orange-600" />
                          Enviar Interconsulta Médica
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        {/* Información del paciente */}
                        {pacienteSeleccionado && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-1">Paciente</h4>
                            <div className="text-sm text-blue-800">
                              {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido} - Cédula: {pacienteSeleccionado.cedula}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="medicoDestino">Médico de destino</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={!interconsulta.usarMedicoManual}
                                  onChange={() => setInterconsulta({...interconsulta, usarMedicoManual: false, medicoDestinoManual: ''})}
                                />
                                <Label className="text-sm">Seleccionar de la lista</Label>
                              </div>
                              {!interconsulta.usarMedicoManual && (
                                <Select value={interconsulta.medicoDestino} onValueChange={(value) => setInterconsulta({...interconsulta, medicoDestino: value})}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar médico" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {medicos
                                      .filter(m => m.id !== medicoActual?.id)
                                      .map(medico => (
                                        <SelectItem key={medico.id} value={medico.id}>
                                          Dr. {medico.nombre} {medico.apellido} - {medico.especialidad}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              )}
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={interconsulta.usarMedicoManual}
                                  onChange={() => setInterconsulta({...interconsulta, usarMedicoManual: true, medicoDestino: ''})}
                                />
                                <Label className="text-sm">Escribir manualmente</Label>
                              </div>
                              {interconsulta.usarMedicoManual && (
                                <Input
                                  placeholder="Dr. Nombre Apellido"
                                  value={interconsulta.medicoDestinoManual}
                                  onChange={(e) => setInterconsulta({...interconsulta, medicoDestinoManual: e.target.value})}
                                />
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="especialidad">Especialidad</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={!interconsulta.usarEspecialidadManual}
                                  onChange={() => setInterconsulta({...interconsulta, usarEspecialidadManual: false, especialidadManual: ''})}
                                />
                                <Label className="text-sm">Seleccionar de la lista</Label>
                              </div>
                              {!interconsulta.usarEspecialidadManual && (
                                <Select value={interconsulta.especialidad} onValueChange={(value) => setInterconsulta({...interconsulta, especialidad: value})}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar especialidad" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {especialidadesMedicas.map(especialidad => (
                                      <SelectItem key={especialidad} value={especialidad}>
                                        {especialidad}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={interconsulta.usarEspecialidadManual}
                                  onChange={() => setInterconsulta({...interconsulta, usarEspecialidadManual: true, especialidad: ''})}
                                />
                                <Label className="text-sm">Escribir manualmente</Label>
                              </div>
                              {interconsulta.usarEspecialidadManual && (
                                <Input
                                  placeholder="ej: Medicina Nuclear"
                                  value={interconsulta.especialidadManual}
                                  onChange={(e) => setInterconsulta({...interconsulta, especialidadManual: e.target.value})}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="urgencia">Nivel de urgencia</Label>
                          <Select value={interconsulta.urgencia} onValueChange={(value: 'Urgente' | 'Normal' | 'Programada') => setInterconsulta({...interconsulta, urgencia: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Urgente">Urgente (24-48 horas)</SelectItem>
                              <SelectItem value="Normal">Normal (1-2 semanas)</SelectItem>
                              <SelectItem value="Programada">Programada (1 mes)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="motivo">Motivo de la interconsulta</Label>
                          <Textarea
                            placeholder="Describe el motivo por el cual envías al paciente..."
                            value={interconsulta.motivo}
                            onChange={(e) => setInterconsulta({...interconsulta, motivo: e.target.value})}
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="notas">Notas adicionales</Label>
                          <Textarea
                            placeholder="Información adicional relevante para el especialista..."
                            value={interconsulta.notas}
                            onChange={(e) => setInterconsulta({...interconsulta, notas: e.target.value})}
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setShowInterconsulta(false)}>
                          Cancelar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => imprimirInterconsulta()}
                          disabled={
                            (!interconsulta.usarMedicoManual && !interconsulta.medicoDestino) ||
                            (interconsulta.usarMedicoManual && !interconsulta.medicoDestinoManual) ||
                            (!interconsulta.usarEspecialidadManual && !interconsulta.especialidad) ||
                            (interconsulta.usarEspecialidadManual && !interconsulta.especialidadManual) ||
                            !interconsulta.motivo
                          }
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          Imprimir Orden
                        </Button>
                        <Button 
                          onClick={enviarInterconsulta}
                          disabled={
                            (!interconsulta.usarMedicoManual && !interconsulta.medicoDestino) ||
                            (interconsulta.usarMedicoManual && !interconsulta.medicoDestinoManual) ||
                            (!interconsulta.usarEspecialidadManual && !interconsulta.especialidad) ||
                            (interconsulta.usarEspecialidadManual && !interconsulta.especialidadManual) ||
                            !interconsulta.motivo
                          }
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar y Enviar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                <TabsContent value="archivos" className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Arrastra archivos aquí o haz clic para seleccionar</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Seleccionar Archivos
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Formatos soportados: PDF, JPG, PNG, DOC (Máx. 10MB)
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowNuevoHistorial(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCrearHistorial}>
                  Crear Registro
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Modal de historial de interconsultas */}
      <Dialog open={showInterconsultasHistorial} onOpenChange={setShowInterconsultasHistorial}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-600" />
              Historial de Interconsultas
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {interconsultasRegistradas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay interconsultas registradas</p>
            ) : (
              interconsultasRegistradas.map((ic) => (
                <div key={ic.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-medium text-lg">{ic.especialidad}</div>
                      <div className="text-sm text-gray-600">
                        Para: {ic.medicoDestino} | Fecha: {new Date(ic.fecha).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-orange-300 text-orange-700">
                        {ic.estado}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => imprimirInterconsulta(ic)}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Médico solicitante:</strong> {ic.medicoOrigen}
                    </div>
                    <div>
                      <strong>Urgencia:</strong> {ic.urgencia}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <strong className="text-sm">Motivo:</strong>
                    <p className="text-sm text-gray-600 mt-1">{ic.motivo}</p>
                  </div>
                  
                  {ic.notas && (
                    <div className="mt-3">
                      <strong className="text-sm">Notas:</strong>
                      <p className="text-sm text-gray-600 mt-1">{ic.notas}</p>
                    </div>
                  )}
                  
                  {ic.respuesta && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                      <strong className="text-sm text-green-800">Respuesta:</strong>
                      <p className="text-sm text-green-700 mt-1">{ic.respuesta}</p>
                      <div className="text-xs text-green-600 mt-1">
                        Respondida el: {ic.fechaRespuesta && new Date(ic.fechaRespuesta).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Filtros y búsqueda - Solo mostrar si no hay paciente seleccionado */}
      {!pacienteSeleccionado && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por paciente, diagnóstico o motivo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={filtroPaciente} onValueChange={setFiltroPaciente}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los pacientes</SelectItem>
                    {pacientes.map(paciente => (
                      <SelectItem key={paciente.id} value={paciente.id}>
                        {paciente.nombre} {paciente.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filtroMedico} onValueChange={setFiltroMedico}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Médico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los médicos</SelectItem>
                    {medicos.map(medico => (
                      <SelectItem key={medico.id} value={medico.id}>
                        {medico.nombre} {medico.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de historiales */}
      <div className="space-y-6">
        {historialesFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron registros médicos</p>
            </CardContent>
          </Card>
        ) : (
          historialesFiltrados.map(historial => {
            const paciente = obtenerPaciente(historial.pacienteId);
            const medico = obtenerMedico(historial.medicoId);
            
            return (
              <Card key={historial.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        {historial.motivo}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {paciente?.nombre} {paciente?.apellido}
                        </div>
                        <div className="flex items-center gap-1">
                          <Stethoscope className="w-4 h-4" />
                          Dr. {medico?.nombre} {medico?.apellido}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(historial.fecha).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setHistorialSeleccionado(historial)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportarHistorialPDF(historial)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Síntomas</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {historial.sintomas}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Diagnóstico</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {historial.diagnostico}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4">
                    {historial.medicamentos.length > 0 && (
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <Pill className="w-4 h-4" />
                        {historial.medicamentos.length} medicamento(s)
                      </div>
                    )}
                    
                    {historial.examenes.length > 0 && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TestTube className="w-4 h-4" />
                        {historial.examenes.length} examen(es)
                      </div>
                    )}
                    
                    {historial.proximaConsulta && (
                      <div className="flex items-center gap-1 text-sm text-orange-600">
                        <Calendar className="w-4 h-4" />
                        Próxima: {new Date(historial.proximaConsulta).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal de vista detallada */}
      <Dialog open={!!historialSeleccionado} onOpenChange={() => setHistorialSeleccionado(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {historialSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Registro Médico - {historialSeleccionado.motivo}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="resumen" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="resumen">Resumen</TabsTrigger>
                  <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
                  <TabsTrigger value="examenes">Exámenes</TabsTrigger>
                  <TabsTrigger value="archivos">Archivos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="resumen" className="space-y-6">
                  {/* Información del paciente y médico */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Información del Paciente</h4>
                      {(() => {
                        const paciente = obtenerPaciente(historialSeleccionado.pacienteId);
                        return (
                          <div className="text-sm space-y-1">
                            <div><strong>Nombre:</strong> {paciente?.nombre} {paciente?.apellido}</div>
                            <div><strong>Cédula:</strong> {paciente?.cedula}</div>
                            <div><strong>Fecha de nacimiento:</strong> {paciente?.fechaNacimiento}</div>
                            <div><strong>Teléfono:</strong> {paciente?.telefono}</div>
                            <div><strong>Tipo de sangre:</strong> {paciente?.tipoSangre}</div>
                            {paciente?.alergias && paciente.alergias.length > 0 && (
                              <div><strong>Alergias:</strong> {paciente.alergias.join(', ')}</div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Información del Médico</h4>
                      {(() => {
                        const medico = obtenerMedico(historialSeleccionado.medicoId);
                        return (
                          <div className="text-sm space-y-1">
                            <div><strong>Nombre:</strong> Dr. {medico?.nombre} {medico?.apellido}</div>
                            <div><strong>Especialidad:</strong> {medico?.especialidad}</div>
                            <div><strong>Licencia:</strong> {medico?.numeroLicencia}</div>
                            <div><strong>Teléfono:</strong> {medico?.telefono}</div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* Detalles de la consulta */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Motivo de la consulta</h4>
                      <p className="text-sm bg-gray-50 p-4 rounded-lg">
                        {historialSeleccionado.motivo}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Síntomas</h4>
                      <p className="text-sm bg-gray-50 p-4 rounded-lg">
                        {historialSeleccionado.sintomas}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Diagnóstico</h4>
                      <p className="text-sm bg-blue-50 p-4 rounded-lg">
                        {historialSeleccionado.diagnostico}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Tratamiento</h4>
                      <p className="text-sm bg-green-50 p-4 rounded-lg">
                        {historialSeleccionado.tratamiento}
                      </p>
                    </div>
                    
                    {historialSeleccionado.notas && (
                      <div>
                        <h4 className="font-semibold mb-2">Notas adicionales</h4>
                        <p className="text-sm bg-yellow-50 p-4 rounded-lg whitespace-pre-wrap">
                          {historialSeleccionado.notas}
                        </p>
                      </div>
                    )}
                    
                    {historialSeleccionado.proximaConsulta && (
                      <div>
                        <h4 className="font-semibold mb-2">Próxima consulta</h4>
                        <p className="text-sm">
                          {new Date(historialSeleccionado.proximaConsulta).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="medicamentos">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Medicamentos Prescritos</h4>
                    {historialSeleccionado.medicamentos.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No se prescribieron medicamentos</p>
                    ) : (
                      <div className="space-y-3">
                        {historialSeleccionado.medicamentos.map((med, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="font-medium text-lg">{med.nombre}</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                              <div><strong>Dosis:</strong> {med.dosis}</div>
                              <div><strong>Frecuencia:</strong> {med.frecuencia}</div>
                              <div><strong>Duración:</strong> {med.duracion}</div>
                              <div><strong>Cantidad:</strong> {med.cantidad}</div>
                            </div>
                            {med.indicaciones && (
                              <div className="mt-2 text-sm text-gray-600">
                                <strong>Indicaciones:</strong> {med.indicaciones}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="examenes">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Exámenes Solicitados</h4>
                    {historialSeleccionado.examenes.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No se solicitaron exámenes</p>
                    ) : (
                      <div className="space-y-3">
                        {historialSeleccionado.examenes.map((examen, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-lg">{examen.nombre}</div>
                              <Badge variant={examen.estado === 'Completado' ? 'default' : 'secondary'}>
                                {examen.estado}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div><strong>Tipo:</strong> {examen.tipo}</div>
                              <div><strong>Fecha:</strong> {examen.fecha}</div>
                              <div><strong>Estado:</strong> {examen.estado}</div>
                            </div>
                            {examen.resultado && (
                              <div className="mt-2 text-sm">
                                <strong>Resultado:</strong>
                                <p className="bg-gray-50 p-2 rounded mt-1">{examen.resultado}</p>
                              </div>
                            )}
                            {examen.valorReferencia && (
                              <div className="mt-2 text-sm text-gray-600">
                                <strong>Valor de referencia:</strong> {examen.valorReferencia}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="archivos">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Archivos Adjuntos</h4>
                    {historialSeleccionado.archivosAdjuntos.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay archivos adjuntos</p>
                    ) : (
                      <div className="space-y-3">
                        {historialSeleccionado.archivosAdjuntos.map((archivo, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-blue-500" />
                              <div>
                                <div className="font-medium">{archivo.nombre}</div>
                                <div className="text-sm text-gray-600">
                                  {(archivo.tamaño / 1024).toFixed(1)} KB - {archivo.fecha}
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Descargar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => exportarHistorialPDF(historialSeleccionado)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistorialMedicoComponent;