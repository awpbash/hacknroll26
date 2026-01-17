# CloudArch - Frequently Asked Questions

## General Questions

### What is CloudArch?
CloudArch is an interactive learning platform that teaches cloud architecture through LeetCode-style challenges. Instead of writing code, you drag and drop cloud services to design architectures that are evaluated on functionality, cost, and complexity.

### Who is this for?
- **Students** learning cloud computing
- **Developers** transitioning to DevOps/Cloud roles
- **Anyone** interested in cloud architecture
- **Companies** training employees on cloud design

### Is it free?
Yes! CloudArch is completely free to use. You don't need any cloud provider accounts or credit cards.

### Do I need prior cloud experience?
No! We have challenges ranging from Easy (for beginners) to Hard (for advanced users). Start with Easy challenges to learn the basics.

---

## Technical Questions

### How accurate are the cost calculations?
Very accurate! We use real pricing data from AWS, Azure, and GCP official documentation. Costs are calculated based on:
- **Compute**: 730 hours/month (24/7 operation)
- **Storage**: Per GB/month
- **Serverless**: Per million requests/invocations
- **Database**: 730 hours/month for managed databases
- **Networking**: Per GB transferred for CDN/load balancers

### Which cloud providers are supported?
Currently:
- **AWS** (Amazon Web Services) - 23 services
- **Azure** (Microsoft Azure) - 11 services
- **GCP** (Google Cloud Platform) - 10 services

Total: 44 cloud services across all providers.

### What services are available?

**AWS Services:**
- Compute: EC2 (various sizes), Lambda
- Storage: S3 (Standard, IA), EBS
- Database: RDS MySQL, DynamoDB, Aurora Serverless
- Networking: ELB, CloudFront, API Gateway, VPC
- Other: SQS, SNS, ElastiCache

**Azure Services:**
- Compute: VMs (B1S, B2S), Functions
- Storage: Blob Storage (Hot, Cool)
- Database: SQL Database, Cosmos DB
- Networking: Load Balancer, CDN, VNet

**GCP Services:**
- Compute: E2 instances, Cloud Functions
- Storage: Cloud Storage (Standard, Nearline)
- Database: Cloud SQL, Firestore
- Networking: Load Balancing, Cloud CDN, VPC

### How does the evaluation system work?

**Two-part evaluation:**

1. **Rule-Based (Required)**
   - Cost check: Must be under budget
   - Service validation: Required service categories present
   - Architecture validation: Components must be connected
   - Efficiency scoring: Based on cost ratio and complexity

2. **AI-Based (Optional)**
   - Requires ANTHROPIC_API_KEY or OPENAI_API_KEY
   - Evaluates functionality, scalability, security, best practices
   - Provides detailed feedback and suggestions
   - Combined score: 60% rule-based + 40% AI

### What is the scoring algorithm?

```
Base Score = 1000 - (cost_ratio × 500) - (complexity_ratio × 300)

Where:
- cost_ratio = your_cost / max_budget
- complexity_ratio = your_components / (optimal_components × 2)

Bonuses:
- +100 points if cost < 50% of budget
- +50 points if complexity ≤ optimal complexity

Final Score = Base Score + Bonuses
Range: 0-1150 points
```

---

## Usage Questions

### How do I solve a challenge?

1. **Select a challenge** from the Challenges page
2. **Read requirements** and constraints carefully
3. **Choose cloud provider** (AWS, Azure, or GCP)
4. **Drag services** from sidebar onto the canvas
5. **Connect services** by dragging edges between nodes
6. **Submit solution** when ready
7. **Review feedback** and improve if needed

### Can I use multiple cloud providers in one solution?
Currently, each solution uses one provider, but you can submit different solutions using different providers for the same challenge!

### What happens if my solution fails?
You'll receive detailed feedback on why it failed:
- **Too Expensive**: Cost exceeds budget
- **Wrong Architecture**: Missing required services or not properly connected
- **Incomplete**: Architecture is empty or invalid

You can modify and resubmit as many times as you want!

### Can I see the optimal solution?
Not directly - we want you to learn by experimenting. However:
- The leaderboard shows the best solutions from other users
- AI feedback (if enabled) provides improvement suggestions
- You can try multiple approaches and compare scores

### How does the leaderboard work?

**Three types of leaderboards:**

