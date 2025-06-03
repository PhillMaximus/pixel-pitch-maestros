import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingType } from '@/types/game';
import { gameService } from '@/services/gameService';
import { Dumbbell, Brain, Target, Bed } from 'lucide-react';

interface TrainingManagerProps {
  clubId: string;
  currentTraining?: TrainingType;
}

const TrainingManager = ({ clubId, currentTraining }: TrainingManagerProps) => {
  const [selectedTraining, setSelectedTraining] = useState<TrainingType>(currentTraining || 'physical');

  const trainingOptions = [
    {
      type: 'physical' as TrainingType,
      name: 'Treino Físico',
      description: 'Melhora resistência e força dos jogadores',
      icon: Dumbbell,
      color: 'bg-red-600'
    },
    {
      type: 'tactical' as TrainingType,
      name: 'Treino Tático',
      description: 'Aprimora posicionamento e movimentação',
      icon: Brain,
      color: 'bg-blue-600'
    },
    {
      type: 'technical' as TrainingType,
      name: 'Treino Técnico',
      description: 'Desenvolve habilidades com a bola',
      icon: Target,
      color: 'bg-green-600'
    },
    {
      type: 'mental' as TrainingType,
      name: 'Descanso Mental',
      description: 'Recupera energia e moral dos jogadores',
      icon: Bed,
      color: 'bg-gray-600'
    }
  ];

  const handleApplyTraining = () => {
    console.log('Setting training:', selectedTraining, 'for club:', clubId);
  };

  return (
    <Card className="bg-retro-gray-concrete border-retro-white-lines">
      <CardHeader>
        <CardTitle className="font-pixel text-retro-white-lines">Treinos da Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {trainingOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedTraining === option.type;
            
            return (
              <div
                key={option.type}
                onClick={() => setSelectedTraining(option.type)}
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
          onClick={handleApplyTraining}
          className="w-full bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
        >
          Aplicar Treino Selecionado
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrainingManager;
