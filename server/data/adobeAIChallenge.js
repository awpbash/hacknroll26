// Adobe AI Platform Architecture Challenge
// This challenge will be added to Firestore database

const adobeAIChallenge = {
  title: "Adobe AI Platform Architecture",
  difficulty: "Hard",
  category: "Full-Stack",
  description: `
    <p>Adobe plans to launch a new AI-integrated platform that brings generative AI (image, video, and design assistance) directly into Creative Cloud applications such as Photoshop, Illustrator, and Premiere Pro.</p>

    <p>The platform must support interactive AI generation, enterprise-grade security, and global availability, while maintaining predictable costs and high reliability.</p>

    <p><strong>Your task:</strong> Design the cloud architecture for this new AI platform.</p>
  `,
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
  },
  tags: ["AI", "Enterprise", "Multi-Region", "GPU", "Security", "Adobe"],
  videoSolutionUrl: "https://youtu.be/U1Mu8Eov2Ko?si=lPKhNFl1rQpZFsaq"
};

module.exports = adobeAIChallenge;
