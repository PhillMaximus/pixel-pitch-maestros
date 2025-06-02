
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { Trophy, Users } from 'lucide-react';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { dispatch } = useGame();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !name)) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const displayName = isLogin ? email.split('@')[0] : name;
    dispatch({ type: 'LOGIN', payload: { email, name: displayName } });
  };

  return (
    <div className="min-h-screen bg-retro-green-field flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-retro-yellow-highlight rounded-lg flex items-center justify-center mr-3">
              <Trophy className="w-8 h-8 text-retro-green-dark" />
            </div>
            <h1 className="text-3xl font-pixel font-bold text-retro-white-lines">
              Football Manager Retrô
            </h1>
          </div>
          <p className="text-retro-white-lines opacity-80 font-pixel">
            Gerencie seu clube dos sonhos!
          </p>
        </div>

        <Card className="bg-retro-gray-concrete border-retro-white-lines border-2">
          <CardHeader>
            <CardTitle className="font-pixel text-retro-white-lines text-center">
              {isLogin ? 'Entrar no Jogo' : 'Criar Conta'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-retro-white-lines font-pixel mb-2">
                    Nome do Treinador
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-retro-green-dark text-retro-white-lines border-retro-white-lines font-pixel"
                    placeholder="Digite seu nome"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-retro-white-lines font-pixel mb-2">
                  E-mail
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-retro-green-dark text-retro-white-lines border-retro-white-lines font-pixel"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-retro-white-lines font-pixel mb-2">
                  Senha
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-retro-green-dark text-retro-white-lines border-retro-white-lines font-pixel"
                  placeholder="••••••••"
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel font-bold"
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-retro-yellow-highlight hover:text-yellow-300 font-pixel text-sm underline"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthScreen;
