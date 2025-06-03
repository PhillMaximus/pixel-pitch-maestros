import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Trophy, Calendar } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { League } from '@/types/game';
import { SupabaseGameService } from '@/services/supabaseGameService';
import PixelBackground from '@/components/pixel/PixelBackground';
import PixelCard from '@/components/pixel/PixelCard';
import PixelButton from '@/components/pixel/PixelButton';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeagueBrowserScreenProps {
  onBack: () => void;
  onLeagueJoined: () => void;
}

const LeagueBrowserScreen = ({ onBack, onLeagueJoined }: LeagueBrowserScreenProps) => {
  const { state, dispatch } = useGame();
  const [availableLeagues, setAvailableLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningLeague, setJoiningLeague] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableLeagues();
  }, []);

  const loadAvailableLeagues = async () => {
    try {
      const leagues = await SupabaseGameService.getAvailableLeagues();
      setAvailableLeagues(leagues);
    } catch (error) {
      console.error('Erro ao carregar ligas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = async (leagueId: string) => {
    if (!state.currentClub || !state.manager) return;
    
    setJoiningLeague(leagueId);
    try {
      await SupabaseGameService.joinLeague(leagueId, state.currentClub.id, state.manager.id);
      dispatch({ type: 'JOIN_LEAGUE', payload: leagueId });
      onLeagueJoined();
    } catch (error) {
      console.error('Erro ao entrar na liga:', error);
    } finally {
      setJoiningLeague(null);
    }
  };

  const getLeagueStatus = (league: League) => {
    if (league.status === 'recruiting') {
      return {
        text: 'Recrutando',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20'
      };
    } else if (league.status === 'active') {
      return {
        text: 'Em Andamento',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20'
      };
    } else {
      return {
        text: 'Finalizada',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20'
      };
    }
  };

  const canJoinLeague = (league: League) => {
    return league.status === 'recruiting' && league.currentTeams < league.maxTeams;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl animate-pulse">
          Carregando ligas disponíveis...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <PixelBackground type="stadium" />
      
      <div className="bg-retro-green-dark/95 text-retro-white-lines border-b-4 border-retro-yellow-highlight relative z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <PixelButton
              onClick={onBack}
              variant="secondary"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Voltar</span>
            </PixelButton>
            <div>
              <h1 className="text-xl font-pixel font-bold">Ligas Disponíveis</h1>
              <p className="text-sm text-retro-yellow-highlight">
                Encontre e participe de campeonatos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-pixel font-bold text-retro-white-lines mb-2 drop-shadow-lg">
              🏆 Campeonatos Abertos
            </h2>
            <p className="text-retro-white-lines opacity-80 font-pixel drop-shadow-md">
              Escolha uma liga para participar com seu clube
            </p>
          </div>

          {availableLeagues.length === 0 ? (
            <PixelCard className="text-center">
              <CardContent className="py-8">
                <Trophy className="w-16 h-16 text-retro-yellow-highlight mx-auto mb-4 opacity-50" />
                <p className="font-pixel text-retro-white-lines text-lg mb-2">
                  Nenhuma liga disponível
                </p>
                <p className="font-pixel text-retro-white-lines opacity-80 text-sm">
                  Que tal criar a primeira liga?
                </p>
              </CardContent>
            </PixelCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableLeagues.map((league) => {
                const status = getLeagueStatus(league);
                const joinable = canJoinLeague(league);
                
                return (
                  <PixelCard key={league.id} className="hover:border-retro-yellow-highlight transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-pixel text-retro-white-lines">
                          {league.name}
                        </CardTitle>
                        <div className={`px-2 py-1 rounded-full text-xs font-pixel ${status.bgColor} ${status.color}`}>
                          {status.text}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-retro-yellow-highlight mr-2" />
                          <div>
                            <p className="text-retro-white-lines opacity-80 font-pixel text-xs">Times</p>
                            <p className="font-pixel text-retro-white-lines">
                              {league.currentTeams}/{league.maxTeams}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-retro-yellow-highlight mr-2" />
                          <div>
                            <p className="text-retro-white-lines opacity-80 font-pixel text-xs">Temporada</p>
                            <p className="font-pixel text-retro-white-lines">{league.season}</p>
                          </div>
                        </div>
                      </div>
                      
                      <PixelButton
                        onClick={() => handleJoinLeague(league.id)}
                        disabled={!joinable || joiningLeague === league.id}
                        variant={joinable ? "success" : "secondary"}
                        className="w-full"
                      >
                        {joiningLeague === league.id ? (
                          '⏳ Entrando...'
                        ) : joinable ? (
                          '🚀 Entrar na Liga'
                        ) : league.currentTeams >= league.maxTeams ? (
                          '🔒 Liga Cheia'
                        ) : (
                          '⏸️ Liga Fechada'
                        )}
                      </PixelButton>
                    </CardContent>
                  </PixelCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeagueBrowserScreen;
