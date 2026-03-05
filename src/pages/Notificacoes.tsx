import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "deal" | "lead" | "ai" | "system";
}

const initialNotifications: Notification[] = [
  { id: 1, title: "Deal próximo do fechamento", description: "Licenciamento — EduTech SA atingiu 75% de probabilidade", time: "5 min", read: false, type: "deal" },
  { id: 2, title: "Novo lead qualificado", description: "Carolina Mendes alcançou AI Score 92", time: "12 min", read: false, type: "lead" },
  { id: 3, title: "AI Insight disponível", description: "Análise de sentimento concluída para 8 interações", time: "1h", read: false, type: "ai" },
  { id: 4, title: "Follow-up pendente", description: "Rafael Santos — sem contato há 3 dias", time: "2h", read: true, type: "lead" },
  { id: 5, title: "Meta mensal atingida", description: "Receita MRR ultrapassou R$ 380K — 106% da meta", time: "3h", read: true, type: "system" },
  { id: 6, title: "Proposta visualizada", description: "GlobalPay abriu a proposta SaaS Enterprise", time: "5h", read: true, type: "deal" },
];

const typeStyles: Record<string, string> = {
  deal: "bg-primary/15 text-primary",
  lead: "bg-success/15 text-success",
  ai: "bg-accent/15 text-accent",
  system: "bg-secondary text-secondary-foreground",
};

const Notificacoes = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Notificações</h1>
              <p className="text-xs text-muted-foreground">{unread} não lidas</p>
            </div>
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Marcar todas como lidas
            </button>
          )}
        </header>
        <div className="p-6">
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden divide-y divide-border/50">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 px-5 py-3.5 transition-colors cursor-pointer",
                  !n.read ? "bg-secondary/20" : "hover:bg-secondary/30"
                )}
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                  )
                }
              >
                {!n.read && <span className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />}
                {n.read && <span className="w-2 h-2 mt-1.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-card-foreground">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{n.description}</p>
                </div>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0", typeStyles[n.type])}>
                  {n.type === "deal" ? "Deal" : n.type === "lead" ? "Lead" : n.type === "ai" ? "AI" : "Sistema"}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notificacoes;
