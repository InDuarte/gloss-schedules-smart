import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppRequest {
  telefone: string;
  mensagem: string;
  salao_id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { telefone, mensagem, salao_id }: WhatsAppRequest = await req.json();
    
    console.log('Sending WhatsApp message:', { telefone, mensagem, salao_id });
    
    // Validar dados
    if (!telefone || !mensagem) {
      throw new Error("Telefone e mensagem são obrigatórios");
    }

    // Formatar número para WhatsApp Web API
    const numeroLimpo = telefone.replace(/\D/g, '');
    const numeroFormatado = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
    
    // URL do WhatsApp Web (simulação - em produção usaria API oficial)
    const whatsappUrl = `https://wa.me/${numeroFormatado}?text=${encodeURIComponent(mensagem)}`;
    
    console.log('WhatsApp URL generated:', whatsappUrl);

    // Se tiver salao_id, buscar configurações personalizadas do salão
    if (salao_id) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const { data: salao } = await supabaseClient
        .from('saloes')
        .select('mensagens_whatsapp, whatsapp')
        .eq('id', salao_id)
        .single();

      console.log('Salão config:', salao);
    }

    // Simular envio (em produção integraria com API oficial do WhatsApp Business)
    // Por enquanto retorna sucesso e a URL para abrir no WhatsApp Web
    return new Response(JSON.stringify({ 
      success: true, 
      whatsapp_url: whatsappUrl,
      message: 'Mensagem preparada para WhatsApp',
      telefone: numeroFormatado
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});