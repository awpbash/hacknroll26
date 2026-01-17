import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCloud, FaTrophy, FaBook, FaCode, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  primary?: boolean;
}

const Nav = styled.nav`
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  padding: 16px 0;
  margin-bottom: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 50%;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover {
    color: var(--text-primary);

    &:after {
      width: 100%;
    }
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--accent-primary);
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Username = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const Button = styled.button<ButtonProps>`
  padding: 10px 20px;
  background: ${props => props.primary ?
    'var(--gradient-cyber)' :
    'var(--bg-tertiary)'};
  color: var(--text-primary);
  border: ${props => props.primary ? 'none' : '1px solid var(--border-color)'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: ${props => props.primary ? 'var(--glow-primary)' : 'var(--shadow-sm)'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? 'var(--glow-primary), var(--shadow-md)' : 'var(--shadow-md)'};
    background: ${props => props.primary ?
      'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))' :
      'var(--bg-hover)'};
  }
`;

// Auth Context Type (inferred from usage)
interface AuthContextType {
  user: {
    id: string | number;
    username: string;
    email: string;
    totalScore?: number;
    solvedCount?: number;
  } | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth() as AuthContextType;
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <FaCloud /> CloudCode
        </Logo>

        <NavLinks>
          <NavLink to="/challenges">
            <FaCode /> Challenges
          </NavLink>
          <NavLink to="/learn">
            <FaBook /> Learn
          </NavLink>
          <NavLink to="/leaderboard">
            <FaTrophy /> Leaderboard
          </NavLink>

          <ThemeToggle onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </ThemeToggle>

          {isAuthenticated ? (
            <UserInfo>
              <Username>{user?.username}</Username>
              <Button onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </Button>
            </UserInfo>
          ) : (
            <UserInfo>
              <Button onClick={() => navigate('/login')}>
                <FaSignInAlt /> Login
              </Button>
              <Button primary onClick={() => navigate('/register')}>
                <FaUserPlus /> Sign Up
              </Button>
            </UserInfo>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
