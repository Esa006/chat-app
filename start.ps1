#!/usr/bin/env pwsh
# ─────────────────────────────────────────────────
#  ChatFlow — Start all services
#  Run from the chat-app/ root directory
# ─────────────────────────────────────────────────

$ErrorActionPreference = 'Stop'
$phpBin   = "C:\xampp\php\php.exe"
$mysqlBin = "C:\xampp\mysql\bin\mysql.exe"

Write-Host "`n⚡ ChatFlow Startup" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

# 1. Ensure MySQL is running (XAMPP must be started manually or via service)
Write-Host "`n[1/4] Checking MySQL..." -ForegroundColor Yellow
try {
    & $mysqlBin -u root -e "SELECT 1;" | Out-Null
    Write-Host "  ✓ MySQL is running" -ForegroundColor Green
} catch {
    Write-Host "  ✗ MySQL is not running. Please start XAMPP MySQL first." -ForegroundColor Red
    exit 1
}

# 2. Laravel API server
Write-Host "`n[2/4] Starting Laravel API on http://localhost:8000 ..." -ForegroundColor Yellow
$laravelJob = Start-Process -FilePath $phpBin `
    -ArgumentList "artisan", "serve", "--host=127.0.0.1", "--port=8000" `
    -WorkingDirectory "$PSScriptRoot\backend" `
    -PassThru -WindowStyle Minimized
Write-Host "  ✓ Laravel started (PID $($laravelJob.Id))" -ForegroundColor Green

Start-Sleep -Seconds 1

# 3. Laravel Reverb WebSocket server
Write-Host "`n[3/4] Starting Reverb WebSocket on ws://127.0.0.1:8080 ..." -ForegroundColor Yellow
$reverbJob = Start-Process -FilePath $phpBin `
    -ArgumentList "artisan", "reverb:start", "--host=127.0.0.1", "--port=8080" `
    -WorkingDirectory "$PSScriptRoot\backend" `
    -PassThru -WindowStyle Minimized
Write-Host "  ✓ Reverb started (PID $($reverbJob.Id))" -ForegroundColor Green

Start-Sleep -Seconds 1

# 4. Vite dev server
Write-Host "`n[4/4] Starting Vite frontend on http://localhost:5173 ..." -ForegroundColor Yellow
$viteJob = Start-Process -FilePath "npm.cmd" `
    -ArgumentList "run", "dev" `
    -WorkingDirectory "$PSScriptRoot\frontend" `
    -PassThru -WindowStyle Minimized
Write-Host "  ✓ Vite started (PID $($viteJob.Id))" -ForegroundColor Green

Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🚀 ChatFlow is running!" -ForegroundColor Green
Write-Host "   Frontend : http://localhost:5173" -ForegroundColor White
Write-Host "   Laravel  : http://localhost:8000" -ForegroundColor White
Write-Host "   Reverb   : ws://127.0.0.1:8080" -ForegroundColor White
Write-Host "`n Demo logins:" -ForegroundColor Yellow
Write-Host "   alice@example.com / password123" -ForegroundColor White
Write-Host "   bob@example.com   / password123" -ForegroundColor White
Write-Host "   carol@example.com / password123" -ForegroundColor White
Write-Host "`n Press Ctrl+C to stop this script." -ForegroundColor DarkGray
Write-Host " (Laravel, Reverb, and Vite windows are minimized)" -ForegroundColor DarkGray

# Keep script alive so Ctrl+C can be used for awareness
try { Wait-Process -Id $laravelJob.Id } catch {}
