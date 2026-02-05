# 🗄️ Database Setup Guide for LumiAI

## Production Database Options

### Option 1: Render PostgreSQL (Recommended)
**Free tier available, easy integration**

1. **Create PostgreSQL Database**:
   - Go to https://render.com/dashboard
   - Click "New" → "PostgreSQL"
   - Configure:
     - Name: `lumiai-database`
     - Database: `lumiaidb`
     - User: `lumiuser`
     - Region: Choose closest to your backend

2. **Get Connection Details**:
   - Copy the `DATABASE_URL` (format: `postgresql://user:password@host:port/database`)
   - Add to your backend environment variables

3. **Configure Backend**:
   ```yaml
   spring:
     datasource:
       url: ${DATABASE_URL}
       driver-class-name: org.postgresql.Driver
   ```

### Option 2: Supabase PostgreSQL
**Generous free tier, additional features**

1. **Create Project**:
   - Go to https://supabase.com
   - Create new project
   - Choose region and set password

2. **Get Connection String**:
   - Go to Settings → Database
   - Copy connection string
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`

3. **Configure Connection**:
   ```env
   DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres
   ```

### Option 3: Neon PostgreSQL
**Serverless PostgreSQL with branching**

1. **Create Database**:
   - Go to https://neon.tech
   - Create new project
   - Choose region

2. **Get Connection Details**:
   - Copy connection string from dashboard
   - Add to environment variables

### Option 4: Railway PostgreSQL
**Simple deployment platform**

1. **Create Project**:
   - Go to https://railway.app
   - Create new project
   - Add PostgreSQL service

2. **Configure**:
   - Get `DATABASE_URL` from variables tab
   - Add to your backend environment

## Redis Setup Options

### Option 1: Render Redis
**Integrated with Render backend**

1. **Create Redis Instance**:
   - In Render dashboard → "New" → "Redis"
   - Name: `lumiai-redis`
   - Choose plan (free tier available)

2. **Configure Backend**:
   ```env
   REDIS_HOST=your-redis-host.render.com
   REDIS_PORT=6379
   REDIS_PASSWORD=your-redis-password
   ```

### Option 2: Upstash Redis
**Serverless Redis with generous free tier**

1. **Create Database**:
   - Go to https://upstash.com
   - Create Redis database
   - Choose region

2. **Get Connection Details**:
   ```env
   REDIS_HOST=your-database.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-password
   ```

### Option 3: Redis Cloud
**Managed Redis service**

1. **Create Subscription**:
   - Go to https://redis.com/redis-enterprise-cloud/
   - Create free subscription
   - Create database

2. **Configure**:
   ```env
   REDIS_HOST=your-endpoint.redis.cloud
   REDIS_PORT=your-port
   REDIS_PASSWORD=your-password
   ```

## Database Migration

### From MySQL to PostgreSQL

1. **Update Dependencies**:
   Add to `API/pom.xml`:
   ```xml
   <dependency>
       <groupId>org.postgresql</groupId>
       <artifactId>postgresql</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

2. **Update Application Configuration**:
   ```yaml
   spring:
     datasource:
       url: ${DATABASE_URL}
       driver-class-name: org.postgresql.Driver
     jpa:
       properties:
         hibernate:
           dialect: org.hibernate.dialect.PostgreSQLDialect
   ```

3. **Data Migration** (if needed):
   ```bash
   # Export from MySQL
   mysqldump -u username -p database_name > backup.sql
   
   # Convert to PostgreSQL format (use tools like pgloader)
   pgloader mysql://user:pass@localhost/dbname postgresql://user:pass@localhost/dbname
   ```

## Environment Variables Summary

### Backend Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters

# AI APIs
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

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

## Testing Database Connection

### Local Testing
```bash
# Test PostgreSQL connection
psql "postgresql://user:password@host:port/database"

# Test Redis connection
redis-cli -h host -p port -a password ping
```

### Application Testing
```bash
# Health check endpoint
curl https://your-backend.onrender.com/api/v1/health

# Database status
curl https://your-backend.onrender.com/actuator/health
```

## Backup and Monitoring

### Automated Backups
- **Render**: Automatic daily backups included
- **Supabase**: Point-in-time recovery available
- **Neon**: Automatic backups with branching

### Monitoring
- Set up database monitoring in your provider's dashboard
- Monitor connection pool usage
- Set up alerts for high CPU/memory usage

## Security Best Practices

1. **Use Strong Passwords**: Minimum 16 characters with mixed case, numbers, symbols
2. **Enable SSL**: Always use SSL connections in production
3. **Restrict Access**: Use IP whitelisting if available
4. **Regular Updates**: Keep database versions updated
5. **Monitor Logs**: Set up logging and monitoring for suspicious activity