import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ManageSubscription = () => {
  const [loading, setLoading] = useState(false);
  const { user, subscription } = useAuth();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para gerenciar sua assinatura.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Customer portal error:', error);
      toast({
        title: "Erro ao abrir portal",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!subscription?.subscribed) {
    return null;
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="font-display">Gerenciar Assinatura</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleManageSubscription}
          disabled={loading}
          variant="minimal"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Abrindo...
            </>
          ) : (
            "Gerenciar Assinatura no Stripe"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
