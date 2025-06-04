
import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Users, DollarSign, LogOut } from 'lucide-react';
import { Club } from '@/types/game';
import { gameService } from '@/services/gameService';
import PixelBackground from '@/components/pixel/PixelBackground';
import PixelCard from '@/components/pixel/PixelCard';
import PixelButton from '@/components/pixel/PixelButton';
import BackgroundMusic from '@/components/audio/BackgroundMusic';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ClubSelectionScreenProps {
  onBack: () => void;
  onSelectClub: (clubId: string) => void;
  onLogout: () => void;
}

const ClubSelectionScreen = ({ onBack, onSelectClub, onLogout }: ClubSelectionScreenProps) => {
  const [availableClubs, setAvailableClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableClubs();
  }, []);

  const loadAvailableClubs = async () => {
    try {
      console.log('Loading available clubs...');
      const clubs = await gameService.getAvailableClubs();
      console.log('Clubs loaded:', clubs);
      
      // Filtrar apenas clubes com pelo menos 20 jogadores
      const clubsWithEnoughPlayers = clubs.filter(club => club.players.length >= 20);
      console.log('Clubs with enough players:', clubsWithEnoughPlayers);
      
      setAvailableClubs(clubsWithEnoughPlayers);
    } catch (error) {
      console.error('Erro ao carregar clubes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clubes disponíveis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClub = async (clubId: string) => {
    console.log('Selecting club:', clubId);
    setSelecting(clubId);
    
    try {
      toast({
        title: "Sucesso!",
        description: "Clube selecionado com sucesso",
      });

      // Call the parent callback
      onSelectClub(clubId);
    } catch (error) {
      console.error('Erro ao selecionar clube:', error);
      toast({
        title: "Erro",
        description: "Erro ao selecionar clube. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl animate-pulse">
          Carregando clubes disponíveis...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <PixelBackground type="stadium" />
      
      <div className="bg-retro-green-dark/95 text-retro-white-lines border-b-4 border-retro-yellow-highlight relative z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-pixel font-bold">Escolha seu Clube</h1>
                <p className="text-sm text-retro-yellow-highlight">
                  Comece sua carreira como treinador
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <BackgroundMusic className="mr-4" volume={0.2} autoPlay={true} />
              
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
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-pixel font-bold text-retro-white-lines mb-2 drop-shadow-lg">
              Clubes Disponíveis
            </h2>
            <p className="text-retro-white-lines opacity-80 font-pixel drop-shadow-md">
              Escolha um clube pequeno e construa sua reputação como treinador
            </p>
          </div>

          {availableClubs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-retro-white-lines font-pixel text-lg">
                Nenhum clube disponível no momento.
              </p>
              <p className="text-retro-white-lines opacity-80 font-pixel text-sm mt-2">
                Todos os clubes precisam ter pelo menos 20 jogadores.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableClubs.map((club) => (
                <PixelCard 
                  key={club.id} 
                  className="hover:border-retro-yellow-highlight transition-colors border-2"
                  style={{ borderColor: club.primaryColor || '#4CAF50' }}
                >
                  <CardHeader 
                    className="text-center"
                    style={{ 
                      backgroundColor: club.primaryColor || '#4CAF50',
                      color: club.secondaryColor || '#FFFFFF'
                    }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-3xl mr-2">{club.emblem || '⚽'}</span>
                    </div>
                    <CardTitle className="font-pixel">
                      {club.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-retro-yellow-highlight mr-2" />
                        <div>
                          <p className="text-retro-white-lines opacity-80 font-pixel text-xs">Reputação</p>
                          <p className="font-pixel text-retro-white-lines">{club.reputation}/100</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-retro-yellow-highlight mr-2" />
                        <div>
                          <p className="text-retro-white-lines opacity-80 font-pixel text-xs">Orçamento</p>
                          <p className="font-pixel text-retro-white-lines">€{(club.budget / 1000).toFixed(0)}k</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-retro-yellow-highlight mr-2" />
                        <div>
                          <p className="text-retro-white-lines opacity-80 font-pixel text-xs">Elenco</p>
                          <p className="font-pixel text-retro-white-lines">{club.players.length} jogadores</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: club.primaryColor || '#4CAF50' }}
                        ></div>
                        <div>
                          <p className="text-retro-white-lines opacity-80 font-pixel text-xs">Estádio</p>
                          <p className="font-pixel text-retro-white-lines">{(club.stadium.capacity / 1000).toFixed(0)}k</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-retro-white-lines opacity-80 font-pixel text-xs mb-2">
                        {club.stadium.name}
                      </p>
                      <p className="text-retro-white-lines opacity-80 font-pixel text-xs">
                        Liga: {club.league}
                      </p>
                    </div>
                    
                    <PixelButton
                      onClick={() => handleSelectClub(club.id)}
                      variant="success"
                      className="w-full"
                      disabled={selecting === club.id}
                      style={{
                        backgroundColor: club.primaryColor || '#4CAF50',
                        color: club.secondaryColor || '#FFFFFF'
                      }}
                    >
                      {selecting === club.id ? 'Selecionando...' : 'Escolher Este Clube'}
                    </PixelButton>
                  </CardContent>
                </PixelCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubSelectionScreen;
