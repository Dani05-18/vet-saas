# SaaS Multitenant - Veterinaria

## 1. Descripción del Proyecto y Nicho
Plataforma SaaS Multitenant diseñada para el nicho de clínicas y hospitales veterinarios. Permite la administración integral de pacientes (mascotas), propietarios (clientes), historiales clínicos, consultas y citas, garantizando el aislamiento estricto y la privacidad de la información de cada veterinaria mediante esquemas independientes en base de datos.

## 2. Arquitectura Multitenant (Schema por Tenant)

## 3. Instrucciones de Ejecución (Docker)
Para iniciar y administrar el servicio de base de datos PostgreSQL (v16 Alpine) mediante Docker Compose:

```bash
# Levantar el contenedor de PostgreSQL en segundo plano
docker compose up -d

# Detener el contenedor de PostgreSQL
docker compose down

# Ver el estado y salud del contenedor
docker compose ps
```

## 4. Resolución del Tenant

## 5. Estrategias de Robustez (Idempotencia y Rate Limiting)

## 6. Estrategias de Renderizado (Next.js)
