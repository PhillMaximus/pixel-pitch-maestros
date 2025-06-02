
import { GameProvider, useGame } from '@/contexts/GameContext';
import AuthScreen from '@/components/auth/AuthScreen';
import HomeScreen from '@/components/game/HomeScreen';
import ClubSelectionScreen from '@/components/game/ClubSelectionScreen';
import Dashboard from '@/components/game/Dashboard';
import LeagueCreationScreen from '@/components/game/LeagueCreationScreen';
import LeagueBrowserScreen from '@/components/game/LeagueBrowserScreen';

const GameApp = () => {
  const { state } = useGame();

  if (!state.user) {
    return <AuthScreen />;
  }

  switch (state.user.currentScreen) {
    case 'home':
      return <HomeScreen />;
    case 'club-selection':
      return <ClubSelectionScreen />;
    case 'dashboard':
      return <Dashboard />;
    case 'league-creation':
      return <LeagueCreationScreen />;
    case 'league-browser':
      return <LeagueBrowserScreen />;
    default:
      return <HomeScreen />;
  }
};

const Index = () => {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
};

export default Index;
