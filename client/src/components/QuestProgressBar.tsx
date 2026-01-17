import React from 'react';
import styled from 'styled-components';

interface QuestProgressBarProps {
  totalChallenges: number;
  completedCount: number;
}

const ProgressContainer = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid var(--border-color);
  box-shadow: var(--shadow-sm);
`;

const ProgressContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const PositionText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;

  span {
    color: var(--accent-primary);
    font-size: 20px;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--text-secondary);

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProgressBarTrack = styled.div`
  flex: 1;
  height: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressBarFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 6px;
  transition: width 0.5s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const PercentageText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--accent-primary);
  min-width: 50px;
  text-align: right;
`;

export const QuestProgressBar: React.FC<QuestProgressBarProps> = ({
  totalChallenges,
  completedCount
}) => {
  const percentage = Math.round((completedCount / totalChallenges) * 100);
  const nextChallenge = completedCount < totalChallenges ? completedCount + 1 : totalChallenges;

  return (
    <ProgressContainer>
      <ProgressContent>
        <ProgressInfo>
          <PositionText>
            Challenge <span>{nextChallenge}</span> of {totalChallenges}
          </PositionText>
          <Stats>
            <Stat>
              <strong>{completedCount}</strong> Complete
            </Stat>
            <Stat>
              <strong>{totalChallenges - completedCount}</strong> Remaining
            </Stat>
          </Stats>
        </ProgressInfo>

        <ProgressBarContainer>
          <ProgressBarTrack>
            <ProgressBarFill percentage={percentage} />
          </ProgressBarTrack>
          <PercentageText>{percentage}%</PercentageText>
        </ProgressBarContainer>
      </ProgressContent>
    </ProgressContainer>
  );
};
