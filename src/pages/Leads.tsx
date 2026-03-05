import { useState } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Users, Plus, Filter, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Lead {
  name: string;
  email: string;
  company: string;
  source: string;
  score: number;
  status: "novo" | "contactado" | "qualificado" | "perdido";
  lastActivity: string;
}

const allLeads: Lead[] = [
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

const statusFilters: Array<Lead["status"] | "todos"> = ["todos", "novo", "contactado", "qualificado", "perdido"];

const Leads = () => {
  const [filter, setFilter] = useState<Lead["status"] | "todos">("todos");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = filter === "todos" ? allLeads : allLeads.filter((l) => l.status === filter);

  const handleExport = () => {
    try {
      const csv = [
        "Nome,Email,Empresa,Fonte,Score,Status,Atividade",
        ...filtered.map((l) => `${l.name},${l.email},${l.company},${l.source},${l.score},${l.status},${l.lastActivity}`),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Exportado!", description: `${filtered.length} leads exportados em CSV.` });
    } catch (e) {
      toast({ title: "Erro ao exportar", description: "Não foi possível gerar o arquivo.", variant: "destructive" });
    }
  };

  const handleNewLead = () => {
    toast({ title: "Em breve", description: "Formulário de criação de lead será implementado com autenticação." });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Leads</h1>
              <p className="text-xs text-muted-foreground">Gerencie e qualifique seus leads</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors",
                showFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {showFilter ? <X className="w-3.5 h-3.5" /> : <Filter className="w-3.5 h-3.5" />}
              Filtrar
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Exportar
            </button>
            <button
              onClick={handleNewLead}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Novo Lead
            </button>
          </div>
        </header>

        {showFilter && (
          <div className="px-6 py-2 border-b border-border bg-background/50 flex gap-2">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "text-[10px] font-medium px-2.5 py-1 rounded-full capitalize transition-colors",
                  filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-6">
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-card-foreground">Leads</h2>
              <span className="text-xs text-muted-foreground">{filtered.length} leads</span>
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
                  {filtered.map((lead, i) => (
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
        </div>
      </main>
    </div>
  );
};

export default Leads;
