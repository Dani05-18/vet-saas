# 📖 Diario de Desarrollo del Proyecto: SaaS Multitenant para Veterinarias

Bienvenido al diario de arquitectura y desarrollo de la plataforma SaaS Multitenant especializada en clínicas veterinarias. Este documento actúa como la fuente única de verdad (Single Source of Truth), guía de estudio y memoria técnica para desarrolladores y agentes de IA.

---

## 📌 Resumen Arquitectónico Global

- **Framework**: Next.js 15+ (App Router, Server Actions, React Server Components).
- **Lenguaje**: TypeScript (Strict Mode).
- **Estilos**: Tailwind CSS.
- **Base de Datos**: PostgreSQL 16 (Contenerizada con Docker Compose).
- **ORM**: Prisma ORM con soporte nativo para `multiSchema`.
- **Estrategia Multitenant**:
  - **Schema `public` (Global)**: Almacén central de tenants (veterinarias), credenciales globales de usuarios, suscripciones y membresías.
  - **Schemas Aislados (`tenant_<slug>`)**: Cada veterinaria cuenta con su propio schema PostgreSQL independiente con sus entidades de negocio (Mascotas, Propietarios, Consultas, Inventario, Vacunas).
  - **Aislamiento en Runtime**: Enrutamiento y resolución de tenant en `middleware.ts` (subdominio/headers) y fijación dinámica de `search_path` o conexión a schema en la base de datos por petición.

---

## 🗓️ Bitácora de Pasos

### Paso 1: Configuración Inicial, Docker, Variables de Entorno y Modelado Multi-Schema (Día 1)

#### 1. ¿Qué hicimos?
1. **Definición de la Estrategia Multitenancy**: Se evaluó y seleccionó el modelo de *Base de Datos Compartida con Schema Aislado por Tenant*, garantizando el balance perfecto entre aislamiento físico-lógico de datos de mascotas/clientes y eficiencia en costos de infraestructura.
2. **Creación del Diario de Proyecto (`diario_proyecto.md`)**: Inicializado como primera acción obligatoria antes de cualquier línea de código de negocio.
3. **Contenerización de Base de Datos (`docker-compose.yml`)**: Configuración de PostgreSQL 16 Alpine con volumen persistente y verificación de salud (*healthcheck*).
4. **Gestión de Entorno (`.env` y `.env.example`)**: Parametrización de la cadena de conexión de PostgreSQL para Prisma, configuraciones de servidor y dominios de tenant.
5. **Modelado Global en Prisma (`prisma/schema.prisma`)**: Habilitación del feature preview `multiSchema` y modelado de las entidades centrales `Tenant`, `User` y `TenantUser` dentro del schema `public`.
6. **Estructura Base del Proyecto Next.js**: Andamiaje con TypeScript, Tailwind CSS y App Router en `src/`.

#### 2. Comandos Relevantes
- **Inicialización de Next.js**:
  ```bash
  npx create-next-app@latest vet-saas --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
  ```
- **Instalación de Prisma ORM y Cliente**:
  ```bash
  npm install prisma --save-dev
  npm install @prisma/client
  ```
- **Inicialización de Prisma**:
  ```bash
  npx prisma init
  ```
- **Levantamiento del contenedor PostgreSQL**:
  ```bash
  docker compose up -d
  ```

#### 3. Archivos Clave Creados y Justificación Arquitectónica

| Archivo | Propósito / Justificación Arquitectónica |
| :--- | :--- |
| `diario_proyecto.md` | Memoria técnica viva y registro histórico de decisiones de ingeniería y comandos. |
| `docker-compose.yml` | Despliegue reproducible y aislado de PostgreSQL 16 Alpine en desarrollo local, evitando dependencias del sistema operativo anfitrión. |
| `.env` y `.env.example` | Separación estricta de credenciales y configuración del código fuente (12-Factor App methodology). |
| `prisma/schema.prisma` | Definición de fuentes de datos con `previewFeatures = ["multiSchema"]`. Mapeo de `Tenant` y `User` al schema `public` con `@@schema("public")`. |
| `package.json` | Configuración de scripts de ciclo de vida (`dev`, `build`, `docker:up`, `prisma:generate`). |
| `tsconfig.json` | Reglas estrictas de compilación TypeScript y resolución de rutas alias `@/*`. |
| `src/app/layout.tsx` & `page.tsx` | Punto de entrada del App Router con Server Components. |

---

### Paso 2: Ejecución de Dependencias, Ajuste de Peer Dependencies y Generación de Prisma Client

