@echo off
echo ==================================================
echo        STOCKFLOW PRO - APPLICATION DE BUREAU
echo ==================================================
echo.
echo Demarrage en cours... Veuillez patienter.
echo L'application se lancera dans sa propre fenetre.

cd "Application de gestion de stock"
npm run electron:dev
