import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { HomePage } from './components/screens/HomePage';
import { LoginPage } from './components/screens/LoginPage';
import { GameSelectionPage } from './components/screens/GameSelectionPage';
import { TronGamePage } from './components/screens/TronGamePage';
import { RulesPage } from './components/screens/RulesPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Screen, User, GameMode } from './types';
import { useBackgroundMusic } from './hooks/useBackgroundMusic'; 
import { AuthProvider } from './hooks/useAuth';

const BACKGROUND_MUSIC = '/audio/base.mp3';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [user, setUser] = useLocalStorage<User | null>('tronKidsUser', null);
  const [gameMode, setGameMode] = useState<GameMode>('local');

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentScreen('game');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  // Set guest user when playing as guest
  const handleGuestMode = () => {
    if (!user) {
      setUser({
        name: 'Invitado',
        email: '',
        age: 10,
        isGuest: true
      });
    }
  };

  useBackgroundMusic(BACKGROUND_MUSIC);
  // Ensure guest user is set when accessing game selection without login
  React.useEffect(() => {
    if (currentScreen === 'gameSelection' && !user) {
      handleGuestMode();
    }
  }, [currentScreen, user]);

  return (
    <AuthProvider> 
    <div className="min-h-screen bg-gray-900">
      {currentScreen !== 'home' && (
        <Header 
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          userName={user?.name}
        />
      )}
      
      {currentScreen === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}
      
      {currentScreen === 'login' && (
        <LoginPage 
          onNavigate={handleNavigate}
          onLogin={handleLogin}
        />
      )}
      
      {currentScreen === 'gameSelection' && (
        <GameSelectionPage 
          onNavigate={handleNavigate}
          onStartGame={handleStartGame}
        />
      )}
      
      {currentScreen === 'game' && (
        <TronGamePage 
          onNavigate={handleNavigate}
          gameMode={gameMode}
        />
      )}
      
      {currentScreen === 'rules' && (
        <RulesPage onNavigate={handleNavigate} />
      )}
    </div>
     </AuthProvider>
  );
}

export default App;