#### 1. ¿Qué hicimos?
1. **Instalación de Dependencias**: Ejecución de `npm install` en el proyecto raíz, resolviendo de forma limpia las versiones compatibles de Next.js (`^15.0.0`), React 19 y Prisma ORM.
2. **Generación de Prisma Client Multi-Schema**: Ejecución de `npx prisma generate`, compilando los tipos en TypeScript para el schema `public` con los modelos `Tenant`, `User` y `TenantUser`.
3. **Diagnóstico del Servicio Docker**: Intento de despliegue del contenedor de PostgreSQL con `docker compose up -d`. Se detectó que el demonio de Docker Desktop requiere inicialización manual desde el entorno de escritorio de Windows.

#### 2. Comandos Ejecutados
- **Instalación de paquetes de Node.js**:
  ```bash
  npm install
  ```
- **Compilación del cliente Prisma**:
  ```bash
  npx prisma generate
  ```
- **Intento de arranque de contenedor**:
  ```bash
  docker compose up -d
  ```

#### 3. Archivos Modificados / Creados
| Archivo | Propósito / Justificación Arquitectónica |
| :--- | :--- |
| `package.json` | Ajuste de compatibilidad estricta de peer dependencies entre Next.js 15 y React 19. |
| `node_modules/@prisma/client` | Generación del cliente tipado de Prisma listo para operaciones con soporte multi-schema. |
| `diario_proyecto.md` | Actualización obligatoria con la bitácora del Paso 2. |

---

### Paso 3: Limpieza de Contenedores Conflictivos, Despliegue de PostgreSQL y Sincronización Multi-Schema

#### 1. ¿Qué hicimos?
1. **Liberación de Puertos**: Eliminación de los contenedores obsoletos (`app_backend_db` y `app_backend_api`), liberando el puerto `5432` y evitando conflictos de red.
2. **Despliegue del Contenedor PostgreSQL (`vet_saas_postgres`)**: Arranque exitoso de PostgreSQL 16 Alpine mediante `docker compose up -d` con volumen persistente `vet-saas_postgres_data`.
3. **Sincronización del Schema en Base de Datos**: Ejecución de `npx prisma db push`. Prisma creó físicamente los schemas `public` y `tenant` en PostgreSQL, así como las tablas iniciales `tenants`, `users` y `tenant_users`.
4. **Verificación Directa en Base de Datos**: Inspección vía `psql` confirmando la existencia de los dos schemas y las tres tablas en el schema `public`.
5. **Cliente Singleton de Prisma (`src/lib/prisma.ts`)**: Implementación del patrón singleton en `globalThis` para evitar saturación del pool de conexiones durante el Hot Reloading / Fast Refresh en desarrollo.
6. **Verificación de Compilación Next.js (`npm run build`)**: Construcción limpia del proyecto en modo de producción, validando TypeScript estricto, generación de páginas estáticas y configuración de Tailwind CSS con cero errores.

#### 2. Comandos Ejecutados
- **Eliminación de contenedores anteriores**:
  ```bash
  docker rm -f app_backend_db app_backend_api
  ```
- **Levantamiento del contenedor PostgreSQL**:
  ```bash
  docker compose up -d
  ```
- **Sincronización del modelo Prisma con PostgreSQL**:
  ```bash
  npx prisma db push
  ```
- **Inspección de base de datos con psql**:
  ```bash
  docker exec -i vet_saas_postgres psql -U postgres -d vet_saas_db -c "\dn"
  docker exec -i vet_saas_postgres psql -U postgres -d vet_saas_db -c "\dt public.*"
  ```
- **Prueba de compilación de producción de Next.js**:
  ```bash
  npm run build
  ```

#### 3. Archivos Clave Creados / Modificados
| Archivo | Propósito / Justificación Arquitectónica |
| :--- | :--- |
| `src/lib/prisma.ts` | Patrón Singleton para `PrismaClient` evitando múltiples conexiones abiertas por Hot Reloading en Next.js. |
| `diario_proyecto.md` | Actualización obligatoria de la bitácora de arquitectura con el Paso 3. |

---

### Paso 4: Ajuste a Schemas Dinámicos, Control de Versiones con Git y Documentación Base

#### 1. ¿Qué hicimos?
1. **Ajuste de Multi-Schema en Prisma**: Modificación de `prisma/schema.prisma` para restringir el bloque `datasource db` a `schemas = ["public"]`. Se formaliza la decisión de arquitectura en la cual Prisma gestiona exclusivamente el schema maestro (`public`), mientras que los schemas de cada veterinaria (`tenant_<slug>`) se crearán y manipularán dinámicamente en tiempo de ejecución con scripts SQL puros (DDL).
2. **Regeneración de Prisma Client**: Ejecución de `npx prisma generate` para sincronizar los tipos del cliente con el nuevo alcance de schemas.
3. **Inicialización de Git y Blindaje de Seguridad**: Ejecución de `git init` y actualización de `.gitignore` para garantizar la exclusión absoluta de variables de entorno privadas (`.env`) y directorios de persistencia de Docker (`postgres_data/`).
4. **Estructura Documental (`README.md`)**: Creación del archivo de bienvenida técnica con las 6 secciones obligatorias, completando la descripción del nicho veterinario y las instrucciones de operación del contenedor PostgreSQL.
5. **Commit Inicial del Repositorio**: Agrupación en stage y creación del primer commit histórico del proyecto.

