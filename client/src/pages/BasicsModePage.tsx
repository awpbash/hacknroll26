import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FaBaby,
  FaBook,
  FaBolt,
  FaDatabase,
  FaHdd,
  FaNetworkWired,
  FaCloud,
  FaRobot
} from 'react-icons/fa';
import { basicsModules } from '../data/basicsModules';
import { glossaryTerms, getTermsByCategory } from '../data/glossary';
import { getQuestionsByModule } from '../data/quizQuestions';
import ModuleCard from '../components/ModuleCard';
import GlossaryCard from '../components/GlossaryCard';
import QuizComponent from '../components/QuizComponent';
import ProgressTracker from '../components/ProgressTracker';

type ViewMode = 'module' | 'quiz' | 'glossary';

const BasicsModePage: React.FC = () => {
  const [currentModuleId, setCurrentModuleId] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('module');
  const [selectedGlossaryCategory, setSelectedGlossaryCategory] = useState<string>('all');

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cloudBasicsProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCompletedModules([1,2,3,4,5,6,7,8,9]);
      setCurrentModuleId(progress.currentModuleId || 1);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const progress = {
      completedModules,
      currentModuleId
    };
    localStorage.setItem('cloudBasicsProgress', JSON.stringify(progress));
  }, [completedModules, currentModuleId]);

  const currentModule = basicsModules.find(m => m.id === currentModuleId);
  const quizQuestions = getQuestionsByModule(currentModuleId);

  const handleQuizComplete = (score: number) => {
    const passed = score >= Math.ceil(quizQuestions.length * 0.7); // 70% to pass

    if (passed && !completedModules.includes(currentModuleId)) {
      setCompletedModules([...completedModules, currentModuleId]);
    }
  };

  const handleNextModule = () => {
    if (currentModuleId < basicsModules.length) {
      setCurrentModuleId(currentModuleId + 1);
      setViewMode('module');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModuleSelect = (moduleId: number) => {
    setCurrentModuleId(moduleId);
    setViewMode('module');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredGlossaryTerms = selectedGlossaryCategory === 'all'
    ? glossaryTerms
    : getTermsByCategory(selectedGlossaryCategory as any);

  const isModuleCompleted = completedModules.includes(currentModuleId);

  return (
    <PageContainer>
      <Header>
        <WelcomeBanner>
          <BannerIcon><FaBaby /></BannerIcon>
          <BannerContent>
            <BannerTitle>Cloud Computing Baby Mode</BannerTitle>
            <BannerSubtitle>
              Learn the basics of cloud computing with simple explanations and fun analogies
            </BannerSubtitle>
          </BannerContent>
        </WelcomeBanner>
      </Header>

      <ContentGrid>
        <Sidebar>
          <ProgressTracker
            totalModules={basicsModules.length}
            completedModules={completedModules.length}
            currentModule={currentModuleId}
            onModuleSelect={handleModuleSelect}
          />

          <QuickLinksCard>
            <QuickLinksTitle>Quick Access</QuickLinksTitle>
            <QuickLinkButton
              $active={viewMode === 'glossary'}
              onClick={() => setViewMode('glossary')}
            >
              <FaBook /> Glossary
            </QuickLinkButton>
          </QuickLinksCard>
        </Sidebar>

        <MainContent>
          {viewMode === 'module' && currentModule && (
            <>
              <ModuleHeader>
                <ModuleTitleRow>
                  <ModuleIcon>{currentModule.icon}</ModuleIcon>
                  <div>
                    <ModuleNumber>Module {currentModule.id}</ModuleNumber>
                    <ModuleTitle>{currentModule.title}</ModuleTitle>
                    <ModuleDescription>{currentModule.description}</ModuleDescription>
                    <ModuleMeta>
                      {currentModule.estimatedMinutes} min read
                      {isModuleCompleted && (
                        <CompletedBadge>✓ Completed</CompletedBadge>
                      )}
                    </ModuleMeta>
                  </div>
                </ModuleTitleRow>
              </ModuleHeader>

              <ModuleContentCard>
                <ModuleCard content={currentModule.content} />
              </ModuleContentCard>

              <ActionButtons>
                {quizQuestions.length > 0 && (
                  <QuizButton onClick={() => setViewMode('quiz')}>
                    Take Quiz
                  </QuizButton>
                )}
                {isModuleCompleted && currentModuleId < basicsModules.length && (
                  <NextModuleButton onClick={handleNextModule}>
                    Next Module →
                  </NextModuleButton>
                )}
              </ActionButtons>
            </>
          )}

          {viewMode === 'quiz' && (
            <>
              <BackButton onClick={() => setViewMode('module')}>
                ← Back to Module
              </BackButton>
              <QuizContainer>
                <QuizComponent
                  questions={quizQuestions}
                  onComplete={handleQuizComplete}
                />
              </QuizContainer>
            </>
          )}

          {viewMode === 'glossary' && (
            <>
              <BackButton onClick={() => setViewMode('module')}>
                ← Back to Module
              </BackButton>

              <GlossaryHeader>
                <GlossaryTitle>Cloud Computing Glossary</GlossaryTitle>
                <GlossarySubtitle>
                  Click any term to see detailed explanation, analogy, and examples
                </GlossarySubtitle>
              </GlossaryHeader>

              <CategoryFilter>
                <CategoryButton
                  $active={selectedGlossaryCategory === 'all'}
                  onClick={() => setSelectedGlossaryCategory('all')}
                >
                  All Terms
                </CategoryButton>
                <CategoryButton
                  $active={selectedGlossaryCategory === 'compute'}
                  onClick={() => setSelectedGlossaryCategory('compute')}
                >
                  <FaBolt /> Compute
                </CategoryButton>
                <CategoryButton
                  $active={selectedGlossaryCategory === 'storage'}
                  onClick={() => setSelectedGlossaryCategory('storage')}
                >
                  <FaHdd /> Storage
                </CategoryButton>
                <CategoryButton
                  $active={selectedGlossaryCategory === 'database'}
                  onClick={() => setSelectedGlossaryCategory('database')}
                >
                  <FaDatabase /> Database
                </CategoryButton>
                <CategoryButton
                  $active={selectedGlossaryCategory === 'networking'}
                  onClick={() => setSelectedGlossaryCategory('networking')}
                >
                  <FaNetworkWired /> Networking
                </CategoryButton>
                <CategoryButton
                  $active={selectedGlossaryCategory === 'general'}
                  onClick={() => setSelectedGlossaryCategory('general')}
                >
                  <FaCloud /> General
                </CategoryButton>
                <CategoryButton
                  $active={selectedGlossaryCategory === 'ai'}
                  onClick={() => setSelectedGlossaryCategory('ai')}
                >
                  <FaRobot /> AI
                </CategoryButton>
              </CategoryFilter>

              <GlossaryGrid>
                {filteredGlossaryTerms.map((term, index) => (
                  <GlossaryCard key={index} term={term} />
                ))}
              </GlossaryGrid>
            </>
          )}
        </MainContent>
      </ContentGrid>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem;
`;

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 2rem;
`;

const WelcomeBanner = styled.div`
  background: var(--gradient-cyber);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: var(--shadow-lg);
`;

const BannerIcon = styled.div`
  font-size: 4rem;
  flex-shrink: 0;
`;

const BannerContent = styled.div`
  flex: 1;
`;

const BannerTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
`;

const BannerSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.5;
`;

const ContentGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    order: 2;
  }
`;

const QuickLinksCard = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const QuickLinksTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
`;

const QuickLinkButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 0.875rem;
  background: ${props => props.$active ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};
  color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
  border: 2px solid ${props => props.$active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.$active ? 'var(--accent-secondary)' : 'var(--bg-hover)'};
    transform: translateX(4px);
  }
`;

const MainContent = styled.div`
  @media (max-width: 1024px) {
    order: 1;
  }
`;

const ModuleHeader = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const ModuleTitleRow = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
`;

const ModuleIcon = styled.div`
  font-size: 3rem;
  flex-shrink: 0;
`;

const ModuleNumber = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`;

const ModuleTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

const ModuleDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  line-height: 1.6;
`;

const ModuleMeta = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CompletedBadge = styled.span`
  background: var(--accent-success);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
`;

const ModuleContentCard = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const QuizButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
  }
`;

const NextModuleButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  color: var(--accent-primary);
  border: 2px solid #667eea;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: var(--accent-primary);
    color: white;
    transform: translateX(-4px);
  }
`;

const QuizContainer = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const GlossaryHeader = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const GlossaryTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

const GlossarySubtitle = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 0.625rem 1.25rem;
  background: ${props => props.$active ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
  border: 2px solid ${props => props.$active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.$active ? 'var(--accent-secondary)' : 'var(--bg-hover)'};
    border-color: var(--accent-primary);
  }
`;

const GlossaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
`;

export default BasicsModePage;
