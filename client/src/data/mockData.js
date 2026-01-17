// Mock data for demo - no backend needed!

export const mockChallenges = [
  {
    id: '1',
    title: "Simple Static Website Hosting",
    difficulty: "Easy",
    description: "Design a cloud architecture to host a static website with global distribution. The website should be fast, secure, and cost-effective.",
    requirements: [
      "Host static HTML/CSS/JS files",
      "Serve content globally with low latency",
      "Support HTTPS",
      "Keep costs under $10/month for 10GB storage and 100GB bandwidth"
    ],
    constraints: {
      maxCost: 10,
      requiredServices: ["storage", "networking"],
      optionalServices: []
    },
    category: "Storage",
    acceptanceRate: 85.3,
    submissions: 234
  },
  {
    id: '2',
    title: "Serverless REST API",
    difficulty: "Medium",
    description: "Build a scalable REST API architecture that handles variable traffic without managing servers. The API should store data persistently and scale automatically.",
    requirements: [
      "Handle HTTP requests without managing servers",
      "Store and retrieve data efficiently",
      "Auto-scale based on demand",
      "Support authentication",
      "Keep costs under $30/month for 1M requests"
    ],
    constraints: {
      maxCost: 30,
      requiredServices: ["serverless", "database"],
      optionalServices: ["networking", "cache"]
    },
    category: "Serverless",
    acceptanceRate: 62.8,
    submissions: 187
  },
  {
    id: '3',
    title: "High-Traffic Web Application",
    difficulty: "Medium",
    description: "Design a robust architecture for a web application expecting high traffic. The system should be fault-tolerant, scalable, and provide fast response times.",
    requirements: [
      "Load balance across multiple servers",
      "Cache frequently accessed data",
      "Store data in a relational database",
      "Handle 10,000+ requests per minute",
      "Ensure high availability (99.9% uptime)"
    ],
    constraints: {
      maxCost: 200,
      requiredServices: ["compute", "database", "networking"],
      optionalServices: ["cache"]
    },
    category: "Full-Stack",
    acceptanceRate: 45.2,
    submissions: 156
  },
  {
    id: '4',
    title: "Real-time Data Processing Pipeline",
    difficulty: "Hard",
    description: "Create an architecture to process real-time streaming data from IoT devices. The system should ingest, process, store, and analyze millions of events per day.",
    requirements: [
      "Ingest streaming data from multiple sources",
      "Process and transform data in real-time",
      "Store raw and processed data",
      "Enable analytics and querying",
      "Handle at least 100 events/second",
      "Ensure no data loss"
    ],
    constraints: {
      maxCost: 500,
      requiredServices: ["messaging", "serverless", "database", "storage"],
      optionalServices: []
    },
    category: "Full-Stack",
    acceptanceRate: 28.5,
    submissions: 92
  },
  {
    id: '5',
    title: "Multi-Region Disaster Recovery",
    difficulty: "Hard",
    description: "Design a disaster recovery architecture that can failover to another region within 5 minutes with minimal data loss. The application must maintain high availability.",
    requirements: [
      "Active-passive setup across two regions",
      "Automatic failover capability",
      "Database replication with < 1 minute lag",
      "RTO (Recovery Time Objective) < 5 minutes",
      "RPO (Recovery Point Objective) < 1 minute"
    ],
    constraints: {
      maxCost: 1000,
      requiredServices: ["compute", "database", "networking", "storage"],
      optionalServices: []
    },
    category: "Full-Stack",
    acceptanceRate: 15.7,
    submissions: 51
  },
  {
    id: '6',
    title: "AI Chatbot Deployment",
    difficulty: "Medium",
    description: "Deploy a scalable AI chatbot using serverless architecture and GPU compute. Choose the right LLM model based on cost, performance, and latency requirements. The solution should handle conversational AI workloads efficiently.",
    requirements: [
      "Deploy an LLM for chatbot functionality",
      "Use serverless architecture for auto-scaling",
      "Store conversation history in a database",
      "Support at least 100 concurrent users",
      "Response time under 3 seconds",
      "Balance cost and model performance"
    ],
    constraints: {
      maxCost: 150,
      requiredServices: ["ai", "serverless", "database"],
      optionalServices: ["compute", "storage", "networking"]
    },
    category: "Serverless",
    acceptanceRate: 38.4,
    submissions: 125
  },
  {
    id: '7',
    title: "Add Search to Existing E-commerce",
    difficulty: "Medium",
    description: "Your company's e-commerce platform stores product data in DynamoDB and images in S3. Now you need to add full-text search capabilities to allow customers to search products by name, description, and tags. Extend the existing architecture without disrupting current operations.",
    requirements: [
      "Integrate search without changing existing S3 and DynamoDB setup",
      "Index product data for fast search queries",
      "Support autocomplete and fuzzy matching",
      "Keep search results up-to-date with database changes",
      "Handle 500+ searches per minute",
      "Search response time under 200ms"
    ],
    constraints: {
      maxCost: 100,
      requiredServices: ["database"],
      optionalServices: ["serverless", "compute", "cache"]
    },
    category: "Database",
    acceptanceRate: 52.3,
    submissions: 143,
    existingInfrastructure: {
      nodes: [
        {
          id: 'existing-s3',
          type: 'serviceNode',
          position: { x: 100, y: 100 },
          data: {
            serviceName: 'S3',
            customLabel: 'Product Images',
            category: 'storage',
            cost: 15,
            specs: '500GB storage',
            description: 'Stores product images',
            inputSpec: 'Image uploads',
            outputSpec: 'Image URLs',
            isExisting: true
          }
        },
        {
          id: 'existing-dynamodb',
          type: 'serviceNode',
          position: { x: 400, y: 100 },
          data: {
            serviceName: 'DynamoDB',
            customLabel: 'Product Catalog',
            category: 'database',
            cost: 50,
            specs: '25 RCU, 25 WCU',
            description: 'Product database',
            inputSpec: 'Product CRUD operations',
            outputSpec: 'Product data',
            isExisting: true
          }
        }
      ],
      edges: [
        {
          id: 'e-s3-dynamodb',
          source: 'existing-s3',
          target: 'existing-dynamodb',
          animated: true,
          style: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 2 }
        }
      ]
    }
  },
  {
    id: '8',
    title: "Add Caching to Slow API",
    difficulty: "Easy",
    description: "Your company has a Lambda function serving an API backed by RDS PostgreSQL. Users are complaining about slow response times. The database queries are expensive and frequently accessed data rarely changes. Add caching to improve performance.",
    requirements: [
      "Keep existing Lambda and RDS setup unchanged",
      "Cache frequently accessed data",
      "Reduce database query load by 70%",
      "Improve average response time from 800ms to under 200ms",
      "Handle cache invalidation properly",
      "Stay within budget"
    ],
    constraints: {
      maxCost: 40,
      requiredServices: ["cache"],
      optionalServices: ["serverless"]
    },
    category: "Serverless",
    acceptanceRate: 71.2,
    submissions: 198,
    existingInfrastructure: {
      nodes: [
        {
          id: 'existing-lambda',
          type: 'serviceNode',
          position: { x: 100, y: 150 },
          data: {
            serviceName: 'Lambda',
            customLabel: 'API Handler',
            category: 'serverless',
            cost: 8,
            specs: '512MB, Node.js',
            description: 'API Gateway handler',
            inputSpec: 'HTTP requests',
            outputSpec: 'JSON responses',
            isExisting: true
          }
        },
        {
          id: 'existing-rds',
          type: 'serviceNode',
          position: { x: 450, y: 150 },
          data: {
            serviceName: 'RDS',
            customLabel: 'PostgreSQL DB',
            category: 'database',
            cost: 45,
            specs: 'db.t3.medium',
            description: 'Relational database',
            inputSpec: 'SQL queries',
            outputSpec: 'Query results',
            isExisting: true
          }
        }
      ],
      edges: [
        {
          id: 'e-lambda-rds',
          source: 'existing-lambda',
          target: 'existing-rds',
          animated: true,
          style: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 2 }
        }
      ]
    }
  },
  {
    id: '9',
    title: "Extend Video Platform with Analytics",
    difficulty: "Hard",
    description: "Your video streaming platform uses S3 for video storage and CloudFront for CDN. Marketing wants analytics on video views, watch time, user behavior, and popular content. Build a real-time analytics pipeline that integrates with the existing infrastructure.",
    requirements: [
      "Don't modify existing S3 and CloudFront setup",
      "Track video views, watch time, and user engagement in real-time",
      "Store analytics data for reporting and dashboards",
      "Process 10,000+ events per minute",
      "Enable SQL queries on analytics data",
      "Provide near real-time insights (< 5 minute delay)"
    ],
    constraints: {
      maxCost: 250,
      requiredServices: ["messaging", "database", "serverless"],
      optionalServices: ["storage", "compute"]
    },
    category: "Full-Stack",
    acceptanceRate: 33.8,
    submissions: 89,
    existingInfrastructure: {
      nodes: [
        {
          id: 'existing-s3-videos',
          type: 'serviceNode',
          position: { x: 50, y: 100 },
          data: {
            serviceName: 'S3',
            customLabel: 'Video Storage',
            category: 'storage',
            cost: 120,
            specs: '5TB storage',
            description: 'Video file storage',
            inputSpec: 'Video uploads',
            outputSpec: 'Video files',
            isExisting: true
          }
        },
        {
          id: 'existing-cloudfront',
          type: 'serviceNode',
          position: { x: 400, y: 100 },
          data: {
            serviceName: 'CloudFront',
            customLabel: 'Video CDN',
            category: 'networking',
            cost: 85,
            specs: '10TB bandwidth',
            description: 'Content delivery network',
            inputSpec: 'Video requests',
            outputSpec: 'Video streams',
            isExisting: true
          }
        }
      ],
      edges: [
        {
          id: 'e-s3-cloudfront',
          source: 'existing-s3-videos',
          target: 'existing-cloudfront',
          animated: true,
          style: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 2 }
        }
      ]
    }
  },
  {
    id: '10',
    title: "Add AI Image Recognition to Photo App",
    difficulty: "Medium",
    description: "Your photo sharing app stores user photos in S3 and metadata in DynamoDB. Users want automatic tagging and object detection in their photos. Add AI-powered image recognition that processes images when uploaded.",
    requirements: [
      "Integrate with existing S3 photo storage and DynamoDB",
      "Automatically detect objects, faces, and scenes in uploaded photos",
      "Tag photos with detected labels",
      "Update DynamoDB with tags without manual intervention",
      "Process images within 10 seconds of upload",
      "Handle 100+ photo uploads per minute"
    ],
    constraints: {
      maxCost: 120,
      requiredServices: ["ai"],
      optionalServices: ["serverless", "messaging", "compute"]
    },
    category: "Compute",
    acceptanceRate: 44.7,
    submissions: 167,
    existingInfrastructure: {
      nodes: [
        {
          id: 'existing-s3-photos',
          type: 'serviceNode',
          position: { x: 100, y: 150 },
          data: {
            serviceName: 'S3',
            customLabel: 'Photo Storage',
            category: 'storage',
            cost: 35,
            specs: '1TB storage',
            description: 'User photo storage',
            inputSpec: 'Photo uploads',
            outputSpec: 'Photo URLs',
            isExisting: true
          }
        },
        {
          id: 'existing-dynamodb-photos',
          type: 'serviceNode',
          position: { x: 450, y: 150 },
          data: {
            serviceName: 'DynamoDB',
            customLabel: 'Photo Metadata',
            category: 'database',
            cost: 30,
            specs: '10 RCU, 10 WCU',
            description: 'Photo metadata database',
            inputSpec: 'Metadata writes',
            outputSpec: 'Photo metadata',
            isExisting: true
          }
        }
      ],
      edges: [
        {
          id: 'e-s3-dynamodb-photos',
          source: 'existing-s3-photos',
          target: 'existing-dynamodb-photos',
          animated: true,
          style: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 2 }
        }
      ]
    }
  }
];

