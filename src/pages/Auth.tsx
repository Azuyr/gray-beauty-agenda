
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, resetPassword } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isResetPassword) {
      if (!email) {
        toast({
          title: "Erro",
          description: "Por favor, digite seu email.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      try {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Erro",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Email enviado!",
            description: "Verifique sua caixa de entrada para redefinir sua senha.",
          });
          setIsResetPassword(false);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
      return;
    }
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !fullName) {
      toast({
        title: "Erro",
        description: "Por favor, preencha seu nome completo.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Erro no login",
            description: error.message === "Invalid login credentials" 
              ? "Email ou senha incorretos." 
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo de volta ao BeautyBook.",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Erro no cadastro",
              description: "Este email já está cadastrado. Tente fazer login.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro no cadastro",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Verifique seu email para confirmar a conta.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-gray-50 to-brand-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-brand-gray-700 rounded-full mr-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-gray-700 to-brand-gray-900 bg-clip-text text-transparent">
              BeautyBook
            </h1>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">
              {isResetPassword ? "Recuperar senha" : (isLogin ? "Faça seu login" : "Criar conta")}
            </CardTitle>
            <p className="text-slate-400">
              {isResetPassword 
                ? "Digite seu email para receber as instruções" 
                : (isLogin 
                  ? "Entre em sua conta para continuar" 
                  : "Crie sua conta e comece seu teste grátis"
                )
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && !isResetPassword && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              
              {!isResetPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
              )}

              <Button 
                type="submit"
                className="w-full py-3 text-lg transition-all duration-200 transform hover:scale-105"
                size="lg"
                disabled={loading}
              >
                {loading ? "Processando..." : (isResetPassword ? "Enviar instruções" : (isLogin ? "Entrar" : "Criar conta"))}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {!isResetPassword && (
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 transition-colors block w-full"
                >
                  {isLogin 
                    ? "Não tem uma conta? Cadastre-se" 
                    : "Já tem uma conta? Faça login"
                  }
                </button>
              )}
              
              {isLogin && !isResetPassword && (
                <button
                  type="button"
                  onClick={() => setIsResetPassword(true)}
                  className="text-slate-400 hover:text-slate-300 transition-colors block w-full"
                >
                  Esqueceu sua senha?
                </button>
              )}
              
              {isResetPassword && (
                <button
                  type="button"
                  onClick={() => setIsResetPassword(false)}
                  className="text-blue-400 hover:text-blue-300 transition-colors block w-full"
                >
                  Voltar ao login
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
