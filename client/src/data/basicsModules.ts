export interface BasicModule {
  id: number;
  title: string;
  icon: string;
  description: string;
  estimatedMinutes: number;
  content: ModuleContent[];
}

export interface ModuleContent {
  type: 'text' | 'analogy' | 'list' | 'comparison' | 'visual';
  heading?: string;
  content: string | string[] | ComparisonItem[];
  icon?: string;
}

export interface ComparisonItem {
  term: string;
  definition: string;
  example: string;
}

export const basicsModules: BasicModule[] = [
  {
    id: 1,
    title: "What is Cloud Computing?",
    icon: "☁️",
    description: "Learn the fundamentals of cloud computing and why it matters",
    estimatedMinutes: 8,
    content: [
      {
        type: 'text',
        heading: "What is 'The Cloud'?",
        content: "The cloud isn't a magical floating storage space - it's simply someone else's computers! When you use cloud computing, you're renting powerful computers owned by big tech companies like Amazon, Microsoft, or Google."
      },
      {
        type: 'analogy',
        heading: "Think of it like...",
        icon: "🚗",
        content: "Cloud computing is like renting a car instead of buying one. You don't worry about maintenance, insurance, or storage - you just use it when you need it and pay for what you use."
      },
      {
        type: 'text',
        heading: "Why Use the Cloud?",
        content: "Companies love cloud computing because:"
      },
      {
        type: 'list',
        content: [
          "No expensive hardware to buy and maintain",
          "Pay only for what you use (like your electricity bill)",
          "Scale up instantly when you get more users",
          "Access from anywhere in the world",
          "Someone else handles security and updates"
        ]
      },
      {
        type: 'comparison',
        heading: "Traditional vs Cloud",
        content: [
          {
            term: "Traditional (On-Premises)",
            definition: "Buy your own servers, hire IT staff, maintain everything yourself",
            example: "Costs $50,000+ upfront, takes weeks to set up"
          },
          {
            term: "Cloud Computing",
            definition: "Rent computing power, provider handles maintenance",
            example: "Start in minutes, pay $10-100/month"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Core Cloud Service Types",
    icon: "🎯",
    description: "Understand the three main categories of cloud services",
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: "The Big Three Categories",
        content: "All cloud services fall into three main categories. Let's break them down with simple analogies:"
      },
      {
        type: 'comparison',
        content: [
          {
            term: "💻 Compute (The Brain)",
            definition: "Processing power to run your code and applications",
            example: "Running a website, processing videos, analyzing data"
          },
          {
            term: "💾 Storage (The Filing Cabinet)",
            definition: "Space to save files, photos, videos, and documents",
            example: "Storing user photos, backing up files, hosting videos"
          },
          {
            term: "🗄️ Database (The Organized Library)",
            definition: "Structured way to store and find specific information quickly",
            example: "User accounts, product catalogs, order history"
          }
        ]
      },
      {
        type: 'analogy',
        heading: "Real-World Example: Photo Sharing App",
        icon: "📸",
        content: "Imagine building Instagram. You'd need: Compute (to resize images and run the app), Storage (to save all the photos), and Database (to track who posted what, likes, and comments)."
      },
      {
        type: 'text',
        heading: "Beyond the Basics",
        content: "There are other specialized categories too:"
      },
      {
        type: 'list',
        content: [
          "🌐 Networking - Connecting services and managing traffic",
          "🤖 AI & Machine Learning - Smart features like chatbots",
          "💬 Messaging - Services that talk to each other",
          "⚡ Caching - Super-fast temporary storage"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Essential Cloud Jargon",
    icon: "📚",
    description: "Decode the confusing terminology used in cloud computing",
    estimatedMinutes: 12,
    content: [
      {
        type: 'text',
        heading: "Let's Decode Cloud Speak",
        content: "Cloud computing has lots of jargon that sounds complicated but is actually simple. Here are the essentials:"
      },
      {
        type: 'comparison',
        content: [
          {
            term: "Instance / Virtual Machine (VM)",
            definition: "A virtual computer you rent by the hour",
            example: "Like having a Windows PC in the cloud you control remotely"
          },
          {
            term: "Serverless",
            definition: "Code that runs automatically only when needed (you don't manage servers)",
            example: "A function that resizes images only when someone uploads a photo"
          },
          {
            term: "Scaling",
            definition: "Automatically handling more traffic by adding resources",
            example: "Your website handling 10 users or 10,000 users without crashing"
          },
          {
            term: "Region",
            definition: "Physical location of data centers (like 'US West' or 'Europe')",
            example: "Choosing 'Asia' region makes your app faster for Asian users"
          },
          {
            term: "API (Application Programming Interface)",
            definition: "How different programs talk to each other",
            example: "Weather app getting data from a weather service"
          },
          {
            term: "Load Balancer",
            definition: "Traffic cop that spreads work across multiple servers",
            example: "Directing users to different servers so none get overloaded"
          },
          {
            term: "CDN (Content Delivery Network)",
            definition: "Copies of your files stored worldwide for faster access",
            example: "Netflix storing movies near you so they load instantly"
          },
          {
            term: "NoSQL Database",
            definition: "Flexible database that doesn't use rigid rows and columns",
            example: "Storing social media posts with varying fields (some have images, some don't)"
          },
          {
            term: "Object Storage",
            definition: "File storage for any type of file (images, videos, documents)",
            example: "Like Dropbox but for developers - stores anything"
          },
          {
            term: "Latency",
            definition: "Delay or waiting time for data to travel",
            example: "Time between clicking a button and seeing the result"
          }
        ]
      },
      {
        type: 'text',
        heading: "Pro Tip",
        content: "Don't worry about memorizing everything! You'll naturally learn these terms as you use cloud services. This glossary is here whenever you need a refresher."
      }
    ]
  },
  {
    id: 4,
    title: "Understanding Pricing",
    icon: "💰",
    description: "Learn how cloud billing works and how to estimate costs",
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: "Pay-As-You-Go Model",
        content: "Cloud computing works like your electricity or water bill - you only pay for what you actually use. No large upfront costs!"
      },
      {
        type: 'analogy',
        heading: "It's Like a Utility Bill",
        icon: "💡",
        content: "Just like you pay for electricity by the kilowatt-hour, you pay for cloud services by the hour, gigabyte, or request. Use more, pay more. Use less, pay less."
      },
      {
        type: 'comparison',
        heading: "Common Pricing Models",
        content: [
          {
            term: "Per Hour/Second",
            definition: "For compute instances (virtual computers)",
            example: "t2.micro: $0.0116/hour = ~$8.50/month if running 24/7"
          },
          {
            term: "Per GB Stored",
            definition: "For storage services",
            example: "S3 Storage: $0.023/GB/month = $2.30 for 100GB"
          },
          {
            term: "Per Request/Transaction",
            definition: "For serverless functions and APIs",
            example: "Lambda: $0.20 per 1 million requests"
          },
          {
            term: "Free Tier",
            definition: "Many services offer free usage limits for beginners",
            example: "AWS: 750 hours/month of t2.micro free for 1 year"
          }
        ]
      },
      {
        type: 'text',
        heading: "Cost Optimization Tips",
        content: "Ways to keep costs low when starting out:"
      },
      {
        type: 'list',
        content: [
          "Start with free tiers - all major providers offer them",
          "Turn off services when not using them (like turning off lights)",
          "Choose the right size - don't rent a supercomputer if you need a laptop",
          "Use 'Spot' or 'Preemptible' instances for 60-90% discounts",
          "Set billing alerts so you're notified if costs spike"
        ]
      },
      {
        type: 'text',
        heading: "Typical Costs for a Small Project",
        content: "A simple web app with moderate traffic might cost:"
      },
      {
        type: 'list',
        content: [
          "Compute (small instance): $10-30/month",
          "Database: $15-50/month",
          "Storage: $1-5/month",
          "Bandwidth: $5-20/month",
          "Total: ~$30-100/month"
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Choosing a Cloud Provider",
    icon: "🏢",
    description: "Compare AWS, Azure, and GCP to find the right fit",
    estimatedMinutes: 8,
    content: [
      {
        type: 'text',
        heading: "The Big Three Providers",
        content: "Three companies dominate cloud computing. They all offer similar services but have different strengths."
      },
      {
        type: 'comparison',
        content: [
          {
            term: "☁️ AWS (Amazon Web Services)",
            definition: "The largest and most mature cloud provider",
            example: "Most services, biggest ecosystem, but can be overwhelming for beginners"
          },
          {
            term: "🔷 Microsoft Azure",
            definition: "Best for companies using Microsoft products",
            example: "Great for Windows apps, Office 365 integration, enterprise features"
          },
          {
            term: "🔶 Google Cloud (GCP)",
            definition: "Strong in data analytics and AI/ML",
            example: "Simpler than AWS, excellent for machine learning projects"
          }
        ]
      },
      {
        type: 'text',
        heading: "The Truth About Choosing",
        content: "Here's what beginners need to know:"
      },
      {
        type: 'list',
        content: [
          "All three do the same basic things (compute, storage, databases)",
          "Pricing is similar across providers (within 10-20%)",
          "The concepts you learn transfer between providers",
          "Most companies use multiple providers anyway",
          "Start with one, then explore others later"
        ]
      },
      {
        type: 'text',
        heading: "Which Should You Choose?",
        content: "Pick based on your situation:"
      },
      {
        type: 'list',
        content: [
          "Learning cloud? AWS (most tutorials and jobs)",
          "Already use Microsoft? Azure",
          "Data science focus? GCP",
          "Want simplicity? GCP or Azure",
          "Want most options? AWS"
        ]
      },
      {
        type: 'analogy',
        heading: "The Bottom Line",
        icon: "✅",
        content: "Choosing a cloud provider is like choosing between iPhone and Android - they both make phone calls and take photos. Pick one and start learning. You can always switch later!"
      }
    ]
  },
  {
    id: 6,
    title: "Your First Cloud Projects",
    icon: "🚀",
    description: "Simple project ideas to apply what you've learned",
    estimatedMinutes: 7,
    content: [
      {
        type: 'text',
        heading: "Ready to Build Something?",
        content: "Here are beginner-friendly projects that use cloud services. Start simple and gradually increase complexity!"
      },
      {
        type: 'comparison',
        heading: "Project Ideas by Difficulty",
        content: [
          {
            term: "🌟 Beginner: Static Website",
            definition: "Host a personal portfolio or blog",
            example: "Services needed: Object Storage (S3/Azure Blob) + CDN = ~$1-5/month"
          },
          {
            term: "⭐⭐ Intermediate: Photo Gallery",
            definition: "Upload and display photos with captions",
            example: "Services: Storage + Database + Compute Instance = ~$20-40/month"
          },
          {
            term: "⭐⭐ Intermediate: Serverless API",
            definition: "Build a REST API without managing servers",
            example: "Services: Serverless Functions + Database = ~$0-10/month (mostly free tier)"
          },
          {
            term: "⭐⭐⭐ Advanced: Real-time Chat App",
            definition: "Multi-user chat with instant messaging",
            example: "Services: Compute + Database + WebSockets + Storage = ~$30-80/month"
          },
          {
            term: "⭐⭐⭐ Advanced: AI Chatbot",
            definition: "Chatbot using AI/ML services",
            example: "Services: Serverless + AI API + Database = ~$10-50/month depending on usage"
          }
        ]
      },
      {
        type: 'text',
        heading: "Learning Path Recommendation",
        content: "Follow this progression:"
      },
      {
        type: 'list',
        content: [
          "1. Deploy a static website (learn storage + CDN)",
          "2. Add a contact form (learn serverless functions)",
          "3. Build a todo app (learn databases)",
          "4. Add user authentication (learn security)",
          "5. Scale it up (learn load balancing)"
        ]
      },
      {
        type: 'text',
        heading: "Next Steps",
        content: "Now that you understand the basics:"
      },
      {
        type: 'list',
        content: [
          "Browse the 'Services' tab to explore specific offerings",
          "Follow a tutorial for your chosen cloud provider",
          "Start with free tier to experiment safely",
          "Join cloud computing communities for help",
          "Build something, break it, fix it, learn!"
        ]
      },
      {
        type: 'analogy',
        heading: "You're Ready!",
        icon: "🎓",
        content: "Congratulations! You now understand cloud computing fundamentals. Remember: everyone starts as a beginner. The best way to learn is by building real projects. Start small, stay curious, and don't be afraid to experiment!"
      }
    ]
  },
  {
    id: 7,
    title: "Choosing Components for Your Architecture",
    icon: "🏗️",
    description: "Learn how to select the right cloud services for different project needs",
    estimatedMinutes: 15,
    content: [
      {
        type: 'text',
        heading: "Architectural Decision Making",
        content: "Building cloud architecture is like building with LEGO blocks - each service is a specialized piece that does one thing well. The art is knowing which pieces to use and how to connect them."
      },
      {
        type: 'analogy',
        heading: "The Restaurant Kitchen Analogy",
        icon: "🍳",
        content: "Think of cloud architecture like designing a restaurant kitchen. You need: a stove (compute), a fridge (storage), a recipe book (database), and waiters (networking). Each serves a specific purpose, and they all work together to serve customers (users)."
      },
      {
        type: 'text',
        heading: "The Decision Framework",
        content: "When choosing components, ask yourself these questions:"
      },
      {
        type: 'list',
        content: [
          "What does my application DO? (Serves web pages, processes data, stores files)",
          "How many users will I have? (10, 1000, 1 million?)",
          "What's my budget? (Costs scale with usage)",
          "How reliable must it be? (Hobby project vs. business critical)",
          "What data do I need to store? (Files, structured data, temporary cache)"
        ]
      },
      {
        type: 'comparison',
        heading: "Component Selection Guide",
        content: [
          {
            term: "Need to RUN code? → Compute",
            definition: "Choose compute services to execute your application logic",
            example: "EC2 for full control, Lambda for event-driven tasks, ECS for containers"
          },
          {
            term: "Need to SAVE files? → Storage",
            definition: "Choose storage services for documents, images, videos, backups",
            example: "S3 for user uploads, EBS for server disk space, Glacier for long-term archives"
          },
          {
            term: "Need to QUERY data? → Database",
            definition: "Choose databases for structured, searchable information",
            example: "RDS for traditional apps, DynamoDB for high-speed NoSQL, ElastiCache for temporary data"
          },
          {
            term: "Need to DELIVER content fast? → CDN",
            definition: "Choose networking services to speed up global delivery",
            example: "CloudFront to serve static files, Load Balancer to distribute traffic"
          },
          {
            term: "Need INTELLIGENCE? → AI/ML",
            definition: "Choose AI services for smart features without expertise",
            example: "Rekognition for image analysis, Comprehend for text analysis, SageMaker for custom models"
          }
        ]
      },
      {
        type: 'text',
        heading: "Real-World Scenario Analysis",
        content: "Let's walk through choosing components for common scenarios:"
      },
      {
        type: 'comparison',
        heading: "Scenario Examples",
        content: [
          {
            term: "📝 Blog Website (Simple)",
            definition: "Need: Serve pages, store posts, handle comments",
            example: "Components: EC2 (compute) + RDS (database) + S3 (images) + CloudFront (fast delivery)"
          },
          {
            term: "📸 Photo Sharing App (Medium)",
            definition: "Need: Upload photos, search by tags, show feed, notifications",
            example: "Components: Lambda (resize images) + S3 (store photos) + DynamoDB (metadata) + SQS (processing queue)"
          },
          {
            term: "🎮 Multiplayer Game (Complex)",
            definition: "Need: Real-time updates, player data, matchmaking, leaderboards",
            example: "Components: ECS (game servers) + ElastiCache (session state) + RDS (player profiles) + Load Balancer (distribute players)"
          }
        ]
      },
      {
        type: 'text',
        heading: "Common Mistakes to Avoid",
        content: "Beginners often make these mistakes when choosing components:"
      },
      {
        type: 'list',
        content: [
          "Using a database when simple storage would work (over-engineering)",
          "Running a server 24/7 for occasional tasks (use serverless instead)",
          "Storing large files in a database (use object storage)",
          "Not using a CDN for global users (slow international speeds)",
          "Choosing services you don't understand (keep it simple at first)"
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Connecting Components: Data Flow",
    icon: "🔗",
    description: "Understand how cloud services communicate and pass data between each other",
    estimatedMinutes: 12,
    content: [
      {
        type: 'text',
        heading: "Understanding Data Flow",
        content: "Cloud architecture isn't just about picking services - it's about connecting them so data flows smoothly from one to another. Think of it like plumbing: water needs clear pipes to flow from the tank to your tap."
      },
      {
        type: 'analogy',
        heading: "The Assembly Line Analogy",
        icon: "🏭",
        content: "Imagine a car factory assembly line. Each station (service) does one job, then passes the car (data) to the next station. The conveyor belt (connections) ensures smooth flow. If one station is slow, the whole line backs up!"
      },
      {
        type: 'text',
        heading: "Basic Connection Patterns",
        content: "There are three fundamental ways cloud services connect:"
      },
      {
        type: 'comparison',
        content: [
          {
            term: "1. Direct Connection (Request-Response)",
            definition: "Service A asks Service B for something and waits for an answer",
            example: "Your app (EC2) queries the database (RDS) for user info. App waits, gets data back, continues."
          },
          {
            term: "2. Event-Driven (Fire and Forget)",
            definition: "Service A triggers Service B but doesn't wait around",
            example: "User uploads photo → triggers Lambda → Lambda processes it. User doesn't wait for processing."
          },
          {
            term: "3. Queue-Based (Ordered Processing)",
            definition: "Service A drops tasks in a queue, Service B picks them up when ready",
            example: "Email sending jobs go into SQS queue. Lambda functions pull jobs and send emails at their own pace."
          }
        ]
      },
      {
        type: 'text',
        heading: "Visualizing Data Flow",
        content: "Let's trace data through a real photo-sharing app:"
      },
      {
        type: 'list',
        content: [
          "1️⃣ User uploads photo → API Gateway receives it",
          "2️⃣ API Gateway → Lambda Function (handles upload)",
          "3️⃣ Lambda → S3 (stores original photo)",
          "4️⃣ S3 upload event → Another Lambda (creates thumbnails)",
          "5️⃣ Lambda → S3 (stores thumbnail versions)",
          "6️⃣ Lambda → DynamoDB (saves metadata: owner, timestamp, tags)",
          "7️⃣ DynamoDB → Triggers notification Lambda",
          "8️⃣ Notification Lambda → SNS (sends push notification to followers)"
        ]
      },
      {
        type: 'text',
        heading: "Connection Best Practices",
        content: "Follow these principles when connecting services:"
      },
      {
        type: 'comparison',
        heading: "Do's and Don'ts",
        content: [
          {
            term: "✅ DO: Use Load Balancers",
            definition: "Spread traffic across multiple servers for reliability",
            example: "Load Balancer → [Server 1, Server 2, Server 3]. If one fails, others handle traffic."
          },
          {
            term: "✅ DO: Add Caching Layers",
            definition: "Put a cache between your app and database for speed",
            example: "App → ElastiCache → RDS. Frequent queries hit cache (fast!), not database."
          },
          {
            term: "❌ DON'T: Create Circular Dependencies",
            definition: "Avoid A calls B, B calls A - creates loops",
            example: "Bad: Lambda A triggers Lambda B, Lambda B triggers Lambda A = infinite loop!"
          },
          {
            term: "❌ DON'T: Tightly Couple Everything",
            definition: "Don't make every service talk to every other service",
            example: "Use a queue or event bus as a central hub instead of direct connections everywhere."
          }
        ]
      },
      {
        type: 'text',
        heading: "Common Connection Patterns",
        content: "Here are the most common architectural patterns you'll see:"
      },
      {
        type: 'list',
        content: [
          "🌐 Three-Tier: User → Load Balancer → App Servers → Database (classic web app)",
          "⚡ Serverless: API Gateway → Lambda Functions → DynamoDB (modern, scalable)",
          "📨 Event-Driven: S3 Upload → Lambda → Process → SNS → Notify (async processing)",
          "🔄 Microservices: Load Balancer → [Service A, Service B, Service C] → Shared Database",
          "💾 Cached: App → Cache → Database (read-heavy apps)"
        ]
      },
      {
        type: 'analogy',
        heading: "The Key Insight",
        icon: "💡",
        content: "Good architecture is like good plumbing - you shouldn't notice it! Data flows smoothly, services handle failures gracefully, and users get fast responses. Start simple, then add connections as needed."
      }
    ]
  },
  {
    id: 9,
    title: "Designing for Scale and Reliability",
    icon: "📈",
    description: "Learn principles for building cloud systems that handle growth and failures",
    estimatedMinutes: 14,
    content: [
      {
        type: 'text',
        heading: "What is 'Scale'?",
        content: "Scale means your system can handle growing demand - more users, more data, more requests - without breaking or slowing down. It's like a restaurant that can serve 10 people or 1000 people without chaos."
      },
      {
        type: 'comparison',
        heading: "Two Types of Scaling",
        content: [
          {
            term: "⬆️ Vertical Scaling (Scaling Up)",
            definition: "Make your server bigger and more powerful",
            example: "Upgrade from t2.small → t2.large (more CPU, more RAM). Simple but has limits - you can't buy infinite power!"
          },
          {
            term: "➡️ Horizontal Scaling (Scaling Out)",
            definition: "Add more servers working together",
            example: "Go from 1 server → 10 servers. Each handles some traffic. No single point of failure, unlimited growth potential."
          }
        ]
      },
      {
        type: 'text',
        heading: "The Reliability Challenge",
        content: "In cloud computing, things WILL fail. Hard drives die, networks glitch, data centers lose power. Great architecture assumes failure and handles it gracefully."
      },
      {
        type: 'analogy',
        heading: "The Backup Parachute Analogy",
        icon: "🪂",
        content: "Skydivers don't carry one parachute - they carry two! If the main one fails, they have a backup. Cloud architecture works the same way: redundancy and backups at every level."
      },
      {
        type: 'text',
        heading: "Design Principles for Scale",
        content: "Follow these principles to build systems that scale:"
      },
      {
        type: 'comparison',
        content: [
          {
            term: "1. Stateless Design",
            definition: "Servers don't remember previous requests - any server can handle any user",
            example: "User session stored in Redis, not on server. Any server can read it. Easy to add/remove servers."
          },
          {
            term: "2. Database Optimization",
            definition: "Databases are often the bottleneck - optimize them first",
            example: "Add read replicas (copies) for reads, use caching for frequent queries, archive old data."
          },
          {
            term: "3. Async Processing",
            definition: "Don't make users wait for slow tasks - process them in background",
            example: "User uploads video → immediate response 'Processing...' → Lambda processes in background → notify when done."
          },
          {
            term: "4. Auto-Scaling",
            definition: "Automatically add servers during high traffic, remove during low traffic",
            example: "Black Friday: Auto-add 50 servers at 8am, remove them at midnight. Pay only for what you use."
          }
        ]
      },
      {
        type: 'text',
        heading: "Reliability Best Practices",
        content: "Make your system resilient to failures:"
      },
      {
        type: 'list',
        content: [
          "🌍 Multi-Region: Run in multiple geographic locations (US, Europe, Asia)",
          "🔄 Redundancy: Run multiple copies of everything (3+ servers, 2+ databases)",
          "💾 Backups: Automatic daily backups, test restoring them regularly",
          "🚨 Monitoring: Know immediately when something breaks (alerts, dashboards)",
          "🔁 Retry Logic: Auto-retry failed operations (network hiccups happen)",
          "⚡ Circuit Breakers: Stop hitting a failing service (give it time to recover)"
        ]
      },
      {
        type: 'text',
        heading: "The Cost vs. Reliability Trade-off",
        content: "More reliability = more cost. You need to balance based on your needs:"
      },
      {
        type: 'comparison',
        heading: "Reliability Tiers",
        content: [
          {
            term: "💰 Hobby/Startup (99% uptime)",
            definition: "1 server, 1 database, daily backups. ~7 hours downtime/year acceptable.",
            example: "Cost: $50-200/month. Good enough for MVPs, personal projects."
          },
          {
            term: "💼 Business (99.9% uptime)",
            definition: "Load balancer, 2-3 servers, database replicas, multi-AZ. ~8 hours downtime/year.",
            example: "Cost: $500-2000/month. Standard for small businesses, SaaS apps."
          },
          {
            term: "🏢 Enterprise (99.99% uptime)",
            definition: "Multi-region, auto-scaling, managed services, 24/7 monitoring. ~50 minutes downtime/year.",
            example: "Cost: $5000-50000+/month. Required for banks, healthcare, critical infrastructure."
          }
        ]
      },
      {
        type: 'text',
        heading: "Start Simple, Scale Smart",
        content: "The secret beginners miss:"
      },
      {
        type: 'list',
        content: [
          "Don't over-engineer from day 1 - start with one server",
          "Add complexity ONLY when you feel the pain (slowness, downtime)",
          "Measure before optimizing - know your bottlenecks",
          "Most apps never need 'web-scale' - 99% is often enough",
          "Use managed services (RDS, Lambda) - they handle scaling for you"
        ]
      },
      {
        type: 'analogy',
        heading: "The Wisdom",
        icon: "🧠",
        content: "Premature optimization is the root of all evil. Build something that works, measure what's slow, fix that bottleneck, repeat. Instagram started on one server. They scaled as they grew. You can too!"
      }
    ]
  },
  {
    id: 10,
    title: "Hands-On: Your First Challenge Walkthrough",
    icon: "🎯",
    description: "Step-by-step guide to solving an easy cloud architecture challenge",
    estimatedMinutes: 20,
    content: [
      {
        type: 'text',
        heading: "Let's Build Something Real!",
        content: "Time to apply everything you've learned! We'll walk through solving Challenge #8: 'Add Caching to Slow API' - a real-world problem you'll encounter in your career."
      },
      {
        type: 'analogy',
        heading: "The Challenge Scenario",
        icon: "🏢",
        content: "Your company has a Lambda function serving an API backed by RDS PostgreSQL. Users are complaining about slow response times (800ms average). The database queries are expensive and frequently accessed data rarely changes. Your mission: add caching to improve performance."
      },
      {
        type: 'text',
        heading: "Step 1: Read and Understand Requirements",
        content: "Before touching anything, let's analyze what we're given:"
      },
      {
        type: 'comparison',
        heading: "Given Infrastructure (DO NOT TOUCH)",
        content: [
          {
            term: "Lambda Function",
            definition: "Your serverless API that handles user requests",
            example: "512MB Node.js, costs $8/month. Already connected to database."
          },
          {
            term: "RDS PostgreSQL",
            definition: "Your database storing all the data users query",
            example: "db.t3.medium, costs $45/month. Slow but accurate."
          }
        ]
      },
      {
        type: 'text',
        heading: "Requirements We Must Meet:",
        content: ""
      },
      {
        type: 'list',
        content: [
          "✅ Keep existing Lambda and RDS unchanged (don't remove them)",
          "✅ Cache frequently accessed data",
          "✅ Reduce database query load by 70%",
          "✅ Improve response time from 800ms to under 200ms",
          "✅ Handle cache invalidation properly",
          "✅ Stay within $40/month budget"
        ]
      },
      {
        type: 'text',
        heading: "Step 2: Identify the Problem",
        content: "Why is the API slow? Let's trace the current flow:"
      },
      {
        type: 'list',
        content: [
          "1️⃣ User sends request to Lambda",
          "2️⃣ Lambda queries RDS database (slow! 600-800ms)",
          "3️⃣ Database searches, finds data, returns it",
          "4️⃣ Lambda sends response to user",
          "🐌 Total time: ~800ms (too slow for good UX)"
        ]
      },
      {
        type: 'text',
        heading: "The Core Issue:",
        content: "Every request hits the database, even for data that rarely changes. We're asking the same questions over and over!"
      },
      {
        type: 'text',
        heading: "Step 3: Choose the Right Solution",
        content: "What service solves this problem? Think through options:"
      },
      {
        type: 'comparison',
        heading: "Service Options Analysis",
        content: [
          {
            term: "❌ Another Database?",
            definition: "No - we'd still be querying a database, just a different one",
            example: "Doesn't solve the speed problem"
          },
          {
            term: "❌ Bigger RDS Instance?",
            definition: "Vertical scaling helps but wastes money",
            example: "db.t3.large costs $90/month, only 2x faster. Not enough improvement."
          },
          {
            term: "✅ Add a Cache! (ElastiCache/Redis)",
            definition: "In-memory data store - 100x faster than database",
            example: "Store frequent queries in RAM. Reads take 5-10ms instead of 600ms!"
          }
        ]
      },
      {
        type: 'text',
        heading: "Step 4: Design the New Architecture",
        content: "Let's map out the new data flow:"
      },
      {
        type: 'list',
        content: [
          "1️⃣ User sends request to Lambda",
          "2️⃣ Lambda checks ElastiCache first (5-10ms)",
          "3️⃣ If data is in cache (cache hit) → return immediately ⚡ (150ms total)",
          "4️⃣ If data NOT in cache (cache miss) → query RDS (600ms)",
          "5️⃣ Store result in cache for next time",
          "6️⃣ Return data to user"
        ]
      },
      {
        type: 'analogy',
        heading: "The Cache Analogy",
        icon: "📚",
        content: "Imagine asking a librarian for a book. Without cache: she walks to the back, searches shelves, brings it (10 minutes). With cache: she keeps popular books at her desk, hands it to you instantly (10 seconds). That's caching!"
      },
      {
        type: 'text',
        heading: "Step 5: Select the Specific Service",
        content: "Now let's choose the exact ElastiCache configuration:"
      },
      {
        type: 'comparison',
        heading: "ElastiCache Options",
        content: [
          {
            term: "cache.t3.micro - $12/month",
            definition: "Smallest instance, 0.5GB RAM",
            example: "✅ PERFECT! Fits our $40 budget ($8+$45+$12=$65 total - wait, that's over!)"
          },
          {
            term: "Wait... Budget Check!",
            definition: "Existing infra costs $53/month ($8 Lambda + $45 RDS)",
            example: "Budget is $40 but existing is $53? Challenge is testing if you notice this!"
          },
          {
            term: "The Real Solution",
            definition: "We can only ADD services, so we need the cheapest cache",
            example: "cache.t3.micro at $12/month. Total: $65. Over budget means we need to optimize differently!"
          }
        ]
      },
      {
        type: 'text',
        heading: "Step 6: Optimize to Meet Budget",
        content: "Uh oh, we're over budget! What can we do?"
      },
      {
        type: 'list',
        content: [
          "Option 1: Use Redis on the Lambda itself (limited memory, not ideal)",
          "Option 2: Check if challenge allows cost optimization suggestions",
          "Option 3: Use DynamoDB as a cache (cheaper, still fast)",
          "Reality Check: Most real challenges have realistic budgets - this teaches you to question requirements!"
        ]
      },
      {
        type: 'text',
        heading: "Step 7: Connect the Components",
        content: "In the challenge interface, you'll:"
      },
      {
        type: 'list',
        content: [
          "1. Drag ElastiCache (Redis) onto the canvas",
          "2. Connect Lambda → ElastiCache (check cache first)",
          "3. Keep Lambda → RDS connection (fallback for cache misses)",
          "4. Configure cache: TTL (time-to-live) of 5 minutes",
          "5. Verify total cost is acceptable"
        ]
      },
      {
        type: 'text',
        heading: "Step 8: Understand the Results",
        content: "After adding the cache, here's what happens:"
      },
      {
        type: 'comparison',
        heading: "Before vs After",
        content: [
          {
            term: "Before: Every Request Hits Database",
            definition: "100 requests = 100 database queries = slow & expensive",
            example: "Average response: 800ms, Database load: 100%"
          },
          {
            term: "After: Most Requests Hit Cache",
            definition: "100 requests = 20 cache misses (new data) + 80 cache hits (cached)",
            example: "Average response: 200ms (75% faster!), Database load: 20% (80% reduction!)"
          }
        ]
      },
      {
        type: 'text',
        heading: "Key Lessons from This Challenge",
        content: "What did we learn?"
      },
      {
        type: 'list',
        content: [
          "🎯 Identify bottlenecks BEFORE choosing solutions (database was the bottleneck)",
          "💡 Caching is perfect for read-heavy workloads with repetitive queries",
          "🔗 Architecture is about data flow: Lambda → Cache → Database (fallback)",
          "💰 Always validate your solution meets ALL constraints (cost, performance, requirements)",
          "⚡ Small additions can have huge impact (one cache = 4x speed improvement!)",
          "🧠 Think in patterns: this cache pattern applies to thousands of real scenarios"
        ]
      },
      {
        type: 'analogy',
        heading: "You Did It!",
        icon: "🎉",
        content: "You just solved your first cloud architecture challenge! You identified a bottleneck, chose the right service, designed the data flow, and validated the solution. These same skills will help you solve challenges in real jobs. Now go try more challenges on your own - you've got this!"
      },
      {
        type: 'text',
        heading: "Next Steps",
        content: "Ready to practice on your own?"
      },
      {
        type: 'list',
        content: [
          "🎮 Try Challenge #1: 'Simple Static Website Hosting' (easiest one)",
          "📝 Try Challenge #8: 'Add Caching to Slow API' (the one we just walked through!)",
          "💪 Once comfortable, attempt Medium challenges",
          "🏆 Join the leaderboard and compete with others",
          "🌐 Apply these patterns to your own projects"
        ]
      }
    ]
  }
];
