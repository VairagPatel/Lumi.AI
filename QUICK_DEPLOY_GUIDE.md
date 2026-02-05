# 🚀 Quick Deploy Guide - LumiAI

## 📋 Overview
This guide will help you deploy LumiAI in production with:
- **Frontend**: Vercel (React app)
- **Backend**: Render (Spring Boot API)
- **Database**: PostgreSQL (Render/Supabase)
- **Cache**: Redis (Render/Upstash)

## ⚡ Quick Start (30 minutes)

### 1. Prepare Your Repository

```bash
# Clone or ensure your code is in GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Get Required API Keys

| Service | Purpose | Get From | Format |
|---------|---------|----------|---------|
| **Stability AI** | Image generation | https://platform.stability.ai/ | `sk-...` |
| **Google OAuth** | Authentication | https://console.developers.google.com/ | `...apps.googleusercontent.com` |
| **Cloudinary** | Image storage | https://cloudinary.com/ | Cloud name, API key, secret |
| **Razorpay** | Payments | https://razorpay.com/ | `rzp_test_...` or `rzp_live_...` |

### 3. Deploy Database (5 minutes)

#### Option A: Render PostgreSQL
1. Go to https://render.com → "New" → "PostgreSQL"
2. Name: `lumiai-database`
3. Copy the `DATABASE_URL`

#### Option B: Supabase
1. Go to https://supabase.com → "New Project"
2. Get connection string from Settings → Database

### 4. Deploy Backend (10 minutes)

1. **Create Render Web Service**:
   - Go to https://render.com → "New" → "Web Service"
   - Connect your GitHub repo
   - Root Directory: `API`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -Dspring.profiles.active=render -jar target/*.jar`

2. **Add Environment Variables**:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
   STABILITY_API_KEY=sk-your-stability-api-key
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   RAZORPAY_KEY_ID=rzp_test_your-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   SPRING_PROFILES_ACTIVE=render
   ```

3. **Deploy and Test**:
   - Wait for build to complete
   - Test: `https://your-backend.onrender.com/api/v1/health`

### 5. Deploy Frontend (10 minutes)

1. **Create Vercel Project**:
   - Go to https://vercel.com → "New Project"
   - Import your GitHub repo
   - Root Directory: `Frontend`

2. **Add Environment Variables**:
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   VITE_APP_NAME=LumiAI
   VITE_APP_VERSION=2.0.0
   ```

3. **Deploy and Test**:
   - Wait for build to complete
   - Test: `https://your-project.vercel.app`

### 6. Final Configuration (5 minutes)

1. **Update Google OAuth**:
   - Add your Vercel domain to authorized origins
   - Add backend domain to authorized redirect URIs

2. **Update Backend CORS**:
   - Add environment variable: `CORS_ALLOWED_ORIGINS=https://your-project.vercel.app`

3. **Test Everything**:
   - User registration/login
   - Google OAuth
   - Image generation
   - Payment flow (test mode)

## 🔧 Detailed Setup Instructions

### Backend Configuration for Render

Create `API/src/main/resources/application-render.yml`:

```yaml
server:
  port: ${PORT:8080}

spring:
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

# Add other configurations...
```

### Frontend Configuration for Vercel

Update `Frontend/vercel.json`:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🐛 Common Issues & Solutions

### Backend Issues
- **Build fails**: Check Java 21 is used
- **Database connection fails**: Verify `DATABASE_URL` format
- **CORS errors**: Add frontend domain to `CORS_ALLOWED_ORIGINS`

### Frontend Issues
- **Build fails**: Check Node.js version (18+)
- **API calls fail**: Verify `VITE_API_BASE_URL`
- **OAuth fails**: Check Google OAuth configuration

## 📊 Cost Estimation

### Free Tier (Development/Testing)
- **Render**: Free PostgreSQL + Web Service (limited)
- **Vercel**: Free frontend hosting
- **Supabase**: Free PostgreSQL (500MB)
- **Upstash**: Free Redis (10K requests/day)
- **Total**: $0/month

### Production Tier
- **Render**: $7/month (PostgreSQL) + $7/month (Web Service)
- **Vercel**: Free (or $20/month Pro)
- **Cloudinary**: Free tier (25K transformations)
- **AI APIs**: Pay per use
- **Total**: ~$14-34/month + API usage

## 🔒 Security Checklist

- [ ] Strong passwords (16+ characters)
- [ ] Production API keys (not test keys)
- [ ] HTTPS enabled everywhere
- [ ] CORS properly configured
- [ ] JWT secret is secure
- [ ] Environment variables are secure

## 📈 Monitoring & Maintenance

### Set Up Monitoring
1. **Uptime Monitoring**: Use UptimeRobot or similar
2. **Error Tracking**: Integrate Sentry
3. **Performance**: Monitor API response times
4. **Costs**: Track API usage and hosting costs

### Regular Maintenance
- Update dependencies monthly
- Monitor security vulnerabilities
- Review and optimize database queries
- Monitor API quotas and limits

## 🎉 Success!

If everything is working:
- ✅ Frontend loads at your Vercel URL
- ✅ Backend health check passes
- ✅ User can register/login
- ✅ Image generation works
- ✅ Payment flow works (test mode)

Your LumiAI application is now live in production! 🚀

## 📞 Need Help?

1. Check the detailed guides:
   - `deploy-vercel.md` - Frontend deployment
   - `deploy-render.md` - Backend deployment
   - `DATABASE_SETUP.md` - Database configuration
   - `DEPLOYMENT_CHECKLIST.md` - Complete checklist

2. Common issues are documented in each guide

3. Create GitHub issue if you encounter problems