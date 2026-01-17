// Cloud service definitions with pricing - copied from backend for standalone frontend

import type { ServiceCategory } from '../types';

export interface CloudServiceDefinition {
  id: string;
  name: string;
  baseCost: number;
  category: ServiceCategory;
  specs: string;
  description?: string;
}

export interface CloudServicesData {
  [key: string]: {
    [category: string]: CloudServiceDefinition[];
  };
}

export const cloudServices: CloudServicesData = {
  AWS: {
    compute: [
      { id: 'ec2-t2-micro', name: 'EC2 t2.micro', baseCost: 0.0116, category: 'compute', specs: '1 vCPU, 1GB RAM' },
      { id: 'ec2-t2-small', name: 'EC2 t2.small', baseCost: 0.023, category: 'compute', specs: '1 vCPU, 2GB RAM' },
      { id: 'ec2-t2-medium', name: 'EC2 t2.medium', baseCost: 0.0464, category: 'compute', specs: '2 vCPU, 4GB RAM' },
      { id: 'lambda', name: 'Lambda', baseCost: 0.0000002, category: 'serverless', specs: 'Per request' }
    ],
    storage: [
      { id: 's3-standard', name: 'S3 Standard', baseCost: 0.023, category: 'storage', specs: 'Per GB/month' },
      { id: 's3-infrequent', name: 'S3 Infrequent Access', baseCost: 0.0125, category: 'storage', specs: 'Per GB/month' },
      { id: 'ebs-gp3', name: 'EBS gp3', baseCost: 0.08, category: 'storage', specs: 'Per GB/month' }
    ],
    database: [
      { id: 'rds-mysql-small', name: 'RDS MySQL db.t3.small', baseCost: 0.034, category: 'database', specs: '2 vCPU, 2GB RAM' },
      { id: 'dynamodb', name: 'DynamoDB', baseCost: 0.25, category: 'database', specs: 'Per million writes' },
      { id: 'aurora-serverless', name: 'Aurora Serverless', baseCost: 0.06, category: 'database', specs: 'Per ACU-hour' }
    ],
    networking: [
      { id: 'elb', name: 'Elastic Load Balancer', baseCost: 0.0225, category: 'networking', specs: 'Per hour' },
      { id: 'cloudfront', name: 'CloudFront CDN', baseCost: 0.085, category: 'networking', specs: 'Per GB' },
      { id: 'api-gateway', name: 'API Gateway', baseCost: 0.0000035, category: 'networking', specs: 'Per request' },
      { id: 'vpc', name: 'VPC', baseCost: 0, category: 'networking', specs: 'Free' }
    ],
    other: [
      { id: 'sqs', name: 'SQS Queue', baseCost: 0.0000004, category: 'messaging', specs: 'Per request' },
      { id: 'sns', name: 'SNS', baseCost: 0.0000005, category: 'messaging', specs: 'Per notification' },
      { id: 'elasticache-redis', name: 'ElastiCache Redis', baseCost: 0.034, category: 'cache', specs: 'cache.t3.small' }
    ]
  },
  Azure: {
    compute: [
      { id: 'vm-b1s', name: 'VM B1S', baseCost: 0.0104, category: 'compute', specs: '1 vCPU, 1GB RAM' },
      { id: 'vm-b2s', name: 'VM B2S', baseCost: 0.0416, category: 'compute', specs: '2 vCPU, 4GB RAM' },
      { id: 'functions', name: 'Azure Functions', baseCost: 0.0000002, category: 'serverless', specs: 'Per execution' }
    ],
    storage: [
      { id: 'blob-hot', name: 'Blob Storage Hot', baseCost: 0.018, category: 'storage', specs: 'Per GB/month' },
      { id: 'blob-cool', name: 'Blob Storage Cool', baseCost: 0.01, category: 'storage', specs: 'Per GB/month' }
    ],
    database: [
      { id: 'sql-basic', name: 'SQL Database Basic', baseCost: 0.0067, category: 'database', specs: '5 DTUs' },
      { id: 'cosmos-db', name: 'Cosmos DB', baseCost: 0.008, category: 'database', specs: 'Per RU/s hour' }
    ],
    networking: [
      { id: 'load-balancer', name: 'Load Balancer', baseCost: 0.025, category: 'networking', specs: 'Per hour' },
      { id: 'cdn', name: 'CDN', baseCost: 0.081, category: 'networking', specs: 'Per GB' },
      { id: 'vnet', name: 'Virtual Network', baseCost: 0, category: 'networking', specs: 'Free' }
    ]
  },
  GCP: {
    compute: [
      { id: 'e2-micro', name: 'E2 Micro', baseCost: 0.0084, category: 'compute', specs: '2 vCPU, 1GB RAM' },
      { id: 'e2-small', name: 'E2 Small', baseCost: 0.0168, category: 'compute', specs: '2 vCPU, 2GB RAM' },
      { id: 'cloud-functions', name: 'Cloud Functions', baseCost: 0.0000004, category: 'serverless', specs: 'Per invocation' }
    ],
    storage: [
      { id: 'gcs-standard', name: 'Cloud Storage Standard', baseCost: 0.02, category: 'storage', specs: 'Per GB/month' },
      { id: 'gcs-nearline', name: 'Cloud Storage Nearline', baseCost: 0.01, category: 'storage', specs: 'Per GB/month' }
    ],
    database: [
      { id: 'cloud-sql-small', name: 'Cloud SQL db-f1-micro', baseCost: 0.0150, category: 'database', specs: '0.6GB RAM' },
      { id: 'firestore', name: 'Firestore', baseCost: 0.18, category: 'database', specs: 'Per million ops' }
    ],
    networking: [
      { id: 'load-balancing', name: 'Load Balancing', baseCost: 0.025, category: 'networking', specs: 'Per hour' },
      { id: 'cloud-cdn', name: 'Cloud CDN', baseCost: 0.08, category: 'networking', specs: 'Per GB' },
      { id: 'vpc-network', name: 'VPC Network', baseCost: 0, category: 'networking', specs: 'Free' }
    ]
  },
  RunPod: {
    compute: [
      { id: 'runpod-rtx4090', name: 'RTX 4090', baseCost: 0.69, category: 'compute', specs: '24GB VRAM, 16 vCPU', description: 'High-performance GPU for AI workloads' },
      { id: 'runpod-a6000', name: 'A6000', baseCost: 0.79, category: 'compute', specs: '48GB VRAM, 16 vCPU', description: 'Professional GPU for large models' },
      { id: 'runpod-a100-40gb', name: 'A100 40GB', baseCost: 1.89, category: 'compute', specs: '40GB VRAM, 32 vCPU', description: 'Enterprise GPU for training' },
      { id: 'runpod-a100-80gb', name: 'A100 80GB', baseCost: 2.49, category: 'compute', specs: '80GB VRAM, 32 vCPU', description: 'Large model training & inference' },
      { id: 'runpod-h100', name: 'H100', baseCost: 4.25, category: 'compute', specs: '80GB VRAM, 32 vCPU', description: 'Latest generation AI accelerator' }
    ],
    serverless: [
      { id: 'runpod-serverless-4090', name: 'Serverless RTX 4090', baseCost: 0.00039, category: 'serverless', specs: '24GB VRAM', description: 'Pay per second GPU inference' },
      { id: 'runpod-serverless-a6000', name: 'Serverless A6000', baseCost: 0.00044, category: 'serverless', specs: '48GB VRAM', description: 'Auto-scaling GPU inference' }
    ],
    ai: [
      { id: 'runpod-llama2-7b', name: 'Llama 2 7B', baseCost: 0.0002, category: 'ai', specs: '7B parameters', description: 'Small language model' },
      { id: 'runpod-llama2-13b', name: 'Llama 2 13B', baseCost: 0.0004, category: 'ai', specs: '13B parameters', description: 'Medium language model' },
      { id: 'runpod-llama2-70b', name: 'Llama 2 70B', baseCost: 0.0012, category: 'ai', specs: '70B parameters', description: 'Large language model' },
      { id: 'runpod-mistral-7b', name: 'Mistral 7B', baseCost: 0.0002, category: 'ai', specs: '7B parameters', description: 'Efficient language model' }
    ],
    storage: [
      { id: 'runpod-volume', name: 'Network Volume', baseCost: 0.10, category: 'storage', specs: 'Per GB/month', description: 'Persistent storage for pods' }
    ]
  },
  MongoDB: {
    database: [
      { id: 'mongodb-m0', name: 'M0 Sandbox', baseCost: 0, category: 'database', specs: '512MB RAM, Shared', description: 'Free tier for development' },
      { id: 'mongodb-m2', name: 'M2', baseCost: 9, category: 'database', specs: '2GB RAM, Shared', description: 'Small production workloads' },
      { id: 'mongodb-m5', name: 'M5', baseCost: 25, category: 'database', specs: '8GB RAM, Dedicated', description: 'Medium production workloads' },
      { id: 'mongodb-m10', name: 'M10', baseCost: 57, category: 'database', specs: '2GB RAM, Dedicated', description: 'General purpose' },
      { id: 'mongodb-m20', name: 'M20', baseCost: 120, category: 'database', specs: '4GB RAM, Dedicated', description: 'Higher performance' },
      { id: 'mongodb-m30', name: 'M30', baseCost: 240, category: 'database', specs: '8GB RAM, Dedicated', description: 'Production workloads' },
      { id: 'mongodb-m40', name: 'M40', baseCost: 480, category: 'database', specs: '16GB RAM, Dedicated', description: 'Large datasets' },
      { id: 'mongodb-m50', name: 'M50', baseCost: 900, category: 'database', specs: '32GB RAM, Dedicated', description: 'Enterprise scale' }
    ],
    serverless: [
      { id: 'mongodb-serverless', name: 'Serverless Instance', baseCost: 0.10, category: 'serverless', specs: 'Pay per operation', description: 'Auto-scaling MongoDB' }
    ],
    storage: [
      { id: 'mongodb-storage', name: 'Storage', baseCost: 0.25, category: 'storage', specs: 'Per GB/month', description: 'Database storage' },
      { id: 'mongodb-backup', name: 'Backup', baseCost: 0.20, category: 'storage', specs: 'Per GB/month', description: 'Continuous backups' }
    ]
  }
};
