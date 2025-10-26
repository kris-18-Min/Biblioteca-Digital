#!/bin/sh

echo "Configurando el servicio de usuarios..."

# Esperar a que PostgreSQL esté disponible
echo "Esperando a PostgreSQL..."
./wait-for-it.sh postgres:5432 -t 60

if [ $? -ne 0 ]; then
    echo "Error: PostgreSQL no está disponible después de 60 segundos"
    exit 1
fi

# Esperar a que RabbitMQ esté disponible
echo "Esperando a RabbitMQ..."
./wait-for-it.sh rabbitmq:5672 -t 60

if [ $? -ne 0 ]; then
    echo "Error: RabbitMQ no está disponible después de 60 segundos"
    exit 1
fi

echo "Verificando la base de datos..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
    echo "PostgreSQL todavía no está listo - esperando..."
    sleep 2
done

echo "Servicios de base de datos listos. Iniciando aplicación..."
npm start