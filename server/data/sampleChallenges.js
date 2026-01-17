// Sample challenges for the platform
const sampleChallenges = [
  {
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
    ],
    testCases: [
      {
        input: "10GB storage, 100GB bandwidth/month",
        expectedOutput: "Architecture with storage and CDN",
        description: "Should handle typical small website traffic"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 's3', type: 's3-standard', data: { label: 'S3 Static Hosting' } },
          { id: 'cloudfront', type: 'cloudfront', data: { label: 'CloudFront CDN' } }
        ],
        edges: [
          { source: 's3', target: 'cloudfront' }
        ]
      },
      cost: 8.73,
      complexity: 2,
      explanation: "S3 for storage ($0.23) + CloudFront for CDN ($8.50) = optimal for global static hosting"
    }
  },
  {
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
    ],
    testCases: [
      {
        input: "1 million API requests/month with data storage",
        expectedOutput: "Serverless architecture with database",
        description: "Should scale from zero to millions of requests"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'apigw', type: 'api-gateway', data: { label: 'API Gateway' } },
          { id: 'lambda', type: 'lambda', data: { label: 'Lambda Functions' } },
          { id: 'dynamodb', type: 'dynamodb', data: { label: 'DynamoDB' } }
        ],
        edges: [
          { source: 'apigw', target: 'lambda' },
          { source: 'lambda', target: 'dynamodb' }
        ]
      },
      cost: 3.95,
      complexity: 3,
      explanation: "API Gateway ($3.50) + Lambda ($0.20) + DynamoDB ($0.25) = cost-effective serverless solution"
    }
  },
  {
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
    editorial: `
      <h2>High-Traffic Architecture Patterns</h2>
      <p>Building for high traffic requires thinking about redundancy, caching, and horizontal scaling from day one.</p>

      <h3>Core Components</h3>
      <ul>
        <li><strong>Load Balancer:</strong> Distributes traffic across multiple servers, provides health checks</li>
        <li><strong>Auto-Scaling Compute:</strong> Multiple EC2 instances that scale based on CPU/memory usage</li>
        <li><strong>Cache Layer:</strong> Redis/Memcached to cache database queries and session data</li>
        <li><strong>Managed Database:</strong> RDS with Multi-AZ for high availability</li>
      </ul>

      <h3>Scaling Strategy</h3>
      <p>The architecture should handle 10,000+ requests/minute through:</p>
      <ul>
        <li>Horizontal scaling: Add more EC2 instances as traffic increases</li>
        <li>Caching: Reduce database load by 80%+ with ElastiCache</li>
        <li>Read replicas: Offload read queries to database replicas</li>
      </ul>
    `,
    solutions: [
      {
        id: 'sol-3-1',
        author: 'WebScaleArchitect',
        title: 'Classic 3-Tier Architecture with ELB',
        architecture: {
          nodes: [
            {
              id: 'sol4-elb',
              type: 'serviceNode',
              position: { x: 300, y: 50 },
              data: {
                serviceName: 'ELB',
                customLabel: 'Application Load Balancer',
                category: 'networking',
                cost: 22.50,
                specs: '10K req/min',
                inputSpec: 'User traffic',
                outputSpec: 'Balanced requests'
              }
            },
            {
              id: 'sol4-ec2-1',
              type: 'serviceNode',
              position: { x: 150, y: 200 },
              data: {
                serviceName: 'EC2 t3.medium',
                customLabel: 'Web Server 1',
                category: 'compute',
                cost: 30.37,
                specs: '2 vCPU, 4GB',
                inputSpec: 'HTTP requests',
                outputSpec: 'Responses'
              }
            },
            {
              id: 'sol4-ec2-2',
              type: 'serviceNode',
              position: { x: 450, y: 200 },
              data: {
                serviceName: 'EC2 t3.medium',
                customLabel: 'Web Server 2',
                category: 'compute',
                cost: 30.37,
                specs: '2 vCPU, 4GB',
                inputSpec: 'HTTP requests',
                outputSpec: 'Responses'
              }
            },
            {
              id: 'sol4-cache',
              type: 'serviceNode',
              position: { x: 300, y: 350 },
              data: {
                serviceName: 'ElastiCache Redis',
                customLabel: 'Session & Query Cache',
                category: 'cache',
                cost: 24.48,
                specs: 'cache.t3.micro',
                inputSpec: 'Cache queries',
                outputSpec: 'Cached data'
              }
            },
            {
              id: 'sol4-rds',
              type: 'serviceNode',
              position: { x: 300, y: 500 },
              data: {
                serviceName: 'RDS MySQL',
                customLabel: 'Primary Database',
                category: 'database',
                cost: 29.93,
                specs: 'db.t3.small',
                inputSpec: 'SQL queries',
                outputSpec: 'Data'
              }
            }
          ],
          edges: [
            { id: 'sol4-e1', source: 'sol4-elb', target: 'sol4-ec2-1', animated: true },
            { id: 'sol4-e2', source: 'sol4-elb', target: 'sol4-ec2-2', animated: true },
            { id: 'sol4-e3', source: 'sol4-ec2-1', target: 'sol4-cache', animated: true },
            { id: 'sol4-e4', source: 'sol4-ec2-2', target: 'sol4-cache', animated: true },
            { id: 'sol4-e5', source: 'sol4-ec2-1', target: 'sol4-rds', animated: true },
            { id: 'sol4-e6', source: 'sol4-ec2-2', target: 'sol4-rds', animated: true }
          ]
        },
        explanation: `
          <p>A robust 3-tier architecture that provides fault tolerance and caching for high-traffic applications.</p>
          <h3>Architecture Breakdown</h3>
          <ul>
            <li><strong>Load Balancing:</strong> ELB distributes traffic across multiple EC2 instances with health checks</li>
            <li><strong>Redundant Compute:</strong> 2x EC2 t3.medium instances handle requests - if one fails, traffic routes to the other</li>
            <li><strong>ElastiCache Layer:</strong> Redis caches database queries and stores session data for fast access</li>
            <li><strong>RDS Multi-AZ:</strong> Managed MySQL database with automatic backups and failover</li>
          </ul>
          <h3>Performance Characteristics</h3>
          <ul>
            <li>Handles 10,000+ requests/minute with room to scale</li>
            <li>Cache hit rate of 80% reduces database load significantly</li>
            <li>99.9%+ uptime with Multi-AZ and redundant servers</li>
            <li>Average response time under 100ms for cached requests</li>
          </ul>
          <p><strong>Total Cost:</strong> $137.65/month - well under the $200 budget</p>
        `,
        totalCost: 137.65,
        upvotes: 289,
        provider: 'AWS'
      }
    ],
    testCases: [
      {
        input: "10,000 requests/minute, 50GB database",
        expectedOutput: "Load-balanced architecture with caching",
        description: "Should handle high traffic with low latency"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'elb', type: 'elb', data: { label: 'Load Balancer' } },
          { id: 'ec2-1', type: 'ec2-t2-small', data: { label: 'Web Server 1' } },
          { id: 'ec2-2', type: 'ec2-t2-small', data: { label: 'Web Server 2' } },
          { id: 'cache', type: 'elasticache-redis', data: { label: 'Redis Cache' } },
          { id: 'rds', type: 'rds-mysql-small', data: { label: 'RDS MySQL' } }
        ],
        edges: [
          { source: 'elb', target: 'ec2-1' },
          { source: 'elb', target: 'ec2-2' },
          { source: 'ec2-1', target: 'cache' },
          { source: 'ec2-2', target: 'cache' },
          { source: 'ec2-1', target: 'rds' },
          { source: 'ec2-2', target: 'rds' }
        ]
      },
      cost: 134,
      complexity: 5,
      explanation: "ELB + 2x EC2 + ElastiCache + RDS provides fault-tolerance and caching"
    }
  },
  {
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
    editorial: "",
    solutions: [],
    testCases: [
      {
        input: "100 events/second from IoT devices",
        expectedOutput: "Streaming pipeline with processing and storage",
        description: "Should process and store data reliably"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'sqs', type: 'sqs', data: { label: 'SQS Queue' } },
          { id: 'lambda-process', type: 'lambda', data: { label: 'Processing Function' } },
          { id: 's3-raw', type: 's3-standard', data: { label: 'Raw Data Lake' } },
          { id: 'dynamodb', type: 'dynamodb', data: { label: 'Processed Data DB' } },
          { id: 's3-archive', type: 's3-infrequent', data: { label: 'Archive Storage' } }
        ],
        edges: [
          { source: 'sqs', target: 'lambda-process' },
          { source: 'lambda-process', target: 's3-raw' },
          { source: 'lambda-process', target: 'dynamodb' },
          { source: 's3-raw', target: 's3-archive' }
        ]
      },
      cost: 89.5,
      complexity: 5,
      explanation: "SQS for ingestion, Lambda for processing, S3 for raw data, DynamoDB for queryable processed data"
    }
  },
  {
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
    editorial: "",
    solutions: [],
    testCases: [
      {
        input: "Primary region failure scenario",
        expectedOutput: "Architecture with multi-region failover",
        description: "Should automatically failover to secondary region"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'route53', type: 'api-gateway', data: { label: 'Route53 DNS' } },
          { id: 'elb-primary', type: 'elb', data: { label: 'Primary LB' } },
          { id: 'ec2-primary', type: 'ec2-t2-medium', data: { label: 'Primary Compute' } },
          { id: 'rds-primary', type: 'aurora-serverless', data: { label: 'Primary DB' } },
          { id: 'elb-secondary', type: 'elb', data: { label: 'Secondary LB' } },
          { id: 'ec2-secondary', type: 'ec2-t2-medium', data: { label: 'Secondary Compute' } },
          { id: 'rds-secondary', type: 'aurora-serverless', data: { label: 'Secondary DB (Replica)' } },
          { id: 's3-backup', type: 's3-standard', data: { label: 'Backup Storage' } }
        ],
        edges: [
          { source: 'route53', target: 'elb-primary' },
          { source: 'route53', target: 'elb-secondary' },
          { source: 'elb-primary', target: 'ec2-primary' },
          { source: 'ec2-primary', target: 'rds-primary' },
          { source: 'rds-primary', target: 'rds-secondary' },
          { source: 'elb-secondary', target: 'ec2-secondary' },
          { source: 'ec2-secondary', target: 'rds-secondary' },
          { source: 'rds-primary', target: 's3-backup' }
        ]
      },
      cost: 376.8,
      complexity: 8,
      explanation: "Multi-region setup with Route53 failover, Aurora global database replication"
    }
  },
  {
    title: "AI Chatbot Deployment",
    difficulty: "Medium",
    description: "Deploy a scalable AI chatbot using serverless architecture and GPU compute. Choose the right LLM model based on cost, performance, and latency requirements. The solution should handle conversational AI workloads efficiently.",
    requirements: [
      "Deploy an LLM for chatbot functionality",
      "Use serverless architecture for auto-scaling",
      "Store conversation history in a database",
      "Support 40-50 concurrent users",
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
    editorial: "",
    solutions: [],
    testCases: [
      {
        input: "100 concurrent users, 1000 requests/hour",
        expectedOutput: "AI-powered chatbot with serverless scaling",
        description: "Should handle chatbot requests efficiently"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'lambda', type: 'lambda', data: { label: 'API Handler' } },
          { id: 'llama', type: 'llama-2-7b', data: { label: 'Llama 2 7B' } },
          { id: 'dynamodb', type: 'dynamodb', data: { label: 'Conversation Store' } }
        ],
        edges: [
          { source: 'lambda', target: 'llama' },
          { source: 'lambda', target: 'dynamodb' }
        ]
      },
      cost: 65.2,
      complexity: 3,
      explanation: "Lambda for request handling + Llama 2 7B for inference + DynamoDB for conversation history"
    }
  },
  {
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
      maxCost: 120,
      requiredServices: ["database"],
      optionalServices: ["serverless", "compute", "cache"],
      minServices: 1,
      maxServices: 4
    },
    category: "Database",
    existingInfrastructure: {
      nodes: [
        {
          id: 'existing-dynamodb',
          type: 'serviceNode',
          position: { x: 100, y: 150 },
          data: {
            serviceName: 'DynamoDB',
            customLabel: 'Product Database',
            category: 'database',
            cost: 25.00,
            specs: 'On-demand pricing',
            inputSpec: 'Product data',
            outputSpec: 'Query results',
            isExisting: true
          }
        },
        {
          id: 'existing-s3',
          type: 'serviceNode',
          position: { x: 400, y: 150 },
          data: {
            serviceName: 'S3',
            customLabel: 'Product Images',
            category: 'storage',
            cost: 10.00,
            specs: '100GB storage',
            inputSpec: 'Images',
            outputSpec: 'Image URLs',
            isExisting: true
          }
        }
      ],
      edges: []
    },
    editorial: "",
    solutions: [],
    testCases: [
      {
        input: "Product search queries from existing e-commerce platform",
        expectedOutput: "Search service integrated with existing infrastructure",
        description: "Should enable fast product search"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'opensearch', type: 'firestore', data: { label: 'OpenSearch' } },
          { id: 'lambda-index', type: 'lambda', data: { label: 'Indexing Lambda' } }
        ],
        edges: [
          { source: 'lambda-index', target: 'opensearch' }
        ]
      },
      cost: 45.0,
      complexity: 2,
      explanation: "OpenSearch for full-text search + Lambda to sync DynamoDB changes"
    }
  },
  {
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
            customLabel: 'API Functions',
            category: 'serverless',
            cost: 5.00,
            specs: '1M requests/month',
            inputSpec: 'API requests',
            outputSpec: 'API responses',
            isExisting: true
          }
        },
        {
          id: 'existing-rds',
          type: 'serviceNode',
          position: { x: 400, y: 150 },
          data: {
            serviceName: 'RDS PostgreSQL',
            customLabel: 'API Database',
            category: 'database',
            cost: 30.00,
            specs: 'db.t3.small',
            inputSpec: 'SQL queries',
            outputSpec: 'Data',
            isExisting: true
          }
        }
      ],
      edges: [
        {
          id: 'existing-edge-1',
          source: 'existing-lambda',
          target: 'existing-rds'
        }
      ]
    },
    editorial: "",
    solutions: [],
    testCases: [
      {
        input: "API with slow database queries",
        expectedOutput: "Caching layer to improve performance",
        description: "Should reduce response time significantly"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'elasticache', type: 'elasticache-redis', data: { label: 'Redis Cache' } }
        ],
        edges: []
      },
      cost: 24.8,
      complexity: 1,
      explanation: "ElastiCache Redis to cache database query results"
    }
  },
  {
    title: "Extend Video Platform with Analytics",
    difficulty: "Hard",
    description: "Your video streaming platform uses S3 for video storage and CloudFront for CDN. Marketing wants analytics on video views, watch time, user behavior, and popular content. Build a real-time analytics pipeline that integrates with the existing infrastructure.",
    requirements: [
      "Don't modify existing S3 and CloudFront setup",
      "Track video views, watch time, and user engagement in real-time",
      "Store analytics data for reporting and dashboards",
      "Process 10,000+ events per minute",
      "Store analytics data with query capabilities",
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
          position: { x: 100, y: 150 },
          data: {
            serviceName: 'S3',
            customLabel: 'Video Storage',
            category: 'storage',
            cost: 50.00,
            specs: '2TB storage',
            inputSpec: 'Video files',
            outputSpec: 'Video streams',
            isExisting: true
          }
        },
        {
          id: 'existing-cloudfront',
          type: 'serviceNode',
          position: { x: 400, y: 150 },
          data: {
            serviceName: 'CloudFront',
            customLabel: 'Video CDN',
            category: 'networking',
            cost: 85.00,
            specs: '1TB transfer/month',
            inputSpec: 'Video requests',
            outputSpec: 'Streamed content',
            isExisting: true
          }
        }
      ],
      edges: [
        {
          id: 'existing-edge-1',
          source: 'existing-s3-videos',
          target: 'existing-cloudfront'
        }
      ]
    },
    editorial: "",
    solutions: [],
    testCases: [
      {
        input: "Video view events from streaming platform",
        expectedOutput: "Real-time analytics pipeline",
        description: "Should process and store analytics data"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'sqs', type: 'sqs', data: { label: 'Event Queue' } },
          { id: 'lambda-process', type: 'lambda', data: { label: 'Analytics Processor' } },
          { id: 'dynamodb', type: 'dynamodb', data: { label: 'Analytics DB' } },
          { id: 's3-analytics', type: 's3-standard', data: { label: 'Analytics Archive' } }
        ],
        edges: [
          { source: 'sqs', target: 'lambda-process' },
          { source: 'lambda-process', target: 'dynamodb' },
          { source: 'lambda-process', target: 's3-analytics' }
        ]
      },
      cost: 95.5,
      complexity: 4,
      explanation: "SQS for event ingestion + Lambda for processing + DynamoDB for queryable data + S3 for archive"
    }
  },
  {
    title: "Add AI Image Recognition to Photo App",
    difficulty: "Medium",
    description: "Your photo sharing app stores user photos in S3 and metadata in DynamoDB. Users want automatic tagging and object detection in their photos. Add AI-powered image recognition that processes images when uploaded.",
    requirements: [
      "Integrate with existing S3 photo storage and DynamoDB",
      "Automatically detect objects, faces, and scenes in uploaded photos",
      "Tag photos with detected labels",
      "Update DynamoDB with tags without manual intervention",
      "Process images within 10 seconds of upload",
      "Handle 100+ photo uploads per hour"
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
            cost: 20.00,
            specs: '200GB storage',
            inputSpec: 'Photo uploads',
            outputSpec: 'Photo URLs',
            isExisting: true
          }
        },
        {
          id: 'existing-dynamodb-photos',
          type: 'serviceNode',
          position: { x: 400, y: 150 },
          data: {
            serviceName: 'DynamoDB',
            customLabel: 'Photo Metadata',
            category: 'database',
            cost: 15.00,
            specs: 'On-demand pricing',
            inputSpec: 'Metadata writes',
            outputSpec: 'Metadata queries',
            isExisting: true
          }
        }
      ],
      edges: []
    },
    editorial: "",
    solutions: [],
    testCases: [
      {
        input: "Photo uploads requiring automatic tagging",
        expectedOutput: "AI image recognition integrated with existing storage",
        description: "Should automatically tag uploaded photos"
      }
    ],
    optimalSolution: {
      architecture: {
        nodes: [
          { id: 'rekognition', type: 'rekognition', data: { label: 'Rekognition' } },
          { id: 'lambda-tag', type: 'lambda', data: { label: 'Tagging Function' } }
        ],
        edges: [
          { source: 'lambda-tag', target: 'rekognition' }
        ]
      },
      cost: 52.2,
      complexity: 2,
      explanation: "AWS Rekognition for image analysis + Lambda to process uploads and update DynamoDB"
    }
  },
  // Adobe AI Platform Architecture Challenge
  {
    title: "Adobe AI Platform Architecture",
    difficulty: "Hard",
    category: "Full-Stack",
    description: "Adobe plans to launch a new AI-integrated platform that brings generative AI (image, video, and design assistance) directly into Creative Cloud applications such as Photoshop, Illustrator, and Premiere Pro. The platform must support interactive AI generation, enterprise-grade security, and global availability, while maintaining predictable costs and high reliability. Your task: Design the cloud architecture for this new AI platform.",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Adobe_Corporate_logo.svg/200px-Adobe_Corporate_logo.svg.png",
    companyName: "Adobe",
    requirements: [
      "Support real-time AI generation (e.g., image fill, text-to-design) with p95 latency < 5 seconds",
      "Support asynchronous AI jobs (e.g., video generation, batch rendering) with reliable queue processing",
      "Integrate with Adobe user identity and licensing system",
      "Enforce AI credit/quota usage per user or organization",
      "Store generated assets with versioning and provenance tracking",
      "Platform must be highly available with no single point of failure",
      "Support graceful degradation under GPU shortages with automatic recovery",
      "Implement strict tenant isolation (no cross-user or cross-org data leakage)",
      "Provide permission-aware access to prompts and generated assets",
      "Enable full audit logging for AI usage and asset creation",
      "Enforce content moderation on all generated content",
      "System must support global users with multi-region capability",
      "Allow future expansion to additional AI models and tools"
    ],
    constraints: {
      maxCost: 250000,
      requiredServices: ["compute", "database", "storage", "networking", "messaging", "ai"],
      optionalServices: ["cache", "serverless"],
      minServices: 8,
      maxServices: 20
    },
    editorial: `
      <h2>Adobe AI Platform: Enterprise-Scale Architecture</h2>

      <p>This challenge requires designing a production-grade AI platform with three distinct planes:</p>

      <h3>Architecture Planes</h3>
      <ul>
        <li><strong>Control Plane:</strong> Identity, credits, policies, quota management</li>
        <li><strong>Data Plane:</strong> Assets, prompts, outputs, versioning</li>
        <li><strong>Inference Plane:</strong> AI compute, model serving, GPU orchestration</li>
      </ul>

      <h3>Key Design Considerations</h3>

      <h4>1. Hybrid AI Strategy</h4>
      <p>Real-time requests need low latency, asynchronous jobs can tolerate longer processing times. Consider:</p>
      <ul>
        <li>Managed AI services (AWS Bedrock, Azure OpenAI) for interactive requests</li>
        <li>Self-hosted GPUs (RunPod, custom clusters) for batch/video processing</li>
        <li>Queue-based job distribution with priority levels</li>
      </ul>

      <h4>2. Multi-Region Strategy</h4>
      <p>Global users require low-latency access:</p>
      <ul>
        <li>CDN for static assets and generated content</li>
        <li>Regional API gateways with intelligent routing</li>
        <li>Cross-region asset replication for disaster recovery</li>
      </ul>

      <h4>3. Cost Optimization</h4>
      <p>With a $250K/month budget for enterprise scale:</p>
      <ul>
        <li>GPU auto-scaling based on queue depth</li>
        <li>Intelligent model caching to reduce cold starts</li>
        <li>Tiered storage (hot S3 for recent, Glacier for archives)</li>
        <li>Reserved instances for baseline load</li>
      </ul>

      <h4>4. Security Architecture</h4>
      <ul>
        <li>Zero-trust network with service mesh</li>
        <li>Encryption at rest (KMS) and in transit (TLS)</li>
        <li>Per-tenant database isolation or row-level security</li>
        <li>Comprehensive audit trail in centralized logging</li>
      </ul>

      <p><strong>Video Solution:</strong> <a href="https://youtu.be/U1Mu8Eov2Ko?si=lPKhNFl1rQpZFsaq" target="_blank">Watch detailed architecture walkthrough</a></p>
    `,
    solutions: [
      {
        id: 'sol-adobe-1',
        author: 'CloudArchitect_Pro',
        title: 'Enterprise Multi-Region AI Platform',
        videoUrl: 'https://youtu.be/U1Mu8Eov2Ko?si=lPKhNFl1rQpZFsaq',
        architecture: {
          nodes: [
            // Control Plane
            {
              id: 'adobe-api-gateway',
              type: 'serviceNode',
              position: { x: 100, y: 50 },
              data: {
                serviceName: 'API Gateway',
                customLabel: 'Global API Gateway',
                category: 'networking',
                cost: 250,
                specs: 'Multi-region, 1M requests/day',
                inputSpec: 'Client requests',
                outputSpec: 'Routed to services'
              }
            },
            {
              id: 'adobe-auth',
              type: 'serviceNode',
              position: { x: 100, y: 200 },
              data: {
                serviceName: 'Lambda',
                customLabel: 'Auth & Identity Service',
                category: 'serverless',
                cost: 450,
                specs: '10K invocations/day',
                inputSpec: 'Auth tokens',
                outputSpec: 'Validated identity'
              }
            },
            {
              id: 'adobe-quota',
              type: 'serviceNode',
              position: { x: 300, y: 200 },
              data: {
                serviceName: 'DynamoDB',
                customLabel: 'Credits & Quota DB',
                category: 'database',
                cost: 850,
                specs: 'Global tables, multi-region',
                inputSpec: 'Usage tracking',
                outputSpec: 'Quota enforcement'
              }
            },
            // Data Plane
            {
              id: 'adobe-metadata-db',
              type: 'serviceNode',
              position: { x: 500, y: 200 },
              data: {
                serviceName: 'RDS MySQL',
                customLabel: 'Asset Metadata DB',
                category: 'database',
                cost: 1200,
                specs: 'db.r5.2xlarge, Multi-AZ',
                inputSpec: 'Asset metadata',
                outputSpec: 'Queryable metadata'
              }
            },
            {
              id: 'adobe-s3-assets',
              type: 'serviceNode',
              position: { x: 700, y: 200 },
              data: {
                serviceName: 'S3 Standard',
                customLabel: 'Generated Assets Storage',
                category: 'storage',
                cost: 15000,
                specs: '500TB, versioning enabled',
                inputSpec: 'Generated images/videos',
                outputSpec: 'Versioned assets'
              }
            },
            {
              id: 'adobe-cdn',
              type: 'serviceNode',
              position: { x: 700, y: 50 },
              data: {
                serviceName: 'CloudFront CDN',
                customLabel: 'Global Asset CDN',
                category: 'networking',
                cost: 8500,
                specs: '100TB egress/month',
                inputSpec: 'Asset requests',
                outputSpec: 'Cached assets'
              }
            },
            // Inference Plane - Real-time
            {
              id: 'adobe-sqs-realtime',
              type: 'serviceNode',
              position: { x: 300, y: 350 },
              data: {
                serviceName: 'SQS Queue',
                customLabel: 'Real-time AI Queue',
                category: 'messaging',
                cost: 150,
                specs: 'FIFO, high throughput',
                inputSpec: 'Interactive AI requests',
                outputSpec: 'Queued requests'
              }
            },
            {
              id: 'adobe-bedrock',
              type: 'serviceNode',
              position: { x: 300, y: 500 },
              data: {
                serviceName: 'Amazon Bedrock',
                customLabel: 'Managed AI Models',
                category: 'ai',
                cost: 45000,
                specs: 'Stable Diffusion, Claude',
                inputSpec: 'AI prompts',
                outputSpec: 'Generated content'
              }
            },
            // Inference Plane - Async
            {
              id: 'adobe-sqs-async',
              type: 'serviceNode',
              position: { x: 500, y: 350 },
              data: {
                serviceName: 'SQS Queue',
                customLabel: 'Async Job Queue',
                category: 'messaging',
                cost: 200,
                specs: 'Standard, long polling',
                inputSpec: 'Video/batch jobs',
                outputSpec: 'Queued jobs'
              }
            },
            {
              id: 'adobe-runpod-a100',
              type: 'serviceNode',
              position: { x: 500, y: 500 },
              data: {
                serviceName: 'A100 80GB',
                customLabel: 'Video Gen GPU Cluster',
                category: 'compute',
                cost: 156000,
                specs: '8x A100 80GB, auto-scaling',
                inputSpec: 'Heavy AI workloads',
                outputSpec: 'Generated videos'
              }
            },
            // Caching & Performance
            {
              id: 'adobe-elasticache',
              type: 'serviceNode',
              position: { x: 100, y: 350 },
              data: {
                serviceName: 'ElastiCache Redis',
                customLabel: 'Model Cache & Sessions',
                category: 'cache',
                cost: 1800,
                specs: 'cache.r5.4xlarge cluster',
                inputSpec: 'Cache queries',
                outputSpec: 'Cached results'
              }
            },
            // Monitoring & Logging
            {
              id: 'adobe-cloudwatch',
              type: 'serviceNode',
              position: { x: 900, y: 350 },
              data: {
                serviceName: 'CloudWatch',
                customLabel: 'Audit & Monitoring',
                category: 'serverless',
                cost: 650,
                specs: 'Logs, metrics, alarms',
                inputSpec: 'All service logs',
                outputSpec: 'Audit trail'
              }
            },
            // Content Moderation
            {
              id: 'adobe-rekognition',
              type: 'serviceNode',
              position: { x: 700, y: 350 },
              data: {
                serviceName: 'Rekognition',
                customLabel: 'Content Moderation',
                category: 'ai',
                cost: 2500,
                specs: 'Image/video moderation',
                inputSpec: 'Generated content',
                outputSpec: 'Moderation flags'
              }
            }
          ],
          edges: [
            // Control Plane Flow
            { id: 'e1', source: 'adobe-api-gateway', target: 'adobe-auth', animated: true },
            { id: 'e2', source: 'adobe-auth', target: 'adobe-quota', animated: true },
            { id: 'e3', source: 'adobe-auth', target: 'adobe-elasticache', animated: true },
            // Real-time Inference Flow
            { id: 'e4', source: 'adobe-api-gateway', target: 'adobe-sqs-realtime', animated: true },
            { id: 'e5', source: 'adobe-sqs-realtime', target: 'adobe-bedrock', animated: true },
            { id: 'e6', source: 'adobe-bedrock', target: 'adobe-s3-assets', animated: true },
            // Async Inference Flow
            { id: 'e7', source: 'adobe-api-gateway', target: 'adobe-sqs-async', animated: true },
            { id: 'e8', source: 'adobe-sqs-async', target: 'adobe-runpod-a100', animated: true },
            { id: 'e9', source: 'adobe-runpod-a100', target: 'adobe-s3-assets', animated: true },
            // Data Plane
            { id: 'e10', source: 'adobe-s3-assets', target: 'adobe-metadata-db', animated: true },
            { id: 'e11', source: 'adobe-s3-assets', target: 'adobe-cdn', animated: true },
            { id: 'e12', source: 'adobe-s3-assets', target: 'adobe-rekognition', animated: true },
            // Logging & Monitoring
            { id: 'e13', source: 'adobe-quota', target: 'adobe-cloudwatch', animated: false },
            { id: 'e14', source: 'adobe-bedrock', target: 'adobe-cloudwatch', animated: false },
            { id: 'e15', source: 'adobe-runpod-a100', target: 'adobe-cloudwatch', animated: false }
          ]
        },
        explanation: `
          <h3>Architecture Overview</h3>
          <p>This enterprise-grade solution implements Adobe's AI platform with three distinct architectural planes, each optimized for specific requirements.</p>

          <h3>Control Plane ($1,550/month)</h3>
          <ul>
            <li><strong>API Gateway:</strong> Multi-region global entry point with intelligent routing</li>
            <li><strong>Lambda Auth Service:</strong> Validates Adobe Creative Cloud identities, enforces licensing</li>
            <li><strong>DynamoDB Global Tables:</strong> Credits/quota tracking with millisecond consistency across regions</li>
            <li><strong>ElastiCache Redis:</strong> Session management and hot model caching</li>
          </ul>

          <h3>Data Plane ($25,350/month)</h3>
          <ul>
            <li><strong>S3 Versioned Storage:</strong> 500TB for generated assets with full provenance tracking</li>
            <li><strong>CloudFront CDN:</strong> Global asset delivery with <50ms latency worldwide</li>
            <li><strong>RDS MySQL Multi-AZ:</strong> Asset metadata, search indexes, user permissions</li>
            <li><strong>Rekognition:</strong> Automated content moderation before public access</li>
          </ul>

          <h3>Inference Plane ($201,350/month)</h3>
          <p><strong>Real-time Path (Interactive AI):</strong></p>
          <ul>
            <li><strong>SQS FIFO Queue:</strong> Priority-based request routing</li>
            <li><strong>Amazon Bedrock:</strong> Managed Stable Diffusion, Claude for <5s latency</li>
            <li>Handles image fill, text-to-design, quick generations</li>
          </ul>

          <p><strong>Async Path (Heavy Workloads):</strong></p>
          <ul>
            <li><strong>SQS Standard Queue:</strong> Long-polling job distribution</li>
            <li><strong>RunPod A100 80GB Cluster:</strong> 8 GPUs with auto-scaling 2-16 units</li>
            <li>Handles video generation, batch rendering, custom model training</li>
          </ul>

          <h3>Key Features</h3>

          <h4>High Availability</h4>
          <ul>
            <li>Multi-AZ deployment for all critical services</li>
            <li>Auto-scaling GPU cluster (2-16 A100s based on queue depth)</li>
            <li>Graceful degradation: Async jobs queue when GPUs saturated</li>
            <li>CloudWatch alarms trigger automatic recovery</li>
          </ul>

          <h4>Security & Compliance</h4>
          <ul>
            <li>Zero-trust architecture: All services authenticate via IAM roles</li>
            <li>Tenant isolation: DynamoDB partition keys ensure no data leakage</li>
            <li>Audit logging: Every AI request logged to CloudWatch with user ID, prompt, output</li>
            <li>Encryption: KMS for S3, TLS 1.3 for all transit</li>
          </ul>

          <h4>Cost Optimization</h4>
          <ul>
            <li><strong>GPU Auto-scaling:</strong> Scale down to 2 A100s during low usage (saves $100K+/month)</li>
            <li><strong>S3 Intelligent Tiering:</strong> Moves cold assets to Glacier (estimated 30% storage savings)</li>
            <li><strong>Reserved Instances:</strong> 1-year commitment for baseline RDS/cache reduces costs 40%</li>
            <li><strong>Bedrock Pay-per-token:</strong> Only pay for actual AI usage, no idle compute</li>
          </ul>

          <h3>Performance Characteristics</h3>
          <ul>
            <li><strong>Interactive AI:</strong> p95 latency 3.2s (target: <5s) ✅</li>
            <li><strong>Async Processing:</strong> 50 concurrent video jobs, 2-10min per video</li>
            <li><strong>Global CDN:</strong> 95% cache hit rate, <50ms asset delivery worldwide</li>
            <li><strong>Throughput:</strong> 10K interactive requests/hour, 500 async jobs/hour</li>
          </ul>

          <h3>Scalability Path</h3>
          <ol>
            <li><strong>Phase 1 (Current):</strong> $230K/month, supports 1M users</li>
            <li><strong>Phase 2 (Growth):</strong> Add regional GPU clusters, scale to 10M users ($800K/month)</li>
            <li><strong>Phase 3 (Global):</strong> Multi-region active-active, 50M+ users ($3M/month)</li>
          </ol>

          <p><strong>Total Monthly Cost:</strong> $228,250 (well within $250K budget, with $21.75K buffer for spikes)</p>

          <p><strong>Why This Works:</strong> This architecture balances cost, performance, and reliability by using managed services for baseline capabilities (Bedrock for real-time) while leveraging cost-effective self-hosted GPUs (RunPod) for heavy batch workloads. The three-plane separation ensures clear boundaries and independent scaling.</p>
        `,
        totalCost: 228250,
        upvotes: 487,
        provider: 'AWS'
      }
    ],
    testCases: [
      {
        input: "1 million Creative Cloud users, 10K AI requests/hour, 500 async video jobs/hour",
        expectedOutput: "Multi-region architecture with managed AI for real-time and GPU cluster for async",
        description: "Must handle enterprise scale with <5s interactive latency"
      }
    ],
    optimalSolution: {
      provider: "AWS",
      architecture: {
        nodes: [],
        edges: []
      },
      cost: 228250,
      complexity: 13,
      explanation: "Hybrid AI architecture: Bedrock for real-time (<5s), RunPod A100s for async, multi-region with CDN"
    }
  }
];

module.exports = sampleChallenges;
