# CloudArch - Learn Cloud Architecture Like LeetCode

A hackathon project that gamifies cloud architecture learning through drag-and-drop challenges, cost optimization, and competitive leaderboards.

## Project Overview

CloudArch is an interactive platform where users learn cloud architecture by solving LeetCode-style challenges. Users drag and drop cloud components (from AWS, Azure, and GCP) to build solutions that are evaluated based on:
- **Functionality**: Does it meet the requirements?
- **Cost Efficiency**: How much does it cost per month?
- **Complexity**: Is it over-engineered or optimally simple?
- **Best Practices**: AI-powered evaluation for security and scalability

## Features

- 🏗️ **Drag & Drop Architecture Builder** - Intuitive interface powered by React Flow
- ☁️ **Multi-Cloud Support** - AWS, Azure, and GCP services
- 💰 **Cost Estimation** - Real-world pricing for services
- 🤖 **AI Evaluation** - Optional LLM-based feedback using Claude or GPT-4
- 🏆 **Leaderboards** - Global rankings and cost-efficiency challenges
- 🎯 **Real-World Challenges** - From static hosting to disaster recovery
- 📊 **Progress Tracking** - Track solved challenges and scores

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **MongoDB** - Database for users, challenges, and submissions
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **React Flow** - Drag-and-drop architecture builder
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client

### AI Integration (Optional)
- **Anthropic Claude API** - Intelligent architecture evaluation
- **OpenAI GPT-4** - Alternative LLM evaluator

## Project Structure

```
hacknroll/
├── server/               # Backend API
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Evaluator and LLM integration
│   ├── data/            # Cloud services pricing & sample challenges
│   └── server.js        # Express app entry point
│
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API client
│   │   ├── context/     # Auth context
│   │   └── styles/      # Global styles
│   └── public/          # Static assets
│
└── README.md
```

## Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone and Navigate

```bash
cd hacknroll
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Required:
#   MONGODB_URI=mongodb://localhost:27017/cloudarch-leetcode
#   JWT_SECRET=your_random_secret_key
#   PORT=5000
#
# Optional (for AI evaluation):
#   ANTHROPIC_API_KEY=your_anthropic_key
#   OPENAI_API_KEY=your_openai_key

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Initialize Sample Data

Once both servers are running, initialize the database with sample challenges:

```bash
curl -X POST http://localhost:5000/api/challenges/initialize
```

Or visit the challenges API endpoint to trigger initialization.

## Usage Guide

### 1. Register an Account
- Navigate to `http://localhost:3000/register`
- Create an account with username, email, and password

### 2. Browse Challenges
- Go to the Challenges page
- Filter by difficulty (Easy, Medium, Hard) or category
- Click on a challenge to start solving

### 3. Solve a Challenge
- Read the problem description and requirements
- Select a cloud provider (AWS, Azure, or GCP)
- Drag cloud services from the sidebar onto the canvas
- Connect components by dragging edges between nodes
- Click "Submit Solution" to get evaluated

### 4. View Results
- See if your solution passed or failed
- Review cost estimation and efficiency score
- Get AI-powered feedback (if enabled)
- Compare your solution on the leaderboard

### 5. Compete on Leaderboards
- Global Rankings: Top users by total score
- Cost-Efficient: Most cost-optimized solutions

## Sample Challenges

1. **Simple Static Website Hosting** (Easy)
   - Host a static website with global CDN distribution
   - Budget: $10/month

2. **Serverless REST API** (Medium)
   - Build a scalable API without managing servers
   - Budget: $30/month

3. **High-Traffic Web Application** (Medium)
   - Load-balanced, cached, fault-tolerant architecture
   - Budget: $200/month

4. **Real-time Data Processing Pipeline** (Hard)
   - Stream processing for IoT data
   - Budget: $500/month

5. **Multi-Region Disaster Recovery** (Hard)
   - Active-passive failover with replication
   - Budget: $1000/month

