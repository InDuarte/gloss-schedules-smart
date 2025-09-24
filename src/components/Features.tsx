import { 
  Calendar, 
  Users, 
  BarChart3, 
  Bell, 
  CreditCard, 
  Smartphone,
  Clock,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Calendar,
    title: "Agenda Visual Premium",
    description: "Calendário elegante com visão diária, semanal e mensal. Slots dinâmicos com prevenção automática de conflitos."
  },
  {
    icon: Users,
    title: "Gestão Completa de Usuários",
    description: "Sistema multiusuário para clientes, profissionais e administradores com perfis personalizados."
  },
  {
    icon: Bell,
    title: "Automação Inteligente",
    description: "Lembretes automáticos via email e WhatsApp. Fila de espera inteligente para cancelamentos."
  },
  {
    icon: BarChart3,
    title: "Relatórios com IA",
    description: "Dashboards sofisticados com insights de negócio, previsões e análises de performance."
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Sistema de cobrança recorrente e gestão financeira completa com múltiplos gateways."
  },
  {
    icon: Smartphone,
    title: "100% Responsivo",
    description: "Interface premium otimizada para todos os dispositivos, com experiência nativa mobile."
  },
  {
    icon: Clock,
    title: "Histórico Completo",
    description: "Registro detalhado de todos os agendamentos, com histórico de clientes e profissionais."
  },
  {
    icon: TrendingUp,
    title: "Marketing Automatizado",
    description: "Campanhas inteligentes de retenção, promoções personalizadas e programa de fidelidade."
  },
  {
    icon: Shield,
    title: "Segurança Premium",
    description: "Proteção de dados LGPD, backup automático e segurança enterprise."
  }
];

export const Features = () => {
  return (
    <section id="recursos" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/30 text-sm font-medium text-foreground mb-6">
            <Zap className="w-4 h-4 mr-2 text-accent" />
            Recursos Premium
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-6">
            Tudo que seu negócio
            <span className="text-accent"> precisa</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uma solução completa e sofisticada que eleva a experiência do seus clientes 
            e otimiza a gestão do seu salão ou clínica.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-card shadow-soft hover:shadow-strong transition-all duration-500 hover:-translate-y-1 border border-border/50"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-secondary group-hover:bg-gradient-accent transition-all duration-300">
                    <Icon className="w-6 h-6 text-foreground group-hover:text-accent-foreground transition-colors duration-300" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 font-display">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="p-12 rounded-3xl bg-gradient-secondary shadow-strong">
            <h3 className="text-3xl font-bold text-foreground mb-4 font-display">
              Pronto para transformar seu negócio?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se aos profissionais que já escolheram a excelência do Gloss
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button variant="accent" size="lg" className="px-8 py-4">
                  Começar Teste Grátis
                </Button>
              </Link>
              <Link to="/booking">
                <Button variant="minimal" size="lg" className="px-8 py-4">
                  Agendar Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};