
import { useState, useEffect } from 'react';
import { GameService } from '@/services/gameService';
import { Manager, Club, Match } from '@/types/game';
import Header from './Header';
import PlayerCard from './PlayerCard';
import MatchResult from './MatchResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Trophy, Gamepad } from 'lucide-react';

const Dashboard = () => {
  const [manager, setManager] = useState<Manager | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);

  useEffect(() => {
    // Inicializar dados do jogo
    const managerData = GameService.getManagerStartingData();
    const clubData = GameService.getClubById(managerData.currentClub);
    
    setManager(managerData);
    setClub(clubData);

    // Gerar algumas partidas de exemplo
    if (clubData) {
      const matches = [
        GameService.generateRandomMatch(clubData.name, 'Atlético Cidade'),
        GameService.generateRandomMatch('União FC', clubData.name),
        GameService.generateRandomMatch(clubData.name, 'Esporte Clube'),
      ];
      setRecentMatches(matches);
    }
  }, []);

  const handleSimulateMatch = () => {
    if (!club) return;
    
    const newMatch = GameService.generateRandomMatch(club.name, 'Rival FC');
    setRecentMatches(prev => [newMatch, ...prev.slice(0, 4)]);
  };

  if (!manager || !club) {
    return (
      <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl animate-pixel-bounce">
          Carregando Football Manager Retrô...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-green-field">
      <Header 
        managerName={manager.name}
        clubName={club.name}
        reputation={manager.reputation}
        budget={club.budget}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-retro-gray-concrete border-retro-white-lines">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-retro-yellow-highlight" />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80">Reputação</p>
                  <p className="font-pixel font-bold text-retro-white-lines">{club.reputation}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-retro-gray-concrete border-retro-white-lines">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-retro-blue-team" />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80">Jogadores</p>
                  <p className="font-pixel font-bold text-retro-white-lines">{club.players.length}/30</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-retro-gray-concrete border-retro-white-lines">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-retro-green-field" />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80">Próximo Jogo</p>
                  <p className="font-pixel font-bold text-retro-white-lines text-xs">em 2 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-retro-gray-concrete border-retro-white-lines">
            <CardContent className="p-4">
              <Button 
                onClick={handleSimulateMatch}
                className="w-full bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
              >
                <Gamepad className="w-4 h-4 mr-2" />
                Simular Jogo
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="squad" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-retro-gray-concrete">
            <TabsTrigger value="squad" className="font-pixel">Elenco</TabsTrigger>
            <TabsTrigger value="matches" className="font-pixel">Partidas</TabsTrigger>
            <TabsTrigger value="tactics" className="font-pixel">Táticas</TabsTrigger>
            <TabsTrigger value="transfer" className="font-pixel">Mercado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="squad" className="space-y-4">
            <Card className="bg-retro-gray-concrete border-retro-white-lines">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines">
                  Elenco - Overall Médio: {GameService.calculateTeamOverall(club.players)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {club.players.map(player => (
                    <PlayerCard key={player.id} player={player} showDetails />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches" className="space-y-4">
            <Card className="bg-retro-gray-concrete border-retro-white-lines">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines">Últimas Partidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMatches.map(match => (
                    <MatchResult key={match.id} match={match} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tactics" className="space-y-4">
            <Card className="bg-retro-gray-concrete border-retro-white-lines">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines">Configurações Táticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-retro-white-lines font-pixel mb-2">Formação</label>
                    <select className="w-full p-2 bg-retro-green-dark text-retro-white-lines font-pixel rounded border border-retro-white-lines">
                      <option>4-4-2</option>
                      <option>4-3-3</option>
                      <option>3-5-2</option>
                      <option>5-3-2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-retro-white-lines font-pixel mb-2">Estilo de Jogo</label>
                    <select className="w-full p-2 bg-retro-green-dark text-retro-white-lines font-pixel rounded border border-retro-white-lines">
                      <option>Equilibrado</option>
                      <option>Ofensivo</option>
                      <option>Defensivo</option>
                      <option>Contra-ataque</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transfer" className="space-y-4">
            <Card className="bg-retro-gray-concrete border-retro-white-lines">
              <CardHeader>
                <CardTitle className="font-pixel text-retro-white-lines">Mercado de Transferências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {GameService.getPlayersByPosition().slice(0, 6).map(player => (
                    <div key={player.id} className="space-y-2">
                      <PlayerCard player={player} showDetails />
                      <Button className="w-full bg-retro-green-field text-retro-white-lines hover:bg-green-600 font-pixel">
                        Contratar - €{player.price.toLocaleString()}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
