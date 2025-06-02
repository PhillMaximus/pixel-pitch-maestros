
import { Match } from '@/types/game';

interface MatchResultProps {
  match: Match;
}

const MatchResult = ({ match }: MatchResultProps) => {
  const isWin = match.score && match.score.home > match.score.away;
  const isDraw = match.score && match.score.home === match.score.away;
  
  const getResultColor = () => {
    if (isWin) return 'bg-green-600';
    if (isDraw) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className={`${getResultColor()} rounded-lg p-4 text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-pixel font-bold">{match.homeTeam}</p>
          <p className="text-xs opacity-80">Casa</p>
        </div>
        
        <div className="flex items-center space-x-4 mx-4">
          <span className="text-2xl font-pixel font-bold">
            {match.score?.home || 0}
          </span>
          <span className="text-lg opacity-60">-</span>
          <span className="text-2xl font-pixel font-bold">
            {match.score?.away || 0}
          </span>
        </div>
        
        <div className="flex-1 text-right">
          <p className="font-pixel font-bold">{match.awayTeam}</p>
          <p className="text-xs opacity-80">Visitante</p>
        </div>
      </div>
      
      <div className="mt-2 text-center text-xs opacity-80">
        {new Date(match.date).toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
};

export default MatchResult;
