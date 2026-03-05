import { Mail, Phone, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInteractions } from "@/hooks/use-interactions";
import { Loader2 } from "lucide-react";

const providerIcon: Record<string, typeof Mail> = {
  email: Mail,
  whatsapp: MessageSquare,
  phone: Phone,
  instagram: MessageSquare,
  linkedin: FileText,
  facebook: MessageSquare,
};

const providerColor: Record<string, string> = {
  email: "text-accent",
  whatsapp: "text-success",
  phone: "text-primary",
  instagram: "text-pink-400",
  linkedin: "text-blue-400",
  facebook: "text-indigo-400",
};

export function ActivityFeed() {
  const { data: interactions = [], isLoading } = useInteractions();
  const recent = interactions.slice(0, 6);

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Atividade Recente</h2>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : recent.length === 0 ? (
        <div className="text-center py-10 text-xs text-muted-foreground">Nenhuma atividade recente.</div>
      ) : (
        <div className="divide-y divide-border/50">
          {recent.map((interaction) => {
            const Icon = providerIcon[interaction.provider] ?? MessageSquare;
            const color = providerColor[interaction.provider] ?? "text-muted-foreground";
            return (
              <div key={interaction.id} className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/30 transition-colors">
                <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-card-foreground">
                    {interaction.leads?.name ?? "Lead"} — {interaction.provider}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {interaction.message_content ?? interaction.content_type}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{timeAgo(interaction.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
