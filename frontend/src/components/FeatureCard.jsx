// src/components/FeatureCard.jsx
const FeatureCard = ({ icon, title, children }) => (
  <div
    className="
      group relative rounded-2xl bg-white p-7 sm:p-8
      shadow-[0_12px_28px_-18px_rgba(0,0,0,.25)] hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,.28)]
      ring-1 ring-gray-200 transition-all duration-300
      hover:-translate-y-1
      overflow-hidden
    "
  >
    {/* mint glow on hover */}
    <div
      className="pointer-events-none absolute -top-20 -right-24 h-56 w-56 rounded-full
                 bg-gradient-to-br from-[#00E5A0]/15 to-[#00C4CC]/15 blur-2xl
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />

    {/* Icon */}
    <div
      className="
        mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl
        bg-gradient-to-br from-[#00E5A0]/18 to-[#00C4CC]/18 text-[#00BFA6]
        ring-1 ring-[#00E5A0]/25 transition-all duration-300
        group-hover:scale-110 group-hover:text-[#00C4CC]
      "
    >
      {icon}
    </div>

    {/* Title */}
    <h3
      className="
        text-xl font-bold tracking-tight text-[#1F2937]
        transition-colors duration-300
        group-hover:text-[#0E7490]
      "
    >
      {title}
    </h3>

    {/* Divider accent */}
    <span
      className="
        mt-2 mb-4 block h-[3px] w-12 rounded-full
        bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]
        opacity-70 group-hover:opacity-100 transition-opacity
      "
    />

    {/* Body */}
    <p className="leading-relaxed text-[15px] text-gray-600">
      {children}
    </p>

    {/* subtle bottom mint bar that slides in */}
    <span
      className="
        pointer-events-none absolute inset-x-0 bottom-0 h-1
        bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]
        translate-y-full group-hover:translate-y-0 transition-transform duration-300
      "
    />
  </div>
);

export default FeatureCard;
