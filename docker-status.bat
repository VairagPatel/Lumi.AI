@echo off
echo ========================================
echo       LumiAI Docker Status
echo ========================================

echo.
echo Container Status:
docker-compose ps

echo.
echo Service Health:
echo Checking frontend...
curl -s -o nul -w "Frontend (port 3000): %%{http_code}\n" http://localhost:3000

echo Checking backend...
curl -s -o nul -w "Backend API (port 8080): %%{http_code}\n" http://localhost:8080/api/v1/health

echo Checking database...
docker-compose exec -T mysql mysqladmin ping -h localhost -u root -p%MYSQL_ROOT_PASSWORD% 2>nul && echo Database (MySQL): OK || echo Database (MySQL): ERROR

echo.
echo Resource Usage:
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo.
echo Recent Logs (last 10 lines):
echo.
echo === Backend Logs ===
docker-compose logs --tail=5 backend

echo.
echo === Frontend Logs ===
docker-compose logs --tail=5 frontend

echo.
echo ========================================
echo Access URLs:
echo ========================================
echo Frontend:     http://localhost:3000
echo Backend API:  http://localhost:8080/api/v1
echo API Docs:     http://localhost:8080/swagger-ui.html
echo ========================================