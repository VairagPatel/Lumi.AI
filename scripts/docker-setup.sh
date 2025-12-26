#!/bin/bash

# LumiAI Docker Setup Script
# This script helps you set up LumiAI with Docker

set -e

echo "🚀 LumiAI Docker Setup"
echo "======================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before running the application"
    echo "   Required: API keys, database passwords, JWT secret"
fi

# Function to start development environment
start_dev() {
    echo "🔧 Starting development environment..."
    echo "This includes: MySQL, Redis, phpMyAdmin, Redis Commander"
    
    docker-compose -f docker-compose.dev.yml up -d
    
    echo ""
    echo "✅ Development services started!"
    echo "📊 phpMyAdmin: http://localhost:8081"
    echo "🔴 Redis Commander: http://localhost:8082"
    echo "🗄️  MySQL: localhost:3306"
    echo "🔴 Redis: localhost:6379"
    echo ""
    echo "Now you can run your backend and frontend locally:"
    echo "Backend: cd API && ./mvnw spring-boot:run"
    echo "Frontend: cd Frontend && npm run dev"
}

# Function to start full production environment
start_prod() {
    echo "🚀 Starting production environment..."
    echo "This includes: MySQL, Redis, Backend API, Frontend"
    
    # Build and start all services
    docker-compose up --build -d
    
    echo ""
    echo "✅ Production environment started!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080"
    echo "🗄️  MySQL: localhost:3306"
    echo "🔴 Redis: localhost:6379"
}

# Function to stop all services
stop_all() {
    echo "🛑 Stopping all Docker services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ All services stopped"
}

# Function to clean up Docker resources
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans
    docker system prune -f
    echo "✅ Cleanup completed"
}

# Function to show logs
show_logs() {
    echo "📋 Showing Docker logs..."
    docker-compose logs -f
}

# Function to show status
show_status() {
    echo "📊 Docker Services Status:"
    echo "=========================="
    docker-compose ps
    echo ""
    echo "Development Services:"
    docker-compose -f docker-compose.dev.yml ps
}

# Main menu
case "${1:-menu}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_all
        ;;
    "cleanup")
        cleanup
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "menu"|*)
        echo ""
        echo "Available commands:"
        echo "  dev     - Start development environment (databases only)"
        echo "  prod    - Start full production environment"
        echo "  stop    - Stop all services"
        echo "  cleanup - Clean up all Docker resources"
        echo "  logs    - Show service logs"
        echo "  status  - Show services status"
        echo ""
        echo "Usage: $0 [command]"
        echo "Example: $0 dev"
        ;;
esac