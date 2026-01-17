# Firebase Setup Guide

## Prerequisites

You need a Firebase project with Firestore enabled. If you don't have one:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database (Cloud Firestore, not Realtime Database)

## Setup Steps

### 1. Generate Service Account Key

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Navigate to **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save the downloaded JSON file as `serviceAccountKey.json` in the `server/` directory

**IMPORTANT:** Never commit this file to git! It's already in `.gitignore`.

### 2. Configure Environment Variables

Your `.env` file is already configured to use the service account file:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

Alternatively, for production deployment, you can use individual environment variables instead of a file.

### 3. Install Dependencies

```bash
cd server
npm install
```

This will install `firebase-admin` and remove `mongoose`.

### 4. Initialize Sample Data (Optional)

To populate your Firestore database with sample challenges:

```bash
# Start the server
npm run dev

# In another terminal, call the initialize endpoint
curl -X POST http://localhost:4888/api/challenges/initialize
```

### 5. Firestore Indexes

If you encounter errors about missing indexes, Firebase will provide a link in the error message to automatically create the required indexes.

Common indexes you might need:
- `users` collection: index on `totalScore` (descending)
- `submissions` collection: composite index on `userId`, `challengeId`, `createdAt`

## Firestore Collections Structure

Your database will have 3 main collections:

### users
```
{
  username: string
  email: string
  password: string (hashed)
  solvedChallenges: array
  totalScore: number
  rank: number | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

### challenges
```
{
  title: string
  difficulty: string (Easy|Medium|Hard)
  description: string
  requirements: array
  constraints: object
  category: string
  testCases: array
  optimalSolution: object
  acceptanceRate: number
  submissions: number
  accepted: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

### submissions
```
{
  userId: string
  challengeId: string
  architecture: object
  provider: string (AWS|Azure|GCP|Multi-Cloud)
  evaluation: object
  status: string (Accepted|Wrong Architecture|Too Expensive|Incomplete)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Migration Notes

### Key Differences from MongoDB

1. **No Schema Validation**: Firestore doesn't enforce schemas. Validation happens in code.
2. **Auto-Generated IDs**: Documents use Firebase's auto-generated IDs instead of MongoDB's ObjectId.
3. **No Populate**: Manual population is needed (already implemented in routes).
4. **Timestamps**: Using `admin.firestore.FieldValue.serverTimestamp()` instead of Date objects.
5. **No Transactions by Default**: Complex operations might need Firestore transactions.

### Authentication

The app still uses JWT tokens (not Firebase Authentication). If you want to migrate to Firebase Auth later, you'll need to update the auth routes.

## Troubleshooting

### "Project ID required" error
Make sure your service account JSON file is in the correct location and properly formatted.

### "Missing or insufficient permissions" error
Check that Firestore is enabled in your Firebase project and that the service account has the correct permissions.

### Query errors
Some complex queries might require composite indexes. Firebase will provide a direct link to create them when needed.

## Production Deployment

For production, use environment variables instead of the service account file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
# ... other Firebase credentials
```

Remove or comment out `FIREBASE_SERVICE_ACCOUNT_PATH` when using environment variables.
