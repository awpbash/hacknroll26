# 🚀 Quick Start Guide - CloudArch

## Running the Application

### Option 1: Development Mode (Recommended for Demo)

**Terminal 1 - Start Backend:**
```bash
cd /home/junwei/hacknroll/server
npm run dev
```
✅ Wait for: `Server running on port 4888`

**Terminal 2 - Start Frontend:**
```bash
cd /home/junwei/hacknroll/client
npm start
```
✅ Wait for: Browser opens at `http://localhost:3000`

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4888/api
- Health Check: http://localhost:4888/api/health

---

### Option 2: Production Build

```bash
cd /home/junwei/hacknroll/client
npm run build
npm install -g serve
serve -s build -l 3000
```

---

## Troubleshooting

### ❌ "Port 4888 already in use"
```bash
# Kill the process
lsof -ti:4888 | xargs kill -9

# Restart server
cd /home/junwei/hacknroll/server
npm run dev
```

### ❌ "Cannot connect to API"
1. Check backend is running: `curl http://localhost:4888/api/health`
2. If not, start backend in Terminal 1
3. Frontend will automatically fallback to local data

### ❌ Build fails with TypeScript errors
```bash
# Already fixed! Just rebuild
cd /home/junwei/hacknroll/client
npm run build
```

---

## Quick Tests

### Test Backend
```bash
curl http://localhost:4888/api/health
# Should return: {"status":"ok","message":"CloudArch LeetCode API is running"}

curl http://localhost:4888/api/services | grep -o '"AWS"' | head -1
# Should return: "AWS"
```

### Test Frontend
1. Open http://localhost:3000
2. Click "Learn" in navigation
3. Services should load (shows 100 services from Firebase)
4. Try clicking "All" tab → Should show categories
5. Click on any challenge → Drag and drop should work

---

## Status Check

### Backend ✅
- [x] Firebase connected and serving 100 services
- [x] API endpoints working
- [x] 5-minute caching enabled
- [x] Port 4888 available

### Frontend ✅
- [x] TypeScript compiles with 0 errors
- [x] Production build succeeds
- [x] Fetches from API with loading states
- [x] Error handling with fallback data
- [x] All 6 providers working (AWS, Azure, GCP, RunPod, MongoDB, Firebase)

---

## Demo Checklist

Before the demo, verify:
- [ ] Backend running on port 4888
- [ ] Frontend running on port 3000
- [ ] Can register/login
- [ ] Learn page shows all services
- [ ] Challenge page drag-and-drop works
- [ ] Can submit a solution
- [ ] Leaderboard displays

---

## Key Features to Highlight

1. **100 Real Cloud Services** - From actual Excel dataset
2. **Multi-Cloud Support** - AWS, Azure, GCP, RunPod, MongoDB
3. **Firebase Integration** - Dynamic data loading
4. **Cost Optimization** - Real pricing calculations
5. **Interactive Learning** - Drag-and-drop architecture builder
6. **Competitive Element** - Leaderboards and scoring

---

## Quick Commands

```bash
# Start everything
cd /home/junwei/hacknroll/server && npm run dev &
cd /home/junwei/hacknroll/client && npm start

# Stop everything
pkill -f "node.*server.js"
pkill -f "react-scripts"

# Rebuild frontend
cd /home/junwei/hacknroll/client && npm run build

# Refresh Firebase cache
curl -X POST http://localhost:4888/api/services/refresh-cache
```

---

## Documentation

- **Full Integration Details:** [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)
- **Bug Fixes:** [BUGS_FIXED.md](BUGS_FIXED.md)
- **Firebase Setup:** [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Demo Script:** [DEMO.md](DEMO.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)

---

## Support

If something breaks:
1. Check backend logs in Terminal 1
2. Check frontend logs in Terminal 2
3. Check browser console (F12)
4. Verify Firebase is connected
5. Frontend will work offline with fallback data

**Everything is working! You're ready for the demo! 🎉**
