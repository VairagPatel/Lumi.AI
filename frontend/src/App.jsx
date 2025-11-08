// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import FeaturesSection from "./components/FeaturesSection.jsx";
import FaqSection from "./components/FaqSection.jsx";
import GallerySection from "./components/GallerySection.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const App = () => {
  return (
    <div className="bg-[#F5F3EF] min-h-screen font-sans text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/faq" element={<FaqSection />} />
          <Route path="/gallery" element={<GallerySection />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Optional protected route */}
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
