#!/usr/bin/env sh
set -eu
if [ -z "${ADMIN_PASSWORD:-}" ]; then echo 'ERROR: set ADMIN_PASSWORD first'; exit 1; fi
exec python -m uvicorn server:app --host 127.0.0.1 --port "${PORT:-8765}"
