
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Trophy, Users, Target, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PixelButton from '@/components/pixel/PixelButton';
import PixelCard from '@/components/pixel/PixelCard';

interface WelcomeTutorialProps {
  onComplete: () => void;
  managerName: string;
}

const WelcomeTutorial = ({ onComplete, managerName }: WelcomeTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: `Bem-vindo, ${managerName}!`,
      icon: <Trophy className="w-8 h-8 text-retro-yellow-highlight" />,
      content: (
        <div className="text-center space-y-4">
          <p className="font-pixel text-retro-white-lines">
            🎉 Parabéns por se tornar um treinador no Phillfoot Live Soccer!
          </p>
          <p className="font-pixel text-sm text-retro-white-lines opacity-80">
            Este tutorial vai te ensinar o básico para começar sua carreira.
          </p>
        </div>
      )
    },
    {
      title: "Escolha seu Clube",
      icon: <Users className="w-8 h-8 text-retro-yellow-highlight" />,
      content: (
        <div className="space-y-4">
          <p className="font-pixel text-retro-white-lines">
            🏟️ Primeiro, você precisa escolher um clube para treinar.
          </p>
          <p className="font-pixel text-sm text-retro-white-lines opacity-80">
            Comece com clubes pequenos e construa sua reputação gradualmente.
          </p>
          <div className="bg-retro-gray-dark p-3 rounded border border-retro-yellow-highlight">
            <p className="font-pixel text-xs text-retro-yellow-highlight">
              💡 Dica: Clubes com menor reputação são mais fáceis de conseguir no início!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Gerencie seu Time",
      icon: <Target className="w-8 h-8 text-retro-yellow-highlight" />,
      content: (
        <div className="space-y-4">
          <p className="font-pixel text-retro-white-lines">
            ⚽ Como treinador, você pode:
          </p>
          <ul className="font-pixel text-sm text-retro-white-lines space-y-2">
            <li>• 📋 Definir escalação e formação</li>
            <li>• 🏃 Organizar treinos para melhorar jogadores</li>
            <li>• 🎯 Escolher táticas de jogo</li>
            <li>• 💬 Fazer preleção antes das partidas</li>
          </ul>
        </div>
      )
    },
    {
      title: "Multiplayer e Campeonatos",
      icon: <Gamepad2 className="w-8 h-8 text-retro-yellow-highlight" />,
      content: (
        <div className="space-y-4">
          <p className="font-pixel text-retro-white-lines">
            🏆 Crie ou participe de campeonatos:
          </p>
          <ul className="font-pixel text-sm text-retro-white-lines space-y-2">
            <li>• 🆕 Crie suas próprias ligas privadas</li>
            <li>• 👥 Convide amigos para competir</li>
            <li>• 🔍 Busque ligas públicas disponíveis</li>
            <li>• 📊 Acompanhe classificações em tempo real</li>
          </ul>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen bg-retro-green-field flex items-center justify-center p-4">
      <PixelCard className="w-full max-w-2xl">
        <CardHeader className="text-center bg-retro-green-dark border-b-2 border-retro-yellow-highlight">
          <div className="flex justify-center mb-4">
            {currentTutorial.icon}
          </div>
          <CardTitle className="font-pixel text-xl text-retro-white-lines">
            {currentTutorial.title}
          </CardTitle>
          <p className="font-pixel text-sm text-retro-yellow-highlight">
            Passo {currentStep + 1} de {tutorialSteps.length}
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          {currentTutorial.content}
          
          <div className="flex justify-between items-center mt-8">
            <PixelButton
              onClick={prevStep}
              variant="secondary"
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </PixelButton>
            
            <div className="flex space-x-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep 
                      ? 'bg-retro-yellow-highlight' 
                      : 'bg-retro-gray-dark border border-retro-white-lines'
                  }`}
                />
              ))}
            </div>
            
            <PixelButton
              onClick={nextStep}
              variant="primary"
              className="flex items-center"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Começar!' : 'Próximo'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </PixelButton>
          </div>
        </CardContent>
      </PixelCard>
    </div>
  );
};

export default WelcomeTutorial;
