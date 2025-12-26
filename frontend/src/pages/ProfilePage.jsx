import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { getUserDisplayName } from "../utils/userDisplay";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCredits();
    }
  }, [isAuthenticated, user]);

  const fetchCredits = async () => {
    try {
      const response = await authAPI.getUserCredits();
      setCredits(response.data.data);
    } catch (error) {
      console.error("Failed to fetch credits:", error);
      setCredits(15); // Default fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-[#ECFDF5] to-[#F0F9FF] relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5A0]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C4CC]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}} />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto py-20 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Enhanced profile card */}
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#00C4CC]/10 to-[#00E5A0]/10 rounded-full blur-2xl" />

            {/* Enhanced title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative z-10 mb-12"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#0D1B2A] shadow-lg mb-6">
                <Sparkles size={16} className="text-[#00C4CC]" />
                My Profile
                <div className="w-2 h-2 bg-[#00E5A0] rounded-full animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                Welcome Back!
              </h2>
            </motion.div>

            {isAuthenticated && user ? (
              <div className="relative z-10">
                {/* Enhanced welcome message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-10"
                >
                  <div className="text-2xl font-bold text-[#0D1B2A] mb-2">
                    Hello, <span className="text-[#00C4CC]">{getUserDisplayName(user)}</span>! 👋
                  </div>
                  <p className="text-gray-600">
                    Welcome back to your creative dashboard
                  </p>
                </motion.div>

                {/* Enhanced credits balance card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
                  className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white rounded-3xl py-8 px-10 mb-10 shadow-2xl relative overflow-hidden"
                >
                  {/* Enhanced shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  
                  <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Sparkles size={24} className="animate-pulse" />
                      <h3 className="text-2xl font-black">Available Credits</h3>
                    </div>
                    <div className="text-6xl font-black mb-3">
                      {loading ? "..." : credits ?? 15}
                    </div>
                    <p className="text-white/90 text-lg">
                      {loading ? "Loading..." : "Ready to create amazing art! 🎨"}
                    </p>
                    <div className="mt-4 text-sm text-white/80">
                      New users start with 15 free credits 🎁
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4 relative z-10"
                >
                  <Link to="/create">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-8 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                        Start Creating Art
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.button>
                  </Link>
                  
                  <Link to="/pricing">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-8 rounded-2xl font-bold text-lg text-[#0D1B2A] bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all"
                    >
                      Buy More Credits 💎
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 text-center"
              >
                <div className="text-6xl mb-6">🔐</div>
                <h3 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                  Please Log In
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  You need to be logged in to view your profile and credits.
                </p>
                <Link to="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-xl hover:shadow-2xl transition-all"
                  >
                    <Sparkles size={20} />
                    Login / Sign Up
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Add shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
