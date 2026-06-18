@echo off
echo ==================================================
echo        STOCKFLOW PRO - APPLICATION DE BUREAU
echo ==================================================
echo.
echo Demarrage en cours... Veuillez patienter.
echo L'application se lancera dans sa propre fenetre.

cd /d "%~dp0Application de gestion de stock"
if not exist node_modules (
    echo Installation des dependances npm...
    call npm install
)
call npm run electron:dev
