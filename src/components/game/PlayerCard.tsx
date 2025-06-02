
import { Player } from '@/types/game';

interface PlayerCardProps {
  player: Player;
  showDetails?: boolean;
}

const PlayerCard = ({ player, showDetails = false }: PlayerCardProps) => {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return 'bg-retro-yellow-highlight text-retro-green-dark';
      case 'DEF': return 'bg-retro-blue-team text-white';
      case 'MID': return 'bg-retro-green-field text-white';
      case 'ATK': return 'bg-retro-red-team text-white';
      default: return 'bg-retro-gray-concrete text-white';
    }
  };

  const getOverallColor = (overall: number) => {
    if (overall >= 80) return 'text-green-400';
    if (overall >= 70) return 'text-yellow-400';
    if (overall >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-retro-gray-concrete border-2 border-retro-white-lines rounded-lg p-4 hover:border-retro-yellow-highlight transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-pixel font-bold text-retro-white-lines">{player.name}</h3>
          <p className="text-sm text-retro-white-lines opacity-80">Idade: {player.age}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-pixel font-bold ${getPositionColor(player.position)}`}>
            {player.position}
          </span>
          <span className={`font-pixel font-bold text-lg ${getOverallColor(player.overall)}`}>
            {player.overall}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-retro-white-lines opacity-80">Velocidade:</span>
              <span className="text-retro-white-lines font-bold">{player.attributes.pace}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-retro-white-lines opacity-80">Finalização:</span>
              <span className="text-retro-white-lines font-bold">{player.attributes.shooting}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-retro-white-lines opacity-80">Passe:</span>
              <span className="text-retro-white-lines font-bold">{player.attributes.passing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-retro-white-lines opacity-80">Defesa:</span>
              <span className="text-retro-white-lines font-bold">{player.attributes.defending}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-retro-white-lines opacity-50">
            <span className="text-retro-yellow-highlight font-pixel text-sm">
              €{player.salary.toLocaleString()}/mês
            </span>
            <div className="text-xs text-retro-white-lines opacity-80">
              Moral: {player.morale}% | Stamina: {player.stamina}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
