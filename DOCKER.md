# 🐳 Docker Setup Guide for LumiAI

This guide provides comprehensive instructions for running LumiAI using Docker.

## 📋 Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** v2.0 or higher
- **Git** for cloning the repository
- At least **4GB RAM** and **10GB disk space**

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/LumiAI.git
cd LumiAI
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file with your configuration:
```env
# Required: Set secure passwords
MYSQL_ROOT_PASSWORD=your-secure-root-password
MYSQL_PASSWORD=your-secure-user-password
REDIS_PASSWORD=your-secure-redis-password

# Required: Set JWT secret (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Required: Add your API keys
STABILITY_API_KEY=sk-your-stability-api-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=your-google-client-id

# Optional: Add other services
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud
RAZORPAY_KEY_ID=rzp_test_your-key-id
```

### 3. Choose Your Setup

#### Option A: Development Environment
```bash
# Windows
scripts\docker-setup.bat dev

# Linux/Mac
./scripts/docker-setup.sh dev
```

#### Option B: Production Environment
```bash
# Windows
scripts\docker-setup.bat prod

# Linux/Mac
./scripts/docker-setup.sh prod
```

## 🏗️ Architecture

### Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **frontend** | 3000 | React application (Nginx) |
| **backend** | 8080 | Spring Boot API |
| **mysql** | 3306 | MySQL database |
| **redis** | 6379 | Redis cache |
| **phpmyadmin** | 8081 | Database management (dev only) |
| **redis-commander** | 8082 | Redis management (dev only) |

### Network Architecture
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React/Nginx) │◄──►│   (Spring Boot) │
│   Port: 3000    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐    ┌─────────────────┐
         │   MySQL         │    │   Redis         │
         │   Port: 3306    │    │   Port: 6379    │
         └─────────────────┘    └─────────────────┘
```

## 📁 Docker Files Structure

```
LumiAI/
├── Dockerfile                    # Multi-stage build (legacy)
├── docker-compose.yml           # Production environment
├── docker-compose.dev.yml       # Development environment
├── .dockerignore               # Docker ignore rules
├── docker/
│   ├── nginx.conf              # Nginx configuration
│   └── start.sh               # Container startup script
├── API/
│   ├── Dockerfile             # Backend container
│   └── .dockerignore         # Backend ignore rules
├── Frontend/
│   ├── Dockerfile            # Frontend container
│   ├── .dockerignore        # Frontend ignore rules
│   └── docker/
│       └── nginx.conf       # Frontend Nginx config
└── scripts/
    ├── docker-setup.sh      # Linux/Mac setup script
    └── docker-setup.bat     # Windows setup script
```

## 🔧 Configuration Details

### Environment Variables

#### Root `.env` (Docker Compose)
```env
# Database
MYSQL_ROOT_PASSWORD=secure-root-password
MYSQL_PASSWORD=secure-user-password

# Security
JWT_SECRET=your-jwt-secret-minimum-32-characters
REDIS_PASSWORD=secure-redis-password

# AI Services
STABILITY_API_KEY=sk-your-stability-key
GEMINI_API_KEY=your-gemini-key
REPLICATE_API_KEY=r8_your-replicate-key

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Cloud Services
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment
RAZORPAY_KEY_ID=rzp_test_your-key
RAZORPAY_KEY_SECRET=your-secret

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Docker Compose Profiles

#### Development Profile (`docker-compose.dev.yml`)
- **MySQL**: Database server
- **Redis**: Cache server
- **phpMyAdmin**: Database management UI
- **Redis Commander**: Redis management UI

Use this when you want to run backend and frontend locally but use containerized databases.

#### Production Profile (`docker-compose.yml`)
- **All development services**
- **Backend**: Containerized Spring Boot API
- **Frontend**: Containerized React app with Nginx

Use this for full containerized deployment.

## 🛠️ Management Commands

### Using Setup Scripts

#### Windows (`scripts\docker-setup.bat`)
```cmd
REM Start development environment
scripts\docker-setup.bat dev

REM Start production environment
scripts\docker-setup.bat prod

REM View status
scripts\docker-setup.bat status

REM View logs
scripts\docker-setup.bat logs

REM Stop all services
scripts\docker-setup.bat stop

REM Clean up everything
scripts\docker-setup.bat cleanup
```

