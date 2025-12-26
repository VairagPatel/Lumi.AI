@echo off
echo Starting LumiAI Development Environment...

echo.
echo Stopping any existing containers...
docker-compose -f docker-compose.dev.yml down

echo.
echo Starting development services...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo Waiting for services to be ready...
timeout /t 15 /nobreak > nul

echo.
echo Checking container status...
docker-compose -f docker-compose.dev.yml ps

echo.
echo ========================================
echo LumiAI Development Environment Ready!
echo ========================================
echo MySQL Database: localhost:3306
echo phpMyAdmin: http://localhost:8081
echo Redis: localhost:6379
echo Redis Commander: http://localhost:8082
echo ========================================
echo.
echo Run your backend with: cd API && mvn spring-boot:run
echo Run your frontend with: cd Frontend && npm run dev
echo.
echo To stop: docker-compose -f docker-compose.dev.yml down
echo.