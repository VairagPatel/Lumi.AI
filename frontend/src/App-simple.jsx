// SIMPLE VERSION - NO AUTH LOADING
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-[#F5F3EF] min-h-screen font-sans text-gray-800 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;
