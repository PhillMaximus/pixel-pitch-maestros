
import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { supabaseGameService } from '@/services/supabaseGameService';
import { League } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Trophy, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import PixelCard from '@/components/pixel/PixelCard';
import PixelButton from '@/components/pixel/PixelButton';
import PixelBackground from '@/components/pixel/PixelBackground';

interface LeagueBrowserScreenProps {
  onBack: () => void;
  onLeagueJoined: () => void;
}

const LeagueBrowserScreen = ({ onBack, onLeagueJoined }: LeagueBrowserScreenProps) => {
  const { state, dispatch } = useGame();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningLeague, setJoiningLeague] = useState<string | null>(null);

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      setLoading(true);
      const availableLeagues = await supabaseGameService.getAvailableLeagues();
      setLeagues(availableLeagues);
    } catch (error) {
      console.error('Erro ao carregar ligas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as ligas disponíveis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = async (leagueId: string) => {
    if (!state.currentClub) {
      toast({
        title: "Erro",
        description: "Você precisa ter um clube para participar de uma liga",
        variant: "destructive",
      });
      return;
    }

    try {
      setJoiningLeague(leagueId);
      await supabaseGameService.joinLeague(leagueId, state.currentClub.id);
      
      toast({
        title: "Sucesso!",
        description: "Você entrou na liga com sucesso!",
      });
      
      onLeagueJoined();
    } catch (error) {
      console.error('Erro ao entrar na liga:', error);
      toast({
        title: "Erro",
        description: "Não foi possível entrar na liga",
        variant: "destructive",
      });
    } finally {
      setJoiningLeague(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <PixelBackground type="stadium" />
        <div className="min-h-screen bg-retro-green-field/95 flex items-center justify-center">
          <div className="text-retro-white-lines font-pixel text-xl animate-pulse">
            Carregando ligas disponíveis...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <PixelBackground type="stadium" />
      
      <div className="bg-retro-green-dark/95 text-retro-white-lines border-b-4 border-retro-yellow-highlight relative z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <PixelButton onClick={onBack} size="sm" variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </PixelButton>
            <div>
              <h1 className="text-xl font-pixel font-bold">🔍 Ligas Disponíveis</h1>
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
            <h2 className="text-3xl font-pixel font-bold text-retro-white-lines mb-2 drop-shadow-lg">
              🏆 Campeonatos Públicos
            </h2>
            <p className="text-retro-white-lines opacity-90 font-pixel drop-shadow-md">
              Escolha uma liga para participar com seu clube
            </p>
          </div>

          {leagues.length === 0 ? (
            <PixelCard className="text-center">
              <CardContent className="py-8">
                <Trophy className="w-16 h-16 text-retro-yellow-highlight mx-auto mb-4 opacity-50" />
                <h3 className="font-pixel text-xl text-retro-white-lines mb-2">
                  Nenhuma liga disponível
                </h3>
                <p className="text-retro-white-lines opacity-80 font-pixel text-sm mb-4">
                  Não há ligas públicas disponíveis no momento.
                </p>
                <PixelButton onClick={onBack} variant="primary">
                  Voltar ao Menu
                </PixelButton>
              </CardContent>
            </PixelCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leagues.map((league) => (
                <PixelCard key={league.id} className="hover:border-retro-yellow-highlight transition-all">
                  <CardHeader>
                    <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                      <Trophy className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                      {league.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-pixel">
                        <span className="text-retro-white-lines opacity-80 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Times:
                        </span>
                        <span className="text-retro-yellow-highlight">
                          {league.current_teams}/{league.max_teams}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm font-pixel">
                        <span className="text-retro-white-lines opacity-80 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Temporada:
                        </span>
                        <span className="text-retro-yellow-highlight">
                          {league.season}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm font-pixel">
                        <span className="text-retro-white-lines opacity-80">Status:</span>
                        <span className={`
                          ${league.status === 'active' ? 'text-green-400' : 
                            league.status === 'waiting' ? 'text-yellow-400' : 'text-red-400'}
                        `}>
                          {league.status === 'active' ? '🟢 Ativa' : 
                           league.status === 'waiting' ? '🟡 Aguardando' : '🔴 Finalizada'}
                        </span>
                      </div>

                      <div className="pt-4">
                        <PixelButton
                          onClick={() => handleJoinLeague(league.id)}
                          disabled={
                            league.current_teams >= league.max_teams || 
                            league.status !== 'waiting' ||
                            joiningLeague === league.id
                          }
                          variant={league.current_teams >= league.max_teams ? "secondary" : "success"}
                          className="w-full"
                        >
                          {joiningLeague === league.id ? (
                            '⏳ Entrando...'
                          ) : league.current_teams >= league.max_teams ? (
                            '❌ Liga Completa'
                          ) : league.status !== 'waiting' ? (
                            '🚫 Liga Fechada'
                          ) : (
                            '✅ Participar'
                          )}
                        </PixelButton>
                      </div>
                    </div>
                  </CardContent>
                </PixelCard>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <PixelButton onClick={loadLeagues} variant="secondary">
              🔄 Atualizar Lista
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueBrowserScreen;
