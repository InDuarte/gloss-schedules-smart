import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const Success = () => {
  const { refreshSubscription } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Refresh subscription status after successful payment
    const timer = setTimeout(() => {
      refreshSubscription();
    }, 2000);

    toast({
      title: "Pagamento confirmado!",
      description: "Sua assinatura foi ativada com sucesso.",
    });

    return () => clearTimeout(timer);
  }, [refreshSubscription, toast]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-accent"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-secondary"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="shadow-strong border-0 bg-card/80 backdrop-blur-sm text-center">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-accent relative">
                <CheckCircle className="w-12 h-12 text-accent-foreground" />
                <div className="absolute -top-2 -right-2 p-1 bg-gradient-primary rounded-full">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-display text-foreground mb-2">
              Pagamento Confirmado!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Sua assinatura do StudioGloss foi ativada com sucesso.
              </p>
              
              <div className="p-4 bg-gradient-secondary rounded-xl">
                <p className="text-sm text-foreground font-medium">
                  ✨ Agora você tem acesso a todas as funcionalidades premium
                </p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Agendamentos inteligentes</p>
                <p>• Lembretes automáticos via WhatsApp</p>
                <p>• Relatórios avançados</p>
                <p>• Personalização completa</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="accent"
                size="lg"
                className="w-full shadow-accent"
                asChild
              >
                <Link to="/dashboard">
                  Acessar Dashboard
                </Link>
              </Button>
              
              <Button
                variant="minimal"
                size="lg"
                className="w-full"
                asChild
              >
                <Link to="/">
                  Voltar ao Início
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Dúvidas? Entre em contato conosco:{" "}
                <a 
                  href="mailto:suporte@studiogloss.com" 
                  className="text-accent hover:underline"
                >
                  suporte@studiogloss.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};