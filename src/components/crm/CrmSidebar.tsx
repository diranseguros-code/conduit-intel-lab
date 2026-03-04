import { 
  LayoutDashboard, Users, Building2, Target, Mail, Phone, 
  Brain, BarChart3, Settings, Bell, Search, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads" },
  { icon: Building2, label: "Contas" },
  { icon: Target, label: "Pipeline" },
  { icon: Mail, label: "Comunicação" },
  { icon: Phone, label: "Calls" },
  { icon: Brain, label: "AI Insights" },
  { icon: BarChart3, label: "Analytics" },
];

const bottomItems = [
  { icon: Bell, label: "Notificações", badge: 3 },
  { icon: Settings, label: "Configurações" },
];

export function CrmSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-ai flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm tracking-tight text-sidebar-accent-foreground">
            NexusCRM
          </span>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent text-muted-foreground text-xs">
            <Search className="w-3.5 h-3.5" />
            <span>Buscar... ⌘K</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
            {item.label === "AI Insights" && !collapsed && (
              <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-gradient-ai text-primary-foreground">
                AI
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 space-y-0.5 border-t border-sidebar-border pt-2">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
            {"badge" in item && item.badge && !collapsed && (
              <span className="ml-auto text-[10px] font-medium w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
