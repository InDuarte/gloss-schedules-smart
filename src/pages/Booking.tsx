import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, Check, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DBService {
  id: string;
  nome: string;
  descricao: string | null;
  duracao_minutos: number;
  preco: number;
  salao_id: string;
}

interface DBProfessional {
  id: string;
  nome: string;
  especialidades: string[] | null;
  salao_id: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<DBService | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<DBProfessional | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [servicos, setServicos] = useState<DBService[]>([]);
  const [profissionais, setProfissionais] = useState<DBProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load services and professionals from database
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load services
      const { data: servicosData, error: servicosError } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true);
      
      if (servicosError) throw servicosError;
      setServicos(servicosData || []);

      // Load professionals
      const { data: profissionaisData, error: profissionaisError } = await supabase
        .from('profissionais')
        .select('*')
        .eq('ativo', true);
      
      if (profissionaisError) throw profissionaisError;
      setProfissionais(profissionaisData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os serviços e profissionais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
  ];

  const handleConfirmBooking = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para fazer um agendamento.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os dados do agendamento.",
        variant: "destructive",
      });
      return;
    }

    setIsConfirming(true);

    try {
      // Get or create client record
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let clienteId = clienteData?.id;

      if (!clienteId) {
        // Create client if doesn't exist
        const { data: newCliente, error: newClienteError } = await supabase
          .from('clientes')
          .insert([{
            nome: user.email || 'Cliente',
            email: user.email,
            salao_id: servicos[0]?.salao_id,
          }])
          .select()
          .single();

        if (newClienteError) throw newClienteError;
        clienteId = newCliente.id;
      }

      // Calculate end time
      const [hour, minute] = selectedTime.split(':').map(Number);
      const duration = selectedService.duracao_minutos;
      const endHour = Math.floor((hour * 60 + minute + duration) / 60);
      const endMinute = (hour * 60 + minute + duration) % 60;
      const horaFim = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      // Create booking
      const { data: agendamento, error: agendamentoError } = await supabase
        .from('agendamentos')
        .insert([{
          cliente_id: clienteId,
          servico_id: selectedService.id,
          profissional_id: selectedProfessional.id,
          salao_id: selectedService.salao_id,
          data_agendamento: selectedDate,
          hora_inicio: selectedTime,
          hora_fim: horaFim,
          status: 'agendado' as const,
          valor_pago: Number(selectedService.preco),
        }])
        .select()
        .single();

      if (agendamentoError) throw agendamentoError;

      toast({
        title: "Agendamento confirmado!",
        description: `Seu horário está confirmado para ${selectedDate} às ${selectedTime}.`,
      });

      // Send WhatsApp notification (if configured)
      try {
        await supabase.functions.invoke('send-whatsapp', {
          body: {
            tipo: 'confirmacao',
            agendamento_id: agendamento.id,
          }
        });
      } catch (whatsappError) {
        console.error('WhatsApp notification error:', whatsappError);
        // Don't fail the booking if WhatsApp fails
      }

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Erro ao confirmar agendamento",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Escolha seu serviço";
      case 2: return "Escolha o profissional";
      case 3: return "Escolha data e horário";
      case 4: return "Confirme seu agendamento";
      default: return "Agendamento";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </Link>
            <div className="text-2xl font-bold font-display text-foreground">
              Gloss
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                ${currentStep >= step 
                  ? "bg-accent text-accent-foreground shadow-accent" 
                  : "bg-secondary text-muted-foreground"
                }
              `}>
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div className={`
                  w-16 h-1 mx-2 transition-all duration-300
                  ${currentStep > step ? "bg-accent" : "bg-secondary"}
                `} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">
            {getStepTitle()}
          </h1>
          <p className="text-muted-foreground">
            Passo {currentStep} de 4
          </p>
        </div>

        {/* Step 1: Choose Service */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <p className="col-span-2 text-center text-muted-foreground">Carregando serviços...</p>
            ) : servicos.length === 0 ? (
              <p className="col-span-2 text-center text-muted-foreground">Nenhum serviço disponível</p>
            ) : (
              servicos.map((service) => (
              <Card
                key={service.id}
                className={`
                  cursor-pointer shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1
                  ${selectedService?.id === service.id ? "ring-2 ring-accent shadow-accent" : ""}
                `}
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground font-display">
                        {service.nome}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {service.descricao || 'Serviço profissional'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duracao_minutos}min
                    </div>
                    <div className="text-2xl font-bold text-accent">
                      R$ {Number(service.preco).toFixed(0)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        )}

        {/* Step 2: Choose Professional */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <p className="col-span-2 text-center text-muted-foreground">Carregando profissionais...</p>
            ) : profissionais.length === 0 ? (
              <p className="col-span-2 text-center text-muted-foreground">Nenhum profissional disponível</p>
            ) : (
              profissionais.map((professional) => (
              <Card
                key={professional.id}
                className={`
                  cursor-pointer shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1
                  ${selectedProfessional?.id === professional.id ? "ring-2 ring-accent shadow-accent" : ""}
                `}
                onClick={() => setSelectedProfessional(professional)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-xl">
                      {professional.nome.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground font-display">
                        {professional.nome}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {professional.especialidades?.join(', ') || 'Profissional'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        )}

        {/* Step 3: Choose Date & Time */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="font-display">Selecione a Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {/* Simplified calendar - in a real app, use a proper calendar component */}
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <button
                      key={day}
                      className={`
                        p-4 rounded-lg border transition-all duration-200
                        ${selectedDate === `2024-01-${day + 14}` 
                          ? "bg-accent text-accent-foreground border-accent" 
                          : "bg-card hover:bg-secondary border-border"
                        }
                      `}
                      onClick={() => setSelectedDate(`2024-01-${day + 14}`)}
                    >
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">
                          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][day - 1]}
                        </div>
                        <div className="font-semibold">{day + 14}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedDate && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display">Horários Disponíveis</CardTitle>
                  <CardDescription>Selecione o melhor horário para você</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        className={`
                          p-3 rounded-lg border transition-all duration-200 font-semibold
                          ${!slot.available 
                            ? "bg-muted text-muted-foreground border-border cursor-not-allowed" 
                            : selectedTime === slot.time
                              ? "bg-accent text-accent-foreground border-accent shadow-accent"
                              : "bg-card hover:bg-secondary border-border hover:border-accent"
                          }
                        `}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <Card className="shadow-strong max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display">Confirme seu Agendamento</CardTitle>
              <CardDescription>Revise os detalhes antes de confirmar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-secondary p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Serviço</span>
                  <span className="font-semibold text-foreground">{selectedService?.nome}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profissional</span>
                  <span className="font-semibold text-foreground">{selectedProfessional?.nome}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-semibold text-foreground">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Horário</span>
                  <span className="font-semibold text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-semibold text-foreground">{selectedService?.duracao_minutos}min</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-accent">R$ {selectedService?.preco ? Number(selectedService.preco).toFixed(0) : '0'}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleConfirmBooking}
                variant="accent"
                size="lg"
                className="w-full shadow-accent"
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  "Confirmar Agendamento"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="minimal"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Voltar
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="accent"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !selectedProfessional) ||
                (currentStep === 3 && (!selectedDate || !selectedTime))
              }
            >
              Continuar
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
};