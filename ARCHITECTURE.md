# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                     (React Single Page App)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ REST API Calls
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      Backend API Server                      │
│                    (Node.js + Express)                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth       │  │  Challenges  │  │  Submissions │     │
│  │   Routes     │  │   Routes     │  │   Routes     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         │    ┌─────────────▼──────────────────┤             │
│         │    │      Business Logic Layer      │             │
│         │    │  - Evaluator                   │             │
│         │    │  - LLM Evaluator               │             │
│         │    │  - Cost Calculator              │             │
│         │    └─────────────┬──────────────────┘             │
│         │                  │                                 │
└─────────┼──────────────────┼─────────────────────────────────┘
          │                  │
          │                  │
┌─────────▼──────────────────▼─────────────────────────────────┐
│                      MongoDB Database                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Users    │  │ Challenges │  │ Submissions│            │
│  │ Collection │  │ Collection │  │ Collection │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└──────────────────────────────────────────────────────────────┘

          Optional External Services
          ┌─────────────────────────┐
          │  Anthropic Claude API   │
          │  or OpenAI GPT-4 API    │
          └─────────────────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       React Application                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  App.js (Router)                      │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │         AuthContext (Global State)           │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────┐  ┌────────────────────────┐    │
│  │   Pages (Routes)       │  │  Components            │    │
│  │  - HomePage            │  │  - Navbar              │    │
│  │  - LoginPage           │  │  - ArchitectureBuilder │    │
│  │  - RegisterPage        │  │    (React Flow)        │    │
│  │  - ChallengesListPage  │  │                        │    │
│  │  - ChallengePage       │  │                        │    │
│  │  - LeaderboardPage     │  │                        │    │
│  └────────────────────────┘  └────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Services (API Client)                    │  │
│  │  - authAPI, challengesAPI, submissionsAPI, etc.      │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │ Axios HTTP Requests
                           │
                           ▼
                    Backend REST API
```

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Express Application                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Middleware Stack                     │  │
│  │  - CORS                                               │  │
│  │  - express.json()                                     │  │
│  │  - JWT Authentication (for protected routes)         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────┐               │
│  │            Route Handlers               │               │
│  │                                         │               │
│  │  /api/auth/*                            │               │
│  │  ├─ POST /register                      │               │
│  │  ├─ POST /login                         │               │
│  │  └─ GET  /me                            │               │
│  │                                         │               │
│  │  /api/challenges/*                      │               │
│  │  ├─ GET    /                            │               │
│  │  ├─ GET    /:id                         │               │
│  │  ├─ GET    /:id/stats                   │               │
│  │  └─ POST   /initialize                  │               │
│  │                                         │               │
│  │  /api/submissions/*                     │               │
│  │  ├─ POST   /                            │               │
│  │  ├─ GET    /challenge/:id               │               │
│  │  └─ GET    /my-submissions              │               │
│  │                                         │               │
│  │  /api/leaderboard/*                     │               │
│  │  ├─ GET    /                            │               │
│  │  ├─ GET    /challenge/:id               │               │
│  │  └─ GET    /cost-efficient              │               │
│  │                                         │               │
│  │  /api/services/*                        │               │
│  │  ├─ GET    /                            │               │
│  │  ├─ GET    /:provider                   │               │
│  │  └─ GET    /:provider/:category         │               │
│  └─────────────────────────────────────────┘               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  ArchitectureEvaluator                      │    │  │
│  │  │  - calculateCost()                          │    │  │
│  │  │  - validateArchitecture()                   │    │  │
│  │  │  - evaluate() → score                       │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  LLMEvaluator (Optional)                    │    │  │
│  │  │  - buildEvaluationPrompt()                  │    │  │
│  │  │  - callClaude() / callOpenAI()              │    │  │
│  │  │  - parseEvaluationResponse()                │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Models (Mongoose)                   │  │
│  │  - User                                               │  │
│  │  - Challenge                                          │  │
│  │  - Submission                                         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
                    MongoDB Database
```

## Data Flow: Submit Solution

