# Quick Start Guide

Get CloudArch running in 5 minutes!

## Step 1: Install MongoDB (if not installed)

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Ubuntu/Debian
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Windows
Download from: https://www.mongodb.com/try/download/community

Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

## Step 2: Set Up Backend

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloudarch-leetcode
JWT_SECRET=hacknroll2024_secret_key_change_this
NODE_ENV=development
EOF

# Start the server
npm run dev
```

Backend should now be running on http://localhost:5000

## Step 3: Set Up Frontend

Open a NEW terminal:

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start React app
npm start
```

Frontend should now be running on http://localhost:3000

## Step 4: Initialize Sample Challenges

In another NEW terminal:

```bash
curl -X POST http://localhost:5000/api/challenges/initialize
```

Or simply visit http://localhost:3000 and the app will guide you!

## Step 5: Start Using

1. Register an account at http://localhost:3000/register
2. Browse challenges at http://localhost:3000/challenges
3. Click on any challenge to start solving
4. Drag cloud services from the sidebar
5. Connect them with edges
6. Submit your solution!

## Optional: Enable AI Evaluation

Get API keys:
- **Anthropic Claude**: https://console.anthropic.com/
- **OpenAI**: https://platform.openai.com/api-keys

Add to `server/.env`:
```bash
ANTHROPIC_API_KEY=your_key_here
# OR
OPENAI_API_KEY=your_key_here
```

Restart the backend server.

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongodb` (Linux)
- Try using MongoDB Atlas instead (cloud MongoDB)

### Port Already in Use
- Change PORT in `server/.env` to something else like 5001
- Update `client/package.json` proxy to match

### Cannot Connect to Backend
- Check if backend is running on http://localhost:5000/api/health
- Make sure CORS is enabled (already configured in server.js)

### React Build Errors
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

## Demo Flow

1. **Register**: Create account with username/email/password
2. **Easy Challenge**: Try "Simple Static Website Hosting"
   - Drag S3 bucket from AWS sidebar
   - Drag CloudFront CDN
   - Connect S3 → CloudFront
   - Submit!
3. **View Score**: Check your cost efficiency and ranking
4. **Leaderboard**: See how you compare with others
5. **Try Harder**: Medium and Hard challenges await!

## Architecture Overview

```
User Browser (React)
    ↓
Frontend Server :3000
    ↓ HTTP Requests
Backend API :5000
    ↓
MongoDB :27017
    ↓
(Optional) Claude/GPT-4 API
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize challenges in `server/data/sampleChallenges.js`
- Add new cloud services in `server/data/cloudServices.js`
- Modify evaluation logic in `server/utils/evaluator.js`

Happy architecting! 🚀☁️
