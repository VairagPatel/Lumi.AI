import { Image, Palette, Users, Sparkles } from "lucide-react";
import { assets } from "../assets/assets.js";

const LumiAISteps = () => {
  return (
    <section className="container mx-auto px-6 pb-20">
      <div
        className="
          grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start
          rounded-3xl bg-white/90 shadow-[0_10px_30px_-12px_rgba(0,0,0,.08)]
          ring-1 ring-gray-200 p-6 sm:p-8 lg:p-10 relative overflow-hidden
        "
      >
        {/* soft background mint glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#00E5A0]/20 to-[#00C4CC]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tl from-[#00C4CC]/15 to-[#00E5A0]/15 blur-3xl" />

        {/* TEXT SIDE */}
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Photo to LumiAI Art
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
            Transform any photo into breathtaking Ghibli-inspired artwork with
            LumiAI. Upload your image, describe the mood, scene, or characters,
            and let LumiAI reimagine it with magical artistic flair ✨
          </p>

          {/* Steps */}
          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-br from-[#00E5A0]/18 to-[#00C4CC]/18 text-[#00C4CC] ring-1 ring-[#00E5A0]/20">
                <Image size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2937] text-lg">
                  Simple Prompting
                </h3>
                <p className="text-gray-600 text-sm">
                  Use natural language to describe your vision — no artistic
                  experience required. LumiAI brings your imagination to life.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-br from-[#00E5A0]/18 to-[#00C4CC]/18 text-[#00C4CC] ring-1 ring-[#00E5A0]/20">
                <Palette size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2937] text-lg">
                  Style Control
                </h3>
                <p className="text-gray-600 text-sm">
                  Dial in the mood & artistic influences — from dreamy
                  landscapes to vibrant character art.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-br from-[#00E5A0]/18 to-[#00C4CC]/18 text-[#00C4CC] ring-1 ring-[#00E5A0]/20">
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2937] text-lg">
                  Character Integration
                </h3>
                <p className="text-gray-600 text-sm">
                  Add pets, friends, or family into magical LumiAI scenes while
                  keeping their essence intact.
                </p>
              </div>
            </li>
          </ul>

          {/* CTA */}
          <div className="mt-8">
            <a
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold
                         text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]
                         shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Sparkles size={18} className="text-black"/>
              Try LumiAI
            </a>
          </div>
        </div>

        {/* IMAGE SIDE */}
        <div className="order-1 lg:order-2">
          <div
            className="
              relative rounded-3xl overflow-hidden bg-white
              ring-1 ring-gray-200 shadow-[0_12px_28px_-12px_rgba(0,0,0,.12)]
              /* keep image nicely contained */
              w-full aspect-[5/4] md:aspect-[4/3] lg:aspect-[5/4]
            "
          >
            <img
              src={assets.step1}
              alt="Photo to LumiAI Art Transformation"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            {/* small floating badge */}
            <div className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full bg-white/80 backdrop-blur px-3 py-1.5 text-xs font-semibold text-[#0E7490] ring-1 ring-white/60 shadow">
              Mint Studio Look
            </div>
            <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 rounded-full bg-white/85 backdrop-blur px-3 py-1.5 text-xs font-semibold text-[#047857] ring-1 ring-white/60 shadow">
              Ghibli-style ✨
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LumiAISteps;
