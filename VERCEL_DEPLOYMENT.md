# Vercel Deployment Guide

This guide will walk you through deploying both the frontend (React) and backend (Express.js) to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional but recommended):
   ```bash
   npm install -g vercel
   ```
3. **Firebase Service Account**: You'll need your Firebase credentials

## Project Structure

```
hacknroll26/
├── client/          # React frontend
│   ├── vercel.json
│   └── .vercelignore
└── server/          # Express backend
    ├── vercel.json
    └── .vercelignore
```

---

## Part 1: Deploy Backend (API)

### Step 1: Prepare Environment Variables

You'll need to set these environment variables in Vercel:

**Required:**
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Your Firebase private key (from serviceAccountKey.json)
- `FIREBASE_CLIENT_EMAIL` - Your Firebase client email
- `JWT_SECRET` - Secret key for JWT tokens (generate a random string)

**Optional:**
- `ANTHROPIC_API_KEY` - For AI evaluation (Phase 3)
- `OPENAI_API_KEY` - Alternative to Anthropic
- `ENABLE_RATE_LIMIT` - Set to `false` to disable rate limiting (default: true)
- `NODE_ENV` - Set to `production`

### Step 2: Deploy Backend via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the repository
3. **Root Directory**: Set to `server`
4. **Framework Preset**: Other
5. **Build Command**: Leave empty (or `npm install`)
6. **Output Directory**: Leave empty
7. **Install Command**: `npm install`

8. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add all the variables listed in Step 1
   - For `FIREBASE_PRIVATE_KEY`, paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Make sure to replace `\n` with actual line breaks

9. Click **Deploy**

### Step 3: Note Your Backend URL

After deployment, Vercel will give you a URL like:
```
https://your-backend-api.vercel.app
```

**Save this URL** - you'll need it for the frontend deployment.

---

## Part 2: Deploy Frontend

### Step 1: Create .env.production

In the `client/` directory, create `.env.production`:

```env
REACT_APP_API_URL=https://your-backend-api.vercel.app
```

Replace `your-backend-api.vercel.app` with your actual backend URL from Part 1, Step 3.

### Step 2: Deploy Frontend via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the **same repository** (or create a new project)
3. **Root Directory**: Set to `client`
4. **Framework Preset**: Create React App
5. **Build Command**: `npm run build`
6. **Output Directory**: `build`
7. **Install Command**: `npm install`

8. **Add Environment Variables**:
   - Variable: `REACT_APP_API_URL`
   - Value: Your backend URL from Part 1 (e.g., `https://your-backend-api.vercel.app`)

9. Click **Deploy**

---

## Part 3: Deploy via Vercel CLI (Alternative Method)

### Backend Deployment

```bash
cd server
vercel --prod

# You'll be prompted to:
# - Link to existing project or create new one
# - Set root directory to ./server
# - Confirm settings
```

### Frontend Deployment

```bash
cd client
vercel --prod

# You'll be prompted to:
# - Link to existing project or create new one
# - Set root directory to ./client
# - Confirm settings
```

---

## Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes | `your-project-id` |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Yes | `-----BEGIN PRIVATE KEY-----\n...` |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | Yes | `firebase-adminsdk@your-project.iam.gserviceaccount.com` |
| `JWT_SECRET` | Secret for JWT tokens | Yes | `your-super-secret-key-change-this` |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI evaluation | No | `sk-ant-...` |
| `OPENAI_API_KEY` | OpenAI API key (alternative) | No | `sk-...` |
| `ENABLE_RATE_LIMIT` | Enable/disable rate limiting | No | `true` |
| `NODE_ENV` | Environment | No | `production` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API URL | Yes | `https://your-backend-api.vercel.app` |

---

## Getting Firebase Credentials

### Method 1: From Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Extract the values:
   - `FIREBASE_PROJECT_ID` = `project_id` from JSON
   - `FIREBASE_CLIENT_EMAIL` = `client_email` from JSON
   - `FIREBASE_PRIVATE_KEY` = `private_key` from JSON (keep the `\n` characters)

### Method 2: Using Existing serviceAccountKey.json

If you have `server/serviceAccountKey.json`:

```bash
cd server
node -e "const key = require('./serviceAccountKey.json'); console.log('FIREBASE_PROJECT_ID=' + key.project_id); console.log('FIREBASE_CLIENT_EMAIL=' + key.client_email); console.log('FIREBASE_PRIVATE_KEY=' + key.private_key);"
```

---

## Troubleshooting

### Backend Issues

**Error: "Firebase Admin SDK initialization failed"**
- Check that your Firebase credentials are correct
- Ensure `FIREBASE_PRIVATE_KEY` includes the full key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Make sure line breaks (`\n`) in the private key are preserved

**Error: "Module not found"**
- Check that all dependencies are in `package.json`
- Try redeploying after running `npm install` locally

**Error: "Function timeout"**
- Vercel free tier has 10s timeout. Consider upgrading if needed
- Optimize slow database queries

### Frontend Issues

**API requests failing / CORS errors**
- Verify `REACT_APP_API_URL` is set correctly
- Check that backend CORS is enabled (it should be by default)
- Ensure the backend URL doesn't have a trailing slash

**Environment variables not working**
- Vercel requires `REACT_APP_` prefix for Create React App
- Redeploy after changing environment variables
- Check that `.env.production` is not in `.gitignore`

**404 on page refresh**
- This should be handled by `vercel.json` rewrites
- Verify `client/vercel.json` exists and has the rewrite rule

---

## Post-Deployment Checklist

- [ ] Backend health check works: `https://your-backend.vercel.app/api/health`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Challenges load from database
- [ ] Challenge submission works
- [ ] Leaderboard displays
- [ ] AI evaluation (Phase 3) works (if API keys configured)

---

## Updating Deployments

### Auto-Deploy (Recommended)

Vercel automatically deploys when you push to your connected Git branch.

1. Make changes locally
2. Commit and push to GitHub/GitLab/Bitbucket
3. Vercel automatically builds and deploys

### Manual Deploy

```bash
# Backend
cd server
vercel --prod

# Frontend
cd client
vercel --prod
```

---

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Go to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `REACT_APP_API_URL` in frontend if using custom domain for backend

---

## Cost Considerations

**Vercel Free Tier includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless function executions
- ⚠️ 10s function timeout
- ⚠️ 1000 serverless invocations/day

**For production:**
- Consider Vercel Pro ($20/month) for longer timeouts and more invocations
- Firebase costs apply separately (pay-as-you-go)
- Anthropic/OpenAI API costs apply if using AI evaluation

---

## Security Best Practices

1. **Never commit secrets**: Ensure `.env`, `serviceAccountKey.json` are in `.gitignore`
2. **Rotate JWT secrets**: Change `JWT_SECRET` periodically
3. **Use environment variables**: Never hardcode credentials
4. **Enable rate limiting**: Keep `ENABLE_RATE_LIMIT=true` in production
5. **Monitor usage**: Check Vercel and Firebase dashboards regularly

---

## Support

If you encounter issues:
1. Check Vercel deployment logs: Project → Deployments → Click deployment → View Function Logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test backend endpoints directly using curl or Postman

---

## Quick Reference Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy backend
cd server && vercel --prod

# Deploy frontend
cd client && vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove a deployment
vercel rm <deployment-url>
```

---

**Deployment Complete!** 🚀

Your Cloud Architecture Platform is now live on Vercel.
