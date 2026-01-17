import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChallengesListPage from './pages/ChallengesListPage';
import ChallengePage from './pages/ChallengePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LearnPage from './pages/LearnPage';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
