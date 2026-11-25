# Notificación de vulnerabilidades de PHP

**Fecha:** 21 de octubre de 2026  
**Destinatario:** Darío  
**Asunto:** Vulnerabilidades críticas en PHP (Ejecución remota de código sin autenticación)

## Resultado de la verificación (23/10/2026)

**Este proyecto y su despliegue NO están afectados.** No hay PHP en ninguna capa:

- El repositorio no contiene `*.php`, `composer.json`, `php.ini` ni `.htaccess`.
- Stack real: React/Vite → nginx `1.27.5` → API Node/Express (4000) → PostgreSQL 16, con Caddy como terminador TLS.
- `docker-compose.yml` / `docker-compose.prod.yml` no usan ninguna imagen PHP, Apache ni LiteSpeed.
- Cabeceras del dominio `miriamtellezphotography.com`: `Server: nginx/1.27.5` + `Via: 1.1 Caddy`. Sin PHP.
- VPS (`104.207.89.98`, Spaceship): solo puertos 80, 443 y 22022 (SSH) abiertos. Sin cPanel, Plesk, LiteSpeed ni MySQL/PostgreSQL expuestos.
- El aviso parece un envío genérico del proveedor a clientes VPS, no una detección en este servidor.

Para certeza absoluta sobre paquetes PHP instalados en el sistema operativo del VPS
(fuera de Docker), ejecutar por SSH:

```bash
php -v 2>/dev/null || echo "PHP no instalado"
dpkg -l | grep -Ei 'php|apache2|litespeed' || echo "sin paquetes PHP/Apache"
ss -lntp | grep -Ei ':80|:443|php' || true
```

## CVEs
- CVE-2026-109618
- CVE-2026-109619

## Impacto
- **Tipo:** Ejecución remota de código sin iniciar sesión
- **Alcance:** Todas las SAPIs de PHP (PHP-FPM, Apache mod_php, php-cgi, LiteSpeed)
- **Mayor riesgo:** Servidores con Apache mod_php
- **Aplicación:** Cualquier configuración de PHP que aloje sitios web

## Versiones corregidas
Actualizar a una de las siguientes versiones:
- PHP 8.5.12
- PHP 8.4.27
- PHP 8.3.36
- PHP 8.2.35

## Instrucciones para el VPS
1. **Actualizar PHP** - Usar canales oficiales del SO/panel (apt/yum/dnf, cPanel, Plesk, CloudLinux). Si usas Remi aún sin parches, preferir paquetes de la distribución por ahora.
2. **Reiniciar servicios** - Reiniciar PHP-FPM y/o servidor web tras la actualización para cargar los parches.
3. **Migrar si es necesario** - PHP 8.1 y anteriores sin soporte oficial. PHP 8.2 llega a EOL el 31 de diciembre de 2026 (sin actualizaciones de seguridad tras esa fecha).

## Checklist rápido
- [ ] Conectado por SSH al VPS
- [ ] Comprobar versión: `php -v` / `php-fpm -v`
- [ ] Comprobar SAPI: identificar si usa PHP-FPM, mod_php, php-cgi o LiteSpeed
- [ ] Actualizar a versión parcheada
- [ ] Reiniciar PHP-FPM / servidor web
- [ ] Comprobar versión tras actualización
- [ ] Revisar logs tras actualización

## Medidas temporales (si no se puede actualizar ya)
Consultar el aviso oficial de PHP para cambios de configuración temporales. **No son definitivas**. Aplicar solo como medida a corto plazo hasta poder actualizar.
