import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Mail, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useInteractions } from "@/hooks/use-interactions";
import { useCreateInteraction } from "@/hooks/use-create-interaction";
import { useLeads } from "@/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Comunicacao = () => {
  const { data: interactions = [], isLoading } = useInteractions("email");
  const { data: leads = [] } = useLeads();
  const createInteraction = useCreateInteraction();
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!selectedLeadId || !subject.trim() || !body.trim()) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      await createInteraction.mutateAsync({
        lead_id: selectedLeadId,
        provider: "email",
        content_type: "email",
        message_content: body.trim(),
        subject: subject.trim(),
        direction: "outbound",
      });
      toast({ title: "E-mail registrado", description: "Mensagem salva no histórico." });
      setSubject("");
      setBody("");
      setSelectedLeadId("");
    } catch {
      // handled by hook
    }
    setSending(false);
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
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Comunicação</h1>
            <p className="text-xs text-muted-foreground">Enviar e-mails e ver histórico</p>
          </div>
        </header>
        <div className="p-6 space-y-5">
          {/* Compose */}
          <div className="rounded-lg border border-border bg-card shadow-card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-card-foreground">Novo E-mail</h2>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full bg-secondary rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary border border-border"
            >
              <option value="">Selecionar lead destinatário...</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} {lead.email ? `(${lead.email})` : ""}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Assunto"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-secondary rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary border border-border"
            />
            <textarea
              placeholder="Corpo do e-mail..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full bg-secondary rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary border border-border resize-none"
            />
            <Button onClick={handleSend} disabled={sending || !selectedLeadId || !subject.trim() || !body.trim()}>
              {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Enviar
            </Button>
          </div>

          {/* History */}
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-card-foreground">Histórico de E-mails</h2>
              <span className="text-xs text-muted-foreground">{interactions.length} mensagens</span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : interactions.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground">Nenhum e-mail encontrado.</div>
            ) : (
              <div className="divide-y divide-border/50">
                {interactions.map((email) => (
                  <div key={email.id} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-card-foreground truncate">
                        {(email as any).subject || email.message_content?.slice(0, 60) || "Sem assunto"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{email.leads?.name ?? "Lead"} — {email.leads?.company ?? ""}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(email.created_at)}</span>
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      (email as any).direction === "outbound" ? "bg-primary/15 text-primary" : "bg-success/15 text-success"
                    )}>
                      {(email as any).direction === "outbound" ? "Enviado" : "Recebido"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Comunicacao;
