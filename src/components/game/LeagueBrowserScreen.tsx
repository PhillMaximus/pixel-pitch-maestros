
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, Search, Users, Trophy, Clock, UserPlus } from 'lucide-react';
import { GameService } from '@/services/gameService';
import { useToast } from '@/components/ui/use-toast';

interface LeagueBrowserScreenProps {
  onBack: () => void;
  onLeagueJoined: () => void;
}

const LeagueBrowserScreen = ({ onBack, onLeagueJoined }: LeagueBrowserScreenProps) => {
  const { state } = useGame();
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState('');
  const [availableLeagues] = useState(GameService.getAvailableLeagues());

  const handleJoinByCode = () => {
    if (!inviteCode.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um código de convite",
        variant: "destructive",
      });
      return;
    }

    const league = GameService.getLeagueByInviteCode(inviteCode.toUpperCase());
    if (!league) {
      toast({
        title: "Liga não encontrada",
        description: "Código de convite inválido ou liga não existe",
        variant: "destructive",
      });
      return;
    }

    if (league.teams.length >= league.maxTeams) {
      toast({
        title: "Liga lotada",
        description: "Esta liga já atingiu o número máximo de participantes",
        variant: "destructive",
      });
      return;
    }

    onLeagueJoined();
    toast({
      title: "Liga encontrada!",
      description: `Você entrou na liga "${league.name}"`,
    });
  };

  const handleJoinLeague = (leagueId: string) => {
    const league = availableLeagues.find(l => l.id === leagueId);
    if (!league) return;

    if (league.teams.length >= league.maxTeams) {
      toast({
        title: "Liga lotada",
        description: "Esta liga já atingiu o número máximo de participantes",
        variant: "destructive",
      });
      return;
    }

    onLeagueJoined();
    toast({
      title: "Entrou na liga!",
      description: `Você entrou na liga "${league.name}"`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-retro-green-field">
      <div className="bg-retro-green-dark text-retro-white-lines border-b-4 border-retro-yellow-highlight">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-retro-white-lines text-retro-white-lines hover:bg-retro-white-lines hover:text-retro-green-dark font-pixel"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Voltar</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-retro-yellow-highlight rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-retro-green-dark" />
              </div>
              <h1 className="text-xl font-pixel font-bold">Buscar Ligas</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Buscar por código */}
          <Card className="bg-retro-gray-concrete border-retro-white-lines border-2">
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                <UserPlus className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                Entrar com Código de Convite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-3">
                <Input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Digite o código (ex: ABC123)"
                  className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel"
                  maxLength={6}
                />
                <Button
                  onClick={handleJoinByCode}
                  disabled={!inviteCode.trim()}
                  className="bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span>Buscar</span>
                </Button>
              </div>
              <p className="text-retro-white-lines opacity-80 font-pixel text-xs">
                Insira o código de 6 caracteres fornecido pelo criador da liga
              </p>
            </CardContent>
          </Card>

          {/* Ligas disponíveis */}
          <div>
            <h2 className="text-xl font-pixel font-bold text-retro-white-lines mb-4">
              Ligas Disponíveis
            </h2>
            
            {availableLeagues.length === 0 ? (
              <Card className="bg-retro-gray-concrete border-retro-white-lines border-2">
                <CardContent className="py-12 text-center">
                  <Trophy className="w-12 h-12 text-retro-yellow-highlight mx-auto mb-4 opacity-50" />
                  <p className="text-retro-white-lines font-pixel text-lg">
                    Nenhuma liga disponível no momento
                  </p>
                  <p className="text-retro-white-lines opacity-80 font-pixel text-sm mt-2">
                    Crie uma nova liga ou peça o código para um amigo
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableLeagues.map((league) => (
                  <Card 
                    key={league.id}
                    className="bg-retro-gray-concrete border-retro-white-lines border-2 hover:border-retro-yellow-highlight transition-colors"
                  >
                    <CardHeader>
                      <CardTitle className="font-pixel text-retro-white-lines flex items-center justify-between">
                        <div className="flex items-center">
                          <Trophy className="w-5 h-5 mr-2 text-retro-yellow-highlight" />
                          {league.name}
                        </div>
                        <span className="text-xs bg-retro-yellow-highlight text-retro-green-dark px-2 py-1 rounded">
                          {league.season}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-retro-white-lines font-pixel text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-retro-yellow-highlight" />
                          <span>{league.teams.length}/{league.maxTeams} times</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-retro-yellow-highlight" />
                          <span>Rodada {league.currentRound}</span>
                        </div>
                      </div>
                      
                      <div className="bg-retro-green-dark p-3 rounded border border-retro-yellow-highlight">
                        <p className="text-retro-white-lines font-pixel text-xs">
                          <strong className="text-retro-yellow-highlight">Próxima rodada:</strong><br />
                          {formatDate(league.nextMatchDate)}
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => handleJoinLeague(league.id)}
                        disabled={league.teams.length >= league.maxTeams}
                        className="w-full bg-retro-blue-team text-retro-white-lines hover:bg-blue-600 font-pixel disabled:opacity-50"
                      >
                        <span>{league.teams.length >= league.maxTeams ? 'Liga Lotada' : 'Entrar na Liga'}</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueBrowserScreen;
