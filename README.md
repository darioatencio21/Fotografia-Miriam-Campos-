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

## Producción (cuando haya dominio)

- Servir detrás de HTTPS (reverse proxy del hosting o Certbot).
- Actualizar el dominio canónico en `web/index.html`, `robots.txt` y
  `sitemap.xml`.
- Configurar credenciales SMTP reales en `.env` (`SMTP_PASS`).
