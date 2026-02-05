# 🚀 Complete LumiAI Deployment Checklist

## Pre-Deployment Setup

### 1. GitHub Repository Setup
- [ ] Create GitHub repository
- [ ] Push all code to repository
- [ ] Ensure `.gitignore` files are properly configured
- [ ] Remove any sensitive data from commit history

### 2. Environment Variables Preparation
- [ ] Copy `.env.example` to `.env.production`
- [ ] Generate strong passwords (minimum 16 characters)
- [ ] Obtain all required API keys
- [ ] Configure OAuth credentials

### 3. API Keys and Services Setup

#### AI Services (Choose at least one)
- [ ] **Stability AI**: Get API key from https://platform.stability.ai/
- [ ] **Google Gemini**: Get API key from https://makersuite.google.com/
- [ ] **Replicate**: Get API key from https://replicate.com/

#### Authentication
- [ ] **Google OAuth**: 
  - Go to https://console.developers.google.com/
  - Create project and enable Google+ API
  - Create OAuth 2.0 credentials
  - Add authorized domains

#### Cloud Storage
- [ ] **Cloudinary**: 
  - Sign up at https://cloudinary.com/
  - Get cloud name, API key, and API secret

#### Payment Processing
- [ ] **Razorpay**: 
  - Sign up at https://razorpay.com/
  - Get Key ID and Key Secret
  - For production: Complete KYC and get live keys

## Database Deployment

### Option 1: Render PostgreSQL (Recommended)
- [ ] Create Render account
- [ ] Create PostgreSQL database
- [ ] Note down `DATABASE_URL`
- [ ] Create Redis instance
- [ ] Note down Redis connection details

### Option 2: Supabase + Upstash
- [ ] Create Supabase project
- [ ] Get PostgreSQL connection string
- [ ] Create Upstash Redis database
- [ ] Get Redis connection details

### Option 3: Railway
- [ ] Create Railway account
- [ ] Deploy PostgreSQL service
- [ ] Deploy Redis service
- [ ] Get connection details

## Backend Deployment (Render)

### 1. Prepare Backend
- [ ] Update `pom.xml` with PostgreSQL dependency
- [ ] Create `application-render.yml` configuration
- [ ] Test build locally: `./mvnw clean package -DskipTests`

### 2. Deploy to Render
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory to `API`
- [ ] Configure build command: `./mvnw clean package -DskipTests`
- [ ] Configure start command: `java -Dspring.profiles.active=render -jar target/*.jar`

### 3. Configure Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
STABILITY_API_KEY=sk-your-stability-api-key
GEMINI_API_KEY=your-gemini-api-key
REPLICATE_API_KEY=r8_your-replicate-api-key
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
RAZORPAY_KEY_ID=rzp_live_your-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
SPRING_PROFILES_ACTIVE=render
```

### 4. Test Backend Deployment
- [ ] Check deployment logs for errors
- [ ] Test health endpoint: `https://your-backend.onrender.com/api/v1/health`
- [ ] Test API documentation: `https://your-backend.onrender.com/swagger-ui.html`
- [ ] Test database connection
- [ ] Test Redis connection

## Frontend Deployment (Vercel)

### 1. Prepare Frontend
- [ ] Update `Frontend/.env` with production backend URL
- [ ] Create `vercel.json` configuration
- [ ] Test build locally: `npm run build`

### 2. Deploy to Vercel
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `Frontend`
- [ ] Configure environment variables:
  ```env
  VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
  VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  VITE_APP_NAME=LumiAI
  VITE_APP_VERSION=2.0.0
  ```

### 3. Test Frontend Deployment
- [ ] Check build logs for errors
- [ ] Test website loads: `https://your-project.vercel.app`
- [ ] Test API connectivity
- [ ] Test authentication flow
- [ ] Test image generation
- [ ] Test payment flow (in test mode first)

## Post-Deployment Configuration

### 1. Update OAuth Settings
- [ ] Add production frontend URL to Google OAuth authorized origins
- [ ] Add production backend URL to authorized redirect URIs

### 2. Update CORS Settings
- [ ] Ensure backend CORS allows frontend domain
- [ ] Test cross-origin requests

### 3. SSL and Security
- [ ] Verify HTTPS is working on both frontend and backend
- [ ] Test security headers
- [ ] Verify JWT token security

### 4. Performance Testing
- [ ] Test page load speeds
- [ ] Test API response times
- [ ] Test image generation performance
- [ ] Test under load (if possible)

## Production Checklist

### 1. Security
- [ ] All passwords are strong and unique
- [ ] API keys are production keys (not test keys)
- [ ] JWT secret is secure and unique
- [ ] HTTPS is enforced
- [ ] CORS is properly configured

### 2. Monitoring
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Set up uptime monitoring
- [ ] Set up database monitoring
- [ ] Configure log aggregation

### 3. Backup
- [ ] Database backups are configured
- [ ] Code is backed up in version control
- [ ] Environment variables are documented securely

### 4. Documentation
- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create user documentation
- [ ] Document API endpoints

## Testing Checklist

### Functional Testing
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Image generation works with all providers
- [ ] Credit system works
- [ ] Payment processing works
- [ ] File upload/download works
- [ ] User profile management works

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile Testing
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design works

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Image generation completes successfully
- [ ] Large file uploads work

## Go-Live Steps

1. **Final Testing**
   - [ ] Complete end-to-end testing
   - [ ] Test with real payment (small amount)
   - [ ] Test all AI providers

2. **DNS Configuration** (if using custom domain)
   - [ ] Configure DNS records
   - [ ] Set up SSL certificates
   - [ ] Test domain resolution

3. **Launch**
   - [ ] Switch to production environment variables
   - [ ] Enable production payment mode
   - [ ] Monitor for first few hours
   - [ ] Have rollback plan ready

4. **Post-Launch**
   - [ ] Monitor error rates
   - [ ] Monitor performance
   - [ ] Monitor user feedback
   - [ ] Plan for scaling if needed

## Troubleshooting Common Issues

### Backend Issues
- **Build fails**: Check Java version, Maven dependencies
- **Database connection fails**: Verify DATABASE_URL format
- **API keys not working**: Check key format and permissions
- **CORS errors**: Update CORS_ALLOWED_ORIGINS

### Frontend Issues
- **Build fails**: Check Node.js version, npm dependencies
- **API calls fail**: Verify VITE_API_BASE_URL
- **OAuth fails**: Check Google OAuth configuration
- **Environment variables not working**: Ensure they start with VITE_

### General Issues
- **SSL errors**: Check certificate configuration
- **Performance issues**: Check database queries, optimize images
- **Memory issues**: Increase instance sizes
- **Rate limiting**: Check API quotas and limits

## Support and Maintenance

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Monitor security vulnerabilities
- [ ] Review and rotate API keys quarterly
- [ ] Monitor database performance
- [ ] Review and optimize costs

### Scaling Considerations
- [ ] Monitor user growth
- [ ] Plan for database scaling
- [ ] Consider CDN for static assets
- [ ] Plan for API rate limiting
- [ ] Consider caching strategies

---

**🎉 Congratulations! Your LumiAI application should now be live and running in production!**

Remember to monitor your application closely in the first few days after deployment and be prepared to make adjustments as needed.