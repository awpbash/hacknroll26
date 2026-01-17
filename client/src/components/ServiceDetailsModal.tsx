import React from 'react';
import styled from 'styled-components';
import { CloudService, ServiceCategory } from '../types';
import { formatPrice } from '../utils/formatting';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg), 0 0 50px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    transform: rotate(90deg);
  }
`;

const ServiceHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
`;

const ServiceIcon = styled.div<{ bgColor?: string }>`
  font-size: 48px;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || 'var(--bg-tertiary)'};
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
`;

const ServiceTitleSection = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.h2`
  font-size: 28px;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-weight: 700;
`;

const ServiceProvider = styled.div`
  display: inline-block;
  padding: 4px 12px;
  background: var(--accent-primary);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ServiceDescription = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: var(--accent-primary);
    border-radius: 2px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
  border-radius: 8px;
  overflow: hidden;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--bg-tertiary);
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-primary);
`;

const Badge = styled.span<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.variant) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#0078D4';
      default: return 'var(--accent-primary)';
    }
  }};
  color: white;
`;

const UseCaseList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UseCaseItem = styled.li`
  padding: 10px 16px;
  margin-bottom: 8px;
  background: var(--bg-primary);
  border-left: 3px solid var(--accent-primary);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '✓';
    color: var(--accent-primary);
    font-weight: 700;
    font-size: 16px;
  }
