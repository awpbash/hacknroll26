import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ArchitectureBuilder from '../components/ArchitectureBuilder';
import { mockChallenges } from '../data/mockData';
import { cloudServices } from '../data/cloudServices';
import { useAuth } from '../context/AuthContext';
import { providerLogos } from '../data/providerLogos';

const PageContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-size: 40px;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const DifficultyBadge = styled.span`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  background: ${props => {
    switch(props.difficulty) {
      case 'Easy': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'Medium': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'Hard': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      default: return 'var(--bg-tertiary)';
    }
  }};
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-sm);
`;

const CategoryBadge = styled.span`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  box-shadow: var(--shadow-sm);
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  background: var(--bg-secondary);
  padding: 28px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  max-height: 800px;
  overflow-y: auto;

  @media (max-width: 1200px) {
    max-height: none;
  }
`;

const RightPanel = styled.div`
  background: var(--bg-secondary);
  padding: 28px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
`;

const Section = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 16px 0;
  color: var(--text-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: ${props => props.icon ? `"${props.icon}"` : '""'};
    font-size: 20px;
  }
`;

const Description = styled.p`
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
  font-size: 15px;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RequirementItem = styled.li`
  padding: 10px 0;
  color: var(--text-secondary);
  display: flex;
  align-items: start;
  gap: 10px;
  line-height: 1.6;

  &:before {
    content: "✓";
    color: var(--accent-success);
    font-weight: bold;
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const ConstraintBox = styled.div`
  background: var(--bg-tertiary);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const ConstraintItem = styled.div`
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    color: var(--accent-warning);
  }
`;

const ProviderSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ProviderButton = styled.button`
  padding: 10px 20px;
  border: 2px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-color)'};
  background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  box-shadow: ${props => props.active ? 'var(--glow-primary)' : 'var(--shadow-sm)'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const ProviderLogo = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: ${props => props.active ? 'brightness(0) invert(1)' : 'brightness(1)'};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--accent-success), #059669);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
  }

  &:disabled {
    background: var(--bg-tertiary);
    cursor: not-allowed;
    box-shadow: none;
    color: var(--text-muted);
  }
`;

const ResultPanel = styled.div`
  margin-top: 24px;
  padding: 28px;
  border-radius: 12px;
  background: ${props => props.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 2px solid ${props => props.passed ? 'var(--accent-success)' : 'var(--accent-error)'};
  box-shadow: var(--shadow-lg);
`;

const ResultTitle = styled.h3`
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

const FeedbackItem = styled.div`
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

