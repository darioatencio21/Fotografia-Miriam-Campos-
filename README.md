# Miriam Tellez Photography

Sitio web de fotografía lifestyle con estética de "hora dorada": galería
filtrable con lightbox, paquetes con precios transparentes, página de reserva,
testimonios verificables y panel privado de administración.

Arquitectura en 3 contenedores Docker: **web**, **api** y **base de datos**.

## Stack

| Capa | Tecnología |
|---|---|
| Web | React + Vite + TypeScript, servido por Nginx |
| API | Node.js + Express + TypeScript |
| DB  | PostgreSQL |

## Cómo correr

Requisito: Docker Desktop.

1. Copia la plantilla de variables y rellena tus valores:

   ```bash
   cp .env.example .env
   ```

2. Levanta todo:

   ```bash
   docker compose up --build -d
   ```

3. Abre **http://localhost:3000**

Para detenerlo: `docker compose down`. Los datos persisten en volúmenes de Docker.

## Qué incluye

- **Galería real** filtrable por tipo de sesión (maternidad, familias, bodas,
  quinceañeras, graduaciones, prometidos…) con lightbox y navegación por teclado.
- **Servicios**: vista resumida en el inicio (3 destacados) y página dedicada
  con todos los paquetes; cada botón lleva a `/reservar` con el servicio ya
  preseleccionado.
- **Reservas**: formulario bilingüe (ES/EN) con fechas ya reservadas bloqueadas,
  validaciones y confirmación por correo.
- **Testimonios**: los visitantes dejan reseñas que quedan pendientes hasta ser
  aprobadas desde el panel.
- **Panel privado** en `/admin`: gestión de solicitudes (aceptar/rechazar con
  correo automático al cliente), calendario mensual de sesiones, exportación a
  Excel y administración de reseñas y fotos. El acceso se controla con la clave
  definida en `.env`.
- **Anti-spam**: campo trampa (honeypot), límite de envíos por IP y validación
  en servidor.
- Bilingüe completo ES/EN, botón flotante de WhatsApp, SEO básico (Open Graph,
  `robots.txt`, `sitemap.xml`).

## Producción (VPS + dominio)

El repo ya incluye todo para un VPS barato (~$5/mes):

- `docker-compose.prod.yml`: override que añade **Caddy** (HTTPS automático,
  puertos 80/443) y reinicio automático de contenedores.
- `Caddyfile`: dominio definido en `.env` como `SITE_DOMAIN`.
- `deploy/backup.sh` / `restore.sh`: respaldo diario de la BD (retención 14
  días) y restauración. Cron sugerido dentro del script.
- `.github/workflows/deploy.yml`: despliegue por SSH en cada push (activar
  tras configurar los secrets del VPS).

### El día D

1. Comprar VPS (Ubuntu 24.04) y dominio; apuntar el registro A a la IP.
2. En el VPS: instalar Docker, clonar el repo y crear `.env` con valores
   fuertes (`ADMIN_KEY`, `POSTGRES_PASSWORD`, `SITE_DOMAIN`, `SMTP_PASS`).
3. Levantar:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```
4. Caddy emite el certificado HTTPS solo cuando el DNS responde al servidor.
5. Migrar datos locales: `pg_dump` de la BD local y copia del volumen de fotos.
6. Configurar secrets de Actions para despliegues automáticos.
