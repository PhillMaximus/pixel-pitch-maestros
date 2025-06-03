
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, Club, League, Manager } from '@/types/game';
import { AuthService, Manager as AuthManager } from '@/services/authService';
import { SupabaseGameService } from '@/services/supabaseGameService';
import { supabase } from '@/integrations/supabase/client';

interface GameState {
  user: SupabaseUser | null;
  manager: AuthManager | null;
  currentClub: Club | null;
  currentLeague: League | null;
  availableLeagues: League[];
  isLoading: boolean;
  hasManager: boolean;
}

type GameAction = 
  | { type: 'SET_USER'; payload: { user: SupabaseUser | null; manager: AuthManager | null } }
  | { type: 'SET_MANAGER'; payload: AuthManager }
  | { type: 'SET_CLUB'; payload: Club | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'SET_SCREEN'; payload: string }
  | { type: 'JOIN_LEAGUE'; payload: string }
  | { type: 'CREATE_LEAGUE'; payload: League };

const initialState: GameState = {
  user: null,
  manager: null,
  currentClub: null,
  currentLeague: null,
  availableLeagues: [],
  isLoading: true,
  hasManager: false
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        manager: action.payload.manager,
        hasManager: !!action.payload.manager,
        isLoading: false
      };
    
    case 'SET_MANAGER':
      return {
        ...state,
        manager: action.payload,
        hasManager: true
      };
      
    case 'SET_CLUB':
      return {
        ...state,
        currentClub: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      };

    case 'SET_SCREEN':
      // For navigation - handled by parent component
      return state;

    case 'JOIN_LEAGUE':
      // For joining leagues - handled by parent component
      return state;

    case 'CREATE_LEAGUE':
      // For creating leagues - handled by parent component
      return state;
    
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  selectClub: (clubId: string) => Promise<void>;
  refreshClub: () => Promise<void>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  useEffect(() => {
    // Verificar se já existe um usuário logado
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const manager = await AuthService.getManagerByUserId(session.user.id);
          dispatch({ 
            type: 'SET_USER', 
            payload: { user: session.user, manager } 
          });
          
          // Se tem manager e clube, carregar o clube
          if (manager?.current_club_id) {
            const club = await SupabaseGameService.getClubById(manager.current_club_id);
            dispatch({ type: 'SET_CLUB', payload: club });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const manager = await AuthService.getManagerByUserId(session.user.id);
          dispatch({ 
            type: 'SET_USER', 
            payload: { user: session.user, manager } 
          });
          
          if (manager?.current_club_id) {
            const club = await SupabaseGameService.getClubById(manager.current_club_id);
            dispatch({ type: 'SET_CLUB', payload: club });
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'LOGOUT' });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const selectClub = async (clubId: string) => {
    try {
      if (!state.manager) return;
      
      // Atualizar o manager com o clube escolhido
      await AuthService.updateManager(state.manager.id, { 
        current_club_id: clubId 
      });
      
      // Carregar dados do clube
      const club = await SupabaseGameService.getClubById(clubId);
      dispatch({ type: 'SET_CLUB', payload: club });
      
      // Atualizar manager no estado
      const updatedManager = { ...state.manager, current_club_id: clubId };
      dispatch({ type: 'SET_MANAGER', payload: updatedManager });
      
    } catch (error) {
      console.error('Erro ao selecionar clube:', error);
    }
  };

  const refreshClub = async () => {
    try {
      if (!state.manager?.current_club_id) return;
      
      const club = await SupabaseGameService.getClubById(state.manager.current_club_id);
      dispatch({ type: 'SET_CLUB', payload: club });
    } catch (error) {
      console.error('Erro ao atualizar clube:', error);
    }
  };
  
  return (
    <GameContext.Provider value={{ state, dispatch, selectClub, refreshClub }}>
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
