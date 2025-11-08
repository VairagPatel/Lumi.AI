// src/components/GallerySection.jsx
import GalleryCard from "./GalleryCard.jsx";
import GalleryStories from "./GalleryStories.jsx";
import { assets } from "../assets/assets.js";
import { Sparkles } from "lucide-react";

const GallerySection = () => {
  const topGalleryItems = [
    { imageSrc: assets.grid_1, title: "Whimsical Forest Dweller" },
    { imageSrc: assets.grid_2, title: "Sky Pirate's Retreat" },
    { imageSrc: assets.grid_3, title: "Spirited River Journey" },
    { imageSrc: assets.grid_4, title: "Enchanted Garden Spirit" },
  ];

  return (
    <section className="relative container mx-auto px-6 py-16 sm:px-8">
      {/* soft background halo */}
      <div className="pointer-events-none absolute -z-10 left-1/2 top-6 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#00E5A0]/12 to-[#00C4CC]/12 blur-3xl" />

      {/* header */}
      <header className="relative mb-10 text-center">
        <div
          className="
            mx-auto inline-flex items-center gap-2 rounded-full
            border border-[#00E5A0]/30 bg-[#00E5A0]/10
            px-3 py-1 text-xs font-semibold text-[#0E7490]
          "
        >
          <Sparkles size={14} className="text-[#00C4CC]" />
          Curated Showcase
        </div>

        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Magical LumiAI Transformations
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Cozy, painterly scenes brought to life with a mint-fresh touch.
        </p>

        {/* animated underline */}
        <span className="mx-auto mt-4 block h-1 w-24 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]" />
      </header>

      {/* top grid */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
        {topGalleryItems.map((item, idx) => (
          <div
            key={idx}
            className="
              [transition-delay:calc(var(--i)*60ms)]
            "
            style={{ ["--i"]: idx }}
          >
            <GalleryCard imageSrc={item.imageSrc} title={item.title} />
          </div>
        ))}
      </div>

      {/* stories (before/after) */}
      <GalleryStories />
    </section>
  );
};

export default GallerySection;
