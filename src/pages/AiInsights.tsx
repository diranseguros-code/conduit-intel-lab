import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { AiInsightsPanel } from "@/components/crm/AiInsightsPanel";
import { Brain } from "lucide-react";

const AiInsights = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
          <Brain className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">AI Insights</h1>
            <p className="text-xs text-muted-foreground">Análises e recomendações inteligentes</p>
          </div>
          <span className="ml-auto text-[10px] font-medium px-2 py-1 rounded-full bg-gradient-ai text-primary-foreground">AI Powered</span>
        </header>
        <div className="p-6 max-w-2xl">
          <AiInsightsPanel />
        </div>
      </main>
    </div>
  );
};

export default AiInsights;
