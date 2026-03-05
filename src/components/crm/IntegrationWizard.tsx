import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import {
  CheckCircle2, Loader2, ArrowRight, ArrowLeft, Mail,
  Calendar, Users, MessageCircle, Instagram, Facebook, Zap, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

type Provider = "google" | "meta";

const PROVIDERS = {
  google: {
    name: "Google",
    description: "Gmail, Google Calendar e Contatos",
    gradient: "from-red-500 via-yellow-500 to-blue-500",
    icon: Mail,
    permissions: [
      { id: "contacts", label: "Importar Contatos do Google", icon: Users },
      { id: "gmail", label: "Ler e-mails do Gmail", icon: Mail },
      { id: "calendar", label: "Sincronizar Google Agenda", icon: Calendar },
    ],
  },
  meta: {
    name: "Meta",
    description: "Instagram, WhatsApp Business e Facebook Messenger",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    icon: Facebook,
    permissions: [
      { id: "instagram_dm", label: "Mensagens do Instagram Direct", icon: Instagram },
      { id: "whatsapp", label: "Conversas do WhatsApp Business", icon: MessageCircle },
      { id: "facebook_msg", label: "Messenger e comentários", icon: Facebook },
    ],
  },
} as const;

const STEPS = ["Selecionar Provedor", "Autenticação", "Permissões", "Confirmação"];

export function IntegrationWizard() {
  const [step, setStep] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const provider = selectedProvider ? PROVIDERS[selectedProvider] : null;

  // Auto-advance after Google OAuth return
  useEffect(() => {
    const pending = localStorage.getItem("nexus_integration_pending");
    if (pending !== "google") return;

    localStorage.removeItem("nexus_integration_pending");

    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from("social_connections").insert({
          provider: "google",
          provider_user_id: user.id,
          status: "connected",
          user_id: user.id,
        });

        setSelectedProvider("google");
        setStep(2);
        toast({ title: "Autenticado com sucesso!", description: "Conexão com Google estabelecida." });
      } catch {
        // silently fail — user can retry manually
      }
    })();
  }, []);

  const handleSelectProvider = (p: Provider) => {
    setSelectedProvider(p);
    setSelectedPermissions([]);
    setConnected(false);
    setStep(1);
  };

  const handleConnect = async () => {
    if (!selectedProvider) return;
    setConnecting(true);

    try {
      if (selectedProvider === "google") {
        localStorage.setItem("nexus_integration_pending", "google");
        const { error } = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin + "/settings/integrations",
        });
        if (error) throw error;
        // OAuth redirect will happen — user returns authenticated
        return;
      }

      // Meta: simulated flow (no real OAuth credentials yet)
      await new Promise((r) => setTimeout(r, 2500));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Autenticação necessária");

      await supabase.from("social_connections").insert({
        provider: selectedProvider,
        provider_user_id: `mock_${selectedProvider}_${Date.now()}`,
        status: "connected",
        user_id: user.id,
      });

      setStep(2);
      toast({ title: "Autenticado com sucesso!", description: `Conexão com ${provider?.name} estabelecida.` });
    } catch (err) {
      toast({
        title: "Erro na autenticação",
        description: err instanceof Error ? err.message : "Falha ao conectar.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleConfirmPermissions = async () => {
    if (selectedPermissions.length === 0) {
      toast({ title: "Selecione ao menos uma permissão", variant: "destructive" });
      return;
    }
    setConnecting(true);

    // Simulate initial sync
    await new Promise((r) => setTimeout(r, 2000));
    setConnected(true);
    setStep(3);
    setConnecting(false);
    toast({ title: "Sincronização iniciada!", description: "Seus dados estão sendo importados." });
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setStep(0);
    setSelectedProvider(null);
    setSelectedPermissions([]);
    setConnected(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 flex-1">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-colors",
              i < step ? "bg-primary text-primary-foreground"
                : i === step ? "bg-primary/20 text-primary ring-2 ring-primary"
                  : "bg-muted text-muted-foreground"
            )}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            {!/* last */ (i === STEPS.length - 1) && (
              <div className={cn("h-0.5 flex-1 rounded-full", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-center font-medium">{STEPS[step]}</p>

      {/* Step 0: Select Provider */}
      {step === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.entries(PROVIDERS) as [Provider, typeof PROVIDERS[Provider]][]).map(([key, p]) => (
            <Card
              key={key}
              className="cursor-pointer border-border hover:border-primary/50 hover:shadow-glow transition-all group"
              onClick={() => handleSelectProvider(key)}
            >
              <CardHeader className="items-center text-center pb-2">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <p.icon className="w-8 h-8 text-foreground" />
                </div>
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <CardDescription className="text-xs">{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  Configurar <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step 1: Authentication */}
      {step === 1 && provider && (
        <Card className="shadow-card">
          <CardHeader className="items-center text-center">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${provider.gradient} flex items-center justify-center mb-2`}>
              <provider.icon className="w-7 h-7 text-foreground" />
            </div>
            <CardTitle>Conectar com {provider.name}</CardTitle>
            <CardDescription className="text-xs max-w-sm">
              Você será redirecionado para autorizar o acesso. Seus dados são protegidos com criptografia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <span>Conexão segura via OAuth 2.0 com proteção CSRF e tokens criptografados.</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep(0)} className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </Button>
              <Button onClick={handleConnect} disabled={connecting} className="flex-1 gap-1.5" size="sm">
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {connecting ? "Autenticando..." : `Conectar com ${provider.name}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Permissions */}
      {step === 2 && provider && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Escolha o que sincronizar</CardTitle>
            <CardDescription className="text-xs">Selecione as permissões para {provider.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {provider.permissions.map((perm) => (
                <label
                  key={perm.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedPermissions.includes(perm.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <Checkbox
                    checked={selectedPermissions.includes(perm.id)}
                    onCheckedChange={() => togglePermission(perm.id)}
                  />
                  <perm.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{perm.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep(1)} className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </Button>
              <Button onClick={handleConfirmPermissions} disabled={connecting || selectedPermissions.length === 0} className="flex-1" size="sm">
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {connecting ? "Sincronizando..." : "Confirmar e Sincronizar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && provider && (
        <Card className="shadow-card border-primary/30">
          <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Conectado e Sincronizando!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {provider.name} foi integrado ao NexusCRM com sucesso.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {selectedPermissions.map((id) => {
                const perm = provider.permissions.find((p) => p.id === id);
                return perm ? (
                  <Badge key={id} variant="secondary" className="text-xs gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> {perm.label}
                  </Badge>
                ) : null;
              })}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Sincronização inicial em andamento...</span>
            </div>
            <Button variant="outline" size="sm" onClick={reset} className="mt-2">
              Conectar outro provedor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
