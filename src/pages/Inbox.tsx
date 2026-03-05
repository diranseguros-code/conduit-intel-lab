import { useState, useEffect } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useInteractions } from "@/hooks/use-interactions";
import { useSendWhatsApp } from "@/hooks/use-send-message";
import { useCreateInteraction } from "@/hooks/use-create-interaction";
import {
  Instagram, MessageCircle, Linkedin, Facebook,
  Send, Bot, Loader2,
} from "lucide-react";

const providerIcons: Record<string, typeof Instagram> = {
  instagram: Instagram, whatsapp: MessageCircle, linkedin: Linkedin, facebook: Facebook,
};
const providerColors: Record<string, string> = {
  instagram: "text-pink-400", whatsapp: "text-green-400", linkedin: "text-blue-400", facebook: "text-indigo-400",
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const color = score > 70 ? "bg-success/15 text-success" : score >= 40 ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground";
  return <Badge className={`${color} border-0 text-[10px] font-mono`}>{score}</Badge>;
}

function SentimentDot({ sentiment }: { sentiment: string | null }) {
  if (!sentiment) return null;
  const color = sentiment === "Positive" ? "bg-success" : sentiment === "Negative" ? "bg-destructive" : "bg-muted-foreground";
  return <span className={`w-2 h-2 rounded-full ${color} inline-block`} title={sentiment} />;
}

export default function Inbox() {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const { data: interactions = [], isLoading, refetch } = useInteractions(filter);
  const sendWhatsApp = useSendWhatsApp();
  const createInteraction = useCreateInteraction();

  const selected = interactions.find((i) => i.id === selectedId) ?? (interactions.length > 0 && !selectedId ? interactions[0] : null);

  // Realtime subscription for incoming messages
  useEffect(() => {
    const channel = supabase
      .channel("inbox-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "interactions" }, () => {
        refetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [refetch]);

  const handleAnalyze = async (interactionId: string) => {
    setAnalyzing(interactionId);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-interaction", {
        body: { interaction_id: interactionId },
      });
      if (error) throw error;
      toast({
        title: data?.auto_qualified ? "🔥 Lead de Alta Prioridade!" : "Análise concluída",
        description: data?.auto_qualified
          ? `Score ${data.lead_score} — Lead automaticamente qualificado.`
          : `Sentimento: ${data.sentiment} | Score: ${data.lead_score}`,
      });
    } catch (e) {
      toast({ title: "Erro na análise", description: e instanceof Error ? e.message : "Falha ao processar", variant: "destructive" });
    }
    setAnalyzing(null);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selected || !selected.leads) return;

    setSending(true);
    try {
      if (selected.provider === "whatsapp") {
        // Send via WhatsApp edge function
        const phone = selected.leads?.phone || selected.leads?.email || "";
        await sendWhatsApp.mutateAsync({
          lead_id: selected.lead_id,
          phone_number: phone,
          message: replyText.trim(),
        });
      } else {
        // For other providers, save interaction directly
        await createInteraction.mutateAsync({
          lead_id: selected.lead_id,
          provider: selected.provider,
          content_type: "text",
          message_content: replyText.trim(),
          direction: "outbound",
        });
        toast({ title: "Mensagem enviada!", description: `Resposta registrada para ${selected.leads.name}` });
      }
      setReplyText("");
    } catch {
      // Error handled by hooks
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
      <main className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h1 className="text-lg font-bold text-foreground tracking-tight">Inbox</h1>
            <Tabs value={filter} onValueChange={setFilter} className="mt-2">
              <TabsList className="w-full h-8">
                <TabsTrigger value="all" className="text-xs flex-1">Todos</TabsTrigger>
                <TabsTrigger value="whatsapp" className="text-xs flex-1"><MessageCircle className="w-3 h-3" /></TabsTrigger>
                <TabsTrigger value="instagram" className="text-xs flex-1"><Instagram className="w-3 h-3" /></TabsTrigger>
                <TabsTrigger value="linkedin" className="text-xs flex-1"><Linkedin className="w-3 h-3" /></TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : interactions.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground">Nenhuma interação encontrada.</div>
            ) : (
              interactions.map((interaction) => {
                const Icon = providerIcons[interaction.provider] || MessageCircle;
                const iconColor = providerColors[interaction.provider] || "text-muted-foreground";
                const isSelected = interaction.id === (selected?.id ?? selectedId);

                return (
                  <button
                    key={interaction.id}
                    onClick={() => setSelectedId(interaction.id)}
                    className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${isSelected ? "bg-secondary" : "hover:bg-secondary/50"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`} />
                      <span className="text-sm font-medium text-foreground truncate flex-1">{interaction.leads?.name || "Lead"}</span>
                      <ScoreBadge score={interaction.leads?.lead_score ?? null} />
                      <SentimentDot sentiment={interaction.sentiment_analysis} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{interaction.message_content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">{interaction.leads?.company}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(interaction.created_at)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </ScrollArea>
        </div>

        {/* Conversation Detail */}
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              <div className="px-6 py-3 border-b border-border flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">{selected.leads?.name}</h2>
                    <ScoreBadge score={selected.leads?.lead_score ?? null} />
                    <Badge variant="outline" className="text-[10px]">{selected.leads?.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{selected.leads?.company}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAnalyze(selected.id)} disabled={analyzing === selected.id}>
                  {analyzing === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  Analisar com AI
                </Button>
              </div>

              <ScrollArea className="flex-1 p-6">
                {selected.leads?.ai_summary && (
                  <Card className="mb-4 border-primary/20 shadow-glow">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-xs flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                        <span className="text-gradient-ai">AI Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <p className="text-sm text-foreground">{selected.leads.ai_summary}</p>
                    </CardContent>
                  </Card>
                )}

                {interactions
                  .filter((i) => i.lead_id === selected.lead_id)
                  .map((msg) => {
                    const isOutbound = (msg as any).direction === "outbound";
                    return (
                      <div key={msg.id} className={`flex gap-3 mb-4 ${isOutbound ? "flex-row-reverse" : ""}`}>
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-foreground">
                            {isOutbound ? "Eu" : msg.leads?.name?.charAt(0) ?? "?"}
                          </span>
                        </div>
                        <div className={`flex-1 ${isOutbound ? "text-right" : ""}`}>
                          <div className={`flex items-center gap-2 mb-1 ${isOutbound ? "justify-end" : ""}`}>
                            <span className="text-sm font-medium text-foreground">{isOutbound ? "Você" : msg.leads?.name}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleString("pt-BR")}</span>
                          </div>
                          <div className={`${isOutbound ? "bg-primary/20 rounded-lg rounded-tr-none" : "bg-secondary rounded-lg rounded-tl-none"} p-3 inline-block max-w-[80%]`}>
                            <p className="text-sm text-foreground text-left">{msg.message_content}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </ScrollArea>

              <div className="px-6 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Responder via ${selected.provider}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !sending) handleSendReply(); }}
                    className="flex-1 bg-secondary rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button size="icon" className="flex-shrink-0" disabled={!replyText.trim() || sending} onClick={handleSendReply}>
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Selecione uma conversa"}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
