import { useState, useEffect } from "react";
import { Image, FileText, Sparkles } from "lucide-react";
import PhotoToImageSection from "../components/PhotoToImageSection.jsx";
import TextToImageSection from "../components/TextToImageSection.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const CreatePage = () => {
  const [activeTab, setActiveTab] = useState("photo");
  const { user } = useAuth();

  // Guest usage tracking
  const [guestGenerations, setGuestGenerations] = useState(0);
  const MAX_GUEST_GENERATIONS = 3;

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem("guestGenerations") || 0;
      setGuestGenerations(parseInt(saved, 10));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("guestGenerations", guestGenerations);
    }
  }, [guestGenerations, user]);

  const canGenerate = user || guestGenerations < MAX_GUEST_GENERATIONS;

  const handleGeneration = () => {
    if (!user) setGuestGenerations((prev) => prev + 1);
  };

  return (
    <div className="relative">
      {/* Soft gradient header band */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#00E5A0]/15 to-transparent" />

      <section className="container mx-auto pt-12 pb-16 px-6">
        {/* Intro */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold text-[#0D1B2A]">
            <Sparkles size={14} className="text-[#00C4CC]" />
            Create with LumiAI
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#0D1B2A]">
            Turn Photos & Prompts into Art
          </h1>
          <p className="mt-2 text-[#0D1B2A]/70">
            Choose a mode, describe your vision, and let LumiAI paint the magic ✨
          </p>
        </header>

        {/* Guest banner */}
        {!user && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 shadow-sm p-4 text-sm text-center">
            ⚡ You’re using LumiAI as a guest. You have{" "}
            <span className="font-bold">
              {Math.max(0, MAX_GUEST_GENERATIONS - guestGenerations)}
            </span>{" "}
            free generations left today.{" "}
            <a
              href="/auth"
              className="text-[#00C4CC] font-semibold underline underline-offset-2"
            >
              Login / Sign Up
            </a>{" "}
            to unlock tokens & history.
          </div>
        )}

        {/* Tab switcher */}
        <div className="mx-auto max-w-3xl">
          <div className="relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md">
            <div className="grid grid-cols-2">
              <button
                onClick={() => setActiveTab("photo")}
                className={`relative flex items-center justify-center gap-2 py-4 font-semibold transition ${
                  activeTab === "photo"
                    ? "text-[#00C4CC]"
                    : "text-[#0D1B2A]/70 hover:text-[#0D1B2A]"
                }`}
              >
                <Image size={20} className="text-[#00E5A0]" />
                Photo to Art
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={`relative flex items-center justify-center gap-2 py-4 font-semibold transition ${
                  activeTab === "text"
                    ? "text-[#00C4CC]"
                    : "text-[#0D1B2A]/70 hover:text-[#0D1B2A]"
                }`}
              >
                <FileText size={20} className="text-[#00E5A0]" />
                Text to Art
              </button>
            </div>

            {/* Animated active bar */}
            <div
              className={`absolute bottom-0 h-1 w-1/2 rounded-b-2xl bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] transition-transform duration-300 ${
                activeTab === "text" ? "translate-x-full" : ""
              }`}
            />
          </div>
        </div>

        {/* Content panel */}
        <div className="mt-8">
          {canGenerate ? (
            <div className="relative overflow-hidden">
              <div className="rounded-3xl bg-white shadow-lg border border-gray-200 p-6 md:p-8">
                {activeTab === "photo" && (
                  <PhotoToImageSection onGenerate={handleGeneration} />
                )}
                {activeTab === "text" && (
                  <TextToImageSection onGenerate={handleGeneration} />
                )}
              </div>
              {/* subtle corner glow */}
              <span className="pointer-events-none absolute -z-10 -bottom-6 -right-6 h-40 w-40 rounded-full bg-[#00C4CC]/20 blur-3xl" />
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600">
                🚫 You’ve used all {MAX_GUEST_GENERATIONS} free generations today.
              </p>
              <a
                href="/auth"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-md hover:shadow-lg active:scale-95 transition"
              >
                Get Unlimited with Login
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CreatePage;
