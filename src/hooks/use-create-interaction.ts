import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreateInteractionInput {
  lead_id: string;
  provider: string;
  content_type: string;
  message_content?: string;
  direction?: string;
  duration_seconds?: number;
  subject?: string;
}

export function useCreateInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateInteractionInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Autenticação necessária.");

      const { data, error } = await supabase
        .from("interactions")
        .insert({
          lead_id: input.lead_id,
          provider: input.provider,
          content_type: input.content_type,
          message_content: input.message_content ?? null,
          direction: input.direction ?? "outbound",
          duration_seconds: input.duration_seconds ?? null,
          subject: input.subject ?? null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });
}
