# Cloud Architecture Platform - Deployment

## 🚀 Quick Deploy to Vercel

This project deploys as **2 separate Vercel applications**:

### 1️⃣ Backend (Express API)
```bash
cd server
vercel --prod
```
📝 Copy the URL: `https://your-backend-xyz.vercel.app`

### 2️⃣ Frontend (React SPA)
```bash
cd client
vercel --prod
```

---

## 📚 Documentation

- **Quick Start (5 min)**: [`VERCEL_QUICKSTART.md`](./VERCEL_QUICKSTART.md)
- **Full Guide**: [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)

---

## ⚙️ Files Created for Vercel

```
hacknroll26/
├── server/
│   ├── vercel.json          # Backend serverless config
│   ├── .vercelignore        # Files to exclude
│   └── .env.example         # Environment variables template
├── client/
│   ├── vercel.json          # Frontend SPA routing config
│   ├── .vercelignore        # Files to exclude
│   └── .env.example         # Frontend env variables
└── VERCEL_DEPLOYMENT.md     # Full deployment guide
```

---

## 🔑 Required Environment Variables

### Backend (Vercel Dashboard)
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
JWT_SECRET=your-random-secret-string
ANTHROPIC_API_KEY=sk-ant-xxxxx (optional)
NODE_ENV=production
```

### Frontend (Vercel Dashboard)
```env
REACT_APP_API_URL=https://your-backend-xyz.vercel.app
```

---

## 📋 Deployment Checklist

- [ ] Deploy backend to Vercel
- [ ] Set backend environment variables in Vercel Dashboard
- [ ] Copy backend URL
- [ ] Deploy frontend to Vercel
- [ ] Set `REACT_APP_API_URL` to backend URL
- [ ] Test: Backend health check at `/api/health`
- [ ] Test: Frontend loads and connects to backend
- [ ] Test: User registration/login works
- [ ] Test: Challenges load from Firebase
- [ ] Test: Submit a solution

---

## 🎯 What Changed for Vercel

### Backend (`server/`)
1. ✅ **vercel.json**: Configures serverless functions
2. ✅ **server.js**: Exports app for Vercel (doesn't listen if `VERCEL=1`)
3. ✅ **.vercelignore**: Excludes unnecessary files
4. ✅ **Firebase config**: Already supports both file and env vars

### Frontend (`client/`)
1. ✅ **vercel.json**: SPA routing (rewrites all routes to index.html)
2. ✅ **.vercelignore**: Excludes node_modules, .env files
3. ✅ **.env.example**: Template for API URL
4. ✅ **api.ts**: Already uses `process.env.REACT_APP_API_URL`

---

## 🧪 Local Development (Unchanged)

Backend still works locally:
```bash
cd server
npm install
npm run dev
```

Frontend still works locally:
```bash
cd client
npm install
npm start
```

The proxy in `client/package.json` handles API requests in development.

---

## 🔄 Continuous Deployment

Connect your GitHub/GitLab repo to Vercel for auto-deploy on push:
1. Go to Vercel Dashboard
2. Import Git Repository
3. Select repo and branch
4. Set root directory (server or client)
5. Configure environment variables
6. Every push auto-deploys! 🎉

---

## 💰 Cost

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ⚠️ 10s function timeout
- ⚠️ 1000 invocations/day

**Firebase:** Pay-as-you-go (free tier available)

**AI APIs:** Anthropic/OpenAI usage-based pricing

---

## 🆘 Need Help?

1. Check deployment logs: Vercel Dashboard → Deployments → Function Logs
2. See [`VERCEL_QUICKSTART.md`](./VERCEL_QUICKSTART.md) for troubleshooting
3. See [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) for detailed guide

---

## 🎉 You're All Set!

Your Cloud Architecture Platform is ready to deploy to Vercel in minutes.

**Start here:** [`VERCEL_QUICKSTART.md`](./VERCEL_QUICKSTART.md)
