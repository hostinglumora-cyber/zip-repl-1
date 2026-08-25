import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ScrollToTop from "./components/ScrollToTop";
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import CreateListing from "@/pages/CreateListing";
import ListingDetail from "@/pages/ListingDetail";
import Profile from "@/pages/Profile";
import ProfileCustomization from "@/pages/ProfileCustomization";
import StorefrontBuilder from "@/pages/StorefrontBuilder";
import Following from "@/pages/Following";
import CreatorsDirectory from "@/pages/CreatorsDirectory";
import Messages from "@/pages/Messages";
import Favorites from "@/pages/Favorites";
import Hosting from "@/pages/Hosting";
import Status from "@/pages/Status";
import Docs from "@/pages/Docs";
import Privacy from "@/pages/Privacy";
import Tos from "@/pages/Tos";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import DiscordCallback from "@/pages/DiscordCallback";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#07090E]">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    } else if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/listing/:id" element={<ListingDetail />} />
      
      {/* Creator Storefronts & Profiles */}
      <Route path="/u/:username" element={<Profile />} />
      <Route path="/u/:id" element={<Profile />} />
      <Route path="/creator/:username" element={<Profile />} />
      <Route path="/creators" element={<CreatorsDirectory />} />
      <Route path="/following" element={<Following />} />
      <Route path="/favorites" element={<Favorites />} />
      
      {/* Buyer & Seller Messaging */}
      <Route path="/messages" element={<Messages />} />
      
      {/* Creator Studio & Settings */}
      <Route path="/sell" element={<CreateListing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/profile" element={<ProfileCustomization />} />
      <Route path="/dashboard/storefront" element={<StorefrontBuilder />} />
      
      {/* Community Hosting */}
      <Route path="/hosting" element={<Hosting />} />
      
      {/* Infrastructure & Docs */}
      <Route path="/status" element={<Status />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/tos" element={<Tos />} />
      
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/discord/callback" element={<DiscordCallback />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Admin Panel (Owner & Staff) */}
      <Route path="/admin" element={<Admin />} />

      {/* Direct Creator Storefront Root Alias fallback */}
      <Route path="/:username" element={<Profile />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;