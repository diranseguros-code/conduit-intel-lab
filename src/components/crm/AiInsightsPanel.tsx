import { Brain, TrendingUp, AlertTriangle, Lightbulb, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  type: "prediction" | "alert" | "suggestion" | "sentiment";
  title: string;
  description: string;
  confidence?: number;
  time: string;
}

const insights: Insight[] = [
  {
    type: "prediction",
    title: "Alta probabilidade de fechamento",
    description: "EduTech SA — modelo preditivo indica 94% de chance. Recomendação: agendar call de finalização esta semana.",
    confidence: 94,
    time: "2 min",
  },
  {
    type: "alert",
    title: "Risco de churn detectado",
    description: "Cliente MedSys reduziu engajamento em 40%. Sentimento negativo identificado nos últimos 3 e-mails.",
    confidence: 78,
    time: "15 min",
  },
  {
    type: "suggestion",
    title: "Upsell identificado via NLP",
    description: "Análise de calls com GlobalPay revelou interesse em módulo de Analytics. Potencial: R$ 80K.",
    confidence: 86,
    time: "1h",
  },
  {
    type: "sentiment",
    title: "Transcrição de call concluída",
    description: "Call com RetailMax (32 min) — tom positivo, 3 action items extraídos automaticamente.",
    time: "2h",
  },
];

const typeConfig = {
  prediction: { icon: TrendingUp, color: "text-success" },
  alert: { icon: AlertTriangle, color: "text-accent" },
  suggestion: { icon: Lightbulb, color: "text-primary" },
  sentiment: { icon: Phone, color: "text-secondary-foreground" },
};

export function AiInsightsPanel() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <Brain className="w-4 h-4 text-primary animate-pulse-glow" />
        <h2 className="text-sm font-semibold text-card-foreground">AI Insights</h2>
        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-gradient-ai text-primary-foreground">
          LIVE
        </span>
      </div>
      <div className="divide-y divide-border">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <div key={i} className="px-5 py-3 hover:bg-secondary/30 transition-colors cursor-pointer animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5", config.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-card-foreground">{insight.title}</p>
                    {insight.confidence && (
                      <span className="text-[10px] font-mono text-muted-foreground">{insight.confidence}%</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{insight.description}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{insight.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
