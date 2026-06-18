#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=================================================="
echo "       STOCKFLOW - MODE NAVIGATEUR"
echo "=================================================="
echo ""
echo "Demarrage du backend (port 8080)..."

cd "$ROOT/stockflow-backend"
mvn spring-boot:run &
BACKEND_PID=$!

cleanup() {
  kill "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT

echo "Attente du demarrage du backend (15 secondes)..."
sleep 15

echo "Demarrage du frontend (port 5173)..."
cd "$ROOT/Application de gestion de stock"
if [ ! -d node_modules ]; then
  echo "Installation des dependances npm..."
  npm install
fi
echo ""
echo "Ouvrez http://localhost:5173 dans votre navigateur."
npm run dev
