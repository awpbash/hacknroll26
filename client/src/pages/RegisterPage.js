import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
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
    border-color: var(--accent-success);
    box-shadow: var(--shadow-xl), var(--glow-success);
  }
`;

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 36px;
  text-align: center;
  background: linear-gradient(135deg, var(--accent-success), #059669);
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
    border-color: var(--accent-success);
    box-shadow: var(--glow-success);
    background: var(--bg-hover);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const Button = styled.button`
  padding: 16px;
  background: linear-gradient(135deg, var(--accent-success), #059669);
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
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
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
    color: var(--accent-success);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;

    &:hover {
      color: #059669;
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      navigate('/challenges');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <PageContainer>
      <FormCard>
        <Title>Create Account</Title>
        <Subtitle>Start solving cloud architecture challenges</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </FormGroup>

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
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </Form>

        <LinkText>
          Already have an account? <Link to="/login">Login here</Link>
        </LinkText>
      </FormCard>
    </PageContainer>
  );
};

export default RegisterPage;
