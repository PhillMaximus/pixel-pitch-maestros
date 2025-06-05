
import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Match } from '@/types/game';
import MatchResult from './MatchResult';
import TrainingManager from './TrainingManager';
import PreTalkManager from './PreTalkManager';
import PlayerCard from './PlayerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Trophy, Gamepad, ArrowLeft, Target } from 'lucide-react';
import { SupabaseGameService } from '@/services/supabaseGameService';
import { useToast } from '@/components/ui/use-toast';

interface DashboardProps {
  onBack: () => void;
  onNavigateToLineup: () => void;
  onNavigateToStandings: (leagueId: string, leagueName: string) => void;
  onRefreshClub: () => void;
}

const Dashboard = ({ onBack, onNavigateToLineup, onNavigateToStandings, onRefreshClub }: DashboardProps) => {
  const { state } = useGame();
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { manager, currentClub: club } = state;

  useEffect(() => {
    if (club) {
      // Simular algumas partidas anteriores para demonstração
      const matches = [
        generateDemoMatch(club.name, 'Atlético Cidade'),
        generateDemoMatch('União FC', club.name),
        generateDemoMatch(club.name, 'Esporte Clube'),
      ];
      setRecentMatches(matches);
    }
  }, [club]);

  const generateDemoMatch = (homeTeam: string, awayTeam: string): Match => {
    const homeScore = Math.floor(Math.random() * 4);
    const awayScore = Math.floor(Math.random() * 4);
    
    return {
      id: `demo_${Date.now()}_${Math.random()}`,
      homeTeam,
      awayTeam,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'finished',
      round: 1,
      leagueId: 'demo',
      score: {
        home: homeScore,
        away: awayScore
      },
      events: []
    };
  };

  const handleSimulateMatch = async () => {
    if (!club) return;
    
    setLoading(true);
    try {
      const opponentClubs = ['Atlético Cidade', 'União FC', 'Esporte Clube', 'Grêmio Local', 'Atlético Rural'];
      const opponent = opponentClubs[Math.floor(Math.random() * opponentClubs.length)];
      
      // Para demonstração, usar simulação local
      const newMatch = generateDemoMatch(club.name, opponent);
      setRecentMatches(prev => [newMatch, ...prev.slice(0, 4)]);
      
      toast({
        title: "Partida simulada!",
        description: `${newMatch.homeTeam} ${newMatch.score?.home} x ${newMatch.score?.away} ${newMatch.awayTeam}`,
      });
      
      // Atualizar clube após a partida
      await onRefreshClub();
    } catch (error) {
      console.error('Erro ao simular partida:', error);
      toast({
        title: "Erro",
        description: "Erro ao simular partida",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTeamOverall = (players: any[]) => {
    if (players.length === 0) return 0;
    const total = players.reduce((sum, player) => sum + player.overall, 0);
    return Math.round(total / players.length);
  };

  if (!manager || !club) {
    return (
      <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl animate-pulse">
          Carregando dados do clube...
        </div>
      </div>
    );
  }

  // Cores personalizadas do clube
  const clubPrimaryColor = club.primaryColor || '#4CAF50';
  const clubSecondaryColor = club.secondaryColor || '#FFFFFF';

  return (
    <div className="min-h-screen bg-retro-green-field">
      {/* Header personalizado com cores do clube */}
      <div 
        className="text-retro-white-lines border-b-4 border-retro-yellow-highlight"
        style={{ backgroundColor: clubPrimaryColor }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-retro-white-lines text-retro-white-lines hover:bg-retro-white-lines hover:text-retro-green-dark font-pixel"
                style={{ 
                  borderColor: clubSecondaryColor,
                  color: clubSecondaryColor
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Menu</span>
              </Button>
              
              {/* Emblema e informações do clube */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: clubSecondaryColor, color: clubPrimaryColor }}
              >
                {club.emblem || '⚽'}
              </div>
              <div>
                <h1 
                  className="text-xl font-pixel font-bold"
                  style={{ color: clubSecondaryColor }}
                >
                  {club.name}
                </h1>
                <p 
                  className="text-sm opacity-90"
                  style={{ color: clubSecondaryColor }}
                >
                  Treinador: {manager.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" style={{ color: clubSecondaryColor }} />
                <span 
                  className="font-pixel text-sm"
                  style={{ color: clubSecondaryColor }}
                >
                  Rep: {club.reputation}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" style={{ color: clubSecondaryColor }} />
                <span 
                  className="font-pixel text-sm"
                  style={{ color: clubSecondaryColor }}
                >
                  €{club.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Cards de estatísticas com cores do clube */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            className="border-2"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              borderColor: clubPrimaryColor 
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" style={{ color: clubPrimaryColor }} />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80">Reputação</p>
                  <p className="font-pixel font-bold text-retro-white-lines">{club.reputation}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="border-2"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              borderColor: clubPrimaryColor 
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" style={{ color: clubPrimaryColor }} />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80">Jogadores</p>
                  <p className="font-pixel font-bold text-retro-white-lines">{club.players.length}/30</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="border-2"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              borderColor: clubPrimaryColor 
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" style={{ color: clubPrimaryColor }} />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80">Próximo Jogo</p>
                  <p className="font-pixel font-bold text-retro-white-lines text-xs">em 2 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="border-2"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              borderColor: clubPrimaryColor 
            }}
          >
            <CardContent className="p-4">
              <Button 
                onClick={handleSimulateMatch}
                disabled={loading}
                className="w-full font-pixel"
                style={{
                  backgroundColor: clubPrimaryColor,
                  color: clubSecondaryColor
                }}
              >
                <Gamepad className="w-4 h-4 mr-2" />
                {loading ? 'Simulando...' : 'Simular Jogo'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="squad" className="w-full">
          <TabsList 
            className="grid w-full grid-cols-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          >
            <TabsTrigger value="squad" className="font-pixel">Elenco</TabsTrigger>
            <TabsTrigger value="lineup" className="font-pixel">Escalação</TabsTrigger>
            <TabsTrigger value="training" className="font-pixel">Treinos</TabsTrigger>
            <TabsTrigger value="tactics" className="font-pixel">Táticas</TabsTrigger>
            <TabsTrigger value="pretalk" className="font-pixel">Preleção</TabsTrigger>
            <TabsTrigger value="matches" className="font-pixel">Partidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="squad" className="space-y-4">
            <Card 
              className="border-2"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                borderColor: clubPrimaryColor 
              }}
            >
              <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                <CardTitle 
                  className="font-pixel"
                  style={{ color: clubSecondaryColor }}
                >
                  Elenco - Overall Médio: {calculateTeamOverall(club.players)}
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

          <TabsContent value="lineup" className="space-y-4">
            <Card 
              className="border-2"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                borderColor: clubPrimaryColor 
              }}
            >
              <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                <CardTitle 
                  className="font-pixel"
                  style={{ color: clubSecondaryColor }}
                >
                  Gestão de Escalação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-retro-white-lines font-pixel text-sm">
                  Configure sua escalação titular e banco de reservas baseado na formação escolhida.
                </p>
                <Button
                  onClick={onNavigateToLineup}
                  className="w-full font-pixel"
                  style={{
                    backgroundColor: clubPrimaryColor,
                    color: clubSecondaryColor
                  }}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Gerenciar Escalação
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="training" className="space-y-4">
            <TrainingManager clubId={club.id} currentTraining={club.training} />
          </TabsContent>
          
          <TabsContent value="tactics" className="space-y-4">
            <Card 
              className="border-2"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                borderColor: clubPrimaryColor 
              }}
            >
              <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                <CardTitle 
                  className="font-pixel"
                  style={{ color: clubSecondaryColor }}
                >
                  Configurações Táticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-retro-white-lines font-pixel mb-2">Formação</label>
                    <select 
                      className="w-full p-2 text-retro-white-lines font-pixel rounded border-2"
                      style={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        borderColor: clubPrimaryColor 
                      }}
                      defaultValue={club.formation}
                    >
                      <option>4-4-2</option>
                      <option>4-3-3</option>
                      <option>3-5-2</option>
                      <option>5-3-2</option>
                      <option>4-2-3-1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-retro-white-lines font-pixel mb-2">Estilo de Jogo</label>
                    <select 
                      className="w-full p-2 text-retro-white-lines font-pixel rounded border-2"
                      style={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        borderColor: clubPrimaryColor 
                      }}
                      defaultValue={club.tactic}
                    >
                      <option value="balanced">Equilibrado</option>
                      <option value="offensive">Ofensivo</option>
                      <option value="defensive">Defensivo</option>
                      <option value="counter">Contra-ataque</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pretalk" className="space-y-4">
            <PreTalkManager clubId={club.id} currentPreTalk={club.preTalkType} />
          </TabsContent>
          
          <TabsContent value="matches" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card 
                className="border-2"
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  borderColor: clubPrimaryColor 
                }}
              >
                <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                  <CardTitle 
                    className="font-pixel"
                    style={{ color: clubSecondaryColor }}
                  >
                    Últimas Partidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentMatches.map(match => (
                      <MatchResult key={match.id} match={match} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-2"
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  borderColor: clubPrimaryColor 
                }}
              >
                <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                  <CardTitle 
                    className="font-pixel"
                    style={{ color: clubSecondaryColor }}
                  >
                    Classificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-retro-white-lines font-pixel text-sm">
                    Veja a classificação das suas ligas ativas.
                  </p>
                  <Button
                    onClick={() => onNavigateToStandings('demo', 'Liga Demonstração')}
                    className="w-full font-pixel"
                    style={{
                      backgroundColor: clubPrimaryColor,
                      color: clubSecondaryColor
                    }}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Ver Classificação
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
