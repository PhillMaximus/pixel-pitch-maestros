
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, Plus, Users, Trophy, Copy } from 'lucide-react';
import { GameService } from '@/services/gameService';
import { useToast } from '@/components/ui/use-toast';
import { League } from '@/types/game';

interface LeagueCreationScreenProps {
  onBack: () => void;
  onLeagueCreated: () => void;
}

const LeagueCreationScreen = ({ onBack, onLeagueCreated }: LeagueCreationScreenProps) => {
  const { state } = useGame();
  const { toast } = useToast();
  const [leagueName, setLeagueName] = useState('');
  const [maxTeams, setMaxTeams] = useState(8);
  const [createdLeague, setCreatedLeague] = useState<League | null>(null);

  const handleCreateLeague = () => {
    if (!leagueName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para a liga",
        variant: "destructive",
      });
      return;
    }

    if (!state.user) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado",
        variant: "destructive",
      });
      return;
    }

    const newLeague = GameService.createLeague(leagueName, maxTeams, state.user.id);
    setCreatedLeague(newLeague);

    toast({
      title: "Liga Criada!",
      description: `Liga "${leagueName}" foi criada com sucesso`,
    });
  };

  const copyInviteCode = () => {
    if (createdLeague) {
      navigator.clipboard.writeText(createdLeague.inviteCode);
      toast({
        title: "Código Copiado!",
        description: "Código de convite copiado para a área de transferência",
      });
    }
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
                <Plus className="w-5 h-5 text-retro-green-dark" />
              </div>
              <h1 className="text-xl font-pixel font-bold">Criar Campeonato</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {!createdLeague ? (
            <Card className="bg-retro-gray-concrete border-retro-white-lines border-2">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Trophy className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Nova Liga Privada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-retro-white-lines font-pixel text-sm mb-2">
                    Nome da Liga
                  </label>
                  <Input
                    value={leagueName}
                    onChange={(e) => setLeagueName(e.target.value)}
                    placeholder="Ex: Liga dos Amigos"
                    className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel"
                  />
                </div>

                <div>
                  <label className="block text-retro-white-lines font-pixel text-sm mb-2">
                    Número Máximo de Times
                  </label>
                  <select
                    value={maxTeams}
                    onChange={(e) => setMaxTeams(Number(e.target.value))}
                    className="w-full bg-retro-gray-dark border border-retro-white-lines text-retro-white-lines font-pixel px-3 py-2 rounded-md"
                  >
                    <option value={4}>4 Times</option>
                    <option value={6}>6 Times</option>
                    <option value={8}>8 Times</option>
                    <option value={10}>10 Times</option>
                    <option value={12}>12 Times</option>
                  </select>
                </div>

                <div className="bg-retro-green-dark p-4 rounded-lg border border-retro-yellow-highlight">
                  <h3 className="font-pixel text-retro-yellow-highlight text-sm font-bold mb-2">
                    Informações da Liga
                  </h3>
                  <ul className="text-retro-white-lines font-pixel text-xs space-y-1">
                    <li>• Liga privada com código de convite</li>
                    <li>• Partidas programadas automaticamente</li>
                    <li>• Classificação em tempo real</li>
                    <li>• Temporada completa (ida e volta)</li>
                  </ul>
                </div>

                <Button
                  onClick={handleCreateLeague}
                  disabled={!leagueName.trim()}
                  className="w-full bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Criar Liga</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-retro-gray-concrete border-retro-white-lines border-2">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Trophy className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Liga Criada com Sucesso!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="bg-retro-green-dark p-6 rounded-lg border border-retro-yellow-highlight">
                    <h2 className="font-pixel text-retro-yellow-highlight text-lg font-bold mb-2">
                      {createdLeague.name}
                    </h2>
                    <p className="text-retro-white-lines font-pixel text-sm mb-4">
                      Temporada 2024 • Máximo {createdLeague.maxTeams} times
                    </p>
                    
                    <div className="bg-retro-yellow-highlight p-4 rounded-md">
                      <p className="text-retro-green-dark font-pixel text-xs font-bold mb-1">
                        CÓDIGO DE CONVITE
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-retro-green-dark font-pixel text-2xl font-bold">
                          {createdLeague.inviteCode}
                        </span>
                        <Button
                          onClick={copyInviteCode}
                          size="sm"
                          className="bg-retro-green-dark text-retro-white-lines hover:bg-retro-green-field"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-retro-blue-team p-4 rounded-lg">
                  <h3 className="font-pixel text-retro-white-lines text-sm font-bold mb-2">
                    Próximos Passos:
                  </h3>
                  <ul className="text-retro-white-lines font-pixel text-xs space-y-1">
                    <li>1. Compartilhe o código com seus amigos</li>
                    <li>2. Aguarde os jogadores entrarem na liga</li>
                    <li>3. As partidas começam automaticamente</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={onBack}
                    className="flex-1 bg-retro-gray-dark text-retro-white-lines hover:bg-gray-600 font-pixel"
                  >
                    <span>Voltar ao Menu</span>
                  </Button>
                  <Button
                    onClick={onLeagueCreated}
                    className="flex-1 bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
                  >
                    <span>Ir para o Jogo</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeagueCreationScreen;
