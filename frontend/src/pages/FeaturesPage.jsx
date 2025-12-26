import { Sparkles, Image, Wand2, Download, Palette, Zap, Star, ArrowRight } from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: <Wand2 size={32} />,
      title: "Text to Art",
      description: "Transform your words into stunning Ghibli-inspired artwork. Just describe your vision and watch the magic happen.",
      color: "from-[#00E5A0] to-[#00C4CC]",
      highlight: "Most Popular"
    },
    {
      icon: <Image size={32} />,
      title: "Photo to Art",
      description: "Turn your photos into dreamy, painterly masterpieces with our AI-powered transformation engine.",
      color: "from-[#00C4CC] to-[#00E5A0]",
      highlight: "Editor's Choice"
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
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-[#ECFDF5] to-[#F0F9FF] relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5A0]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C4CC]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}} />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#0D1B2A] shadow-lg mb-8">
            <Sparkles size={16} className="text-[#00C4CC]" />
            Powerful Features
            <div className="w-2 h-2 bg-[#00E5A0] rounded-full animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#0D1B2A] mb-6 leading-tight">
            Everything You Need to Create{" "}
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
              Magical Art
            </span>
          </h1>
          <p className="text-xl text-[#0D1B2A]/70 max-w-3xl mx-auto leading-relaxed">
            Discover all the powerful features that make LumiAI the perfect tool for creating stunning Ghibli-inspired artwork. 
            Experience the future of AI-powered creativity.
          </p>
        </div>

        {/* Enhanced features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 overflow-hidden"
            >
              {/* Highlight badge */}
              {feature.highlight && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {feature.highlight}
                </div>
              )}
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00E5A0]/5 to-[#00C4CC]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-[#0D1B2A] mb-4 group-hover:text-[#00C4CC] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#0D1B2A]/70 leading-relaxed text-lg mb-4">
                  {feature.description}
                </p>
                
                {/* Learn more link */}
                <div className="flex items-center gap-2 text-[#00C4CC] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="relative bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] rounded-3xl p-16 overflow-hidden shadow-2xl">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Start Creating Magic?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of artists and creators who are already using LumiAI to bring their imagination to life. 
                Start your creative journey today - it's completely free!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/create"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white text-[#0D1B2A] shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  Start Creating Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                >
                  View Pricing Plans
                </a>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>15 Free Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
