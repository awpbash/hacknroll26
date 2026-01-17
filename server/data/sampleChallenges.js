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
      optionalServices: []
    },
    category: "Storage",
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
      optionalServices: ["networking", "cache"]
    },
    category: "Serverless",
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
      optionalServices: ["cache"]
    },
    category: "Full-Stack",
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
      cost: 65.2,
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
      optionalServices: []
    },
    category: "Full-Stack",
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
      optionalServices: []
    },
    category: "Full-Stack",
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
  }
];

module.exports = sampleChallenges;
