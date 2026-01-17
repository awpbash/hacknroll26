// Mock data for demo - no backend needed!

import type { Challenge } from '../types';

export const mockChallenges: Challenge[] = [
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
      optionalServices: [],
      minServices: 2,
      maxServices: 4
    },
    category: "Storage",
    acceptanceRate: 85.3,
    submissions: 234,
    editorial: `
      <h2>Approach Overview</h2>
      <p>Static website hosting is one of the most cost-effective cloud architecture patterns. The key is to separate storage from distribution to achieve global performance at minimal cost.</p>

      <h3>Core Components</h3>
      <ul>
        <li><strong>Object Storage:</strong> Store your HTML, CSS, JavaScript, and media files in S3, Azure Blob Storage, or GCS</li>
        <li><strong>CDN (Content Delivery Network):</strong> Use CloudFront, Azure CDN, or Cloud CDN to cache and serve content from edge locations worldwide</li>
      </ul>

      <h3>Cost Optimization Strategies</h3>
      <p>The typical cost breakdown for a small static site:</p>
      <ul>
        <li>Storage: ~$0.23/month for 10GB</li>
        <li>Requests: ~$0.40/month for 100K requests</li>
        <li>Data Transfer: $8-9/month for 100GB (the main cost driver)</li>
      </ul>

      <p><strong>Pro tip:</strong> Most CDNs offer a generous free tier. CloudFront includes 1TB of data transfer free for the first year!</p>

      <h3>Security Best Practices</h3>
      <ul>
        <li>Enable HTTPS using free SSL certificates from your CDN provider</li>
        <li>Block direct access to your storage bucket - only allow CDN access</li>
        <li>Use CloudFront Origin Access Identity (OAI) for AWS or similar features for other providers</li>
      </ul>

      <h2>Architecture Pattern</h2>
      <p>The optimal architecture is simple:</p>
      <code>Users → CDN → Object Storage</code>

      <p>This pattern scales automatically, requires zero server management, and costs less than $10/month for most small to medium traffic websites.</p>
    `,
    solutions: [
      {
        id: 'sol-1-1',
        author: 'CloudArchitect',
        title: 'AWS S3 + CloudFront Solution',
        architecture: {
          nodes: [
            {
              id: 'sol1-s3',
              type: 'serviceNode',
              position: { x: 100, y: 150 },
              data: {
                serviceName: 'S3',
                customLabel: 'Static Website',
                category: 'storage',
                cost: 0.23,
                specs: '10GB storage',
                inputSpec: 'HTML/CSS/JS files',
                outputSpec: 'Web assets'
              }
            },
            {
              id: 'sol1-cloudfront',
              type: 'serviceNode',
              position: { x: 450, y: 150 },
              data: {
                serviceName: 'CloudFront',
                customLabel: 'Global CDN',
                category: 'networking',
                cost: 8.50,
                specs: '100GB transfer',
                inputSpec: 'User requests',
                outputSpec: 'Cached content'
              }
            }
          ],
          edges: [
            {
              id: 'sol1-e1',
              source: 'sol1-s3',
              target: 'sol1-cloudfront',
              animated: true
            }
          ]
        },
        explanation: `
          <p>This solution uses the classic AWS combination of S3 for storage and CloudFront for content delivery.</p>
          <h3>Why This Works</h3>
          <ul>
            <li><strong>S3 Static Website Hosting:</strong> Enable static website hosting on your S3 bucket to serve index.html by default</li>
            <li><strong>CloudFront CDN:</strong> Caches content at 200+ edge locations worldwide for fast delivery</li>
            <li><strong>Cost Breakdown:</strong> $0.23 storage + $8.50 transfer = $8.73/month total</li>
          </ul>
          <p>This solution stays well under the $10 budget and provides excellent performance globally.</p>
        `,
        totalCost: 8.73,
        upvotes: 342,
        provider: 'AWS'
      },
      {
        id: 'sol-1-2',
        author: 'AzureExpert',
        title: 'Azure Blob Storage + CDN',
        architecture: {
          nodes: [
            {
              id: 'sol2-blob',
              type: 'serviceNode',
              position: { x: 100, y: 150 },
              data: {
                serviceName: 'Azure Blob Storage',
                customLabel: 'Static Content',
                category: 'storage',
                cost: 0.18,
                specs: '10GB storage',
                inputSpec: 'Static files',
                outputSpec: 'Web content'
              }
            },
            {
              id: 'sol2-cdn',
              type: 'serviceNode',
              position: { x: 450, y: 150 },
              data: {
                serviceName: 'Azure CDN',
                customLabel: 'Edge Network',
                category: 'networking',
                cost: 8.10,
                specs: '100GB transfer',
                inputSpec: 'HTTP requests',
                outputSpec: 'Cached responses'
              }
            }
          ],
          edges: [
            {
              id: 'sol2-e1',
              source: 'sol2-blob',
              target: 'sol2-cdn',
              animated: true
            }
          ]
        },
        explanation: `
          <p>Azure provides a similar solution with Blob Storage and Azure CDN, often at slightly lower costs.</p>
          <h3>Key Features</h3>
          <ul>
            <li><strong>Static Website Hosting:</strong> Blob Storage has built-in static website support</li>
            <li><strong>Integrated CDN:</strong> Azure CDN integrates seamlessly with Blob Storage</li>
            <li><strong>Cost Advantage:</strong> Slightly cheaper than AWS at $8.28/month</li>
          </ul>
        `,
        totalCost: 8.28,
        upvotes: 187,
        provider: 'Azure'
      }
    ]
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
      optionalServices: ["networking", "cache"],
      minServices: 3,
      maxServices: 6
    },
    category: "Serverless",
    acceptanceRate: 62.8,
    submissions: 187,
    editorial: `
      <h2>Serverless API Architecture</h2>
      <p>Serverless architectures are perfect for APIs because they automatically scale from zero to millions of requests, and you only pay for what you use.</p>

      <h3>Core Components</h3>
      <ul>
        <li><strong>API Gateway:</strong> HTTP endpoint management, request routing, throttling, and API keys</li>
        <li><strong>Compute Layer:</strong> Lambda, Azure Functions, or Cloud Functions to handle business logic</li>
        <li><strong>Database:</strong> DynamoDB, Cosmos DB, or Firestore for NoSQL, or Aurora Serverless for SQL</li>
        <li><strong>Authentication:</strong> Cognito, Auth0, or Firebase Auth for user management</li>
      </ul>

      <h3>Cost Analysis for 1M Requests/Month</h3>
      <p>Typical serverless API costs:</p>
      <ul>
        <li>API Gateway: ~$3.50 (1M requests)</li>
        <li>Lambda: ~$2.00 (assuming 200ms avg execution at 512MB)</li>
        <li>DynamoDB: ~$1.25 (on-demand pricing for typical CRUD operations)</li>
        <li>Authentication: ~$0 (Cognito free tier covers 50K MAU)</li>
        <li><strong>Total: ~$6.75/month</strong></li>
      </ul>

      <h3>Scaling Considerations</h3>
      <p>Serverless scales automatically, but watch for:</p>
      <ul>
        <li><strong>Cold starts:</strong> First request after idle period takes longer (500ms-3s)</li>
        <li><strong>Concurrent limits:</strong> Lambda has soft limit of 1000 concurrent executions per region</li>
        <li><strong>Database throttling:</strong> DynamoDB can throttle if you exceed provisioned capacity</li>
      </ul>

      <h3>Performance Optimization</h3>
      <code>Client → API Gateway → Lambda → Database</code>
      <p>For better performance, add caching:</p>
      <code>Client → API Gateway (Cache) → Lambda → Database</code>
      <p>API Gateway caching reduces Lambda invocations by 80%+ for read-heavy workloads.</p>
    `,
    solutions: [
      {
        id: 'sol-2-1',
        author: 'ServerlessGuru',
        title: 'AWS Lambda + API Gateway + DynamoDB',
        architecture: {
          nodes: [
            {
              id: 'sol3-apigw',
              type: 'serviceNode',
              position: { x: 50, y: 150 },
              data: {
                serviceName: 'API Gateway',
                customLabel: 'REST API',
                category: 'networking',
                cost: 3.50,
                specs: '1M requests',
                inputSpec: 'HTTP requests',
                outputSpec: 'Routed requests'
              }
            },
            {
              id: 'sol3-lambda',
              type: 'serviceNode',
              position: { x: 300, y: 150 },
              data: {
                serviceName: 'Lambda',
                customLabel: 'Business Logic',
                category: 'serverless',
                cost: 2.00,
                specs: '512MB, 200ms avg',
                inputSpec: 'API events',
                outputSpec: 'Responses'
              }
            },
            {
              id: 'sol3-dynamodb',
              type: 'serviceNode',
              position: { x: 550, y: 150 },
              data: {
                serviceName: 'DynamoDB',
                customLabel: 'Data Store',
                category: 'database',
                cost: 1.25,
                specs: 'On-demand',
                inputSpec: 'Queries',
                outputSpec: 'Data'
              }
            }
          ],
          edges: [
            {
              id: 'sol3-e1',
              source: 'sol3-apigw',
              target: 'sol3-lambda',
              animated: true
            },
            {
              id: 'sol3-e2',
              source: 'sol3-lambda',
              target: 'sol3-dynamodb',
              animated: true
            }
          ]
        },
        explanation: `
          <p>The classic AWS serverless stack: API Gateway routes requests to Lambda functions that interact with DynamoDB.</p>
          <h3>Why This Architecture Works</h3>
          <ul>
            <li><strong>Zero Server Management:</strong> AWS manages all infrastructure</li>
            <li><strong>Auto-scaling:</strong> Handles traffic spikes automatically</li>
            <li><strong>Cost-Efficient:</strong> Only $6.75/month for 1M requests - far under budget</li>
            <li><strong>High Availability:</strong> Built-in redundancy across multiple AZs</li>
          </ul>
          <h3>Implementation Tips</h3>
          <ul>
            <li>Use Lambda Proxy Integration for simplified request/response handling</li>
            <li>Enable API Gateway caching ($0.02/hour) for read-heavy endpoints</li>
            <li>Use DynamoDB's on-demand mode for unpredictable traffic</li>
          </ul>
        `,
        totalCost: 6.75,
        upvotes: 428,
        provider: 'AWS'
      }
    ]
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
      optionalServices: ["cache"],
      minServices: 4,
      maxServices: 10
    },
    category: "Full-Stack",
    acceptanceRate: 71.5,
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
      optionalServices: [],
      minServices: 4,
      maxServices: 8
    },
    category: "Full-Stack",
    acceptanceRate: 45.2,
    submissions: 89
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
      optionalServices: [],
      minServices: 6,
      maxServices: 15
    },
    category: "Full-Stack",
    acceptanceRate: 58.9,
    submissions: 134
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
      optionalServices: ["compute", "storage", "networking"],
      minServices: 3,
      maxServices: 6
    },
    category: "Serverless",
    acceptanceRate: 38.7,
    submissions: 67
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
      optionalServices: ["serverless", "compute", "cache"],
      minServices: 1,
      maxServices: 4
    },
    category: "Database",
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
          animated: true
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
      optionalServices: ["serverless"],
      minServices: 1,
      maxServices: 3
    },
    category: "Serverless",
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
          animated: true
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
      optionalServices: ["storage", "compute"],
      minServices: 2,
      maxServices: 6
    },
    category: "Full-Stack",
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
          animated: true
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
      optionalServices: ["serverless", "messaging", "compute"],
      minServices: 1,
      maxServices: 4
    },
    category: "Compute",
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
          animated: true
        }
      ]
    }
  }
];

