import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import EssayPage from './components/EssayPage';
import ResultsPage from './components/ResultsPage';
import Navbar from './components/Navbar';
import { UserAttempt } from './types';

function App() {
  const [currentResults, setCurrentResults] = useState<UserAttempt | null>(null);

  const handleShowResults = (results: UserAttempt) => {
    setCurrentResults(results);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/essay/:id" element={<EssayPage onShowResults={handleShowResults} />} />
          <Route path="/results" element={
            currentResults ? 
            <ResultsPage results={currentResults} /> : 
            <Navigate to="/" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;