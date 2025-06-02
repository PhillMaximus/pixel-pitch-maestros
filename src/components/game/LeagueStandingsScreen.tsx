
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { LeagueTable } from '@/types/game';
import { SupabaseGameService } from '@/services/supabaseGameService';

interface LeagueStandingsScreenProps {
  leagueId: string;
  leagueName: string;
  onBack: () => void;
}

const LeagueStandingsScreen = ({ leagueId, leagueName, onBack }: LeagueStandingsScreenProps) => {
  const [standings, setStandings] = useState<LeagueTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStandings();
  }, [leagueId]);

  const loadStandings = async () => {
    try {
      setLoading(true);
      const data = await SupabaseGameService.getLeagueStandings(leagueId);
      setStandings(data);
    } catch (error) {
      console.error('Erro ao carregar classificação:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (position <= 3) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (position > standings.length - 3) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Target className="w-4 h-4 text-gray-400" />;
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-yellow-500/20 border-yellow-500';
    if (position <= 3) return 'bg-green-500/20 border-green-500';
    if (position > standings.length - 3) return 'bg-red-500/20 border-red-500';
    return 'bg-retro-gray-concrete border-retro-white-lines';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <div className="text-retro-white-lines font-pixel text-xl animate-pulse">
          Carregando classificação...
        </div>
      </div>
    );
  }

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
              Voltar
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-retro-yellow-highlight rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-retro-green-dark" />
              </div>
              <h1 className="text-xl font-pixel font-bold">{leagueName}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Card className="bg-retro-gray-concrete border-retro-white-lines border-2">
          <CardHeader>
            <CardTitle className="font-pixel text-retro-white-lines text-center">
              Classificação da Liga
            </CardTitle>
          </CardHeader>
          <CardContent>
            {standings.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-retro-yellow-highlight mx-auto mb-4 opacity-50" />
                <p className="text-retro-white-lines font-pixel">
                  Nenhuma partida foi disputada ainda
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-retro-white-lines">
                      <th className="text-left font-pixel text-retro-yellow-highlight text-sm p-2">Pos</th>
                      <th className="text-left font-pixel text-retro-yellow-highlight text-sm p-2">Time</th>
                      <th className="text-center font-pixel text-retro-yellow-highlight text-sm p-2">J</th>
                      <th className="text-center font-pixel text-retro-yellow-highlight text-sm p-2">V</th>
                      <th className="text-center font-pixel text-retro-yellow-highlight text-sm p-2">E</th>
                      <th className="text-center font-pixel text-retro-yellow-highlight text-sm p-2">D</th>
                      <th className="text-center font-pixel text-retro-yellow-highlight text-sm p-2">GP</th>
                      <th className="text-center font-pixel text-retro-yellow-highlight text-sm p-2">GC</th>
                      <th className="text-center font-pixel text-retro-yellow-highlight text-sm p-2">SG</th>
                      <th className="text-center font-pixel text-retro-yellow-highlight text-sm p-2">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, index) => (
                      <tr
                        key={team.team}
                        className={`border-b border-retro-white-lines/30 ${getPositionColor(team.position)}`}
                      >
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            {getPositionIcon(team.position)}
                            <span className="font-pixel text-retro-white-lines font-bold">
                              {team.position}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="font-pixel text-retro-white-lines">
                            {team.team}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="font-pixel text-retro-white-lines text-sm">
                            {team.played}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="font-pixel text-green-400 text-sm">
                            {team.won}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="font-pixel text-yellow-400 text-sm">
                            {team.drawn}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="font-pixel text-red-400 text-sm">
                            {team.lost}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="font-pixel text-retro-white-lines text-sm">
                            {team.goalsFor}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="font-pixel text-retro-white-lines text-sm">
                            {team.goalsAgainst}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className={`font-pixel text-sm ${
                            team.goalDifference > 0 ? 'text-green-400' : 
                            team.goalDifference < 0 ? 'text-red-400' : 'text-retro-white-lines'
                          }`}>
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="font-pixel text-retro-yellow-highlight font-bold">
                            {team.points}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {standings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-yellow-500/20 border-yellow-500">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-pixel text-retro-white-lines text-sm">
                  Zona de Classificação
                </p>
                <p className="font-pixel text-yellow-500 text-xs">1º lugar</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500/20 border-green-500">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-pixel text-retro-white-lines text-sm">
                  Zona Europeia
                </p>
                <p className="font-pixel text-green-500 text-xs">2º - 3º lugar</p>
              </CardContent>
            </Card>

            <Card className="bg-red-500/20 border-red-500">
              <CardContent className="p-4 text-center">
                <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="font-pixel text-retro-white-lines text-sm">
                  Zona de Rebaixamento
                </p>
                <p className="font-pixel text-red-500 text-xs">Últimas posições</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueStandingsScreen;
