@echo off
setlocal

cd /d "%~dp0"

echo Local Liquidators Business Operating System
echo ==============================================
echo.

if not exist data mkdir data

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is required but not installed or not on PATH.
    exit /b 1
)

echo [OK] Node.js found
echo.
echo Starting server...
node src\server.js
