# Render Deployment Setup Guide for MIRA API

## Prerequisites
- Render account (https://render.com)
- GitHub repository with the MIRA project
- Supabase project with credentials

## Files Created
- `Dockerfile` - Multi-stage build for Go API
- `render.yaml` - Render service configuration
- `.renderignore` - Files to exclude from deployment
- `cmd/server/main.go` - Updated to use dynamic PORT from Render

## Deployment Steps

### 1. Prepare Your Repository
- Ensure `go.sum` exists (run `go mod tidy` locally if missing)
- Push all changes to GitHub
- Make sure the `api/` folder is in your GitHub repository

### 2. Connect to Render
1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing MIRA

### 3. Configure the Service
1. **Name**: `mira-api` (or your preferred name)
2. **Root Directory**: `api/` (important - tells Render to build from api folder)
3. **Environment**: Docker
4. **Region**: Select your preferred region
5. **Plan**: Standard (minimum recommended)

### 4. Set Environment Variables
In the Render dashboard, add these environment variables:

```
APP_ENV = production

DATABASE_URL = postgresql://[user]:[password]@[host]:[port]/[database]

SUPABASE_URL = https://your-project.supabase.co

SUPABASE_ANON_KEY = your_anon_key_here

SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here

JWT_SECRET = generate_a_strong_random_secret_here
```

⚠️ **IMPORTANT**: 
- Get these values from your Supabase project settings
- Generate a strong JWT_SECRET (use: `openssl rand -base64 32`)
- Never commit secrets to GitHub - Render will read them from the environment

### 5. Configure Database (If Using Render Postgres)
If you want Render to manage your PostgreSQL database:
1. Create a new PostgreSQL instance in Render
2. Get the connection string
3. Set it as `DATABASE_URL` environment variable

**Alternatively**, use your existing Supabase PostgreSQL:
- Render can connect to external databases
- Ensure your Supabase database allows external connections
- Update firewall rules if needed

### 6. Deploy
1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Navigate to the `api/` directory
   - Build the Docker image
   - Start your service
3. Check logs in the Render dashboard for deployment status

### 7. Monitor Deployment
- Go to "Events" tab to see build progress
- Check "Logs" tab for runtime logs
- Your API will be available at: `https://your-service-name.onrender.com`

## Testing the Deployment

Once deployed, test your API:

```bash
# Test the root endpoint
curl https://your-service-name.onrender.com/

# Test your API endpoints
curl https://your-service-name.onrender.com/api/auth/login
```

## Production Checklist

- [ ] Database connection verified
- [ ] All environment variables set in Render
- [ ] JWT_SECRET is strong and unique
- [ ] CORS configuration is correct (check middleware/cors.go)
- [ ] Logs show no errors during startup
- [ ] Database migrations ran successfully
- [ ] Tested main API endpoints

## Troubleshooting

### Build Fails
- Check that `go.sum` exists locally
- Verify all Go imports are correct
- Check build logs in Render dashboard

### Port Issues
- The app now reads `PORT` from environment (handled in main.go)
- Render automatically assigns `PORT` - no manual configuration needed

### Database Connection Errors
- Verify `DATABASE_URL` is set correctly
- Check if Render can reach your database (firewall rules)
- Confirm database credentials are correct

### CORS Errors
- Review `middleware/cors.go` 
- Update CORS origins to include your Render domain

### Secrets Not Loading
- Ensure environment variables are set in Render (not in .env files)
- .env files are ignored during deployment (.renderignore)
- Production secrets must be in Render environment variables

## Local Testing Before Deployment

Before deploying to Render, test locally with production settings:

```bash
# Build Docker image locally
docker build -t mira-api .

# Run with environment variables
docker run -e PORT=8080 \
  -e APP_ENV=production \
  -e DATABASE_URL="your_db_url" \
  -e SUPABASE_URL="your_supabase_url" \
  -e SUPABASE_ANON_KEY="your_anon_key" \
  -e SUPABASE_SERVICE_ROLE_KEY="your_service_role_key" \
  -e JWT_SECRET="your_jwt_secret" \
  -p 8080:8080 mira-api
```

## Automatic Redeploys

Render will automatically redeploy when you push to your main branch (configurable in service settings).

## Cost Optimization

- **Free tier**: Available but with limitations and longer startup times
- **Standard**: Recommended for production (small cost)
- **Paid databases**: Only if using Render-managed PostgreSQL

For more info: https://render.com/pricing
