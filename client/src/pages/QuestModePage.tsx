import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { QuestMap } from '../components/QuestMap';
import { QuestProgressBar } from '../components/QuestProgressBar';
import { useQuestProgress } from '../hooks/useQuestProgress';
import { fetchChallenges } from '../services/challengesApi';
import { orderChallengesForQuest, TOTAL_QUEST_CHALLENGES } from '../data/questChallengeOrder';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 70px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 24px;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 18px;
  color: var(--text-secondary);
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  max-width: 600px;
  margin: 100px auto;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  color: var(--error-color);
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
`;

const RetryButton = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CompletionModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  h2 {
    font-size: 32px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 18px;
    color: var(--text-secondary);
    margin-bottom: 32px;
  }

  button {
    padding: 14px 40px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
  }
`;

const Trophy = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
  animation: bounce 1s ease-in-out infinite;

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const QuestModePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, loading: progressLoading, getChallengeStatus } = useQuestProgress();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    // Check if all challenges are completed
    if (progress && progress.completedChallenges.length === TOTAL_QUEST_CHALLENGES) {
      setShowCompletionModal(true);
    }
  }, [progress]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      setError(null);

      const allChallenges = await fetchChallenges();
      const orderedChallenges = orderChallengesForQuest(allChallenges);

      if (orderedChallenges.length === 0) {
        throw new Error('No quest challenges found');
      }

      setChallenges(orderedChallenges);
    } catch (err: any) {
      console.error('Error loading quest challenges:', err);
      setError(err.message || 'Failed to load quest challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadChallenges();
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Loading state
  if (loading || progressLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading Quest Mode...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorTitle>Failed to Load Quest Mode</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>Retry</RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  // No challenges found
  if (challenges.length === 0) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorTitle>No Challenges Available</ErrorTitle>
          <ErrorMessage>
            Quest Mode challenges are not available at the moment. Please try again later.
          </ErrorMessage>
          <RetryButton onClick={handleBackToHome}>Back to Home</RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Progress bar header */}
      {progress && (
        <QuestProgressBar
          totalChallenges={progress.totalChallenges}
          completedCount={progress.completedChallenges.length}
        />
      )}

      {/* Quest map with checkpoints */}
      <div style={{ marginTop: '80px' }}>
        <QuestMap
          challenges={challenges}
          getChallengeStatus={getChallengeStatus}
          completedChallenges={progress?.completedChallenges || []}
        />
      </div>

      {/* Completion modal */}
      {showCompletionModal && (
        <CompletionModal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Trophy>🏆</Trophy>
            <h2>Quest Complete!</h2>
            <p>
              Congratulations! You've completed all {TOTAL_QUEST_CHALLENGES} challenges in Quest Mode.
              You're now a Cloud Architecture Master!
            </p>
            <button onClick={handleCloseModal}>Continue Exploring</button>
          </ModalContent>
        </CompletionModal>
      )}
    </PageContainer>
  );
};

export default QuestModePage;
