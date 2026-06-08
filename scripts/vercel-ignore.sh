#!/usr/bin/env bash
# Vercel Ignored Build Step for monorepo apps.
# Exit 0 = skip deployment, exit 1 = proceed with deployment.
set -euo pipefail

APP="${1:?Usage: vercel-ignore.sh <landing|nedai|microcrm|microcms>}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PREV="${VERCEL_GIT_PREVIOUS_SHA:-HEAD~1}"
CUR="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

case "$APP" in
  landing)
    WATCH=(apps/landing packages/ui packages/config)
    SHARED_DB=true
    ;;
  nedai)
    WATCH=(apps/nedai packages/ui packages/config)
    SHARED_DB=true
    ;;
  microcrm)
    WATCH=(apps/microcrm packages/db packages/crypto packages/config)
    SHARED_DB=false
    ;;
  microcms)
    WATCH=(apps/microcms packages/db packages/config)
    SHARED_DB=false
    ;;
  *)
    echo "Unknown app: $APP" >&2
    exit 1
    ;;
esac

changed() {
  ! git diff --quiet "$PREV" "$CUR" -- "$@"
}

if changed "${WATCH[@]}"; then
  echo "[$APP] App paths changed — deploy"
  exit 1
fi

if [[ "$SHARED_DB" == "true" ]] && changed packages/db packages/crypto; then
  echo "[$APP] Shared db/crypto changed — deploy"
  exit 1
fi

if changed yarn.lock; then
  WORKSPACE="@nedora/${APP}@workspace"
  LOCK_DIFF="$(git diff "$PREV" "$CUR" -- yarn.lock)"

  if echo "$LOCK_DIFF" | grep -qF "$WORKSPACE"; then
    echo "[$APP] yarn.lock workspace entry changed — deploy"
    exit 1
  fi

  # Lockfile edits scoped to other apps (e.g. new CRM-only deps) should not redeploy landing/nedai.
  if [[ "$APP" != "microcrm" && "$APP" != "microcms" ]]; then
    if echo "$LOCK_DIFF" | grep -qE '@nedora/(microcrm|microcms)@workspace'; then
      echo "[$APP] yarn.lock only touches other apps — skip"
      exit 0
    fi
  fi

  echo "[$APP] yarn.lock changed — deploy"
  exit 1
fi

if changed package.json; then
  DIFF="$(git diff "$PREV" "$CUR" -- package.json)"
  if echo "$DIFF" | grep -qE "\"(build|dev):${APP}\""; then
    echo "[$APP] Root package.json scripts for this app changed — deploy"
    exit 1
  fi
  if echo "$DIFF" | grep -qE '^[+-]' | grep -qvE '"(build|dev):(landing|cms|crm|nedai)"'; then
    if echo "$DIFF" | grep -qvE 'build:|dev:'; then
      echo "[$APP] Root package.json changed — deploy"
      exit 1
    fi
  fi
  echo "[$APP] Root package.json change not relevant — skip"
  exit 0
fi

if changed turbo.json .yarnrc.yml .yarn/releases; then
  echo "[$APP] Turbo/Yarn config changed — deploy"
  exit 1
fi

echo "[$APP] No relevant changes — skip"
exit 0
