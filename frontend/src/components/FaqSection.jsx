// src/components/FaqSection.jsx
import FaqCard from "./FaqCard.jsx";

const FaqSection = () => (
  <section className="relative container mx-auto px-6 py-20">
    {/* subtle background halo */}
    <div className="pointer-events-none absolute -z-10 left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#00E5A0]/12 to-[#00C4CC]/12 blur-3xl" />

    {/* Heading */}
    <div className="mb-12 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold text-[#0E7490]">
        Help Center
      </div>
      <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
          Frequently Asked Questions
        </span>
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-gray-600">
        Everything you need to know about using LumiAI’s mint-fresh magic.
      </p>
    </div>

    {/* FAQ Grid */}
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
      <FaqCard question="What is LumiAI?" defaultOpen>
        LumiAI transforms your photos and prompts into Ghibli-inspired artwork
        using advanced AI models—keeping your subject’s essence while adding a
        painterly charm.
      </FaqCard>

      <FaqCard question="What are the key features of LumiAI?">
        Photo-to-Art, Text-to-Image, style controls, background generation, and
        more—wrapped in a clean, mint-on-white interface built for delight.
      </FaqCard>

      <FaqCard question="Can I choose different art styles?">
        Yes! Mix moods and influences to guide color, texture, and composition.
        You keep creative control while LumiAI handles the brushwork.
      </FaqCard>

      <FaqCard question="Is LumiAI available on mobile?">
        Absolutely. The web app is responsive, so you can create on desktop,
        tablet, or phone—anywhere inspiration strikes ✨
      </FaqCard>
    </div>
  </section>
);

export default FaqSection;
