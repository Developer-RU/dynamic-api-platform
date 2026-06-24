#!/usr/bin/env bash
set -euo pipefail

JOB_ID="${1:?job id required}"
DATA_DIR="${2:?data dir required}"
DEPLOY_MODE="${3:-docker}"
COMPOSE_FILE="${4:-/deploy/docker-compose.yml}"
PROJECT_ROOT="${5:-/deploy}"
PORT="${6:-3001}"
HEALTH_URL="${7:-http://localhost:3001/api/health}"

SNAPSHOT_FILE="$DATA_DIR/rollback-${JOB_ID}.json"

if [[ ! -f "$SNAPSHOT_FILE" ]]; then
  echo "Rollback snapshot not found: $SNAPSHOT_FILE"
  exit 1
fi

cd "$PROJECT_ROOT"

GIT_REF="$(jq -r '.gitRef // empty' "$SNAPSHOT_FILE")"
MODE="$(jq -r '.mode // "docker"' "$SNAPSHOT_FILE")"
USE_GIT="$(jq -r '.useGit // 1' "$SNAPSHOT_FILE")"
BACKUP_ARCHIVE="$(jq -r '.backupArchive // empty' "$SNAPSHOT_FILE")"

echo "Rolling back job $JOB_ID"

if [[ "$USE_GIT" == "1" && -n "$GIT_REF" && "$GIT_REF" != "unknown" && "$GIT_REF" != "null" && "$GIT_REF" != "archive" ]]; then
  git fetch --tags --force origin || true
  git checkout "$GIT_REF"
elif [[ -n "$BACKUP_ARCHIVE" && -f "$BACKUP_ARCHIVE" ]]; then
  echo "Restoring backup archive $BACKUP_ARCHIVE"
  tar -xzf "$BACKUP_ARCHIVE" -C "$PROJECT_ROOT"
else
  echo "No git ref or backup archive available for rollback"
  exit 1
fi

if [[ "$MODE" == "docker" || "$MODE" == "docker-replica" || "$DEPLOY_MODE" == "docker" || "$DEPLOY_MODE" == "docker-replica" ]]; then
  docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans
else
  npm install --prefix backend --omit=dev
  npm run build --prefix backend
  if command -v systemctl >/dev/null 2>&1; then
    systemctl restart dynamic-api-backend || true
  fi
fi

for i in $(seq 1 60); do
  if curl -sf "$HEALTH_URL" >/dev/null 2>&1; then
    echo "Rollback health check OK"
    exit 0
  fi
  sleep 5
done

echo "Rollback completed but health check did not pass"
exit 1
