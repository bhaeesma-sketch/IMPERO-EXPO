import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { ThemeProvider } from "@/hooks/use-theme";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth";
import AdminPage from "@/pages/admin";
import PrivacyPolicy from "@/pages/privacy-policy";
import AboutPage from "@/pages/about";
import TermsPage from "@/pages/terms";
import NotFound from "@/pages/not-found";
import ProductDetail from "@/pages/product-detail";
import ComparePrices from "@/pages/compare-prices";
import TryOnPage from "@/pages/try-on";
import BespokePage from "@/pages/bespoke";
import CatalogPage from "@/pages/catalog";
import WishlistPage from "@/pages/wishlist";
import EMICalculator from "@/pages/emi-calculator";
import { useAnalytics } from "@/hooks/use-analytics";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AnimatePresence, motion } from "framer-motion";

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/bespoke" component={BespokePage} />
          <Route path="/catalog" component={CatalogPage} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/compare" component={ComparePrices} />
          <Route path="/try-on" component={TryOnPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/about" component={AboutPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/wishlist" component={WishlistPage} />
          <Route path="/emi-calculator" component={EMICalculator} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

// Analytics wrapper component
function AnalyticsTracker() {
  useAnalytics();
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WishlistProvider>
          <TooltipProvider>
            <ScrollProgress />
            <AnalyticsTracker />
            <AnimatedRoutes />
            <Toaster />
          </TooltipProvider>
          </WishlistProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
