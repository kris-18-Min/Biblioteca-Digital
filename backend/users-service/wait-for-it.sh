#!/bin/sh

if [ "$#" -lt 1 ]; then
    echo "Uso: $0 host:port [-- command args]"
    exit 1
fi

ARGUMENT=$1
shift
HOST=$(echo $ARGUMENT | cut -d: -f1)
PORT=$(echo $ARGUMENT | cut -d: -f2)
TIMEOUT=60

echo "⏳ Esperando a que $HOST:$PORT esté disponible..."

count=1
while ! nc -z $HOST $PORT 2>/dev/null
do
    if [ $count -gt $TIMEOUT ]; then
        echo "❌ Timeout alcanzado esperando por $HOST:$PORT"
        exit 1
    fi
    echo "⌛ Aún esperando... ($count/$TIMEOUT)"
    sleep 1
    count=$((count + 1))
done

echo "✅ $HOST:$PORT está disponible"

if [ "$1" = "--" ]; then
    shift
fi

if [ $# -gt 0 ]; then
    echo "🚀 Ejecutando: $@"
    exec "$@"
fi