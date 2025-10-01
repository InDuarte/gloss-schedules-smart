import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Booking } from "./pages/Booking";
import { Pricing } from "./pages/Pricing";
import { Success } from "./pages/Success";
import { SuperAdmin } from "./pages/SuperAdmin";
import { Calendar } from "./pages/Calendar";
import { Clients } from "./pages/Clients";
import { Services } from "./pages/Services";
import { Professionals } from "./pages/Professionals";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success" element={<Success />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/services" element={<Services />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
