#!/bin/sh
set -e

# Esperar a RabbitMQ
./wait-for-it.sh rabbitmq:5672 --timeout=30

# Esperar a PostgreSQL
./wait-for-it.sh postgres:5432 --timeout=30

# Iniciar la app
npm start