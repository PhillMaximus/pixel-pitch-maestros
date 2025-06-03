
import { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trophy, UserPlus, LogIn, Mail, Lock, User } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import PixelBackground from '@/components/pixel/PixelBackground';
import PixelCard from '@/components/pixel/PixelCard';
import PixelButton from '@/components/pixel/PixelButton';
import AudioPlayer from '@/components/audio/AudioPlayer';

interface AuthScreenProps {
  onAuthSuccess: (user: any, hasManager: boolean) => void;
}

const AuthScreen = ({ onAuthSuccess }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Senha muito fraca",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A confirmação de senha deve ser igual à senha",
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
          toast({
            title: "Login realizado!",
            description: `Bem-vindo de volta, ${user.user_metadata?.name || user.email}!`,
          });
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
          setEmailVerificationSent(true);
          toast({
            title: "Conta criada com sucesso!",
            description: "Verifique seu email para confirmar a conta antes de fazer login.",
          });
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

  if (emailVerificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <PixelBackground type="menu" />
        
        <div className="absolute top-4 right-4 z-10">
          <AudioPlayer src="/sounds/chiptune-menu.mp3" autoPlay />
        </div>

        <PixelCard className="w-full max-w-md z-10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-retro-yellow-highlight rounded-lg flex items-center justify-center mb-4 animate-pixel-bounce">
              <Mail className="w-8 h-8 text-retro-green-dark" />
            </div>
            <CardTitle className="font-pixel text-retro-white-lines text-xl">
              Email de Verificação Enviado
            </CardTitle>
            <p className="text-retro-white-lines opacity-80 font-pixel text-sm">
              Verifique sua caixa de entrada e clique no link para ativar sua conta
            </p>
          </CardHeader>
          
          <CardContent className="text-center">
            <PixelButton
              onClick={() => {
                setEmailVerificationSent(false);
                setIsLogin(true);
                setEmail('');
                setPassword('');
                setName('');
                setConfirmPassword('');
              }}
              variant="primary"
              className="w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Voltar para Login
            </PixelButton>
          </CardContent>
        </PixelCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <PixelBackground type="menu" />
      
      <div className="absolute top-4 right-4 z-10">
        <AudioPlayer src="/sounds/chiptune-menu.mp3" autoPlay />
      </div>

      <PixelCard className="w-full max-w-md z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-retro-yellow-highlight rounded-lg flex items-center justify-center mb-4 animate-pixel-bounce">
            <Trophy className="w-8 h-8 text-retro-green-dark" />
          </div>
          <CardTitle className="font-pixel text-retro-white-lines text-xl">
            Phillfoot Live Soccer
          </CardTitle>
          <p className="text-retro-white-lines opacity-80 font-pixel text-sm">
            {isLogin ? 'Entre na sua conta de treinador' : 'Crie sua conta de treinador'}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-white-lines opacity-60" />
                <Input
                  type="text"
                  placeholder="Nome do treinador"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel pl-10 border-2"
                  disabled={loading}
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-white-lines opacity-60" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel pl-10 border-2"
                disabled={loading}
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-white-lines opacity-60" />
              <Input
                type="password"
                placeholder="Senha (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel pl-10 border-2"
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-white-lines opacity-60" />
                <Input
                  type="password"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-retro-gray-dark border-retro-white-lines text-retro-white-lines font-pixel pl-10 border-2"
                  disabled={loading}
                  required
                />
              </div>
            )}
            
            <PixelButton
              type="submit"
              variant="primary"
              className="w-full"
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
            </PixelButton>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
                setConfirmPassword('');
                setEmailVerificationSent(false);
              }}
              className="text-retro-yellow-highlight font-pixel text-sm hover:text-yellow-300 transition-colors underline"
              disabled={loading}
            >
              {isLogin ? 'Criar nova conta' : 'Já tem uma conta? Entrar'}
            </button>
          </div>

          {!isLogin && (
            <div className="mt-4 p-3 bg-retro-gray-dark rounded border border-retro-white-lines">
              <p className="text-retro-white-lines font-pixel text-xs text-center">
                ⚽ Após o cadastro, você receberá um email de verificação para ativar sua conta
              </p>
            </div>
          )}
        </CardContent>
      </PixelCard>
    </div>
  );
};

export default AuthScreen;
