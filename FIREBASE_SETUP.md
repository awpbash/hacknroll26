# Firebase Setup Instructions

Your Firebase project ID: `hnr2026-f6588`

## Enable Firestore Database

You need to enable Firestore in your Firebase project before running the upload script.

### Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **hnr2026-f6588**
3. In the left sidebar, click **Build** → **Firestore Database**
4. Click **Create database**
5. Choose **Start in production mode** (or test mode for development)
6. Select a location (recommend: `us-central1` for lowest latency)
7. Click **Enable**

## After Enabling Firestore

Run the upload script to populate your cloud services data:

```bash
cd server
node scripts/upload-to-firebase.js
```

You should see output like:
```
✅ Found 100 cloud services
📊 Services grouped by provider...
✅ Successfully uploaded documents to Firebase!
```

## Verify the Upload

Check your Firebase Console:
1. Go to Firestore Database
2. You should see two collections:
   - `cloudServices` - Contains 1 document with all structured data
   - `services` - Contains 100+ individual service documents

## Using the Data

The backend API at `/api/services` now fetches from Firebase automatically with 5-minute caching.

Frontend can call:
- `GET /api/services` - Get all services
- `GET /api/services/:provider` - Get services for a provider (AWS, Azure, GCP, etc.)
- `GET /api/services/:provider/:category` - Get services by category
- `POST /api/services/refresh-cache` - Force refresh the cache

## Troubleshooting

**Error: "5 NOT_FOUND"**
- Firestore is not enabled yet. Follow the steps above.

**Error: "Permission denied"**
- Make sure your service account has Firestore permissions
- Check Firebase Console → Project Settings → Service Accounts

**Want to use Realtime Database instead?**
- Let me know and I can create an alternative script for Realtime Database
