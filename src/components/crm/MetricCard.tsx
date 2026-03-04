import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  variant?: "default" | "ai" | "warm";
}

export function MetricCard({ title, value, change, icon: Icon, variant = "default" }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
        </div>
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center",
          variant === "ai" && "bg-gradient-ai",
          variant === "warm" && "bg-gradient-warm",
          variant === "default" && "bg-secondary"
        )}>
          <Icon className={cn(
            "w-4 h-4",
            variant === "default" ? "text-secondary-foreground" : "text-primary-foreground"
          )} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-success" />
        ) : (
          <TrendingDown className="w-3 h-3 text-destructive" />
        )}
        <span className={cn("font-medium", isPositive ? "text-success" : "text-destructive")}>
          {isPositive ? "+" : ""}{change}%
        </span>
        <span className="text-muted-foreground">vs mês anterior</span>
      </div>
    </div>
  );
}
