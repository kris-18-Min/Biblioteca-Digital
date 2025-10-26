FROM node:18-alpine

# Instalar dependencias necesarias
RUN apk add --no-cache bash bind-tools netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Esperar a PostgreSQL antes de iniciar
CMD ["sh", "-c", "./wait-for-it.sh postgres:5432 -- npm start"]
