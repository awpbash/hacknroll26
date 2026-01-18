import React from 'react';
import styled, { keyframes } from 'styled-components';

interface PenguinMascotProps {
  position: { x: number; y: number } | null;
}

const penguinFloat = keyframes`
  0%, 100% {
    transform: translate(-50%, -100%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -100%) translateY(-12px);
  }
`;

const PenguinContainer = styled.div`
  position: absolute;
  z-index: 15;
  transition: left 0.8s ease, top 0.8s ease;
  animation: ${penguinFloat} 3s ease-in-out infinite;
  pointer-events: none;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));

  @media (max-width: 1200px) {
    transform: translate(-50%, -100%) scale(0.85);
  }

  @media (max-width: 768px) {
    transform: translate(-50%, -100%) scale(0.7);
  }
`;

const PenguinImage = styled.img`
  width: 80px;
  height: auto;
  display: block;

  @media (max-width: 1200px) {
    width: 70px;
  }

  @media (max-width: 768px) {
    width: 55px;
  }
`;

export const PenguinMascot: React.FC<PenguinMascotProps> = ({ position }) => {
  if (!position) return null;

  return (
    <PenguinContainer
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`
      }}
    >
      <PenguinImage
        src="/assets/penguin-mascot.png"
        alt="Quest Progress Penguin"
        onError={(e) => {
          // Fallback if image doesn't load - hide the component
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </PenguinContainer>
  );
};
