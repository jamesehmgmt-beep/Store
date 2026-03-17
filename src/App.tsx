import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import ApparelPage from "./pages/ApparelPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import AccountPage from "./pages/AccountPage";
import AuthPage from "./pages/AuthPage";
import RewardsPage from "./pages/RewardsPage";
import DeliveryPage from "./pages/DeliveryPage";
import SizeGuidePage from "./pages/SizeGuidePage";
import ReturnsPage from "./pages/ReturnsPage";
import GiftCardsPage from "./pages/GiftCardsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import CareersPage from "./pages/CareersPage";
import SustainabilityPage from "./pages/SustainabilityPage";
import SocialPage from "./pages/SocialPage";
import PressPage from "./pages/PressPage";
import StoresPage from "./pages/StoresPage";
import TeamPage from "./pages/TeamPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/apparel" element={<ApparelPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/orders" element={<OrdersPage />} />
            <Route path="/account/wishlist" element={<WishlistPage />} />
            <Route path="/account/settings" element={<SettingsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/gift-cards" element={<GiftCardsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/sustainability" element={<SustainabilityPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/team" element={<TeamPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;