```
1. USER ACTION
   └─ User drags cloud services onto canvas
   └─ Connects services with edges
   └─ Clicks "Submit Solution"

2. FRONTEND
   └─ ChallengePage collects architecture data:
      {
        nodes: [{id, type, position, data}, ...],
        edges: [{source, target}, ...]
      }
   └─ Calls submissionsAPI.submit({
        challengeId,
        architecture,
        provider: 'AWS'|'Azure'|'GCP'
      })

3. BACKEND - Route Handler (POST /api/submissions)
   └─ Authenticate user via JWT token
   └─ Validate request body
   └─ Fetch Challenge from database
   └─ Create ArchitectureEvaluator instance

4. BACKEND - ArchitectureEvaluator
   └─ calculateCost():
      - Loop through nodes
      - Find service pricing from cloudServices.js
      - Calculate monthly cost based on service type
      - Return total cost

   └─ validateArchitecture():
      - Check required service categories present
      - Verify components are connected
      - Return validation result

   └─ evaluate():
      - Check cost <= maxCost (budget)
      - Verify architecture validity
      - Calculate efficiency score
      - Generate feedback messages
      - Return evaluation object

5. BACKEND - LLM Evaluation (Optional)
   └─ If ANTHROPIC_API_KEY or OPENAI_API_KEY exists:
      - Build evaluation prompt with challenge + architecture
      - Call Claude/GPT-4 API
      - Parse JSON response
      - Combine rule-based (60%) + LLM score (40%)

6. BACKEND - Save & Update
   └─ Create Submission document in MongoDB
   └─ Update Challenge statistics (submissions++, accepted++)
   └─ Update User profile (solvedChallenges, totalScore)
   └─ Return evaluation result to frontend

7. FRONTEND - Display Result
   └─ Show pass/fail status
   └─ Display cost, complexity, score
   └─ Show feedback messages
   └─ Optionally show AI feedback
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  solvedChallenges: [{
    challengeId: ObjectId (ref: Challenge),
    architectureData: Object,
    cost: Number,
    complexity: Number,
    timestamp: Date
  }],
  totalScore: Number,
  rank: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Challenges Collection
```javascript
{
  _id: ObjectId,
  title: String,
  difficulty: 'Easy'|'Medium'|'Hard',
  description: String,
  requirements: [String],
  constraints: {
    maxCost: Number,
    requiredServices: [String],
    optionalServices: [String]
  },
  category: 'Storage'|'Compute'|'Database'|'Serverless'|'Full-Stack',
  testCases: [{
    input: String,
    expectedOutput: String,
    description: String
  }],
  optimalSolution: {
    architecture: Object,
    cost: Number,
    complexity: Number,
    explanation: String
  },
  acceptanceRate: Number,
  submissions: Number,
  accepted: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Submissions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  challengeId: ObjectId (ref: Challenge),
  architecture: {
    nodes: [{
      id: String,
      type: String,
      data: Object,
      position: {x: Number, y: Number}
    }],
    edges: [{
      id: String,
      source: String,
      target: String,
      type: String
    }]
  },
  provider: 'AWS'|'Azure'|'GCP'|'Multi-Cloud',
  evaluation: {
    passed: Boolean,
    cost: Number,
    complexity: Number,
    score: Number,
    feedback: [String],
    errors: [String],
    llmFeedback: Object (optional)
  },
  status: 'Accepted'|'Wrong Architecture'|'Too Expensive'|'Incomplete',
  createdAt: Date,
  updatedAt: Date
}
```

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Security Layers                      │
│                                                      │
│  1. AUTHENTICATION                                   │
│     └─ JWT tokens (7 day expiry)                    │
│     └─ bcryptjs password hashing (10 salt rounds)   │
│     └─ Secure HTTP-only cookies (optional)          │
│                                                      │
│  2. AUTHORIZATION                                    │
│     └─ Protected routes middleware                  │
│     └─ User-specific data access                    │
│     └─ No optimal solutions exposed to clients      │
│                                                      │
│  3. INPUT VALIDATION                                 │
│     └─ express-validator for all inputs             │
│     └─ Mongoose schema validation                   │
│     └─ SQL injection prevention (NoSQL = MongoDB)   │
│                                                      │
│  4. API SECURITY                                     │
│     └─ CORS configured for frontend origin          │
│     └─ Rate limiting (recommended for production)   │
│     └─ API keys in environment variables            │
│                                                      │
│  5. DATA PROTECTION                                  │
│     └─ Passwords never stored in plain text         │
│     └─ JWT secrets in environment variables         │
│     └─ No sensitive data in logs                    │
└─────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Production Setup                     │
│                                                      │
│  Frontend (Vercel/Netlify)                          │
│  └─ React production build                          │
│  └─ CDN distribution                                │
│  └─ HTTPS enabled                                   │
│  └─ Environment: REACT_APP_API_URL                  │
│                                                      │
│  Backend (Heroku/Railway/Render)                    │
│  └─ Node.js server                                  │
│  └─ SSL/TLS enabled                                 │
│  └─ Environment variables configured                │
│  └─ CORS: frontend domain whitelisted              │
│                                                      │
│  Database (MongoDB Atlas)                           │
│  └─ Managed MongoDB cluster                         │
│  └─ Automatic backups                               │
│  └─ IP whitelist                                    │
│  └─ Database user authentication                    │
│                                                      │
│  Optional: AI Services                              │
│  └─ Anthropic Claude API                            │
│  └─ OpenAI GPT-4 API                                │
└──────────────────────────────────────────────────────┘
```

## Performance Optimization

1. **Frontend**
   - Code splitting by route
   - Lazy loading of React Flow
   - Memoization of expensive components
   - Debounced architecture changes

2. **Backend**
   - Database indexes on frequently queried fields
   - Leaderboard queries optimized with sorting
   - Optional caching layer (Redis) for leaderboards
   - Async/await for non-blocking I/O

3. **Database**
   - Compound indexes: (userId, challengeId)
   - Index on totalScore for leaderboard queries
   - Projection to avoid fetching unnecessary fields

4. **Network**
   - Gzip compression on API responses
   - CDN for frontend static assets
   - Keep-alive connections
   - Batched database operations

## Scalability Considerations

- **Horizontal Scaling**: Stateless API design allows multiple backend instances
- **Database Sharding**: MongoDB supports sharding for large datasets
- **Caching**: Add Redis for leaderboards and challenge data
- **Load Balancing**: Distribute requests across multiple servers
- **CDN**: Serve static assets from edge locations
- **Microservices**: Could split evaluation engine into separate service

---

This architecture supports thousands of concurrent users while maintaining sub-second response times for most operations.