## Evaluation System

### Rule-Based Evaluation
- **Cost Check**: Must be under budget constraint
- **Service Validation**: Required service categories must be present
- **Architecture Validation**: Components must be connected
- **Score Calculation**: Based on cost efficiency and complexity

### AI-Powered Evaluation (Optional)
When API keys are provided, solutions are also evaluated by:
- Claude 3.5 Sonnet (Anthropic) or GPT-4 (OpenAI)
- Checks for functionality, scalability, security, and best practices
- Provides detailed feedback and suggestions
- Combined score: 60% rule-based + 40% AI evaluation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Challenges
- `GET /api/challenges` - List all challenges
- `GET /api/challenges/:id` - Get challenge details
- `GET /api/challenges/:id/stats` - Get challenge statistics
- `POST /api/challenges/initialize` - Initialize sample challenges

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions/challenge/:id` - Get user submissions for challenge
- `GET /api/submissions/my-submissions` - Get all user submissions

### Leaderboard
- `GET /api/leaderboard` - Global leaderboard
- `GET /api/leaderboard/challenge/:id` - Challenge-specific leaderboard
- `GET /api/leaderboard/cost-efficient` - Most cost-efficient solutions

### Cloud Services
- `GET /api/services` - Get all cloud services
- `GET /api/services/:provider` - Get services by provider
- `GET /api/services/:provider/:category` - Get services by category

## Environment Variables

### Backend (.env)

```env
# Required
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloudarch-leetcode
JWT_SECRET=your_random_secret_key
NODE_ENV=development

# Optional - AI Evaluation
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env)

```env
# Optional - only needed if backend is not on localhost:5000
REACT_APP_API_URL=http://localhost:5000/api
```

## Development Tips

### Adding New Challenges

Edit `/server/data/sampleChallenges.js`:

```javascript
{
  title: "Your Challenge Title",
  difficulty: "Easy|Medium|Hard",
  description: "Problem description",
  requirements: ["requirement 1", "requirement 2"],
  constraints: {
    maxCost: 100,
    requiredServices: ["compute", "storage"],
    optionalServices: []
  },
  category: "Storage|Compute|Database|Serverless|Full-Stack",
  optimalSolution: {
    cost: 50,
    complexity: 3,
    explanation: "Why this is optimal"
  }
}
```

### Adding New Cloud Services

Edit `/server/data/cloudServices.js`:

```javascript
{
  id: 'service-id',
  name: 'Service Name',
  cost: 0.023,  // Cost per unit
  category: 'compute|storage|database|networking|serverless',
  specs: 'Service specifications'
}
```

### Customizing Evaluation Logic

Edit `/server/utils/evaluator.js` to modify:
- Cost calculation formulas
- Validation rules
- Scoring algorithms

## Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (use MongoDB Atlas for cloud deployment)
3. Deploy from `/server` directory

### Frontend Deployment (e.g., Vercel, Netlify)

1. Build the production bundle: `npm run build`
2. Deploy the `/client/build` directory
3. Set `REACT_APP_API_URL` to your backend URL

## Future Enhancements

- [ ] Solution explanations and tutorials
- [ ] User comments and discussions
- [ ] Challenge difficulty ratings from community
- [ ] More cloud providers (Oracle Cloud, IBM Cloud)
- [ ] Team challenges and collaborative solving
- [ ] Code generation for Terraform/CloudFormation
- [ ] Visual comparison with optimal solutions
- [ ] Achievement badges and streaks
- [ ] Weekly challenges and tournaments

## Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning and hackathons!

## Acknowledgments

- Cloud pricing data based on official provider documentation
- Inspired by LeetCode's gamified learning approach
- Built with ❤️ for Hack&Roll hackathon

## Support

For questions or issues:
- Open a GitHub issue
- Contact the development team

---

**Happy Cloud Architecting!** ☁️🏗️
