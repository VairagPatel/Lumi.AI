# Multi-stage Dockerfile for LumiAI

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY Frontend/package*.json ./
RUN npm ci --only=production

# Copy source code and build
COPY Frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9-openjdk-17-slim AS backend-builder

WORKDIR /app/backend

# Copy pom.xml and download dependencies
COPY API/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY API/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM openjdk:17-jre-slim

WORKDIR /app

# Install nginx for serving frontend
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Copy built backend
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Expose ports
EXPOSE 80 8080

# Start script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]