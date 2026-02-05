# 🚀 Vercel Frontend Deployment Guide

## Prerequisites
1. Vercel account (https://vercel.com)
2. GitHub repository with your code
3. Environment variables configured

## Step-by-Step Deployment

### 1. Prepare Frontend for Deployment

```bash
cd Frontend
npm install
npm run build
```

### 2. Create vercel.json Configuration

Create `Frontend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    },
    {
      "src": "/.*",
      "dest": "/dist/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url",
    "VITE_GOOGLE_CLIENT_ID": "@vite_google_client_id",
    "VITE_APP_NAME": "LumiAI",
    "VITE_APP_VERSION": "2.0.0"
  }
}
```

### 3. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from Frontend directory
cd Frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: lumiai-frontend
# - Directory: ./
# - Override settings? No
```

#### Option B: GitHub Integration
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Set root directory to `Frontend`
5. Configure environment variables:
   - `VITE_API_BASE_URL`: Your backend URL (e.g., https://your-backend.onrender.com/api/v1)
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
6. Deploy

### 4. Configure Environment Variables in Vercel

In Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_API_BASE_URL = https://your-backend-domain.com/api/v1
VITE_GOOGLE_CLIENT_ID = your-google-client-id.apps.googleusercontent.com
VITE_APP_NAME = LumiAI
VITE_APP_VERSION = 2.0.0
```

### 5. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Troubleshooting

### Build Fails
- Check Node.js version (use Node 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check browser console for undefined variables

### Routing Issues
- Ensure `vercel.json` is configured correctly
- Check that all routes redirect to `index.html`