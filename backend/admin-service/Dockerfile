FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copiar el script
COPY entrypoint.sh /entrypoint.sh

# Dar permisos correctos (forma más simple)
RUN chmod +x /entrypoint.sh

# Ejecutar script como CMD
CMD ["/entrypoint.sh"]