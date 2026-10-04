@echo off
title CRAVO - Food Ordering Web App
color 0E

echo ========================================================
echo         CRAVO - Your Mood. Your Budget. Your Meal.
echo ========================================================
echo.

:: Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not found in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if dependencies are installed
if not exist "node_modules" (
    echo [INFO] First time setup: Installing npm dependencies...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo [INFO] Starting CRAVO Web Server...
echo [INFO] Opening http://localhost:3000 in your browser...
echo.

:: Open browser after a short delay
start "" http://localhost:3000

:: Start dev server
npm run dev
