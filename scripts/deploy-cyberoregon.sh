#!/usr/bin/env bash
# Install as root-owned /usr/local/bin/deploy-cyberoregon (0755).
set -Eeuo pipefail
umask 027
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
APP=/srv/apps/cyberoregon
RELEASES=/srv/apps/cyberoregon-releases
CURRENT=/srv/apps/cyberoregon-current
SERVICE=cyberoregon.service

[[ $EUID == 0 ]] || { echo 'Execute pelo sudo.' >&2; exit 1; }
[[ $# == 1 ]] || { echo 'Uso: deploy-cyberoregon COMMIT_SHA | --check' >&2; exit 1; }
as_deploy() { runuser -u deploy -- "$@"; }
check_setup() {
  test -f "$APP/.env.production"
  as_deploy test -r "$APP/.env.production"
  test -d "$APP/.git"
  test -L "$CURRENT"
  test -d "$CURRENT/.next"
  test "$(systemctl show "$SERVICE" -p WorkingDirectory --value)" = "$CURRENT"
  systemctl is-active --quiet "$SERVICE"
}
if [[ $1 == --check ]]; then
  check_setup
  echo 'Configuração do deploy validada.'
  exit 0
fi
sha=$1
[[ $sha =~ ^[0-9a-f]{40}$ ]] || { echo 'SHA inválido.' >&2; exit 1; }
exec 9>/run/lock/cyberoregon-deploy.lock
flock -w 900 9
check_setup
previous=$(readlink -f "$CURRENT")
as_deploy git -C "$APP" fetch --no-tags origin main
as_deploy git -C "$APP" cat-file -e "$sha^{commit}"
as_deploy git -C "$APP" merge-base --is-ancestor "$sha" origin/main || {
  echo 'O commit não pertence à main remota.' >&2; exit 1;
}
[[ $(df -Pk /srv/apps | awk 'NR==2 {print $4}') -gt 2500000 ]] || {
  echo 'Libere pelo menos 2,5 GB para compilar.' >&2; exit 1;
}
install -d -o root -g deploy -m 750 "$RELEASES"
release=$(mktemp -d "$RELEASES/$(date -u +%Y%m%dT%H%M%S)-${sha:0:12}-XXXXXX")
chown deploy:deploy "$release"
as_deploy bash -o pipefail -c 'git -C "$1" archive "$2" | tar -x -C "$3"' -- "$APP" "$sha" "$release"
# Reject committed environment files before Next.js can load them.
if find "$release" -name '.env*' ! -name '.env.example' -print -quit | grep -q .; then
  echo 'Commit contém arquivo de ambiente; deploy recusado.' >&2; exit 1
fi
ln -s "$APP/.env.production" "$release/.env.production"
printf '%s\n' "$sha" > "$release/.deploy-sha"
chown deploy:deploy "$release/.deploy-sha"
as_deploy test -r "$release/.deploy-sha"
as_deploy bash -c 'cd "$1" && npm ci --include=dev --no-audit --no-fund && npm run lint && NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 npm run build' -- "$release"
test -f "$release/.next/BUILD_ID"

switch_to() {
  ln -s "$1" "$CURRENT.next.$$"
  mv -Tf "$CURRENT.next.$$" "$CURRENT"
}
rollback() {
  trap - ERR INT TERM
  echo 'Falha ao ativar; restaurando a versão anterior.' >&2
  switch_to "$previous"
  systemctl restart "$SERVICE"
  exit 1
}
trap rollback ERR INT TERM
switch_to "$release"
systemctl restart "$SERVICE"
ready=0
for attempt in $(seq 1 30); do
  pid=$(systemctl show "$SERVICE" -p MainPID --value)
  if systemctl is-active --quiet "$SERVICE" &&
    [[ $(readlink -f "/proc/$pid/cwd") == "$release" ]] &&
    curl --fail --silent --max-time 5 http://127.0.0.1:3011/ | grep -q 'CyberOregon'; then
    ready=1; break
  fi
  sleep 2
done
[[ $ready == 1 ]]
curl --fail --silent --show-error --max-time 15 \
  --resolve cyberoregon.com.br:443:127.0.0.1 https://cyberoregon.com.br/ -o /dev/null
trap - ERR INT TERM
printf 'Deploy concluído: %s\nRelease: %s\nAnterior: %s\n' "$sha" "$release" "$previous"
# Releases are retained for recovery. No database resets or migrations run here.
