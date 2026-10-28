@echo off
title TORI-YA RESTAURANT OS - DUAL RUNNER (Live Project Sem 7)
echo ========================================================
echo   TORI-YA RESTAURANT MANAGEMENT SYSTEM - SEM 7
echo   Golang Gin Engine (Port 8080) + Next.js POS (Port 3000)
echo ========================================================
echo.

echo [1/2] Launching Golang Gin MongoDB Backend on port :8080...
start "Tori-Ya Go Backend Engine (:8080)" cmd /k "cd backend && go run main.go"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Next.js Premium POS Frontend on port :3000...
start "Tori-Ya Next.js Frontend (:3000)" cmd /k "npm run dev"

echo.
echo Both servers initiated!
echo Frontend UI: http://localhost:3000
echo Go API Engine: http://localhost:8080
echo.
pause
