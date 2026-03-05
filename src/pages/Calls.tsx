import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { cn } from "@/lib/utils";

const calls = [
  { contact: "Carolina Mendes", company: "TechCorp Brasil", duration: "32 min", type: "incoming" as const, time: "10:42", sentiment: "Positivo" },
  { contact: "Rafael Santos", company: "DataFlow Ltda", duration: "15 min", type: "outgoing" as const, time: "09:30", sentiment: "Neutro" },
  { contact: "Amanda Liu", company: "GlobalPay", duration: "—", type: "missed" as const, time: "09:12", sentiment: "—" },
  { contact: "Bruno Ferreira", company: "FinStack", duration: "48 min", type: "outgoing" as const, time: "Ontem 16:20", sentiment: "Positivo" },
  { contact: "Lucia Pereira", company: "RetailMax", duration: "22 min", type: "incoming" as const, time: "Ontem 14:05", sentiment: "Negativo" },
  { contact: "Marcos Almeida", company: "LogiTrans", duration: "8 min", type: "outgoing" as const, time: "3 Mar", sentiment: "Neutro" },
];

const typeConfig = {
  incoming: { icon: PhoneIncoming, label: "Recebida", color: "text-success" },
  outgoing: { icon: PhoneOutgoing, label: "Realizada", color: "text-primary" },
  missed: { icon: PhoneMissed, label: "Perdida", color: "text-destructive" },
};

const Calls = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
          <Phone className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Calls</h1>
            <p className="text-xs text-muted-foreground">Histórico de chamadas e transcrições AI</p>
          </div>
        </header>
        <div className="p-6">
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {calls.map((call, i) => {
                const config = typeConfig[call.type];
                const Icon = config.icon;
                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <Icon className={cn("w-4 h-4 flex-shrink-0", config.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-card-foreground">{call.contact}</p>
                      <p className="text-[11px] text-muted-foreground">{call.company}</p>
                    </div>
                    <span className="text-[10px] text-secondary-foreground">{config.label}</span>
                    <span className="text-xs font-mono text-card-foreground">{call.duration}</span>
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      call.sentiment === "Positivo" ? "bg-success/15 text-success" :
                      call.sentiment === "Negativo" ? "bg-destructive/15 text-destructive" : "bg-secondary text-secondary-foreground"
                    )}>{call.sentiment}</span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{call.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calls;
