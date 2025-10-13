import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Stethoscope, Calendar, Users, Clock, FileText, 
  LogOut, Bell, Activity, TrendingUp, AlertCircle,
  Phone, Video, MessageSquare, Plus, Search, User,
  Save, Download, Edit, X, Maximize2, Minimize2,
  Upload, Paperclip, Image as ImageIcon, FileImage,
  Printer, Send, Eye, History, UserPlus, CalendarPlus
} from 'lucide-react';
import ThemeToggleComponent from '@/components/ui/theme-toggle';
import ChatbotMedico from '@/components/medicos/ChatbotMedico';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  color: string;
  patients: number;
  appointmentsToday: number;
}

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  duration: number;
  patientAge: number;
  patientPhone: string;
  patientEmail: string;
  condition: string;
  notes?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  attachments?: string[];
}

interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  condition: string;
  priority: 'high' | 'medium' | 'low';
  phone: string;
  email: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
}

const DoctorDashboard: React.FC = () => {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(false); // Control para habilitar/deshabilitar chatbot
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: ''
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showNewPatientDialog, setShowNewPatientDialog] = useState(false);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    condition: '',
    allergies: '',
    medicalHistory: ''
  });
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: '',
    time: '',
    type: '',
    duration: '30'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const doctorData = localStorage.getItem('currentDoctor');
    if (doctorData) {
      const doctor = JSON.parse(doctorData);
      setCurrentDoctor(doctor);
      setAppointments(getAppointmentsBySpecialty(doctor.specialty));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentDoctor');
    navigate('/login');
  };

  // Función para habilitar el chatbot (para uso futuro)
  const enableChatbot = () => {
    setIsChatbotEnabled(true);
  };

  // Función para deshabilitar el chatbot
  const disableChatbot = () => {
    setIsChatbotEnabled(false);
    setIsChatbotOpen(false);
  };

  // Datos de ejemplo personalizados por especialidad
  const getAppointmentsBySpecialty = (specialty: string): Appointment[] => {
    const baseAppointments = {
      'Medicina General': [
        { 
          id: '1', 
          patientName: 'María López', 
          time: '09:00', 
          type: 'Consulta General', 
          status: 'confirmed' as const, 
          duration: 30, 
          patientAge: 45, 
          patientPhone: '+1234567890', 
          patientEmail: 'maria@email.com', 
          condition: 'Hipertensión', 
          notes: 'Paciente con historial de hipertensión arterial.',
          medicalHistory: 'Hipertensión diagnosticada en 2020. Antecedentes familiares cardiovasculares.',
          allergies: 'Penicilina',
          medications: 'Losartán 50mg diario, Aspirina 100mg',
          attachments: ['electrocardiograma_maria.pdf', 'analisis_sangre_maria.pdf']
        },
        { 
          id: '2', 
          patientName: 'Carlos Ruiz', 
          time: '09:30', 
          type: 'Control Hipertensión', 
          status: 'confirmed' as const, 
          duration: 20, 
          patientAge: 62, 
          patientPhone: '+1234567891', 
          patientEmail: 'carlos@email.com', 
          condition: 'Diabetes Tipo 2', 
          notes: 'Control de glucosa y presión arterial.',
          medicalHistory: 'Diabetes Tipo 2 desde 2019. Sobrepeso.',
          allergies: 'Ninguna conocida',
          medications: 'Metformina 850mg, Glibenclamida 5mg',
          attachments: ['glucosa_carlos.pdf']
        },
        { 
          id: '3', 
          patientName: 'Ana García', 
          time: '10:00', 
          type: 'Chequeo Anual', 
          status: 'pending' as const, 
          duration: 45, 
          patientAge: 38, 
          patientPhone: '+1234567892', 
          patientEmail: 'ana@email.com', 
          condition: 'Chequeo preventivo', 
          notes: 'Examen médico general anual.',
          medicalHistory: 'Sin antecedentes médicos relevantes.',
          allergies: 'Ninguna',
          medications: 'Multivitamínico'
        },
        { 
          id: '4', 
          patientName: 'Pedro Martín', 
          time: '10:45', 
          type: 'Consulta Diabetes', 
          status: 'confirmed' as const, 
          duration: 30, 
          patientAge: 55, 
          patientPhone: '+1234567893', 
          patientEmail: 'pedro@email.com', 
          condition: 'Diabetes Tipo 1', 
          notes: 'Ajuste de insulina y control metabólico.',
          medicalHistory: 'Diabetes Tipo 1 desde los 25 años.',
          allergies: 'Sulfonamidas',
          medications: 'Insulina Lantus, Insulina Humalog'
        },
        { 
          id: '5', 
          patientName: 'Laura Sánchez', 
          time: '11:15', 
          type: 'Resultados Laboratorio', 
          status: 'completed' as const, 
          duration: 15, 
          patientAge: 42, 
          patientPhone: '+1234567894', 
          patientEmail: 'laura@email.com', 
          condition: 'Análisis de rutina', 
          notes: 'Revisión de resultados de laboratorio.',
          medicalHistory: 'Chequeos anuales normales.',
          allergies: 'Ninguna',
          medications: 'Ninguna',
          attachments: ['laboratorio_laura.pdf', 'radiografia_torax_laura.jpg']
        }
      ],
      'Odontología': [
        { 
          id: '1', 
          patientName: 'Roberto Díaz', 
          time: '08:30', 
          type: 'Limpieza Dental', 
          status: 'completed' as const, 
          duration: 60, 
          patientAge: 35, 
          patientPhone: '+1234567895', 
          patientEmail: 'roberto@email.com', 
          condition: 'Limpieza rutinaria', 
          notes: 'Profilaxis dental y fluorización.',
          medicalHistory: 'Sin antecedentes dentales. Buena higiene oral.',
          allergies: 'Ninguna',
          medications: 'Ninguna'
        },
        { 
          id: '2', 
          patientName: 'Carmen Vega', 
          time: '09:30', 
          type: 'Empaste', 
          status: 'confirmed' as const, 
          duration: 45, 
          patientAge: 28, 
          patientPhone: '+1234567896', 
          patientEmail: 'carmen@email.com', 
          condition: 'Caries dental', 
          notes: 'Restauración de molar superior derecho.',
          medicalHistory: 'Tratamiento de ortodoncia previo.',
          allergies: 'Látex',
          medications: 'Analgésicos según necesidad'
        },
        { 
          id: '3', 
          patientName: 'Miguel Torres', 
          time: '10:15', 
          type: 'Extracción Muela', 
          status: 'confirmed' as const, 
          duration: 30, 
          patientAge: 45, 
          patientPhone: '+1234567897', 
          patientEmail: 'miguel@email.com', 
          condition: 'Muela del juicio', 
          notes: 'Extracción de tercer molar impactado.',
          medicalHistory: 'Extracción previa sin complicaciones.',
          allergies: 'Penicilina',
          medications: 'Ibuprofeno'
        },
        { 
          id: '4', 
          patientName: 'Isabel Moreno', 
          time: '11:00', 
          type: 'Ortodoncia Control', 
          status: 'pending' as const, 
          duration: 30, 
          patientAge: 16, 
          patientPhone: '+1234567898', 
          patientEmail: 'isabel@email.com', 
          condition: 'Tratamiento ortodóncico', 
          notes: 'Ajuste de brackets y revisión de progreso.',
          medicalHistory: 'Tratamiento ortodóncico en curso.',
          allergies: 'Níquel',
          medications: 'Ninguna'
        }
      ],
      'Pediatría': [
        { 
          id: '1', 
          patientName: 'Sofía Herrera', 
          time: '08:00', 
          type: 'Control Crecimiento', 
          status: 'completed' as const, 
          duration: 30, 
          patientAge: 5, 
          patientPhone: '+1234567899', 
          patientEmail: 'sofia@email.com', 
          condition: 'Control rutinario', 
          notes: 'Evaluación de crecimiento y desarrollo normal.',
          medicalHistory: 'Desarrollo normal. Todas las vacunas al día.',
          allergies: 'Ninguna conocida',
          medications: 'Vitaminas'
        },
        { 
          id: '2', 
          patientName: 'Diego Ramírez', 
          time: '08:30', 
          type: 'Vacunación', 
          status: 'confirmed' as const, 
          duration: 20, 
          patientAge: 8, 
          patientPhone: '+1234567800', 
          patientEmail: 'diego@email.com', 
          condition: 'Esquema de vacunación', 
          notes: 'Aplicación de vacunas correspondientes a la edad.',
          medicalHistory: 'Esquema de vacunación completo.',
          allergies: 'Huevo',
          medications: 'Ninguna'
        },
        { 
          id: '3', 
          patientName: 'Emma Castro', 
          time: '09:00', 
          type: 'Consulta Fiebre', 
          status: 'confirmed' as const, 
          duration: 25, 
          patientAge: 2, 
          patientPhone: '+1234567801', 
          patientEmail: 'emma@email.com', 
          condition: 'Síndrome febril', 
          notes: 'Fiebre de 48 horas de evolución.',
          medicalHistory: 'Episodios febriles ocasionales.',
          allergies: 'Ninguna',
          medications: 'Paracetamol infantil'
        },
        { 
          id: '4', 
          patientName: 'Lucas Mendoza', 
          time: '09:30', 
          type: 'Chequeo Deportivo', 
          status: 'confirmed' as const, 
          duration: 40, 
          patientAge: 12, 
          patientPhone: '+1234567802', 
          patientEmail: 'lucas@email.com', 
          condition: 'Aptitud deportiva', 
          notes: 'Evaluación médica para práctica deportiva.',
          medicalHistory: 'Deportista activo. Sin lesiones previas.',
          allergies: 'Ninguna',
          medications: 'Ninguna'
        }
      ],
      'Oftalmología': [
        { 
          id: '1', 
          patientName: 'Elena Jiménez', 
          time: '09:00', 
          type: 'Examen Vista', 
          status: 'confirmed' as const, 
          duration: 45, 
          patientAge: 34, 
          patientPhone: '+1234567803', 
          patientEmail: 'elena@email.com', 
          condition: 'Revisión visual', 
          notes: 'Examen oftalmológico completo y graduación.',
          medicalHistory: 'Miopía leve. Uso de lentes.',
          allergies: 'Ninguna',
          medications: 'Ninguna'
        },
        { 
          id: '2', 
          patientName: 'Francisco Ortiz', 
          time: '10:00', 
          type: 'Control Glaucoma', 
          status: 'confirmed' as const, 
          duration: 30, 
          patientAge: 68, 
          patientPhone: '+1234567804', 
          patientEmail: 'francisco@email.com', 
          condition: 'Glaucoma crónico', 
          notes: 'Control de presión intraocular y campo visual.',
          medicalHistory: 'Glaucoma diagnosticado hace 5 años.',
          allergies: 'Yodo',
          medications: 'Gotas oftálmicas Timolol'
        },
        { 
          id: '3', 
          patientName: 'Patricia Ramos', 
          time: '11:00', 
          type: 'Cirugía Cataratas', 
          status: 'pending' as const, 
          duration: 60, 
          patientAge: 72, 
          patientPhone: '+1234567805', 
          patientEmail: 'patricia@email.com', 
          condition: 'Cataratas bilaterales', 
          notes: 'Evaluación pre-quirúrgica para facoemulsificación.',
          medicalHistory: 'Cataratas progresivas. Hipertensión controlada.',
          allergies: 'Penicilina',
          medications: 'Enalapril, Aspirina'
        }
      ],
      'Cirugía General': [
        { 
          id: '1', 
          patientName: 'Antonio Silva', 
          time: '07:00', 
          type: 'Cirugía Vesícula', 
          status: 'confirmed' as const, 
          duration: 120, 
          patientAge: 48, 
          patientPhone: '+1234567806', 
          patientEmail: 'antonio@email.com', 
          condition: 'Colelitiasis', 
          notes: 'Colecistectomía laparoscópica programada.',
          medicalHistory: 'Cálculos biliares múltiples.',
          allergies: 'Morfina',
          medications: 'Omeprazol'
        },
        { 
          id: '2', 
          patientName: 'Rosa Delgado', 
          time: '10:00', 
          type: 'Post-operatorio', 
          status: 'confirmed' as const, 
          duration: 30, 
          patientAge: 55, 
          patientPhone: '+1234567807', 
          patientEmail: 'rosa@email.com', 
          condition: 'Post-apendicectomía', 
          notes: 'Control post-operatorio día 7.',
          medicalHistory: 'Apendicectomía laparoscópica exitosa.',
          allergies: 'Ninguna',
          medications: 'Antibióticos, Analgésicos'
        },
        { 
          id: '3', 
          patientName: 'Javier Peña', 
          time: '11:00', 
          type: 'Consulta Pre-quirúrgica', 
          status: 'pending' as const, 
          duration: 45, 
          patientAge: 41, 
          patientPhone: '+1234567808', 
          patientEmail: 'javier@email.com', 
          condition: 'Hernia inguinal', 
          notes: 'Evaluación para herniorrafia inguinal.',
          medicalHistory: 'Hernia inguinal derecha sintomática.',
          allergies: 'Látex',
          medications: 'Ninguna'
        }
      ],
      'Cirugía Bariátrica': [
        { 
          id: '1', 
          patientName: 'Gloria Vargas', 
          time: '08:00', 
          type: 'Control Post-operatorio', 
          status: 'confirmed' as const, 
          duration: 45, 
          patientAge: 38, 
          patientPhone: '+1234567809', 
          patientEmail: 'gloria@email.com', 
          condition: 'Post-bypass gástrico', 
          notes: 'Control post-operatorio 3 meses.',
          medicalHistory: 'Bypass gástrico exitoso. Pérdida de 25kg.',
          allergies: 'Ninguna',
          medications: 'Complejo B, Hierro, Calcio'
        },
        { 
          id: '2', 
          patientName: 'Raúl Medina', 
          time: '09:00', 
          type: 'Evaluación Pre-quirúrgica', 
          status: 'confirmed' as const, 
          duration: 60, 
          patientAge: 45, 
          patientPhone: '+1234567810', 
          patientEmail: 'raul@email.com', 
          condition: 'Obesidad mórbida', 
          notes: 'Candidato para manga gástrica. IMC 42.',
          medicalHistory: 'Obesidad mórbida. Diabetes Tipo 2.',
          allergies: 'Ninguna',
          medications: 'Metformina'
        },
        { 
          id: '3', 
          patientName: 'Mónica Guerrero', 
          time: '10:30', 
          type: 'Seguimiento Nutricional', 
          status: 'pending' as const, 
          duration: 30, 
          patientAge: 33, 
          patientPhone: '+1234567811', 
          patientEmail: 'monica@email.com', 
          condition: 'Post-cirugía bariátrica', 
          notes: 'Seguimiento nutricional y control de peso.',
          medicalHistory: 'Manga gástrica hace 6 meses.',
          allergies: 'Ninguna',
          medications: 'Multivitamínicos'
        }
      ]
    };

    return baseAppointments[specialty as keyof typeof baseAppointments] || [];
  };

  const getPatientsBySpecialty = (specialty: string): Patient[] => {
    const basePatients = {
      'Medicina General': [
        { 
          id: '1', 
          name: 'María López', 
          age: 45, 
          lastVisit: '2024-01-15', 
          condition: 'Hipertensión controlada', 
          priority: 'medium' as const, 
          phone: '+1234567890', 
          email: 'maria@email.com',
          medicalHistory: 'Hipertensión desde 2020',
          allergies: 'Penicilina',
          medications: 'Losartán 50mg'
        },
        { 
          id: '2', 
          name: 'Carlos Ruiz', 
          age: 62, 
          lastVisit: '2024-01-10', 
          condition: 'Diabetes Tipo 2', 
          priority: 'high' as const, 
          phone: '+1234567891', 
          email: 'carlos@email.com',
          medicalHistory: 'Diabetes Tipo 2 desde 2019',
          allergies: 'Ninguna',
          medications: 'Metformina 850mg'
        },
        { 
          id: '3', 
          name: 'Ana García', 
          age: 38, 
          lastVisit: '2024-01-08', 
          condition: 'Chequeo preventivo', 
          priority: 'low' as const, 
          phone: '+1234567892', 
          email: 'ana@email.com',
          medicalHistory: 'Sin antecedentes',
          allergies: 'Ninguna',
          medications: 'Ninguna'
        }
      ],
      'Odontología': [
        { 
          id: '1', 
          name: 'Roberto Díaz', 
          age: 35, 
          lastVisit: '2024-01-12', 
          condition: 'Caries múltiples', 
          priority: 'medium' as const, 
          phone: '+1234567895', 
          email: 'roberto@email.com',
          medicalHistory: 'Buena higiene oral',
          allergies: 'Ninguna',
          medications: 'Ninguna'
        },
        { 
          id: '2', 
          name: 'Carmen Vega', 
          age: 28, 
          lastVisit: '2024-01-14', 
          condition: 'Ortodoncia activa', 
          priority: 'low' as const, 
          phone: '+1234567896', 
          email: 'carmen@email.com',
          medicalHistory: 'Tratamiento ortodóncico',
          allergies: 'Látex',
          medications: 'Analgésicos PRN'
        }
      ],
      'Pediatría': [
        { 
          id: '1', 
          name: 'Sofía Herrera', 
          age: 5, 
          lastVisit: '2024-01-16', 
          condition: 'Desarrollo normal', 
          priority: 'low' as const, 
          phone: '+1234567899', 
          email: 'sofia@email.com',
          medicalHistory: 'Desarrollo normal',
          allergies: 'Ninguna',
          medications: 'Vitaminas'
        },
        { 
          id: '2', 
          name: 'Diego Ramírez', 
          age: 8, 
          lastVisit: '2024-01-13', 
          condition: 'Asma leve', 
          priority: 'medium' as const, 
          phone: '+1234567800', 
          email: 'diego@email.com',
          medicalHistory: 'Asma desde los 6 años',
          allergies: 'Polen',
          medications: 'Salbutamol inhalador'
        }
      ]
    };

    return basePatients[specialty as keyof typeof basePatients] || [];
  };

  const handleAttendPatient = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setConsultationNotes(appointment.notes || '');
    setPrescription('');
    setVitalSigns({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      oxygenSaturation: ''
    });
  };

  const handleStartCall = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCallActive(true);
  };

  const handleStartVideoCall = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsVideoCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsVideoCallActive(false);
  };

  const handleSaveConsultation = () => {
    if (selectedAppointment) {
      // Actualizar el estado de la cita
      const updatedAppointments = appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: 'completed' as const, notes: consultationNotes }
          : apt
      );
      setAppointments(updatedAppointments);
      
      // Limpiar formulario
      setSelectedAppointment(null);
      setConsultationNotes('');
      setPrescription('');
      setVitalSigns({
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: '',
        oxygenSaturation: ''
      });
      
      // Mostrar confirmación
      alert('Consulta guardada exitosamente');
    }
  };

  const handleGeneratePrescription = () => {
    if (prescription.trim()) {
      // Simular generación de receta
      const prescriptionData = {
        doctor: currentDoctor?.name,
        patient: selectedAppointment?.patientName,
        date: new Date().toLocaleDateString('es-ES'),
        prescription: prescription,
        signature: `Dr. ${currentDoctor?.name} - ${currentDoctor?.specialty}`
      };
      
      console.log('Generando receta:', prescriptionData);
      alert('Receta generada y enviada al paciente');
    } else {
      alert('Por favor, escriba la prescripción médica');
    }
  };

  const handleGenerateReport = () => {
    if (selectedAppointment && consultationNotes.trim()) {
      // Simular generación de informe médico
      const reportData = {
        doctor: currentDoctor?.name,
        patient: selectedAppointment.patientName,
        date: new Date().toLocaleDateString('es-ES'),
        diagnosis: selectedAppointment.condition,
        notes: consultationNotes,
        vitalSigns: vitalSigns,
        recommendations: 'Seguimiento en 1 mes'
      };
      
      console.log('Generando informe médico:', reportData);
      alert('Informe médico generado exitosamente');
    } else {
      alert('Por favor, complete las notas de consulta');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      console.log('Archivos subidos:', fileNames);
      alert(`${fileNames.length} archivo(s) subido(s) exitosamente`);
    }
  };

  const handleRegisterPatient = () => {
    if (newPatient.name && newPatient.age && newPatient.phone) {
      console.log('Registrando nuevo paciente:', newPatient);
      alert('Paciente registrado exitosamente');
      setNewPatient({
        name: '',
        age: '',
        phone: '',
        email: '',
        condition: '',
        allergies: '',
        medicalHistory: ''
      });
      setShowNewPatientDialog(false);
    } else {
      alert('Por favor, complete los campos obligatorios');
    }
  };

  const handleScheduleAppointment = () => {
    if (newAppointment.patientName && newAppointment.date && newAppointment.time && newAppointment.type) {
      const appointment: Appointment = {
        id: Date.now().toString(),
        patientName: newAppointment.patientName,
        time: newAppointment.time,
        type: newAppointment.type,
        status: 'confirmed',
        duration: parseInt(newAppointment.duration),
        patientAge: 0, // Se actualizaría con datos reales
        patientPhone: '',
        patientEmail: '',
        condition: newAppointment.type
      };
      
      setAppointments([...appointments, appointment]);
      console.log('Programando nueva cita:', newAppointment);
      alert('Cita programada exitosamente');
      setNewAppointment({
        patientName: '',
        date: '',
        time: '',
        type: '',
        duration: '30'
      });
      setShowNewAppointmentDialog(false);
    } else {
      alert('Por favor, complete todos los campos');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard médico...</p>
        </div>
      </div>
    );
  }

  const recentPatients = getPatientsBySpecialty(currentDoctor.specialty);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${currentDoctor.color} flex items-center justify-center`}>
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentDoctor.name}</h1>
                <p className="text-sm text-gray-600">{currentDoctor.specialty}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800 hidden sm:inline-flex">
                {appointments.length} citas hoy
              </Badge>
              <ThemeToggleComponent />
              {/* Botón del asistente solo se muestra si está habilitado */}
              {isChatbotEnabled && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsChatbotOpen(true)}
                  className="hidden sm:inline-flex"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Asistente
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Citas Hoy</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{appointments.length}</p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pacientes</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{currentDoctor.patients}</p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Próxima</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {appointments.find(a => a.status === 'confirmed')?.time || 'N/A'}
                  </p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">
                    {appointments.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Agenda del día */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calendar className="w-5 h-5" />
                  <span className="hidden sm:inline">Agenda de Hoy - </span>
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    day: 'numeric',
                    month: 'short'
                  })}
                </CardTitle>
                <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Cita
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Programar Nueva Cita</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nombre del Paciente</Label>
                        <Input
                          value={newAppointment.patientName}
                          onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                          placeholder="Nombre completo del paciente"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Fecha</Label>
                          <Input
                            type="date"
                            value={newAppointment.date}
                            onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Hora</Label>
                          <Input
                            type="time"
                            value={newAppointment.time}
                            onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Tipo de Consulta</Label>
                        <Input
                          value={newAppointment.type}
                          onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                          placeholder="Ej: Consulta General, Control, Chequeo"
                        />
                      </div>
                      <div>
                        <Label>Duración (minutos)</Label>
                        <Input
                          type="number"
                          value={newAppointment.duration}
                          onChange={(e) => setNewAppointment({...newAppointment, duration: e.target.value})}
                          placeholder="30"
                        />
                      </div>
                      <Button onClick={handleScheduleAppointment} className="w-full">
                        <CalendarPlus className="w-4 h-4 mr-2" />
                        Programar Cita
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] sm:h-[500px]">
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div 
                        key={appointment.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-3 sm:space-y-0"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="text-center">
                            <p className="font-semibold text-lg">{appointment.time}</p>
                            <p className="text-xs text-gray-500">{appointment.duration}min</p>
                          </div>
                          <div className="flex-1 sm:flex-none">
                            <h4 className="font-semibold">{appointment.patientName}</h4>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                            <p className="text-xs text-gray-500">{appointment.patientAge} años</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                          <Badge className={`${getStatusColor(appointment.status)} text-xs justify-center`}>
                            {appointment.status === 'confirmed' ? 'Confirmada' :
                             appointment.status === 'completed' ? 'Completada' :
                             appointment.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                          </Badge>
                          
                          <div className="flex gap-1 justify-center sm:justify-start">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAttendPatient(appointment)}
                                  className="bg-blue-600 hover:bg-blue-700 text-xs px-2"
                                >
                                  <User className="w-3 h-3 mr-1" />
                                  Atender
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Consulta Médica - {appointment.patientName}</DialogTitle>
                                </DialogHeader>
                                
                                <Tabs defaultValue="consultation" className="w-full">
                                  <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="consultation">Consulta</TabsTrigger>
                                    <TabsTrigger value="history">Historial</TabsTrigger>
                                    <TabsTrigger value="prescription">Receta</TabsTrigger>
                                    <TabsTrigger value="communication">Comunicación</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="consultation" className="space-y-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                      <div>
                                        <Label>Información del Paciente</Label>
                                        <div className="p-3 bg-gray-50 rounded-md space-y-1">
                                          <p><strong>Nombre:</strong> {appointment.patientName}</p>
                                          <p><strong>Edad:</strong> {appointment.patientAge} años</p>
                                          <p><strong>Condición:</strong> {appointment.condition}</p>
                                          <p><strong>Teléfono:</strong> {appointment.patientPhone}</p>
                                          <p><strong>Email:</strong> {appointment.patientEmail}</p>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label>Signos Vitales</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                          <Input 
                                            placeholder="Presión arterial" 
                                            value={vitalSigns.bloodPressure}
                                            onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                                          />
                                          <Input 
                                            placeholder="Frecuencia cardíaca" 
                                            value={vitalSigns.heartRate}
                                            onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
                                          />
                                          <Input 
                                            placeholder="Temperatura" 
                                            value={vitalSigns.temperature}
                                            onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                                          />
                                          <Input 
                                            placeholder="Peso" 
                                            value={vitalSigns.weight}
                                            onChange={(e) => setVitalSigns({...vitalSigns, weight: e.target.value})}
                                          />
                                          <Input 
                                            placeholder="Altura" 
                                            value={vitalSigns.height}
                                            onChange={(e) => setVitalSigns({...vitalSigns, height: e.target.value})}
                                          />
                                          <Input 
                                            placeholder="Saturación O2" 
                                            value={vitalSigns.oxygenSaturation}
                                            onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label>Archivos Adjuntos</Label>
                                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                                        <input
                                          type="file"
                                          multiple
                                          onChange={handleFileUpload}
                                          className="hidden"
                                          id="file-upload"
                                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                          <span className="text-sm text-gray-600">Subir imágenes, RX, análisis</span>
                                          <span className="text-xs text-gray-400">PDF, JPG, PNG, DOC (máx. 10MB)</span>
                                        </label>
                                      </div>
                                      {appointment.attachments && appointment.attachments.length > 0 && (
                                        <div className="mt-2">
                                          <p className="text-sm font-medium">Archivos existentes:</p>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            {appointment.attachments.map((file, index) => (
                                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                                <Paperclip className="w-3 h-3" />
                                                {file}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <Label>Notas de Consulta</Label>
                                      <Textarea
                                        placeholder="Escriba las notas de la consulta, síntomas, diagnóstico..."
                                        value={consultationNotes}
                                        onChange={(e) => setConsultationNotes(e.target.value)}
                                        rows={6}
                                      />
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <Button onClick={handleSaveConsultation} className="bg-green-600 hover:bg-green-700">
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar Consulta
                                      </Button>
                                      <Button onClick={handleGenerateReport} variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Generar Informe
                                      </Button>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="history">
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold">Historial Médico Completo</h3>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                              <History className="w-4 h-4" />
                                              Historial Clínico
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm">{appointment.medicalHistory || 'No hay historial disponible'}</p>
                                          </CardContent>
                                        </Card>
                                        
                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-base text-red-700">Alergias</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm">{appointment.allergies || 'Ninguna conocida'}</p>
                                          </CardContent>
                                        </Card>
                                        
                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-base text-green-700">Medicamentos Actuales</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm">{appointment.medications || 'Ninguno'}</p>
                                          </CardContent>
                                        </Card>
                                        
                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-base text-blue-700">Notas Previas</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm">{appointment.notes || 'Sin notas adicionales'}</p>
                                          </CardContent>
                                        </Card>
                                      </div>
                                      
                                      {appointment.attachments && appointment.attachments.length > 0 && (
                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-base">Archivos del Paciente</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                              {appointment.attachments.map((file, index) => (
                                                <Button key={index} variant="outline" size="sm" className="justify-start">
                                                  {file.includes('.pdf') ? <FileText className="w-4 h-4 mr-2" /> : 
                                                   file.includes('.jpg') || file.includes('.png') ? <ImageIcon className="w-4 h-4 mr-2" /> :
                                                   <Paperclip className="w-4 h-4 mr-2" />}
                                                  <span className="truncate">{file}</span>
                                                </Button>
                                              ))}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="prescription">
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold">Receta Médica</h3>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Información del Paciente</Label>
                                          <div className="p-3 bg-gray-50 rounded-md text-sm">
                                            <p><strong>Paciente:</strong> {appointment.patientName}</p>
                                            <p><strong>Edad:</strong> {appointment.patientAge} años</p>
                                            <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                                            <p><strong>Médico:</strong> Dr. {currentDoctor.name}</p>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <Label>Alergias Conocidas</Label>
                                          <div className="p-3 bg-red-50 rounded-md text-sm">
                                            <p className="text-red-800">{appointment.allergies || 'Ninguna conocida'}</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label>Prescripción</Label>
                                        <Textarea
                                          placeholder="Escriba la prescripción médica detallada...&#10;Ejemplo:&#10;1. Paracetamol 500mg - 1 tableta cada 8 horas por 5 días&#10;2. Omeprazol 20mg - 1 cápsula en ayunas por 14 días&#10;3. Controles en 1 semana"
                                          value={prescription}
                                          onChange={(e) => setPrescription(e.target.value)}
                                          rows={10}
                                        />
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <Button onClick={handleGeneratePrescription} className="bg-green-600 hover:bg-green-700">
                                          <Download className="w-4 h-4 mr-2" />
                                          Generar Receta
                                        </Button>
                                        <Button variant="outline">
                                          <Printer className="w-4 h-4 mr-2" />
                                          Imprimir
                                        </Button>
                                        <Button variant="outline">
                                          <Send className="w-4 h-4 mr-2" />
                                          Enviar al Paciente
                                        </Button>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="communication">
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold">Comunicación con el Paciente</h3>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-base">Llamada Telefónica</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            {isCallActive ? (
                                              <div className="text-center space-y-4">
                                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                                  <Phone className="w-8 h-8 text-white" />
                                                </div>
                                                <p className="text-sm">Llamando a {selectedAppointment?.patientName}...</p>
                                                <p className="text-xs text-gray-600">{selectedAppointment?.patientPhone}</p>
                                                <Button 
                                                  onClick={handleEndCall}
                                                  variant="destructive"
                                                  size="sm"
                                                >
                                                  Colgar
                                                </Button>
                                              </div>
                                            ) : (
                                              <Button 
                                                onClick={() => handleStartCall(appointment)}
                                                className="w-full bg-green-600 hover:bg-green-700"
                                              >
                                                <Phone className="w-4 h-4 mr-2" />
                                                Llamar Paciente
                                              </Button>
                                            )}
                                          </CardContent>
                                        </Card>
                                        
                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-base">Videollamada</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            {isVideoCallActive ? (
                                              <div className="text-center space-y-4">
                                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                                  <Video className="w-8 h-8 text-white" />
                                                </div>
                                                <p className="text-sm">Videollamada con {selectedAppointment?.patientName}</p>
                                                <div className="bg-gray-900 rounded-lg p-4 text-white text-center">
                                                  <Video className="w-12 h-12 mx-auto mb-2" />
                                                  <p className="text-sm">Videollamada activa</p>
                                                </div>
                                                <Button 
                                                  onClick={handleEndCall}
                                                  variant="destructive"
                                                  size="sm"
                                                >
                                                  Finalizar
                                                </Button>
                                              </div>
                                            ) : (
                                              <Button 
                                                onClick={() => handleStartVideoCall(appointment)}
                                                className="w-full bg-blue-600 hover:bg-blue-700"
                                              >
                                                <Video className="w-4 h-4 mr-2" />
                                                Iniciar Videollamada
                                              </Button>
                                            )}
                                          </CardContent>
                                        </Card>
                                      </div>
                                      
                                      <Card>
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-base">Mensajes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                                            <div className="p-2 bg-blue-50 rounded-md">
                                              <p className="text-sm">Dr. {currentDoctor.name}: Recuerde tomar su medicamento</p>
                                              <p className="text-xs text-gray-500">Hace 2 horas</p>
                                            </div>
                                            <div className="p-2 bg-gray-50 rounded-md">
                                              <p className="text-sm">{appointment.patientName}: Gracias doctor, ya tomé la medicina</p>
                                              <p className="text-xs text-gray-500">Hace 1 hora</p>
                                            </div>
                                          </div>
                                          <div className="flex gap-2">
                                            <Input placeholder="Escribir mensaje..." className="flex-1 text-sm" />
                                            <Button size="sm">
                                              <Send className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStartCall(appointment)}
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStartVideoCall(appointment)}
                            >
                              <Video className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Pacientes recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Pacientes Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {recentPatients.map((patient) => (
                      <Dialog key={patient.id}>
                        <DialogTrigger asChild>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{patient.name}</h4>
                              <p className="text-xs text-gray-600">{patient.age} años • {patient.condition}</p>
                              <p className="text-xs text-gray-500">Última: {patient.lastVisit}</p>
                            </div>
                            <Badge className={`${getPriorityColor(patient.priority)} text-xs ml-2`}>
                              {patient.priority === 'high' ? 'Alta' :
                               patient.priority === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Historial de {patient.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Información Personal</Label>
                                <div className="p-3 bg-gray-50 rounded-md text-sm space-y-1">
                                  <p><strong>Edad:</strong> {patient.age} años</p>
                                  <p><strong>Teléfono:</strong> {patient.phone}</p>
                                  <p><strong>Email:</strong> {patient.email}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Estado Médico</Label>
                                <div className="p-3 bg-gray-50 rounded-md text-sm space-y-1">
                                  <p><strong>Condición:</strong> {patient.condition}</p>
                                  <p><strong>Prioridad:</strong> {patient.priority}</p>
                                  <p><strong>Última visita:</strong> {patient.lastVisit}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label>Historial Médico</Label>
                              <p className="text-sm p-3 bg-blue-50 rounded-md">{patient.medicalHistory}</p>
                            </div>
                            <div>
                              <Label>Alergias</Label>
                              <p className="text-sm p-3 bg-red-50 rounded-md">{patient.allergies}</p>
                            </div>
                            <div>
                              <Label>Medicamentos</Label>
                              <p className="text-sm p-3 bg-green-50 rounded-md">{patient.medications}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </ScrollArea>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Search className="w-4 h-4 mr-2" />
                  Ver Todos los Pacientes
                </Button>
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleGeneratePrescription}>
                  <FileText className="w-4 h-4 mr-2" />
                  Nueva Receta
                </Button>
                <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Programar Cita
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={showNewPatientDialog} onOpenChange={setShowNewPatientDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Registrar Paciente
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Nombre Completo *</Label>
                          <Input
                            value={newPatient.name}
                            onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                            placeholder="Nombre y apellidos"
                          />
                        </div>
                        <div>
                          <Label>Edad *</Label>
                          <Input
                            type="number"
                            value={newPatient.age}
                            onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                            placeholder="Edad en años"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Teléfono *</Label>
                          <Input
                            value={newPatient.phone}
                            onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                            placeholder="+1234567890"
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newPatient.email}
                            onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                            placeholder="email@ejemplo.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Condición/Motivo de Consulta</Label>
                        <Input
                          value={newPatient.condition}
                          onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                          placeholder="Ej: Chequeo general, Dolor de cabeza, etc."
                        />
                      </div>
                      <div>
                        <Label>Alergias Conocidas</Label>
                        <Input
                          value={newPatient.allergies}
                          onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                          placeholder="Ej: Penicilina, Ninguna, etc."
                        />
                      </div>
                      <div>
                        <Label>Historial Médico</Label>
                        <Textarea
                          value={newPatient.medicalHistory}
                          onChange={(e) => setNewPatient({...newPatient, medicalHistory: e.target.value})}
                          placeholder="Antecedentes médicos relevantes..."
                          rows={3}
                        />
                      </div>
                      <Button onClick={handleRegisterPatient} className="w-full">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Registrar Paciente
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* Botón del asistente virtual solo se muestra si está habilitado */}
                {isChatbotEnabled && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setIsChatbotOpen(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Asistente Virtual
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">Recordatorio</p>
                    <p className="text-xs text-blue-600">Próxima cita en 15 minutos</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-800">Resultado</p>
                    <p className="text-xs text-yellow-600">Análisis de María López disponible</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">Receta</p>
                    <p className="text-xs text-green-600">Receta enviada a Carlos Ruiz</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chatbot - Solo se renderiza si está habilitado */}
      {isChatbotEnabled && (
        <ChatbotMedico
          isOpen={isChatbotOpen}
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
          onClose={() => setIsChatbotOpen(false)}
        />
      )}

      {/* Botón flotante para chatbot en móvil - Solo si está habilitado */}
      {isChatbotEnabled && (
        <Button
          className="fixed bottom-4 left-4 z-40 sm:hidden bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 p-0"
          onClick={() => setIsChatbotOpen(true)}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default DoctorDashboard;