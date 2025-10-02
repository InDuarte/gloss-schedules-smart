import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, User, Mail, Lock, Phone, ArrowLeft, Building2, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'cliente' | 'admin'>('cliente');
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    nome: "", 
    email: "", 
    telefone: "", 
    password: "",
    // Dados do salão (só para admin)
    nomeSalao: "",
    enderecoSalao: "",
    telefoneSalao: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      switch (profile.tipo) {
        case 'super_admin':
          navigate('/super-admin');
          break;
        case 'admin':
          navigate('/dashboard');
          break;
        case 'profissional':
          navigate('/dashboard');
          break;
        default:
          navigate('/booking');
      }
    }
  }, [user, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao StudioGloss.",
      });

      // Navigation will be handled by useEffect
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validações específicas para dono de salão
      if (userType === 'admin' && (!signupData.nomeSalao || !signupData.enderecoSalao)) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os dados do salão.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            nome: signupData.nome,
            telefone: signupData.telefone,
            tipo: userType,
          },
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;

      if (data.user?.identities?.length === 0) {
        toast({
          title: "Usuário já existe",
          description: "Este email já está cadastrado. Faça login para continuar.",
          variant: "destructive",
        });
        return;
      }

      // Se for admin, criar o salão
      if (userType === 'admin' && data.user) {
        const { data: salaoData, error: salaoError } = await supabase
          .from('saloes')
          .insert({
            nome: signupData.nomeSalao,
            endereco: signupData.enderecoSalao,
            telefone: signupData.telefoneSalao,
            whatsapp: signupData.telefoneSalao,
            email: signupData.email,
            admin_id: data.user.id,
          })
          .select()
          .single();

        if (salaoError) {
          console.error('Erro ao criar salão:', salaoError);
          toast({
            title: "Atenção",
            description: "Conta criada, mas houve erro ao criar o salão. Entre em contato com o suporte.",
            variant: "destructive",
          });
          return;
        }

        // Atualizar profile com salao_id
        if (salaoData) {
          await supabase
            .from('profiles')
            .update({ salao_id: salaoData.id })
            .eq('user_id', data.user.id);
        }
      }

      toast({
        title: "Conta criada com sucesso!",
        description: userType === 'admin' 
          ? "Verifique seu email para confirmar a conta e começar a configurar seu salão." 
          : "Verifique seu email para confirmar a conta.",
      });
      
      setSignupData({ 
        nome: "", 
        email: "", 
        telefone: "", 
        password: "",
        nomeSalao: "",
        enderecoSalao: "",
        telefoneSalao: "",
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-accent"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-secondary"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar ao início
        </Link>

        <Card className="shadow-strong border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-2xl bg-gradient-accent">
                <Sparkles className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display text-foreground">
              Bem-vindo ao StudioGloss
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sua plataforma premium de agendamento
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                <div className="text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                {/* Escolher tipo de usuário */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setUserType('cliente')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      userType === 'cliente' 
                        ? 'border-accent bg-accent/10' 
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Users className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <p className="font-semibold text-foreground">Sou Cliente</p>
                    <p className="text-xs text-muted-foreground mt-1">Quero agendar serviços</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserType('admin')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      userType === 'admin' 
                        ? 'border-accent bg-accent/10' 
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <p className="font-semibold text-foreground">Tenho um Salão</p>
                    <p className="text-xs text-muted-foreground mt-1">Quero gerenciar agendamentos</p>
                  </button>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Dados pessoais */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome"
                        className="pl-10"
                        value={signupData.nome}
                        onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        className="pl-10"
                        value={signupData.telefone}
                        onChange={(e) => setSignupData({ ...signupData, telefone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* Campos extras para dono de salão */}
                  {userType === 'admin' && (
                    <>
                      <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center">
                          <Building2 className="w-4 h-4 mr-2 text-accent" />
                          Dados do Salão
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salon-name">Nome do Salão</Label>
                        <Input
                          id="salon-name"
                          type="text"
                          placeholder="Studio Beauty"
                          value={signupData.nomeSalao}
                          onChange={(e) => setSignupData({ ...signupData, nomeSalao: e.target.value })}
                          required={userType === 'admin'}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salon-address">Endereço do Salão</Label>
                        <Input
                          id="salon-address"
                          type="text"
                          placeholder="Rua das Flores, 123 - Centro"
                          value={signupData.enderecoSalao}
                          onChange={(e) => setSignupData({ ...signupData, enderecoSalao: e.target.value })}
                          required={userType === 'admin'}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salon-phone">Telefone do Salão</Label>
                        <Input
                          id="salon-phone"
                          type="tel"
                          placeholder="(11) 3333-4444"
                          value={signupData.telefoneSalao}
                          onChange={(e) => setSignupData({ ...signupData, telefoneSalao: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : userType === 'admin' ? "Criar Salão" : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <button className="text-accent hover:underline">Termos de Uso</button>{" "}
            e{" "}
            <button className="text-accent hover:underline">Política de Privacidade</button>
          </p>
        </div>
      </div>
    </div>
  );
};