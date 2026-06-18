#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=================================================="
echo "       STOCKFLOW PRO - APPLICATION DE BUREAU"
echo "=================================================="
echo ""

cd "$ROOT/Application de gestion de stock"
if [ ! -d node_modules ]; then
  echo "Installation des dependances npm..."
  npm install
fi

npm run electron:dev
