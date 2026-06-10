@echo off
setlocal

if not defined PORT set PORT=3000

echo Local Liquidators System Status
echo ==================================
echo.

powershell -NoProfile -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:%PORT%/api/health' -TimeoutSec 3; $response | ConvertTo-Json -Compress; exit 0 } catch { exit 1 }" > "%TEMP%\local-liquidators-health.txt"
if errorlevel 1 (
    echo [FAIL] Server is NOT RUNNING
    echo.
    echo Start with: start.cmd
    del "%TEMP%\local-liquidators-health.txt" >nul 2>nul
    exit /b 1
)

echo [OK] Server is RUNNING on port %PORT%
echo.
echo Dashboard: http://localhost:%PORT%/dashboard
echo CRM:       http://localhost:%PORT%/crm
echo Pipeline:  http://localhost:%PORT%/pipeline
echo Intake:    http://localhost:%PORT%/intake
echo SOPs:      http://localhost:%PORT%/sop
echo.
type "%TEMP%\local-liquidators-health.txt"
del "%TEMP%\local-liquidators-health.txt" >nul 2>nul
