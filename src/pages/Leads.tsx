import { useState } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Users, Plus, Filter, Download, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useLeads, useCreateLead } from "@/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusStyles: Record<string, string> = {
  New: "bg-primary/15 text-primary",
  Contacted: "bg-accent/15 text-accent",
  Qualified: "bg-success/15 text-success",
  Lost: "bg-destructive/15 text-destructive",
};

const statusFilters = ["todos", "New", "Contacted", "Qualified", "Lost"];

function NewLeadDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const createLead = useCreateLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createLead.mutate(
      { name: name.trim(), email: email.trim() || undefined, company: company.trim() || undefined },
      { onSuccess: () => { setOpen(false); setName(""); setEmail(""); setCompany(""); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Novo Lead
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="name">Nome *</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label htmlFor="company">Empresa</Label><Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
          <Button type="submit" className="w-full" disabled={createLead.isPending}>
            {createLead.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Criar Lead
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const Leads = () => {
  const [filter, setFilter] = useState("todos");
  const [showFilter, setShowFilter] = useState(false);
  const { data: leads = [], isLoading, error } = useLeads();

  const filtered = filter === "todos" ? leads : leads.filter((l) => l.status === filter);

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  const handleExport = () => {
    try {
      const csv = [
        "Nome,Email,Empresa,Score,Status,Atualizado",
        ...filtered.map((l) => `${l.name},${l.email ?? ""},${l.company ?? ""},${l.lead_score ?? 0},${l.status},${l.updated_at}`),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Exportado!", description: `${filtered.length} leads exportados em CSV.` });
    } catch {
      toast({ title: "Erro ao exportar", description: "Não foi possível gerar o arquivo.", variant: "destructive" });
    }
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
            <NewLeadDialog />
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-sm text-muted-foreground">
              Erro ao carregar leads. Faça login para ver seus dados.
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-sm text-muted-foreground">
              Nenhum lead encontrado. Crie seu primeiro lead!
            </div>
          ) : (
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
                      <th className="text-center px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">AI Score</th>
                      <th className="text-center px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-right px-5 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Atividade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filtered.map((lead) => (
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leads;
