
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Target,
  Settings,
  Play,
  ArrowLeft,
  Calendar,
  DollarSign,
  Star,
  Activity
} from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import PixelBackground from '@/components/pixel/PixelBackground';
import PixelCard from '@/components/pixel/PixelCard';
import PixelButton from '@/components/pixel/PixelButton';
import TrainingManager from './TrainingManager';
import PreTalkManager from './PreTalkManager';
import MatchResult from './MatchResult';
import BackgroundMusic from '@/components/audio/BackgroundMusic';

interface DashboardProps {
  onBack: () => void;
  onNavigateToLineup: () => void;
  onNavigateToStandings: (leagueId: string, leagueName: string) => void;
  onRefreshClub: () => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onBack, 
  onNavigateToLineup, 
  onNavigateToStandings,
  onRefreshClub 
}) => {
  const { state } = useGame();
  const [showTraining, setShowTraining] = useState(false);
  const [showPreTalk, setShowPreTalk] = useState(false);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [lastMatchResult, setLastMatchResult] = useState<any>(null);

  const { manager, currentClub: club } = state;

  if (!manager || !club) {
    return (
      <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl animate-pulse">
          Carregando dados do clube...
        </div>
      </div>
    );
  }

  const clubPrimaryColor = club.primary_color || '#4CAF50';
  const clubSecondaryColor = club.secondary_color || '#FFFFFF';

  return (
    <div className="min-h-screen relative">
      <PixelBackground type="stadium" />
      <BackgroundMusic />
      
      <div className="relative z-10 p-4">
        {/* Header sem linha vertical */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <PixelButton onClick={onBack} variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </PixelButton>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ 
                  backgroundColor: clubPrimaryColor,
                  color: clubSecondaryColor 
                }}
              >
                {club.emblem || '⚽'}
              </div>
              <div>
                <h1 className="font-pixel text-retro-white-lines text-2xl">
                  Painel Principal
                </h1>
                <p className="font-pixel text-retro-white-lines opacity-80 text-sm">
                  {club.name} - {manager.name}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="font-pixel">
              Nível {manager.level}
            </Badge>
            <Badge variant="outline" className="font-pixel">
              ${club.budget.toLocaleString()}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <PixelCard>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-retro-yellow-highlight" />
                <div>
                  <p className="font-pixel text-retro-white-lines text-xs">Elenco</p>
                  <p className="font-pixel text-retro-white-lines text-lg">{club.players.length}</p>
                </div>
              </div>
            </CardContent>
          </PixelCard>

          <PixelCard>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-retro-yellow-highlight" />
                <div>
                  <p className="font-pixel text-retro-white-lines text-xs">Reputação</p>
                  <p className="font-pixel text-retro-white-lines text-lg">{club.reputation}</p>
                </div>
              </div>
            </CardContent>
          </PixelCard>

          <PixelCard>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-retro-yellow-highlight" />
                <div>
                  <p className="font-pixel text-retro-white-lines text-xs">Formação</p>
                  <p className="font-pixel text-retro-white-lines text-lg">{club.formation}</p>
                </div>
              </div>
            </CardContent>
          </PixelCard>

          <PixelCard>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-retro-yellow-highlight" />
                <div>
                  <p className="font-pixel text-retro-white-lines text-xs">Treino</p>
                  <p className="font-pixel text-retro-white-lines text-lg capitalize">{club.training}</p>
                </div>
              </div>
            </CardContent>
          </PixelCard>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Elenco e Escalação */}
          <PixelCard>
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines flex items-center gap-2">
                <Users className="w-5 h-5" />
                Elenco e Escalação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-retro-white-lines font-pixel text-sm">
                <p>Jogadores cadastrados: {club.players.length}</p>
                <p>Titulares: {club.players.filter(p => p.is_starter).length}</p>
                <p>Reservas: {club.players.filter(p => p.is_substitute).length}</p>
              </div>
              
              <PixelButton 
                onClick={onNavigateToLineup}
                variant="primary" 
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Gerenciar Escalação
              </PixelButton>
            </CardContent>
          </PixelCard>

          {/* Treinos e Táticas */}
          <PixelCard>
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Treinos e Táticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-retro-white-lines font-pixel text-sm">
                <p>Treino atual: <span className="capitalize">{club.training}</span></p>
                <p>Tática: <span className="capitalize">{club.tactic}</span></p>
                <p>Preleção: <span className="capitalize">{club.preTalkType}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <PixelButton 
                  onClick={() => setShowTraining(true)}
                  variant="secondary" 
                  size="sm"
                >
                  Treino
                </PixelButton>
                <PixelButton 
                  onClick={() => setShowPreTalk(true)}
                  variant="secondary" 
                  size="sm"
                >
                  Preleção
                </PixelButton>
              </div>
            </CardContent>
          </PixelCard>
        </div>

        {/* Partidas e Competições */}
        <PixelCard>
          <CardHeader>
            <CardTitle className="font-pixel text-retro-white-lines flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Partidas e Competições
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PixelButton 
                onClick={() => onNavigateToStandings('1', 'Liga Regional')}
                variant="primary"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Ver Classificação
              </PixelButton>
              
              <PixelButton 
                onClick={() => {
                  // Simular partida amistosa
                  setLastMatchResult({
                    homeTeam: club.name,
                    awayTeam: 'Time Adversário',
                    homeScore: Math.floor(Math.random() * 4),
                    awayScore: Math.floor(Math.random() * 4),
                    isHome: true
                  });
                  setShowMatchResult(true);
                }}
                variant="secondary"
              >
                <Play className="w-4 h-4 mr-2" />
                Partida Amistosa
              </PixelButton>
              
              <PixelButton 
                onClick={() => {}}
                variant="outline"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Próximas Partidas
              </PixelButton>
            </div>
          </CardContent>
        </PixelCard>
      </div>

      {/* Modals */}
      {showTraining && (
        <TrainingManager
          clubId={club.id}
          currentTraining={club.training}
          onClose={() => setShowTraining(false)}
          onSave={onRefreshClub}
        />
      )}

      {showPreTalk && (
        <PreTalkManager
          clubId={club.id}
          currentPreTalk={club.preTalkType}
          onClose={() => setShowPreTalk(false)}
          onSave={onRefreshClub}
        />
      )}

      {showMatchResult && lastMatchResult && (
        <MatchResult
          result={lastMatchResult}
          onClose={() => setShowMatchResult(false)}
          onPlayAgain={() => {
            setLastMatchResult({
              ...lastMatchResult,
              homeScore: Math.floor(Math.random() * 4),
              awayScore: Math.floor(Math.random() * 4)
            });
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
