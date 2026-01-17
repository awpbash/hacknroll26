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
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
  }
`;

const CheckpointContainer = styled.div<{ $status: ChallengeStatus; $difficulty: string }>`
  position: absolute;
  width: 50px;
  height: 50px;
  cursor: ${props => (props.$status === 'locked' ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;

  ${props =>
    props.$status === 'available' &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
    `}

  ${props =>
    props.$status === 'completed' &&
    css`
      opacity: 0.85;
      &:hover {
        opacity: 1;
        transform: translateY(-4px);
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
    width: 45px;
    height: 45px;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }
`;

const Cloud = styled.div<{ $difficulty: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid
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
  width: 40px;
  height: 40px;
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
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  @media (max-width: 1200px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
`;

const StatusIcon = styled.div<{ $status: ChallengeStatus }>`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
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
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 20;

  ${props =>
    props.$status === 'available' &&
    css`
      display: none;
    `}

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 10px;
    top: -2px;
    right: -2px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 12px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 30;

  ${CheckpointContainer}:hover & {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 10px;
  }
`;

const DifficultyBadge = styled.div<{ $difficulty: string }>`
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 6px;
  background: ${props =>
    props.$difficulty === 'Easy'
      ? 'var(--success-color)'
      : props.$difficulty === 'Medium'
      ? 'var(--warning-color)'
      : 'var(--error-color)'};
  color: white;
  font-size: 9px;
  font-weight: 600;
  border-radius: 10px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    font-size: 8px;
    padding: 2px 5px;
    bottom: -16px;
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
