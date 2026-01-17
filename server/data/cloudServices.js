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
    ]
  }
};

module.exports = cloudServices;
