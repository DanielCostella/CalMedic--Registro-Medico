import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface RecetaData {
  medicoNombre: string;
  numeroColMedico: string;
  paciente: {
    nombres: string;
    apellidos: string;
    cedula: string;
    edad: number;
    telefono: string;
    email?: string;
  };
  diagnostico?: string;
  medicamentos: Array<{
    nombre: string;
    dosis: string;
    frecuencia?: string;
    duracion?: string;
    indicaciones?: string;
  }>;
  observaciones?: string;
}

export const generarPDFReceta = async (data: RecetaData): Promise<Blob> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Configurar fuentes
  pdf.setFont('helvetica');

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235); // blue-600
  pdf.text('RECETA MÉDICA', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Sistema EstiloLibre', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Línea separadora
  pdf.setDrawColor(37, 99, 235);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Información del Médico
  pdf.setFontSize(14);
  pdf.setTextColor(5, 150, 105); // green-600
  pdf.text('Información del Médico', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Nombre: ${data.medicoNombre}`, margin + 5, yPosition);
  yPosition += 5;
  pdf.text(`Colegio Médico: ${data.numeroColMedico}`, margin + 5, yPosition);
  yPosition += 5;
  pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, margin + 5, yPosition);
  yPosition += 15;

  // Información del Paciente
  pdf.setFontSize(14);
  pdf.setTextColor(124, 58, 237); // purple-600
  pdf.text('Información del Paciente', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Nombre: ${data.paciente.nombres} ${data.paciente.apellidos}`, margin + 5, yPosition);
  yPosition += 5;
  pdf.text(`Cédula: ${data.paciente.cedula}`, margin + 5, yPosition);
  yPosition += 5;
  pdf.text(`Edad: ${data.paciente.edad} años`, margin + 5, yPosition);
  yPosition += 5;
  pdf.text(`Teléfono: ${data.paciente.telefono}`, margin + 5, yPosition);
  yPosition += 15;

  // Diagnóstico
  if (data.diagnostico) {
    pdf.setFontSize(14);
    pdf.setTextColor(220, 38, 38); // red-600
    pdf.text('Diagnóstico', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const diagnosticoLines = pdf.splitTextToSize(data.diagnostico, pageWidth - 2 * margin - 10);
    pdf.text(diagnosticoLines, margin + 5, yPosition);
    yPosition += diagnosticoLines.length * 5 + 10;
  }

  // Medicamentos
  pdf.setFontSize(14);
  pdf.setTextColor(37, 99, 235); // blue-600
  pdf.text('Medicamentos Prescritos', margin, yPosition);
  yPosition += 10;

  data.medicamentos.forEach((medicamento, index) => {
    // Verificar si necesitamos una nueva página
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(12);
    pdf.setTextColor(30, 64, 175); // blue-800
    pdf.text(`${index + 1}. ${medicamento.nombre}`, margin + 5, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Dosis: ${medicamento.dosis}`, margin + 10, yPosition);
    yPosition += 5;

    if (medicamento.frecuencia) {
      pdf.text(`Frecuencia: ${medicamento.frecuencia}`, margin + 10, yPosition);
      yPosition += 5;
    }

    if (medicamento.duracion) {
      pdf.text(`Duración: ${medicamento.duracion}`, margin + 10, yPosition);
      yPosition += 5;
    }

    if (medicamento.indicaciones) {
      const indicacionesLines = pdf.splitTextToSize(`Indicaciones: ${medicamento.indicaciones}`, pageWidth - 2 * margin - 20);
      pdf.text(indicacionesLines, margin + 10, yPosition);
      yPosition += indicacionesLines.length * 5;
    }

    yPosition += 8;
  });

  // Observaciones
  if (data.observaciones) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(120, 53, 15); // amber-800
    pdf.text('Observaciones', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const observacionesLines = pdf.splitTextToSize(data.observaciones, pageWidth - 2 * margin - 10);
    pdf.text(observacionesLines, margin + 5, yPosition);
    yPosition += observacionesLines.length * 5 + 15;
  }

  // Firma
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = margin;
  }

  yPosition = Math.max(yPosition, pageHeight - 60);
  
  // Línea para firma
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.3);
  const signatureLineStart = pageWidth / 2 - 40;
  const signatureLineEnd = pageWidth / 2 + 40;
  pdf.line(signatureLineStart, yPosition, signatureLineEnd, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Firma del Médico', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Esta receta fue generada electrónicamente por el Sistema EstiloLibre', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 4;
  pdf.text(`Fecha de emisión: ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' });

  return pdf.output('blob');
};

export const enviarRecetaPorEmail = async (recetaData: RecetaData, emailDestino: string): Promise<boolean> => {
  try {
    // Generar PDF
    const pdfBlob = await generarPDFReceta(recetaData);
    
    // En una implementación real, aquí se enviaría el email usando un servicio como:
    // - EmailJS (frontend)
    // - API backend con nodemailer
    // - Servicio de email como SendGrid, AWS SES, etc.
    
    // Simulación del envío
    console.log('Enviando receta por email a:', emailDestino);
    console.log('PDF generado:', pdfBlob.size, 'bytes');
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular éxito/fallo (90% éxito)
    if (Math.random() > 0.1) {
      return true;
    } else {
      throw new Error('Error simulado en el envío');
    }
    
  } catch (error) {
    console.error('Error enviando receta por email:', error);
    return false;
  }
};

export const descargarPDFReceta = async (recetaData: RecetaData, nombreArchivo?: string): Promise<void> => {
  try {
    const pdfBlob = await generarPDFReceta(recetaData);
    
    // Crear URL temporal para descarga
    const url = URL.createObjectURL(pdfBlob);
    
    // Crear elemento de descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo || `receta_${recetaData.paciente.nombres}_${recetaData.paciente.apellidos}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Ejecutar descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL temporal
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error descargando PDF:', error);
    throw error;
  }
};