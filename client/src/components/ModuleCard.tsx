import React from 'react';
import styled from 'styled-components';
import { ModuleContent, ComparisonItem } from '../data/basicsModules';

interface ModuleCardProps {
  content: ModuleContent[];
}

const ModuleCard: React.FC<ModuleCardProps> = ({ content }) => {
  return (
    <Container>
      {content.map((section, index) => (
        <Section key={index}>
          {section.heading && (
            <Heading>
              {section.icon && <Icon>{section.icon}</Icon>}
              {section.heading}
            </Heading>
          )}

          {section.type === 'text' && typeof section.content === 'string' && (
            <Text>{section.content}</Text>
          )}

          {section.type === 'analogy' && typeof section.content === 'string' && (
            <AnalogyBox>
              {section.icon && <AnalogyIcon>{section.icon}</AnalogyIcon>}
              <AnalogyText>{section.content}</AnalogyText>
            </AnalogyBox>
          )}

          {section.type === 'list' && Array.isArray(section.content) && (
            <List>
              {(section.content as string[]).map((item, i) => (
                <ListItem key={i}>{item}</ListItem>
              ))}
            </List>
          )}

          {section.type === 'comparison' && Array.isArray(section.content) && (
            <ComparisonGrid>
              {(section.content as ComparisonItem[]).map((item, i) => (
                <ComparisonCard key={i}>
                  <ComparisonTerm>{item.term}</ComparisonTerm>
                  <ComparisonDef>{item.definition}</ComparisonDef>
                  <ComparisonExample>
                    <strong>Example:</strong> {item.example}
                  </ComparisonExample>
                </ComparisonCard>
              ))}
            </ComparisonGrid>
          )}
        </Section>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Heading = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Icon = styled.span`
  font-size: 1.5rem;
`;

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #444;
  margin: 0;
`;

const AnalogyBox = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.1);
`;

const AnalogyIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

const AnalogyText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: white;
  margin: 0;
  font-weight: 500;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
`;

const ListItem = styled.li`
  font-size: 1rem;
  line-height: 1.7;
  color: #444;
  padding: 0.5rem 0 0.5rem 2rem;
  position: relative;

  &:before {
    content: '✓';
    position: absolute;
    left: 0.5rem;
    color: #10b981;
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ComparisonCard = styled.div`
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }
`;

const ComparisonTerm = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
  margin: 0 0 0.75rem 0;
`;

const ComparisonDef = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
  margin: 0 0 0.75rem 0;
`;

const ComparisonExample = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: #666;
  margin: 0;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;

  strong {
    color: #667eea;
    font-weight: 600;
  }
`;

export default ModuleCard;
