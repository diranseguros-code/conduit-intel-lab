import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Lead } from "@/hooks/use-leads";

export const PIPELINE_STAGES = [
  { key: "prospeccao", label: "Prospecção" },
  { key: "qualificacao", label: "Qualificação" },
  { key: "proposta", label: "Proposta" },
  { key: "negociacao", label: "Negociação" },
  { key: "fechamento", label: "Fechamento" },
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number]["key"];

export type PipelineLead = Lead & { pipeline_stage: string; phone: string | null };

export function usePipelineLeads() {
  return useQuery({
    queryKey: ["pipeline-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as PipelineLead[];
    },
  });
}

export function useUpdatePipelineStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, stage }: { leadId: string; stage: PipelineStage }) => {
      const { error } = await supabase
        .from("leads")
        .update({ pipeline_stage: stage })
        .eq("id", leadId);

      if (error) throw error;
    },
    // Optimistic update
    onMutate: async ({ leadId, stage }) => {
      await queryClient.cancelQueries({ queryKey: ["pipeline-leads"] });
      const previous = queryClient.getQueryData<PipelineLead[]>(["pipeline-leads"]);

      queryClient.setQueryData<PipelineLead[]>(["pipeline-leads"], (old) =>
        old?.map((lead) => (lead.id === leadId ? { ...lead, pipeline_stage: stage } : lead))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["pipeline-leads"], context.previous);
      }
      toast({ title: "Erro ao mover lead", description: "Tente novamente.", variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    },
  });
}
