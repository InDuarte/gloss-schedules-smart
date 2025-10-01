import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Scissors, Plus, LogOut, Clock, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao_minutos: number;
  ativo: boolean;
}

export const Services = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    duracao_minutos: "60",
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadServicos();
  }, [user]);

  const loadServicos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setServicos(data || []);
    } catch (error: any) {
      console.error('Error loading services:', error);
      toast({
        title: "Erro ao carregar serviços",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.preco || !profile?.salao_id) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e preço são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('servicos')
        .insert([{
          nome: formData.nome,
          descricao: formData.descricao || null,
          preco: parseFloat(formData.preco),
          duracao_minutos: parseInt(formData.duracao_minutos),
          salao_id: profile.salao_id,
          ativo: true,
        }]);

      if (error) throw error;

      toast({
        title: "Serviço cadastrado!",
        description: "Serviço adicionado com sucesso.",
      });

      setIsDialogOpen(false);
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        duracao_minutos: "60",
      });
      loadServicos();
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: "Erro ao cadastrar serviço",
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
              Serviços
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
            <Scissors className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Gerenciar Serviços</h2>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent">
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Serviço *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Corte Feminino"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o serviço..."
                  />
                </div>
                <div>
                  <Label htmlFor="preco">Preço (R$) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duracao">Duração (minutos) *</Label>
                  <Input
                    id="duracao"
                    type="number"
                    value={formData.duracao_minutos}
                    onChange={(e) => setFormData({ ...formData, duracao_minutos: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Salvando..." : "Cadastrar Serviço"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando serviços...
          </div>
        ) : servicos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Scissors className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum serviço cadastrado ainda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicos.map((servico) => (
              <Card key={servico.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{servico.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {servico.descricao && (
                    <p className="text-sm text-muted-foreground">{servico.descricao}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      R$ {servico.preco.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {servico.duracao_minutos} min
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
