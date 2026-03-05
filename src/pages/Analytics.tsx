import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { RevenueChart } from "@/components/crm/RevenueChart";
import { MetricCard } from "@/components/crm/MetricCard";
import { BarChart3, DollarSign, Users, Target, TrendingUp } from "lucide-react";

const metrics = [
  { title: "Receita Total", value: "R$ 1.8M", change: 14.2, icon: DollarSign, variant: "default" as const },
  { title: "Novos Leads", value: "347", change: 22.1, icon: Users, variant: "default" as const },
  { title: "Deals Fechados", value: "42", change: 8.5, icon: Target, variant: "warm" as const },
  { title: "Ticket Médio", value: "R$ 43K", change: -2.3, icon: TrendingUp, variant: "default" as const },
];

const Analytics = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Analytics</h1>
            <p className="text-xs text-muted-foreground">Métricas e relatórios de performance</p>
          </div>
        </header>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <MetricCard key={m.title} {...m} />
            ))}
          </div>
          <RevenueChart />
        </div>
      </main>
    </div>
  );
};

export default Analytics;
