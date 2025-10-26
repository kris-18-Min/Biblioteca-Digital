import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuditConsumer } from './rabbit/consumer.js';
import fs from 'fs';
import path from 'path';

dotenv.config();
const app = express();

// Habilitar CORS
app.use(cors());
app.use(express.json());

// Crear directorio de logs si no existe
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

// Función para intentar conectar a RabbitMQ
const connectWithRetry = async () => {
  const maxRetries = 20; // Aumentamos el número de intentos
  let retries = 0;
  let consumer;
  
  while (retries < maxRetries) {
    try {
      console.log('⏳ Intentando conectar a RabbitMQ...');
      consumer = new AuditConsumer(rabbitUrl);
      await consumer.start();
      console.log('✅ Conectado exitosamente a RabbitMQ');
      
      // Verificar que el directorio de logs existe
      if (!fs.existsSync(logsDir)) {
        console.log('📁 Creando directorio de logs...');
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      // Crear archivo de logs si no existe
      const logFile = path.join(logsDir, 'audit.log');
      if (!fs.existsSync(logFile)) {
        console.log('📄 Creando archivo de logs...');
        fs.writeFileSync(logFile, '');
      }
      
      return consumer;
    } catch (err) {
      retries++;
      console.log(`❌ Intento ${retries}/${maxRetries} fallido:`, err.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  throw new Error('No se pudo conectar a RabbitMQ después de varios intentos');
};

await connectWithRetry();

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    service: 'Admin Service',
    endpoints: {
      health: '/health',
      audit: '/audit/recent'
    }
  });
});

app.get('/health', (req,res) => res.json({ ok: true }));

// endpoint to read recent audit logs
app.get('/audit/recent', (req, res) => {
  try {
    const logPath = path.join(logsDir, 'audit.log');
    
    // Asegurar que el archivo existe
    if (!fs.existsSync(logPath)) {
      console.log('📄 Creando nuevo archivo de logs...');
      fs.writeFileSync(logPath, '');
      return res.json({ 
        entries: [],
        message: 'No hay entradas de auditoría aún'
      });
    }
    
    // Leer y procesar los logs
    console.log('📖 Leyendo logs de auditoría...');
    const data = fs.readFileSync(logPath, 'utf-8').trim();
    const entries = data 
      ? data.split('\n')
          .filter(line => line.trim()) // Filtrar líneas vacías
          .reverse()
          .slice(0, 50)
          .map(entry => {
            try {
              return JSON.parse(entry);
            } catch {
              return { raw: entry, timestamp: new Date().toISOString() };
            }
          })
      : [];
    
    res.json({ 
      entries,
      count: entries.length,
      message: entries.length ? 'Logs recuperados exitosamente' : 'No hay entradas de auditoría aún'
    });
  } catch (err) {
    console.error('❌ Error leyendo logs de auditoría:', err);
    res.status(500).json({ 
      error: err.message,
      message: 'Error al leer los logs de auditoría'
    });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log('Admin service listening on', port));
