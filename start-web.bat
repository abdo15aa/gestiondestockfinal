@echo off
echo ==================================================
echo        STOCKFLOW - MODE NAVIGATEUR
echo ==================================================
echo.
echo Demarrage du backend (port 8080)...
start "StockFlow Backend" cmd /k "cd /d "%~dp0stockflow-backend" && mvn spring-boot:run"

echo Attente du demarrage du backend (15 secondes)...
timeout /t 15 /nobreak >nul

echo Demarrage du frontend (port 5173)...
cd /d "%~dp0Application de gestion de stock"
if not exist node_modules (
    echo Installation des dependances npm...
    call npm install
)
echo.
echo Ouvrez http://localhost:5173 dans votre navigateur.
call npm run dev
