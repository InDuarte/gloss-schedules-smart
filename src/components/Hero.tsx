import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern - Subtle */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-accent"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-secondary"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/50 text-sm font-medium text-foreground mb-8 shadow-soft">
            <Sparkles className="w-4 h-4 mr-2 text-accent" />
            Sistema Premium de Agendamento
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold font-display text-foreground mb-6 leading-tight">
            Transforme seu
            <span className="text-accent"> salão</span>
            <br />
            em uma experiência
            <span className="text-accent"> premium</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Sistema completo de agendamento com design sofisticado,
            automação inteligente e gestão profissional para seu negócio.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/auth">
              <Button variant="accent" size="xl" className="min-w-[200px]">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link to="/booking">
              <Button variant="minimal" size="xl" className="min-w-[200px]">
                Ver Demonstração
              </Button>
            </Link>
          </div>

          {/* Stats/Features Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <Calendar className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground">Agenda Inteligente</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Calendário visual com slots dinâmicos
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <Users className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground">Multi-usuários</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Clientes e profissionais integrados
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <BarChart3 className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground">Relatórios IA</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Insights inteligentes do seu negócio
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <Sparkles className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground">Automação</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Lembretes e marketing automáticos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};