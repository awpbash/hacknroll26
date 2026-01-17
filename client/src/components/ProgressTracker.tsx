import React from 'react';
import styled from 'styled-components';

interface ProgressTrackerProps {
  totalModules: number;
  completedModules: number;
  currentModule: number;
  onModuleSelect: (moduleId: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  totalModules,
  completedModules,
  currentModule,
  onModuleSelect
}) => {
  const progressPercentage = (completedModules / totalModules) * 100;

  return (
    <Container>
      <Header>
        <Title>Your Learning Progress</Title>
        <ProgressText>
          {completedModules} of {totalModules} modules completed
        </ProgressText>
      </Header>

      <ProgressBarContainer>
        <ProgressBarFill style={{ width: `${progressPercentage}%` }}>
          <ProgressLabel>{Math.round(progressPercentage)}%</ProgressLabel>
        </ProgressBarFill>
      </ProgressBarContainer>

      <ModulesList>
        {Array.from({ length: totalModules }, (_, index) => {
          const moduleNumber = index + 1;
          const isCompleted = moduleNumber <= completedModules;
          const isCurrent = moduleNumber === currentModule;
          const isLocked = moduleNumber > completedModules + 1;

          return (
            <ModuleItem
              key={moduleNumber}
              onClick={() => !isLocked && onModuleSelect(moduleNumber)}
              $isCompleted={isCompleted}
              $isCurrent={isCurrent}
              $isLocked={isLocked}
            >
              <ModuleIcon>
                {isCompleted ? '✅' : isLocked ? '🔒' : isCurrent ? '▶️' : '⭕'}
              </ModuleIcon>
              <ModuleText>
                <ModuleName>Module {moduleNumber}</ModuleName>
                <ModuleStatus>
                  {isCompleted ? 'Completed' : isLocked ? 'Locked' : isCurrent ? 'In Progress' : 'Ready'}
                </ModuleStatus>
              </ModuleText>
            </ModuleItem>
          );
        })}
      </ModulesList>

      {completedModules === totalModules && (
        <CompletionBadge>
          <BadgeIcon>🎓</BadgeIcon>
          <BadgeText>
            <BadgeTitle>Course Completed!</BadgeTitle>
            <BadgeSubtitle>You've mastered the basics of cloud computing</BadgeSubtitle>
          </BadgeText>
        </CompletionBadge>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const Header = styled.div`
  margin-bottom: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
`;

const ProgressText = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 32px;
  background: var(--bg-tertiary);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: var(--gradient-cyber);
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  min-width: 60px;
`;

const ProgressLabel = styled.span`
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
`;

const ModulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModuleItem = styled.div<{
  $isCompleted: boolean;
  $isCurrent: boolean;
  $isLocked: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${props =>
    props.$isCompleted ? 'var(--accent-success)15' :
    props.$isCurrent ? 'var(--accent-primary)15' :
    props.$isLocked ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'};
  border: 2px solid ${props =>
    props.$isCompleted ? 'var(--accent-success)' :
    props.$isCurrent ? 'var(--accent-primary)' :
    props.$isLocked ? 'var(--border-color)' : 'var(--border-color)'};
  border-radius: 10px;
  cursor: ${props => props.$isLocked ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$isLocked ? 0.6 : 1};
  transition: all 0.2s ease;

  &:hover {
    ${props => !props.$isLocked && `
      transform: translateX(4px);
      box-shadow: var(--shadow-md);
    `}
  }
`;

const ModuleIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ModuleText = styled.div`
  flex: 1;
`;

const ModuleName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.125rem;
`;

const ModuleStatus = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const CompletionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--gradient-cyber);
  padding: 1.25rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  animation: celebrationPulse 2s ease infinite;

  @keyframes celebrationPulse {
    0%, 100% {
      box-shadow: var(--shadow-md);
    }
    50% {
      box-shadow: var(--glow-primary);
    }
  }
`;

const BadgeIcon = styled.div`
  font-size: 2.5rem;
  flex-shrink: 0;
`;

const BadgeText = styled.div`
  flex: 1;
`;

const BadgeTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`;

const BadgeSubtitle = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
`;

export default ProgressTracker;
