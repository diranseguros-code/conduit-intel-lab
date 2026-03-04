import { DollarSign, Users, Target, Brain } from "lucide-react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { MetricCard } from "@/components/crm/MetricCard";
import { PipelineBoard } from "@/components/crm/PipelineBoard";
import { AiInsightsPanel } from "@/components/crm/AiInsightsPanel";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { ActivityFeed } from "@/components/crm/ActivityFeed";
import { RevenueChart } from "@/components/crm/RevenueChart";

const metrics = [
  { title: "Receita MRR", value: "R$ 382K", change: 12.4, icon: DollarSign, variant: "default" as const },
  { title: "Leads Ativos", value: "1.247", change: 8.2, icon: Users, variant: "default" as const },
  { title: "Taxa de Conversão", value: "24.8%", change: 3.1, icon: Target, variant: "warm" as const },
  { title: "AI Score Médio", value: "78.4", change: 5.7, icon: Brain, variant: "ai" as const },
];

const Index = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Terça, 4 de Março 2026 — Atualizado há 2 min</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-success/15 text-success flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
              AI Engine Online
            </span>
          </div>
        </header>

        <div className="p-6 space-y-5">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <MetricCard key={m.title} {...m} />
            ))}
          </div>

          {/* Charts + AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3">
              <RevenueChart />
            </div>
            <div className="lg:col-span-2">
              <AiInsightsPanel />
            </div>
          </div>

          {/* Pipeline */}
          <PipelineBoard />

          {/* Leads + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <LeadsTable />
            </div>
            <div>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
