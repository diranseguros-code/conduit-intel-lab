import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { IntegrationWizard } from "@/components/crm/IntegrationWizard";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Integrations() {
  return (
    <div className="flex h-screen overflow-hidden">
      <CrmSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Integrações</h1>
              <p className="text-xs text-muted-foreground">Conecte Google e Meta ao NexusCRM de forma segura</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] gap-1">
                <Shield className="w-3 h-3" /> OAuth 2.0
              </Badge>
              <Link to="/privacy" className="text-[10px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </header>
        <div className="p-6">
          <IntegrationWizard />
        </div>
      </main>
    </div>
  );
}
