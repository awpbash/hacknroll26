import React, { useState } from 'react';
import styled from 'styled-components';
import { mockLeaderboard, mockCostLeaderboard } from '../data/mockData';

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

const TabBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  justify-content: center;
  border-bottom: 2px solid var(--border-color);
`;

interface TabProps {
  active?: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 14px 28px;
  border: none;
  background: none;
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  border-bottom: 3px solid ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: -2px;

  &:hover {
    color: var(--accent-primary);
  }
`;

const LeaderboardContainer = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
`;

const LeaderboardRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 24px;
  padding: 20px 28px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-hover);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const HeaderRow = styled(LeaderboardRow)`
  background: var(--bg-tertiary);
  font-weight: 700;
  color: var(--text-secondary);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: var(--bg-tertiary);
  }
`;

interface RankCellProps {
  rank: number;
}

const RankCell = styled.div<RankCellProps>`
  font-weight: 700;
  font-size: ${props => props.rank <= 3 ? '32px' : '20px'};
  color: ${props => {
    if (props.rank === 1) return '#FFD700';
    if (props.rank === 2) return '#C0C0C0';
    if (props.rank === 3) return '#CD7F32';
    return 'var(--text-primary)';
  }};
  text-align: center;
`;

const UsernameCell = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 16px;
`;

const ScoreCell = styled.div`
  font-weight: 700;
  color: var(--accent-success);
  font-size: 18px;
  text-align: right;
`;

const StatCell = styled.div`
  color: var(--text-secondary);
  font-size: 15px;
  text-align: right;
`;

interface LeaderboardEntry {
  rank: number;
  username: string;
  totalScore?: number;
  solvedCount?: number;
  cost?: number;
  score?: number;
}

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'cost-efficient'>('global');

  const getRankDisplay = (rank: number): string | number => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const leaderboard: LeaderboardEntry[] = activeTab === 'global' ? mockLeaderboard : mockCostLeaderboard;

  return (
    <PageContainer>
      <Header>
        <Title>Leaderboard</Title>
      </Header>

      <TabBar>
        <Tab
          active={activeTab === 'global'}
          onClick={() => setActiveTab('global')}
        >
          🏆 Global Rankings
        </Tab>
        <Tab
          active={activeTab === 'cost-efficient'}
          onClick={() => setActiveTab('cost-efficient')}
        >
          💰 Most Cost-Efficient
        </Tab>
      </TabBar>

      <LeaderboardContainer>
        <HeaderRow>
          <div>Rank</div>
          <div>Username</div>
          {activeTab === 'global' ? (
            <>
              <div style={{ textAlign: 'right' }}>Total Score</div>
              <div style={{ textAlign: 'right' }}>Solved</div>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'right' }}>Cost/Month</div>
              <div style={{ textAlign: 'right' }}>Score</div>
            </>
          )}
        </HeaderRow>

        {leaderboard.map((entry: LeaderboardEntry) => (
          <LeaderboardRow key={entry.rank}>
            <RankCell rank={entry.rank}>{getRankDisplay(entry.rank)}</RankCell>
            <UsernameCell>{entry.username}</UsernameCell>
            {activeTab === 'global' ? (
              <>
                <ScoreCell>{entry.totalScore?.toLocaleString()}</ScoreCell>
                <StatCell>{entry.solvedCount} challenges</StatCell>
              </>
            ) : (
              <>
                <StatCell>${entry.cost?.toFixed(2)}</StatCell>
                <ScoreCell>{entry.score}</ScoreCell>
              </>
            )}
          </LeaderboardRow>
        ))}
      </LeaderboardContainer>
    </PageContainer>
  );
};

export default LeaderboardPage;
