import express from 'express';
import { readData, writeData } from '../src/utils/fileOperations.js';
import { generateEmployeePDF } from '../src/utils/pdfGenerator.js';
import Joi from 'joi';
import fs from 'fs';
import dayjs from 'dayjs';
import { fileURLToPath } from 'url';
import path from 'path';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const employeeFileRouter = express.Router();

// Esquema de validación para los empleados
const employeeSchema = Joi.object({
    codigo_empleado: Joi.string().required(),
    name: Joi.string().required(),
    Departamento: Joi.string().required(),
    Posicion: Joi.string().required(),
    Salario: Joi.number().required(),
    Fecha_Ingreso: Joi.date().required(),
    Activo: Joi.boolean().required()
});

// Obtener todos los empleados con filtros y límite
employeeFileRouter.get('/employees', (req, res) => {
    let employees = readData();
    const { filterKey, filterValue, limit } = req.query;

    if (filterKey && filterValue) {
        employees = employees.filter(emp => emp[filterKey] && emp[filterKey] === filterValue);
    }

    if (limit) {
        employees = employees.slice(0, parseInt(limit));
    }

    res.json(employees);
});


// Obtener empleado por código y generar PDF
employeeFileRouter.get('/employee/:codigo_empleado', (req, res) => {
    const { codigo_empleado } = req.params;
    const employees = readData();
    const employee = employees.find(emp => emp.codigo_empleado === codigo_empleado);

    if (employee) {
        const pdfFilePath = generateEmployeePDF(employee);
        res.send({
            message: 'PDF generado con éxito',
            pdfPath: pdfFilePath,
            employee
        });
    } else {
        res.status(404).send({ message: 'Empleado no encontrado' });
    }
});

// Agregar nuevo empleado
employeeFileRouter.post('/employees', (req, res) => {
    const { error } = employeeSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const employees = readData();
    const nuevoEmpleado = { id: employees.length + 1, ...req.body };
    employees.push(nuevoEmpleado);
    writeData(employees);
    res.status(201).json(nuevoEmpleado);
});

// Actualizar empleado por código
employeeFileRouter.put('/employees/:codigo_empleado', (req, res) => {
    const { error } = employeeSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const employees = readData();
    const employeeIndex = employees.findIndex(e => e.codigo_empleado === req.params.codigo_empleado);
    if (employeeIndex === -1) return res.status(404).send('Empleado no encontrado');

    employees[employeeIndex] = { ...employees[employeeIndex], ...req.body };
    writeData(employees);
    res.json(employees[employeeIndex]);
});

// Actualizar campo para todos los empleados
employeeFileRouter.put('/employees/update-field', (req, res) => {
    const { field, value } = req.body;
    if (!field || value === undefined) return res.status(400).send('Debe especificar campo y valor a actualizar');

    const employees = readData();
    const updatedEmployees = employees.map(emp => {
        emp[field] = value;
        emp.updated_at = dayjs().format('HH:mm DD-MM-YYYY');
        return emp;
    });

    writeData(updatedEmployees);
    res.json({
        message: `El campo "${field}" ha sido actualizado para todos los empleados.`,
        employees: updatedEmployees
    });
});

// Eliminar empleado por código
employeeFileRouter.delete('/employees/:codigo_empleado', (req, res) => {
    const employees = readData();
    const employeeIndex = employees.findIndex(e => e.codigo_empleado === req.params.codigo_empleado);
    if (employeeIndex === -1) return res.status(404).send('Empleado no encontrado');

    employees.splice(employeeIndex, 1);
    writeData(employees);
    res.status(200).send({ message: 'Registro eliminado satisfactoriamente' });
});

// Generar PDF de empleado
employeeFileRouter.get('/employees/:codigo_empleado/pdf', (req, res) => {
    const employees = readData();
    const employee = employees.find(e => e.codigo_empleado === req.params.codigo_empleado);
    if (!employee) return res.status(404).send('Empleado no encontrado');

    const pdfPath = generateEmployeePDF(employee);
    if (!fs.existsSync(pdfPath)) return res.status(500).send('Error al generar el PDF');

    res.download(pdfPath, `employee_${employee.codigo_empleado}.pdf`, (err) => {
        if (err) return res.status(500).send('Error al descargar el PDF');
        fs.unlink(pdfPath, err => { if (err) console.error('Error al eliminar el PDF', err); });
    });
});

// Endpoint de prueba
employeeFileRouter.get('/test', (req, res) => {
    res.send('¡El endpoint está funcionando!');
});

export default employeeFileRouter;
