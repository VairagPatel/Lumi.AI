# 🎨 LumiAI - AI-Powered Image Generation Platform

<div align="center">

![LumiAI Logo](https://img.shields.io/badge/LumiAI-v2.0.0-00E5A0?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-6DB33F?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Transform your imagination into stunning visuals with the power of AI**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🐳 Docker Setup](#-docker-setup) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Overview

LumiAI is a cutting-edge, full-stack web application that harnesses the power of artificial intelligence to transform text prompts into breathtaking images. Built with modern technologies like React 19 and Spring Boot 3, it delivers a seamless user experience with robust authentication, fair credit-based usage, and an elegant mint-themed interface.

### 🎯 Key Highlights
- **AI-Powered Generation**: Multiple AI providers (Stability AI, Gemini, Replicate)
- **Modern Architecture**: React 19 + Spring Boot 3 + MySQL + Redis
- **Production Ready**: Full Docker containerization with development and production environments
- **Secure & Scalable**: JWT authentication, OAuth integration, and credit-based system
- **Beautiful UI/UX**: Responsive design with smooth animations and accessibility features

## 🌟 Features

### 🎨 Core Functionality
- **AI Image Generation**: Transform text prompts into high-quality images using multiple AI providers
- **Multiple AI Models**: Support for Stability AI, Google Gemini, and Replicate
- **Image-to-Image**: Transform existing images with AI-powered modifications
- **Real-time Processing**: Live feedback and progress indicators during generation
- **High-Quality Output**: Generate images in various resolutions and styles

### 🔐 Authentication & Security
- **Secure Authentication**: Email/password and Google OAuth integration
- **JWT Token System**: Secure, stateless authentication with refresh tokens
- **Protected Routes**: Role-based access control and route protection
- **Password Security**: BCrypt hashing and secure password policies

### 💳 Credit System & Payments
- **Fair Usage Model**: Credit-based system for sustainable usage
- **Razorpay Integration**: Secure payment processing for credit purchases
- **Flexible Pricing**: Multiple credit packages to suit different needs
- **Real-time Sync**: Automatic credit balance updates across the platform

### 🎨 User Experience
- **Modern UI/UX**: Clean, mint-themed interface with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance Optimized**: Fast loading times with efficient caching and lazy loading
- **Cross-browser Support**: Compatible with Chrome, Firefox, Safari, and Edge

### 🛠️ Developer Features
- **Full Docker Support**: Complete containerization for easy deployment
- **Development Environment**: Hot reload, debugging tools, and development databases
- **API Documentation**: Comprehensive REST API with OpenAPI/Swagger documentation
- **Testing Suite**: Unit tests, integration tests, and end-to-end testing
- **CI/CD Ready**: GitHub Actions workflows and deployment scripts

## 🚀 Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.12-06B6D4?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.12-0055FF?style=flat-square&logo=framer)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-6DB33F?style=flat-square&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)
![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=flat-square&logo=redis)

### DevOps & Tools
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=flat-square&logo=docker)
![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?style=flat-square&logo=apache-maven)
![Nginx](https://img.shields.io/badge/Nginx-1.25-009639?style=flat-square&logo=nginx)

</div>

### 🎨 Frontend Technologies
- **React 19.1.0** - Latest React with concurrent features and improved performance
- **Vite 6.3.5** - Lightning-fast build tool and development server
- **Tailwind CSS 4.1.12** - Utility-first CSS framework for rapid UI development
- **Framer Motion 12.23.12** - Production-ready motion library for smooth animations
- **React Router 7.8.2** - Declarative routing for React applications
- **Zustand 5.0.2** - Lightweight state management solution
- **Axios 1.11.0** - Promise-based HTTP client for API communication
- **React Hot Toast 2.4.1** - Beautiful, customizable toast notifications

### ⚙️ Backend Technologies
- **Spring Boot 3.5.0** - Enterprise-grade Java framework with auto-configuration
- **Spring Security** - Comprehensive security framework for authentication and authorization
- **Spring Data JPA** - Simplified data access layer with repository pattern
- **MySQL 8.0** - Reliable relational database with advanced features
- **Redis** - In-memory data structure store for caching and session management
- **JWT (JSON Web Tokens)** - Stateless authentication mechanism
- **Maven** - Dependency management and build automation

### 🔌 External Integrations
- **Stability AI** - High-quality image generation API
- **Google Gemini** - Advanced AI model for image processing
- **Replicate** - Cloud platform for running machine learning models
- **Razorpay** - Secure payment gateway for credit purchases
- **Cloudinary** - Cloud-based image and video management
- **Google OAuth** - Secure authentication via Google accounts

### 🛠️ Development Tools
- **ESLint** - Code linting and style enforcement
- **Vitest** - Fast unit testing framework for Vite projects
- **Testing Library** - Simple and complete testing utilities for React
- **Docker & Docker Compose** - Containerization and orchestration
- **OpenAPI/Swagger** - API documentation and testing interface

## 📖 Documentation

### 📚 Comprehensive Guides

| Guide | Description | Link |
|-------|-------------|------|
| **🐳 Docker Setup** | Complete containerization guide with troubleshooting | [DOCKER.md](DOCKER.md) |
| **💳 Payment Setup** | Razorpay integration and credit system configuration | [PAYMENT_SETUP.md](PAYMENT_SETUP.md) |
| **🧪 Testing Guide** | Testing procedures and validation steps | [TESTING_GUIDE.md](TESTING_GUIDE.md) |
| **🔧 API Documentation** | Interactive API docs | http://localhost:8080/swagger-ui.html |

### 🏗️ Project Architecture

```
LumiAI/
├── 🎨 Frontend/                 # React 19 application
│   ├── public/                  # Static assets and PWA files
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/             # Base components (Button, Input, Modal)
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── generation/     # Image generation components
│   │   │   └── layout/         # Layout and navigation components
│   │   ├── pages/              # Route-based page components
│   │   ├── context/            # React context providers
│   │   ├── store/              # Zustand state management
│   │   ├── services/           # API service functions
│   │   ├── utils/              # Utility functions and helpers
│   │   ├── hooks/              # Custom React hooks
│   │   └── tests/              # Component and integration tests
│   └── 📦 Configuration files   # Vite, Tailwind, ESLint configs
├── ⚙️ API/                      # Spring Boot 3 backend
│   ├── src/main/java/
│   │   ├── config/             # Spring configuration classes
│   │   ├── controller/         # REST API controllers
│   │   ├── service/            # Business logic services
│   │   ├── repository/         # Data access layer
│   │   ├── entity/             # JPA entities
│   │   ├── dto/                # Data transfer objects
│   │   ├── security/           # Security configuration
│   │   └── exception/          # Exception handling
│   ├── src/main/resources/     # Configuration files and SQL scripts
│   └── src/test/               # Unit and integration tests
├── 🐳 Docker Configuration      # Containerization files
│   ├── docker-compose.yml      # Production environment
│   ├── docker-compose.dev.yml  # Development environment
│   ├── Dockerfile              # Multi-stage application build
│   └── docker/                 # Docker-specific configurations
├── 📜 scripts/                  # Automation and utility scripts
└── 📋 Documentation            # Project documentation files
```

### 🔌 API Endpoints

#### Authentication
```http
POST   /api/v1/auth/signup      # User registration
POST   /api/v1/auth/login       # User authentication
POST   /api/v1/auth/google      # Google OAuth login
POST   /api/v1/auth/refresh     # JWT token refresh
GET    /api/v1/auth/profile     # Get user profile
PUT    /api/v1/auth/profile     # Update user profile
```

#### Image Generation
```http
POST   /api/v1/generate/text-to-image    # Generate image from text
POST   /api/v1/generate/image-to-image   # Transform existing image
GET    /api/v1/generate/history          # Get generation history
GET    /api/v1/generate/{id}             # Get specific generation
DELETE /api/v1/generate/{id}             # Delete generation
```

#### Credit Management
```http
GET    /api/v1/credits/balance           # Get current credit balance
POST   /api/v1/credits/purchase          # Purchase credit package
GET    /api/v1/credits/history           # Get credit transaction history
```

#### Payment Processing
```http
POST   /api/v1/payment/create-order      # Create Razorpay order
POST   /api/v1/payment/verify            # Verify payment signature
GET    /api/v1/payment/status            # Check payment service status
```

## 🚀 Quick Start

Get LumiAI running in minutes with Docker! Choose between development or production setup.

### 📋 Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux) - v20.10+
- **Docker Compose** - v2.0+
- **Git** - For cloning the repository
- **4GB RAM** and **10GB disk space** minimum

### ⚡ One-Command Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/LumiAI.git
cd LumiAI

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys and credentials

# Start development environment (recommended for first-time users)
docker-compose -f docker-compose.dev.yml up -d

# OR start full production environment
docker-compose up -d --build
```

### 🌐 Access Your Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application interface |
| **Backend API** | http://localhost:8080 | REST API endpoints |
| **API Documentation** | http://localhost:8080/swagger-ui.html | Interactive API docs |
| **phpMyAdmin** | http://localhost:8081 | Database management (dev only) |
| **Redis Commander** | http://localhost:8082 | Redis management (dev only) |

### 🔑 Required Configuration

Before starting, you'll need to configure these essential services in your `.env` file:

```env
# Database Security
MYSQL_ROOT_PASSWORD=your-secure-root-password
MYSQL_PASSWORD=your-secure-user-password

# JWT Security (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# AI Image Generation (choose at least one)
STABILITY_API_KEY=sk-your-stability-api-key
GEMINI_API_KEY=your-gemini-api-key
REPLICATE_API_KEY=r8_your-replicate-token

# Google OAuth (for social login)
GOOGLE_CLIENT_ID=your-google-client-id

# Payment Processing (for credit purchases)
RAZORPAY_KEY_ID=rzp_test_your-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

> 📖 **Need detailed setup instructions?** Check out our comprehensive [Docker Setup Guide](DOCKER.md) and [Payment Setup Guide](PAYMENT_SETUP.md).

## 🐳 Docker Setup

LumiAI is fully containerized for easy deployment and development. We provide two Docker environments:

### 🔧 Development Environment
Perfect for development with hot reload and debugging tools:

```bash
# Start databases and management tools only
docker-compose -f docker-compose.dev.yml up -d

# Run frontend and backend locally for development
cd Frontend && npm run dev    # Terminal 1
cd API && ./mvnw spring-boot:run    # Terminal 2
```

**Includes:**
- MySQL database with phpMyAdmin (http://localhost:8081)
- Redis cache with Redis Commander (http://localhost:8082)
- Volume mounts for data persistence
- Development-optimized configurations

### 🚀 Production Environment
Complete containerized deployment:

```bash
# Build and start all services
docker-compose up -d --build
```

**Includes:**
- All development services
- Containerized React frontend with Nginx
- Containerized Spring Boot backend
- Production-optimized builds and configurations
- Health checks and restart policies

### 📊 Service Management

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Scale services
docker-compose up --scale backend=2 -d

# Stop all services
docker-compose down

# Clean up (removes volumes)
docker-compose down -v
```

> 📖 **For detailed Docker instructions, troubleshooting, and production deployment**, see our [Docker Setup Guide](DOCKER.md).

## 🔧 Configuration

### Environment Variables

#### Root Level (.env)
Used by Docker Compose for all services:
```env
# Database Configuration
MYSQL_ROOT_PASSWORD=secure-root-password
MYSQL_PASSWORD=secure-user-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-256-bits-long

# API Keys
STABILITY_API_KEY=sk-your-stability-api-key
GEMINI_API_KEY=your-gemini-api-key
REPLICATE_API_KEY=r8_your-replicate-token

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Redis Configuration
REDIS_PASSWORD=secure-redis-password

# Razorpay (Payment)
RAZORPAY_KEY_ID=rzp_test_your-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

#### Backend (.env in API folder) - For Local Development
```env
# Database Configuration
MYSQL_DATABASE=lumiaidb
MYSQL_USER=lumiuser
MYSQL_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters

# Image Provider
IMAGE_PROVIDER=stability

# API Keys
STABILITY_API_KEY=your_stability_api_key
GEMINI_API_KEY=your_gemini_api_key
REPLICATE_API_KEY=your_replicate_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Razorpay
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

#### Frontend (.env in Frontend folder) - For Local Development
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# App Configuration
VITE_APP_NAME=LumiAI
VITE_APP_VERSION=2.0.0
```

## 🎯 Usage

### 👤 For End Users

#### 1. **Getting Started**
- Visit http://localhost:3000
- Sign up with email/password or use Google OAuth
- New users receive **15 free credits** to start generating images

#### 2. **Generate Images**
- Navigate to the **Create** page
- Enter a descriptive text prompt (e.g., "A serene mountain landscape at sunset")
- Choose your preferred AI model and settings
- Click **Generate** to create your image (costs 1 credit)
- Download or share your generated images

#### 3. **Manage Your Account**
- View your **Profile** to see remaining credits and generation history
- Purchase additional credits through secure Razorpay integration
- Browse your **Gallery** to view all generated images
- Track your usage and credit transactions

### 👨‍💻 For Developers

#### 🧪 Running Tests
```bash
# Frontend tests
cd Frontend
npm run test              # Run once
npm run test:watch        # Watch mode

# Backend tests
cd API
./mvnw test              # Unit tests
./mvnw verify            # Integration tests
```

#### 🏗️ Building for Production
```bash
# Build frontend
cd Frontend
npm run build
# Output: dist/ folder ready for deployment

# Build backend
cd API
./mvnw clean package
# Output: target/lumiai-api-*.jar
```

#### 🔍 Code Quality
```bash
# Frontend linting and formatting
cd Frontend
npm run lint             # Check code style
npm run lint:fix         # Auto-fix issues

# Backend code analysis
cd API
./mvnw checkstyle:check  # Code style check
./mvnw spotbugs:check    # Bug detection
```

#### 🔧 Development Tools
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Access development tools
# - phpMyAdmin: http://localhost:8081
# - Redis Commander: http://localhost:8082
# - API Documentation: http://localhost:8080/swagger-ui.html

# Monitor logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🎨 Design System & UI

### 🎨 Color Palette
```css
/* Primary Colors */
--mint-primary: #00E5A0      /* Main brand color */
--mint-secondary: #00C4CC    /* Secondary accent */
--mint-dark: #0D1B2A         /* Dark navy blue */
--mint-light: #F8FAFC        /* Off white background */

/* Semantic Colors */
--success: #10B981           /* Success states */
--warning: #F59E0B           /* Warning states */
--error: #EF4444             /* Error states */
--info: #3B82F6              /* Information states */
```

### 📝 Typography
- **Font Family**: Inter (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI")
- **Headings**: Inter with font weights 600-800
- **Body Text**: Inter with font weights 400-500
- **Code**: Fira Code, Monaco, Consolas (monospace)

### 🧩 Component System
All UI components follow a consistent design system:

- **Spacing**: 4px grid system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)
- **Border Radius**: 8px (small), 12px (medium), 16px (large), 24px (extra large)
- **Shadows**: Layered shadow system for depth and elevation
- **Animations**: 200-300ms duration with easing functions
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios

### 📱 Responsive Breakpoints
```css
/* Mobile First Approach */
sm: 640px    /* Small devices (landscape phones) */
md: 768px    /* Medium devices (tablets) */
lg: 1024px   /* Large devices (laptops) */
xl: 1280px   /* Extra large devices (desktops) */
2xl: 1536px  /* 2X large devices (large desktops) */
```

## 🔒 Security & Performance

### 🛡️ Security Features
- **JWT Authentication**: Secure, stateless token-based authentication with refresh tokens
- **Password Security**: BCrypt hashing with salt rounds for password protection
- **OAuth Integration**: Secure Google OAuth 2.0 implementation
- **CORS Protection**: Properly configured Cross-Origin Resource Sharing
- **Input Validation**: Comprehensive server-side validation and sanitization
- **Rate Limiting**: API endpoint protection against abuse and DDoS
- **SQL Injection Prevention**: Parameterized queries and JPA protection
- **XSS Protection**: Content Security Policy and input sanitization
- **HTTPS Ready**: SSL/TLS configuration for production deployment

### ⚡ Performance Optimizations
- **Frontend Performance**:
  - Code splitting and lazy loading for optimal bundle sizes
  - Image optimization with WebP format and responsive loading
  - Service Worker for caching and offline functionality
  - Virtual scrolling for large lists and galleries
  - Debounced search and input handling

- **Backend Performance**:
  - Redis caching for frequently accessed data
  - Database query optimization with proper indexing
  - Connection pooling for database efficiency
  - Async processing for image generation tasks
  - Response compression and caching headers

- **Infrastructure Performance**:
  - Docker multi-stage builds for smaller image sizes
  - Nginx reverse proxy with gzip compression
  - CDN integration for static asset delivery
  - Database connection pooling and optimization

## 📱 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup     # User registration
POST /api/auth/login      # User login
POST /api/auth/google     # Google OAuth login
POST /api/auth/refresh    # Refresh JWT token
```

### User Endpoints
```
GET  /api/user/profile    # Get user profile
PUT  /api/user/profile    # Update user profile
GET  /api/user/credits    # Get user credits
POST /api/user/credits    # Purchase credits
```

### Image Generation Endpoints
```
POST /api/generate/image  # Generate image from prompt
GET  /api/generate/history # Get generation history
GET  /api/generate/{id}   # Get specific generation
```

## 🧪 Testing & Quality Assurance

### 🔬 Testing Strategy

#### Frontend Testing
```bash
cd Frontend

# Unit Tests - Component logic and utilities
npm run test

# Watch Mode - Continuous testing during development
npm run test:watch

# Coverage Report - Generate test coverage statistics
npm run test:coverage
```

**Testing Stack:**
- **Vitest** - Fast unit testing framework
- **Testing Library** - React component testing utilities
- **jsdom** - DOM simulation for testing
- **User Event** - User interaction simulation

#### Backend Testing
```bash
cd API

# Unit Tests - Service layer and business logic
./mvnw test

# Integration Tests - Database and API integration
./mvnw verify

# Test with Coverage - Generate coverage reports
./mvnw test jacoco:report
```

**Testing Stack:**
- **JUnit 5** - Modern testing framework for Java
- **Spring Boot Test** - Integration testing support
- **Testcontainers** - Database integration testing
- **MockMvc** - Web layer testing
- **Mockito** - Mocking framework

### 🐳 Docker Testing
```bash
# Test Docker builds
docker-compose build --no-cache

# Run tests in containers
docker-compose run --rm backend ./mvnw test
docker-compose run --rm frontend npm test

# Health checks and service validation
docker-compose ps
curl http://localhost:8080/api/v1/health
curl http://localhost:3000
```

### 📊 Quality Metrics
- **Code Coverage**: Minimum 80% for critical paths
- **Performance**: Page load times under 2 seconds
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Regular dependency vulnerability scans
- **API Response**: Average response time under 200ms

## 🐛 Troubleshooting

### 🔧 Common Issues & Solutions

<details>
<summary><strong>🐳 Docker Issues</strong></summary>

#### Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Stop conflicting services
sudo service mysql stop  # Linux
brew services stop mysql  # Mac
```

#### Container Won't Start
```bash
# Check logs for specific service
docker-compose logs mysql
docker-compose logs backend

# Restart specific service
docker-compose restart backend

# Rebuild and restart
docker-compose up --build backend
```

#### Database Connection Issues
```bash
# Check if MySQL is ready
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"

# Reset database (WARNING: This deletes all data)
docker-compose down -v
docker-compose up mysql -d
```

#### Out of Disk Space
```bash
# Clean up Docker resources
docker system prune -a
docker volume prune

# Remove unused images
docker image prune -a
```

</details>

<details>
<summary><strong>🔌 API Connection Issues</strong></summary>

#### Frontend Can't Connect to Backend
1. **Check Backend Status**:
   ```bash
   curl http://localhost:8080/api/v1/health
   ```

2. **Verify Environment Variables**:
   - Check `VITE_API_BASE_URL` in Frontend/.env
   - Ensure backend is running on correct port

3. **CORS Issues**:
   - Check browser console for CORS errors
   - Verify CORS configuration in backend

#### API Key Issues
1. **Check API Key Format**:
   - Stability AI: Should start with `sk-`
   - Razorpay: Test keys start with `rzp_test_`
   - Google Client ID: Should be a long string ending with `.apps.googleusercontent.com`

2. **Test API Keys**:
   ```bash
   curl http://localhost:8080/api/v1/payment/status
   ```

</details>

<details>
<summary><strong>💳 Payment Issues</strong></summary>

#### Payment Service Not Available
1. **Check Razorpay Credentials**:
   ```bash
   # Test credentials endpoint
   curl http://localhost:8080/api/v1/payment/status
   ```

2. **Verify Environment Variables**:
   - Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
   - Check for extra spaces or incorrect format

#### Credits Not Updating
1. **Check Payment Logs**:
   ```bash
   docker-compose logs backend | grep -i payment
   ```

2. **Verify Database**:
   - Access phpMyAdmin at http://localhost:8081
   - Check `users` table for credit balance
   - Check `payment_transactions` table for payment records

</details>

<details>
<summary><strong>🖼️ Image Generation Issues</strong></summary>

#### Generation Fails
1. **Check AI Service Status**:
   - Verify API keys are valid and have sufficient quota
   - Check service-specific error messages in logs

2. **Check Credit Balance**:
   - Ensure user has sufficient credits
   - Verify credit deduction logic

#### Images Not Displaying
1. **Check Cloudinary Configuration**:
   - Verify `CLOUDINARY_*` environment variables
   - Test image upload functionality

2. **Check Network Issues**:
   - Verify image URLs are accessible
   - Check browser network tab for failed requests

</details>

### 🔍 Debugging Tools

#### Backend Debugging
```bash
# Enable debug logging
# Add to API/.env:
LOGGING_LEVEL_ROOT=DEBUG

# View detailed logs
docker-compose logs -f backend

# Access application metrics
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/metrics
```

#### Frontend Debugging
```bash
# Enable development mode
cd Frontend
npm run dev

# Check browser console (F12)
# Check Network tab for API calls
# Use React Developer Tools extension
```

#### Database Debugging
```bash
# Access MySQL directly
docker-compose exec mysql mysql -u root -p

# Check database structure
SHOW DATABASES;
USE lumiaidb;
SHOW TABLES;
DESCRIBE users;

# Check recent transactions
SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 10;
```

### 📞 Getting Help

If you're still experiencing issues:

1. **Check Existing Issues**: Search [GitHub Issues](https://github.com/yourusername/LumiAI/issues)
2. **Create New Issue**: Include:
   - Operating system and version
   - Docker version (`docker --version`)
   - Error logs and screenshots
   - Steps to reproduce the issue
3. **Join Community**: Discord server link in repository
4. **Documentation**: Review our comprehensive guides:
   - [Docker Setup Guide](DOCKER.md)
   - [Payment Setup Guide](PAYMENT_SETUP.md)
   - [Testing Guide](TESTING_GUIDE.md)

## 🚀 Deployment & Production

### 🐳 Docker Deployment (Recommended)

#### Quick Production Deployment
```bash
# Clone and configure
git clone https://github.com/yourusername/LumiAI.git
cd LumiAI

# Setup production environment
cp .env.example .env
# Edit .env with production values (secure passwords, API keys, etc.)

# Deploy with Docker Compose
docker-compose up --build -d

# Verify deployment
docker-compose ps
curl http://localhost:8080/api/v1/health
```

#### Production Environment Variables
```env
# Security (Use strong, unique values)
MYSQL_ROOT_PASSWORD=super-secure-root-password-min-16-chars
MYSQL_PASSWORD=secure-user-password-min-16-chars
JWT_SECRET=your-production-jwt-secret-minimum-32-characters-long
REDIS_PASSWORD=secure-redis-password-min-16-chars

# AI Services (Production API keys)
STABILITY_API_KEY=sk-your-production-stability-key
GEMINI_API_KEY=your-production-gemini-key
REPLICATE_API_KEY=r8_your-production-replicate-key

# OAuth (Production client ID)
GOOGLE_CLIENT_ID=your-production-google-client-id

# Payment (Live Razorpay credentials)
RAZORPAY_KEY_ID=rzp_live_your-production-key-id
RAZORPAY_KEY_SECRET=your-production-razorpay-secret

# Cloud Storage (Production Cloudinary)
CLOUDINARY_CLOUD_NAME=your-production-cloud-name
CLOUDINARY_API_KEY=your-production-api-key
CLOUDINARY_API_SECRET=your-production-api-secret
```

### ☁️ Cloud Platform Deployment

#### Frontend Deployment (Vercel/Netlify)
```bash
cd Frontend

# Build for production
npm run build

# Deploy dist/ folder to your preferred platform
# Set environment variables in platform dashboard:
# VITE_API_BASE_URL=https://your-api-domain.com/api/v1
# VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
```

#### Backend Deployment (AWS/DigitalOcean/Heroku)
```bash
cd API

# Build JAR file
./mvnw clean package -DskipTests

# Deploy target/lumiai-api-*.jar
# Set environment variables in your cloud platform
```

#### Container Registry Deployment
```bash
# Build and tag images
docker build -t your-registry/lumiai-frontend:latest ./Frontend
docker build -t your-registry/lumiai-backend:latest ./API

# Push to registry
docker push your-registry/lumiai-frontend:latest
docker push your-registry/lumiai-backend:latest

# Deploy using Kubernetes, Docker Swarm, or cloud container services
```

### 🔧 Production Optimizations

#### Performance Tuning
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  frontend:
    restart: always
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  backend:
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: production
      JAVA_OPTS: "-Xmx1g -Xms512m -XX:+UseG1GC"
    deploy:
      resources:
        limits:
          memory: 1.5G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  mysql:
    restart: always
    volumes:
      - /opt/lumiai/mysql:/var/lib/mysql
    command: --innodb-buffer-pool-size=512M
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

#### SSL/HTTPS Setup
```nginx
# nginx.conf for HTTPS
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 📊 Monitoring & Maintenance

#### Health Monitoring
```bash
# Service health checks
curl -f http://localhost:8080/api/v1/health
curl -f http://localhost:3000

# Database connectivity
docker-compose exec mysql mysqladmin ping

# Redis connectivity
docker-compose exec redis redis-cli ping
```

#### Log Management
```bash
# View application logs
docker-compose logs -f --tail=100 backend
docker-compose logs -f --tail=100 frontend

# Log rotation (add to crontab)
docker system prune -f --filter "until=24h"
```

#### Backup Strategy
```bash
# Database backup
docker-compose exec mysql mysqldump -u root -p lumiaidb > backup_$(date +%Y%m%d).sql

# Volume backup
docker run --rm -v lumiai_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup_$(date +%Y%m%d).tar.gz /data
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help make LumiAI better.

### 🚀 Getting Started

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/LumiAI.git
   cd LumiAI
   ```

2. **Set Up Development Environment**
   ```bash
   # Start development services
   docker-compose -f docker-compose.dev.yml up -d
   
   # Install dependencies
   cd Frontend && npm install
   cd ../API && ./mvnw clean install
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

### 📝 Development Guidelines

#### Code Style
- **Frontend**: Follow ESLint configuration and Prettier formatting
- **Backend**: Follow Google Java Style Guide with Checkstyle
- **Commits**: Use [Conventional Commits](https://conventionalcommits.org/) format

#### Commit Message Format
```
type(scope): description

feat(auth): add Google OAuth integration
fix(api): resolve credit calculation bug
docs(readme): update installation instructions
test(frontend): add component unit tests
```

#### Pull Request Process
1. **Update Documentation**: Ensure README and relevant docs are updated
2. **Add Tests**: Include unit tests for new features
3. **Check CI**: Ensure all tests pass and code quality checks succeed
4. **Review Ready**: Request review from maintainers

### 🧪 Testing Your Changes

```bash
# Frontend tests
cd Frontend
npm run test
npm run lint

# Backend tests
cd API
./mvnw test
./mvnw checkstyle:check

# Integration tests
docker-compose up -d
# Test the full application flow
```

### 🐛 Bug Reports

When reporting bugs, please include:
- **Environment**: OS, Docker version, browser (if applicable)
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots/Logs**: Visual evidence or error logs

### 💡 Feature Requests

For new features, please:
- **Check Existing Issues**: Avoid duplicates
- **Provide Context**: Explain the use case and benefits
- **Consider Implementation**: Suggest how it might work
- **Discuss First**: Open an issue before starting work

### 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - Critical issues

### 👥 Community

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Discord**: Join our community server (link in issues)
- **Code of Conduct**: Be respectful and inclusive

### 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **🎨 UI/UX Improvements**: Better user experience and design
- **🔧 Performance Optimization**: Frontend and backend performance
- **🧪 Testing**: Increase test coverage and add E2E tests
- **📚 Documentation**: Improve guides and API documentation
- **🌐 Internationalization**: Multi-language support
- **♿ Accessibility**: WCAG compliance improvements
- **🔒 Security**: Security audits and improvements

### 🏆 Recognition

Contributors will be:
- Listed in our Contributors section
- Mentioned in release notes for significant contributions
- Invited to join our contributor Discord channel

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📜 License Summary
- ✅ **Commercial Use** - Use for commercial purposes
- ✅ **Modification** - Modify the source code
- ✅ **Distribution** - Distribute the software
- ✅ **Private Use** - Use privately
- ❌ **Liability** - No warranty or liability
- ❌ **Warranty** - No warranty provided

## 🙏 Acknowledgments

We extend our gratitude to the amazing open-source community and the following projects that make LumiAI possible:

### 🛠️ Core Technologies
- **[React Team](https://reactjs.org/)** - For the incredible React framework and ecosystem
- **[Spring Team](https://spring.io/)** - For the robust Spring Boot framework
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - For the lightning-fast build tool

### 🎨 UI & Design
- **[Framer Motion](https://www.framer.com/motion/)** - For beautiful, smooth animations
- **[Lucide Icons](https://lucide.dev/)** - For the comprehensive icon library
- **[Headless UI](https://headlessui.dev/)** - For accessible UI components
- **[Inter Font](https://rsms.me/inter/)** - For the beautiful typography

### 🤖 AI & Services
- **[Stability AI](https://stability.ai/)** - For cutting-edge image generation models
- **[Google AI](https://ai.google/)** - For Gemini AI integration
- **[Replicate](https://replicate.com/)** - For accessible machine learning models
- **[Cloudinary](https://cloudinary.com/)** - For image management and optimization

### 💳 Payment & Infrastructure
- **[Razorpay](https://razorpay.com/)** - For secure payment processing
- **[Docker](https://www.docker.com/)** - For containerization technology
- **[MySQL](https://www.mysql.com/)** - For reliable database management
- **[Redis](https://redis.io/)** - For high-performance caching

### 🧪 Testing & Quality
- **[Vitest](https://vitest.dev/)** - For fast and reliable testing
- **[Testing Library](https://testing-library.com/)** - For simple and complete testing utilities
- **[ESLint](https://eslint.org/)** - For code quality and consistency

## 📞 Support & Community

### 💬 Get Help
- **📧 Email**: support@lumiai.com
- **💬 Discord**: [Join our community server](https://discord.gg/lumiai)
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/LumiAI/issues)
- **💡 Discussions**: [GitHub Discussions](https://github.com/yourusername/LumiAI/discussions)

### 🌟 Stay Updated
- **⭐ Star** this repository to show your support
- **👀 Watch** for updates and new releases
- **🍴 Fork** to contribute to the project
- **📢 Follow** us on social media for updates

## 🗺️ Roadmap

### 🚀 Upcoming Features

#### Version 2.1 (Q1 2025)
- [ ] **Advanced Image Editing**: In-browser image editing tools
- [ ] **Batch Generation**: Generate multiple images from a single prompt
- [ ] **Style Presets**: Pre-configured styles for quick generation
- [ ] **Image Variations**: Generate variations of existing images

#### Version 2.2 (Q2 2025)
- [ ] **API for Developers**: Public REST API with authentication
- [ ] **Webhook Support**: Real-time notifications for integrations
- [ ] **Advanced Analytics**: Detailed usage statistics and insights
- [ ] **Team Collaboration**: Shared workspaces and team management

#### Version 3.0 (Q3 2025)
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced AI Models**: Integration with latest AI models
- [ ] **Video Generation**: AI-powered video creation capabilities
- [ ] **Enterprise Features**: SSO, advanced security, and compliance

#### Future Considerations
- [ ] **Multi-language Support**: Internationalization (i18n)
- [ ] **Plugin System**: Extensible architecture for third-party plugins
- [ ] **AI Training**: Custom model training capabilities
- [ ] **Blockchain Integration**: NFT minting and blockchain features

### 🎯 Goals
- **Performance**: Sub-second image generation times
- **Scalability**: Support for 100,000+ concurrent users
- **Accessibility**: Full WCAG 2.1 AAA compliance
- **Global Reach**: Multi-region deployment with CDN

---

<div align="center">

**Made with ❤️ by the LumiAI Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/LumiAI?style=social)](https://github.com/yourusername/LumiAI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/LumiAI?style=social)](https://github.com/yourusername/LumiAI/network/members)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/LumiAI)](https://github.com/yourusername/LumiAI/issues)
[![GitHub license](https://img.shields.io/github/license/yourusername/LumiAI)](https://github.com/yourusername/LumiAI/blob/main/LICENSE)

**[⬆ Back to Top](#-lumiai---ai-powered-image-generation-platform)**

</div>