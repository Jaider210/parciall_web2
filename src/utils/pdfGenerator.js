import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateEmployeePDF = (employee) => {
    const doc = new PDFDocument();
    const pdfDir = path.join(__dirname, "../../pdfs");  // Ajustar ruta relativa

    // Crear carpeta "pdfs" si no existe
    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir);
    }

    const filePath = path.join(pdfDir, `employee_${employee.codigo_empleado}.pdf`);

    // Guardar PDF en el disco
    doc.pipe(fs.createWriteStream(filePath));

    // Añadir contenido al PDF
    doc.fontSize(25).text('Detalles del Empleado', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Código Empleado: ${employee.codigo_empleado}`);
    doc.text(`Nombre: ${employee.name}`);
    doc.text(`Departamento: ${employee.Departamento}`);
    doc.text(`Posición: ${employee.Posicion}`);
    doc.text(`Salario: ${employee.Salario}`);
    doc.text(`Fecha de Ingreso: ${employee.Fecha_Ingreso}`);
    doc.text(`Activo: ${employee.Activo ? 'Sí' : 'No'}`);

    // Finalizar documento
    doc.end();

    return filePath;
};
