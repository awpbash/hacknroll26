import React, { useState } from 'react';
import styled from 'styled-components';
import { GlossaryTerm } from '../data/glossary';

interface GlossaryCardProps {
  term: GlossaryTerm;
}

const GlossaryCard: React.FC<GlossaryCardProps> = ({ term }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      compute: '#f59e0b',
      storage: '#10b981',
      database: '#3b82f6',
      networking: '#8b5cf6',
      general: '#6366f1',
      ai: '#ec4899'
    };
    return colors[category] || '#6366f1';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      compute: '⚡',
      storage: '💾',
      database: '🗄️',
      networking: '🌐',
      general: '☁️',
      ai: '🤖'
    };
    return icons[category] || '☁️';
  };

  return (
    <Card onClick={() => setIsExpanded(!isExpanded)} $isExpanded={isExpanded}>
      <CardHeader>
        <CategoryBadge $color={getCategoryColor(term.category)}>
          <span>{getCategoryIcon(term.category)}</span>
          {term.category}
        </CategoryBadge>
        <ExpandIcon $isExpanded={isExpanded}>
          {isExpanded ? '−' : '+'}
        </ExpandIcon>
      </CardHeader>

      <TermName>{term.term}</TermName>
      <Definition>{term.definition}</Definition>

      {isExpanded && (
        <ExpandedContent>
          <Section>
            <SectionIcon>💡</SectionIcon>
            <SectionTitle>Think of it like...</SectionTitle>
            <SectionText>{term.analogy}</SectionText>
          </Section>

          <Section>
            <SectionIcon>📝</SectionIcon>
            <SectionTitle>Example</SectionTitle>
            <SectionText>{term.example}</SectionText>
          </Section>

          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <Section>
              <SectionIcon>🔗</SectionIcon>
              <SectionTitle>Related Terms</SectionTitle>
              <RelatedTerms>
                {term.relatedTerms.map((related, index) => (
                  <RelatedTag key={index}>{related}</RelatedTag>
                ))}
              </RelatedTerms>
            </Section>
          )}
        </ExpandedContent>
      )}
    </Card>
  );
};

const Card = styled.div<{ $isExpanded: boolean }>`
  background: white;
  border: 2px solid ${props => props.$isExpanded ? '#667eea' : '#e2e8f0'};
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const CategoryBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  span {
    font-size: 0.9rem;
  }
`;

const ExpandIcon = styled.div<{ $isExpanded: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isExpanded ? '#667eea' : '#e2e8f0'};
  color: ${props => props.$isExpanded ? 'white' : '#666'};
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.3s ease;
`;

const TermName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;

const Definition = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  margin: 0;
`;

const ExpandedContent = styled.div`
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 2px solid #f1f5f9;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Section = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionIcon = styled.span`
  font-size: 1.1rem;
  margin-right: 0.5rem;
`;

const SectionTitle = styled.h4`
  display: inline;
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
  margin: 0;
`;

const SectionText = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: #555;
  margin: 0.5rem 0 0 0;
  padding-left: 1.6rem;
`;

const RelatedTerms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-left: 1.6rem;
`;

const RelatedTag = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
`;

export default GlossaryCard;