`;

interface ServiceDetailsModalProps {
  service: CloudService;
  category: ServiceCategory;
  onClose: () => void;
}

// Service category icons
const getCategoryIcon = (category: ServiceCategory): string => {
  const icons: Record<ServiceCategory, string> = {
    compute: '⚡',
    storage: '💾',
    database: '🗄️',
    networking: '🌐',
    serverless: '☁️',
    ai: '🤖',
    cache: '⚡',
    messaging: '📨'
  };
  return icons[category] || '📦';
};

// Service category colors
const getCategoryColor = (category: ServiceCategory): string => {
  const colors: Record<ServiceCategory, string> = {
    compute: '#FF9900',
    storage: '#10b981',
    database: '#8b5cf6',
    networking: '#0078D4',
    serverless: '#f59e0b',
    ai: '#ef4444',
    cache: '#ec4899',
    messaging: '#06b6d4'
  };
  return colors[category] || '#6366f1';
};

// Enhanced service details with descriptions and evaluation metrics
const getServiceDetails = (service: CloudService, category: ServiceCategory) => {
  const baseDetails = {
    description: service.description || 'Cloud service for scalable infrastructure',
    useCases: [] as string[],
    evaluation: {
      pricing: { value: 'N/A', description: 'Base cost' },
      scaling: { value: 'N/A', description: 'Scaling capability' },
      limits: { value: 'N/A', description: 'Service limits' },
      statefulness: { value: 'N/A', description: 'Data persistence' }
    }
  };

  // Compute services
  if (category === 'compute') {
    if (service.name.includes('EC2') || service.name.includes('VM') || service.name.includes('E2')) {
      return {
        description: 'Virtual compute instances with flexible configuration. Provides full control over the operating system and applications.',
        useCases: [
          'Web application hosting',
          'Batch processing workloads',
          'Development and testing environments',
          'Enterprise applications',
          'Microservices architecture'
        ],
        evaluation: {
          pricing: { value: formatPrice(service.cost, '/hr'), description: 'Hourly billing with reserved instance discounts' },
          scaling: { value: 'Manual/Auto', description: 'Manual or auto-scaling groups available' },
          limits: { value: 'High', description: 'Can scale to thousands of instances' },
          statefulness: { value: 'Stateful', description: 'Persistent storage available with attached volumes' }
        }
      };
    }
    if (service.name.includes('RTX') || service.name.includes('A100') || service.name.includes('H100') || service.name.includes('A6000')) {
      return {
        description: 'High-performance GPU instances optimized for AI/ML training, inference, and graphics rendering workloads.',
        useCases: [
          'AI model training',
          'Real-time inference',
          'Computer vision processing',
          'Video rendering and transcoding',
          'Scientific simulations'
        ],
        evaluation: {
          pricing: { value: formatPrice(service.cost, '/hr'), description: 'Premium GPU pricing with high performance' },
          scaling: { value: 'Manual', description: 'Scale by adding more GPU instances' },
          limits: { value: 'GPU Limited', description: 'Limited by GPU availability' },
          statefulness: { value: 'Stateful', description: 'Persistent storage for model weights and data' }
        }
      };
    }
  }

  // Serverless
  if (category === 'serverless') {
    return {
      description: 'Event-driven serverless compute that automatically scales based on demand. Pay only for execution time.',
      useCases: [
        'API backends',
        'Event processing',
        'Scheduled tasks',
        'Microservices',
        'Real-time file processing'
      ],
      evaluation: {
        pricing: { value: formatPrice(service.cost, '/req'), description: 'Pay per execution with generous free tier' },
        scaling: { value: 'Auto', description: 'Automatic scaling from 0 to thousands of concurrent executions' },
        limits: { value: '15min timeout', description: 'Execution time limits and cold starts' },
        statefulness: { value: 'Stateless', description: 'Ephemeral - use external storage for state' }
      }
    };
  }

  // Storage
  if (category === 'storage') {
    return {
      description: 'Object storage service for storing and retrieving any amount of data. Highly durable and available.',
      useCases: [
        'Static website hosting',
        'Data lakes and backups',
        'Media file storage',
        'Application data',
        'Archive and compliance'
      ],
      evaluation: {
        pricing: { value: formatPrice(service.cost, '/GB'), description: 'Pay per GB stored plus data transfer costs' },
        scaling: { value: 'Unlimited', description: 'Scales automatically to any size' },
        limits: { value: 'None', description: 'No practical storage limits' },
        statefulness: { value: 'Stateful', description: '99.999999999% durability with versioning' }
      }
    };
  }

  // Database
  if (category === 'database') {
    if (service.name.includes('MongoDB')) {
      return {
        description: 'Fully-managed NoSQL document database with automatic scaling, backups, and monitoring.',
        useCases: [
          'Content management systems',
          'Real-time analytics',
          'Mobile app backends',
          'IoT data storage',
          'User profiles and catalogs'
        ],
        evaluation: {
          pricing: { value: formatPrice(service.cost, '/mo'), description: 'Tiered pricing with free tier available' },
          scaling: { value: 'Auto/Manual', description: 'Auto-scaling with serverless or manual cluster sizing' },
          limits: { value: 'Varies by tier', description: 'Storage and throughput limits based on cluster tier' },
          statefulness: { value: 'Stateful', description: 'Fully persistent with replication and backups' }
        }
      };
    }
    if (service.name.includes('DynamoDB') || service.name.includes('Cosmos') || service.name.includes('Firestore')) {
      return {
        description: 'Fully-managed NoSQL database service with single-digit millisecond latency at any scale.',
        useCases: [
          'Session management',
          'Gaming leaderboards',
          'Mobile backends',
          'IoT sensor data',
          'Shopping cart data'
        ],
        evaluation: {
          pricing: { value: formatPrice(service.cost, '/op'), description: 'Pay per request with reserved capacity options' },
          scaling: { value: 'Auto', description: 'Automatic throughput scaling with on-demand mode' },
          limits: { value: '400KB item size', description: 'Item size limits and query constraints' },
          statefulness: { value: 'Stateful', description: 'Fully persistent with point-in-time recovery' }
        }
      };
    }
    return {
      description: 'Managed relational database service with automated backups, patching, and high availability.',
      useCases: [
        'Transactional applications',
        'ERP and CRM systems',
        'E-commerce platforms',
        'Financial applications',
        'Data warehousing'
      ],
      evaluation: {
        pricing: { value: formatPrice(service.cost, '/hr'), description: 'Instance pricing plus storage costs' },
        scaling: { value: 'Vertical', description: 'Scale up instance size, read replicas for horizontal scaling' },
        limits: { value: 'Instance size', description: 'Limited by instance type and storage capacity' },
        statefulness: { value: 'Stateful', description: 'ACID compliant with automated backups' }
      }
    };
  }

  // Networking
  if (category === 'networking') {
    if (service.name.includes('Load Balancer') || service.name.includes('ELB')) {
      return {
        description: 'Distributes incoming traffic across multiple targets for high availability and fault tolerance.',
        useCases: [
          'Multi-instance applications',
          'Auto-scaling groups',
          'Blue-green deployments',
          'SSL/TLS termination',
          'Health checking'
        ],
        evaluation: {
          pricing: { value: formatPrice(service.cost, '/hr'), description: 'Hourly charge plus data processing fees' },
          scaling: { value: 'Auto', description: 'Automatically scales to handle traffic' },
          limits: { value: 'High', description: 'Can handle millions of requests per second' },
          statefulness: { value: 'Stateless', description: 'Routes traffic, does not store data' }
        }
      };
    }
    if (service.name.includes('CDN') || service.name.includes('CloudFront')) {
      return {
        description: 'Content delivery network that caches content at edge locations for low-latency access worldwide.',
        useCases: [
          'Static website acceleration',
          'Video streaming',
          'API acceleration',
          'Software distribution',
          'Gaming assets'
        ],
        evaluation: {
          pricing: { value: formatPrice(service.cost, '/GB'), description: 'Data transfer pricing with regional variations' },
          scaling: { value: 'Auto', description: 'Global network scales automatically' },
          limits: { value: 'None', description: 'No practical limits on traffic' },
          statefulness: { value: 'Cache', description: 'Temporary caching with TTL configuration' }
        }
      };
    }
  }

  // Cache
  if (category === 'cache') {
    return {
      description: 'In-memory data store for sub-millisecond latency. Commonly used for caching and session management.',
      useCases: [
        'Database query caching',
        'Session storage',
        'Real-time analytics',
        'Leaderboards',
        'Pub/sub messaging'
      ],
      evaluation: {
        pricing: { value: formatPrice(service.cost, '/hr'), description: 'Instance pricing based on memory size' },
        scaling: { value: 'Vertical/Cluster', description: 'Scale up instance or use cluster mode' },
        limits: { value: 'Memory size', description: 'Limited by available memory' },
        statefulness: { value: 'Volatile', description: 'In-memory - can be persisted with snapshots' }
      }
    };
  }

  // Messaging
  if (category === 'messaging') {
    return {
      description: 'Fully-managed message queuing service for decoupling and scaling microservices.',
      useCases: [
        'Asynchronous processing',
        'Event-driven architectures',
        'Job queues',
        'Microservice communication',
        'Batch processing'
      ],
      evaluation: {
        pricing: { value: formatPrice(service.cost, '/req'), description: 'Pay per request with generous free tier' },
        scaling: { value: 'Auto', description: 'Unlimited throughput and queue length' },
        limits: { value: '256KB msg', description: 'Message size and retention limits' },
        statefulness: { value: 'Persistent', description: 'Messages persisted until processed' }
      }
    };
  }

  // AI services
  if (category === 'ai') {
    return {
      description: 'Pre-trained AI models and inference endpoints for deploying machine learning models at scale.',
      useCases: [
        'Chatbots and virtual assistants',
        'Content generation',
        'Code completion',
        'Text classification',
        'Question answering'
      ],
      evaluation: {
        pricing: { value: formatPrice(service.cost, '/token'), description: 'Pay per token or inference request' },
        scaling: { value: 'Auto', description: 'Serverless auto-scaling for inference' },
        limits: { value: 'Rate limits', description: 'Request rate and token limits' },
        statefulness: { value: 'Stateless', description: 'Models are stateless, context per request' }
      }
    };
  }

  return baseDetails;
};

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ service, category, onClose }) => {
  const details = getServiceDetails(service, category);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <ServiceHeader>
          <ServiceIcon bgColor={categoryColor}>{categoryIcon}</ServiceIcon>
          <ServiceTitleSection>
            <ServiceTitle>{service.name}</ServiceTitle>
            <ServiceProvider>{service.provider}</ServiceProvider>
          </ServiceTitleSection>
        </ServiceHeader>

        <ServiceDescription>{details.description}</ServiceDescription>

        <Section>
          <SectionTitle>Service Evaluation</SectionTitle>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>Metric</TableHeader>
                <TableHeader>Value</TableHeader>
                <TableHeader>Details</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              <TableRow>
                <TableCell>Pricing</TableCell>
                <TableCell><Badge variant="info">{details.evaluation.pricing.value}</Badge></TableCell>
                <TableCell>{details.evaluation.pricing.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Scaling</TableCell>
                <TableCell><Badge variant="success">{details.evaluation.scaling.value}</Badge></TableCell>
                <TableCell>{details.evaluation.scaling.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Limits</TableCell>
                <TableCell><Badge variant="warning">{details.evaluation.limits.value}</Badge></TableCell>
                <TableCell>{details.evaluation.limits.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Statefulness</TableCell>
                <TableCell><Badge>{details.evaluation.statefulness.value}</Badge></TableCell>
                <TableCell>{details.evaluation.statefulness.description}</TableCell>
              </TableRow>
            </tbody>
          </Table>
        </Section>

        {details.useCases.length > 0 && (
          <Section>
            <SectionTitle>Common Use Cases</SectionTitle>
            <UseCaseList>
              {details.useCases.map((useCase, index) => (
                <UseCaseItem key={index}>{useCase}</UseCaseItem>
              ))}
            </UseCaseList>
          </Section>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ServiceDetailsModal;
