import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';

const glow = keyframes`
  0%, 100% { box-shadow: var(--glow-primary); }
  50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 20px;
`;

const FormCard = styled.div`
  background: var(--bg-secondary);
  padding: 48px;
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 450px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-xl), var(--glow-primary);
  }
`;

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 36px;
  text-align: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0 0 36px 0;
  color: var(--text-secondary);
  text-align: center;
  font-size: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 14px;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-primary);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: var(--glow-primary);
    background: var(--bg-hover);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const Button = styled.button`
  padding: 16px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 12px;
  animation: ${glow} 3s ease-in-out infinite;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
  }

  &:disabled {
    background: var(--bg-tertiary);
    cursor: not-allowed;
    animation: none;
    color: var(--text-muted);
  }
`;

const ErrorMessage = styled.div`
  padding: 14px;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid var(--accent-error);
  border-radius: 8px;
  color: var(--accent-error);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "⚠";
    font-size: 18px;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 24px;
  color: var(--text-secondary);
  font-size: 14px;

  a {
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;

    &:hover {
      color: var(--accent-secondary);
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/challenges');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <PageContainer>
      <FormCard>
        <Title>Welcome Back</Title>
        <Subtitle>Login to continue solving challenges</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <LinkText>
          Don't have an account? <Link to="/register">Register here</Link>
        </LinkText>
      </FormCard>
    </PageContainer>
  );
};

export default LoginPage;
