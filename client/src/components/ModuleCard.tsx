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
  color: var(--text-primary);
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
  color: var(--text-secondary);
  margin: 0;
`;

const AnalogyBox = styled.div`
  background: var(--gradient-cyber);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: var(--shadow-md);
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
  color: var(--text-secondary);
  padding: 0.5rem 0 0.5rem 2rem;
  position: relative;

  &:before {
    content: '•';
    position: absolute;
    left: 0.5rem;
    color: var(--text-secondary);
    font-weight: normal;
    font-size: 1.2rem;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ComparisonCard = styled.div`
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const ComparisonTerm = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent-primary);
  margin: 0 0 0.75rem 0;
`;

const ComparisonDef = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
`;

const ComparisonExample = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);

  strong {
    color: var(--accent-primary);
    font-weight: 600;
  }
`;

export default ModuleCard;
