import { useState, useEffect } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Instagram, MessageCircle, Linkedin, Facebook,
  Send, Bot, Loader2, ArrowUpRight
} from "lucide-react";

type Interaction = {
  id: string;
  lead_id: string;
  provider: string;
  content_type: string;
  message_content: string | null;
  sentiment_analysis: string | null;
  ai_processed: boolean | null;
  created_at: string;
  leads: {
    id: string;
    name: string;
    company: string | null;
    lead_score: number | null;
    ai_summary: string | null;
    status: string;
  } | null;
};

const providerIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  whatsapp: MessageCircle,
  linkedin: Linkedin,
  facebook: Facebook,
};

const providerColors: Record<string, string> = {
  instagram: "text-pink-400",
  whatsapp: "text-green-400",
  linkedin: "text-blue-400",
  facebook: "text-indigo-400",
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

// Mock data for demo purposes
const mockInteractions: Interaction[] = [
  {
    id: "1", lead_id: "l1", provider: "whatsapp", content_type: "text",
    message_content: "Olá, gostaria de saber mais sobre o plano Enterprise. Temos 200 usuários na empresa.",
    sentiment_analysis: "Positive", ai_processed: true, created_at: new Date(Date.now() - 300000).toISOString(),
    leads: { id: "l1", name: "Carlos Silva", company: "TechCorp Brasil", lead_score: 85, ai_summary: "Lead de alto valor, interessado no plano Enterprise para 200 usuários.", status: "Qualified" },
  },
  {
    id: "2", lead_id: "l2", provider: "instagram", content_type: "text",
    message_content: "Vi o post sobre automação de vendas. Vocês têm uma demo disponível?",
    sentiment_analysis: "Positive", ai_processed: true, created_at: new Date(Date.now() - 900000).toISOString(),
    leads: { id: "l2", name: "Ana Beatriz", company: "Startup Flow", lead_score: 62, ai_summary: "Interesse em demonstração do produto.", status: "New" },
  },
  {
    id: "3", lead_id: "l3", provider: "linkedin", content_type: "text",
    message_content: "Prezados, estamos avaliando ferramentas de CRM para o Q2. Podem enviar proposta comercial?",
    sentiment_analysis: "Positive", ai_processed: true, created_at: new Date(Date.now() - 1800000).toISOString(),
    leads: { id: "l3", name: "Roberto Mendes", company: "Construtora Apex", lead_score: 92, ai_summary: "Decisor avaliando CRMs para Q2. Oportunidade de alto ticket.", status: "Qualified" },
  },
  {
    id: "4", lead_id: "l4", provider: "facebook", content_type: "text",
    message_content: "O preço está muito alto comparado com a concorrência. Não sei se vale a pena.",
    sentiment_analysis: "Negative", ai_processed: true, created_at: new Date(Date.now() - 3600000).toISOString(),
    leads: { id: "l4", name: "Mariana Costa", company: "Loja Virtual MC", lead_score: 28, ai_summary: "Objeção de preço. Comparando com concorrentes.", status: "New" },
  },
  {
    id: "5", lead_id: "l5", provider: "whatsapp", content_type: "text",
    message_content: "Bom dia! Queria entender como funciona a integração com o ERP que usamos.",
    sentiment_analysis: "Neutral", ai_processed: true, created_at: new Date(Date.now() - 7200000).toISOString(),
    leads: { id: "l5", name: "Fernando Alves", company: "Distribuidora FA", lead_score: 55, ai_summary: "Dúvida técnica sobre integração ERP.", status: "Contacted" },
  },
];

export default function Inbox() {
  const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions);
  const [selectedId, setSelectedId] = useState<string | null>(mockInteractions[0]?.id || null);
  const [filter, setFilter] = useState("all");
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  // Try to load real data, fallback to mock
  useEffect(() => {
    const loadInteractions = async () => {
      const { data } = await supabase
        .from("interactions")
        .select("*, leads(*)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (data && data.length > 0) {
        setInteractions(data as unknown as Interaction[]);
        setSelectedId(data[0].id);
      }
    };
    loadInteractions();
  }, []);

  const filtered = filter === "all" ? interactions : interactions.filter((i) => i.provider === filter);
  const selected = interactions.find((i) => i.id === selectedId);

  const handleAnalyze = async (interactionId: string) => {
    setAnalyzing(interactionId);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-interaction", {
        body: { interaction_id: interactionId },
      });

      if (error) throw error;

      if (data?.auto_qualified) {
        toast({
          title: "🔥 Lead de Alta Prioridade!",
          description: `Score ${data.lead_score} — Lead automaticamente qualificado.`,
        });
      } else {
        toast({
          title: "Análise concluída",
          description: `Sentimento: ${data.sentiment} | Score: ${data.lead_score}`,
        });
      }
    } catch (e) {
      toast({
        title: "Erro na análise",
        description: e instanceof Error ? e.message : "Falha ao processar",
        variant: "destructive",
      });
    }
    setAnalyzing(null);
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
                <TabsTrigger value="whatsapp" className="text-xs flex-1">
                  <MessageCircle className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="instagram" className="text-xs flex-1">
                  <Instagram className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="text-xs flex-1">
                  <Linkedin className="w-3 h-3" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1">
            {filtered.map((interaction) => {
              const Icon = providerIcons[interaction.provider] || MessageCircle;
              const iconColor = providerColors[interaction.provider] || "text-muted-foreground";
              const isSelected = interaction.id === selectedId;

              return (
                <button
                  key={interaction.id}
                  onClick={() => setSelectedId(interaction.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                    isSelected ? "bg-secondary" : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`} />
                    <span className="text-sm font-medium text-foreground truncate flex-1">
                      {interaction.leads?.name || "Lead"}
                    </span>
                    <ScoreBadge score={interaction.leads?.lead_score ?? null} />
                    <SentimentDot sentiment={interaction.sentiment_analysis} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {interaction.message_content}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      {interaction.leads?.company}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {timeAgo(interaction.created_at)}
                    </span>
                  </div>
                </button>
              );
            })}
          </ScrollArea>
        </div>

        {/* Conversation Detail */}
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              <div className="px-6 py-3 border-b border-border flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">
                      {selected.leads?.name}
                    </h2>
                    <ScoreBadge score={selected.leads?.lead_score ?? null} />
                    <Badge variant="outline" className="text-[10px]">
                      {selected.leads?.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{selected.leads?.company}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAnalyze(selected.id)}
                  disabled={analyzing === selected.id}
                >
                  {analyzing === selected.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  Analisar com AI
                </Button>
              </div>

              <ScrollArea className="flex-1 p-6">
                {/* AI Summary Card */}
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

                {/* Message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-foreground">
                      {selected.leads?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{selected.leads?.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(selected.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="bg-secondary rounded-lg rounded-tl-none p-3">
                      <p className="text-sm text-foreground">{selected.message_content}</p>
                    </div>
                    {selected.sentiment_analysis && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <SentimentDot sentiment={selected.sentiment_analysis} />
                        <span className="text-[10px] text-muted-foreground">
                          {selected.sentiment_analysis}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* Reply Input */}
              <div className="px-6 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Responder..."
                    className="flex-1 bg-secondary rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button size="icon" className="flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Selecione uma conversa
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
