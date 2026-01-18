import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { QuestCheckpoint } from './QuestCheckpoint';
import { PenguinMascot } from './PenguinMascot';
import { ChallengeStatus } from '../hooks/useQuestProgress';

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questPosition: number;
}

interface QuestMapProps {
  challenges: Challenge[];
  getChallengeStatus: (challengeId: string, position: number) => ChallengeStatus;
  completedChallenges?: string[];
}

const twinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 700px;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(58, 127, 160, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(61, 90, 128, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(41, 98, 138, 0.4) 0%, transparent 60%),
    linear-gradient(135deg, #1a4b6d 0%, #2d5f7f 30%, #1e3a5f 60%, #0d2436 100%);
  overflow-x: hidden;
  padding: 0 20px 0;

  @media (max-width: 1200px) {
    min-height: 750px;
  }

  @media (max-width: 768px) {
    min-height: 800px;
    padding: 0 15px 0;
  }
`;

const MainSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

// Decorative elements
const Star = styled.div<{ $delay?: number; $size?: number; $color?: string }>`
  position: absolute;
  width: ${props => props.$size || 8}px;
  height: ${props => props.$size || 8}px;
  background: ${props => props.$color || '#FFD700'};
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  animation: ${twinkle} 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay || 0}s;
  z-index: 0;
  opacity: 0.5;

  @media (max-width: 768px) {
    width: ${props => (props.$size || 8) * 0.75}px;
    height: ${props => (props.$size || 8) * 0.75}px;
  }
`;

/**
 * Define checkpoint positions for winding path
 * Each position is {x, y} in percentage of container width/height
 */
const getCheckpointPositions = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) {
    // Vertical path for mobile - more spacing
    return [
      { x: 50, y: 5 },   // 1
      { x: 30, y: 12 },  // 2
      { x: 70, y: 20 },  // 3
      { x: 40, y: 28 },  // 4
      { x: 60, y: 36 },  // 5
      { x: 35, y: 45 },  // 6
      { x: 65, y: 54 },  // 7
      { x: 40, y: 63 },  // 8
      { x: 60, y: 72 },  // 9
      { x: 35, y: 82 },  // 10
      { x: 55, y: 92 }   // 11
    ];
  } else if (isTablet) {
    // More vertical for tablet - more spacing
    return [
      { x: 50, y: 5 },   // 1
      { x: 25, y: 12 },  // 2
      { x: 75, y: 20 },  // 3
      { x: 30, y: 28 },  // 4
      { x: 70, y: 36 },  // 5
      { x: 25, y: 46 },  // 6
      { x: 75, y: 55 },  // 7
      { x: 30, y: 64 },  // 8
      { x: 70, y: 73 },  // 9
      { x: 35, y: 83 },  // 10
      { x: 60, y: 92 }   // 11
    ];
  } else {
    // Winding horizontal path for desktop - more spacing
    return [
      { x: 15, y: 8 },   // 1
      { x: 35, y: 14 },  // 2
      { x: 60, y: 21 },  // 3
      { x: 80, y: 28 },  // 4
      { x: 70, y: 37 },  // 5
      { x: 45, y: 46 },  // 6
      { x: 20, y: 55 },  // 7
      { x: 40, y: 64 },  // 8
      { x: 65, y: 73 },  // 9
      { x: 85, y: 82 },  // 10
      { x: 60, y: 92 }   // 11
    ];
  }
};

export const QuestMap: React.FC<QuestMapProps> = ({ challenges, getChallengeStatus, completedChallenges = [] }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = React.useState(window.innerWidth >= 768 && window.innerWidth < 1200);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkpointPositions = useMemo(
    () => getCheckpointPositions(isMobile, isTablet),
    [isMobile, isTablet]
  );

  // Generate SVG path through all checkpoints
  const pathD = useMemo(() => {
    if (checkpointPositions.length === 0) return '';

    const path = checkpointPositions
      .map((pos, i) => {
        if (i === 0) return `M ${pos.x} ${pos.y}`;

        const prevPos = checkpointPositions[i - 1];
        // Use quadratic bezier curves for smooth winding path
        const cpX = (pos.x + prevPos.x) / 2;
        const cpY = (pos.y + prevPos.y) / 2 + (i % 2 === 0 ? -5 : 5);

        return `Q ${cpX} ${cpY}, ${pos.x} ${pos.y}`;
      })
      .join(' ');

    return path;
  }, [checkpointPositions]);

  // Calculate penguin position based on last completed challenge
  const penguinPosition = useMemo(() => {
    if (!completedChallenges || completedChallenges.length === 0) {
      return null;
    }

    const lastCompletedId = completedChallenges[completedChallenges.length - 1];
    const challengeIndex = challenges.findIndex(c => c.id === lastCompletedId);

    if (challengeIndex === -1 || !checkpointPositions[challengeIndex]) {
      return null;
    }

    const checkpointPos = checkpointPositions[challengeIndex];
    return {
      x: checkpointPos.x,
      y: checkpointPos.y - 15  // Float 15% above checkpoint
    };
  }, [completedChallenges, challenges, checkpointPositions]);

  return (
    <MapContainer>
      {/* Main SVG with path and checkpoints */}
      <MainSVG viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Dotted path connecting checkpoints */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(0, 184, 212, 0.5)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2, 1.5"
          filter="drop-shadow(0 0 2px rgba(0, 184, 212, 0.3))"
        />

        {/* Checkpoints as foreignObject for perfect alignment */}
        {challenges.map((challenge, index) => {
          const position = checkpointPositions[index];
          if (!position) return null;

          const status = getChallengeStatus(challenge.id, challenge.questPosition);

          return (
            <foreignObject
              key={challenge.id}
              x={position.x - 0.25}
              y={position.y - 0.25}
              width="0.5"
              height="0.5"
              style={{ overflow: 'visible' }}
            >
              <QuestCheckpoint
                challengeId={challenge.id}
                position={challenge.questPosition}
                title={challenge.title}
                difficulty={challenge.difficulty}
                status={status}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </foreignObject>
          );
        })}
      </MainSVG>

      {/* Stars - Neon theme colors instead of gold */}
      <Star style={{ top: '8%', left: '15%' }} $delay={0} $size={3} $color="#00B8D4" />
      <Star style={{ top: '20%', right: '12%' }} $delay={0.8} $size={4} $color="#7B1FA2" />
      <Star style={{ top: '35%', left: '8%' }} $delay={1.2} $size={3} $color="#00E676" />
      <Star style={{ top: '50%', right: '18%' }} $delay={0.5} $size={3} $color="#00B8D4" />
      <Star style={{ top: '65%', left: '12%' }} $delay={1.5} $size={4} $color="#7B1FA2" />
      <Star style={{ top: '80%', right: '10%' }} $delay={0.3} $size={3} $color="#FF0066" />

      {/* Penguin mascot */}
      <PenguinMascot position={penguinPosition} />
    </MapContainer>
  );
};
