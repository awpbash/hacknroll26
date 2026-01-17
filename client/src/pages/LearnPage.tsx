import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchCloudServices } from '../services/cloudServicesApi';
import { providerLogos } from '../data/providerLogos';
import { CloudProvider, CloudService, CloudServicesData, ServiceCategory } from '../types';
import ServiceDetailsModal from '../components/ServiceDetailsModal';
import { formatPrice } from '../utils/formatting';
import BasicsModePage from './BasicsModePage';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 42px;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0;
`;

const ModeToggle = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
`;

interface ModeButtonProps {
  active?: boolean;
}

const ModeButton = styled.button<ModeButtonProps>`
  padding: 14px 32px;
  background: ${props => props.active ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 2px solid ${props => props.active ? 'transparent' : 'var(--border-color)'};
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${props => props.active ? 'var(--glow-primary)' : 'var(--shadow-sm)'};
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-md);
  }
`;

const ProviderTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  justify-content: center;
  flex-wrap: wrap;
`;

interface ProviderTabProps {
  active?: boolean;
}

const ProviderTab = styled.button<ProviderTabProps>`
  padding: 14px 32px;
  background: ${props => props.active ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 2px solid ${props => props.active ? 'transparent' : 'var(--border-color)'};
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${props => props.active ? 'var(--glow-primary)' : 'var(--shadow-sm)'};
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface ProviderLogoProps {
  active?: boolean;
}

const ProviderLogo = styled.img<ProviderLogoProps>`
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: ${props => props.active ? 'brightness(0) invert(1)' : 'brightness(1)'};
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

interface CategoryTabProps {
  active?: boolean;
}

const CategoryTab = styled.button<CategoryTabProps>`
  padding: 10px 20px;
  background: ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};
    border-color: var(--accent-primary);
  }
`;

const CategorySection = styled.div`
  margin-bottom: 48px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
`;

const CategoryIcon = styled.div`
  font-size: 32px;
`;

const CategoryTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ServiceCard = styled.div`
  background: var(--bg-secondary);
  padding: 24px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--accent-primary);
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg), var(--glow-primary);
  }
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;

const ServiceName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const ServiceCost = styled.div`
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-success);
  border: 1px solid var(--border-color);
`;

const ServiceDescription = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
`;

const ServiceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ServiceTag = styled.span`
  padding: 4px 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
`;

const ErrorContainer = styled.div`
  background: var(--bg-secondary);
  border: 2px solid #ff4444;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  max-width: 600px;
  margin: 40px auto;
`;

const ErrorTitle = styled.h3`
  color: #ff4444;
  font-size: 20px;
  margin: 0 0 12px 0;
`;

const ErrorText = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
`;

interface CategoryIcons {
  [key: string]: string;
}

interface CategoryNames {
  [key: string]: string;
}

