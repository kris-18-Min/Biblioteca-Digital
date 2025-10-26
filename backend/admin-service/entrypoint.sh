#!/bin/sh

echo "Configurando el servicio de administración..."

# Esperar a que RabbitMQ esté disponible
echo "Esperando a RabbitMQ..."
./wait-for-it.sh rabbitmq:5672 -t 60

if [ $? -ne 0 ]; then
    echo "Error: RabbitMQ no está disponible después de 60 segundos"
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p /app/logs

# Asignar permisos al directorio de logs
chmod 755 /app/logs

echo "Servicios listos. Iniciando aplicación..."
npm start