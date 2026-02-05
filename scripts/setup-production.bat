@echo off
echo ========================================
echo LumiAI Production Setup Script
echo ========================================
echo.

echo Step 1: Creating production environment file...
if not exist .env.production (
    copy .env.example .env.production
    echo ✓ Created .env.production from template
    echo ⚠️  Please edit .env.production with your production values
) else (
    echo ✓ .env.production already exists
)

echo.
echo Step 2: Installing Frontend dependencies...
cd Frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend npm install failed
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed

echo.
echo Step 3: Building Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✓ Frontend built successfully

echo.
echo Step 4: Testing Backend build...
cd ..\API
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo ❌ Backend build failed
    pause
    exit /b 1
)
echo ✓ Backend built successfully

cd ..
echo.
echo ========================================
echo Setup Complete! Next Steps:
echo ========================================
echo 1. Edit .env.production with your API keys
echo 2. Deploy backend to Render (see deploy-render.md)
echo 3. Deploy frontend to Vercel (see deploy-vercel.md)
echo 4. Follow DEPLOYMENT_CHECKLIST.md
echo ========================================
pause