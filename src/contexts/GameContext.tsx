
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Club, League, Manager } from '@/types/game';
import { GameService } from '@/services/gameService';

interface GameState {
  user: User | null;
  availableClubs: Club[];
  currentLeague: League | null;
  availableLeagues: League[];
}

type GameAction = 
  | { type: 'LOGIN'; payload: { email: string; name: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_SCREEN'; payload: User['currentScreen'] }
  | { type: 'SELECT_CLUB'; payload: string }
  | { type: 'CREATE_LEAGUE'; payload: League }
  | { type: 'JOIN_LEAGUE'; payload: string }
  | { type: 'SET_AVAILABLE_LEAGUES'; payload: League[] };

const initialState: GameState = {
  user: null,
  availableClubs: [],
  currentLeague: null,
  availableLeagues: []
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: {
          id: Math.random().toString(36).substr(2, 9),
          email: action.payload.email,
          name: action.payload.name,
          currentScreen: 'home'
        },
        availableClubs: GameService.getAllClubs()
      };
    
    case 'LOGOUT':
      return initialState;
    
    case 'SET_SCREEN':
      return {
        ...state,
        user: state.user ? { ...state.user, currentScreen: action.payload } : null
      };
    
    case 'SELECT_CLUB':
      if (!state.user) return state;
      const selectedClub = state.availableClubs.find(club => club.id === action.payload);
      if (!selectedClub) return state;
      
      const manager = GameService.createManagerForUser(state.user.name, state.user.email, selectedClub.id);
      return {
        ...state,
        user: {
          ...state.user,
          manager,
          currentScreen: 'dashboard'
        }
      };
    
    case 'CREATE_LEAGUE':
      return {
        ...state,
        currentLeague: action.payload,
        availableLeagues: [...state.availableLeagues, action.payload]
      };
    
    case 'JOIN_LEAGUE':
      const league = state.availableLeagues.find(l => l.inviteCode === action.payload);
      return {
        ...state,
        currentLeague: league || state.currentLeague
      };
    
    case 'SET_AVAILABLE_LEAGUES':
      return {
        ...state,
        availableLeagues: action.payload
      };
    
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
