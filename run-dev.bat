@echo off
title BOOKING OQ - DUAL RUNNER (Live Project Sem 7)
echo ========================================================
echo   BOOKING OQ - OPERATIONS & QUEUE MANAGEMENT SYSTEM
echo   Golang Gin Engine (Port 8080) + Next.js App (Port 3001)
echo ========================================================
echo.

echo [1/2] Launching Golang Gin Backend Engine on port :8080...
start "Booking OQ Backend Engine (:8080)" cmd /k "cd backend && go run main.go"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Booking OQ Next.js Interface on port :3001...
start "Booking OQ Next.js Interface (:3001)" cmd /k "npm run dev"

echo.
echo Both servers initiated!
echo Frontend UI: http://localhost:3001/oq/
echo Go API Engine: http://localhost:8080
echo.
pause
