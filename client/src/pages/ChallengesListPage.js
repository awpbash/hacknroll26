import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mockChallenges } from '../data/mockData';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 48px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 48px;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  border: 2px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-color)'};
  background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  color: var(--text-primary);
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: ${props => props.active ? 'var(--glow-primary)' : 'var(--shadow-sm)'};

  &:hover {
    border-color: var(--accent-primary);
    background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-hover)'};
    transform: translateY(-2px);
  }
`;

const ChallengesList = styled.div`
  display: grid;
  gap: 20px;
`;

const ChallengeCard = styled.div`
  background: var(--bg-secondary);
  padding: 28px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-lg), var(--glow-primary);
    background: var(--bg-hover);
  }
`;

const ChallengeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
  gap: 16px;
`;

const ChallengeTitle = styled.h3`
  font-size: 22px;
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
`;

const DifficultyBadge = styled.span`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  background: ${props => {
    switch(props.difficulty) {
      case 'Easy': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'Medium': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'Hard': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      default: return 'var(--bg-tertiary)';
    }
  }};
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-sm);
`;

const CategoryBadge = styled.span`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  box-shadow: var(--shadow-sm);
`;

const ChallengeDescription = styled.p`
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.7;
  font-size: 15px;
`;

const ChallengeStats = styled.div`
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--text-muted);
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: ${props => props.icon ? `"${props.icon}"` : '""'};
    font-size: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-size: 18px;
`;

const ChallengesListPage = () => {
  const navigate = useNavigate();
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredChallenges = mockChallenges.filter(challenge => {
    const matchesDifficulty = difficultyFilter === 'All' || challenge.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'All' || challenge.category === categoryFilter;
    return matchesDifficulty && matchesCategory;
  });

  const handleChallengeClick = (challengeId) => {
    navigate(`/challenge/${challengeId}`);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Cloud Architecture Challenges</Title>
        <Subtitle>Master cloud design through hands-on practice</Subtitle>
      </Header>

      <FilterBar>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['All', 'Easy', 'Medium', 'Hard'].map(difficulty => (
            <FilterButton
              key={difficulty}
              active={difficultyFilter === difficulty}
              onClick={() => setDifficultyFilter(difficulty)}
            >
              {difficulty}
            </FilterButton>
          ))}
        </div>
        <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['All', 'Storage', 'Compute', 'Database', 'Serverless', 'Full-Stack'].map(category => (
            <FilterButton
              key={category}
              active={categoryFilter === category}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </FilterButton>
          ))}
        </div>
      </FilterBar>

      <ChallengesList>
        {filteredChallenges.length === 0 ? (
          <EmptyState>
            No challenges found. Try adjusting your filters.
          </EmptyState>
        ) : (
          filteredChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              onClick={() => handleChallengeClick(challenge.id)}
            >
              <ChallengeHeader>
                <ChallengeTitle>{challenge.title}</ChallengeTitle>
                <BadgeContainer>
                  <DifficultyBadge difficulty={challenge.difficulty}>
                    {challenge.difficulty}
                  </DifficultyBadge>
                  <CategoryBadge>{challenge.category}</CategoryBadge>
                </BadgeContainer>
              </ChallengeHeader>
              <ChallengeDescription>{challenge.description}</ChallengeDescription>
              <ChallengeStats>
                <StatItem icon="✓">
                  Acceptance: {challenge.acceptanceRate.toFixed(1)}%
                </StatItem>
                <StatItem icon="📊">
                  {challenge.submissions} submissions
                </StatItem>
              </ChallengeStats>
            </ChallengeCard>
          ))
        )}
      </ChallengesList>
    </PageContainer>
  );
};

export default ChallengesListPage;
