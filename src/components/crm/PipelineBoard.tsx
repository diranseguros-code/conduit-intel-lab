import { cn } from "@/lib/utils";

interface Deal {
  id: string;
  name: string;
  company: string;
  value: string;
  probability: number;
  aiScore: number;
}

interface Stage {
  name: string;
  deals: Deal[];
  total: string;
}

const stages: Stage[] = [
  {
    name: "Prospecção",
    total: "R$ 284K",
    deals: [
      { id: "1", name: "Implantação ERP", company: "TechCorp Brasil", value: "R$ 120K", probability: 20, aiScore: 72 },
      { id: "2", name: "Migração Cloud", company: "DataFlow Ltda", value: "R$ 85K", probability: 15, aiScore: 58 },
      { id: "3", name: "Consultoria BI", company: "Análise+", value: "R$ 79K", probability: 25, aiScore: 81 },
    ],
  },
  {
    name: "Qualificação",
    total: "R$ 430K",
    deals: [
      { id: "4", name: "SaaS Enterprise", company: "GlobalPay", value: "R$ 250K", probability: 40, aiScore: 88 },
      { id: "5", name: "Integração API", company: "FinStack", value: "R$ 180K", probability: 35, aiScore: 64 },
    ],
  },
  {
    name: "Proposta",
    total: "R$ 560K",
    deals: [
      { id: "6", name: "Plataforma Digital", company: "RetailMax", value: "R$ 340K", probability: 60, aiScore: 92 },
      { id: "7", name: "Automação RPA", company: "LogiTrans", value: "R$ 220K", probability: 55, aiScore: 76 },
    ],
  },
  {
    name: "Negociação",
    total: "R$ 310K",
    deals: [
      { id: "8", name: "Licenciamento", company: "EduTech SA", value: "R$ 310K", probability: 75, aiScore: 95 },
    ],
  },
  {
    name: "Fechamento",
    total: "R$ 190K",
    deals: [
      { id: "9", name: "Suporte Premium", company: "MedSys", value: "R$ 190K", probability: 90, aiScore: 97 },
    ],
  },
];

function ScoreBadge({ score }: { score: number }) {
  return (
    <span className={cn(
      "text-[10px] font-mono font-medium px-1.5 py-0.5 rounded",
      score >= 85 ? "bg-success/15 text-success" :
      score >= 65 ? "bg-accent/15 text-accent" :
      "bg-muted text-muted-foreground"
    )}>
      AI {score}
    </span>
  );
}

export function PipelineBoard() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Pipeline de Vendas</h2>
        <span className="text-xs text-muted-foreground font-mono">R$ 1.77M total ponderado</span>
      </div>
      <div className="flex divide-x divide-border overflow-x-auto">
        {stages.map((stage) => (
          <div key={stage.name} className="flex-1 min-w-[200px] p-3 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-card-foreground">{stage.name}</span>
              <span className="text-xs text-muted-foreground font-mono">{stage.total}</span>
            </div>
            <div className="space-y-2">
              {stage.deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-2.5 rounded-md bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-medium text-card-foreground group-hover:text-primary transition-colors leading-tight">
                      {deal.name}
                    </p>
                    <ScoreBadge score={deal.aiScore} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{deal.company}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold text-card-foreground">{deal.value}</span>
                    <span className="text-[10px] text-muted-foreground">{deal.probability}%</span>
                  </div>
                  {/* Probability bar */}
                  <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
