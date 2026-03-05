import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { Mail, Send, Inbox, Archive } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Enviados", icon: Send, count: 142 },
  { label: "Recebidos", icon: Inbox, count: 89 },
  { label: "Arquivados", icon: Archive, count: 34 },
];

const emails = [
  { to: "carolina@techcorp.br", subject: "Follow-up: Proposta ERP", date: "Hoje 10:15", status: "Aberto" },
  { to: "rafael@dataflow.io", subject: "Re: Migração Cloud — próximos passos", date: "Hoje 09:42", status: "Respondido" },
  { to: "amanda@globalpay.com", subject: "Proposta Comercial SaaS Enterprise", date: "Ontem", status: "Aberto" },
  { to: "bruno@finstack.com.br", subject: "Convite: Demo produto", date: "3 Mar", status: "Enviado" },
  { to: "lucia@retailmax.com", subject: "Re: Plataforma Digital — dúvidas", date: "2 Mar", status: "Respondido" },
];

const Comunicacao = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Comunicação</h1>
            <p className="text-xs text-muted-foreground">E-mails e mensagens</p>
          </div>
        </header>
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors",
                  activeTab === i ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className="ml-1 text-[10px] opacity-70">{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {emails.map((email, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-card-foreground truncate">{email.subject}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{email.to}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{email.date}</span>
                  <span className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    email.status === "Respondido" ? "bg-success/15 text-success" :
                    email.status === "Aberto" ? "bg-accent/15 text-accent" : "bg-secondary text-secondary-foreground"
                  )}>{email.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Comunicacao;
