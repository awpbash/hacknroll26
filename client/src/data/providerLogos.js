// Cloud provider logos using data URIs or CDN links
export const providerLogos = {
  AWS: {
    icon: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg',
    color: '#FF9900',
    name: 'Amazon Web Services'
  },
  Azure: {
    icon: 'https://cdn.worldvectorlogo.com/logos/azure-1.svg',
    color: '#0078D4',
    name: 'Microsoft Azure'
  },
  GCP: {
    icon: 'https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg',
    color: '#4285F4',
    name: 'Google Cloud Platform'
  },
  RunPod: {
    icon: 'https://avatars.githubusercontent.com/u/100166931',
    color: '#8b5cf6',
    name: 'RunPod'
  },
  MongoDB: {
    icon: 'https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg',
    color: '#47A248',
    name: 'MongoDB'
  }
};

// Service-specific icons (for individual services)
export const serviceLogos = {
  // AWS Services
  'EC2': 'https://cdn.worldvectorlogo.com/logos/aws-ec2.svg',
  'Lambda': 'https://cdn.worldvectorlogo.com/logos/aws-lambda-1.svg',
  'S3': 'https://cdn.worldvectorlogo.com/logos/aws-s3.svg',
  'RDS': 'https://cdn.worldvectorlogo.com/logos/aws-rds.svg',
  'DynamoDB': 'https://cdn.worldvectorlogo.com/logos/aws-dynamodb.svg',
  'CloudFront': 'https://cdn.worldvectorlogo.com/logos/aws-cloudfront.svg',
  'API Gateway': 'https://cdn.worldvectorlogo.com/logos/aws-api-gateway.svg',
  'SageMaker': 'https://cdn.worldvectorlogo.com/logos/aws-sagemaker.svg',

  // Azure Services
  'Virtual Machines': 'https://symbols.getvecta.com/stencil_25/27_virtual-machine.5f7f29e4f4.svg',
  'Functions': 'https://symbols.getvecta.com/stencil_25/35_function-app.6c8bb78791.svg',
  'Blob Storage': 'https://symbols.getvecta.com/stencil_25/44_blob-page.3c7f0dc0b5.svg',
  'Cosmos DB': 'https://symbols.getvecta.com/stencil_25/93_cosmosdb.66f2c4545e.svg',
  'SQL Database': 'https://symbols.getvecta.com/stencil_25/71_sql-database.ba91dfe382.svg',
  'CDN': 'https://symbols.getvecta.com/stencil_25/15_cdn-profile.51e135d789.svg',
  'Cognitive Services': 'https://symbols.getvecta.com/stencil_25/10_cognitive-services.e2d5e7c665.svg',

  // GCP Services
  'Compute Engine': 'https://symbols.getvecta.com/stencil_80/6_compute-engine.d66d8c70c0.svg',
  'Cloud Functions': 'https://symbols.getvecta.com/stencil_80/7_cloud-functions.a96ea77a6b.svg',
  'Cloud Storage': 'https://symbols.getvecta.com/stencil_80/33_cloud-storage.7f52943281.svg',
  'Cloud SQL': 'https://symbols.getvecta.com/stencil_80/21_cloud-sql.e58e07bbab.svg',
  'Firestore': 'https://symbols.getvecta.com/stencil_80/23_cloud-firestore.2d2e2f8a87.svg',
  'Cloud CDN': 'https://symbols.getvecta.com/stencil_80/12_cloud-cdn.ecebac8b5d.svg',
  'Vertex AI': 'https://symbols.getvecta.com/stencil_80/75_vertex-ai.06d0a44c77.svg',

  // RunPod (use emojis as fallback)
  'RTX 4090': '🎮',
  'A100': '🚀',
  'H100': '⚡',
  'Llama 2': '🦙',
  'Mistral': '🌬️',

  // MongoDB
  'M0 Sandbox': '🍃',
  'M10': '🗄️',
  'M20': '🗄️',
  'M30': '🗄️',
  'M40': '🗄️',
  'M50': '🗄️'
};

// Fallback function to get icon
export const getServiceIcon = (serviceName, category) => {
  // Check if we have a specific logo
  if (serviceLogos[serviceName]) {
    return serviceLogos[serviceName];
  }

  // Fallback to category emoji
  const categoryIcons = {
    compute: '⚡',
    storage: '💾',
    database: '🗄️',
    networking: '🌐',
    serverless: '☁️',
    ai: '🤖',
    messaging: '📨',
    cache: '⚡'
  };

  return categoryIcons[category] || '📦';
};
