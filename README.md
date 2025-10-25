# Biblioteca Digital — Arquitectura Hexagonal con RabbitMQ

Proyecto ejemplo profesional para la materia de Taller de Desarrollo: sistema de gestión de biblioteca digital.
Stack: Node.js, Express, PostgreSQL, RabbitMQ, React + Vite, Docker.

## Características
- Microservicios con separación de dominio, puertos y adaptadores.
- Mensajería basada en RabbitMQ (eventos durables).
- Autenticación con JWT y bcrypt.
- CRUD para libros (frontend + backend).
- Interfaz moderna y responsiva.
- Documentación base en Overleaf.

## Levantar con Docker (recomendado)
1. `docker-compose up --build`
2. Abrir frontend: `http://localhost:5173`
3. RabbitMQ management: `http://localhost:15672` (user:guest, pass:guest)
4. Admin audit logs: `http://localhost:3002/audit/recent`

## Estructura
- backend/users-service: servicio principal (usuarios + libros)
- backend/admin-service: consumidor de eventos (auditoría)
- frontend: React + Vite app
- overleaf: plantilla para la documentación



Frontend: ahora está configurado para usar Vite 5 y @vitejs/plugin-react@5. En Docker se instala con --legacy-peer-deps para evitar conflictos.
