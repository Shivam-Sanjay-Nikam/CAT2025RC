import React, { useState } from 'react';
import HomePage from './components/HomePage';
import EssayPage from './components/EssayPage';
import ResultsPage from './components/ResultsPage';
import { UserAttempt } from './types';

type View = 'home' | 'essay' | 'results';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedEssayId, setSelectedEssayId] = useState<string>('');
  const [currentResults, setCurrentResults] = useState<UserAttempt | null>(null);

  const handleSelectEssay = (essayId: string) => {
    setSelectedEssayId(essayId);
    setCurrentView('essay');
  };

  const handleBackHome = () => {
    setCurrentView('home');
    setSelectedEssayId('');
    setCurrentResults(null);
  };

  const handleShowResults = (results: UserAttempt) => {
    setCurrentResults(results);
    setCurrentView('results');
  };

  const handleRetakeTest = () => {
    setCurrentView('essay');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'home' && (
        <HomePage onSelectEssay={handleSelectEssay} />
      )}
      
      {currentView === 'essay' && selectedEssayId && (
        <EssayPage
          essayId={selectedEssayId}
          onBack={handleBackHome}
          onShowResults={handleShowResults}
        />
      )}
      
      {currentView === 'results' && currentResults && (
        <ResultsPage
          results={currentResults}
          onBack={handleBackHome}
          onRetakeTest={handleRetakeTest}
        />
      )}
    </div>
  );
}

export default App;