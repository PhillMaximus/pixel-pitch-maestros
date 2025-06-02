
import { Trophy, Users, Calendar } from 'lucide-react';

interface HeaderProps {
  managerName: string;
  clubName: string;
  reputation: number;
  budget: number;
}

const Header = ({ managerName, clubName, reputation, budget }: HeaderProps) => {
  return (
    <div className="bg-retro-green-dark text-retro-white-lines border-b-4 border-retro-yellow-highlight">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-retro-yellow-highlight rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-retro-green-dark" />
            </div>
            <div>
              <h1 className="text-xl font-pixel font-bold">{clubName}</h1>
              <p className="text-sm text-retro-yellow-highlight">Treinador: {managerName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="font-pixel text-sm">Rep: {reputation}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="font-pixel text-sm">€{budget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
