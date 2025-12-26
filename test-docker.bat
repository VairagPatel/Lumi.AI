@echo off
echo Testing LumiAI Docker Setup...

echo.
echo 1. Checking Docker installation...
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running
    exit /b 1
)

docker-compose --version
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not installed
    exit /b 1
)

echo.
echo 2. Checking environment file...
if not exist .env (
    echo WARNING: .env file not found, copying from .env.example
    copy .env.example .env
)

echo.
echo 3. Testing Docker Compose configuration...
docker-compose config > nul
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose configuration is invalid
    exit /b 1
)

echo.
echo 4. Checking available ports...
netstat -an | findstr ":3000 " > nul
if %errorlevel% equ 0 (
    echo WARNING: Port 3000 is already in use
)

netstat -an | findstr ":8080 " > nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8080 is already in use
)

netstat -an | findstr ":3307 " > nul
if %errorlevel% equ 0 (
    echo WARNING: Port 3307 is already in use
)

echo.
echo 5. Testing container builds...
echo Building backend container...
docker build -t lumiai-backend-test ./API
if %errorlevel% neq 0 (
    echo ERROR: Backend container build failed
    exit /b 1
)

echo Building frontend container...
docker build -t lumiai-frontend-test ./Frontend
if %errorlevel% neq 0 (
    echo ERROR: Frontend container build failed
    exit /b 1
)

echo.
echo Cleaning up test images...
docker rmi lumiai-backend-test lumiai-frontend-test > nul 2>&1

echo.
echo ========================================
echo ✅ All tests passed!
echo ========================================
echo Your Docker setup is ready.
echo Run 'docker-build.bat' to start LumiAI
echo.