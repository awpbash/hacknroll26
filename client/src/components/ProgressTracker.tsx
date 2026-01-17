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
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  margin-bottom: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
`;

const ProgressText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 32px;
  background: #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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
    props.$isCompleted ? '#10b98110' :
    props.$isCurrent ? '#667eea10' :
    props.$isLocked ? '#f8fafc' : '#fff'};
  border: 2px solid ${props =>
    props.$isCompleted ? '#10b981' :
    props.$isCurrent ? '#667eea' :
    props.$isLocked ? '#e2e8f0' : '#e2e8f0'};
  border-radius: 10px;
  cursor: ${props => props.$isLocked ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$isLocked ? 0.6 : 1};
  transition: all 0.2s ease;

  &:hover {
    ${props => !props.$isLocked && `
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
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
  color: #1a1a1a;
  margin-bottom: 0.125rem;
`;

const ModuleStatus = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const CompletionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.25rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  animation: celebrationPulse 2s ease infinite;

  @keyframes celebrationPulse {
    0%, 100% {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    50% {
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
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
