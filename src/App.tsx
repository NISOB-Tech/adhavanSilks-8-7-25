import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Index";
import CatalogPage from "./pages/Catalog";
import DiscountsPage from "./pages/DiscountsPage";
import SareeDetailPage from "./pages/SareeDetail";
import AdminLoginPage from "./pages/admin/Login";
import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminSareesPage from "./pages/admin/Sarees";
import AdminEditSareePage from "./pages/admin/EditSaree";
import AdminSettingsPage from "./pages/admin/Settings";
import AdminBannerImagesPage from "./pages/admin/BannerImages";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="catalog" element={<CatalogPage />} />
              <Route path="discounts" element={<DiscountsPage />} />
              <Route path="saree/:id" element={<SareeDetailPage />} />
              
              {/* You can change this path to something secret if you want */}
              <Route path="SAS/login" element={<AdminLoginPage />} />

              <Route path="admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="admin/sarees" element={
                <ProtectedRoute>
                  <AdminSareesPage />
                </ProtectedRoute>
              } />
              <Route path="admin/sarees/:id" element={
                <ProtectedRoute>
                  <AdminEditSareePage />
                </ProtectedRoute>
              } />
              <Route path="admin/settings" element={
                <ProtectedRoute>
                  <AdminSettingsPage />
                </ProtectedRoute>
              } />
              <Route path="admin/banners" element={
                <ProtectedRoute>
                  <AdminBannerImagesPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
