@echo off
echo ========================================
echo       LumiAI Docker Setup
echo ========================================

echo.
echo Checking prerequisites...

REM Check if Docker is running
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file with your API keys before continuing.
    echo Press any key when ready...
    pause > nul
)

echo.
echo Stopping any existing containers...
docker-compose down > nul 2>&1

echo.
echo Pulling latest base images...
docker-compose pull

echo.
echo Building containers (this may take 5-10 minutes)...
docker-compose build --parallel

echo.
echo Starting services...
docker-compose up -d

echo.
echo Waiting for services to be ready...
echo This may take up to 2 minutes for first startup...

REM Wait for backend health check
set /a counter=0
:wait_backend
set /a counter+=1
if %counter% gtr 60 (
    echo ERROR: Backend failed to start within 2 minutes
    echo Checking logs...
    docker-compose logs backend
    exit /b 1
)

curl -s http://localhost:8080/api/v1/health > nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for backend... (%counter%/60)
    timeout /t 2 /nobreak > nul
    goto wait_backend
)

echo.
echo ✅ Backend is ready!

REM Wait for frontend
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for frontend...
    timeout /t 5 /nobreak > nul
)

echo.
echo Checking container status...
docker-compose ps

echo.
echo ========================================
echo 🚀 LumiAI is now running!
echo ========================================
echo.
echo 🌐 Frontend:     http://localhost:3000
echo 🔧 Backend API:  http://localhost:8080/api/v1
echo 📚 API Docs:     http://localhost:8080/swagger-ui.html
echo 🗄️  Database:     localhost:3307 (MySQL)
echo 🔄 Cache:        localhost:6380 (Redis)
echo.
echo ========================================
echo Useful Commands:
echo ========================================
echo View logs:       docker-compose logs -f
echo Stop services:   docker-compose down
echo Restart:         docker-compose restart
echo Update:          git pull && docker-compose up --build -d
echo.
echo Press any key to exit...
pause > nul