
import { GameProvider, useGame } from '@/contexts/GameContext';
import AuthScreen from '@/components/auth/AuthScreen';
import HomeScreen from '@/components/game/HomeScreen';
import ClubSelectionScreen from '@/components/game/ClubSelectionScreen';
import Dashboard from '@/components/game/Dashboard';

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
      return <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl">
          Criação de Liga - Em Desenvolvimento
        </div>
      </div>;
    case 'league-browser':
      return <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl">
          Navegador de Ligas - Em Desenvolvimento
        </div>
      </div>;
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
