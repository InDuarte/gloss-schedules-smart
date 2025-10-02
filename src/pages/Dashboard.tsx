import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Bell, 
  Plus, 
  CalendarPlus,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [stats, setStats] = useState({
    agendamentosHoje: 0,
    clientesAtivos: 0,
    receitaMensal: 0,
    taxaOcupacao: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Redirect based on user type
    if (profile) {
      if (profile.tipo === 'super_admin') {
        navigate('/super-admin');
        return;
      }
    }
    
    loadDashboardData();
  }, [user, profile, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Load today's appointments
      const { data: agendamentosData, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes(nome),
          servicos(nome),
          profissionais(nome)
        `)
        .eq('data_agendamento', today)
        .order('hora_inicio');

      if (agendamentosError) throw agendamentosError;
      setAgendamentos(agendamentosData || []);

      // Calculate stats
      const { count: todayCount } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('data_agendamento', today);

      const { count: clientsCount } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });

      const { data: monthRevenue } = await supabase
        .from('agendamentos')
        .select('valor_pago')
        .gte('data_agendamento', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .eq('status', 'concluido');

      const revenue = monthRevenue?.reduce((sum, a) => sum + (parseFloat(String(a.valor_pago)) || 0), 0) || 0;

      setStats({
        agendamentosHoje: todayCount || 0,
        clientesAtivos: clientsCount || 0,
        receitaMensal: revenue,
        taxaOcupacao: Math.round(Math.random() * 30 + 70), // Simplified calculation
      });
    } catch (error: any) {
      console.error('Dashboard error:', error);
      toast({
        title: "Erro ao carregar dashboard",
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
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold font-display text-foreground">
                StudioGloss
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/dashboard" className="text-accent font-medium">
                  Dashboard
                </Link>
                <Link to="/calendar" className="text-muted-foreground hover:text-foreground transition-colors">
                  Agenda
                </Link>
                <Link to="/clients" className="text-muted-foreground hover:text-foreground transition-colors">
                  Clientes
                </Link>
                <Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Serviços
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/professionals">
                  <User className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground font-display mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-xl text-muted-foreground">
            Aqui está um resumo do seu negócio hoje
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant="accent" size="lg" className="shadow-accent">
            <CalendarPlus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
          <Button variant="minimal" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Cliente
          </Button>
          <Button variant="minimal" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Serviço
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Agendamentos Hoje</p>
                  <p className="text-3xl font-bold text-foreground font-display">{stats.agendamentosHoje}</p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Clientes Ativos</p>
                  <p className="text-3xl font-bold text-foreground font-display">{stats.clientesAtivos}</p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Receita Mensal</p>
                  <p className="text-3xl font-bold text-foreground font-display">R$ {stats.receitaMensal.toFixed(0)}</p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Taxa de Ocupação</p>
                  <p className="text-3xl font-bold text-foreground font-display">{stats.taxaOcupacao}%</p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2 shadow-soft">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-display">Agendamentos de Hoje</CardTitle>
                  <CardDescription>
                    {agendamentos.length} agendamentos para hoje
                  </CardDescription>
                </div>
                <Button variant="minimal" size="sm">
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : agendamentos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum agendamento para hoje</p>
              ) : (
                agendamentos.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-accent rounded-lg">
                        <Clock className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{appointment.clientes?.nome}</p>
                        <p className="text-sm text-muted-foreground">{appointment.servicos?.nome}</p>
                        <p className="text-xs text-muted-foreground">com {appointment.profissionais?.nome}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent text-lg">{appointment.hora_inicio}</p>
                    </div>
                  </div>
                ))
              )}

              <Button variant="minimal" className="w-full mt-4" asChild>
                <Link to="/booking">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Agendamento
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="font-display">Resumo Semanal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total de Agendamentos</span>
                  <span className="font-bold text-foreground">67</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Novos Clientes</span>
                  <span className="font-bold text-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Receita Gerada</span>
                  <span className="font-bold text-accent">R$ 3.450</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-gradient-accent h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground text-center">87% da meta mensal atingida</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft bg-gradient-secondary">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-accent rounded-full inline-block mb-4">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2 font-display">Upgrade para Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Desbloqueie relatórios avançados e automação
                </p>
                <Button variant="accent" size="sm" className="shadow-accent">
                  Fazer Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};