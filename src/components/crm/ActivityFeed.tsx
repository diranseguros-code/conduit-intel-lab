import { Mail, Phone, FileText, MessageSquare, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  icon: typeof Mail;
  title: string;
  description: string;
  time: string;
  color: string;
}

const activities: Activity[] = [
  { icon: Phone, title: "Call gravada", description: "RetailMax — 32 min, transcrição processada pela IA", time: "10:42", color: "text-primary" },
  { icon: Mail, title: "E-mail enviado", description: "Follow-up automático para EduTech SA", time: "10:15", color: "text-accent" },
  { icon: MessageSquare, title: "WhatsApp", description: "Resposta de Carolina Mendes — sentimento positivo", time: "09:58", color: "text-success" },
  { icon: FileText, title: "Proposta gerada", description: "IA gerou proposta para GlobalPay — R$ 250K", time: "09:30", color: "text-secondary-foreground" },
  { icon: Calendar, title: "Reunião agendada", description: "Demo com FinStack — amanhã às 14h", time: "09:12", color: "text-primary" },
];

export function ActivityFeed() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Atividade Recente</h2>
      </div>
      <div className="divide-y divide-border/50">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/30 transition-colors">
            <activity.icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", activity.color)} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-card-foreground">{activity.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{activity.description}</p>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
