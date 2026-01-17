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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
`;

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
  min-height: 1600px;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(58, 127, 160, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(61, 90, 128, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(41, 98, 138, 0.4) 0%, transparent 60%),
    linear-gradient(135deg, #1a4b6d 0%, #2d5f7f 30%, #1e3a5f 60%, #0d2436 100%);
  overflow-x: hidden;
  padding: 40px 20px 100px;

  @media (max-width: 1200px) {
    min-height: 1800px;
  }

  @media (max-width: 768px) {
    min-height: 2200px;
    padding: 20px 10px 60px;
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
  z-index: 2;

  @media (max-width: 768px) {
    width: ${props => (props.$size || 8) * 0.75}px;
    height: ${props => (props.$size || 8) * 0.75}px;
  }
`;

const GoldenSwirl = styled.div<{ $delay?: number }>`
  position: absolute;
  width: 400px;
  height: 200px;
  background: linear-gradient(45deg, transparent, rgba(244, 196, 48, 0.3) 50%, transparent);
  opacity: 0.4;
  filter: blur(40px);
  border-radius: 50%;
  animation: drift 25s ease-in-out infinite;
  animation-delay: ${props => props.$delay || 0}s;
  z-index: 1;
  pointer-events: none;

  @keyframes drift {
    0%, 100% {
      transform: translateX(0) rotate(0deg);
    }
    25% {
      transform: translateX(30px) rotate(5deg);
    }
    50% {
      transform: translateX(-20px) rotate(-3deg);
    }
    75% {
      transform: translateX(20px) rotate(3deg);
    }
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 125px;
  }
`;

const Planet = styled.div<{ $size: number; $color: string; $delay?: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: ${props => props.$color};
  box-shadow: inset -10px -10px 20px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(255, 255, 255, 0.1);
  z-index: 2;
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${props => props.$delay || 0}s;

  @media (max-width: 768px) {
    width: ${props => props.$size * 0.7}px;
    height: ${props => props.$size * 0.7}px;
  }
`;

const RingedPlanet = styled(Planet)`
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    width: ${props => props.$size * 1.8}px;
    height: ${props => props.$size * 0.3}px;
    border: 3px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);

    @media (max-width: 768px) {
      width: ${props => props.$size * 1.8 * 0.7}px;
      height: ${props => props.$size * 0.3 * 0.7}px;
      border-width: 2px;
    }
  }
