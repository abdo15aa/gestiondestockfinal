@echo off
echo ==================================================
echo        STOCKFLOW PRO - LANCEMENT DE L'APPLICATION
echo ==================================================

echo [1/3] Demarrage du Backend Java (Spring Boot)...
start "StockFlow Backend" cmd /c "cd stockflow-backend && mvn spring-boot:run"

echo [2/3] Demarrage du Frontend React (Vite)...
start "StockFlow Frontend" cmd /c "cd "Application de gestion de stock" && npm run dev"

echo [3/3] Attente du demarrage des serveurs (10 secondes)...
timeout /t 10 /nobreak > NUL

echo Ouverture de StockFlow Pro dans le navigateur...
start http://localhost:5173

echo ==================================================
echo L'application est en cours d'execution.
echo Fermez ces fenetres pour arreter l'application.
echo ==================================================
