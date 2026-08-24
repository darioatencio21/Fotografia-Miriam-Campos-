#!/usr/bin/env bash
# Backup diario de la base de datos. En el VPS, cron sugerido (crontab -e):
#   0 3 * * * /ruta/al/proyecto/deploy/backup.sh >> /ruta/al/proyecto/backups/backup.log 2>&1
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .env ] && set -a && . ./.env && set +a

BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP=14
mkdir -p "$BACKUP_DIR"

STAMP="$(date +%Y-%m-%d_%H%M)"
FILE="$BACKUP_DIR/miriam_${STAMP}.sql.gz"

docker exec mc-db pg_dump -U "${POSTGRES_USER:-miriam}" "${POSTGRES_DB:-miriam_campos}" | gzip > "$FILE"

# Retención: conserva los últimos $KEEP respaldos.
ls -1t "$BACKUP_DIR"/miriam_*.sql.gz | tail -n +$((KEEP + 1)) | xargs -r rm --

echo "Backup creado: $FILE"
