import fs from 'fs';
import dayjs from 'dayjs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../../access_log.txt');  // Ajustar ruta relativa

const accessLogMiddleware = (req, res, next) => {
    const logMessage = `${dayjs().format('DD-MM-YYYY HH:mm:ss')} [${req.method}] ${req.path} ${JSON.stringify(req.headers)}\n`;
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
    next();
};

export default accessLogMiddleware;
