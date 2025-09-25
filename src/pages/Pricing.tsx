import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Básico",
      id: "basico",
      price: "R$ 29",
      period: "/mês",
      description: "Perfeito para começar",
      icon: Sparkles,
      features: [
        "Agenda online",
        "Cadastro de serviços",
        "Cadastro de profissionais",
        "Até 50 agendamentos/mês",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      popular: false
    },
    {
      name: "Avançado",
      id: "avancado",
      price: "R$ 59",
      period: "/mês",
      description: "Para salões em crescimento",
      icon: Zap,
      features: [
        "Tudo do Básico",
        "Lembretes via WhatsApp",
        "Link personalizado",
        "Relatórios básicos",
        "Agendamentos ilimitados",
        "Configurações avançadas",
        "Suporte prioritário"
      ],
      buttonText: "Escolher Avançado",
      popular: true
    },
    {
      name: "Premium",
      id: "premium",
      price: "R$ 99",
      period: "/mês",
      description: "Para salões profissionais",
      icon: Crown,
      features: [
        "Tudo do Avançado",
        "IA de agendamento",
        "Marketing automatizado",
        "Personalização completa",
        "Cupons de desconto",
        "Relatórios avançados",
        "Múltiplos salões",
        "Suporte 24/7"
      ],
      buttonText: "Escolher Premium",
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setLoading(planId);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plano: planId }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Erro na assinatura",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return subscription?.plano === planId && subscription?.subscribed;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-accent"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-secondary"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-2xl font-bold font-display text-foreground">
                StudioGloss
              </Link>
              <div className="flex items-center space-x-4">
                {user ? (
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Entrar</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao início
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground font-display mb-6">
              Escolha seu plano
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforme seu salão com as melhores ferramentas de agendamento. 
              Comece grátis por 7 dias em qualquer plano.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const currentPlan = isCurrentPlan(plan.id);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative shadow-soft hover:shadow-medium transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-accent scale-105' : ''
                  } ${currentPlan ? 'bg-accent/10 border-accent' : 'bg-card'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge variant="default" className="bg-gradient-accent text-accent-foreground px-6 py-1">
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  {currentPlan && (
                    <div className="absolute -top-4 right-4">
                      <Badge variant="default" className="bg-gradient-primary text-primary-foreground px-4 py-1">
                        Seu Plano
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-gradient-secondary rounded-2xl">
                        <Icon className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-accent text-accent-foreground hover:opacity-90' 
                          : currentPlan 
                          ? 'bg-gradient-primary text-primary-foreground' 
                          : ''
                      }`}
                      variant={plan.popular || currentPlan ? "default" : "minimal"}
                      size="lg"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading === plan.id || currentPlan}
                    >
                      {loading === plan.id 
                        ? "Processando..." 
                        : currentPlan 
                        ? "Plano Atual" 
                        : plan.buttonText
                      }
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground font-display mb-8">
              Perguntas Frequentes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">
                  Posso trocar de plano a qualquer momento?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento 
                  no painel de configurações.
                </p>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">
                  Como funciona o período gratuito?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Todos os planos incluem 7 dias gratuitos. Você só será cobrado após 
                  o término do período de teste.
                </p>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Claro! Não há fidelidade. Você pode cancelar sua assinatura 
                  a qualquer momento sem multas.
                </p>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">
                  Há desconto para pagamento anual?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Sim! Pagando anualmente você economiza 2 meses. 
                  Entre em contato conosco para mais detalhes.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};