
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@/types/game';
import { ArrowLeft, Users, Save } from 'lucide-react';
import { SupabaseGameService } from '@/services/supabaseGameService';
import { useToast } from '@/components/ui/use-toast';

interface LineupScreenProps {
  clubId: string;
  players: Player[];
  formation: string;
  onBack: () => void;
  onSave: (lineup: string[], substitutes: string[]) => void;
}

const FORMATION_POSITIONS = {
  '4-4-2': { GK: 1, DEF: 4, MID: 4, ATK: 2 },
  '4-3-3': { GK: 1, DEF: 4, MID: 3, ATK: 3 },
  '3-5-2': { GK: 1, DEF: 3, MID: 5, ATK: 2 },
  '5-3-2': { GK: 1, DEF: 5, MID: 3, ATK: 2 },
  '4-2-3-1': { GK: 1, DEF: 4, MID: 5, ATK: 1 }
};

const LineupScreen = ({ clubId, players, formation, onBack, onSave }: LineupScreenProps) => {
  const [lineup, setLineup] = useState<string[]>([]);
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const { toast } = useToast();

  const formationPositions = FORMATION_POSITIONS[formation as keyof typeof FORMATION_POSITIONS] || FORMATION_POSITIONS['4-4-2'];

  useEffect(() => {
    // Inicializar com jogadores que já estão escalados
    const starters = players.filter(p => p.lineup?.includes(p.id));
    const subs = players.filter(p => p.substitutes?.includes(p.id));
    const available = players.filter(p => !starters.includes(p) && !subs.includes(p));

    setLineup(starters.map(p => p.id));
    setSubstitutes(subs.map(p => p.id));
    setAvailablePlayers(available);
  }, [players]);

  const addToLineup = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const positionCount = lineup.filter(id => {
      const p = players.find(pl => pl.id === id);
      return p?.position === player.position;
    }).length;

    const maxForPosition = formationPositions[player.position as keyof typeof formationPositions];

    if (positionCount >= maxForPosition) {
      toast({
        title: "Limite da posição",
        description: `Máximo de ${maxForPosition} jogadores na posição ${player.position}`,
        variant: "destructive",
      });
      return;
    }

    if (lineup.length >= 11) {
      toast({
        title: "Time completo",
        description: "Máximo de 11 jogadores titulares",
        variant: "destructive",
      });
      return;
    }

    setLineup([...lineup, playerId]);
    setAvailablePlayers(availablePlayers.filter(p => p.id !== playerId));
    setSubstitutes(substitutes.filter(id => id !== playerId));
  };

  const addToSubstitutes = (playerId: string) => {
    if (substitutes.length >= 7) {
      toast({
        title: "Banco completo",
        description: "Máximo de 7 jogadores reservas",
        variant: "destructive",
      });
      return;
    }

    setSubstitutes([...substitutes, playerId]);
    setAvailablePlayers(availablePlayers.filter(p => p.id !== playerId));
    setLineup(lineup.filter(id => id !== playerId));
  };

  const removeFromLineup = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setLineup(lineup.filter(id => id !== playerId));
      setAvailablePlayers([...availablePlayers, player]);
    }
  };

  const removeFromSubstitutes = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSubstitutes(substitutes.filter(id => id !== playerId));
      setAvailablePlayers([...availablePlayers, player]);
    }
  };

  const handleSave = async () => {
    if (lineup.length !== 11) {
      toast({
        title: "Escalação incompleta",
        description: "Você deve escalar exatamente 11 jogadores titulares",
        variant: "destructive",
      });
      return;
    }

    const result = await SupabaseGameService.updateClubLineup(clubId, lineup, substitutes);
    if (result.success) {
      toast({
        title: "Escalação salva!",
        description: "A escalação foi atualizada com sucesso",
      });
      onSave(lineup, substitutes);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao salvar escalação",
        variant: "destructive",
      });
    }
  };

  const getPlayersByPosition = (position: string) => {
    return players.filter(p => p.position === position);
  };

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
            <h1 className="text-xl font-pixel font-bold">Escalação - {formation}</h1>
          </div>
          
          <Button
            onClick={handleSave}
            className="bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Escalação
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Titulares */}
          <Card className="bg-retro-gray-concrete border-retro-white-lines">
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                <Users className="w-5 h-5 mr-2 text-retro-yellow-highlight" />
                Titulares ({lineup.length}/11)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(formationPositions).map(([position, maxCount]) => {
                const positionPlayers = lineup.map(id => players.find(p => p.id === id))
                  .filter(p => p?.position === position);
                
                return (
                  <div key={position} className="bg-retro-green-dark p-3 rounded">
                    <h4 className="font-pixel text-retro-yellow-highlight text-sm mb-2">
                      {position} ({positionPlayers.length}/{maxCount})
                    </h4>
                    <div className="space-y-1">
                      {positionPlayers.map(player => player && (
                        <div
                          key={player.id}
                          className="flex items-center justify-between bg-retro-gray-concrete p-2 rounded"
                        >
                          <span className="font-pixel text-retro-white-lines text-xs">
                            {player.name} ({player.overall})
                          </span>
                          <Button
                            onClick={() => removeFromLineup(player.id)}
                            size="sm"
                            variant="outline"
                            className="border-retro-red text-retro-red hover:bg-retro-red hover:text-white text-xs px-2 py-1"
                          >
                            X
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Reservas */}
          <Card className="bg-retro-gray-concrete border-retro-white-lines">
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines">
                Reservas ({substitutes.length}/7)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {substitutes.map(playerId => {
                const player = players.find(p => p.id === playerId);
                return player && (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-retro-green-dark p-2 rounded"
                  >
                    <span className="font-pixel text-retro-white-lines text-xs">
                      {player.name} ({player.overall}) - {player.position}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => addToLineup(player.id)}
                        size="sm"
                        className="bg-retro-yellow-highlight text-retro-green-dark text-xs px-2 py-1"
                      >
                        Titular
                      </Button>
                      <Button
                        onClick={() => removeFromSubstitutes(player.id)}
                        size="sm"
                        variant="outline"
                        className="border-retro-red text-retro-red hover:bg-retro-red hover:text-white text-xs px-2 py-1"
                      >
                        X
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Jogadores Disponíveis */}
          <Card className="bg-retro-gray-concrete border-retro-white-lines">
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines">
                Disponíveis ({availablePlayers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['GK', 'DEF', 'MID', 'ATK'].map(position => {
                const positionPlayers = availablePlayers.filter(p => p.position === position);
                if (positionPlayers.length === 0) return null;
                
                return (
                  <div key={position} className="space-y-1">
                    <h4 className="font-pixel text-retro-yellow-highlight text-sm">
                      {position}
                    </h4>
                    {positionPlayers.map(player => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between bg-retro-green-dark p-2 rounded"
                      >
                        <span className="font-pixel text-retro-white-lines text-xs">
                          {player.name} ({player.overall})
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => addToLineup(player.id)}
                            size="sm"
                            className="bg-retro-yellow-highlight text-retro-green-dark text-xs px-2 py-1"
                          >
                            Titular
                          </Button>
                          <Button
                            onClick={() => addToSubstitutes(player.id)}
                            size="sm"
                            className="bg-retro-blue-team text-retro-white-lines text-xs px-2 py-1"
                          >
                            Reserva
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LineupScreen;
