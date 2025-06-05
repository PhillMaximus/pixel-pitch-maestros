
import { GameProvider, useGame } from '@/contexts/GameContext';
import AuthScreen from '@/components/auth/AuthScreen';
import HomeScreen from '@/components/game/HomeScreen';
import ClubSelectionScreen from '@/components/game/ClubSelectionScreen';
import Dashboard from '@/components/game/Dashboard';
import LeagueCreationScreen from '@/components/game/LeagueCreationScreen';
import LeagueBrowserScreen from '@/components/game/LeagueBrowserScreen';
import LineupScreen from '@/components/game/LineupScreen';
import LeagueStandingsScreen from '@/components/game/LeagueStandingsScreen';
import { useState } from 'react';

type Screen = 'auth' | 'home' | 'club-selection' | 'dashboard' | 'league-creation' | 'league-browser' | 'lineup' | 'standings';

const GameApp = () => {
  const { state, dispatch, selectClub, refreshClub } = useGame();
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [selectedLeague, setSelectedLeague] = useState<{ id: string; name: string } | null>(null);

  // Loading screen
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl animate-pulse">
          Carregando Phillfoot Live Soccer...
        </div>
      </div>
    );
  }

  // Não logado - mostrar tela de auth
  if (!state.user) {
    return (
      <AuthScreen 
        onAuthSuccess={(user, hasManager) => {
          console.log('Auth success:', user, hasManager);
          if (hasManager && state.manager?.current_club_id) {
            // Usuário tem manager e clube - ir direto para dashboard
            setCurrentScreen('dashboard');
          } else if (hasManager) {
            // Usuário tem manager mas não tem clube - ir para seleção
            setCurrentScreen('club-selection');
          } else {
            // Usuário não tem manager - ir para home
            setCurrentScreen('home');
          }
        }}
      />
    );
  }

  // Logado mas sem manager - mostrar home
  if (!state.hasManager || !state.manager) {
    return (
      <HomeScreen 
        onNavigate={(screen) => {
          console.log('Navigating to:', screen);
          if (screen === 'dashboard') {
            setCurrentScreen('dashboard');
          } else if (screen === 'league-creation') {
            setCurrentScreen('league-creation');
          } else if (screen === 'league-browser') {
            setCurrentScreen('league-browser');
          } else if (screen === 'club-selection') {
            setCurrentScreen('club-selection');
          }
        }}
        onLogout={() => {
          console.log('Logging out');
          dispatch({ type: 'LOGOUT' });
          setCurrentScreen('auth');
        }}
      />
    );
  }

  // Tem manager mas não tem clube - mostrar seleção de clube
  if (!state.manager.current_club_id || !state.currentClub) {
    return (
      <ClubSelectionScreen 
        onBack={() => setCurrentScreen('home')}
        onSelectClub={async (clubId) => {
          console.log('Club selected in Index:', clubId);
          try {
            await selectClub(clubId);
            // Após seleção bem-sucedida, ir para dashboard
            setCurrentScreen('dashboard');
          } catch (error) {
            console.error('Error selecting club in Index:', error);
          }
        }}
        onLogout={() => {
          dispatch({ type: 'LOGOUT' });
          setCurrentScreen('auth');
        }}
      />
    );
  }

  // Navegação baseada na tela atual quando tudo está configurado
  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen 
          onNavigate={(screen) => {
            console.log('Navigating to:', screen);
            if (screen === 'dashboard') {
              setCurrentScreen('dashboard');
            } else if (screen === 'league-creation') {
              setCurrentScreen('league-creation');
            } else if (screen === 'league-browser') {
              setCurrentScreen('league-browser');
            } else if (screen === 'club-selection') {
              setCurrentScreen('club-selection');
            }
          }}
          onLogout={() => {
            console.log('Logging out');
            dispatch({ type: 'LOGOUT' });
            setCurrentScreen('auth');
          }}
        />
      );

    case 'dashboard':
      return (
        <Dashboard 
          onBack={() => setCurrentScreen('home')}
          onNavigateToLineup={() => setCurrentScreen('lineup')}
          onNavigateToStandings={(leagueId, leagueName) => {
            setSelectedLeague({ id: leagueId, name: leagueName });
            setCurrentScreen('standings');
          }}
          onRefreshClub={refreshClub}
        />
      );

    case 'lineup':
      return state.currentClub ? (
        <LineupScreen 
          clubId={state.currentClub.id}
          players={state.currentClub.players}
          formation={state.currentClub.formation}
          onBack={() => setCurrentScreen('dashboard')}
          onSave={() => {
            refreshClub();
            setCurrentScreen('dashboard');
          }}
        />
      ) : null;

    case 'standings':
      return selectedLeague ? (
        <LeagueStandingsScreen 
          leagueId={selectedLeague.id}
          leagueName={selectedLeague.name}
          onBack={() => setCurrentScreen('dashboard')}
        />
      ) : null;

    case 'league-creation':
      return (
        <LeagueCreationScreen 
          onBack={() => setCurrentScreen('home')}
          onLeagueCreated={() => setCurrentScreen('home')}
        />
      );

    case 'league-browser':
      return (
        <LeagueBrowserScreen 
          onBack={() => setCurrentScreen('home')}
          onLeagueJoined={() => setCurrentScreen('home')}
        />
      );

    case 'club-selection':
      return (
        <ClubSelectionScreen 
          onBack={() => setCurrentScreen('home')}
          onSelectClub={async (clubId) => {
            console.log('Club selected in switch:', clubId);
            try {
              await selectClub(clubId);
              setCurrentScreen('dashboard');
            } catch (error) {
              console.error('Error selecting club in switch:', error);
            }
          }}
          onLogout={() => {
            dispatch({ type: 'LOGOUT' });
            setCurrentScreen('auth');
          }}
        />
      );

    default:
      // Se tem manager e clube, mostrar dashboard por padrão
      return (
        <Dashboard 
          onBack={() => setCurrentScreen('home')}
          onNavigateToLineup={() => setCurrentScreen('lineup')}
          onNavigateToStandings={(leagueId, leagueName) => {
            setSelectedLeague({ id: leagueId, name: leagueName });
            setCurrentScreen('standings');
          }}
          onRefreshClub={refreshClub}
        />
      );
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
