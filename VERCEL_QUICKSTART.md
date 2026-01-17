# Vercel Deployment - Quick Start

## 🚀 Fast Track (5 minutes)

### 1. Deploy Backend First

```bash
cd server
vercel --prod
```

When prompted:
- Link to existing project? **No** (create new)
- Project name? **your-backend-name**
- Deploy to production? **Yes**

Copy the deployment URL (e.g., `https://your-backend-xyz.vercel.app`)

### 2. Set Backend Environment Variables

Go to: Vercel Dashboard → Your Backend Project → Settings → Environment Variables

Add these (Production):
```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key-with-newlines
FIREBASE_CLIENT_EMAIL=your-firebase-email@project.iam.gserviceaccount.com
JWT_SECRET=your-random-secret-string-change-this
ANTHROPIC_API_KEY=sk-ant-xxxxx (optional)
NODE_ENV=production
```

**Redeploy** after adding variables:
```bash
vercel --prod
```

### 3. Deploy Frontend

```bash
cd client
vercel --prod
```

When prompted:
- Link to existing project? **No** (create new)
- Project name? **your-frontend-name**
- Deploy to production? **Yes**

### 4. Set Frontend Environment Variable

Go to: Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

Add this (Production):
```
REACT_APP_API_URL=https://your-backend-xyz.vercel.app
```

(Use the backend URL from step 1)

**Redeploy**:
```bash
vercel --prod
```

---

## ✅ Verify Deployment

**Backend Health Check:**
```bash
curl https://your-backend-xyz.vercel.app/api/health
```

Should return:
```json
{"status":"ok","message":"CloudArch LeetCode API is running"}
```

**Frontend:**
Open `https://your-frontend-abc.vercel.app` in browser

---

## 🔧 Get Firebase Credentials

```bash
cd server
node -e "const k=require('./serviceAccountKey.json'); console.log('Project ID:', k.project_id); console.log('Client Email:', k.client_email); console.log('Private Key (first 50 chars):', k.private_key.substring(0,50));"
```

---

## 📝 Environment Variables Cheat Sheet

### Backend (.env)
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
JWT_SECRET=change-this-to-a-random-secret
ANTHROPIC_API_KEY=sk-ant-... (optional)
NODE_ENV=production
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

---

## 🐛 Common Issues

**"Firebase Admin SDK initialization failed"**
→ Double-check Firebase credentials, ensure private key has `\n` preserved

**"CORS error" on frontend**
→ Check `REACT_APP_API_URL` is set correctly (no trailing slash)

**"Module not found"**
→ Run `npm install` locally, commit package-lock.json, redeploy

**Frontend 404 on refresh**
→ Ensure `client/vercel.json` exists with rewrites

---

## 🔄 Update Existing Deployment

```bash
# After making code changes
git add .
git commit -m "Update"
git push

# Vercel auto-deploys on push!
# Or manually:
cd server && vercel --prod
cd client && vercel --prod
```

---

## 📱 URLs After Deployment

**Backend API:** `https://your-backend-name.vercel.app`
- Health: `/api/health`
- Auth: `/api/auth/*`
- Challenges: `/api/challenges`
- Submissions: `/api/submissions`
- Leaderboard: `/api/leaderboard`

**Frontend:** `https://your-frontend-name.vercel.app`

---

## 💡 Pro Tips

1. **Auto-deploy**: Connect GitHub repo for automatic deployments on push
2. **Preview deployments**: Every PR gets a preview URL
3. **Environment-specific**: Set different variables for Production vs Preview
4. **Custom domains**: Add custom domain in Vercel Dashboard → Domains
5. **Logs**: Check deployment logs in Vercel Dashboard → Deployments → View Function Logs

---

**Need more details?** See `VERCEL_DEPLOYMENT.md` for full guide.
