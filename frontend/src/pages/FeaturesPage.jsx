import { Sparkles, Image, Wand2, Download, Palette, Zap } from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: <Wand2 size={32} />,
      title: "Text to Art",
      description: "Transform your words into stunning Ghibli-inspired artwork. Just describe your vision and watch the magic happen.",
      color: "from-[#00E5A0] to-[#00C4CC]"
    },
    {
      icon: <Image size={32} />,
      title: "Photo to Art",
      description: "Turn your photos into dreamy, painterly masterpieces with our AI-powered transformation engine.",
      color: "from-[#00C4CC] to-[#00E5A0]"
    },
    {
      icon: <Palette size={32} />,
      title: "Multiple Ghibli Styles",
      description: "Choose from various Ghibli-inspired art styles to match your creative vision perfectly.",
      color: "from-[#00E5A0] to-[#3FE3D8]"
    },
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description: "Generate high-quality artwork in seconds. No waiting, just instant creative magic.",
      color: "from-[#3FE3D8] to-[#00C4CC]"
    },
    {
      icon: <Download size={32} />,
      title: "HD Downloads",
      description: "Download your creations in high resolution, perfect for printing or sharing on social media.",
      color: "from-[#00C4CC] to-[#00E5A0]"
    },
    {
      icon: <Sparkles size={32} />,
      title: "AI-Powered Suggestions",
      description: "Get creative prompt suggestions from our AI to help spark your imagination.",
      color: "from-[#00E5A0] to-[#00C4CC]"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/40 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[#0E7490] backdrop-blur mb-6">
            <Sparkles size={14} className="text-[#00C4CC]" />
            Powerful Features
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D1B2A] mb-4">
            Everything You Need to Create{" "}
            <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
              Magical Art
            </span>
          </h1>
          <p className="text-lg text-[#0D1B2A]/70 max-w-2xl mx-auto">
            Discover all the powerful features that make LumiAI the perfect tool for creating stunning Ghibli-inspired artwork.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-md`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0D1B2A] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#0D1B2A]/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-3xl p-12 border border-[#00E5A0]/20">
            <h2 className="text-3xl font-bold text-[#0D1B2A] mb-4">
              Ready to Start Creating?
            </h2>
            <p className="text-[#0D1B2A]/70 mb-8 max-w-xl mx-auto">
              Join thousands of artists and creators who are already using LumiAI to bring their imagination to life.
            </p>
            <a
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <Sparkles size={20} />
              Start Creating Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
