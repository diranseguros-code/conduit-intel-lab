import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: string;
  lead_score: number | null;
  ai_summary: string | null;
  last_interaction_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  pipeline_stage: string;
  phone: string | null;
};

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lead: { name: string; email?: string; company?: string; status?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Autenticação necessária para criar leads.");

      const { data, error } = await supabase
        .from("leads")
        .insert({ ...lead, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Lead criado!", description: "Novo lead adicionado com sucesso." });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao criar lead", description: err.message, variant: "destructive" });
    },
  });
}
