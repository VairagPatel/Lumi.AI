@echo off
setlocal enabledelayedexpansion

REM LumiAI Docker Setup Script for Windows
REM This script helps you set up LumiAI with Docker

echo 🚀 LumiAI Docker Setup
echo ======================

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    echo Visit: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Check if .env file exists
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration before running the application
    echo    Required: API keys, database passwords, JWT secret
)

REM Parse command line argument
set "command=%1"
if "%command%"=="" set "command=menu"

if "%command%"=="dev" goto start_dev
if "%command%"=="prod" goto start_prod
if "%command%"=="stop" goto stop_all
if "%command%"=="cleanup" goto cleanup
if "%command%"=="logs" goto show_logs
if "%command%"=="status" goto show_status
goto show_menu

:start_dev
echo 🔧 Starting development environment...
echo This includes: MySQL, Redis, phpMyAdmin, Redis Commander

docker-compose -f docker-compose.dev.yml up -d

echo.
echo ✅ Development services started!
echo 📊 phpMyAdmin: http://localhost:8081
echo 🔴 Redis Commander: http://localhost:8082
echo 🗄️  MySQL: localhost:3306
echo 🔴 Redis: localhost:6379
echo.
echo Now you can run your backend and frontend locally:
echo Backend: cd API ^&^& mvnw.cmd spring-boot:run
echo Frontend: cd Frontend ^&^& npm run dev
goto end

:start_prod
echo 🚀 Starting production environment...
echo This includes: MySQL, Redis, Backend API, Frontend

docker-compose up --build -d

echo.
echo ✅ Production environment started!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8080
echo 🗄️  MySQL: localhost:3306
echo 🔴 Redis: localhost:6379
goto end

:stop_all
echo 🛑 Stopping all Docker services...
docker-compose down
docker-compose -f docker-compose.dev.yml down
echo ✅ All services stopped
goto end

:cleanup
echo 🧹 Cleaning up Docker resources...
docker-compose down -v --remove-orphans
docker-compose -f docker-compose.dev.yml down -v --remove-orphans
docker system prune -f
echo ✅ Cleanup completed
goto end

:show_logs
echo 📋 Showing Docker logs...
docker-compose logs -f
goto end

:show_status
echo 📊 Docker Services Status:
echo ==========================
docker-compose ps
echo.
echo Development Services:
docker-compose -f docker-compose.dev.yml ps
goto end

:show_menu
echo.
echo Available commands:
echo   dev     - Start development environment (databases only)
echo   prod    - Start full production environment
echo   stop    - Stop all services
echo   cleanup - Clean up all Docker resources
echo   logs    - Show service logs
echo   status  - Show services status
echo.
echo Usage: %0 [command]
echo Example: %0 dev
goto end

:end
if "%command%"=="menu" pause
endlocal