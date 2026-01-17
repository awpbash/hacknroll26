import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ArchitectureBuilder from '../components/ArchitectureBuilder';
import { mockChallenges } from '../data/mockData';
import { fetchCloudServices } from '../services/cloudServicesApi';
import { useAuth } from '../context/AuthContext';
import { providerLogos } from '../data/providerLogos';
import { Challenge, CloudProvider, ArchitectureState, ArchitectureNode, ArchitectureEdge, CloudServicesData } from '../types';
import { formatPrice, formatToSignificantFigures } from '../utils/formatting';

const PageContainer = styled.div`
  max-width: 100%;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 20px;
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

interface DifficultyBadgeProps {
  difficulty: string;
}

const DifficultyBadge = styled.span<DifficultyBadgeProps>`
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    switch(props.difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return 'var(--text-secondary)';
    }
  }};
  background: transparent;
  border: 1px solid currentColor;
`;

const CategoryBadge = styled.span`
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 45% 1fr;
  gap: 0;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1200px) {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-shrink: 0;
`;

interface TabButtonProps {
  active: boolean;
}

const TabButton = styled.button<TabButtonProps>`
  padding: 10px 16px;
  background: transparent;
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.15s;
  position: relative;

  &:hover {
    color: var(--text-primary);
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
`;

const RightPanel = styled.div`
  background: var(--bg-primary);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  margin: 0 0 10px 0;
  color: var(--text-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
`;

const Description = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RequirementItem = styled.li`
  padding: 6px 0;
  color: var(--text-secondary);
  display: flex;
  align-items: start;
  gap: 8px;
  line-height: 1.6;
  font-size: 14px;

  &:before {
    content: "•";
    color: var(--text-muted);
    flex-shrink: 0;
  }
`;

const ConstraintBox = styled.div`
  background: var(--bg-tertiary);
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
`;

const ConstraintItem = styled.div`
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 13px;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

const ProviderSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

interface ProviderButtonProps {
  active?: boolean;
}

const ProviderButton = styled.button<ProviderButtonProps>`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-color)'};
  background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    border-color: var(--accent-primary);
    background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};
  }
`;

interface ProviderLogoProps {
  active?: boolean;
}

const ProviderLogo = styled.img<ProviderLogoProps>`
  width: 16px;
  height: 16px;
  object-fit: contain;
  filter: ${props => props.active ? 'brightness(0) invert(1)' : 'brightness(1)'};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background: var(--accent-success);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    background: var(--bg-tertiary);
    cursor: not-allowed;
    color: var(--text-muted);
  }
`;

interface ResultPanelProps {
  passed?: boolean;
}

const ResultPanel = styled.div<ResultPanelProps>`
  margin-top: 24px;
  padding: 28px;
  border-radius: 12px;
  background: ${props => props.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 2px solid ${props => props.passed ? 'var(--accent-success)' : 'var(--accent-error)'};
  box-shadow: var(--shadow-lg);
`;

interface ResultTitleProps {
  passed?: boolean;
}

const ResultTitle = styled.h3<ResultTitleProps>`
  margin: 0 0 20px 0;
  color: ${props => props.passed ? 'var(--accent-success)' : 'var(--accent-error)'};
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: ${props => props.passed ? '"✓"' : '"✗"'};
    font-size: 28px;
  }
`;

const ResultStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatBox = styled.div`
  background: var(--bg-tertiary);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const StatLabel = styled.div`
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
`;

const FeedbackSection = styled.div`
  margin-top: 20px;
`;

interface FeedbackItemProps {
  passed?: boolean;
}

const FeedbackItem = styled.div<FeedbackItemProps>`
  padding: 12px 0;
  color: var(--text-secondary);
  line-height: 1.6;
  display: flex;
  align-items: start;
  gap: 10px;

  &::before {
    content: "•";
    color: ${props => props.passed ? 'var(--accent-success)' : 'var(--accent-error)'};
    font-size: 20px;
    font-weight: bold;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: var(--text-secondary);
  font-size: 18px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  line-height: 1.6;
`;

const MarkdownContent = styled.div`
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 14px;

  h2 {
    color: var(--text-primary);
    font-size: 16px;
    margin: 16px 0 8px 0;
    font-weight: 600;
  }

  h3 {
    color: var(--text-primary);
    font-size: 14px;
    margin: 12px 0 6px 0;
    font-weight: 600;
  }

  p {
    margin: 8px 0;
  }

  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  li {
    margin: 4px 0;
  }

  code {
    background: var(--bg-tertiary);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
    font-size: 13px;
    color: var(--accent-primary);
  }

  pre {
    background: var(--bg-tertiary);
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 12px 0;
    border: 1px solid var(--border-color);

    code {
      background: none;
      padding: 0;
      color: var(--text-primary);
    }
  }

  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

const SolutionCard = styled.div`
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--accent-primary);
  }
`;

const SolutionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SolutionTitle = styled.h4`
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
  font-weight: 600;
`;

const SolutionMeta = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--text-secondary);
  font-size: 13px;
`;

const SolutionStats = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
`;

const SolutionStat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 13px;

  span {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

const UpvoteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  font-size: 13px;

  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
`;

interface EvaluationResult {
  passed: boolean;
  score: number;
  totalCost: number;
  complexity: number;
  connections: number;
  feedback: string[];
  errors: string[];
  warnings: string[];
  llmFeedback: {
    summary: string;
  };
}

interface SubmissionResult {
  status: string;
  evaluation: EvaluationResult;
}

// Editorial Panel Component
interface EditorialPanelProps {
  challenge: Challenge;
}

const EditorialPanel: React.FC<EditorialPanelProps> = ({ challenge }) => {
  if (!challenge.editorial) {
    return (
      <EmptyState>
        <EmptyStateIcon>📝</EmptyStateIcon>
        <EmptyStateText>
          Editorial coming soon!
          <br />
          Check back later for detailed explanations and approaches.
        </EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <MarkdownContent dangerouslySetInnerHTML={{ __html: challenge.editorial }} />
  );
};

// Solutions Panel Component
interface SolutionsPanelProps {
  challenge: Challenge;
}

const SolutionsPanel: React.FC<SolutionsPanelProps> = ({ challenge }) => {
  if (!challenge.solutions || challenge.solutions.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>💡</EmptyStateIcon>
        <EmptyStateText>
          No community solutions yet.
          <br />
          Be the first to submit a solution to this challenge!
        </EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <>
      {challenge.solutions.map((solution) => (
        <SolutionCard key={solution.id}>
          <SolutionHeader>
            <div>
              <SolutionTitle>{solution.title}</SolutionTitle>
              <SolutionMeta>
                <span>by {solution.author}</span>
                <span>•</span>
                <span>{solution.provider}</span>
              </SolutionMeta>
            </div>
            <UpvoteButton>
              ▲ {solution.upvotes}
            </UpvoteButton>
          </SolutionHeader>

          <SolutionStats>
            <SolutionStat>
              Cost: <span>${solution.totalCost}/mo</span>
            </SolutionStat>
            <SolutionStat>
              Services: <span>{solution.architecture.nodes.length}</span>
            </SolutionStat>
          </SolutionStats>

          <Section style={{ marginTop: '16px' }}>
            <MarkdownContent dangerouslySetInnerHTML={{ __html: solution.explanation }} />
          </Section>
        </SolutionCard>
      ))}
    </>
  );
};

// Mock evaluation function
const evaluateArchitecture = (challenge: Challenge, architecture: ArchitectureState, provider: CloudProvider): EvaluationResult => {
  const nodes: ArchitectureNode[] = architecture.nodes || [];
  const edges: ArchitectureEdge[] = architecture.edges || [];

  // Calculate total cost
  let totalCost: number = 0;
  nodes.forEach((node: ArchitectureNode) => {
    const cost = node.data?.cost;
    if (cost) {
      totalCost += parseFloat(cost.toString());
    }
  });

  // Check constraints
  const errors: string[] = [];
  const feedback: string[] = [];
  const warnings: string[] = [];
  let score: number = 0;

  // Check max cost constraint
  if (challenge.constraints.maxCost && totalCost > challenge.constraints.maxCost) {
    errors.push(`Cost ($${formatToSignificantFigures(totalCost)}/month) exceeds budget ($${formatToSignificantFigures(challenge.constraints.maxCost)}/month)`);
  } else {
    feedback.push(`Cost optimization: Excellent! Your solution costs $${formatToSignificantFigures(totalCost)}/month`);
    score += 30;
  }

  // Check required services
  const requiredCategories: string[] = challenge.constraints.requiredServices || [];
  const usedCategories: string[] = [...new Set(nodes.map((n: ArchitectureNode) => n.data?.category).filter(Boolean))];

  requiredCategories.forEach((required: string) => {
    if (!usedCategories.includes(required)) {
      errors.push(`Missing required service category: ${required}`);
    } else {
      score += 15;
    }
  });

  // Check if architecture has nodes
  if (nodes.length === 0) {
    errors.push('Architecture is empty. Please add services.');
  } else {
    feedback.push(`Architecture complexity: ${nodes.length} services, ${edges.length} connections`);
    score += 15;
  }

  // Check if services are connected
  if (edges.length > 0) {
    feedback.push('Good: Services are properly connected');
    score += 15;
  } else if (nodes.length > 1) {
    errors.push('Services should be connected to show data flow');
  }

  // Check input/output specifications
  let nodesWithIO: number = 0;
  let nodesWithoutIO: number = 0;

  nodes.forEach((node: ArchitectureNode) => {
    const hasInput = node.data?.inputSpec && node.data.inputSpec.trim().length > 0;
    const hasOutput = node.data?.outputSpec && node.data.outputSpec.trim().length > 0;

    if (hasInput || hasOutput) {
      nodesWithIO++;
    } else {
      nodesWithoutIO++;
    }
  });

  if (nodesWithIO > 0) {
    feedback.push(`Data flow documentation: ${nodesWithIO} of ${nodes.length} services have input/output specifications`);
    score += Math.min(15, (nodesWithIO / nodes.length) * 15);
  }

  if (nodesWithoutIO > 0 && nodes.length > 2) {
    warnings.push(`Consider adding input/output specifications to ${nodesWithoutIO} services for better documentation`);
  }

  // Check for grouped components
  const groupedNodes = nodes.filter((n: ArchitectureNode) => (n.data as any)?.groupId);
  if (groupedNodes.length > 0) {
    const groups = [...new Set(groupedNodes.map((n: ArchitectureNode) => (n.data as any).groupId))];
    feedback.push(`Component organization: ${groups.length} logical groups identified`);
    score += 10;
  }

  // Validate edge connections make sense
  const connectedNodeIds = new Set<string>();
  edges.forEach((edge: ArchitectureEdge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const isolatedNodes = nodes.filter((n: ArchitectureNode) => !connectedNodeIds.has(n.id));
  if (isolatedNodes.length > 0 && nodes.length > 1) {
    warnings.push(`${isolatedNodes.length} service(s) are not connected to the architecture`);
  }

  const passed: boolean = errors.length === 0;

  return {
    passed,
    score: passed ? Math.min(100, score) : 0,
    totalCost,
    complexity: nodes.length,
    connections: edges.length,
    feedback,
    errors,
    warnings,
    llmFeedback: passed ? {
      summary: `Great job! Your architecture meets all requirements and stays within budget. The solution demonstrates good understanding of ${provider} services, cost optimization, and proper documentation of data flows.`
    } : {
      summary: 'Your solution needs improvement. Review the errors below and adjust your architecture accordingly. Consider adding input/output specifications to better document your data flows.'
    }
  };
};

const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('AWS');
  const [architecture, setArchitecture] = useState<ArchitectureState>({ nodes: [], edges: [] });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cloudServices, setCloudServices] = useState<CloudServicesData | null>(null);
  const [activeTab, setActiveTab] = useState<'description'| 'editorial' | 'solutions'>('description')

  // Fetch cloud services on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await fetchCloudServices();
        setCloudServices(services);
      } catch (err) {
        console.error('Error loading cloud services:', err);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    // Load challenge from mock data
    const foundChallenge = mockChallenges.find((c: Challenge) => c.id === id);
    setChallenge(foundChallenge || null);

    // Load existing infrastructure if present
    if (foundChallenge?.existingInfrastructure) {
      setArchitecture({
        nodes: foundChallenge.existingInfrastructure.nodes || [],
        edges: foundChallenge.existingInfrastructure.edges || []
      });
    }

    setLoading(false);
  }, [id]);

  const handleSubmit = async (): Promise<void> => {
    if (!isAuthenticated) {
      alert('Please login to submit solutions');
      navigate('/login');
      return;
    }

    if (architecture.nodes.length === 0) {
      alert('Please design an architecture before submitting');
      return;
    }

    if (!challenge) {
      return;
    }

    setSubmitting(true);
    setResult(null);

    // Simulate API call delay
    setTimeout(() => {
      const evaluation = evaluateArchitecture(challenge, architecture, selectedProvider);

      setResult({
        status: evaluation.passed ? 'Accepted ✓' : 'Failed ✗',
        evaluation
      });

      setSubmitting(false);
    }, 1500);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Loading challenge...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!challenge) {
    return (
      <PageContainer>
        <LoadingContainer>Challenge not found</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>{challenge.title}</Title>
        <BadgeContainer>
          <DifficultyBadge difficulty={challenge.difficulty}>
            {challenge.difficulty}
          </DifficultyBadge>
          <CategoryBadge>{challenge.category}</CategoryBadge>
        </BadgeContainer>
      </Header>

      <ContentContainer>
        <LeftPanel>
          <TabBar>
            <TabButton
              active={activeTab === 'description'}
              onClick={() => setActiveTab('description')}
            >
              Description
            </TabButton>
            <TabButton
              active={activeTab === 'editorial'}
              onClick={() => setActiveTab('editorial')}
            >
              Editorial
            </TabButton>
            <TabButton
              active={activeTab === 'solutions'}
              onClick={() => setActiveTab('solutions')}
            >
              Solutions
            </TabButton>
          </TabBar>

          <TabContent>
            {activeTab === 'description' && (
              <>
                <Section>
                  <SectionTitle>Description</SectionTitle>
                  <Description>{challenge.description}</Description>
                </Section>

                <Section>
                  <SectionTitle>Requirements</SectionTitle>
                  <RequirementsList>
                    {challenge.requirements.map((req: string, index: number) => (
                      <RequirementItem key={index}>{req}</RequirementItem>
                    ))}
                  </RequirementsList>
                </Section>

                <Section>
                  <SectionTitle>Constraints</SectionTitle>
                  <ConstraintBox>
                    <ConstraintItem>
                      Max Budget: <span>${challenge.constraints.maxCost}/month</span>
                    </ConstraintItem>
                    {challenge.constraints.requiredServices && (
                      <ConstraintItem>
                        Required: <span>{challenge.constraints.requiredServices.join(', ')}</span>
                      </ConstraintItem>
                    )}
                  </ConstraintBox>
                </Section>

                {challenge.existingInfrastructure && (
                  <Section>
                    <SectionTitle>Existing Infrastructure</SectionTitle>
                    <Description style={{ marginBottom: '12px' }}>
                      Your company already has the following services deployed. Build upon this existing setup:
                    </Description>
                    <ConstraintBox>
                      {challenge.existingInfrastructure.nodes.map((node: ArchitectureNode) => {
                        // Debug logging
                        if (!node.data || node.data.cost === undefined) {
                          console.error('Node with invalid data:', node);
                        }
                        return (
                          <ConstraintItem key={node.id}>
                            <span style={{ fontWeight: 600, color: 'var(--accent-success)' }}>
                              {node.data?.serviceName}
                            </span>
                            {node.data?.customLabel && ` - ${node.data.customLabel}`}
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {formatPrice(node.data?.cost ?? 0, '/mo')} · {node.data?.specs}
                            </div>
                          </ConstraintItem>
                        );
                      })}
                    </ConstraintBox>
                  </Section>
                )}
              </>
            )}

            {activeTab === 'editorial' && (
              <EditorialPanel challenge={challenge} />
            )}

            {activeTab === 'solutions' && (
              <SolutionsPanel challenge={challenge} />
            )}
          </TabContent>
        </LeftPanel>

        <RightPanel>
          <SectionTitle>Design Your Architecture</SectionTitle>

          <ProviderSelector>
            {(['AWS', 'Azure', 'GCP', 'RunPod', 'MongoDB'] as CloudProvider[]).map((provider: CloudProvider) => (
              <ProviderButton
                key={provider}
                active={selectedProvider === provider}
                onClick={() => setSelectedProvider(provider)}
              >
                <ProviderLogo
                  src={providerLogos[provider]?.icon}
                  alt={`${provider} logo`}
                  active={selectedProvider === provider}
                />
                {provider}
              </ProviderButton>
            ))}
          </ProviderSelector>

          {cloudServices ? (
            <ArchitectureBuilder
              provider={selectedProvider}
              services={cloudServices as any}
              onArchitectureChange={setArchitecture}
              initialNodes={challenge?.existingInfrastructure?.nodes || []}
              initialEdges={challenge?.existingInfrastructure?.edges || []}
            />
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Loading services...
            </div>
          )}

          <SubmitButton
            onClick={handleSubmit}
            disabled={submitting || architecture.nodes.length === 0}
          >
            {submitting ? 'Evaluating...' : 'Submit Solution'}
          </SubmitButton>
        </RightPanel>
      </ContentContainer>

      {result && (
        <ResultPanel passed={result.evaluation.passed}>
          <ResultTitle passed={result.evaluation.passed}>
            {result.status}
          </ResultTitle>

          <ResultStats>
            <StatBox>
              <StatLabel>Score</StatLabel>
              <StatValue>{result.evaluation.score}/100</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Total Cost</StatLabel>
              <StatValue>${formatToSignificantFigures(result.evaluation.totalCost)}/mo</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Services Used</StatLabel>
              <StatValue>{result.evaluation.complexity}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Connections</StatLabel>
              <StatValue>{result.evaluation.connections}</StatValue>
            </StatBox>
          </ResultStats>

          {result.evaluation.feedback.length > 0 && (
            <FeedbackSection>
              <SectionTitle>Feedback</SectionTitle>
              {result.evaluation.feedback.map((fb: string, index: number) => (
                <FeedbackItem key={index} passed={true}>
                  {fb}
                </FeedbackItem>
              ))}
            </FeedbackSection>
          )}

          {result.evaluation.errors.length > 0 && (
            <FeedbackSection>
              <SectionTitle>Issues</SectionTitle>
              {result.evaluation.errors.map((error: string, index: number) => (
                <FeedbackItem key={index} passed={false}>
                  {error}
                </FeedbackItem>
              ))}
            </FeedbackSection>
          )}

          {result.evaluation.warnings && result.evaluation.warnings.length > 0 && (
            <FeedbackSection>
              <SectionTitle>Suggestions</SectionTitle>
              {result.evaluation.warnings.map((warning: string, index: number) => (
                <FeedbackItem key={index} passed={true} style={{ color: 'var(--accent-warning)' }}>
                  {warning}
                </FeedbackItem>
              ))}
            </FeedbackSection>
          )}

          {result.evaluation.llmFeedback && (
            <FeedbackSection>
              <SectionTitle>AI Feedback</SectionTitle>
              <Description style={{ marginTop: '12px' }}>
                {result.evaluation.llmFeedback.summary}
              </Description>
            </FeedbackSection>
          )}
        </ResultPanel>
      )}
    </PageContainer>
  );
};

export default ChallengePage;
