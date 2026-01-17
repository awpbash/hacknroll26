import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ArchitectureBuilder from '../components/ArchitectureBuilder';
import { fetchCloudServices } from '../services/cloudServicesApi';
import { fetchChallengeById } from '../services/challengesApi';
import { useAuth } from '../context/AuthContext';
import { providerLogos } from '../data/providerLogos';
import { Challenge, CloudProvider, ArchitectureState, ArchitectureNode, CloudServicesData } from '../types';
import { formatPrice, formatToSignificantFigures } from '../utils/formatting';
import { submissionsAPI } from '../services/api';

const PageContainer = styled.div`
  max-width: 100%;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
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

const CompanyLogo = styled.img`
  height: 32px;
  width: auto;
  object-fit: contain;
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 900px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 28px;
  border-radius: 12px;
  background: ${props => props.passed ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
  border: 2px solid ${props => props.passed ? 'var(--accent-success)' : 'var(--accent-error)'};
  box-shadow: var(--shadow-lg), 0 0 0 9999px rgba(0, 0, 0, 0.7);
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

interface ResultTitleProps {
  passed?: boolean;
}

const ResultTitle = styled.h3<ResultTitleProps>`
  margin: 0 0 20px 0;
  color: white;
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

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: white;
    transform: scale(1.1);
  }
`;

const ResultStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatBox = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 700;
`;

const FeedbackSection = styled.div`
  margin-top: 20px;
`;

const ResultSectionTitle = styled.h4`
  font-size: 14px;
  margin: 0 0 10px 0;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
`;

interface FeedbackItemProps {
  passed?: boolean;
}

const FeedbackItem = styled.div<FeedbackItemProps>`
  padding: 12px 0;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  display: flex;
  align-items: start;
  gap: 10px;

  &::before {
    content: "•";
    color: white;
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

const VideoContainer = styled.div`
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: #000;
`;

const VideoEmbed = styled.iframe`
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
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
  } | null;
  phase3Status?: 'pending' | 'completed' | 'failed' | 'disabled' | 'timeout';
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

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/watch\?.*v=([^&\s]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
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
      {challenge.solutions.map((solution) => {
        const videoId = solution.videoUrl ? getYouTubeVideoId(solution.videoUrl) : null;

        return (
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

            {videoId && (
              <VideoContainer>
                <VideoEmbed
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={solution.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoContainer>
            )}

            <Section style={{ marginTop: '16px' }}>
              <MarkdownContent dangerouslySetInnerHTML={{ __html: solution.explanation }} />
            </Section>
          </SolutionCard>
        );
      })}
    </>
  );
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
    const loadChallenge = async () => {
      try {
        setLoading(true);
        const challengeData = await fetchChallengeById(id!);
        setChallenge(challengeData);

        // Load existing infrastructure if present
        if (challengeData?.existingInfrastructure) {
          setArchitecture({
            nodes: challengeData.existingInfrastructure.nodes || [],
            edges: challengeData.existingInfrastructure.edges || []
          });
        }
      } catch (error) {
        console.error('Error loading challenge:', error);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadChallenge();
    }
  }, [id]);

  // Poll for Phase 3 completion
  const pollPhase3 = async (submissionId: string): Promise<void> => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        console.log(`🔄 Polling Phase 3... (attempt ${attempts}/${maxAttempts})`);

        const response = await submissionsAPI.getById(submissionId);
        const evaluation = response.data.submission.evaluation;

        if (evaluation.phase3Status === 'completed') {
          console.log('✅ Phase 3 completed!');
          setResult(prev => prev ? {
            ...prev,
            status: evaluation.status || (evaluation.passed ? 'Accepted ✓' : 'Failed ✗'),
            evaluation: {
              ...prev.evaluation,
              score: evaluation.score,
              feedback: evaluation.feedback || [],
              llmFeedback: evaluation.phases?.phase3?.llmFeedback || null,
              phase3Status: 'completed'
            }
          } : null);
          return;
        }

        if (evaluation.phase3Status === 'failed') {
          console.log('❌ Phase 3 failed');
          setResult(prev => prev ? { ...prev, evaluation: { ...prev.evaluation, phase3Status: 'failed' } } : null);
          return;
        }

        if (attempts < maxAttempts && evaluation.phase3Status === 'pending') {
          setTimeout(poll, 1000);
        } else if (attempts >= maxAttempts) {
          console.log('⏱️ Phase 3 polling timeout');
          setResult(prev => prev ? { ...prev, evaluation: { ...prev.evaluation, phase3Status: 'timeout' } } : null);
        }
      } catch (error) {
        console.error('Error polling Phase 3:', error);
      }
    };
    poll();
  };

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

    try {
      console.log('🚀 Submitting to backend API...');
      console.log('Challenge ID:', challenge.id);
      console.log('Provider:', selectedProvider);
      console.log('Architecture:', architecture);

      const response = await submissionsAPI.submit({
        challengeId: challenge.id,
        architecture: {
          nodes: architecture.nodes,
          edges: architecture.edges
        },
        provider: selectedProvider,
        totalCost: 0,
        services: []
      });

      console.log('✅ Backend response (Phase 1 & 2):', response.data);

      const backendEval = response.data.submission.evaluation;
      const submissionId = response.data.submission.id;

      setResult({
        status: backendEval.status || (backendEval.passed ? 'Accepted ✓' : 'Failed ✗'),
        evaluation: {
          passed: backendEval.passed,
          score: backendEval.score,
          totalCost: backendEval.cost,
          complexity: backendEval.complexity,
          connections: architecture.edges.length,
          feedback: backendEval.feedback || [],
          errors: backendEval.errors || [],
          warnings: backendEval.phases?.phase2?.warnings?.map((w: any) => w.message) || [],
          llmFeedback: backendEval.phases?.phase3?.llmFeedback || null,
          phase3Status: backendEval.phase3Status || 'disabled'
        }
      });

      if (backendEval.phase3Status === 'pending') {
        console.log('🚀 Starting Phase 3 polling...');
        pollPhase3(submissionId);
      }

    } catch (error: any) {
      console.error('❌ Submission error:', error);

      // Show error to user
      setResult({
        status: 'Error',
        evaluation: {
          passed: false,
          score: 0,
          totalCost: 0,
          complexity: 0,
          connections: 0,
          feedback: [],
          errors: [error.response?.data?.message || error.message || 'Failed to submit solution. Please try again.'],
          warnings: [],
          llmFeedback: null
        }
      });
    } finally {
      setSubmitting(false);
    }
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
        {challenge.companyLogo && (
          <CompanyLogo src={challenge.companyLogo} alt={`${challenge.companyName || 'Company'} logo`} />
        )}
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
          <CloseButton onClick={() => setResult(null)} title="Close results">
            ×
          </CloseButton>
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
              <ResultSectionTitle>Feedback</ResultSectionTitle>
              {result.evaluation.feedback.map((fb: string, index: number) => (
                <FeedbackItem key={index} passed={true}>
                  {fb}
                </FeedbackItem>
              ))}
            </FeedbackSection>
          )}

          {result.evaluation.errors.length > 0 && (
            <FeedbackSection>
              <ResultSectionTitle>Issues</ResultSectionTitle>
              {result.evaluation.errors.map((error: string, index: number) => (
                <FeedbackItem key={index} passed={false}>
                  {error}
                </FeedbackItem>
              ))}
            </FeedbackSection>
          )}

          {result.evaluation.warnings && result.evaluation.warnings.length > 0 && (
            <FeedbackSection>
              <ResultSectionTitle>Suggestions</ResultSectionTitle>
              {result.evaluation.warnings.map((warning: string, index: number) => (
                <FeedbackItem key={index} passed={true} style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {warning}
                </FeedbackItem>
              ))}
            </FeedbackSection>
          )}

          {result.evaluation.phase3Status === 'pending' && (
            <FeedbackSection>
              <ResultSectionTitle>🤖 AI Analysis (Phase 3)</ResultSectionTitle>
              <Description style={{
                marginTop: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic'
              }}>
                ⏳ Running deep AI evaluation... This may take a few seconds.
              </Description>
            </FeedbackSection>
          )}

          {result.evaluation.phase3Status === 'failed' && (
            <FeedbackSection>
              <ResultSectionTitle>🤖 AI Analysis (Phase 3)</ResultSectionTitle>
              <Description style={{
                marginTop: '12px',
                color: 'rgba(239, 68, 68, 0.9)'
              }}>
                ❌ AI evaluation failed. Results based on Phase 1 & 2 only.
              </Description>
            </FeedbackSection>
          )}

          {result.evaluation.llmFeedback && result.evaluation.phase3Status === 'completed' && (
            <FeedbackSection>
              <ResultSectionTitle>🤖 AI Analysis (Phase 3)</ResultSectionTitle>
              <Description style={{ marginTop: '12px', color: 'rgba(255, 255, 255, 0.95)' }}>
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
