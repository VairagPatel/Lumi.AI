// src/components/GalleryStories.jsx
import { assets } from "../assets/assets.js";

const StoryCard = ({ title, beforeSrc, afterSrc, description }) => {
  return (
    <section
      className="
        group relative overflow-hidden rounded-2xl bg-white
        ring-1 ring-gray-200 shadow-[0_12px_28px_-18px_rgba(0,0,0,.25)]
        transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_46px_-18px_rgba(0,0,0,.3)]
      "
    >
      {/* header */}
      <div className="px-6 pt-6 pb-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
      </div>

      {/* comparison grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-4 md:grid-cols-2">
        {/* before */}
        <figure
          className="
            relative overflow-hidden rounded-xl ring-1 ring-gray-200
          "
        >
          <img
            src={beforeSrc}
            alt="Original"
            loading="lazy"
            className="
              h-64 w-full object-cover transition-transform duration-700
              sm:h-72 md:h-80
              group-hover:scale-[1.04]
            "
            onError={(e) => {
              e.currentTarget.src =
                'https://placehold.co/800x600/F9FAFB/0D1B2A?text=Original';
            }}
          />
          <figcaption className="absolute left-3 top-3">
            <span
              className="
                rounded-full border border-gray-200 bg-white/90 px-2.5 py-1
                text-[11px] font-semibold text-gray-700 backdrop-blur
              "
            >
              Before
            </span>
          </figcaption>
        </figure>

        {/* after */}
        <figure
          className="
            group/after relative overflow-hidden rounded-xl ring-1 ring-gray-200
          "
        >
          <img
            src={afterSrc}
            alt="Transformed (LumiAI)"
            loading="lazy"
            className="
              h-64 w-full object-cover transition-transform duration-700
              sm:h-72 md:h-80
              group-hover:scale-[1.06]
            "
            onError={(e) => {
              e.currentTarget.src =
                'https://placehold.co/800x600/F9FAFB/0D1B2A?text=LumiAI+Art';
            }}
          />
          {/* mint overlay pulse */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-tr from-[#00E5A0]/12 to-[#00C4CC]/12
              opacity-0 transition-opacity duration-500
              group-hover:opacity-100
            "
          />
          {/* sweep highlight */}
          <span
            className="
              pointer-events-none absolute -left-1/4 top-0 h-full w-1/3
              translate-x-[-140%] rotate-6
              bg-gradient-to-r from-transparent via-white/50 to-transparent
              transition-transform duration-700 ease-out
              group-hover:translate-x-[260%]
            "
          />
          <figcaption className="absolute left-3 top-3">
            <span className="rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] px-2.5 py-1 text-[11px] font-semibold text-white">
              After (LumiAI)
            </span>
          </figcaption>
        </figure>
      </div>

      {/* description */}
      <p className="px-6 pb-6 text-sm leading-relaxed text-gray-700">
        {description}
      </p>

      {/* bottom gradient bar */}
      <span
        className="
          pointer-events-none absolute inset-x-0 bottom-0 h-1
          translate-y-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]
          transition-transform duration-500 group-hover:translate-y-0
        "
      />
    </section>
  );
};

const GalleryStories = () => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <StoryCard
        title="Mountain Lake → Ghibli Vista"
        beforeSrc={assets.grid_1}
        afterSrc={assets.grid_2}
        description="A tranquil lake shifts into a dreamy Ghibli landscape with painterly skies, soft light, and mint-fresh tones."
      />
      <StoryCard
        title="Urban Street → Cozy Town"
        beforeSrc={assets.grid_3}
        afterSrc={assets.grid_4}
        description="Crisp lines mellow into warm shapes; windows glow; greenery spreads across rooftops—hello whimsical life."
      />
    </div>
  );
};

export default GalleryStories;
