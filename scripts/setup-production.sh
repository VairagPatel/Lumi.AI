#!/bin/bash

echo "========================================"
echo "LumiAI Production Setup Script"
echo "========================================"
echo

echo "Step 1: Creating production environment file..."
if [ ! -f .env.production ]; then
    cp .env.example .env.production
    echo "✓ Created .env.production from template"
    echo "⚠️  Please edit .env.production with your production values"
else
    echo "✓ .env.production already exists"
fi

echo
echo "Step 2: Installing Frontend dependencies..."
cd Frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend npm install failed"
    exit 1
fi
echo "✓ Frontend dependencies installed"

echo
echo "Step 3: Building Frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✓ Frontend built successfully"

echo
echo "Step 4: Testing Backend build..."
cd ../API
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi
echo "✓ Backend built successfully"

cd ..
echo
echo "========================================"
echo "Setup Complete! Next Steps:"
echo "========================================"
echo "1. Edit .env.production with your API keys"
echo "2. Deploy backend to Render (see deploy-render.md)"
echo "3. Deploy frontend to Vercel (see deploy-vercel.md)"
echo "4. Follow DEPLOYMENT_CHECKLIST.md"
echo "========================================"