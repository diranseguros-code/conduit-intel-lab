import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type InteractionWithLead = {
  id: string;
  lead_id: string;
  provider: string;
  content_type: string;
  message_content: string | null;
  sentiment_analysis: string | null;
  ai_processed: boolean | null;
  created_at: string;
  leads: {
    id: string;
    name: string;
    company: string | null;
    lead_score: number | null;
    ai_summary: string | null;
    status: string;
  } | null;
};

export function useInteractions(provider?: string) {
  return useQuery({
    queryKey: ["interactions", provider],
    queryFn: async () => {
      let query = supabase
        .from("interactions")
        .select("*, leads(*)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (provider && provider !== "all") {
        query = query.eq("provider", provider);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as InteractionWithLead[];
    },
  });
}
