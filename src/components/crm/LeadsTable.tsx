import { cn } from "@/lib/utils";

interface Lead {
  name: string;
  email: string;
  company: string;
  source: string;
  score: number;
  status: "novo" | "contactado" | "qualificado" | "perdido";
  lastActivity: string;
}

const leads: Lead[] = [
  { name: "Carolina Mendes", email: "carolina@techcorp.br", company: "TechCorp Brasil", source: "LinkedIn", score: 92, status: "qualificado", lastActivity: "Hoje" },
  { name: "Rafael Santos", email: "rafael@dataflow.io", company: "DataFlow Ltda", source: "Inbound", score: 78, status: "contactado", lastActivity: "Ontem" },
  { name: "Amanda Liu", email: "amanda@globalpay.com", company: "GlobalPay", source: "Referência", score: 88, status: "qualificado", lastActivity: "Hoje" },
  { name: "Bruno Ferreira", email: "bruno@finstack.com.br", company: "FinStack", source: "Evento", score: 65, status: "novo", lastActivity: "3 dias" },
  { name: "Lucia Pereira", email: "lucia@retailmax.com", company: "RetailMax", source: "Cold Email", score: 45, status: "contactado", lastActivity: "5 dias" },
  { name: "Marcos Almeida", email: "marcos@logitrans.br", company: "LogiTrans", source: "LinkedIn", score: 34, status: "perdido", lastActivity: "7 dias" },
];

const statusStyles = {
  novo: "bg-primary/15 text-primary",
  contactado: "bg-accent/15 text-accent",
  qualificado: "bg-success/15 text-success",
  perdido: "bg-destructive/15 text-destructive",
};

export function LeadsTable() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Leads Recentes</h2>
        <span className="text-xs text-muted-foreground">{leads.length} leads</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Lead</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Empresa</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Fonte</th>
              <th className="text-center px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">AI Score</th>
              <th className="text-center px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Atividade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {leads.map((lead, i) => (
              <tr key={i} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                <td className="px-5 py-3">
                  <div>
                    <p className="font-medium text-card-foreground">{lead.name}</p>
                    <p className="text-muted-foreground text-[11px]">{lead.email}</p>
                  </div>
                </td>
                <td className="px-3 py-3 text-secondary-foreground">{lead.company}</td>
                <td className="px-3 py-3 text-secondary-foreground">{lead.source}</td>
                <td className="px-3 py-3 text-center">
                  <span className={cn(
                    "font-mono font-medium",
                    lead.score >= 80 ? "text-success" : lead.score >= 60 ? "text-accent" : "text-muted-foreground"
                  )}>
                    {lead.score}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium capitalize", statusStyles[lead.status])}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-muted-foreground">{lead.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
