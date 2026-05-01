# SmartBoard Simulation Runner

Write-Host "Starting SmartBoard Simulation..." -ForegroundColor Cyan

# 1. Start ESP-Node
Write-Host "Launching ESP-Node (Backend)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd esp-node; npm start"

# 2. Start Board-React
Write-Host "Launching Board-React (Physical Layer)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd board-react; npm run dev"

# 3. Start App-Flutter
Write-Host "Launching App-Flutter (Remote Control)..." -ForegroundColor Yellow
# Note: Flutter usually requires a target device. 
# We'll launch it and let the user pick or it will use the default.
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd app-flutter; flutter run"

Write-Host "All processes initiated in separate windows." -ForegroundColor Green
