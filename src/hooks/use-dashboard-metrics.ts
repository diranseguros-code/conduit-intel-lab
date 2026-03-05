import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface DashboardMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  totalInteractions: number;
  avgLeadScore: number;
}

export function useDashboardMetrics() {
  const query = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const [leadsRes, interactionsRes] = await Promise.all([
        supabase.from("leads").select("id, status, lead_score, pipeline_stage"),
        supabase.from("interactions").select("id", { count: "exact", head: true }),
      ]);

      if (leadsRes.error) throw leadsRes.error;

      const leads = leadsRes.data ?? [];
      const totalLeads = leads.length;
      const wonLeads = leads.filter((l) => l.pipeline_stage === "fechamento" || l.status === "Won").length;
      const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
      const scores = leads.map((l) => l.lead_score ?? 0);
      const avgLeadScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      return {
        totalLeads,
        qualifiedLeads: leads.filter((l) => l.status === "Qualified").length,
        conversionRate: Math.round(conversionRate * 10) / 10,
        totalInteractions: interactionsRes.count ?? 0,
        avgLeadScore: Math.round(avgLeadScore * 10) / 10,
      } as DashboardMetrics;
    },
    refetchInterval: 30000,
  });

  // Realtime subscription to auto-refetch
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-metrics-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
        query.refetch();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "interactions" }, () => {
        query.refetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [query]);

  return query;
}
