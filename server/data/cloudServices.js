// Cloud service definitions with pricing
const cloudServices = {
  AWS: {
    compute: [
      { id: 'ec2-t2-micro', name: 'EC2 t2.micro', cost: 0.0116, category: 'compute', specs: '1 vCPU, 1GB RAM' },
      { id: 'ec2-t2-small', name: 'EC2 t2.small', cost: 0.023, category: 'compute', specs: '1 vCPU, 2GB RAM' },
      { id: 'ec2-t2-medium', name: 'EC2 t2.medium', cost: 0.0464, category: 'compute', specs: '2 vCPU, 4GB RAM' },
      { id: 'lambda', name: 'Lambda', cost: 0.0000002, category: 'serverless', specs: 'Per request' }
    ],
    storage: [
      { id: 's3-standard', name: 'S3 Standard', cost: 0.023, category: 'storage', specs: 'Per GB/month' },
      { id: 's3-infrequent', name: 'S3 Infrequent Access', cost: 0.0125, category: 'storage', specs: 'Per GB/month' },
      { id: 'ebs-gp3', name: 'EBS gp3', cost: 0.08, category: 'storage', specs: 'Per GB/month' }
    ],
    database: [
      { id: 'rds-mysql-small', name: 'RDS MySQL db.t3.small', cost: 0.034, category: 'database', specs: '2 vCPU, 2GB RAM' },
      { id: 'dynamodb', name: 'DynamoDB', cost: 0.25, category: 'database', specs: 'Per million writes' },
      { id: 'aurora-serverless', name: 'Aurora Serverless', cost: 0.06, category: 'database', specs: 'Per ACU-hour' }
    ],
    networking: [
      { id: 'elb', name: 'Elastic Load Balancer', cost: 0.0225, category: 'networking', specs: 'Per hour' },
      { id: 'cloudfront', name: 'CloudFront CDN', cost: 0.085, category: 'networking', specs: 'Per GB' },
      { id: 'api-gateway', name: 'API Gateway', cost: 0.0000035, category: 'networking', specs: 'Per request' },
      { id: 'vpc', name: 'VPC', cost: 0, category: 'networking', specs: 'Free' }
    ],
    other: [
      { id: 'sqs', name: 'SQS Queue', cost: 0.0000004, category: 'messaging', specs: 'Per request' },
      { id: 'sns', name: 'SNS', cost: 0.0000005, category: 'messaging', specs: 'Per notification' },
      { id: 'elasticache-redis', name: 'ElastiCache Redis', cost: 0.034, category: 'cache', specs: 'cache.t3.small' }
    ],
    ai: [
      { id: 'sagemaker-inference', name: 'SageMaker Inference', cost: 0.05, category: 'ai', specs: 'ml.t3.medium' },
      { id: 'rekognition', name: 'Rekognition', cost: 0.001, category: 'ai', specs: 'Per image' },
      { id: 'comprehend', name: 'Comprehend', cost: 0.0001, category: 'ai', specs: 'Per 100 chars' },
      { id: 'bedrock', name: 'Amazon Bedrock', cost: 0.0008, category: 'ai', specs: 'Per 1K tokens' }
    ]
  },
  Azure: {
    compute: [
      { id: 'vm-b1s', name: 'VM B1S', cost: 0.0104, category: 'compute', specs: '1 vCPU, 1GB RAM' },
      { id: 'vm-b2s', name: 'VM B2S', cost: 0.0416, category: 'compute', specs: '2 vCPU, 4GB RAM' },
      { id: 'functions', name: 'Azure Functions', cost: 0.0000002, category: 'serverless', specs: 'Per execution' }
    ],
    storage: [
      { id: 'blob-hot', name: 'Blob Storage Hot', cost: 0.018, category: 'storage', specs: 'Per GB/month' },
      { id: 'blob-cool', name: 'Blob Storage Cool', cost: 0.01, category: 'storage', specs: 'Per GB/month' }
    ],
    database: [
      { id: 'sql-basic', name: 'SQL Database Basic', cost: 0.0067, category: 'database', specs: '5 DTUs' },
      { id: 'cosmos-db', name: 'Cosmos DB', cost: 0.008, category: 'database', specs: 'Per RU/s hour' }
    ],
    networking: [
      { id: 'load-balancer', name: 'Load Balancer', cost: 0.025, category: 'networking', specs: 'Per hour' },
      { id: 'cdn', name: 'CDN', cost: 0.081, category: 'networking', specs: 'Per GB' },
      { id: 'vnet', name: 'Virtual Network', cost: 0, category: 'networking', specs: 'Free' }
    ],
    ai: [
      { id: 'cognitive-vision', name: 'Computer Vision', cost: 0.001, category: 'ai', specs: 'Per image' },
      { id: 'cognitive-language', name: 'Language Service', cost: 0.0002, category: 'ai', specs: 'Per 1K chars' },
      { id: 'ml-inference', name: 'ML Inference', cost: 0.06, category: 'ai', specs: 'Per hour' },
      { id: 'openai-service', name: 'Azure OpenAI', cost: 0.0006, category: 'ai', specs: 'Per 1K tokens' }
    ]
  },
  GCP: {
    compute: [
      { id: 'e2-micro', name: 'E2 Micro', cost: 0.0084, category: 'compute', specs: '2 vCPU, 1GB RAM' },
      { id: 'e2-small', name: 'E2 Small', cost: 0.0168, category: 'compute', specs: '2 vCPU, 2GB RAM' },
      { id: 'cloud-functions', name: 'Cloud Functions', cost: 0.0000004, category: 'serverless', specs: 'Per invocation' }
    ],
    storage: [
      { id: 'gcs-standard', name: 'Cloud Storage Standard', cost: 0.02, category: 'storage', specs: 'Per GB/month' },
      { id: 'gcs-nearline', name: 'Cloud Storage Nearline', cost: 0.01, category: 'storage', specs: 'Per GB/month' }
    ],
    database: [
      { id: 'cloud-sql-small', name: 'Cloud SQL db-f1-micro', cost: 0.0150, category: 'database', specs: '0.6GB RAM' },
      { id: 'firestore', name: 'Firestore', cost: 0.18, category: 'database', specs: 'Per million ops' }
    ],
    networking: [
      { id: 'load-balancing', name: 'Load Balancing', cost: 0.025, category: 'networking', specs: 'Per hour' },
      { id: 'cloud-cdn', name: 'Cloud CDN', cost: 0.08, category: 'networking', specs: 'Per GB' },
      { id: 'vpc-network', name: 'VPC Network', cost: 0, category: 'networking', specs: 'Free' }
    ],
    ai: [
      { id: 'vision-api', name: 'Vision API', cost: 0.0015, category: 'ai', specs: 'Per 1K images' },
      { id: 'natural-language', name: 'Natural Language API', cost: 0.0001, category: 'ai', specs: 'Per 1K chars' },
      { id: 'vertex-ai', name: 'Vertex AI', cost: 0.05, category: 'ai', specs: 'Per hour' },
      { id: 'palm-api', name: 'PaLM API', cost: 0.0004, category: 'ai', specs: 'Per 1K tokens' }
    ]
  },
  RunPod: {
    ai: [
      { id: 'rtx-4090', name: 'RTX 4090', cost: 0.44, category: 'ai', specs: '24GB VRAM' },
      { id: 'a6000', name: 'A6000', cost: 0.79, category: 'ai', specs: '48GB VRAM' },
      { id: 'a100-40gb', name: 'A100 40GB', cost: 1.89, category: 'ai', specs: '40GB HBM2e' },
      { id: 'a100-80gb', name: 'A100 80GB', cost: 2.49, category: 'ai', specs: '80GB HBM2e' },
      { id: 'h100', name: 'H100', cost: 3.99, category: 'ai', specs: '80GB HBM3' },
      { id: 'llama-2-7b', name: 'Llama 2 7B', cost: 0.0004, category: 'ai', specs: 'Per request' },
      { id: 'llama-2-13b', name: 'Llama 2 13B', cost: 0.0008, category: 'ai', specs: 'Per request' },
      { id: 'llama-2-70b', name: 'Llama 2 70B', cost: 0.0018, category: 'ai', specs: 'Per request' },
      { id: 'mistral-7b', name: 'Mistral 7B', cost: 0.0003, category: 'ai', specs: 'Per request' }
    ]
  },
  MongoDB: {
    database: [
      { id: 'mongodb-atlas-m0', name: 'MongoDB Atlas M0', cost: 0, category: 'database', specs: 'Free tier, 512MB' },
      { id: 'mongodb-atlas-m10', name: 'MongoDB Atlas M10', cost: 0.08, category: 'database', specs: '2GB RAM, 10GB storage' },
      { id: 'mongodb-atlas-m20', name: 'MongoDB Atlas M20', cost: 0.20, category: 'database', specs: '4GB RAM, 20GB storage' }
    ]
  }
};

module.exports = cloudServices;
