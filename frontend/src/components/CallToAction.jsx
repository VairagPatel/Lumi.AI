const CallToAction = ({ onNavigate }) => (
  <section className="py-20">
    <div className="container mx-auto px-6">
      <div className="bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-2xl p-12 text-center flex flex-col items-center shadow-md">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A] mb-4">
          Create Your Magical Artwork with LumiAI
        </h2>

        {/* Subtext */}
        <p className="text-lg text-[#0D1B2A]/70 max-w-2xl mb-8">
          Join thousands of creators exploring AI-powered imagination. Transform
          your photos and prompts into breathtaking Ghibli-inspired art — powered
          by LumiAI ✨
        </p>

        {/* Button */}
        <button
          onClick={() => onNavigate("/create")}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white shadow-md hover:scale-105 transition-transform"
        >
          Try LumiAI For Free
        </button>
      </div>
    </div>
  </section>
);

export default CallToAction;
