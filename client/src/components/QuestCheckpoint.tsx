import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChallengeStatus } from '../hooks/useQuestProgress';

interface QuestCheckpointProps {
  challengeId: string;
  position: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: ChallengeStatus;
  style?: React.CSSProperties;
}

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 1px 3px rgba(79, 70, 229, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 1.5px 4px rgba(79, 70, 229, 0.4);
  }
`;

const CheckpointContainer = styled.div<{ $status: ChallengeStatus; $difficulty: string }>`
  position: absolute;
  width: 5px;
  height: 5px;
  cursor: ${props => (props.$status === 'locked' ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.3) translateY(-0.5px);
    filter: brightness(1.2) drop-shadow(0 0 3px ${props =>
      props.$difficulty === 'Easy'
        ? 'rgba(0, 230, 118, 0.6)'
        : props.$difficulty === 'Medium'
        ? 'rgba(255, 165, 0, 0.6)'
        : 'rgba(255, 0, 102, 0.6)'
    });
  }

  ${props =>
    props.$status === 'available' &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
      filter: drop-shadow(0 0 2px ${
        props.$difficulty === 'Easy'
          ? 'rgba(0, 230, 118, 0.4)'
          : props.$difficulty === 'Medium'
          ? 'rgba(255, 165, 0, 0.4)'
          : 'rgba(255, 0, 102, 0.4)'
      });
    `}

  ${props =>
    props.$status === 'completed' &&
    css`
      opacity: 0.85;
      filter: drop-shadow(0 0 1.5px rgba(0, 230, 118, 0.3));
      &:hover {
        opacity: 1;
        transform: scale(1.3) translateY(-0.5px);
      }
    `}

  ${props =>
    props.$status === 'locked' &&
    css`
      opacity: 0.4;
      filter: grayscale(100%);
      pointer-events: none;
    `}

  @media (max-width: 1200px) {
    width: 5px;
    height: 5px;
  }

  @media (max-width: 768px) {
    width: 5px;
    height: 5px;
  }
`;

const Cloud = styled.div<{ $difficulty: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 0 2px ${props =>
      props.$difficulty === 'Easy'
        ? 'rgba(0, 230, 118, 0.2)'
        : props.$difficulty === 'Medium'
        ? 'rgba(255, 165, 0, 0.2)'
        : 'rgba(255, 0, 102, 0.2)'};
  border: 1px solid
    ${props =>
      props.$difficulty === 'Easy'
        ? 'var(--success-color)'
        : props.$difficulty === 'Medium'
        ? 'var(--warning-color)'
        : 'var(--error-color)'};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const NumberBadge = styled.div<{ $difficulty: string }>`
  position: relative;
  z-index: 10;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${props =>
      props.$difficulty === 'Easy'
        ? '#10b981, #059669'
        : props.$difficulty === 'Medium'
        ? '#f59e0b, #d97706'
        : '#ef4444, #dc2626'}
  );
  color: white;
  font-size: 2px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.2);

  @media (max-width: 1200px) {
    width: 4px;
    height: 4px;
    font-size: 2px;
  }

  @media (max-width: 768px) {
    width: 4px;
    height: 4px;
    font-size: 1.5px;
  }
`;

const StatusIcon = styled.div<{ $status: ChallengeStatus }>`
  position: absolute;
  top: -0.5px;
  right: -0.5px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${props =>
    props.$status === 'completed'
      ? 'linear-gradient(135deg, #10b981, #059669)'
      : props.$status === 'locked'
      ? 'linear-gradient(135deg, #6b7280, #4b5563)'
      : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2px;
  box-shadow: 0 0.5px 0.5px rgba(0, 0, 0, 0.2);
  z-index: 20;

  ${props =>
    props.$status === 'available' &&
    css`
      display: none;
    `}

  @media (max-width: 768px) {
    width: 2.5px;
    height: 2.5px;
    font-size: 1.5px;
    top: -0.5px;
    right: -0.5px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 2px;
  padding: 2px 1px;
  background: rgba(10, 10, 15, 0.95);
  border: 1px solid rgba(0, 184, 212, 0.3);
  color: var(--text-primary);
  font-size: 1.5px;
  font-weight: 500;
  border-radius: 1.5px;
  max-width: 100px;
  text-align: center;
  line-height: 1.2;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 30;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 0 8px rgba(0, 184, 212, 0.2);

  ${CheckpointContainer}:hover & {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 3px solid transparent;
    border-bottom-color: rgba(10, 10, 15, 0.95);
  }

  @media (max-width: 768px) {
    font-size: 1.5px;
    padding: 2px 3px;
    max-height: 20px;
    min-width: 85px;
  }
`;

const DifficultyBadge = styled.div<{ $difficulty: string }>`
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5px 1px;
  background: ${props =>
    props.$difficulty === 'Easy'
      ? 'var(--success-color)'
      : props.$difficulty === 'Medium'
      ? 'var(--warning-color)'
      : 'var(--error-color)'};
  color: white;
  font-size: 3px;
  font-weight: 600;
  border-radius: 1px;
  white-space: nowrap;
  box-shadow:
    0 0.5px 1px rgba(0, 0, 0, 0.3),
    0 0 3px ${props =>
      props.$difficulty === 'Easy'
        ? 'rgba(0, 230, 118, 0.4)'
        : props.$difficulty === 'Medium'
        ? 'rgba(255, 165, 0, 0.4)'
        : 'rgba(255, 0, 102, 0.4)'};

  @media (max-width: 768px) {
    font-size: 2.5px;
    padding: 0.5px 1px;
    bottom: -3px;
  }
`;

export const QuestCheckpoint: React.FC<QuestCheckpointProps> = ({
  challengeId,
  position,
  title,
  difficulty,
  status,
  style
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (status === 'locked') {
      return;
    }
    navigate(`/challenge/${challengeId}`);
  };

  const getStatusIcon = () => {
    if (status === 'completed') {
      return '✓';
    }
    if (status === 'locked') {
      return '🔒';
    }
    return null;
  };

  const getTooltipText = () => {
    if (status === 'completed') {
      return `${title} - Completed!`;
    }
    if (status === 'available') {
      return `${title} - Click to start`;
    }
    return `${title} - Complete previous challenges first`;
  };

  return (
    <CheckpointContainer
      $status={status}
      $difficulty={difficulty}
      style={style}
      onClick={handleClick}
    >
      <Cloud $difficulty={difficulty}>
        <NumberBadge $difficulty={difficulty}>{position}</NumberBadge>
      </Cloud>

      <StatusIcon $status={status}>{getStatusIcon()}</StatusIcon>

      <Tooltip>{getTooltipText()}</Tooltip>

      <DifficultyBadge $difficulty={difficulty}>{difficulty}</DifficultyBadge>
    </CheckpointContainer>
  );
};
