import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { PipelineBoard } from "@/components/crm/PipelineBoard";
import { Target } from "lucide-react";

const Pipeline = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
          <Target className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Pipeline</h1>
            <p className="text-xs text-muted-foreground">Funil de vendas e oportunidades</p>
          </div>
        </header>
        <div className="p-6">
          <PipelineBoard />
        </div>
      </main>
    </div>
  );
};

export default Pipeline;
