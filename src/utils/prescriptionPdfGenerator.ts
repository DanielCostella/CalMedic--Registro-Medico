import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PrescriptionData {
    doctorName: string;
    medicalLicenseNumber: string;
    patient: {
        firstName: string;
        lastName: string;
        idNumber: string;
        age: number;
        phone: string;
        email?: string;
    };
    diagnosis?: string;
    medications: Array<{
        name: string;
        dosage: string;
        frequency?: string;
        duration?: string;
        instructions?: string;
    }>;
    observations?: string;
}

export const generatePrescriptionPDF = async (data: PrescriptionData): Promise<Blob> => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Set fonts
    pdf.setFont('helvetica');

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(37, 99, 235); // blue-600
    pdf.text('MEDICAL PRESCRIPTION', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('EstiloLibre System', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Separator line
    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Doctor Information
    pdf.setFontSize(14);
    pdf.setTextColor(5, 150, 105); // green-600
    pdf.text('Doctor Information', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Name: ${data.doctorName}`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`Medical License: ${data.medicalLicenseNumber}`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`Date: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`, margin + 5, yPosition);
    yPosition += 15;

    // Patient Information
    pdf.setFontSize(14);
    pdf.setTextColor(124, 58, 237); // purple-600
    pdf.text('Patient Information', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Name: ${data.patient.firstName} ${data.patient.lastName}`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`ID Number: ${data.patient.idNumber}`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`Age: ${data.patient.age} years`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`Phone: ${data.patient.phone}`, margin + 5, yPosition);
    yPosition += 15;

    // Diagnosis
    if (data.diagnosis) {
        pdf.setFontSize(14);
        pdf.setTextColor(220, 38, 38); // red-600
        pdf.text('Diagnosis', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const diagnosisLines = pdf.splitTextToSize(data.diagnosis, pageWidth - 2 * margin - 10);
        pdf.text(diagnosisLines, margin + 5, yPosition);
        yPosition += diagnosisLines.length * 5 + 10;
    }

    // Medications
    pdf.setFontSize(14);
    pdf.setTextColor(37, 99, 235); // blue-600
    pdf.text('Prescribed Medications', margin, yPosition);
    yPosition += 10;

    data.medications.forEach((medication, index) => {
        // Check if new page is needed
        if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(30, 64, 175); // blue-800
        pdf.text(`${index + 1}. ${medication.name}`, margin + 5, yPosition);
        yPosition += 7;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Dosage: ${medication.dosage}`, margin + 10, yPosition);
        yPosition += 5;

        if (medication.frequency) {
            pdf.text(`Frequency: ${medication.frequency}`, margin + 10, yPosition);
            yPosition += 5;
        }

        if (medication.duration) {
            pdf.text(`Duration: ${medication.duration}`, margin + 10, yPosition);
            yPosition += 5;
        }

        if (medication.instructions) {
            const instructionLines = pdf.splitTextToSize(`Instructions: ${medication.instructions}`, pageWidth - 2 * margin - 20);
            pdf.text(instructionLines, margin + 10, yPosition);
            yPosition += instructionLines.length * 5;
        }

        yPosition += 8;
    });

    // Observations
    if (data.observations) {
        if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(120, 53, 15); // amber-800
        pdf.text('Observations', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const observationLines = pdf.splitTextToSize(data.observations, pageWidth - 2 * margin - 10);
        pdf.text(observationLines, margin + 5, yPosition);
        yPosition += observationLines.length * 5 + 15;
    }

    // Signature
    if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
    }

    yPosition = Math.max(yPosition, pageHeight - 60);

    // Signature line
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.3);
    const signatureLineStart = pageWidth / 2 - 40;
    const signatureLineEnd = pageWidth / 2 + 40;
    pdf.line(signatureLineStart, yPosition, signatureLineEnd, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Doctor\'s Signature', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('This prescription was generated electronically by the EstiloLibre System', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 4;
    pdf.text(`Issue date: ${new Date().toLocaleString('en-US')}`, pageWidth / 2, yPosition, { align: 'center' });

    return pdf.output('blob');
};

export const sendPrescriptionByEmail = async (prescriptionData: PrescriptionData, targetEmail: string): Promise<boolean> => {
    try {
        // Generate PDF
        const pdfBlob = await generatePrescriptionPDF(prescriptionData);

        // In a real implementation, email would be sent using a service like:
        // - EmailJS (frontend)
        // - Backend API with nodemailer
        // - Email service like SendGrid, AWS SES, etc.

        // Simulation of sending
        console.log('Sending prescription by email to:', targetEmail);
        console.log('Generated PDF:', pdfBlob.size, 'bytes');

        // Simulate sending delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success/failure (90% success)
        if (Math.random() > 0.1) {
            return true;
        } else {
            throw new Error('Simulated sending error');
        }

    } catch (error) {
        console.error('Error sending prescription by email:', error);
        return false;
    }
};

export const downloadPrescriptionPDF = async (prescriptionData: PrescriptionData, filename?: string): Promise<void> => {
    try {
        const pdfBlob = await generatePrescriptionPDF(prescriptionData);

        // Create temporary URL for download
        const url = URL.createObjectURL(pdfBlob);

        // Create download element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `prescription_${prescriptionData.patient.firstName}_${prescriptionData.patient.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;

        // Execute download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up temporary URL
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
    }
};
