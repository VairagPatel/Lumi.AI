// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import useAuthStore from './store/useAuthStore';
import useThemeStore from './store/useThemeStore';

// Pages
import LandingPage from "./pages/LandingPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import FeaturesPage from "./pages/FeaturesPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const { loadUser } = useAuthStore();
  const { isDark, setTheme } = useThemeStore();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Initialize theme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark || prefersDark);
  }, [isDark, setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:bg-gray-900 min-h-screen font-sans text-slate-700 dark:text-gray-100 flex flex-col transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F9FAFB' : '#111827',
            border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#00E5A0',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;
