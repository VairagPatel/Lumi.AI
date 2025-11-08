import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* animated mint gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_10%_-10%,#CCFFF1_20%,transparent_60%),radial-gradient(900px_500px_at_90%_10%,#C7F9FF_18%,transparent_55%)]" />

      {/* floating soft orbs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#00E5A0]/15 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute right-[-60px] top-20 h-80 w-80 rounded-full bg-[#00C4CC]/20 blur-3xl animate-[pulse_3.5s_ease-in-out_infinite]" />

      <div className="container mx-auto px-6 py-20 lg:py-32 text-center">
        {/* badge */}
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/40 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[#0E7490] backdrop-blur">
          <Sparkles size={14} className="text-[#00C4CC]" />
          Ghibli-inspired AI Art
        </div>

        {/* heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Bring Your Ideas to Life with{" "}
          <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
            LumiAI
          </span>
        </h1>

        {/* subcopy */}
        <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-[#0D1B2A]/70">
          Transform photos and prompts into dreamy, painterly scenes. Create
          cozy, whimsical artwork in seconds — mint-fresh and magical ✨
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <button
            onClick={() => navigate("/create")}
            className="
              relative inline-flex items-center justify-center rounded-xl px-7 py-3
              font-semibold text-white
              transition-all
              bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]
              shadow-[0_12px_28px_-12px_rgba(0,196,204,.45)]
              hover:shadow-[0_18px_42px_-12px_rgba(0,196,204,.55)]
              hover:-translate-y-0.5
              focus:outline-none
            "
          >
            Start Creating
            <span className="ml-2 text-white/90">→</span>
            {/* shine sweep */}
            <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 [background:linear-gradient(120deg,transparent,rgba(255,255,255,.6),transparent)] [transform:translateX(-120%)] hover:opacity-100 hover:[transform:translateX(120%)]" />
          </button>

          <button
            onClick={() => navigate("/gallery")}
            className="
              inline-flex items-center justify-center rounded-xl px-7 py-3
              font-semibold text-[#0E7490]
              bg-white/80 backdrop-blur
              border border-[#00E5A0]/40
              hover:border-[#00C4CC]/60
              hover:-translate-y-0.5
              transition-all
              shadow-sm
            "
          >
            View Gallery
          </button>
        </div>

        {/* decorative underline */}
        <div className="mx-auto mt-10 h-1 w-24 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]" />
      </div>
    </section>
  );
};

export default HeroSection;
