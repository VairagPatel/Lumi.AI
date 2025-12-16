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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-x-hidden relative">
      {/* Floating background elements - contained within viewport */}
      <div className="pointer-events-none absolute top-10 left-10 h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full bg-gradient-to-br from-[#00E5A0]/30 to-[#00C4CC]/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-64 w-64 sm:h-80 sm:w-80 lg:h-[28rem] lg:w-[28rem] rounded-full bg-gradient-to-tl from-[#00C4CC]/25 to-[#00E5A0]/15 blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-gradient-to-br from-[#00E5A0]/10 via-white/90 to-[#00C4CC]/10 backdrop-blur-xl border border-[#00E5A0]/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-center relative overflow-hidden"
        >
          {/* Enhanced glow background effect - contained within card */}
          <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-[#00E5A0]/30 to-[#00C4CC]/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-tl from-[#00C4CC]/30 to-[#00E5A0]/20 rounded-full blur-3xl opacity-50"></div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent mb-6 sm:mb-8 relative z-10"
        >
          👤 My Profile
        </motion.h2>

        {isAuthenticated && user ? (
          <>
            {/* Welcome message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg font-medium text-[#0D1B2A] mb-4 sm:mb-6 relative z-10 break-words"
            >
              <span className="font-semibold text-[#00C4CC]">Welcome:</span> {getUserDisplayName(user)}
            </motion.p>

            {/* Credits Balance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
              className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white rounded-xl sm:rounded-2xl py-4 sm:py-6 px-4 sm:px-8 mb-6 sm:mb-8 shadow-lg relative overflow-hidden"
            >
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
              <h3 className="text-base sm:text-lg font-semibold flex items-center justify-center gap-2 relative z-10 flex-wrap">
                <span>Available Credits</span> <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
              </h3>
              <p className="text-2xl sm:text-3xl font-extrabold mt-2 relative z-10">
                {loading ? "..." : credits ?? 15}
              </p>
              <p className="text-xs sm:text-sm opacity-80 mt-1 relative z-10">
                New users start with 15 free credits 🎁
              </p>
            </motion.div>

            {/* Buy Credits Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10"
            >
              <Link to="/pricing">
                <button className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-md hover:shadow-lg transition-all relative overflow-hidden group">
                  <span className="relative z-10">Buy More Credits 💎</span>
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#0D1B2A]/70 text-sm sm:text-base relative z-10 break-words"
          >
            You are not logged in. Please{" "}
            <Link to="/auth" className="text-[#00C4CC] font-semibold hover:text-[#00E5A0] transition-colors">
              login
            </Link>{" "}
            to see your profile.
          </motion.p>
        )}
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
