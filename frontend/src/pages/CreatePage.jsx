import { useState, useEffect } from "react";
import { Image, FileText, Sparkles, Wand2, Palette } from "lucide-react";
import PhotoToImageSection from "../components/PhotoToImageSection.jsx";
import TextToImageSection from "../components/TextToImageSection.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { authAPI } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";
import { useUserCredits, useRefreshCredits } from "../hooks/useCredits";

const CreatePage = () => {
  const [activeTab, setActiveTab] = useState("photo");
  const { user } = useAuth();
  const [userCredits, setUserCredits] = useState(null);
  const queryClient = useQueryClient();
  
  // Use the new credits hook for better management
  const { data: hookCredits, refetch: refetchCredits } = useUserCredits();
  const refreshCredits = useRefreshCredits();

  // Guest usage tracking
  const [guestGenerations, setGuestGenerations] = useState(0);
  const MAX_GUEST_GENERATIONS = 1;

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem("guestGenerations") || 0;
      setGuestGenerations(parseInt(saved, 10));
    } else {
      // Fetch user credits
      fetchUserCredits();
    }
  }, [user]);

  // Update local credits when hook data changes
  useEffect(() => {
    if (hookCredits !== undefined) {
      setUserCredits(hookCredits);
    }
  }, [hookCredits]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("guestGenerations", guestGenerations);
    }
  }, [guestGenerations, user]);

  const fetchUserCredits = async () => {
    try {
      // Invalidate any cached user data first
      await queryClient.invalidateQueries(['user-credits']);
      await queryClient.invalidateQueries(['auth']);
      
      const response = await authAPI.getCurrentUser();
      // Try to get credits from the API
      const creditsResponse = await authAPI.getUserCredits();
      setUserCredits(creditsResponse.data.data);
      
      console.log("Credits refreshed:", creditsResponse.data.data);
    } catch (error) {
      console.error("Failed to fetch user credits:", error);
    }
  };

  const canGenerate = user ? (userCredits === null || userCredits > 0) : guestGenerations < MAX_GUEST_GENERATIONS;

  const handleGeneration = async () => {
    if (!user) {
      setGuestGenerations((prev) => prev + 1);
    }
    // Credit refresh is now handled automatically in the useGeneration hooks
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

      <section className="container mx-auto pt-16 pb-20 px-6 relative z-10">
        {/* Enhanced header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#0D1B2A] shadow-lg mb-6">
            <Sparkles size={16} className="text-[#00C4CC]" />
            Create with LumiAI
            <div className="w-2 h-2 bg-[#00E5A0] rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#0D1B2A] mb-4 leading-tight">
            Turn <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">Photos & Prompts</span>
            <br />into <span className="bg-gradient-to-r from-[#00C4CC] to-[#00E5A0] bg-clip-text text-transparent">Magical Art</span>
          </h1>
          <p className="text-xl text-[#0D1B2A]/70 max-w-2xl mx-auto leading-relaxed">
            Choose your creative mode, describe your vision, and watch LumiAI transform it into stunning Ghibli-inspired artwork ✨
          </p>
        </header>

        {/* Enhanced user credits banner */}
        {user && userCredits !== null && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200/50 bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm shadow-xl p-6 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-green-100/20" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800 font-bold text-lg">Available Credits</span>
                </div>
                <div className="text-4xl font-black text-emerald-700 mb-2">
                  {userCredits}
                </div>
                <p className="text-emerald-700/80 text-sm">
                  Each generation costs 1 credit • Create amazing art instantly
                </p>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-200/30 rounded-full blur-2xl" />
            </div>
          </div>
        )}

        {/* Enhanced guest banner */}
        {!user && canGenerate && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-amber-200/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-xl p-6 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-orange-100/20" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wand2 className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-800 font-bold text-lg">Guest Mode</span>
                </div>
                <div className="text-4xl font-black text-amber-700 mb-2">
                  {Math.max(0, MAX_GUEST_GENERATIONS - guestGenerations)}
                </div>
                <p className="text-amber-700/80 text-sm mb-3">
                  Free generation remaining as a guest
                </p>
                <a
                  href="/auth"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  <Sparkles size={16} />
                  Get 15 Free Credits
                </a>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl" />
            </div>
          </div>
        )}

        {/* Enhanced tab switcher */}
        <div className="mx-auto max-w-4xl mb-10">
          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab("photo")}
                className={`relative flex items-center justify-center gap-3 py-6 px-8 font-bold text-lg rounded-2xl transition-all duration-300 ${
                  activeTab === "photo"
                    ? "text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-lg transform scale-105"
                    : "text-[#0D1B2A]/70 hover:text-[#0D1B2A] hover:bg-gray-50"
                }`}
              >
                <div className={`p-2 rounded-xl ${activeTab === "photo" ? "bg-white/20" : "bg-[#00E5A0]/10"}`}>
                  <Image size={24} className={activeTab === "photo" ? "text-white" : "text-[#00E5A0]"} />
                </div>
                <div className="text-left">
                  <div>Photo to Art</div>
                  <div className={`text-xs font-normal ${activeTab === "photo" ? "text-white/80" : "text-gray-500"}`}>
                    Transform photos into paintings
                  </div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={`relative flex items-center justify-center gap-3 py-6 px-8 font-bold text-lg rounded-2xl transition-all duration-300 ${
                  activeTab === "text"
                    ? "text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-lg transform scale-105"
                    : "text-[#0D1B2A]/70 hover:text-[#0D1B2A] hover:bg-gray-50"
                }`}
              >
                <div className={`p-2 rounded-xl ${activeTab === "text" ? "bg-white/20" : "bg-[#00C4CC]/10"}`}>
                  <Palette size={24} className={activeTab === "text" ? "text-white" : "text-[#00C4CC]"} />
                </div>
                <div className="text-left">
                  <div>Text to Art</div>
                  <div className={`text-xs font-normal ${activeTab === "text" ? "text-white/80" : "text-gray-500"}`}>
                    Create art from descriptions
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced content panel */}
        <div className="max-w-5xl mx-auto">
          {canGenerate ? (
            <div className="relative">
              <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200/50 p-8 md:p-12 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#00C4CC]/10 to-[#00E5A0]/10 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  {activeTab === "photo" && (
                    <PhotoToImageSection onGenerate={handleGeneration} />
                  )}
                  {activeTab === "text" && (
                    <TextToImageSection onGenerate={handleGeneration} />
                  )}
                </div>
              </div>
              
              {/* Enhanced glow effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00E5A0]/20 to-[#00C4CC]/20 rounded-3xl blur-2xl -z-10 opacity-50" />
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-200/50 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5A0]/5 to-[#00C4CC]/5" />
                
                <div className="relative z-10">
                  <div className="text-8xl mb-6">🎨</div>
                  {user ? (
                    <>
                      <h3 className="text-3xl font-black text-[#0D1B2A] mb-4">
                        You're Out of <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">Credits!</span>
                      </h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        Purchase more credits to continue creating amazing AI art and bring your imagination to life.
                      </p>
                      <a
                        href="/pricing"
                        className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                      >
                        <Sparkles size={20} />
                        Buy More Credits
                      </a>
                    </>
                  ) : (
                    <>
                      <h3 className="text-3xl font-black text-[#0D1B2A] mb-4">
                        You've Used Your <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">Free Generation!</span>
                      </h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        Sign up now to get <span className="font-bold text-[#00C4CC]">15 free credits</span> and create unlimited amazing AI art!
                      </p>
                      <a
                        href="/auth"
                        className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                      >
                        <Sparkles size={20} />
                        Sign Up & Get 15 Free Credits
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CreatePage;
