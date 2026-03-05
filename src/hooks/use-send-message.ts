import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SendWhatsAppInput {
  lead_id: string;
  phone_number: string;
  message: string;
  content_type?: string;
}

interface SendEmailInput {
  lead_id: string;
  to_email: string;
  subject: string;
  body: string;
  lead_name?: string;
}

export function useSendWhatsApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SendWhatsAppInput) => {
      const { data, error } = await supabase.functions.invoke("send-whatsapp", {
        body: input,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      toast({
        title: data?.status === "sent" ? "✅ WhatsApp enviado!" : "📝 Mensagem salva",
        description: data?.message,
      });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao enviar WhatsApp", description: err.message, variant: "destructive" });
    },
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SendEmailInput) => {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: input,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      toast({
        title: data?.status === "sent" ? "✅ E-mail enviado!" : "📝 E-mail salvo",
        description: data?.message,
      });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao enviar e-mail", description: err.message, variant: "destructive" });
    },
  });
}
