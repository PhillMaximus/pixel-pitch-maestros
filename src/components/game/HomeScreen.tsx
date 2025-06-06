import { Trophy, Users, Plus, Search, Settings, LogOut } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PixelBackground from '@/components/pixel/PixelBackground';
import PixelCard from '@/components/pixel/PixelCard';
import PixelButton from '@/components/pixel/PixelButton';
import BackgroundMusic from '@/components/audio/BackgroundMusic';
import SoccerFieldSprite from '@/components/retro/SoccerFieldSprite';
import PlayerSprite from '@/components/retro/PlayerSprite';

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
    <div className="min-h-screen relative">
      <PixelBackground type="stadium" />
      
      {/* Campo de futebol decorativo */}
      <div className="absolute top-20 left-10 opacity-20">
        <SoccerFieldSprite size="large" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <SoccerFieldSprite size="medium" />
      </div>
      
      {/* Jogadores decorativos */}
      <div className="absolute top-40 right-20 opacity-30">
        <PlayerSprite position="ATK" teamColor="#FF6B35" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-30">
        <PlayerSprite position="GK" teamColor="#4ECDC4" />
      </div>
      
      <div className="bg-retro-green-dark/95 text-retro-white-lines border-b-4 border-retro-yellow-highlight relative z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-retro-yellow-highlight rounded-lg flex items-center justify-center animate-pixel-bounce">
              <Trophy className="w-6 h-6 text-retro-green-dark" />
            </div>
            <div>
              <h1 className="text-xl font-pixel font-bold">Phillfoot Live Soccer</h1>
              <p className="text-sm text-retro-yellow-highlight">
                Bem-vindo, {state.user?.user_metadata?.name || state.user?.email}!
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <BackgroundMusic className="mr-4" volume={0.3} autoPlay={true} />
            
            <PixelButton
              onClick={onLogout}
              variant="danger"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sair</span>
            </PixelButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-pixel font-bold text-retro-white-lines mb-2 drop-shadow-lg">
              ⚽ Painel Principal ⚽
            </h2>
            <p className="text-retro-white-lines opacity-90 font-pixel drop-shadow-md">
              Escolha uma opção para continuar sua jornada como treinador
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PixelCard className="hover:border-retro-yellow-highlight transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Users className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Entrar no Jogo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-retro-white-lines opacity-80 font-pixel text-sm">
                      {state.manager ? 
                        '🎮 Continue gerenciando seu clube' : 
                        '🏆 Escolha um clube e comece sua carreira'
                      }
                    </p>
                  </div>
                  <PlayerSprite position="MID" size="small" />
                </div>
                <PixelButton
                  onClick={handleGameEntry}
                  variant="primary"
                  className="w-full"
                >
                  {state.manager ? '⚡ Continuar Jogo' : '🎯 Escolher Clube'}
                </PixelButton>
              </CardContent>
            </PixelCard>

            <PixelCard className="hover:border-retro-yellow-highlight transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Plus className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Criar Campeonato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-retro-white-lines opacity-80 font-pixel text-sm">
                      🏟️ Crie uma liga privada e convide seus amigos para jogar
                    </p>
                  </div>
                  <SoccerFieldSprite size="small" />
                </div>
                <PixelButton
                  onClick={() => onNavigate('league-creation')}
                  variant="success"
                  className="w-full"
                >
                  🚀 Criar Liga
                </PixelButton>
              </CardContent>
            </PixelCard>

            <PixelCard className="hover:border-retro-yellow-highlight transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Search className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Campeonatos Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-retro-white-lines opacity-80 font-pixel text-sm">
                      🔍 Encontre e participe de campeonatos criados por outros jogadores
                    </p>
                  </div>
                  <PlayerSprite position="ATK" size="small" teamColor="#F44336" />
                </div>
                <PixelButton
                  onClick={() => onNavigate('league-browser')}
                  variant="secondary"
                  className="w-full"
                >
                  🌐 Buscar Ligas
                </PixelButton>
              </CardContent>
            </PixelCard>

            <PixelCard className="hover:border-retro-yellow-highlight transition-all">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-retro-white-lines opacity-80 font-pixel text-sm">
                      ⚙️ Ajuste suas preferências e configurações da conta
                    </p>
                  </div>
                  <PlayerSprite position="GK" size="small" teamColor="#FF9800" />
                </div>
                <PixelButton
                  variant="secondary"
                  className="w-full opacity-60"
                  disabled
                >
                  🔧 Em Breve
                </PixelButton>
              </CardContent>
            </PixelCard>
          </div>

          {/* Seção de estatísticas do treinador */}
          {state.manager && (
            <div className="mt-8">
              <PixelCard variant="highlight" className="text-center">
                <CardHeader>
                  <CardTitle className="font-pixel text-xl">
                    📊 Perfil do Treinador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="font-pixel text-sm opacity-80">Nível</p>
                      <p className="font-pixel text-lg font-bold">{state.manager.level}</p>
                    </div>
                    <div>
                      <p className="font-pixel text-sm opacity-80">Experiência</p>
                      <p className="font-pixel text-lg font-bold">{state.manager.experience}</p>
                    </div>
                    <div>
                      <p className="font-pixel text-sm opacity-80">Reputação</p>
                      <p className="font-pixel text-lg font-bold">{state.manager.reputation}</p>
                    </div>
                    <div>
                      <p className="font-pixel text-sm opacity-80">Salário</p>
                      <p className="font-pixel text-lg font-bold">€{state.manager.salary.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </PixelCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
