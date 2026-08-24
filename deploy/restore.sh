#!/usr/bin/env bash
# Restaurar un backup. Uso desde la raíz del proyecto en el VPS:
#   ./deploy/restore.sh backups/miriam_FECHA.sql.gz
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .env ] && set -a && . ./.env && set +a

FILE="${1:?Uso: ./deploy/restore.sh <archivo.sql.gz>}"

echo "Restaurando $FILE en ${POSTGRES_DB:-miriam_campos}..."
gunzip -c "$FILE" | docker exec -i mc-db psql -U "${POSTGRES_USER:-miriam}" -d "${POSTGRES_DB:-miriam_campos}"
echo "Restauración completada."
