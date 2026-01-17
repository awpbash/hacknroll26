import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChallengesListPage from './pages/ChallengesListPage';
import ChallengePage from './pages/ChallengePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LearnPage from './pages/LearnPage';
import QuestModePage from './pages/QuestModePage';
import GlobalStyles from './styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HeroUIProvider>
        <Router>
          <AuthProvider>
            <GlobalStyles />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/challenges" element={<ChallengesListPage />} />
              <Route path="/challenge/:id" element={<ChallengePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/quest" element={<QuestModePage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </HeroUIProvider>
    </ThemeProvider>
  );
};

export default App;
