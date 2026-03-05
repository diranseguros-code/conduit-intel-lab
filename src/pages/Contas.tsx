import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Building2 } from "lucide-react";

const companies = [
  { name: "TechCorp Brasil", sector: "Tecnologia", leads: 12, revenue: "R$ 450K", status: "Ativo" },
  { name: "DataFlow Ltda", sector: "SaaS", leads: 5, revenue: "R$ 180K", status: "Ativo" },
  { name: "GlobalPay", sector: "Fintech", leads: 8, revenue: "R$ 720K", status: "Ativo" },
  { name: "FinStack", sector: "Fintech", leads: 3, revenue: "R$ 95K", status: "Prospect" },
  { name: "RetailMax", sector: "Varejo", leads: 6, revenue: "R$ 340K", status: "Ativo" },
  { name: "LogiTrans", sector: "Logística", leads: 2, revenue: "R$ 120K", status: "Inativo" },
  { name: "EduTech SA", sector: "Educação", leads: 4, revenue: "R$ 310K", status: "Ativo" },
  { name: "MedSys", sector: "Saúde", leads: 7, revenue: "R$ 560K", status: "Ativo" },
];

const statusStyles: Record<string, string> = {
  Ativo: "bg-success/15 text-success",
  Prospect: "bg-accent/15 text-accent",
  Inativo: "bg-destructive/15 text-destructive",
};

const Contas = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Contas</h1>
            <p className="text-xs text-muted-foreground">Empresas e organizações</p>
          </div>
        </header>
        <div className="p-6">
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Empresa</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Setor</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Leads</th>
                  <th className="text-right px-3 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Receita</th>
                  <th className="text-center px-5 py-2.5 font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {companies.map((c, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                    <td className="px-5 py-3 font-medium text-card-foreground">{c.name}</td>
                    <td className="px-3 py-3 text-secondary-foreground">{c.sector}</td>
                    <td className="px-3 py-3 text-center text-secondary-foreground">{c.leads}</td>
                    <td className="px-3 py-3 text-right font-mono text-card-foreground">{c.revenue}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyles[c.status]}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contas;
