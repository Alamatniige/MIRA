import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/routes/Dashboard";
import Assets from "@/routes/Assets";
import MyAssets from "@/routes/MyAssets";
import AssetDetails from "@/routes/AssetDetails";
import Assignments from "@/routes/Assignments";
import QRScanner from "@/routes/QRScanner";
import Reports from "@/routes/Reports";
import NotFound from "@/routes/NotFound";
import { SettingsPage } from "@/pages/settings/SettingsPage";

const queryClient = new QueryClient();

const App = () => {
  const Router = typeof window === "undefined" ? MemoryRouter : BrowserRouter;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider>
        <RoleProvider>
          <Router>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/assets/:id" element={<AssetDetails />} />
                <Route path="/my-assets" element={<MyAssets />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/qr-scanner" element={<QRScanner />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </RoleProvider>
      </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
