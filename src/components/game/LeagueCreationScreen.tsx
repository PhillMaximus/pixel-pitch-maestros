
import { useState } from 'react';
import { ArrowLeft, Trophy, Users, Calendar } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { gameService } from '@/services/gameService';
import PixelBackground from '@/components/pixel/PixelBackground';
import PixelCard from '@/components/pixel/PixelCard';
import PixelButton from '@/components/pixel/PixelButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeagueCreationScreenProps {
  onBack: () => void;
  onLeagueCreated: () => void;
}

const LeagueCreationScreen = ({ onBack, onLeagueCreated }: LeagueCreationScreenProps) => {
  const { state, dispatch } = useGame();
  const [formData, setFormData] = useState({
    name: '',
    season: '2024/25',
    maxTeams: 8
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) return;

    setIsCreating(true);
    try {
      const newLeague = await gameService.createLeague({
        name: formData.name,
        season: formData.season,
        maxTeams: formData.maxTeams,
        createdBy: state.user.id,
        status: 'recruiting'
      });
      
      dispatch({ type: 'CREATE_LEAGUE', payload: newLeague });
      onLeagueCreated();
    } catch (error) {
      console.error('Erro ao criar liga:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
              <h1 className="text-xl font-pixel font-bold">Criar Liga Privada</h1>
              <p className="text-sm text-retro-yellow-highlight">
                Monte seu próprio campeonato
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-pixel font-bold text-retro-white-lines mb-2 drop-shadow-lg">
              🏆 Nova Liga
            </h2>
            <p className="text-retro-white-lines opacity-80 font-pixel drop-shadow-md">
              Defina as configurações do seu campeonato
            </p>
          </div>

          <PixelCard>
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                <Trophy className="w-6 h-6 mr-3 text-retro-yellow-highlight" />
                Configurações da Liga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateLeague} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-pixel text-retro-white-lines">
                    Nome da Liga
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Liga dos Amigos"
                    required
                    className="bg-retro-gray-concrete border-retro-white-lines text-retro-white-lines font-pixel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season" className="font-pixel text-retro-white-lines">
                    Temporada
                  </Label>
                  <Input
                    id="season"
                    value={formData.season}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                    placeholder="Ex: 2024/25"
                    required
                    className="bg-retro-gray-concrete border-retro-white-lines text-retro-white-lines font-pixel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTeams" className="font-pixel text-retro-white-lines">
                    Número de Times
                  </Label>
                  <Select 
                    value={formData.maxTeams.toString()} 
                    onValueChange={(value) => handleInputChange('maxTeams', parseInt(value))}
                  >
                    <SelectTrigger className="bg-retro-gray-concrete border-retro-white-lines text-retro-white-lines font-pixel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-retro-gray-concrete border-retro-white-lines">
                      <SelectItem value="4" className="font-pixel text-retro-white-lines hover:bg-retro-green-dark">4 times</SelectItem>
                      <SelectItem value="6" className="font-pixel text-retro-white-lines hover:bg-retro-green-dark">6 times</SelectItem>
                      <SelectItem value="8" className="font-pixel text-retro-white-lines hover:bg-retro-green-dark">8 times</SelectItem>
                      <SelectItem value="10" className="font-pixel text-retro-white-lines hover:bg-retro-green-dark">10 times</SelectItem>
                      <SelectItem value="12" className="font-pixel text-retro-white-lines hover:bg-retro-green-dark">12 times</SelectItem>
                      <SelectItem value="16" className="font-pixel text-retro-white-lines hover:bg-retro-green-dark">16 times</SelectItem>
                      <SelectItem value="20" className="font-pixel text-retro-white-lines hover:bg-retro-green-dark">20 times</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-retro-green-dark/30 p-4 rounded-lg border border-retro-yellow-highlight">
                  <h3 className="font-pixel text-retro-white-lines text-sm mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-retro-yellow-highlight" />
                    Formato do Campeonato
                  </h3>
                  <p className="font-pixel text-retro-white-lines text-xs opacity-80">
                    • Todos jogam contra todos em turno e returno
                  </p>
                  <p className="font-pixel text-retro-white-lines text-xs opacity-80">
                    • Simulação automática das partidas a cada dia
                  </p>
                  <p className="font-pixel text-retro-white-lines text-xs opacity-80">
                    • Convide amigos com o código da liga
                  </p>
                </div>

                <div className="flex space-x-4">
                  <PixelButton
                    type="button"
                    onClick={onBack}
                    variant="secondary"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancelar
                  </PixelButton>
                  
                  <PixelButton
                    type="submit"
                    disabled={isCreating || !formData.name.trim()}
                    variant="success"
                    className="flex-1"
                  >
                    {isCreating ? (
                      '⏳ Criando...'
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Criar Liga
                      </>
                    )}
                  </PixelButton>
                </div>
              </form>
            </CardContent>
          </PixelCard>

          <PixelCard className="mt-6" variant="highlight">
            <CardContent className="text-center py-6">
              <Calendar className="w-12 h-12 text-retro-yellow-highlight mx-auto mb-3" />
              <h3 className="font-pixel text-retro-white-lines text-lg mb-2">
                Próximos Passos
              </h3>
              <p className="font-pixel text-retro-white-lines text-sm opacity-80">
                Após criar a liga, você receberá um código para compartilhar com seus amigos
              </p>
            </CardContent>
          </PixelCard>
        </div>
      </div>
    </div>
  );
};

export default LeagueCreationScreen;
