import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { Trophy, Users, Plus, Search, Settings, LogOut } from 'lucide-react';

const HomeScreen = ({ onNavigate, onLogout }: { 
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}) => {
  const { state } = useGame();

  const handleGameEntry = () => {
    if (state.manager?.current_club_id) {
      onNavigate('dashboard');
    } else {
      onNavigate('club-selection');
    }
  };

  return (
    <div className="min-h-screen bg-retro-green-field">
      <div className="bg-retro-green-dark text-retro-white-lines border-b-4 border-retro-yellow-highlight">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-retro-yellow-highlight rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-retro-green-dark" />
            </div>
            <div>
              <h1 className="text-xl font-pixel font-bold">Football Manager Retrô</h1>
              <p className="text-sm text-retro-yellow-highlight">
                Bem-vindo, {state.user?.user_metadata?.name || state.user?.email}!
              </p>
            </div>
          </div>
          
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-retro-white-lines text-retro-white-lines hover:bg-retro-white-lines hover:text-retro-green-dark font-pixel"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sair</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-pixel font-bold text-retro-white-lines mb-2">
              Painel Principal
            </h2>
            <p className="text-retro-white-lines opacity-80 font-pixel">
              Escolha uma opção para continuar sua jornada como treinador
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-retro-gray-concrete border-retro-white-lines border-2 hover:border-retro-yellow-highlight transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Users className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Entrar no Jogo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-retro-white-lines opacity-80 font-pixel text-sm mb-4">
                  {state.user?.manager ? 
                    'Continue gerenciando seu clube' : 
                    'Escolha um clube e comece sua carreira'
                  }
                </p>
                <Button
                  onClick={handleGameEntry}
                  className="w-full bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
                >
                  {state.user?.manager ? 'Continuar Jogo' : 'Escolher Clube'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-retro-gray-concrete border-retro-white-lines border-2 hover:border-retro-yellow-highlight transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Plus className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Criar Campeonato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-retro-white-lines opacity-80 font-pixel text-sm mb-4">
                  Crie uma liga privada e convide seus amigos para jogar
                </p>
                <Button
                  onClick={() => onNavigate('league-creation')}
                  className="w-full bg-retro-green-field text-retro-white-lines hover:bg-green-600 font-pixel"
                >
                  Criar Liga
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-retro-gray-concrete border-retro-white-lines border-2 hover:border-retro-yellow-highlight transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Search className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Campeonatos Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-retro-white-lines opacity-80 font-pixel text-sm mb-4">
                  Encontre e participe de campeonatos criados por outros jogadores
                </p>
                <Button
                  onClick={() => onNavigate('league-browser')}
                  className="w-full bg-retro-blue-team text-retro-white-lines hover:bg-blue-600 font-pixel"
                >
                  Buscar Ligas
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-retro-gray-concrete border-retro-white-lines border-2 hover:border-retro-yellow-highlight transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-retro-white-lines opacity-80 font-pixel text-sm mb-4">
                  Ajuste suas preferências e configurações da conta
                </p>
                <Button
                  className="w-full bg-retro-gray-dark text-retro-white-lines hover:bg-gray-600 font-pixel"
                  disabled
                >
                  Em Breve
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
