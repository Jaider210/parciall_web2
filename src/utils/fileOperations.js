import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../../data.json");  // Ajustar ruta relativa

export function readData() {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        if (fileContent) {
            return JSON.parse(fileContent);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error reading file', error);
        return [];
    }
}

export function writeData(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing file', error);
    }
}
