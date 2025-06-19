
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import AddClient from "./pages/AddClient";
import Appointments from "./pages/Appointments";
import CalendarView from "./pages/CalendarView";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Services from "./pages/Services";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');
  }, [location]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isAuthenticated && <AppSidebar />}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-client" element={<AddClient />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
