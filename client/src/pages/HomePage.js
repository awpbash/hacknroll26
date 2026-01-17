import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mockChallenges } from '../data/mockData';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const FeaturedSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const FeaturedCard = styled.div`
  background: ${props => props.gradient || 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'};
  padding: 32px;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl);
  }

  &::before {
    content: ${props => props.emoji ? `"${props.emoji}"` : '""'};
    position: absolute;
    right: 20px;
    bottom: 20px;
    font-size: 80px;
    opacity: 0.2;
  }
`;

const CardBadge = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const CardButton = styled.button`
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const TopicSection = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const SectionStats = styled.div`
  color: var(--text-muted);
  font-size: 14px;
`;

const TopicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
`;

const TopicButton = styled.button`
  padding: 12px 20px;
  background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 2px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;

  &:hover {
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &::before {
    content: ${props => props.icon ? `"${props.icon}"` : '""'};
    font-size: 18px;
  }
`;

const ChallengeList = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
`;

const ChallengeRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr auto auto;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-hover);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ChallengeStatus = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.completed ? 'var(--accent-success)' : 'transparent'};
  border: 2px solid ${props => props.completed ? 'var(--accent-success)' : 'var(--border-color)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;

  &::after {
    content: ${props => props.completed ? '"✓"' : '""'};
  }
`;

const ChallengeInfo = styled.div``;

const ChallengeTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;

  &:hover {
    color: var(--accent-primary);
  }
`;

const ChallengeMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--text-muted);
`;

const DifficultyBadge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => {
    switch(props.difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  }};
`;

const AcceptanceRate = styled.div`
  color: var(--text-muted);
  font-size: 14px;
`;

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  const topics = [
    { name: 'All Topics', icon: '📋' },
    { name: 'Storage', icon: '💾' },
    { name: 'Compute', icon: '⚡' },
    { name: 'Database', icon: '🗄️' },
    { name: 'Serverless', icon: '☁️' },
    { name: 'Full-Stack', icon: '🏗️' }
  ];

  const filteredChallenges = selectedTopic === 'All Topics'
    ? mockChallenges
    : mockChallenges.filter(c => c.category === selectedTopic);

  return (
    <PageContainer>
      <FeaturedSection>
        <FeaturedCard
          gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
          emoji="🎯"
          onClick={() => navigate('/challenges')}
        >
          <CardBadge>New</CardBadge>
          <CardTitle>Quest</CardTitle>
          <CardDescription>
            Turn cloud practice into an epic adventure. Master architecture design step by step.
          </CardDescription>
          <CardButton>Begin Now</CardButton>
        </FeaturedCard>

        <FeaturedCard
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
          emoji="🏆"
          onClick={() => navigate('/challenges')}
        >
          <CardBadge>Challenge</CardBadge>
          <CardTitle>30 Days Challenge</CardTitle>
          <CardDescription>
            Complete all {mockChallenges.length} cloud architecture challenges in 30 days.
          </CardDescription>
          <CardButton>Start Learning</CardButton>
        </FeaturedCard>

        <FeaturedCard
          gradient="linear-gradient(135deg, #10b981, #059669)"
          emoji="💡"
          onClick={() => navigate('/learn')}
        >
          <CardBadge>Premium</CardBadge>
          <CardTitle>Learn Cloud Services</CardTitle>
          <CardDescription>
            Deep dive into AWS, Azure, GCP services with interactive guides.
          </CardDescription>
          <CardButton>Get Started</CardButton>
        </FeaturedCard>
      </FeaturedSection>

      <TopicSection>
        <SectionTitle>Topics</SectionTitle>
        <TopicGrid>
          {topics.map(topic => (
            <TopicButton
              key={topic.name}
              icon={topic.icon}
              active={selectedTopic === topic.name}
              onClick={() => setSelectedTopic(topic.name)}
            >
              {topic.name}
            </TopicButton>
          ))}
        </TopicGrid>
      </TopicSection>

      <TopicSection>
        <SectionHeader>
          <SectionTitle>Cloud Architecture Challenges</SectionTitle>
          <SectionStats>{filteredChallenges.length} challenges</SectionStats>
        </SectionHeader>

        <ChallengeList>
          {filteredChallenges.map((challenge, index) => (
            <ChallengeRow
              key={challenge.id}
              onClick={() => navigate(`/challenge/${challenge.id}`)}
            >
              <ChallengeStatus completed={index < 2} />

              <ChallengeInfo>
                <ChallengeTitle>
                  {challenge.id}. {challenge.title}
                </ChallengeTitle>
                <ChallengeMeta>
                  <span>💼 {challenge.category}</span>
                  <span>📊 {challenge.submissions} submissions</span>
                </ChallengeMeta>
              </ChallengeInfo>

              <DifficultyBadge difficulty={challenge.difficulty}>
                {challenge.difficulty}
              </DifficultyBadge>

              <AcceptanceRate>
                {challenge.acceptanceRate.toFixed(1)}%
              </AcceptanceRate>
            </ChallengeRow>
          ))}
        </ChallengeList>
      </TopicSection>
    </PageContainer>
  );
};

export default HomePage;
