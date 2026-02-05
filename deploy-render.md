# 🚀 Render Backend Deployment Guide

## Prerequisites
1. Render account (https://render.com)
2. GitHub repository with your code
3. Database setup (PostgreSQL recommended for production)

## Step-by-Step Deployment

### 1. Prepare Backend for Render

#### Create Render-specific application.yml
Create `API/src/main/resources/application-render.yml`:

```yaml
server:
  port: ${PORT:8080}

spring:
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 5
      minimum-idle: 1
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1200000

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD}
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0

  cache:
    type: redis
    redis:
      time-to-live: 600000

# JWT Configuration
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000
  refresh-expiration: 604800000

# API Keys
stability:
  api:
    key: ${STABILITY_API_KEY}

gemini:
  api:
    key: ${GEMINI_API_KEY}

replicate:
  api:
    key: ${REPLICATE_API_KEY}

# Google OAuth
google:
  client:
    id: ${GOOGLE_CLIENT_ID}
    secret: ${GOOGLE_CLIENT_SECRET}

# Cloudinary
cloudinary:
  cloud-name: ${CLOUDINARY_CLOUD_NAME}
  api-key: ${CLOUDINARY_API_KEY}
  api-secret: ${CLOUDINARY_API_SECRET}

# Razorpay
razorpay:
  key-id: ${RAZORPAY_KEY_ID}
  key-secret: ${RAZORPAY_KEY_SECRET}

# CORS Configuration
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000,https://your-frontend-domain.vercel.app}

logging:
  level:
    in.LumiAI.api: INFO
    org.springframework.security: INFO
    org.hibernate.SQL: WARN
```

#### Update pom.xml for PostgreSQL
Add PostgreSQL dependency to `API/pom.xml`:

```xml
<!-- Add this dependency -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2. Deploy to Render

#### Step 1: Create Web Service
1. Go to https://render.com/dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `lumiai-backend`
   - **Root Directory**: `API`
   - **Environment**: `Docker` or `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -Dspring.profiles.active=render -jar target/*.jar`

#### Step 2: Configure Environment Variables

In Render Dashboard → Service → Environment:

```
# Database (Render will provide DATABASE_URL for PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Security
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters

# AI API Keys
STABILITY_API_KEY=sk-your-stability-api-key
GEMINI_API_KEY=your-gemini-api-key
REPLICATE_API_KEY=r8_your-replicate-api-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Redis (if using external Redis)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000

# Spring Profile
SPRING_PROFILES_ACTIVE=render
```

### 3. Database Setup

#### Option A: Render PostgreSQL (Recommended)
1. In Render Dashboard → "New" → "PostgreSQL"
2. Configure:
   - **Name**: `lumiai-database`
   - **Database**: `lumiaidb`
   - **User**: `lumiuser`
3. Copy the `DATABASE_URL` to your web service environment variables

#### Option B: External Database (Supabase, Neon, etc.)
1. Create PostgreSQL database on your preferred provider
2. Get connection URL
3. Add to environment variables as `DATABASE_URL`

### 4. Redis Setup

#### Option A: Render Redis
1. In Render Dashboard → "New" → "Redis"
2. Configure:
   - **Name**: `lumiai-redis`
3. Copy connection details to environment variables

#### Option B: External Redis (Upstash, Redis Cloud)
1. Create Redis instance
2. Get connection details
3. Add to environment variables

### 5. Deploy and Test

1. Click "Deploy" in Render dashboard
2. Monitor build logs
3. Test endpoints:
   - Health check: `https://your-app.onrender.com/api/v1/health`
   - API docs: `https://your-app.onrender.com/swagger-ui.html`

## Dockerfile for Render (Alternative)

Create `API/Dockerfile.render`:

```dockerfile
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build application
RUN ./mvnw clean package -DskipTests

# Run application
EXPOSE 8080
CMD ["java", "-Dspring.profiles.active=render", "-jar", "target/*.jar"]
```

## Troubleshooting

### Build Fails
- Check Java version (use Java 21)
- Verify Maven wrapper permissions: `chmod +x mvnw`
- Check for compilation errors in logs

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database is running and accessible
- Verify SSL settings for external databases

### Memory Issues
- Increase instance size in Render
- Add JVM memory settings: `-Xmx512m -Xms256m`

### CORS Issues
- Update `CORS_ALLOWED_ORIGINS` with your frontend domain
- Ensure frontend URL is correct