
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { Player } from '@/types/game';
import { SupabaseGameService } from '@/services/supabaseGameService';
import { useToast } from '@/components/ui/use-toast';
import PixelBackground from '@/components/pixel/PixelBackground';
import PixelCard from '@/components/pixel/PixelCard';
import PixelButton from '@/components/pixel/PixelButton';

interface LineupScreenProps {
  clubId: string;
  players: Player[];
  formation: string;
  onBack: () => void;
  onSave: () => void;
}

const LineupScreen = ({ clubId, players, formation, onBack, onSave }: LineupScreenProps) => {
  const [starters, setStarters] = useState<Player[]>([]);
  const [substitutes, setSubstitutes] = useState<Player[]>([]);
  const [bench, setBench] = useState<Player[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const starterPlayers = players.filter(p => p.is_starter);
    const substitutePlayers = players.filter(p => p.is_substitute && !p.is_starter);
    const benchPlayers = players.filter(p => !p.is_starter && !p.is_substitute);
    
    setStarters(starterPlayers);
    setSubstitutes(substitutePlayers);
    setBench(benchPlayers);
  }, [players]);

  const getFormationSlots = () => {
    const [def, mid, att] = formation.split('-').map(Number);
    return { gk: 1, def, mid, att };
  };

  const moveToStarters = (player: Player) => {
    const slots = getFormationSlots();
    const currentByPosition = starters.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let canAdd = false;
    if (player.position === 'GK' && (currentByPosition.GK || 0) < slots.gk) canAdd = true;
    if (player.position === 'DEF' && (currentByPosition.DEF || 0) < slots.def) canAdd = true;
    if (player.position === 'MID' && (currentByPosition.MID || 0) < slots.mid) canAdd = true;
    if (player.position === 'ATK' && (currentByPosition.ATK || 0) < slots.att) canAdd = true;

    if (!canAdd) {
      toast({
        title: "Formação completa",
        description: `Não há mais vagas para a posição ${player.position} na formação ${formation}`,
        variant: "destructive",
      });
      return;
    }

    setStarters([...starters, player]);
    setSubstitutes(substitutes.filter(p => p.id !== player.id));
    setBench(bench.filter(p => p.id !== player.id));
  };

  const moveToSubstitutes = (player: Player) => {
    if (substitutes.length >= 7) {
      toast({
        title: "Banco lotado",
        description: "Máximo de 7 jogadores no banco de reservas",
        variant: "destructive",
      });
      return;
    }

    setSubstitutes([...substitutes, player]);
    setStarters(starters.filter(p => p.id !== player.id));
    setBench(bench.filter(p => p.id !== player.id));
  };

  const moveToBench = (player: Player) => {
    setBench([...bench, player]);
    setStarters(starters.filter(p => p.id !== player.id));
    setSubstitutes(substitutes.filter(p => p.id !== player.id));
  };

  const handleSave = async () => {
    const slots = getFormationSlots();
    const startersByPosition = starters.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if ((startersByPosition.GK || 0) !== slots.gk ||
        (startersByPosition.DEF || 0) !== slots.def ||
        (startersByPosition.MID || 0) !== slots.mid ||
        (startersByPosition.ATK || 0) !== slots.att) {
      toast({
        title: "Formação incompleta",
        description: `Complete a formação ${formation}: ${slots.gk} GK, ${slots.def} DEF, ${slots.mid} MID, ${slots.att} ATK`,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const starterIds = starters.map(p => p.id);
      const substituteIds = substitutes.map(p => p.id);
      
      const result = await SupabaseGameService.updateClubLineup(clubId, starterIds, substituteIds);
      
      if (result.success) {
        toast({
          title: "Escalação salva!",
          description: "A escalação foi atualizada com sucesso",
        });
        onSave();
      } else {
        throw new Error("Erro ao salvar escalação");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a escalação",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const PlayerCard = ({ player, onMove, buttonText, buttonVariant }: {
    player: Player;
    onMove: () => void;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary' | 'danger';
  }) => (
    <div className="bg-retro-gray-dark p-3 rounded border border-retro-white-lines">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-pixel text-retro-white-lines text-sm font-bold">{player.name}</p>
          <p className="font-pixel text-retro-yellow-highlight text-xs">{player.position} • {player.age} anos</p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-retro-white-lines text-xs">OVR: {player.overall}</p>
          <p className="font-pixel text-retro-yellow-highlight text-xs">POT: {player.potential}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-1 mb-2 text-xs font-pixel text-retro-white-lines">
        <div>PAC: {player.attributes.pace}</div>
        <div>SHO: {player.attributes.shooting}</div>
        <div>PAS: {player.attributes.passing}</div>
        <div>DEF: {player.attributes.defending}</div>
        <div>DRI: {player.attributes.dribbling}</div>
        <div>PHY: {player.attributes.physical}</div>
      </div>
      
      <PixelButton
        onClick={onMove}
        variant={buttonVariant}
        size="sm"
        className="w-full"
      >
        {buttonText}
      </PixelButton>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <PixelBackground type="field" />
      
      <div className="bg-retro-green-dark/95 text-retro-white-lines border-b-4 border-retro-yellow-highlight relative z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <PixelButton onClick={onBack} variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </PixelButton>
            <h1 className="text-xl font-pixel font-bold">⚽ Escalação ({formation})</h1>
          </div>
          
          <PixelButton
            onClick={handleSave}
            variant="primary"
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </PixelButton>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Titulares */}
          <PixelCard>
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                🟢 Titulares ({starters.length}/11)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {starters.map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onMove={() => moveToBench(player)}
                    buttonText="Remover"
                    buttonVariant="danger"
                  />
                ))}
              </div>
            </CardContent>
          </PixelCard>

          {/* Reservas */}
          <PixelCard>
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                🟡 Banco ({substitutes.length}/7)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {substitutes.map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onMove={() => moveToStarters(player)}
                    buttonText="Titular"
                    buttonVariant="primary"
                  />
                ))}
              </div>
            </CardContent>
          </PixelCard>

          {/* Elenco */}
          <PixelCard>
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines flex items-center">
                ⚪ Elenco ({bench.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bench.map(player => (
                  <div key={player.id} className="space-y-2">
                    <PlayerCard
                      player={player}
                      onMove={() => moveToStarters(player)}
                      buttonText="➡️ Titular"
                      buttonVariant="primary"
                    />
                    <PixelButton
                      onClick={() => moveToSubstitutes(player)}
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      ➡️ Banco
                    </PixelButton>
                  </div>
                ))}
              </div>
            </CardContent>
          </PixelCard>
        </div>

        {/* Resumo da formação */}
        <div className="mt-6">
          <PixelCard variant="highlight">
            <CardContent className="text-center">
              <h3 className="font-pixel text-lg font-bold mb-2">📋 Resumo da Formação {formation}</h3>
              <div className="grid grid-cols-4 gap-4">
                {['GK', 'DEF', 'MID', 'ATK'].map(position => {
                  const count = starters.filter(p => p.position === position).length;
                  const slots = getFormationSlots();
                  const required = position === 'GK' ? slots.gk : 
                                 position === 'DEF' ? slots.def :
                                 position === 'MID' ? slots.mid : slots.att;
                  
                  return (
                    <div key={position} className="text-center">
                      <p className="font-pixel text-sm">{position}</p>
                      <p className={`font-pixel text-lg font-bold ${count === required ? 'text-green-600' : 'text-red-600'}`}>
                        {count}/{required}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </PixelCard>
        </div>
      </div>
    </div>
  );
};

export default LineupScreen;
