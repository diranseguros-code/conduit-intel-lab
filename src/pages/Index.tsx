import { DollarSign, Users, Target, Brain, MessageSquare } from "lucide-react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { MetricCard } from "@/components/crm/MetricCard";
import { PipelineBoard } from "@/components/crm/PipelineBoard";
import { AiInsightsPanel } from "@/components/crm/AiInsightsPanel";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { ActivityFeed } from "@/components/crm/ActivityFeed";
import { RevenueChart } from "@/components/crm/RevenueChart";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

const Index = () => {
  const { data: metrics } = useDashboardMetrics();

  const cards = [
    { title: "Total de Leads", value: metrics?.totalLeads?.toString() ?? "—", change: 0, icon: Users, variant: "default" as const },
    { title: "Taxa de Conversão", value: metrics ? `${metrics.conversionRate}%` : "—", change: 0, icon: Target, variant: "warm" as const },
    { title: "Interações", value: metrics?.totalInteractions?.toString() ?? "—", change: 0, icon: MessageSquare, variant: "default" as const },
    { title: "AI Score Médio", value: metrics?.avgLeadScore?.toString() ?? "—", change: 0, icon: Brain, variant: "ai" as const },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Dados em tempo real do seu CRM</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-success/15 text-success flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
              AI Engine Online
            </span>
          </div>
        </header>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((m) => (
              <MetricCard key={m.title} {...m} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3">
              <RevenueChart />
            </div>
            <div className="lg:col-span-2">
              <AiInsightsPanel />
            </div>
          </div>

          <PipelineBoard />

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
