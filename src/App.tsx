import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Demandes from "./pages/Demandes";
import Depenses from "./pages/Depenses";
import Operations from "./pages/Operations";
import Campagnes from "./pages/Campagnes";
import Services from "./pages/Services";
import Utilisateurs from "./pages/Utilisateurs";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/demandes" element={<Demandes />} />
          <Route path="/depenses" element={<Depenses />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/campagnes" element={<Campagnes />} />
          <Route path="/services" element={<Services />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
