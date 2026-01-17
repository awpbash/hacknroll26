import React, { useState } from 'react';
import styled from 'styled-components';
import { QuizQuestion } from '../data/quizQuestions';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0));
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <Container>
        <ResultCard $passed={passed}>
          <ResultIcon>{passed ? '🎉' : '📚'}</ResultIcon>
          <ResultTitle>
            {passed ? 'Great Job!' : 'Keep Learning!'}
          </ResultTitle>
          <ResultScore>
            You scored {finalScore} out of {questions.length} ({percentage}%)
          </ResultScore>
          <ResultMessage>
            {passed
              ? "You've got a solid understanding of these concepts. Ready to move on!"
              : "Don't worry! Review the module content and try again. Learning takes time!"}
          </ResultMessage>
          <ButtonGroup>
            <RestartButton onClick={restartQuiz}>
              Try Again
            </RestartButton>
          </ButtonGroup>
        </ResultCard>
      </Container>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Container>
      <ProgressBar>
        <ProgressFill
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </ProgressBar>

      <QuestionCard>
        <QuestionHeader>
          <QuestionNumber>
            Question {currentQuestion + 1} of {questions.length}
          </QuestionNumber>
          <ScoreDisplay>
            Score: {score}/{questions.length}
          </ScoreDisplay>
        </QuestionHeader>

        <QuestionText>{question.question}</QuestionText>

        <AnswerList>
          {question.options.map((option, index) => (
            <AnswerOption
              key={index}
              onClick={() => handleAnswerSelect(index)}
              $selected={selectedAnswer === index}
              $correct={showExplanation && index === question.correctAnswer}
              $incorrect={showExplanation && selectedAnswer === index && !isCorrect}
              $disabled={showExplanation}
            >
              <AnswerLetter>{String.fromCharCode(65 + index)}</AnswerLetter>
              <AnswerText>{option}</AnswerText>
              {showExplanation && index === question.correctAnswer && (
                <AnswerIcon>✓</AnswerIcon>
              )}
              {showExplanation && selectedAnswer === index && !isCorrect && (
                <AnswerIcon>✗</AnswerIcon>
              )}
            </AnswerOption>
          ))}
        </AnswerList>

        {showExplanation && (
          <Explanation $correct={isCorrect}>
            <ExplanationIcon>{isCorrect ? '✓' : '💡'}</ExplanationIcon>
            <ExplanationText>
              {isCorrect ? (
                <strong>Correct! </strong>
              ) : (
                <strong>Not quite. </strong>
              )}
              {question.explanation}
            </ExplanationText>
          </Explanation>
        )}

        <ButtonGroup>
          {!showExplanation ? (
            <SubmitButton
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </SubmitButton>
          ) : (
            <NextButton onClick={handleNext}>
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'} →
            </NextButton>
          )}
        </ButtonGroup>
      </QuestionCard>
    </Container>
  );
};

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const QuestionNumber = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ScoreDisplay = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #10b981;
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
`;

const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const AnswerOption = styled.div<{
  $selected: boolean;
  $correct: boolean;
  $incorrect: boolean;
  $disabled: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 2px solid ${props =>
    props.$correct ? '#10b981' :
    props.$incorrect ? '#ef4444' :
    props.$selected ? '#667eea' : '#e2e8f0'};
  background: ${props =>
    props.$correct ? '#10b98110' :
    props.$incorrect ? '#ef444410' :
    props.$selected ? '#667eea10' : 'white'};
  border-radius: 12px;
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;

  &:hover {
    ${props => !props.$disabled && `
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
      transform: translateX(4px);
    `}
  }
`;

const AnswerLetter = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #475569;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const AnswerText = styled.div`
  flex: 1;
  font-size: 1rem;
  color: #1a1a1a;
  line-height: 1.5;
`;

const AnswerIcon = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const Explanation = styled.div<{ $correct: boolean }>`
  background: ${props => props.$correct ? '#10b98110' : '#667eea10'};
  border-left: 4px solid ${props => props.$correct ? '#10b981' : '#667eea'};
  padding: 1rem 1.25rem;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
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

const ExplanationIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ExplanationText = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #1a1a1a;
  margin: 0;

  strong {
    color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NextButton = styled(SubmitButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
`;

const ResultCard = styled.div<{ $passed: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const ResultIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ResultTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
`;

const ResultScore = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 1rem;
`;

const ResultMessage = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin: 0 0 2rem 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const RestartButton = styled.button`
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
`;

export default QuizComponent;