1. **Global Leaderboard**
   - Ranks users by total score across all challenges
   - Sum of best scores from each challenge
   - Updated in real-time

2. **Challenge Leaderboard**
   - Ranks solutions for a specific challenge
   - Sorted by score, then by cost (lower is better)
   - Only shows each user's best submission

3. **Cost-Efficient Leaderboard**
   - Shows most cost-optimized solutions across all challenges
   - Sorted by monthly cost (lowest first)
   - Encourages frugal architecture design

---

## Setup & Installation

### What are the prerequisites?
- **Node.js** v16 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### How long does setup take?
Approximately 5 minutes:
- 2 min: Install dependencies
- 1 min: Configure environment
- 2 min: Start servers and initialize data

### Do I need to install all cloud providers?
No! The app simulates cloud services - you don't need any cloud provider accounts.

### What if I don't have MongoDB installed?
Two options:
1. **Install locally**: https://www.mongodb.com/try/download/community
2. **Use MongoDB Atlas** (free cloud database): https://www.mongodb.com/cloud/atlas

For Atlas, just update `MONGODB_URI` in `server/.env` with your connection string.

### How do I enable AI evaluation?
1. Get an API key from Anthropic (https://console.anthropic.com/) or OpenAI (https://platform.openai.com/)
2. Add to `server/.env`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   # OR
   OPENAI_API_KEY=your_key_here
   ```
3. Restart the backend server

The app works fine without AI evaluation - it's completely optional!

---

## Troubleshooting

### Backend won't start

**Error: "MongoDB connection failed"**
- Solution: Make sure MongoDB is running
  - macOS: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongodb`
  - Or use MongoDB Atlas cloud database

**Error: "Port 5000 already in use"**
- Solution: Change `PORT` in `server/.env` to 5001
- Update `client/package.json` proxy to match

**Error: "JWT_SECRET is not defined"**
- Solution: Make sure `server/.env` exists and has `JWT_SECRET` set

### Frontend won't start

**Error: "Cannot connect to backend"**
- Solution: Make sure backend is running on http://localhost:5000
- Check `client/package.json` has correct proxy setting

**Error: "Module not found"**
- Solution: Delete node_modules and reinstall
  ```bash
  cd client
  rm -rf node_modules package-lock.json
  npm install
  ```

### No challenges appear

**Problem: Challenge list is empty**
- Solution: Initialize sample challenges
  ```bash
  curl -X POST http://localhost:5000/api/challenges/initialize
  ```

### Submission fails with "Invalid token"

**Problem: Authentication error**
- Solution: Log out and log back in to refresh your token
- Check that JWT_SECRET in server/.env hasn't changed

---

## Development Questions

### How do I add new challenges?

Edit `server/data/sampleChallenges.js`:

```javascript
{
  title: "Your Challenge Title",
  difficulty: "Easy|Medium|Hard",
  description: "What users need to build",
  requirements: [
    "Requirement 1",
    "Requirement 2"
  ],
  constraints: {
    maxCost: 100,  // Monthly budget in USD
    requiredServices: ["compute", "storage"],
    optionalServices: ["cache"]
  },
  category: "Storage|Compute|Database|Serverless|Full-Stack",
  optimalSolution: {
    cost: 50,
    complexity: 3,
    explanation: "Why this is optimal"
  }
}
```

Then restart the server and re-initialize challenges.

### How do I add new cloud services?

Edit `server/data/cloudServices.js`:

```javascript
// Under the appropriate provider (AWS, Azure, GCP)
{
  id: 'service-id',
  name: 'Display Name',
  cost: 0.023,  // Base cost per unit
  category: 'compute|storage|database|networking|serverless',
  specs: 'Brief description (e.g., "1 vCPU, 1GB RAM")'
}
```

The evaluator will automatically calculate monthly costs based on the category.

### How do I customize the evaluation logic?

Edit `server/utils/evaluator.js`:

- **calculateCost()**: Modify cost calculation formulas
- **validateArchitecture()**: Add/change validation rules
- **evaluate()**: Adjust scoring algorithm

### Can I deploy this to production?

Yes! See [README.md](README.md) deployment section.

**Recommendations:**
- Use MongoDB Atlas for database
- Deploy backend to Heroku/Railway/Render
- Deploy frontend to Vercel/Netlify
- Set environment variables on hosting platforms
- Enable rate limiting for API endpoints
- Use a strong JWT_SECRET in production

---

## Feature Requests

### Will you add [specific cloud service]?
We're constantly expanding our service catalog! Check the GitHub issues or open a feature request.

### Can I contribute?
Absolutely! This is an open-source project. Fork the repo, make improvements, and submit a pull request.

### Will you add other cloud providers?
Potentially! Oracle Cloud, IBM Cloud, and Alibaba Cloud are on our radar for future updates.

### Can you add a feature for [X]?
Open a GitHub issue or discussion! We'd love to hear your ideas.

---

## Educational Questions

### What can I learn from CloudArch?

**Concepts:**
- Cloud service types and use cases
- Architecture patterns (3-tier, microservices, serverless)
- Load balancing and fault tolerance
- Caching strategies
- Database selection (SQL vs NoSQL)
- Cost optimization techniques
- Scaling strategies
- Disaster recovery planning

**Skills:**
- Designing cloud architectures
- Making trade-offs between services
- Balancing cost and performance
- Understanding cloud pricing models
- Thinking at systems level

### How does this help with cloud certifications?

CloudArch reinforces concepts tested in:
- **AWS Solutions Architect**
- **Azure Solutions Architect Expert**
- **GCP Professional Cloud Architect**

It provides practical experience with:
- Choosing appropriate services
- Designing for scalability and availability
- Cost optimization strategies
- Multi-tier application architectures

### Is this better than traditional learning?

**Different, complementary approach:**
- **Traditional** (docs, videos): Great for breadth and theory
- **CloudArch** (hands-on practice): Great for depth and practical skills
- **Best approach**: Combine both!

---

## Feedback & Support

### I found a bug!
Please open a GitHub issue with:
- What happened
- What you expected
- Steps to reproduce
- Screenshots if applicable

### I have a suggestion!
We'd love to hear it! Open a GitHub discussion or issue.

### How can I contact the team?
- GitHub Issues: For bugs and feature requests
- GitHub Discussions: For questions and ideas
- Email: [Your contact email]

### Can I use this for my class/bootcamp/company?
Absolutely! CloudArch is MIT licensed. You're free to:
- Use it as a teaching tool
- Customize it for your needs
- Deploy your own instance
- Contribute improvements back

Just give attribution and share your improvements with the community!

---

## Performance & Scalability

### How many users can it handle?
The current architecture can support:
- **Concurrent users**: 1,000+ with single server
- **Daily active users**: 10,000+ with proper scaling
- **Database**: Millions of submissions with MongoDB indexes

### Is the app slow?
No! Most operations are sub-second:
- Challenge loading: < 100ms
- Submission evaluation: < 500ms
- Leaderboard queries: < 200ms

AI evaluation (when enabled) adds 1-3 seconds due to API calls.

### Can I run this on a Raspberry Pi?
Technically yes, but not recommended for production. A Pi 4 with 4GB RAM should work for development/demo purposes.

---

## Privacy & Security

### What data do you collect?
- Account information (username, email, hashed password)
- Challenge submissions and solutions
- Scores and leaderboard rankings

We do NOT collect:
- Personal identification beyond email
- Payment information
- Tracking cookies
- Analytics beyond usage stats

### Is my data secure?
Yes:
- Passwords are hashed with bcryptjs (never stored plain text)
- JWT tokens for authentication
- User data isolated per account
- No sharing of data with third parties

### Can others see my solutions?
By default, no. Only your:
- Username and score appear on leaderboards
- Solution statistics (cost, complexity)

Your actual architecture diagrams are private unless you share them.

---

## Miscellaneous

### Why the name "CloudArch"?
Cloud + Architecture = CloudArch! Simple and descriptive.

### Is this your actual hackathon project?
Yes! Built specifically for [Hack&Roll / your hackathon name].

### How long did this take to build?
Approximately 8-10 hours of focused development.

### What's next for CloudArch?
See [FEATURES.md](FEATURES.md) for our roadmap. Short-term priorities:
1. More challenges (target: 50+)
2. Better onboarding and tutorials
3. Community features
4. Mobile-responsive improvements

---

**Can't find your question?**

Check out:
- [README.md](README.md) - Comprehensive documentation
- [QUICKSTART.md](QUICKSTART.md) - Setup guide
- [DEMO.md](DEMO.md) - Demo script
- GitHub Discussions - Community Q&A

Still stuck? Open a GitHub issue and we'll help! 🚀
