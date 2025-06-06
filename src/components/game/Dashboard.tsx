
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
import { Users, Calendar, Trophy, Gamepad, ArrowLeft, Target, TrendingUp, Award, Zap } from 'lucide-react';
import { SupabaseGameService } from '@/services/supabaseGameService';
import { useToast } from '@/components/ui/use-toast';
import PixelBackground from '@/components/pixel/PixelBackground';
import PlayerSprite from '@/components/retro/PlayerSprite';
import SoccerFieldSprite from '@/components/retro/SoccerFieldSprite';

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
      
      const newMatch = generateDemoMatch(club.name, opponent);
      setRecentMatches(prev => [newMatch, ...prev.slice(0, 4)]);
      
      toast({
        title: "Partida simulada!",
        description: `${newMatch.homeTeam} ${newMatch.score?.home} x ${newMatch.score?.away} ${newMatch.awayTeam}`,
      });
      
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
      <div className="min-h-screen relative">
        <PixelBackground type="stadium" />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-retro-white-lines font-pixel text-xl animate-pulse">
            Carregando dados do clube...
          </div>
        </div>
      </div>
    );
  }

  const clubPrimaryColor = club.primary_color || '#4CAF50';
  const clubSecondaryColor = club.secondary_color || '#FFFFFF';

  return (
    <div className="min-h-screen relative">
      <PixelBackground type="stadium" />
      
      {/* Elementos decorativos temáticos */}
      <div className="absolute top-20 left-5 opacity-15 z-0">
        <SoccerFieldSprite size="medium" />
      </div>
      <div className="absolute bottom-20 right-5 opacity-15 z-0">
        <PlayerSprite position="ATK" size="large" teamColor={clubPrimaryColor} />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-10 z-0">
        <PlayerSprite position="MID" size="medium" teamColor={clubSecondaryColor} />
      </div>

      {/* Header personalizado com cores do clube */}
      <div 
        className="text-retro-white-lines border-b-4 border-retro-yellow-highlight relative z-10"
        style={{ backgroundColor: clubPrimaryColor }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-2 font-pixel hover:scale-105 transition-transform"
                style={{ 
                  borderColor: clubSecondaryColor,
                  color: clubSecondaryColor,
                  backgroundColor: 'transparent'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Menu Principal
              </Button>
              
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl animate-pixel-bounce"
                style={{ backgroundColor: clubSecondaryColor, color: clubPrimaryColor }}
              >
                {club.emblem || '⚽'}
              </div>
              <div>
                <h1 
                  className="text-2xl font-pixel font-bold"
                  style={{ color: clubSecondaryColor }}
                >
                  {club.name}
                </h1>
                <p 
                  className="text-sm opacity-90 font-pixel"
                  style={{ color: clubSecondaryColor }}
                >
                  🏆 Treinador: {manager.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" style={{ color: clubSecondaryColor }} />
                <span 
                  className="font-pixel text-sm"
                  style={{ color: clubSecondaryColor }}
                >
                  Reputação: {club.reputation}/100
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" style={{ color: clubSecondaryColor }} />
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
      
      <div className="container mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Cards de estatísticas com cores do clube */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            className="border-2 bg-retro-gray-dark/90 hover:scale-105 transition-transform"
            style={{ borderColor: clubPrimaryColor }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6" style={{ color: clubPrimaryColor }} />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80 font-pixel">Reputação</p>
                  <p className="font-pixel font-bold text-retro-white-lines text-lg">{club.reputation}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="border-2 bg-retro-gray-dark/90 hover:scale-105 transition-transform"
            style={{ borderColor: clubPrimaryColor }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6" style={{ color: clubPrimaryColor }} />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80 font-pixel">Elenco</p>
                  <p className="font-pixel font-bold text-retro-white-lines text-lg">{club.players.length}/30</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="border-2 bg-retro-gray-dark/90 hover:scale-105 transition-transform"
            style={{ borderColor: clubPrimaryColor }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6" style={{ color: clubPrimaryColor }} />
                <div>
                  <p className="text-xs text-retro-white-lines opacity-80 font-pixel">Overall Médio</p>
                  <p className="font-pixel font-bold text-retro-white-lines text-lg">{calculateTeamOverall(club.players)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="border-2 bg-retro-gray-dark/90 hover:scale-105 transition-transform"
            style={{ borderColor: clubPrimaryColor }}
          >
            <CardContent className="p-4">
              <Button 
                onClick={handleSimulateMatch}
                disabled={loading}
                className="w-full font-pixel hover:scale-105 transition-transform"
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
            className="grid w-full grid-cols-6 bg-retro-gray-dark/90 border-2"
            style={{ borderColor: clubPrimaryColor }}
          >
            <TabsTrigger value="squad" className="font-pixel text-retro-white-lines">Elenco</TabsTrigger>
            <TabsTrigger value="lineup" className="font-pixel text-retro-white-lines">Escalação</TabsTrigger>
            <TabsTrigger value="training" className="font-pixel text-retro-white-lines">Treinos</TabsTrigger>
            <TabsTrigger value="tactics" className="font-pixel text-retro-white-lines">Táticas</TabsTrigger>
            <TabsTrigger value="pretalk" className="font-pixel text-retro-white-lines">Preleção</TabsTrigger>
            <TabsTrigger value="matches" className="font-pixel text-retro-white-lines">Partidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="squad" className="space-y-4">
            <Card 
              className="border-2 bg-retro-gray-dark/90"
              style={{ borderColor: clubPrimaryColor }}
            >
              <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                <CardTitle 
                  className="font-pixel flex items-center"
                  style={{ color: clubSecondaryColor }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Elenco Completo - Overall Médio: {calculateTeamOverall(club.players)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
              className="border-2 bg-retro-gray-dark/90"
              style={{ borderColor: clubPrimaryColor }}
            >
              <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                <CardTitle 
                  className="font-pixel flex items-center"
                  style={{ color: clubSecondaryColor }}
                >
                  <Target className="w-5 h-5 mr-2" />
                  Gestão de Escalação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="text-center">
                  <SoccerFieldSprite size="large" className="mx-auto mb-4" />
                  <p className="text-retro-white-lines font-pixel text-sm mb-4">
                    Configure sua escalação titular e banco de reservas baseado na formação escolhida.
                  </p>
                  <Button
                    onClick={onNavigateToLineup}
                    className="font-pixel hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: clubPrimaryColor,
                      color: clubSecondaryColor
                    }}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Gerenciar Escalação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="training" className="space-y-4">
            <TrainingManager clubId={club.id} currentTraining={club.training} />
          </TabsContent>
          
          <TabsContent value="tactics" className="space-y-4">
            <Card 
              className="border-2 bg-retro-gray-dark/90"
              style={{ borderColor: clubPrimaryColor }}
            >
              <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                <CardTitle 
                  className="font-pixel flex items-center"
                  style={{ color: clubSecondaryColor }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Configurações Táticas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-retro-white-lines font-pixel mb-3">Formação Tática</label>
                    <select 
                      className="w-full p-3 text-retro-white-lines font-pixel rounded border-2 bg-retro-gray-dark/90"
                      style={{ borderColor: clubPrimaryColor }}
                      defaultValue={club.formation}
                    >
                      <option value="4-4-2">4-4-2 (Clássico)</option>
                      <option value="4-3-3">4-3-3 (Ofensivo)</option>
                      <option value="3-5-2">3-5-2 (Meio-Campo)</option>
                      <option value="5-3-2">5-3-2 (Defensivo)</option>
                      <option value="4-2-3-1">4-2-3-1 (Moderno)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-retro-white-lines font-pixel mb-3">Estilo de Jogo</label>
                    <select 
                      className="w-full p-3 text-retro-white-lines font-pixel rounded border-2 bg-retro-gray-dark/90"
                      style={{ borderColor: clubPrimaryColor }}
                      defaultValue={club.tactic}
                    >
                      <option value="balanced">⚖️ Equilibrado</option>
                      <option value="offensive">⚡ Ofensivo</option>
                      <option value="defensive">🛡️ Defensivo</option>
                      <option value="counter">🏃 Contra-ataque</option>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card 
                className="border-2 bg-retro-gray-dark/90"
                style={{ borderColor: clubPrimaryColor }}
              >
                <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                  <CardTitle 
                    className="font-pixel flex items-center"
                    style={{ color: clubSecondaryColor }}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Últimas Partidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentMatches.map(match => (
                      <MatchResult key={match.id} match={match} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-2 bg-retro-gray-dark/90"
                style={{ borderColor: clubPrimaryColor }}
              >
                <CardHeader style={{ backgroundColor: clubPrimaryColor }}>
                  <CardTitle 
                    className="font-pixel flex items-center"
                    style={{ color: clubSecondaryColor }}
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Classificação da Liga
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 text-center">
                  <div className="mb-4">
                    <PlayerSprite position="GK" size="large" teamColor={clubPrimaryColor} className="mx-auto" />
                  </div>
                  <p className="text-retro-white-lines font-pixel text-sm">
                    Veja a classificação das suas ligas ativas e compare seu desempenho.
                  </p>
                  <Button
                    onClick={() => onNavigateToStandings('demo', 'Liga Demonstração')}
                    className="font-pixel hover:scale-105 transition-transform"
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
