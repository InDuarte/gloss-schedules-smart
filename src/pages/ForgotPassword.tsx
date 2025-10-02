import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe seu email",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-accent"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-secondary"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="shadow-strong border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-secondary">
                <Mail className="w-8 h-8 text-accent" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display text-center">
              Esqueceu sua senha?
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {sent 
                ? "Um email foi enviado com instruções para redefinir sua senha"
                : "Digite seu email e enviaremos um link para redefinir sua senha"
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-accent text-accent-foreground shadow-accent"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>

                <div className="text-center">
                  <Link 
                    to="/auth" 
                    className="text-sm text-muted-foreground hover:text-accent inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-secondary rounded-xl text-center">
                  <p className="text-sm text-foreground">
                    ✉️ Verifique sua caixa de entrada
                  </p>
                </div>

                <Button
                  variant="minimal"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link to="/auth">
                    Voltar para login
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
