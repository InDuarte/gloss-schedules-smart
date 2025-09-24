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
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const todayAppointments = [
    { id: 1, time: "09:00", client: "Maria Silva", service: "Corte + Escova", professional: "Ana Costa" },
    { id: 2, time: "10:30", client: "João Santos", service: "Barba", professional: "Carlos Lima" },
    { id: 3, time: "14:00", client: "Patricia Oliveira", service: "Manicure", professional: "Lucia Mendes" },
    { id: 4, time: "15:30", client: "Roberto Costa", service: "Corte Masculino", professional: "Carlos Lima" },
  ];

  const stats = [
    { title: "Agendamentos Hoje", value: "12", icon: Calendar, trend: "+5%" },
    { title: "Clientes Ativos", value: "248", icon: Users, trend: "+12%" },
    { title: "Receita Mensal", value: "R$ 15.240", icon: TrendingUp, trend: "+8%" },
    { title: "Taxa de Ocupação", value: "87%", icon: Clock, trend: "+3%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold font-display text-foreground">
                Gloss
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
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
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
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground font-display">{stat.value}</p>
                      <p className="text-sm text-accent font-medium">{stat.trend}</p>
                    </div>
                    <div className="p-3 bg-gradient-secondary rounded-xl">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2 shadow-soft">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-display">Agendamentos de Hoje</CardTitle>
                  <CardDescription>
                    {todayAppointments.length} agendamentos para hoje
                  </CardDescription>
                </div>
                <Button variant="minimal" size="sm">
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-accent rounded-lg">
                      <Clock className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{appointment.client}</p>
                      <p className="text-sm text-muted-foreground">{appointment.service}</p>
                      <p className="text-xs text-muted-foreground">com {appointment.professional}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent text-lg">{appointment.time}</p>
                  </div>
                </div>
              ))}

              <Button variant="minimal" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Agendamento
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