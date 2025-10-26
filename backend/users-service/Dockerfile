FROM node:18-alpine

# Instalar dependencias necesarias
RUN apk add --no-cache bash bind-tools netcat-openbsd postgresql-client

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de archivos
COPY . .
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Script para iniciar el servicio
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

# Esperar a PostgreSQL y RabbitMQ antes de iniciar
CMD ["./entrypoint.sh"]
