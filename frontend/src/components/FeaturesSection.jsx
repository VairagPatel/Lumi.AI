// src/components/FeaturesSection.jsx
import FeatureCard from "./FeatureCard.jsx";
import { Eye, FileClock, Sparkles } from "lucide-react";

const FeaturesSection = () => (
  <section className="relative container mx-auto px-6 py-20">
    {/* soft background halo */}
    <div className="pointer-events-none absolute -z-10 left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#00E5A0]/15 to-[#00C4CC]/15 blur-3xl" />

    {/* Heading */}
    <div className="mb-14 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold text-[#0E7490]">
        LumiAI
      </div>
      <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
          LumiAI Features
        </span>
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-gray-600">
        Fast, accurate, and gorgeous—crafted in a soothing mint & white UI.
      </p>
    </div>

    {/* Cards */}
    <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
      <FeatureCard
        icon={<Eye size={24} />}
        title="High-Accuracy Art Generation"
      >
        Preserves your subject while transforming it into enchanting,
        Ghibli-inspired art. Every detail stays expressive and true.
      </FeatureCard>

      <FeatureCard
        icon={<FileClock size={24} />}
        title="Fast Image Processing"
      >
        Get stunning results in seconds. An optimized pipeline keeps your flow
        smooth—no long waits, just create.
      </FeatureCard>

      <FeatureCard
        icon={<Sparkles size={24} />}
        title="Stunning Quality"
      >
        Crisp lines, vibrant palettes, and painterly charm—export high-res
        images that shine anywhere.
      </FeatureCard>
    </div>
  </section>
);

export default FeaturesSection;
