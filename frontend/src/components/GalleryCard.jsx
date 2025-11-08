// src/components/GalleryCard.jsx
const GalleryCard = ({ imageSrc, title }) => {
  return (
    <article
      className="
        group relative overflow-hidden rounded-2xl bg-white
        ring-1 ring-gray-200 shadow-[0_12px_28px_-18px_rgba(0,0,0,.25)]
        transition-all duration-500
        hover:-translate-y-2 hover:shadow-[0_22px_46px_-18px_rgba(0,0,0,.3)]
      "
    >
      {/* animated mint ring */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          bg-[conic-gradient(from_0deg,rgba(0,229,160,.25),rgba(0,196,204,.25),transparent_60%)]
          opacity-0 blur-xl transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      {/* image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          className="
            h-full w-full object-cover
            transition-transform duration-[800ms]
            group-hover:scale-[1.06]
          "
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/600x750/F9FAFB/0D1B2A?text=Preview+Unavailable';
          }}
        />

        {/* mint sheen sweep */}
        <span
          className="
            pointer-events-none absolute -left-1/3 top-0 h-full w-1/3
            bg-gradient-to-r from-transparent via-white/50 to-transparent
            translate-x-[-120%] rotate-6
            transition-transform duration-700 ease-out
            group-hover:translate-x-[260%]
          "
        />

        {/* title chip */}
        <div className="absolute bottom-3 left-3">
          <span
            className="
              inline-flex items-center gap-2 rounded-xl border border-gray-200
              bg-white/85 px-3 py-1.5 text-sm font-semibold text-gray-800
              backdrop-blur
            "
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]" />
            {title}
          </span>
        </div>

        {/* subtle top-to-clear gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-white/10 to-transparent" />
      </div>

      {/* bottom meta bar */}
      <div
        className="
          relative flex items-center justify-between px-4 py-3
          border-t border-gray-200 bg-gray-50
        "
      >
        <span className="text-[11px] tracking-wide text-gray-600">
          Ghibli-style render
        </span>
        <span className="text-[11px] font-semibold text-[#00C4CC]">LumiAI ✨</span>

        {/* slide-in accent on hover */}
        <span
          className="
            pointer-events-none absolute inset-x-0 bottom-0 h-[3px]
            translate-y-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]
            transition-transform duration-500 group-hover:translate-y-0
          "
        />
      </div>
    </article>
  );
};

export default GalleryCard;
