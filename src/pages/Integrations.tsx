import { useState } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, MessageCircle, Linkedin, Facebook, CheckCircle2, Loader2 } from "lucide-react";

const providers = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Conecte mensagens do Instagram Direct e comentários.",
    icon: Instagram,
    color: "from-pink-500 to-purple-500",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Integre conversas do WhatsApp Business API.",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Sincronize conexões e mensagens do LinkedIn.",
    icon: Linkedin,
    color: "from-blue-600 to-blue-400",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Conecte Messenger e comentários de páginas.",
    icon: Facebook,
    color: "from-blue-500 to-indigo-500",
  },
];

export default function Integrations() {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const handleConnect = async (providerId: string) => {
    setConnecting(providerId);

    // Simulate OAuth flow
    await new Promise((r) => setTimeout(r, 2000));

    // In production, this would redirect to OAuth provider
    // For now, we persist a mock connection
    const { error } = await supabase.from("social_connections").insert({
      provider: providerId,
      provider_user_id: `mock_${providerId}_${Date.now()}`,
      status: "connected",
      user_id: (await supabase.auth.getUser()).data.user?.id || "",
    });

    if (error) {
      toast({
        title: "Erro na conexão",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setConnected((prev) => ({ ...prev, [providerId]: true }));
      toast({
        title: "Conectado com sucesso!",
        description: `${providerId} foi integrado ao NexusCRM.`,
      });
    }

    setConnecting(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3">
          <h1 className="text-lg font-bold text-foreground tracking-tight">Integrações Sociais</h1>
          <p className="text-xs text-muted-foreground">Conecte suas redes sociais para captura omnichannel</p>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {providers.map((p) => {
              const isConnected = connected[p.id];
              const isConnecting = connecting === p.id;

              return (
                <Card key={p.id} className="shadow-card border-border hover:border-primary/30 transition-colors">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0`}>
                      <p.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{p.name}</CardTitle>
                        {isConnected && (
                          <Badge className="bg-success/15 text-success border-0 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ativo
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs mt-1">{p.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleConnect(p.id)}
                      disabled={isConnecting || isConnected}
                      variant={isConnected ? "secondary" : "default"}
                      size="sm"
                      className="w-full"
                    >
                      {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isConnected ? "Conectado" : isConnecting ? "Autenticando..." : "Conectar"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
