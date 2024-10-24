import express from 'express';
import { routerEmployees } from './routes/employeeRoutes.js';  // Importación nombrada
import timestampMiddleware from './src/middlewares/timestampMiddleware.js';
import accessLogMiddleware from './src/middlewares/accessLogMiddleware.js';

const app = express();

app.use(express.json());
app.use(timestampMiddleware);
app.use(accessLogMiddleware);

routerEmployees(app);  // Usar la función routerEmployees

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
