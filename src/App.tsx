import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Integrations from "./pages/Integrations";
import Inbox from "./pages/Inbox";
import Leads from "./pages/Leads";
import Contas from "./pages/Contas";
import Pipeline from "./pages/Pipeline";
import Comunicacao from "./pages/Comunicacao";
import Calls from "./pages/Calls";
import AiInsights from "./pages/AiInsights";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/contas" element={<Contas />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/comunicacao" element={<Comunicacao />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/ai-insights" element={<AiInsights />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings/integrations" element={<Integrations />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