export const mockLeaderboard = [
  { rank: 1, username: "cloudmaster", totalScore: 4250, solvedCount: 5 },
  { rank: 2, username: "architech_pro", totalScore: 3890, solvedCount: 5 },
  { rank: 3, username: "aws_ninja", totalScore: 3620, solvedCount: 4 },
  { rank: 4, username: "azure_wizard", totalScore: 3180, solvedCount: 4 },
  { rank: 5, username: "gcp_expert", totalScore: 2950, solvedCount: 3 },
  { rank: 6, username: "devops_hero", totalScore: 2730, solvedCount: 3 },
  { rank: 7, username: "cloud_learner", totalScore: 2420, solvedCount: 3 },
  { rank: 8, username: "serverless_sam", totalScore: 2180, solvedCount: 2 },
  { rank: 9, username: "infra_builder", totalScore: 1950, solvedCount: 2 },
  { rank: 10, username: "tech_enthusiast", totalScore: 1720, solvedCount: 2 }
];

export const mockCostLeaderboard = [
  { rank: 1, username: "frugal_architect", challenge: "Simple Static Website Hosting", cost: 5.23, score: 950 },
  { rank: 2, username: "cost_optimizer", challenge: "Serverless REST API", cost: 3.15, score: 920 },
  { rank: 3, username: "penny_pincher", challenge: "Simple Static Website Hosting", cost: 6.78, score: 890 },
  { rank: 4, username: "efficient_builder", challenge: "High-Traffic Web Application", cost: 87.50, score: 850 },
  { rank: 5, username: "smart_designer", challenge: "Serverless REST API", cost: 4.92, score: 820 }
];

// Mock users stored in localStorage
export const getMockUser = () => {
  const user = localStorage.getItem('mockUser');
  return user ? JSON.parse(user) : null;
};

export const setMockUser = (user) => {
  localStorage.setItem('mockUser', JSON.stringify(user));
};

export const removeMockUser = () => {
  localStorage.removeItem('mockUser');
};

// Mock submissions stored in localStorage
export const getMockSubmissions = () => {
  const submissions = localStorage.getItem('mockSubmissions');
  return submissions ? JSON.parse(submissions) : [];
};

export const addMockSubmission = (submission) => {
  const submissions = getMockSubmissions();
  submissions.push(submission);
  localStorage.setItem('mockSubmissions', JSON.stringify(submissions));
};
