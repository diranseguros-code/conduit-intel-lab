import { useState } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneCall, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInteractions } from "@/hooks/use-interactions";
import { useLeads } from "@/hooks/use-leads";
import { useCreateInteraction } from "@/hooks/use-create-interaction";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const directionConfig = {
  inbound: { icon: PhoneIncoming, label: "Recebida", color: "text-success" },
  outbound: { icon: PhoneOutgoing, label: "Realizada", color: "text-primary" },
  missed: { icon: PhoneMissed, label: "Perdida", color: "text-destructive" },
};

const Calls = () => {
  const { data: callInteractions = [], isLoading } = useInteractions("phone");
  const { data: leads = [] } = useLeads();
  const createInteraction = useCreateInteraction();
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [dialing, setDialing] = useState(false);

  const handleDial = async () => {
    if (!selectedLeadId) {
      toast({ title: "Selecione um lead", variant: "destructive" });
      return;
    }

    const lead = leads.find((l) => l.id === selectedLeadId);
    if (!lead) return;

    setDialing(true);

    // Log the call interaction
    await createInteraction.mutateAsync({
      lead_id: lead.id,
      provider: "phone",
      content_type: "call",
      message_content: `Chamada iniciada para ${lead.name}`,
      direction: "outbound",
    });

    // Open system dialer via tel: protocol
    const phoneNumber = (lead as any).phone || lead.email;
    if (phoneNumber && phoneNumber.match(/[\d+]/)) {
      window.open(`tel:${phoneNumber}`, "_self");
    }

    toast({ title: "Chamada registrada", description: `Log criado para ${lead.name}` });
    setDialing(false);
    setSelectedLeadId("");
  };

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
          <Phone className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Calls</h1>
            <p className="text-xs text-muted-foreground">Discador e histórico de chamadas</p>
          </div>
        </header>
        <div className="p-6 space-y-5">
          {/* Dialer */}
          <div className="rounded-lg border border-border bg-card shadow-card p-5">
            <h2 className="text-sm font-semibold text-card-foreground mb-3">Iniciar Chamada</h2>
            <div className="flex items-center gap-3">
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="flex-1 bg-secondary rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary border border-border"
              >
                <option value="">Selecionar lead...</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} {lead.company ? `— ${lead.company}` : ""}
                  </option>
                ))}
              </select>
              <Button onClick={handleDial} disabled={!selectedLeadId || dialing}>
                {dialing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PhoneCall className="w-4 h-4 mr-2" />}
                Ligar
              </Button>
            </div>
          </div>

          {/* Call History */}
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-card-foreground">Histórico de Chamadas</h2>
              <span className="text-xs text-muted-foreground">{callInteractions.length} chamadas</span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : callInteractions.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground">Nenhuma chamada registrada.</div>
            ) : (
              <div className="divide-y divide-border/50">
                {callInteractions.map((call) => {
                  const dir = (call as any).direction ?? "inbound";
                  const config = directionConfig[dir as keyof typeof directionConfig] ?? directionConfig.inbound;
                  const Icon = config.icon;
                  const sentiment = call.sentiment_analysis;

                  return (
                    <div key={call.id} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/30 transition-colors cursor-pointer">
                      <Icon className={cn("w-4 h-4 flex-shrink-0", config.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-card-foreground">{call.leads?.name ?? "Lead"}</p>
                        <p className="text-[11px] text-muted-foreground">{call.leads?.company ?? "—"}</p>
                      </div>
                      <span className="text-[10px] text-secondary-foreground">{config.label}</span>
                      {(call as any).duration_seconds && (
                        <span className="text-xs font-mono text-card-foreground">
                          {Math.floor((call as any).duration_seconds / 60)}:{String((call as any).duration_seconds % 60).padStart(2, "0")}
                        </span>
                      )}
                      {sentiment && (
                        <span className={cn(
                          "text-[10px] font-medium px-2 py-0.5 rounded-full",
                          sentiment === "Positive" ? "bg-success/15 text-success" :
                          sentiment === "Negative" ? "bg-destructive/15 text-destructive" : "bg-secondary text-secondary-foreground"
                        )}>{sentiment}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(call.created_at)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calls;
