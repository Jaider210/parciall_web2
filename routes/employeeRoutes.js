import express from "express";
import employeeFileRouter from "./employee.file.router.js";

const router = express.Router();

export function routerEmployees(app) {
    // Aquí se especifica el prefijo para las rutas
    app.use("/api/v1", router);
    // Rutas para empleados
    router.use("/file/employees", employeeFileRouter);
}