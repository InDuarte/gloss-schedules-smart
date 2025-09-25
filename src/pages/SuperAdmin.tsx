import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Crown, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Building, 
  MessageCircle,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

interface Salao {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  link_personalizado: string;
  ativo: boolean;
  created_at: string;
  admin_id: string;
  plano?: string;
}

export const SuperAdmin = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [saloes, setSaloes] = useState<Salao[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSaloes: 0,
    saloesAtivos: 0,
    receitaMensal: 0,
    totalAgendamentos: 0
  });

  // Verificar se é super admin
  if (profile && profile.tipo !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    if (profile?.tipo === 'super_admin') {
      fetchSaloes();
      fetchStats();
    }
  }, [profile]);

  const fetchSaloes = async () => {
    try {
      const { data, error } = await supabase
        .from('saloes')
        .select(`
          id,
          nome,
          email,
          whatsapp,
          link_personalizado,
          ativo,
          created_at,
          admin_id,
          assinaturas(plano, status)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const saloesWithPlans = data?.map(salao => ({
        ...salao,
        plano: salao.assinaturas?.[0]?.plano || 'gratuito'
      })) || [];
      
      setSaloes(saloesWithPlans);
    } catch (error) {
      console.error('Error fetching saloes:', error);
      toast({
        title: "Erro ao carregar salões",
        description: "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Total de salões
      const { count: totalSaloes } = await supabase
        .from('saloes')
        .select('*', { count: 'exact', head: true });

      // Salões ativos
      const { count: saloesAtivos } = await supabase
        .from('saloes')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      // Receita mensal (simulada)
      const { data: assinaturas } = await supabase
        .from('assinaturas')
        .select('valor_mensal')
        .eq('status', 'ativo');

      const receitaMensal = assinaturas?.reduce((total, sub) => 
        total + parseFloat(String(sub.valor_mensal || '0')), 0) || 0;

      // Total de agendamentos
      const { count: totalAgendamentos } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalSaloes: totalSaloes || 0,
        saloesAtivos: saloesAtivos || 0,
        receitaMensal,
        totalAgendamentos: totalAgendamentos || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleSalaoStatus = async (salaoId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('saloes')
        .update({ ativo: !currentStatus })
        .eq('id', salaoId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Salão ${!currentStatus ? 'ativado' : 'suspenso'} com sucesso`,
      });

      fetchSaloes();
    } catch (error) {
      console.error('Error updating salao status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados do sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-accent rounded-lg">
                <Crown className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">
                  StudioGloss Admin
                </h1>
                <p className="text-sm text-muted-foreground">Painel Super Admin</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Salões</p>
                  <p className="text-3xl font-bold text-foreground font-display">
                    {stats.totalSaloes}
                  </p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl">
                  <Building className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Salões Ativos</p>
                  <p className="text-3xl font-bold text-foreground font-display">
                    {stats.saloesAtivos}
                  </p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">MRR</p>
                  <p className="text-3xl font-bold text-foreground font-display">
                    R$ {stats.receitaMensal.toFixed(0)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Agendamentos</p>
                  <p className="text-3xl font-bold text-foreground font-display">
                    {stats.totalAgendamentos}
                  </p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salões Lista */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display">Salões Cadastrados</CardTitle>
            <CardDescription>
              Gerencie todos os salões da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {saloes.map((salao) => (
                <div
                  key={salao.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-accent rounded-lg">
                      <Building className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{salao.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {salao.email} • {salao.link_personalizado}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        WhatsApp: {salao.whatsapp}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={salao.plano === 'premium' ? 'default' : 'secondary'}
                      className={salao.plano === 'premium' ? 'bg-gradient-accent' : ''}
                    >
                      {salao.plano || 'gratuito'}
                    </Badge>
                    
                    <Badge variant={salao.ativo ? 'default' : 'secondary'}>
                      {salao.ativo ? 'Ativo' : 'Suspenso'}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant={salao.ativo ? 'destructive' : 'default'}
                      onClick={() => toggleSalaoStatus(salao.id, salao.ativo)}
                    >
                      {salao.ativo ? 'Suspender' : 'Ativar'}
                    </Button>
                    
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {saloes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum salão cadastrado ainda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};