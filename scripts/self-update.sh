#!/usr/bin/env bash
# Self-update runner — runs in a detached Docker container (see update-executor.service.ts).
set -euo pipefail

JOB_ID="${1:?job id required}"
DATA_DIR="${2:?data dir required}"
DEPLOY_MODE="${3:-docker}"
COMPOSE_FILE="${4:-/deploy/docker-compose.yml}"
PROJECT_ROOT="${5:-/deploy}"
PORT="${6:-3001}"
HEALTH_URL="${7:-http://localhost:3001/api/health}"

PROGRESS_FILE="$DATA_DIR/update-progress.json"
RESULT_FILE="$DATA_DIR/update-result.json"
MANIFEST_FILE="$DATA_DIR/job-${JOB_ID}.json"
LOG_FILE="$DATA_DIR/update-${JOB_ID}.log"

mkdir -p "$DATA_DIR"
exec > >(tee -a "$LOG_FILE") 2>&1

if [[ ! -f "$MANIFEST_FILE" ]]; then
  echo "Manifest not found: $MANIFEST_FILE"
  exit 1
fi

TARGET_TAG="$(jq -r '.targetTag' "$MANIFEST_FILE")"
FROM_VERSION="$(jq -r '.fromVersion' "$MANIFEST_FILE")"

STEPS='[{"id":"snapshot","label":"Save rollback snapshot","status":"pending"},{"id":"fetch","label":"Fetch release","status":"pending"},{"id":"deploy","label":"Apply update","status":"pending"},{"id":"health","label":"Verify health","status":"pending"}]'
ROLLBACK_SNAPSHOT="{}"
JOB_STATUS="running"
FAILED=0
ROLLBACK_DONE=0

write_progress() {
  local status="${1:-$JOB_STATUS}"
  jq -n \
    --arg jobId "$JOB_ID" \
    --arg status "$status" \
    --argjson steps "$STEPS" \
    --argjson snapshot "$ROLLBACK_SNAPSHOT" \
    '{jobId: $jobId, status: $status, steps: $steps, rollbackSnapshot: $snapshot}' > "$PROGRESS_FILE"
}

write_result() {
  local status="$1"
  local error="${2:-}"
  jq -n \
    --arg jobId "$JOB_ID" \
    --arg status "$status" \
    --arg error "$error" \
    --argjson snapshot "$ROLLBACK_SNAPSHOT" \
    '{jobId: $jobId, status: $status, error: $error, rollbackSnapshot: $snapshot}' > "$RESULT_FILE"
  rm -f "$PROGRESS_FILE"
}

set_step() {
  local id="$1"
  local status="$2"
  local message="${3:-}"
  STEPS="$(echo "$STEPS" | jq --arg id "$id" --arg st "$status" --arg msg "$message" \
    'map(if .id == $id then . + {status: $st, message: $msg} else . end)')"
  write_progress "$JOB_STATUS"
}

wait_for_health() {
  local url="$1"
  local attempts="${2:-60}"
  local delay="${3:-5}"
  for ((i = 1; i <= attempts; i++)); do
    if curl -sf "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
  done
  return 1
}

do_rollback() {
  if [[ "$ROLLBACK_DONE" -eq 1 ]]; then
    return
  fi
  ROLLBACK_DONE=1
  JOB_STATUS="rolling_back"
  write_progress "$JOB_STATUS"
  echo "Starting automatic rollback..."
  if [[ -x "$PROJECT_ROOT/scripts/self-update-rollback.sh" ]]; then
    bash "$PROJECT_ROOT/scripts/self-update-rollback.sh" \
      "$JOB_ID" "$DATA_DIR" "$DEPLOY_MODE" "$COMPOSE_FILE" "$PROJECT_ROOT" "$PORT" "$HEALTH_URL" || true
  fi
}

on_error() {
  FAILED=1
  JOB_STATUS="failed"
  echo "Update failed at line $1"
  do_rollback
  write_result "rolled_back" "Update failed; automatic rollback attempted"
  exit 1
}
trap 'on_error $LINENO' ERR

write_progress "running"
set_step snapshot running "Capturing current state"

cd "$PROJECT_ROOT"

if [[ "$DEPLOY_MODE" == "docker" || "$DEPLOY_MODE" == "docker-replica" ]]; then
  GIT_REF="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
  COMPOSE_IMAGES="$(docker compose -f "$COMPOSE_FILE" images -q 2>/dev/null | sort -u | jq -R -s 'split("\n") | map(select(length>0))')"
  ROLLBACK_SNAPSHOT="$(jq -n \
    --arg mode "$DEPLOY_MODE" \
    --arg ref "$GIT_REF" \
    --arg from "$FROM_VERSION" \
    --arg compose "$COMPOSE_FILE" \
    --argjson images "$COMPOSE_IMAGES" \
    '{mode: $mode, gitRef: $ref, fromVersion: $from, composeFile: $compose, imageIds: $images}')"
elif [[ "$DEPLOY_MODE" == "native" ]]; then
  GIT_REF="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
  ROLLBACK_SNAPSHOT="$(jq -n --arg ref "$GIT_REF" --arg from "$FROM_VERSION" '{mode: "native", gitRef: $ref, fromVersion: $from}')"
else
  echo "Unsupported deploy mode: $DEPLOY_MODE"
  exit 1
fi

echo "$ROLLBACK_SNAPSHOT" > "$DATA_DIR/rollback-${JOB_ID}.json"
set_step snapshot completed "Snapshot saved"

set_step fetch running "Fetching $TARGET_TAG"
git fetch --tags --force origin
git checkout "$TARGET_TAG"
set_step fetch completed "Checked out $TARGET_TAG"

set_step deploy running "Rebuilding services"
if [[ "$DEPLOY_MODE" == "docker" || "$DEPLOY_MODE" == "docker-replica" ]]; then
  docker compose -f "$COMPOSE_FILE" pull
  docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans
else
  npm install --prefix backend --omit=dev
  npm run build --prefix backend
  if command -v systemctl >/dev/null 2>&1; then
    systemctl restart dynamic-api-backend || true
  fi
fi
set_step deploy completed "Services restarted"

set_step health running "Waiting for health check"
if ! wait_for_health "$HEALTH_URL" 72 5; then
  set_step health failed "Health check timed out"
  JOB_STATUS="failed"
  do_rollback
  write_result "rolled_back" "Health check failed after update"
  exit 1
fi
set_step health completed "Application is healthy"

JOB_STATUS="completed"
write_progress "completed"
write_result "completed" ""
echo "Update to $TARGET_TAG completed successfully"
