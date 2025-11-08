import { CheckCircle, Sparkles } from "lucide-react";

const plans = [
  { name: "Free", price: "₹0", tokens: "25 tokens", highlight: false },
  { name: "Starter", price: "₹10", tokens: "100 tokens", highlight: false },
  { name: "Pro", price: "₹15", tokens: "200 tokens", highlight: true },
  { name: "Ultimate", price: "₹25", tokens: "500 tokens", highlight: false },
];

const PricingPage = () => {
  return (
    <section className="relative min-h-screen bg-[#F9FAFB]">
      {/* top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-48 bg-gradient-to-b from-[#00E5A0]/15 to-transparent" />

      <div className="container mx-auto px-6 pt-14 pb-20">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold text-[#0D1B2A]">
            <Sparkles size={14} className="text-[#00C4CC]" />
            Tokens, Simple & Transparent
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
            Simple Pricing
          </h2>
          <p className="mt-3 text-gray-600">
            Pick a pack and start generating magical LumiAI art. No hidden fees.
          </p>
        </header>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, i) => (
            <article
              key={i}
              className={`relative group rounded-3xl border shadow-md bg-white p-6 transition
                hover:-translate-y-1 hover:shadow-xl
                ${plan.highlight ? "border-[#00C4CC]" : "border-gray-200"}`}
            >
              {/* highlight ribbon */}
              {plan.highlight && (
                <span className="absolute -top-3 right-5 text-xs font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow">
                  Best Value
                </span>
              )}

              {/* header */}
              <div className="mb-5">
                <h3 className="text-xl font-bold text-[#0D1B2A]">{plan.name}</h3>
                <div className="mt-2 flex items-end gap-1">
                  <p className="text-4xl font-extrabold text-[#00C4CC]">
                    {plan.price}
                  </p>
                  <span className="text-gray-500 mb-1 text-sm">/ pack</span>
                </div>

                {/* token chip */}
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold text-[#0D1B2A]">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]" />
                  {plan.tokens}
                </div>
              </div>

              {/* features */}
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-[#00E5A0]" />
                  Access to Text → Image
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-[#00E5A0]" />
                  Photo → Art Transform
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-[#00E5A0]" />
                  Save & Download Art
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-[#00E5A0]" />
                  Priority Generation (Pro+)
                </li>
              </ul>

              {/* CTA */}
              <div className="mt-6">
                <button
                  className={`w-full rounded-xl py-3 font-semibold transition active:scale-95 ${
                    plan.highlight
                      ? "text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-md hover:shadow-lg"
                      : "bg-[#F3F4F6] text-[#0D1B2A] hover:bg-[#E5E7EB]"
                  }`}
                  onClick={() => {
                    // hook up to Razorpay flow later
                    alert(
                      plan.price === "₹0"
                        ? "Free pack activated!"
                        : `Proceed to buy ${plan.tokens} for ${plan.price}`
                    );
                  }}
                >
                  {plan.price === "₹0" ? "Get Started Free" : "Buy Now"}
                </button>
              </div>

              {/* soft hover glow */}
              <span className="pointer-events-none absolute -z-10 -right-6 -bottom-6 h-28 w-28 rounded-full bg-[#00C4CC]/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
            </article>
          ))}
        </div>

        {/* tiny reassurance */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Prices are one-time packs. Tokens don’t expire.
        </p>
      </div>
    </section>
  );
};

export default PricingPage;
