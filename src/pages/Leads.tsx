import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { Users, Plus, Filter, Download } from "lucide-react";

const Leads = () => {
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
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              <Filter className="w-3.5 h-3.5" /> Filtrar
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              <Download className="w-3.5 h-3.5" /> Exportar
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Novo Lead
            </button>
          </div>
        </header>
        <div className="p-6">
          <LeadsTable />
        </div>
      </main>
    </div>
  );
};

export default Leads;
