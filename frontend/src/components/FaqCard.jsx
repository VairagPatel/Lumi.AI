// src/components/FaqCard.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FaqCard = ({ question, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl bg-white
        ring-1 ring-gray-200 shadow-[0_10px_26px_-18px_rgba(0,0,0,.25)]
        transition-all duration-300 hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,.28)]
      "
    >
      {/* soft mint glow */}
      <div className="pointer-events-none absolute -top-16 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-[#00E5A0]/15 to-[#00C4CC]/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          flex w-full items-center justify-between gap-4 px-6 py-5 sm:px-7 sm:py-6
          text-left
        "
        aria-expanded={open}
      >
        <h3
          className="
            text-lg sm:text-xl font-semibold tracking-tight text-[#1F2937]
            group-hover:text-[#0E7490] transition-colors
          "
        >
          {question}
        </h3>

        {/* chevron */}
        <span
          className={`
            inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
            bg-gradient-to-br from-[#00E5A0]/15 to-[#00C4CC]/15 text-[#00BFA6]
            ring-1 ring-[#00E5A0]/25 transition-all duration-300
            ${open ? "rotate-180" : "rotate-0"}
          `}
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </span>
      </button>

      {/* divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-[#00E5A0]/30 to-[#00C4CC]/30" />

      {/* content */}
      <div
        className={`
          grid transition-[grid-template-rows,opacity] duration-300 ease-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 pb-6 pt-4 sm:px-7 sm:pb-7 text-[15px] leading-relaxed text-gray-600">
            {children}
          </div>
        </div>
      </div>

      {/* bottom mint bar that slides in on hover */}
      <span
        className="
          pointer-events-none absolute inset-x-0 bottom-0 h-1
          translate-y-full group-hover:translate-y-0
          bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] transition-transform duration-300
        "
      />
    </div>
  );
};

export default FaqCard;
