
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { GameService } from '@/services/gameService';
import { ArrowLeft, Trophy, Users, DollarSign } from 'lucide-react';

const ClubSelectionScreen = () => {
  const { state, dispatch } = useGame();
  const availableClubs = GameService.getAvailableClubsForSelection();

  const handleSelectClub = (clubId: string) => {
    dispatch({ type: 'SELECT_CLUB', payload: clubId });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'home' });
  };

  return (
    <div className="min-h-screen bg-retro-green-field">
      <div className="bg-retro-green-dark text-retro-white-lines border-b-4 border-retro-yellow-highlight">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-retro-white-lines text-retro-white-lines hover:bg-retro-white-lines hover:text-retro-green-dark font-pixel"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-pixel font-bold">Escolha seu Clube</h1>
              <p className="text-sm text-retro-yellow-highlight">
                Comece sua carreira como treinador
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-pixel font-bold text-retro-white-lines mb-2">
              Clubes Disponíveis
            </h2>
            <p className="text-retro-white-lines opacity-80 font-pixel">
              Escolha um clube pequeno e construa sua reputação como treinador
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableClubs.map((club) => (
              <Card 
                key={club.id} 
                className="bg-retro-gray-concrete border-retro-white-lines border-2 hover:border-retro-yellow-highlight transition-colors"
              >
                <CardHeader>
                  <CardTitle className="font-pixel text-retro-white-lines text-center">
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
                      <div className="w-4 h-4 bg-retro-green-field rounded mr-2"></div>
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
                  
                  <Button
                    onClick={() => handleSelectClub(club.id)}
                    className="w-full bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
                  >
                    Escolher Este Clube
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubSelectionScreen;