#### 2. Comandos Ejecutados
- **Regeneración del cliente Prisma**:
  ```bash
  npx prisma generate
  ```
- **Inicialización de Git y preparación de archivos**:
  ```bash
  git init
  git add .
  ```
- **Commit inicial del repositorio**:
  ```bash
  git commit -m "chore: initial setup with Next.js, Docker and Prisma multitenant"
  ```

#### 3. Archivos Clave Creados / Modificados
| Archivo | Propósito / Justificación Arquitectónica |
| :--- | :--- |
| `prisma/schema.prisma` | Reducción del scope estático a `schemas = ["public"]` para habilitar creación dinámica de schemas en runtime. |
| `.gitignore` | Exclusión estricta de `.env` y directorios de datos de Docker para evitar filtración de credenciales. |
| `README.md` | Guía de referencia y documentación técnica inicial del proyecto y su arquitectura. |
| `diario_proyecto.md` | Bitácora actualizada con el registro del Paso 4. |

---

### Paso 5: Vinculación y Publicación en GitHub

#### 1. ¿Qué hicimos?
1. **Estandarización de Rama**: Renombrado de la rama raíz a `main` (`git branch -M main`), alineándola con las convenciones estándar de GitHub.
2. **Asignación del Repositorio Remoto**: Vinculación de la URL remota oficial (`https://github.com/Dani05-18/vet-saas.git`) como origen (`origin`).
3. **Publicación y Rastreo (`git push`)**: Despliegue de los commits locales hacia la rama remota `origin/main` configurando upstream tracking.
4. **Verificación de Integridad Remota**: El repositorio ya es accesible públicamente/privadamente en GitHub con todos los archivos base, documentación y exclusión de secretos.

#### 2. Comandos Ejecutados
- **Renombrar rama a main**:
  ```bash
  git branch -M main
  ```
- **Conectar con GitHub**:
  ```bash
  git remote add origin https://github.com/Dani05-18/vet-saas.git
  ```
- **Publicar en GitHub**:
  ```bash
  git push -u origin main
  ```

#### 3. Archivos Clave Creados / Modificados
| Archivo | Propósito / Justificación Arquitectónica |
| :--- | :--- |
| `diario_proyecto.md` | Actualización obligatoria de la bitácora con el registro del Paso 5. |

---

### Paso 6: Migración Inicial Versionada y Verificación con Prisma Studio

#### 1. ¿Qué hicimos?
1. **Verificación de Conectividad en `.env`**: Confirmación de que `DATABASE_URL` apunta correctamente al contenedor local de PostgreSQL (`postgresql://postgres:postgres_password@localhost:5432/vet_saas_db?schema=public`).
2. **Creación de la Migración Inicial (`20261022221900_init`)**: Generación formal del archivo SQL de migración en `prisma/migrations/20261022221900_init/migration.sql`, declarando los enums `GlobalRole` y `TenantRole`, y las tablas `tenants`, `users` y `tenant_users` en el schema `public`.
3. **Ejecución y Registro de Migración**: Aplicación de la migración en PostgreSQL creando la tabla de historial `_prisma_migrations`, registrando la suma de verificación y asegurando que `npx prisma migrate status` reporte sincronización total (`Database schema is up to date!`).
4. **Configuración de Prisma Studio**: Incorporación del script `"prisma:studio": "prisma studio"` en `package.json` para permitir la inspección visual de las tablas y datos desde el navegador web en el puerto `5555`.

#### 2. Comandos Ejecutados / Disponibles
- **Aplicación de migraciones pendientes**:
  ```bash
  npx prisma migrate deploy
  ```
- **Verificación de estado de migraciones**:
  ```bash
  npx prisma migrate status
  ```
- **Apertura de Prisma Studio (interfaz gráfica)**:
  ```bash
  npx prisma studio
  # o alternativamente:
  npm run prisma:studio
  ```

#### 3. Archivos Clave Creados / Modificados
| Archivo | Propósito / Justificación Arquitectónica |
| :--- | :--- |
| `prisma/migrations/20261022221900_init/migration.sql` | Historial SQL declarativo versionado de la base de datos para ambientes locales y de producción. |
| `package.json` | Incorporación del script `prisma:studio` para inspección rápida de base de datos. |
| `diario_proyecto.md` | Bitácora actualizada con el registro del Paso 6. |

---






