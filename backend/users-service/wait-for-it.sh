#!/usr/bin/env bash
# wait-for-it.sh — Espera a que un host:puerto esté disponible

host="$1"
shift
port="$1"
shift

timeout=30
cmd="$@"

echo "⏳ Esperando a que $host:$port esté disponible..."

for i in $(seq $timeout); do
  nc -z "$host" "$port" > /dev/null 2>&1
  result=$?
  if [ $result -eq 0 ]; then
    echo "✅ $host:$port está disponible — ejecutando comando..."
    exec $cmd
  fi
  echo "⏱️ Esperando... ($i/$timeout)"
  sleep 1
done

echo "❌ Timeout: $host:$port no respondió en $timeout segundos"
exit 1