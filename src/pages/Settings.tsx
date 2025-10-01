import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings as SettingsIcon, LogOut, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Settings = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    whatsapp: "",
    email: "",
    endereco: "",
    link_personalizado: "",
    politica_cancelamento: "",
  });

  useEffect(() => {
    if (!user || !profile?.salao_id) {
      navigate('/auth');
      return;
    }
    loadSalaoData();
  }, [user, profile]);

  const loadSalaoData = async () => {
    if (!profile?.salao_id) return;

    try {
      const { data, error } = await supabase
        .from('saloes')
        .select('*')
        .eq('id', profile.salao_id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          nome: data.nome || "",
          telefone: data.telefone || "",
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          endereco: data.endereco || "",
          link_personalizado: data.link_personalizado || "",
          politica_cancelamento: data.politica_cancelamento || "",
        });
      }
    } catch (error: any) {
      console.error('Error loading salon data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.salao_id) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('saloes')
        .update({
          nome: formData.nome,
          telefone: formData.telefone,
          whatsapp: formData.whatsapp,
          email: formData.email,
          endereco: formData.endereco,
          link_personalizado: formData.link_personalizado,
          politica_cancelamento: formData.politica_cancelamento,
        })
        .eq('id', profile.salao_id);

      if (error) throw error;

      toast({
        title: "Configurações salvas!",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar",
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
              Configurações
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
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Configurações do Salão</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Dados principais do seu salão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Salão *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 1234-5678"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="(11) 91234-5678"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Página Pública</CardTitle>
              <CardDescription>
                Personalize a página pública do seu salão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="link">Link Personalizado</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">studiogloss.com/</span>
                  <Input
                    id="link"
                    value={formData.link_personalizado}
                    onChange={(e) => setFormData({ ...formData, link_personalizado: e.target.value })}
                    placeholder="seu-salao"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Políticas</CardTitle>
              <CardDescription>
                Defina as políticas do seu salão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="politica">Política de Cancelamento</Label>
                <Textarea
                  id="politica"
                  value={formData.politica_cancelamento}
                  onChange={(e) => setFormData({ ...formData, politica_cancelamento: e.target.value })}
                  placeholder="Ex: Cancelamentos devem ser feitos com 24h de antecedência..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </form>
      </main>
    </div>
  );
};