export interface LeaderboardEntry {
  rank: number;
  username: string;
  totalScore: number;
  solvedCount: number;
}

export interface CostLeaderboardEntry {
  rank: number;
  username: string;
  challenge: string;
  cost: number;
  score: number;
}

export const mockLeaderboard: LeaderboardEntry[] = [
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

export const mockCostLeaderboard: CostLeaderboardEntry[] = [
  { rank: 1, username: "frugal_architect", challenge: "Simple Static Website Hosting", cost: 5.23, score: 950 },
  { rank: 2, username: "cost_optimizer", challenge: "Serverless REST API", cost: 3.15, score: 920 },
  { rank: 3, username: "penny_pincher", challenge: "Simple Static Website Hosting", cost: 6.78, score: 890 },
  { rank: 4, username: "efficient_builder", challenge: "High-Traffic Web Application", cost: 87.50, score: 850 },
  { rank: 5, username: "smart_designer", challenge: "Serverless REST API", cost: 4.92, score: 820 }
];

export interface MockUser {
  id: string;
  username: string;
  email: string;
  completedChallenges?: string[];
  score?: number;
}

export interface MockSubmission {
  id: string;
  challengeId: string;
  userId: string;
  totalCost: number;
  score: number;
  timestamp: string;
}

// Mock users stored in localStorage
export const getMockUser = (): MockUser | null => {
  const user = localStorage.getItem('mockUser');
  return user ? JSON.parse(user) : null;
};

export const setMockUser = (user: MockUser): void => {
  localStorage.setItem('mockUser', JSON.stringify(user));
};

export const removeMockUser = (): void => {
  localStorage.removeItem('mockUser');
};

// Mock submissions stored in localStorage
export const getMockSubmissions = (): MockSubmission[] => {
  const submissions = localStorage.getItem('mockSubmissions');
  return submissions ? JSON.parse(submissions) : [];
};

export const addMockSubmission = (submission: MockSubmission): void => {
  const submissions = getMockSubmissions();
  submissions.push(submission);
  localStorage.setItem('mockSubmissions', JSON.stringify(submissions));
};