#### Linux/Mac (`scripts/docker-setup.sh`)
```bash
# Start development environment
./scripts/docker-setup.sh dev

# Start production environment
./scripts/docker-setup.sh prod

# View status
./scripts/docker-setup.sh status

# View logs
./scripts/docker-setup.sh logs

# Stop all services
./scripts/docker-setup.sh stop

# Clean up everything
./scripts/docker-setup.sh cleanup
```

### Manual Docker Compose Commands

```bash
# Development environment
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down

# Production environment
docker-compose up --build -d
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec mysql mysql -u root -p

# Scale services
docker-compose up --scale backend=2 -d
```

## 🔍 Monitoring and Debugging

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health checks
curl http://localhost:8080/api/v1/health  # Backend
curl http://localhost:3000                # Frontend
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Database Access

```bash
# Access MySQL via phpMyAdmin
# http://localhost:8081
# Username: root
# Password: [MYSQL_ROOT_PASSWORD from .env]

# Access MySQL via command line
docker-compose exec mysql mysql -u root -p

# Access Redis via Redis Commander
# http://localhost:8082

# Access Redis via command line
docker-compose exec redis redis-cli -a [REDIS_PASSWORD]
```

## 🚀 Production Deployment

### 1. Server Setup

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/LumiAI.git
cd LumiAI

# Setup production environment
cp .env.example .env
# Edit .env with production values

# Deploy
docker-compose up --build -d

# Setup SSL (optional, using Let's Encrypt)
# Add reverse proxy configuration
```

### 3. Production Optimizations

#### Docker Compose Override
Create `docker-compose.override.yml`:
```yaml
version: '3.8'
services:
  frontend:
    restart: always
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  backend:
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: production
      JAVA_OPTS: "-Xmx1g -Xms512m"
    deploy:
      resources:
        limits:
          memory: 1.5G
        reservations:
          memory: 1G

  mysql:
    restart: always
    volumes:
      - /opt/lumiai/mysql:/var/lib/mysql
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  redis:
    restart: always
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Solution: Stop conflicting services or change ports
```

#### 2. Permission Issues (Linux/Mac)
```bash
# Fix ownership
sudo chown -R $USER:$USER .

# Make scripts executable
chmod +x scripts/docker-setup.sh
```

#### 3. Out of Memory
```bash
# Check Docker resource usage
docker stats

# Increase Docker Desktop memory limit
# Docker Desktop → Settings → Resources → Memory
```

#### 4. Database Connection Issues
```bash
# Check MySQL logs
docker-compose logs mysql

# Reset database
docker-compose down -v
docker-compose up mysql -d

# Wait for MySQL to be ready
docker-compose exec mysql mysqladmin ping -h localhost
```

#### 5. Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build --no-cache -t test ./API
```

### Performance Optimization

#### 1. Build Optimization
```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker-compose build

# Multi-stage build caching
docker build --target builder ./API
```

#### 2. Resource Limits
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

#### 3. Volume Optimization
```bash
# Use named volumes for better performance
volumes:
  mysql_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/lumiai/mysql
```

## 📊 Monitoring

### Basic Monitoring
```bash
# Resource usage
docker stats

# Service status
docker-compose ps

# Health checks
docker-compose exec backend curl -f http://localhost:8080/api/v1/health
```

### Advanced Monitoring (Optional)
Consider adding monitoring stack:
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Loki**: Log aggregation
- **cAdvisor**: Container metrics

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use strong passwords (minimum 16 characters)
- Rotate secrets regularly

### 2. Network Security
```yaml
# Restrict external access
services:
  mysql:
    ports: []  # Remove external port mapping
    expose:
      - "3306"  # Only internal access
```

### 3. Container Security
```dockerfile
# Use non-root user
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring
```

### 4. Production Hardening
- Use specific image tags (not `latest`)
- Enable Docker Content Trust
- Regular security updates
- Implement proper backup strategy

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [React Docker Deployment](https://create-react-app.dev/docs/deployment/#docker)

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review Docker logs: `docker-compose logs`
3. Check service health: `docker-compose ps`
4. Open an issue on GitHub with:
   - Docker version: `docker --version`
   - Docker Compose version: `docker-compose --version`
   - Error logs and steps to reproduce