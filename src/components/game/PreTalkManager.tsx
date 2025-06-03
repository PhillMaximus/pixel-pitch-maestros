import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PreTalkType } from '@/types/game';
import { gameService } from '@/services/gameService';
import { Zap, Sword, Heart, Brain } from 'lucide-react';

interface PreTalkManagerProps {
  clubId: string;
  currentPreTalk?: PreTalkType;
}

const PreTalkManager = ({ clubId, currentPreTalk }: PreTalkManagerProps) => {
  const [selectedPreTalk, setSelectedPreTalk] = useState<PreTalkType>(currentPreTalk || 'motivational');

  const preTalkOptions = [
    {
      type: 'motivational' as PreTalkType,
      name: 'Motivacional',
      description: 'Inspire os jogadores a darem o máximo',
      icon: Zap,
      color: 'bg-yellow-600'
    },
    {
      type: 'tactical' as PreTalkType,
      name: 'Tática',
      description: 'Foque nas instruções técnicas',
      icon: Brain,
      color: 'bg-green-600'
    },
    {
      type: 'pressure' as PreTalkType,
      name: 'Pressão',
      description: 'Deixe o time mais combativo',
      icon: Sword,
      color: 'bg-red-600'
    },
    {
      type: 'relaxed' as PreTalkType,
      name: 'Tranquila',
      description: 'Mantenha os jogadores calmos e focados',
      icon: Heart,
      color: 'bg-blue-600'
    }
  ];

  const handleApplyPreTalk = () => {
    console.log('Setting pre-talk:', selectedPreTalk, 'for club:', clubId);
  };

  return (
    <Card className="bg-retro-gray-concrete border-retro-white-lines">
      <CardHeader>
        <CardTitle className="font-pixel text-retro-white-lines">Preleção Pré-Jogo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {preTalkOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPreTalk === option.type;
            
            return (
              <div
                key={option.type}
                onClick={() => setSelectedPreTalk(option.type)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-retro-yellow-highlight bg-retro-green-dark' 
                    : 'border-retro-white-lines hover:border-retro-yellow-highlight'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-retro-white-lines font-bold">
                      {option.name}
                    </h3>
                    <p className="text-retro-white-lines opacity-80 font-pixel text-xs">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <Button
          onClick={handleApplyPreTalk}
          className="w-full bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
        >
          Definir Preleção
        </Button>
      </CardContent>
    </Card>
  );
};

export default PreTalkManager;
