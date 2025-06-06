
import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Club } from '@/types/game';
import { SupabaseGameService } from '@/services/supabaseGameService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Trophy, MapPin, DollarSign, Target } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PixelBackground from '@/components/pixel/PixelBackground';
import PlayerSprite from '@/components/retro/PlayerSprite';
import SoccerFieldSprite from '@/components/retro/SoccerFieldSprite';

interface ClubSelectionScreenProps {
  onBack: () => void;
  onSelectClub: (clubId: string) => void;
}

const ClubSelectionScreen = ({ onBack, onSelectClub }: ClubSelectionScreenProps) => {
  const { state } = useGame();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadClubs = async () => {
      try {
        const availableClubs = await SupabaseGameService.getAvailableClubs();
        // Filtrar apenas clubes pequenos para iniciantes
        const smallClubs = availableClubs.filter(club => club.reputation <= 60);
        setClubs(smallClubs);
      } catch (error) {
        console.error('Erro ao carregar clubes:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar clubes disponíveis",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, [toast]);

  const handleSelectClub = async () => {
    if (!selectedClubId) return;
    
    try {
      setLoading(true);
      await onSelectClub(selectedClubId);
      
      toast({
        title: "Clube selecionado!",
        description: "Bem-vindo ao seu novo clube. Boa sorte, treinador!",
      });
    } catch (error) {
      console.error('Erro ao selecionar clube:', error);
      toast({
        title: "Erro",
        description: "Erro ao selecionar clube",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getReputationText = (reputation: number) => {
    if (reputation <= 30) return "Iniciante";
    if (reputation <= 50) return "Amador";
    if (reputation <= 70) return "Semi-Profissional";
    return "Profissional";
  };

  const getReputationColor = (reputation: number) => {
    if (reputation <= 30) return "#F44336";
    if (reputation <= 50) return "#FF9800";
    if (reputation <= 70) return "#FFC107";
    return "#4CAF50";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-green-field flex items-center justify-center">
        <PixelBackground type="field" />
        <div className="text-retro-white-lines font-pixel text-xl animate-pulse relative z-10">
          Carregando clubes disponíveis...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <PixelBackground type="field" />
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 opacity-20 z-0">
        <SoccerFieldSprite size="large" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 z-0">
        <PlayerSprite position="ATK" size="large" teamColor="#FFD700" />
      </div>
      
      {/* Header */}
      <div className="bg-retro-green-dark/95 text-retro-white-lines border-b-4 border-retro-yellow-highlight relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-retro-white-lines text-retro-white-lines hover:bg-retro-white-lines hover:text-retro-green-dark font-pixel"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              
              <div>
                <h1 className="text-2xl font-pixel font-bold">⚽ Seleção de Clube ⚽</h1>
                <p className="text-retro-yellow-highlight font-pixel">
                  Escolha seu primeiro clube, {state.user?.user_metadata?.name || 'Treinador'}!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Instruções */}
          <Card className="mb-8 bg-retro-gray-dark/90 border-retro-yellow-highlight border-2">
            <CardHeader>
              <CardTitle className="font-pixel text-retro-white-lines text-center">
                🎯 Começando sua Carreira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-retro-white-lines font-pixel text-center text-sm">
                Como novo treinador, você deve começar em um clube pequeno. 
                Prove seu valor e clubes maiores irão te procurar!
              </p>
            </CardContent>
          </Card>

          {/* Lista de clubes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <Card 
                key={club.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedClubId === club.id 
                    ? 'border-retro-yellow-highlight bg-retro-yellow-highlight/20 transform scale-105' 
                    : 'border-retro-gray-concrete bg-retro-gray-dark/90 hover:border-retro-white-lines'
                }`}
                onClick={() => setSelectedClubId(club.id)}
              >
                <CardHeader className="text-center">
                  <div 
                    className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-3xl mb-2"
                    style={{ 
                      backgroundColor: club.primary_color,
                      color: club.secondary_color 
                    }}
                  >
                    {club.emblem}
                  </div>
                  <CardTitle className="font-pixel text-retro-white-lines text-lg">
                    {club.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-retro-white-lines opacity-80">
                      Reputação:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span 
                        className="font-pixel text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: getReputationColor(club.reputation),
                          color: '#FFFFFF'
                        }}
                      >
                        {getReputationText(club.reputation)}
                      </span>
                      <span className="font-pixel text-xs text-retro-white-lines">
                        {club.reputation}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 text-retro-yellow-highlight" />
                    <span className="font-pixel text-xs text-retro-white-lines">
                      {club.stadium_name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3 text-retro-yellow-highlight" />
                    <span className="font-pixel text-xs text-retro-white-lines">
                      Capacidade: {club.stadium_capacity.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-3 h-3 text-retro-yellow-highlight" />
                    <span className="font-pixel text-xs text-retro-white-lines">
                      Orçamento: €{club.budget.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-3 h-3 text-retro-yellow-highlight" />
                    <span className="font-pixel text-xs text-retro-white-lines">
                      Liga: {club.league}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Botão de confirmação */}
          {selectedClubId && (
            <div className="text-center mt-8">
              <Card className="inline-block bg-retro-yellow-highlight/90 border-retro-green-dark border-2">
                <CardContent className="p-6">
                  <Button
                    onClick={handleSelectClub}
                    disabled={loading}
                    className="bg-retro-green-dark text-retro-white-lines hover:bg-retro-green-field font-pixel text-lg px-8 py-3"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    {loading ? 'Selecionando...' : 'Confirmar Escolha'}
                  </Button>
                  <p className="font-pixel text-xs text-retro-green-dark mt-2">
                    Você pode mudar de clube mais tarde com base em seu desempenho
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubSelectionScreen;