const LearnPage: React.FC = () => {
  const [mode, setMode] = useState<'services' | 'basics'>('services');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | 'All'>('AWS');
  const [selectedCategory, setSelectedCategory] = useState<string>('compute');
  const [cloudServices, setCloudServices] = useState<CloudServicesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<{service: CloudService, category: ServiceCategory} | null>(null);

  const providers: (CloudProvider | 'All')[] = ['All', 'AWS', 'Azure', 'GCP', 'RunPod', 'MongoDB'];

  const categoryIcons: CategoryIcons = {
    compute: '⚡',
    storage: '💾',
    database: '🗄️',
    networking: '🌐',
    ai: '🤖',
    serverless: '☁️',
    cache: '🔄',
    messaging: '💬'
  };

  const categoryNames: CategoryNames = {
    compute: 'Compute Services',
    storage: 'Storage Services',
    database: 'Database Services',
    networking: 'Networking Services',
    ai: 'AI & Machine Learning',
    serverless: 'Serverless Services',
    cache: 'Caching Services',
    messaging: 'Messaging Services'
  };

  // Fetch cloud services on component mount
  useEffect(() => {
    const loadCloudServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const services = await fetchCloudServices();
        setCloudServices(services);
      } catch (err) {
        setError('Failed to load cloud services. Please try again later.');
        console.error('Error loading cloud services:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCloudServices();
  }, []);

  // If in basics mode, render the basics page directly
  if (mode === 'basics') {
    return (
      <>
        <PageContainer>
          <Header>
            <Title>Learn Cloud Computing</Title>
            <Subtitle>
              Master cloud computing from beginner to advanced
            </Subtitle>
          </Header>

          <ModeToggle>
            <ModeButton active={false} onClick={() => setMode('services')}>
              🌐 Browse Services
            </ModeButton>
            <ModeButton active={true} onClick={() => setMode('basics')}>
              🍼 Learn Basics
            </ModeButton>
          </ModeToggle>
        </PageContainer>
        <BasicsModePage />
      </>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <PageContainer>
        <Header>
          <Title>Learn Cloud Services</Title>
          <Subtitle>
            Explore and understand cloud services from major providers
          </Subtitle>
        </Header>

        <ModeToggle>
          <ModeButton active={true} onClick={() => setMode('services')}>
            🌐 Browse Services
          </ModeButton>
          <ModeButton active={false} onClick={() => setMode('basics')}>
            🍼 Learn Basics
          </ModeButton>
        </ModeToggle>

        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading cloud services...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  // Show error state
  if (error || !cloudServices) {
    return (
      <PageContainer>
        <Header>
          <Title>Learn Cloud Services</Title>
          <Subtitle>
            Explore and understand cloud services from major providers
          </Subtitle>
        </Header>

        <ModeToggle>
          <ModeButton active={true} onClick={() => setMode('services')}>
            🌐 Browse Services
          </ModeButton>
          <ModeButton active={false} onClick={() => setMode('basics')}>
            🍼 Learn Basics
          </ModeButton>
        </ModeToggle>

        <ErrorContainer>
          <ErrorTitle>⚠️ Error Loading Services</ErrorTitle>
          <ErrorText>{error || 'Unable to load cloud services data.'}</ErrorText>
        </ErrorContainer>
      </PageContainer>
    );
  }

  // Get all available categories across all providers
  const allCategories = Array.from(
    new Set(
      Object.values(cloudServices).flatMap((providerServices: any) =>
        Object.keys(providerServices)
      )
    )
  );

  // Get services based on selected view
  let services: Record<string, CloudService[]> = {};

  if (selectedProvider === 'All') {
    // For "All" view, collect services by category across all providers
    const categoryServices: Record<string, CloudService[]> = {};
    allCategories.forEach(cat => {
      categoryServices[cat] = [];
    });

    Object.entries(cloudServices).forEach(([, providerServices]: [string, any]) => {
      Object.entries(providerServices).forEach(([category, serviceList]: [string, any]) => {
        if (!categoryServices[category]) {
          categoryServices[category] = [];
        }
        categoryServices[category].push(...serviceList);
      });
    });

    services = { [selectedCategory]: categoryServices[selectedCategory] || [] };
  } else {
    services = (cloudServices as any)[selectedProvider] || {};
  }

  return (
    <PageContainer>
      <Header>
        <Title>Learn Cloud Services</Title>
        <Subtitle>
          Explore and understand cloud services from major providers
        </Subtitle>
      </Header>

      <ModeToggle>
        <ModeButton active={true} onClick={() => setMode('services')}>
          🌐 Browse Services
        </ModeButton>
        <ModeButton active={false} onClick={() => setMode('basics')}>
          🍼 Learn Basics
        </ModeButton>
      </ModeToggle>

      <ProviderTabs>
        {providers.map((provider: CloudProvider | 'All') => (
          <ProviderTab
            key={provider}
            active={selectedProvider === provider}
            onClick={() => setSelectedProvider(provider)}
          >
            {provider !== 'All' && providerLogos[provider as CloudProvider] && (
              <ProviderLogo
                src={providerLogos[provider as CloudProvider]?.icon}
                alt={`${provider} logo`}
                active={selectedProvider === provider}
              />
            )}
            {provider === 'All' ? '🌐 All' : provider}
          </ProviderTab>
        ))}
      </ProviderTabs>

      {selectedProvider === 'All' && (
        <CategoryTabs>
          {allCategories.map((category: string) => (
            <CategoryTab
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              <span>{categoryIcons[category] || '📦'}</span>
              {categoryNames[category] || category}
            </CategoryTab>
          ))}
        </CategoryTabs>
      )}

      {Object.entries(services).map(([category, serviceList]: [string, CloudService[]]) => (
        <CategorySection key={category}>
          <CategoryHeader>
            <CategoryIcon>{categoryIcons[category] || '📦'}</CategoryIcon>
            <CategoryTitle>{categoryNames[category] || category}</CategoryTitle>
          </CategoryHeader>

          <ServiceGrid>
            {serviceList.map((service: CloudService) => (
              <ServiceCard
                key={service.id}
                onClick={() => setSelectedService({ service, category: category as ServiceCategory })}
              >
                <ServiceHeader>
                  <ServiceName>{service.name}</ServiceName>
                  <ServiceCost>
                    {formatPrice(service.cost, '/mo')}
                  </ServiceCost>
                </ServiceHeader>

                <ServiceDescription>
                  {service.description || 'Learn about this cloud service and how to use it effectively in your architecture.'}
                </ServiceDescription>

                <ServiceTags>
                  <ServiceTag>{service.provider}</ServiceTag>
                  <ServiceTag>{service.specs}</ServiceTag>
                </ServiceTags>
              </ServiceCard>
            ))}
          </ServiceGrid>
        </CategorySection>
      ))}

      {Object.keys(services).length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <h3>Coming Soon</h3>
          <p>Services for {selectedProvider} will be available soon!</p>
        </div>
      )}

      {selectedService && (
        <ServiceDetailsModal
          service={selectedService.service}
          category={selectedService.category}
          onClose={() => setSelectedService(null)}
        />
      )}
    </PageContainer>
  );
};

export default LearnPage;
