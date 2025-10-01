import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCog, Plus, LogOut, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profissional {
  id: string;
  nome: string;
  especialidades: string[];
  ativo: boolean;
  foto_url?: string;
}

export const Professionals = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    especialidades: "",
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadProfissionais();
  }, [user]);

  const loadProfissionais = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setProfissionais(data || []);
    } catch (error: any) {
      console.error('Error loading professionals:', error);
      toast({
        title: "Erro ao carregar profissionais",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !profile?.salao_id) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create auth user for professional
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-8), // Temporary password
        options: {
          data: {
            nome: formData.nome,
            tipo: 'profissional'
          }
        }
      });

      if (authError) throw authError;

      // Create professional record
      const { error: profError } = await supabase
        .from('profissionais')
        .insert([{
          nome: formData.nome,
          especialidades: formData.especialidades.split(',').map(s => s.trim()),
          salao_id: profile.salao_id,
          user_id: authData.user?.id,
          ativo: true,
        }]);

      if (profError) throw profError;

      toast({
        title: "Profissional cadastrado!",
        description: "Um email foi enviado para definir a senha.",
      });

      setIsDialogOpen(false);
      setFormData({
        nome: "",
        email: "",
        especialidades: "",
      });
      loadProfissionais();
    } catch (error: any) {
      console.error('Error creating professional:', error);
      toast({
        title: "Erro ao cadastrar profissional",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold font-display text-foreground">
              Profissionais
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <UserCog className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Gerenciar Profissionais</h2>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent">
                <Plus className="h-4 w-4 mr-2" />
                Novo Profissional
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Profissional</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Ana Silva"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ana@exemplo.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Um email será enviado para configurar a senha
                  </p>
                </div>
                <div>
                  <Label htmlFor="especialidades">Especialidades</Label>
                  <Input
                    id="especialidades"
                    value={formData.especialidades}
                    onChange={(e) => setFormData({ ...formData, especialidades: e.target.value })}
                    placeholder="Ex: Corte, Coloração, Manicure"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separe múltiplas especialidades por vírgula
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Cadastrando..." : "Cadastrar Profissional"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Professionals List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando profissionais...
          </div>
        ) : profissionais.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum profissional cadastrado ainda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profissionais.map((profissional) => (
              <Card key={profissional.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{profissional.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {profissional.especialidades.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profissional.especialidades.map((esp, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
