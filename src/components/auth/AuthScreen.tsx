
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trophy, UserPlus, LogIn } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

interface AuthScreenProps {
  onAuthSuccess: (user: any, hasManager: boolean) => void;
}

const AuthScreen = ({ onAuthSuccess }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { user, error } = await AuthService.signIn(email, password);
        if (error) {
          toast({
            title: "Erro no login",
            description: error.message || "Email ou senha incorretos",
            variant: "destructive",
          });
          return;
        }

        if (user) {
          const manager = await AuthService.getManagerByUserId(user.id);
          onAuthSuccess(user, !!manager);
        }
      } else {
        const { user, error } = await AuthService.signUp(email, password, name);
        if (error) {
          toast({
            title: "Erro no cadastro",
            description: error.message || "Erro ao criar conta",
            variant: "destructive",
          });
          return;
        }

        if (user) {
          toast({
            title: "Conta criada!",
            description: "Faça login para continuar",
          });
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setName('');
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-green-field flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-retro-gray-concrete border-retro-white-lines border-2">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-retro-yellow-highlight rounded-lg flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-retro-green-dark" />
          </div>
          <CardTitle className="font-pixel text-retro-white-lines text-xl">
            Football Manager Retrô
          </CardTitle>
          <p className="text-retro-white-lines opacity-80 font-pixel text-sm">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta de treinador'}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Nome do treinador"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel"
                  disabled={loading}
                />
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel"
                disabled={loading}
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel"
                disabled={loading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 font-pixel"
              disabled={loading}
            >
              {loading ? (
                <span>Carregando...</span>
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Cadastrar
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="text-retro-yellow-highlight font-pixel text-sm hover:text-yellow-300 transition-colors"
              disabled={loading}
            >
              {isLogin ? 'Criar nova conta' : 'Já tem uma conta? Entrar'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
