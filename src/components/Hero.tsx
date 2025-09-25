import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Crown, Star, Check, Calendar, Users, BarChart3, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Hero = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-accent"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-secondary"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-secondary text-sm font-medium text-foreground mb-8 shadow-soft">
              <Sparkles className="w-5 h-5 mr-2 text-accent" />
              Usado por +500 salões em todo Brasil
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold font-display text-foreground mb-6 leading-tight">
              Agendamentos 
              <span className="text-accent"> inteligentes</span>
              <br />
              para salões 
              <span className="text-accent"> sofisticados</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Automatize agendamentos, envie lembretes via WhatsApp e aumente sua receita 
              em <strong className="text-accent">40% em 30 dias</strong> com nossa plataforma premium.
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-accent border-2 border-background flex items-center justify-center">
                    <Crown className="w-5 h-5 text-accent-foreground" />
                  </div>
                ))}
              </div>
              <div className="ml-4 text-left">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Avaliação 4.9/5 de 120+ salões</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="accent" size="xl" className="min-w-[220px] shadow-accent">
                    Ir para Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/pricing">
                  <Button variant="accent" size="xl" className="min-w-[220px] shadow-accent">
                    Começar Teste Grátis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Link to="#demo">
                <Button variant="minimal" size="xl" className="min-w-[220px]">
                  Ver Demonstração
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mb-16">
              ✨ 7 dias grátis • Sem cartão de crédito • Cancele quando quiser
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 shadow-soft hover:shadow-medium transition-all duration-300">
                <Calendar className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">Agenda Smart</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Evita conflitos automaticamente
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 shadow-soft hover:shadow-medium transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">WhatsApp</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Lembretes automáticos
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 shadow-soft hover:shadow-medium transition-all duration-300">
                <BarChart3 className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">Relatórios IA</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Insights para crescer mais
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 shadow-soft hover:shadow-medium transition-all duration-300">
                <Users className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">Multi-salão</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Gerencie várias unidades
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="planos" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground font-display mb-4">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece gratuitamente e escale conforme seu negócio cresce
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Básico */}
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-secondary rounded-2xl">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-xl font-display">Básico</CardTitle>
                <CardDescription>Perfeito para começar</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">R$ 29</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Agenda online</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Até 50 agendamentos/mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Suporte por email</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Avançado - Popular */}
            <Card className="relative shadow-soft hover:shadow-medium transition-all duration-300 ring-2 ring-accent scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-accent text-accent-foreground px-6 py-1">
                  Mais Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-accent rounded-2xl">
                    <Star className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl font-display">Avançado</CardTitle>
                <CardDescription>Para salões em crescimento</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">R$ 59</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Tudo do Básico</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Lembretes via WhatsApp</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Agendamentos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Relatórios básicos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-primary rounded-2xl">
                    <Crown className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl font-display">Premium</CardTitle>
                <CardDescription>Para salões profissionais</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">R$ 99</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Tudo do Avançado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">IA de agendamento</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Marketing automatizado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-3" />
                    <span className="text-sm">Múltiplos salões</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link to="/pricing">
              <Button variant="accent" size="lg" className="shadow-accent">
                Ver Todos os Planos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};