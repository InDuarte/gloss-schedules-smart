import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Agendamento {
  id: string;
  data_agendamento: string;
  hora_inicio: string;
  hora_fim: string;
  status: string;
  clientes: { nome: string } | null;
  servicos: { nome: string } | null;
  profissionais: { nome: string } | null;
}

export const Calendar = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadAgendamentos();
  }, [user, currentDate]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes:cliente_id(nome),
          servicos:servico_id(nome),
          profissionais:profissional_id(nome)
        `)
        .gte('data_agendamento', start)
        .lte('data_agendamento', end)
        .order('data_agendamento', { ascending: true })
        .order('hora_inicio', { ascending: true });

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error: any) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Erro ao carregar agendamentos",
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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return agendamentos.filter(a => a.data_agendamento === dateStr);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold font-display text-foreground">
              Calendário
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-display">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                  Hoje
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Carregando calendário...
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {daysInMonth.map(day => {
                  const appointments = getAppointmentsForDay(day);
                  const isCurrentDay = isToday(day);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-24 border rounded-lg p-2 ${
                        isCurrentDay ? 'bg-accent/10 border-accent' : 'border-border'
                      } ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}`}
                    >
                      <div className={`text-sm font-semibold mb-1 ${
                        isCurrentDay ? 'text-accent' : 'text-foreground'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      {appointments.length > 0 && (
                        <div className="space-y-1">
                          {appointments.slice(0, 3).map(apt => (
                            <div
                              key={apt.id}
                              className="text-xs bg-primary/10 text-primary rounded px-1 py-0.5 truncate"
                              title={`${apt.hora_inicio} - ${apt.clientes?.nome} - ${apt.servicos?.nome}`}
                            >
                              {apt.hora_inicio} {apt.clientes?.nome}
                            </div>
                          ))}
                          {appointments.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{appointments.length - 3} mais
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
