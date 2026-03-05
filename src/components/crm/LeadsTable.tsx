import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/use-leads";
import { Loader2 } from "lucide-react";

const statusStyles: Record<string, string> = {
  New: "bg-primary/15 text-primary",
  Contacted: "bg-accent/15 text-accent",
  Qualified: "bg-success/15 text-success",
  Lost: "bg-destructive/15 text-destructive",
};

export function LeadsTable() {
  const { data: leads = [], isLoading } = useLeads();
  const recent = leads.slice(0, 6);

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Leads Recentes</h2>
        <span className="text-xs text-muted-foreground">{leads.length} leads</span>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
      ) : recent.length === 0 ? (
        <div className="text-center py-10 text-xs text-muted-foreground">Nenhum lead encontrado.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Lead</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Empresa</th>
                <th className="text-center px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">AI Score</th>
                <th className="text-center px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Atividade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recent.map((lead) => (
                <tr key={lead.id} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-card-foreground">{lead.name}</p>
                      <p className="text-muted-foreground text-[11px]">{lead.email ?? "—"}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-secondary-foreground">{lead.company ?? "—"}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={cn(
                      "font-mono font-medium",
                      (lead.lead_score ?? 0) >= 80 ? "text-success" : (lead.lead_score ?? 0) >= 60 ? "text-accent" : "text-muted-foreground"
                    )}>
                      {lead.lead_score ?? 0}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium capitalize", statusStyles[lead.status] ?? "bg-muted text-muted-foreground")}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{timeAgo(lead.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