`;

/**
 * Define checkpoint positions for winding path
 * Each position is {x, y} in percentage of container width/height
 */
const getCheckpointPositions = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) {
    // Vertical path for mobile
    return [
      { x: 50, y: 8 },   // 1
      { x: 30, y: 15 },  // 2
      { x: 70, y: 22 },  // 3
      { x: 40, y: 30 },  // 4
      { x: 60, y: 38 },  // 5
      { x: 35, y: 46 },  // 6
      { x: 65, y: 54 },  // 7
      { x: 40, y: 62 },  // 8
      { x: 60, y: 70 },  // 9
      { x: 35, y: 78 },  // 10
      { x: 55, y: 86 }   // 11
    ];
  } else if (isTablet) {
    // More vertical for tablet
    return [
      { x: 50, y: 8 },   // 1
      { x: 25, y: 15 },  // 2
      { x: 75, y: 22 },  // 3
      { x: 30, y: 30 },  // 4
      { x: 70, y: 38 },  // 5
      { x: 25, y: 48 },  // 6
      { x: 75, y: 56 },  // 7
      { x: 30, y: 65 },  // 8
      { x: 70, y: 73 },  // 9
      { x: 35, y: 82 },  // 10
      { x: 60, y: 90 }   // 11
    ];
  } else {
    // Winding horizontal path for desktop
    return [
      { x: 15, y: 10 },  // 1
      { x: 35, y: 15 },  // 2
      { x: 60, y: 20 },  // 3
      { x: 80, y: 28 },  // 4
      { x: 70, y: 38 },  // 5
      { x: 45, y: 45 },  // 6
      { x: 20, y: 52 },  // 7
      { x: 40, y: 62 },  // 8
      { x: 65, y: 70 },  // 9
      { x: 85, y: 78 },  // 10
      { x: 60, y: 88 }   // 11
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
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2, 1.5"
        />

        {/* Checkpoints as foreignObject for perfect alignment */}
        {challenges.map((challenge, index) => {
          const position = checkpointPositions[index];
          if (!position) return null;

          const status = getChallengeStatus(challenge.id, challenge.questPosition);

          return (
            <foreignObject
              key={challenge.id}
              x={position.x - 2.5}
              y={position.y - 2.5}
              width="5"
              height="5"
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

      {/* Golden Swirls */}
      <GoldenSwirl style={{ top: '10%', left: '15%' }} $delay={0} />
      <GoldenSwirl style={{ top: '40%', right: '10%' }} $delay={5} />
      <GoldenSwirl style={{ bottom: '15%', left: '20%' }} $delay={10} />

      {/* Stars - Various sizes and colors */}
      <Star style={{ top: '5%', left: '10%' }} $delay={0} $size={6} $color="#FFF" />
      <Star style={{ top: '8%', left: '25%' }} $delay={0.3} $size={10} $color="#FFD700" />
      <Star style={{ top: '12%', left: '45%' }} $delay={0.8} $size={7} $color="#FFF" />
      <Star style={{ top: '15%', right: '20%' }} $delay={1.2} $size={12} $color="#F4C430" />
      <Star style={{ top: '18%', left: '70%' }} $delay={1.5} $size={8} $color="#FFF" />
      <Star style={{ top: '22%', right: '8%' }} $delay={0.5} $size={6} $color="#FFD700" />
      <Star style={{ top: '28%', left: '15%' }} $delay={2} $size={9} $color="#FFF" />
      <Star style={{ top: '35%', right: '25%' }} $delay={1} $size={11} $color="#F4C430" />
      <Star style={{ top: '42%', left: '5%' }} $delay={1.8} $size={7} $color="#FFF" />
      <Star style={{ top: '48%', left: '40%' }} $delay={0.7} $size={8} $color="#FFD700" />
      <Star style={{ top: '52%', right: '15%' }} $delay={2.2} $size={10} $color="#FFF" />
      <Star style={{ top: '58%', left: '30%' }} $delay={1.4} $size={6} $color="#F4C430" />
      <Star style={{ top: '65%', right: '30%' }} $delay={0.9} $size={12} $color="#FFD700" />
      <Star style={{ top: '72%', left: '20%' }} $delay={1.6} $size={7} $color="#FFF" />
      <Star style={{ top: '78%', right: '10%' }} $delay={0.4} $size={9} $color="#FFF" />
      <Star style={{ top: '85%', left: '50%' }} $delay={2.1} $size={8} $color="#F4C430" />
      <Star style={{ top: '90%', right: '40%' }} $delay={1.1} $size={11} $color="#FFD700" />
      <Star style={{ bottom: '8%', left: '35%' }} $delay={0.6} $size={6} $color="#FFF" />

      {/* Planets */}
      <Planet $size={60} $color="radial-gradient(circle at 30% 30%, #6B9BD1, #2E5F8F)" style={{ top: '12%', right: '5%' }} $delay={0} />
      <RingedPlanet $size={50} $color="radial-gradient(circle at 30% 30%, #F4C870, #D4A650)" style={{ top: '45%', left: '8%' }} $delay={1} />
      <Planet $size={40} $color="radial-gradient(circle at 30% 30%, #98C9A3, #5F8D4E)" style={{ bottom: '20%', right: '12%' }} $delay={0.5} />
      <Planet $size={35} $color="radial-gradient(circle at 30% 30%, #D4A5A5, #A67C7C)" style={{ top: '60%', right: '25%' }} $delay={1.5} />
      <Planet $size={45} $color="radial-gradient(circle at 30% 30%, #9B88C4, #6B5B95)" style={{ bottom: '10%', left: '15%' }} $delay={0.8} />

      {/* Penguin mascot */}
      <PenguinMascot position={penguinPosition} />
    </MapContainer>
  );
};