// Mock evaluation function
const evaluateArchitecture = (challenge, architecture, provider) => {
  const nodes = architecture.nodes || [];
  const edges = architecture.edges || [];

  // Calculate total cost
  let totalCost = 0;
  nodes.forEach(node => {
    const cost = node.data?.cost;
    if (cost) {
      totalCost += parseFloat(cost);
    }
  });

  // Check constraints
  const errors = [];
  const feedback = [];
  const warnings = [];
  let score = 0;

  // Check max cost constraint
  if (totalCost > challenge.constraints.maxCost) {
    errors.push(`Cost ($${totalCost.toFixed(2)}/month) exceeds budget ($${challenge.constraints.maxCost}/month)`);
  } else {
    feedback.push(`Cost optimization: Excellent! Your solution costs $${totalCost.toFixed(2)}/month`);
    score += 30;
  }

  // Check required services
  const requiredCategories = challenge.constraints.requiredServices || [];
  const usedCategories = [...new Set(nodes.map(n => n.data?.category).filter(Boolean))];

  requiredCategories.forEach(required => {
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
  let nodesWithIO = 0;
  let nodesWithoutIO = 0;

  nodes.forEach(node => {
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
  const groupedNodes = nodes.filter(n => n.data?.groupId);
  if (groupedNodes.length > 0) {
    const groups = [...new Set(groupedNodes.map(n => n.data.groupId))];
    feedback.push(`Component organization: ${groups.length} logical groups identified`);
    score += 10;
  }

  // Validate edge connections make sense
  const connectedNodeIds = new Set();
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const isolatedNodes = nodes.filter(n => !connectedNodeIds.has(n.id));
  if (isolatedNodes.length > 0 && nodes.length > 1) {
    warnings.push(`${isolatedNodes.length} service(s) are not connected to the architecture`);
  }

  const passed = errors.length === 0;

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

const ChallengePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('AWS');
  const [architecture, setArchitecture] = useState({ nodes: [], edges: [] });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load challenge from mock data
    const foundChallenge = mockChallenges.find(c => c.id === id);
    setChallenge(foundChallenge);

    // Load existing infrastructure if present
    if (foundChallenge?.existingInfrastructure) {
      setArchitecture({
        nodes: foundChallenge.existingInfrastructure.nodes || [],
        edges: foundChallenge.existingInfrastructure.edges || []
      });
    }

    setLoading(false);
  }, [id]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert('Please login to submit solutions');
      navigate('/login');
      return;
    }

    if (architecture.nodes.length === 0) {
      alert('Please design an architecture before submitting');
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
        <HeaderLeft>
          <Title>{challenge.title}</Title>
          <BadgeContainer>
            <DifficultyBadge difficulty={challenge.difficulty}>
              {challenge.difficulty}
            </DifficultyBadge>
            <CategoryBadge>{challenge.category}</CategoryBadge>
          </BadgeContainer>
        </HeaderLeft>
      </Header>

      <ContentContainer>
        <LeftPanel>
          <Section>
            <SectionTitle icon="📋">Description</SectionTitle>
            <Description>{challenge.description}</Description>
          </Section>

          <Section>
            <SectionTitle icon="✅">Requirements</SectionTitle>
            <RequirementsList>
              {challenge.requirements.map((req, index) => (
                <RequirementItem key={index}>{req}</RequirementItem>
              ))}
            </RequirementsList>
          </Section>

          <Section>
            <SectionTitle icon="⚙️">Constraints</SectionTitle>
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
              <SectionTitle icon="🏢">Existing Infrastructure</SectionTitle>
              <Description style={{ marginBottom: '12px' }}>
                Your company already has the following services deployed. Build upon this existing setup:
              </Description>
              <ConstraintBox>
                {challenge.existingInfrastructure.nodes.map((node) => (
                  <ConstraintItem key={node.id}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-success)' }}>
                      {node.data.serviceName}
                    </span>
                    {node.data.customLabel && ` - ${node.data.customLabel}`}
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      ${node.data.cost}/mo · {node.data.specs}
                    </div>
                  </ConstraintItem>
                ))}
              </ConstraintBox>
            </Section>
          )}
        </LeftPanel>

        <RightPanel>
          <SectionTitle icon="🏗️">Design Your Architecture</SectionTitle>

          <ProviderSelector>
            {['AWS', 'Azure', 'GCP', 'RunPod', 'MongoDB'].map(provider => (
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

          <ArchitectureBuilder
            provider={selectedProvider}
            services={cloudServices}
            onArchitectureChange={setArchitecture}
            initialNodes={challenge?.existingInfrastructure?.nodes || []}
            initialEdges={challenge?.existingInfrastructure?.edges || []}
          />

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
              <StatValue>${result.evaluation.totalCost.toFixed(2)}/mo</StatValue>
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
              {result.evaluation.feedback.map((fb, index) => (
                <FeedbackItem key={index} passed={true}>
                  {fb}
                </FeedbackItem>
              ))}
            </FeedbackSection>
          )}

          {result.evaluation.errors.length > 0 && (
            <FeedbackSection>
              <SectionTitle>Issues</SectionTitle>
              {result.evaluation.errors.map((error, index) => (
                <FeedbackItem key={index} passed={false}>
                  {error}
                </FeedbackItem>
              ))}
            </FeedbackSection>
          )}

          {result.evaluation.warnings && result.evaluation.warnings.length > 0 && (
            <FeedbackSection>
              <SectionTitle>Suggestions</SectionTitle>
              {result.evaluation.warnings.map((warning, index) => (
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
