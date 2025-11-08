import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-10 text-center relative overflow-hidden"
      >
        {/* Glow background effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00E5A0]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00C4CC]/20 rounded-full blur-3xl"></div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extrabold text-[#0D1B2A] mb-8"
        >
          👤 My Profile
        </motion.h2>

        {user ? (
          <>
            {/* Email */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-medium text-gray-800 mb-6"
            >
              <span className="font-semibold">Email:</span> {user.email}
            </motion.p>

            {/* Token Balance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
              className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white rounded-2xl py-6 px-8 mb-8 shadow-lg"
            >
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                Available Tokens <Sparkles size={18} />
              </h3>
              <p className="text-3xl font-extrabold mt-2">
                {user.tokens ?? 25}
              </p>
              <p className="text-xs opacity-80 mt-1">
                Free users start with 25 tokens 🎁
              </p>
            </motion.div>

            {/* Buy Tokens Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/pricing">
                <button className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-md hover:shadow-lg transition-all">
                  Buy More Tokens 💎
                </button>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            You are not logged in. Please{" "}
            <Link to="/auth" className="text-[#00C4CC] font-semibold">
              login
            </Link>{" "}
            to see your profile.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
